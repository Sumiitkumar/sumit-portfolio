---
title: "NVIDIA GPU Time-Slicing on Kubernetes: Configuration and Trade-offs"
seoTitle: "NVIDIA GPU Time-Slicing on Kubernetes: Setup and Limits"
description: "NVIDIA time-slicing lets more Pods share a GPU, but replicas are not reserved compute or isolated memory. Here is how to test it."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Scheduling
tags:
  - Kubernetes
  - NVIDIA
  - Time-slicing
  - GPUs
draft: false
---

NVIDIA's device plugin can advertise extra GPU replicas so Kubernetes can schedule more workloads than there are physical GPUs. Those workloads then share access to the same device through time-slicing.

That can be useful for bursty development jobs and small inference workloads. But a replica is not a hardware partition: time-slicing does not provide MIG's memory isolation, and the replica count does not promise each workload a fixed share of compute.

## Configure the sharing model carefully

Time-slicing is commonly configured with a ConfigMap referenced by the device-plugin deployment or GPU Operator. The fields and resource names depend on the release and installation method. Use the guide for your version, then confirm the plugin loaded the configuration you intended.

A conceptual example of a resource configuration is:

```yaml
sharing:
  timeSlicing:
    resources:
      - name: nvidia.com/gpu
        replicas: 4
```

This snippet shows the general shape only; it is not a complete, drop-in ConfigMap. Check the API, ConfigMap name, plugin arguments, and resource names for your installation before applying a change.

## What replicas mean

If the plugin advertises four replicas for a GPU, Kubernetes can place several consumers on it. The scheduler counts those resource units; it does not measure live utilization, free device memory, or application latency. Four replicas do not mean each workload gets 25% of the compute.

Containers may see the same physical device and compete for its memory. One workload can use enough memory to disrupt another, even though both Pods scheduled successfully. Avoid ordinary time-slicing when tenants need a hard isolation boundary.

## Verify before increasing sharing

After changing the configuration, check the node's allocatable resources and try a small workload:

```bash
kubectl describe node gpu-worker-01
kubectl describe pod <test-pod>
kubectl exec <test-pod> -- nvidia-smi
```

Watch utilization, device memory, errors, and application latency with your GPU telemetry. Increase replica counts slowly and test with realistic concurrency. One idle Pod will not tell you how the device behaves under contention.

## Choose the right workload

Time-slicing can work for trusted, low-intensity jobs that can tolerate variable performance. For stronger memory isolation or predictable performance, use dedicated devices or MIG. Whichever option you choose, tell users what it guarantees; a time-sliced replica is not a dedicated virtual GPU.

For a side-by-side decision guide, compare [whole GPUs, MIG, time-slicing, and HAMi](/blogs/gpu-scheduling-strategies-compared/). Also review [shared-GPU memory and compute contention](/blogs/gpu-memory-and-compute-contention/) before increasing replica counts.

## How the sharing model works

Kubernetes does not schedule directly against live GPU utilization. It accounts for the extended-resource units published by the device plugin, and the plugin's sharing configuration determines how many units it makes available. With time-slicing enabled, multiple containers can be granted access to a physical GPU. The GPU performs work from those processes over time, but the scheduler does not promise a fixed percentage of execution capacity to each replica.

This distinction matters when describing capacity. Four advertised units do not mean four virtual GPUs with fixed compute, nor do they necessarily mean four workloads will each receive one quarter of device memory. They are scheduling tokens defined by the plugin's sharing policy. A Pod can be admitted while the device is busy, and its actual throughput can vary as other workloads use the same GPU. The sharing configuration therefore changes admission capacity, not the physical amount of compute installed in the server.

Time-slicing is different from hardware partitioning. MIG-capable devices can expose partitions with dedicated portions of compute and memory, subject to supported GPU models and profiles. Ordinary time-slicing does not provide equivalent hardware memory isolation. A workload that consumes all available memory can cause other workloads to fail, even if Kubernetes has scheduled each according to its declared resource. Consult NVIDIA's documentation for the exact behavior of the driver, plugin, and GPU Operator version in use.

## Check prerequisites and ownership

Before enabling sharing, determine which component owns device-plugin configuration. A GPU Operator installation may manage the plugin and its ConfigMap; a standalone deployment may use a different mount, argument, or restart mechanism. Avoid applying an example from a different installation path. Confirm the NVIDIA driver and container toolkit work for a normal exclusive GPU workload first; sharing adds an admission policy and should not be used to mask a broken device path.

Inventory the node models and determine whether the chosen plugin release supports the desired sharing behavior on them. If different node groups need different policies, separate them with deliberate configuration and labels rather than applying one global setting indiscriminately. Record the existing resource quantity and the intended change. Pin the plugin or operator version and review its release notes for configuration schema changes before editing production values.

Access to shared devices also requires a policy decision. Time-slicing does not make mutually untrusted workloads safe to co-locate merely because the plugin exposes separate replicas. Use dedicated hardware or an isolation mechanism appropriate to the threat and reliability requirements. For trusted workloads, still decide which namespaces can use the pool and how teams share capacity. Kubernetes quotas can limit requests, but do not reserve a fixed fraction of GPU compute.

## Configure and verify the resource

The plugin's shared-access documentation describes the applicable ConfigMap structure and how to reference it from the deployment. The exact setting and accepted names are version-dependent. A conceptual fragment may look like this:

```yaml
sharing:
  timeSlicing:
    resources:
      - name: nvidia.com/gpu
        replicas: 4
```

This fragment is illustrative, not a full configuration file. Use the complete schema and resource mapping for the installed release, preserve other required plugin settings, and avoid editing an operator-managed object that will be reverted by reconciliation. Validate rendered manifests before applying them. Confirm how the change is rolled out; some installations need the plugin Pod to restart or the operator to reconcile before node accounting changes.

After rollout, compare `Capacity` and `Allocatable` on the intended nodes with the values from before the change. Verify the plugin Pod on each node loaded the expected ConfigMap, and inspect its logs for parsing errors or fallback behavior. Check that a node outside the shared pool did not acquire the new resource count. If the count is unchanged, inspect the configuration reference and rollout state rather than increasing replicas repeatedly.

Use a manifest that requests the resource actually advertised by that node. Extended-resource names and sharing behavior depend on plugin configuration; do not assume the same key is used for exclusive and shared workloads without checking. The scheduler will place requests according to its resource accounting and normal placement constraints, not according to live memory pressure.

## Test scheduling and contention

Begin with one small test Pod and verify its assigned node, events, and device visibility. Run a minimal GPU operation, then compare the Pod's behavior with a baseline exclusive workload if available. A device query can show that a GPU is visible, but does not establish a compute reservation or memory limit. Record actual throughput and latency for the application you intend to support.

Next, run controlled concurrent tests. Use two or more representative workloads at low, medium, and expected peak demand. Track throughput and tail latency for each, GPU utilization, memory consumption, device errors, and any out-of-memory events. Check whether workloads interfere with one another and whether one workload can monopolize memory or create unacceptable latency for another. Do not run destructive stress tests on a production GPU that already hosts tenant jobs.

Test what happens when resources are exhausted. Submit an additional request after the configured advertised units are occupied and confirm it remains Pending with a useful event. Then remove one test Pod and verify the waiting workload can be scheduled. This validates the scheduler's capacity view and provides an operational signal, while the performance tests validate what happens after admission. Both are necessary: a schedulable Pod is not necessarily a workload with acceptable service.

Measure over representative periods rather than extrapolating from a short idle test. Inference traffic often has bursts, and background training may have long compute phases. Capture queue depth and application-level response times along with GPU metrics. Device utilization alone does not tell whether the workload met its service objective or whether memory pressure caused retries.

## Select workloads that tolerate sharing

Time-slicing is often considered for development, experimentation, or modest inference where a flexible throughput profile is acceptable. It can improve access when each workload uses a GPU intermittently, but the benefit depends on workload mix and contention. For predictable batch completion times, strict inference latency, or large memory footprints, a shared schedule may be a poor fit. Use actual concurrency tests to classify workloads rather than relying on broad labels such as “small model.”

A useful admission policy separates workload classes:

| Workload property | Consideration |
| --- | --- |
| Bursty or intermittent usage | Sharing may improve utilization if queues and latency remain acceptable |
| Large or unpredictable VRAM use | Higher risk of memory contention and cross-workload disruption |
| Hard latency objective | Validate tail latency under realistic concurrent load; dedicated capacity may be preferable |
| Strong tenant boundary | Do not treat time-slicing as hardware memory isolation |
| Repeatable throughput requirement | Compare against a dedicated baseline and document variability |

The table guides evaluation; it does not replace testing against the actual model, framework, and driver. A workload can be low utilization on average but still use most of the GPU memory or require burst compute at a critical time.

## Monitor and set guardrails

Monitor each physical GPU as well as workload-level indicators. Useful signals include utilization, memory use, temperature and power conditions, GPU errors, Pod placement, pending requests, application throughput, and latency percentiles. Where telemetry cannot distinguish individual containers, combine device metrics with application metrics and Pod-to-node inventory. Alert on service objectives and device health rather than a single arbitrary utilization threshold.

Set limits for how much shared capacity is exposed per node, and use namespace quotas or admission controls to prevent uncontrolled request growth. Quotas govern resource units, not a guaranteed share of physical compute. Reserve capacity for system components and critical services using separate nodes or explicit scheduling policy when needed. Make overcommit semantics clear in documentation: more Pods may be admitted, while actual throughput remains subject to contention.

When performance degrades, correlate the time with co-located Pod changes, memory trends, plugin health, and recent application rollouts. Avoid increasing the replica count as a reflex; that increases the number of admitted consumers but does not increase physical compute or memory. A safer response may be to stop new admissions, move critical workloads to dedicated nodes, or reduce concurrency after coordination with the application owners.

## Troubleshoot and upgrade safely

If a Pod is Pending, first compare its resource request with the node's allocatable resource and inspect events, affinity, taints, and quota. A shared configuration can advertise replicas only on the nodes where it was loaded. If the Pod is assigned but the device is unavailable inside its container, investigate plugin/runtime injection and image compatibility. If it runs but suffers unexpected slowdowns, inspect co-tenant load and application metrics before changing scheduling settings.

When an out-of-memory event or device error occurs, identify all Pods using that physical GPU and preserve relevant logs and telemetry. A restart can clear useful evidence and affect other tenants. Follow the cluster's incident process, communicate whether the issue is device-wide or isolated to one workload, and move workloads only with awareness of capacity on the destination nodes.

Upgrade on a canary node pool. Render the new configuration, apply it using the owning deployment mechanism, and confirm the advertised resource count and plugin health. Run one placement test and a controlled concurrency test, then compare application metrics with the previous version. Ensure the rollback configuration uses a schema accepted by the prior version. Avoid changing driver, plugin, and sharing policy simultaneously unless a coordinated compatibility update requires it; separating changes makes regressions easier to locate.

The right success criterion is not the highest replica count. It is a useful increase in supported workload density without violating memory safety expectations, service objectives, or the boundary users believe they have.

## Further reading

- [NVIDIA Kubernetes device plugin: shared access and time-slicing](https://github.com/NVIDIA/k8s-device-plugin#shared-access-to-gpus)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

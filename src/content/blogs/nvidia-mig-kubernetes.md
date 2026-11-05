---
title: "NVIDIA MIG on Kubernetes: Pick a GPU Profile Without Guessing"
seoTitle: "NVIDIA MIG on Kubernetes: Profiles and Scheduling"
description: "See how NVIDIA MIG profiles become Kubernetes resources, what hardware and workload fit to check, and how to plan layout changes."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Scheduling
tags:
  - Kubernetes
  - NVIDIA
  - MIG
  - GPUs
draft: false
---

MIG splits some NVIDIA GPUs into hardware-isolated instances. Each instance has a defined amount of GPU compute and memory, so smaller workloads can use a partition instead of competing for the whole device. That isolation is a key difference from ordinary time-slicing.

Not every GPU supports MIG, and the available profiles depend on the hardware and software stack.

## How MIG appears to Kubernetes

Kubernetes only sees the MIG resources exposed by the node's current mode and device-plugin configuration. You may see profile-specific names such as `nvidia.com/mig-<profile>`, but the exact key depends on your cluster. Check the node instead of guessing:

```bash
kubectl describe node gpu-worker-01
```

The NVIDIA device plugin and GPU Operator support different ways to expose MIG devices. A mixed strategy can advertise several profile resources; a single strategy may expose them under a more uniform name. Find out which strategy the node uses before writing a manifest.

## Request a matching profile

After confirming the resource name, request it in the Pod:

```yaml
resources:
  limits:
    <mig-resource-advertised-by-the-node>: 1
```

Use the exact key your cluster advertises. A Pod will stay Pending if no eligible node has that profile free—even when another MIG profile is sitting idle.

## Profile planning matters

Each GPU layout offers a finite set of instances. A node filled with small profiles cannot necessarily satisfy a request for a larger one. Choose a layout based on measured memory and compute needs, and avoid frequent changes to production nodes.

Changing MIG mode or geometry may require reconfiguring the GPU and interrupting workloads. Follow the procedures for your hardware and GPU Operator; a profile change is not an ordinary Pod rollout.

## Debug a Pending MIG Pod

Start with scheduler events and node resources:

```bash
kubectl describe pod <pod-name>
kubectl get nodes -o wide
kubectl describe node <gpu-node>
```

Check that:

- The requested MIG resource key exactly matches an allocatable node resource.
- At least one eligible node has an unallocated instance of that profile.
- Node selectors, affinity, taints, and tolerations do not exclude every MIG node.
- The device plugin and GPU Operator report healthy devices.

MIG is useful when a supported workload fits an available profile and needs hardware partitioning. It is less flexible than time-slicing if the workload does not fit those profiles. Benchmark representative jobs and plan capacity before settling on a layout.

Compare MIG with [NVIDIA time-slicing](/blogs/nvidia-gpu-time-slicing/) and other [Kubernetes GPU scheduling strategies](/blogs/gpu-scheduling-strategies-compared/) before choosing a sharing model.

## What a MIG instance represents

Multi-Instance GPU (MIG) divides a supported physical GPU into instances with hardware-defined portions of compute and memory. Each instance is a distinct allocation unit exposed through NVIDIA's software stack. This can provide stronger separation between workloads than ordinary time-slicing, where processes share a device without the same partitioned memory and compute resources. The available profiles and isolation properties depend on GPU generation, driver, firmware, and software configuration; verify them against NVIDIA's documentation.

MIG is not a general-purpose way to create an arbitrary virtual GPU. Profiles come in a supported set and consume a specific portion of the physical device. A workload that needs more memory than the largest available instance cannot fit simply because there are several smaller instances free. Likewise, a workload may fit its memory budget but not achieve the throughput it needs from a smaller compute slice. Measure both resource dimensions and application behavior.

The boundary is also not a complete security model for every threat. Understand vendor-documented isolation guarantees and other shared host components, and continue to apply normal container and cluster security controls. Do not describe a MIG profile as a dedicated physical card; it remains an instance of a shared device with the limits and trade-offs of its profile.

## Choose a node strategy and resource names

Kubernetes sees only what the device plugin publishes. The NVIDIA device plugin and GPU Operator offer configuration strategies for representing MIG devices, and the resulting resource names depend on that strategy. A mixed strategy can expose profile-specific resource keys; a single strategy can present devices in a more uniform way. The exact names and behavior are version-dependent. Inspect node capacity and allocatable, plugin configuration, and operator status before creating workloads.

In a profile-specific configuration, an example resource might resemble `nvidia.com/mig-<profile>`. Treat that text as a pattern, not a universal key. Copy the actual name from the node and use one unit for one matching MIG resource:

```yaml
resources:
  limits:
    <mig-resource-advertised-by-the-node>: 1
```

The standard Kubernetes scheduler matches the request to an available resource unit; it does not reinterpret a different profile as equivalent. A Pod requesting a profile that no node advertises can stay Pending while other profile resources are idle. Node affinity and labels should select compatible pools when multiple GPU types or MIG strategies are present.

Plan how node pools are managed. Some clusters assign a consistent layout to every GPU of a particular type; others have workloads that need different profiles. Mixing incompatible assumptions within one pool complicates resource requests, capacity reporting, and support. Stable labels can distinguish the hardware class or layout, but labels are only as trustworthy as the automation maintaining them.

## Plan profiles from workload evidence

Begin by measuring the workload's peak GPU memory use, compute demand, concurrency, and latency or throughput objective. Include startup and model-loading phases, not only steady state. A profile that fits the average memory requirement may fail at peak due to temporary buffers, framework allocator behavior, or a larger batch. Leave headroom and test the actual image, driver, and model version.

MIG layouts have finite geometry. A configuration that fits several small instances may not also fit a larger profile. Think of the physical GPU as a set of compatible layouts, not an unlimited inventory of independent resource fragments. Model expected workload demand as a small set of classes—such as inference size or batch category—and estimate how each layout serves the mix. Include likely bursts and maintenance capacity rather than packing every device to its theoretical maximum.

For example, if a team runs both small inference replicas and periodic larger training tasks, decide whether the larger task needs its own node pool or whether a layout change during a maintenance window is acceptable. Do not assume a cluster scheduler can combine unused fragments into a larger instance. If a specific profile is unavailable, the workload must wait for that profile or be reconfigured to use a supported alternative.

Use a benchmark matrix to compare candidate profiles. Record startup time, memory use, throughput, latency percentiles, and device utilization under the concurrency expected in production. A smaller profile may offer better aggregate throughput for independent requests, while a larger profile may be necessary for a model that cannot fit elsewhere. Select for the service objective, not simply the highest utilization percentage.

## Apply a MIG layout as an infrastructure change

Changing MIG mode or instance geometry is not equivalent to changing a Pod request. The operation can require GPU reconfiguration and may disrupt workloads on the affected device; the exact procedure and whether a reset is required depend on hardware and software state. Follow the supported GPU Operator and NVIDIA workflow for your environment. Do not improvise commands on a node that may be hosting active tenants.

Use a maintenance plan:

1. Identify the affected nodes, GPUs, current layout, and workloads using them.
2. Drain or otherwise protect workloads according to the cluster's availability requirements.
3. Apply the documented configuration through the component that owns the node's MIG state.
4. Wait for the operator and device plugin to reconcile, then inspect device health and advertised resources.
5. Run a controlled test Pod for each required profile before returning the node to service.

Not every environment should use Kubernetes drain in the same way, and a drain alone does not prove that hardware reconfiguration is safe. Confirm how the operator handles workloads and whether it can manage MIG changes dynamically for the chosen GPU. For a change that requires a maintenance window, communicate the expected capacity loss and reserve alternative capacity before starting.

After a layout change, compare node resources with the expected profile inventory. Check plugin and operator events, and ensure the labels describing the node are updated in the same rollout. A successful configuration command is not sufficient if kubelet has not yet registered the new resources.

## Validate a workload end to end

Use an image that is compatible with the host driver and the framework's CUDA runtime. Request exactly the resource key advertised by the target node and include any required placement selector. Inspect the Pod's events and node assignment, then check device visibility inside the container. Finally, run the real application initialization path and verify it uses the intended instance and fits its memory envelope.

The device query inside a container may display MIG device identifiers differently from a host-level inventory. Avoid assuming that the host's physical GPU numbering will match the container's visible numbering. Match stable identifiers and profile information using the documented tools and plugin behavior. Record the result with the node layout and software versions, which helps distinguish a workload regression from a resource-registration change.

Test both saturation and recovery in a staging pool. When all instances of a profile are allocated, an additional Pod should remain pending with events that identify the shortage. When an allocation is released, verify that a waiting Pod can schedule. Run representative concurrent workloads to confirm performance and memory behavior. A single Pod that initializes successfully only proves the basic allocation path.

## Troubleshoot Pending and unhealthy MIG workloads

For a Pending Pod, confirm the resource key exactly matches an allocatable node resource. Check whether any node with that profile is both free and eligible after node selectors, affinity, taints, tolerations, quota, and CPU or memory requests are considered. If an alternate profile appears free, it will not satisfy the request unless the workload explicitly requests that profile.

If the node advertises no MIG resources, inspect the configured strategy, MIG state, plugin logs, operator reconciliation, and device health. Confirm that the hardware supports MIG and that the driver and GPU Operator versions are compatible. Compare the expected layout with the actual one on the host using NVIDIA's documented management tools. Do not edit the Pod request to a guessed key as a substitute for understanding why registration failed.

If a Pod schedules but cannot use its GPU, check runtime integration, device injection, permissions, and container/driver compatibility. If the application starts but runs poorly or runs out of memory, verify the allocated profile rather than assuming the scheduler delivered the expected device. Compare peak memory use and batch size with profile limits, and check application telemetry and device errors.

For a device-health issue, preserve plugin logs, operator status, node events, and relevant telemetry before restarting components or changing the geometry. Determine whether the issue affects one instance, the physical GPU, or the node. Moving workloads to a different profile can change performance and may not be a valid substitute for restoring the original service level.

## Manage capacity, upgrades, and fallbacks

Advertised MIG instances are configured resource units, not a guarantee of workload throughput. Track pending requests by profile, instance utilization, application latency, and node availability. Fragmentation matters: spare capacity spread across small profiles may not serve a larger request. Use demand history to decide whether to rebalance layouts and account for disruption.

Keep MIG node pools separate from conventional full-GPU or time-sliced pools when their resource models differ. Quotas can limit profile-specific requests but do not ensure that a matching profile is free. Provide clear workload guidance so teams request the smallest profile demonstrated to meet their needs, while retaining headroom for peaks. Avoid a policy that silently changes a request to a smaller profile; a workload may run but violate its performance objective.

Test GPU Operator, device-plugin, and driver updates on representative hardware. Review changes in MIG strategy, resource naming, profile support, and reconciliation behavior. After an upgrade, verify node resource inventory, run one Pod for each supported profile, and compare an application benchmark. Roll out gradually and keep a known-good operator configuration and layout for rollback.

MIG is a useful choice when a workload fits an available hardware profile and benefits from partitioning. Dedicated GPUs can be simpler when a job needs the whole device, while time-slicing may fit trusted workloads that tolerate contention and do not require MIG-style memory separation. Evaluate the workload, isolation needs, capacity shape, and operational cost together before standardizing a pool.

## Further reading

- [NVIDIA GPU Operator: MIG](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-mig.html)
- [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

---
title: "Kubernetes GPU Sharing Compared: Whole GPUs, MIG, Time-Slicing, and HAMi"
seoTitle: "Kubernetes GPU Scheduling: Whole GPU vs MIG vs Time-Slicing vs HAMi"
description: "Whole GPUs, MIG, time-slicing, or HAMi? Compare what each option actually gives a Kubernetes workload."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Scheduling
tags:
  - Kubernetes
  - GPUs
  - MIG
  - HAMi
draft: false
---

Choosing how to share GPUs is a trade-off, not a one-size-fits-all decision. A whole GPU is simple to reason about. MIG partitions supported hardware. Time-slicing lets several workloads use one device, while systems such as HAMi bring their own scheduling and sharing behavior. The practical choice depends on workload size, acceptable performance variability, isolation requirements, hardware support, and how much operational complexity the platform team can manage.

The details depend on your hardware and software versions, so check the guarantees of the versions you actually run.

It helps to separate three questions that are often conflated: what unit Kubernetes schedules, what resources the mechanism isolates, and what service level the workload actually needs. An integer request describes the first question. It does not automatically answer the other two. Before comparing solutions, define whether the workload needs a dedicated accelerator, a hardware-bounded partition, opportunistic access, or a software-enforced sharing model.

## Compare the mechanisms by their guarantees

| Model | Typical scheduling unit | Isolation expectation | Common fit |
| --- | --- | --- | --- |
| Whole device | One physical GPU | Strongest operational separation among these choices, but not a full security boundary by itself | Large or sensitive workloads |
| MIG | A supported hardware instance/profile | Hardware partitioning of supported resources | Predictable smaller workloads |
| Time-slicing | A plugin-advertised replica | Shared device; no fixed compute share or ordinary memory boundary | Bursty, tolerant workloads |
| HAMi or another manager | Product-specific unit | Depends on implementation and configuration | Environments needing its supported controls |

This table is a starting point, not a guarantee matrix. Specific GPU generations and software releases affect available features. Read product documentation for the exact mode, verify the resource name nodes advertise, and test the behavior you depend on.

## Whole-device allocation

The device plugin advertises each GPU as a resource, and a Pod requests one or more of them. Ownership is easy to understand, but small jobs may leave much of a device unused. This mode is a useful baseline for performance tests because it removes some ambiguity about which workloads share a card.

“Dedicated” should still be stated carefully. It means the allocation system assigns the device to a workload or Pod according to its policy; it does not automatically guarantee protection from every other process on the node, a particular driver/runtime combination, or a certain level of end-to-end performance. Node administration and security controls remain important. A whole-GPU allocation also does not reserve CPU, host memory, network bandwidth, storage throughput, or other devices unless those resources are separately requested and managed.

Whole-device scheduling is usually easiest when jobs are large enough to use most of a device or when operational simplicity and performance predictability matter more than packing density. For small inference models, interactive notebooks, or brief development tasks, dedicated devices can produce low utilization and longer queues. The correct comparison includes cost and waiting time, not only utilization.

## NVIDIA MIG

MIG divides supported GPUs into hardware instances with defined compute and memory. It works well when an available profile fits the workload and stronger partitioning matters. Profiles depend on the GPU and node layout; they are not interchangeable or unlimited. MIG can make co-location more predictable than sharing an unpartitioned device, but setup, profile selection, monitoring, and reconfiguration add operational work.

Estimate each workload's sustained and peak memory requirement before choosing a profile. A profile that is too small can cause application failures, while a larger profile may waste capacity. The hardware's supported profile combinations constrain how instances fit together, so aggregate free memory does not necessarily mean a requested profile can be created on demand. Some deployments configure MIG layout on nodes and advertise each profile as an extended resource; Kubernetes then schedules those units just as it schedules other extended resources.

MIG is not available on every GPU, and capabilities depend on product generation and configuration. It may also be the wrong fit when jobs need more memory or compute than an instance provides, when the desired profile mix fragments capacity, or when reconfiguring layouts is operationally disruptive. Validate actual application performance on the target profile rather than assuming a fraction of a whole device's benchmark will scale linearly.

## NVIDIA time-slicing

Time-slicing lets the plugin advertise more schedulable replicas than there are physical devices. That can suit trusted, bursty jobs, but a replica is not a reserved slice of compute or a memory-isolation boundary. It can improve packing when jobs are often idle or short, yet performance may vary with the number and behavior of processes using the same GPU.

The replica count is an overcommit policy. Increasing it allows more Pods to be placed, not more physical capacity to be created. Before enabling a high ratio, test representative concurrency and establish limits for latency, throughput, and memory pressure. A workload that fits alone can fail when another process allocates device memory. Monitor application outcomes and GPU telemetry, and provide a way to move critical workloads to dedicated or partitioned capacity.

Time-slicing can be easy to try when supported by the installed device plugin, but check whether the configuration applies per GPU or per node, how replicas are advertised, and what restarting or updating the plugin does to running workloads. Document the version and configuration so a later operator upgrade does not silently change the meaning of resource counts.

## HAMi and other sharing schedulers

HAMi provides a scheduler-integrated sharing model for supported devices. Resource names and enforcement depend on the release and plugin configuration. Test the behavior you need against the version-specific documentation and real workloads; do not assume it matches MIG or NVIDIA time-slicing. Similar caution applies to any third-party or vendor-specific scheduler and sharing layer.

Evaluate the control plane and runtime behavior separately. Find out which resources the scheduler tracks, whether limits are admission or runtime-enforced, which hardware and drivers are supported, and what happens when the component is unavailable. Determine how it interacts with the default Kubernetes scheduler, device plugin, autoscaler, quotas, and node labels. Understand the upgrade and rollback path before adopting it for a critical workload.

Do not treat a configured memory or compute cap as equivalent to hardware partitioning without validating its enforcement and failure modes. If a workload exceeds a software-defined limit, determine whether it is throttled, rejected, terminated, or allowed to exceed the target. A test on one GPU model or software version does not prove identical behavior across all supported platforms.

## A practical selection process

For each workload, ask:

1. Does it require dedicated performance or a hard isolation boundary?
2. Does its memory footprint fit a supported MIG profile?
3. Can it tolerate variable performance from shared execution?
4. Does the sharing system enforce the compute and memory limits we need?
5. Can the team monitor per-workload outcomes and prevent noisy-neighbor impact?

Try a representative benchmark on a small node pool before opening the option to users. Document whether a resource is dedicated, partitioned, or shared. That distinction matters: a shared scheduling slot should not be described as a dedicated GPU.

Add operational constraints to the decision. What does the cluster team already support? Can it monitor per-device and per-tenant behavior? How are failures handled? Can users specify a hardware profile without knowing implementation-specific details? Is there enough demand to justify maintaining multiple pool types? The most sophisticated mechanism is not automatically best if the organization cannot operate it reliably.

Build a small comparison using identical software, inputs, and workload settings. Record throughput, latency percentiles, memory use, error rates, utilization, and time spent waiting for capacity. Include cold starts and realistic concurrency where they matter. Run each mode long enough to reach steady state, and repeat under a representative load. For training jobs, compare time per step and completion time; for inference, include request latency and queueing rather than just tokens or requests per second.

Then map each workload class to a service tier:

- **Dedicated:** for predictable performance, large jobs, or strict isolation expectations.
- **Partitioned:** for supported hardware where bounded resources and higher density are valuable.
- **Shared/best effort:** for tolerant, bursty, lower-priority work that can absorb variable performance.

The names and guarantees should be explicit in user documentation, quota policy, and dashboards. If a job can move between tiers, describe what changes and whether its resource request or image needs to change.

## Account for scheduling and capacity details

Kubernetes sees the extended resources advertised by the device plugin or sharing system. It does not automatically infer that two resource keys refer to the same physical GPU, nor does it combine incompatible profiles into an arbitrary unit. Check capacity and allocatable resources on every pool, then make sure Pod requests use the right key. Quotas can limit namespace requests, but they do not supply a preferred hardware model, reserve compute percentage, or guarantee a particular runtime memory capacity.

Placement constraints still matter after choosing a sharing mode. Node labels and affinity can select the right GPU generation, while taints and tolerations can reserve an accelerator pool for opted-in workloads. A Pod must also have enough CPU, host memory, storage, and network resources. Consider topology-aware placement for distributed training and verify the actual device assignment after scheduling.

Plan for graceful capacity exhaustion. If a pool is full, a Pod may remain Pending even though another pool has unused accelerators that are not interchangeable or that the Pod cannot select. Decide whether workloads are allowed to fall back to another tier, whether they should queue, and how a user can tell that the constraint is capacity rather than a broken plugin. Avoid silently moving a high-priority job to a weaker isolation mode.

## Revisit the choice as workloads change

Workload characteristics are not static. A model upgrade can increase memory needs; a new request pattern can make an inference service less bursty; batch jobs can arrive in synchronized waves. Re-evaluate sharing ratios and profiles when workload behavior changes, rather than relying indefinitely on an initial benchmark. Keep workload owners involved, because they understand quality and latency requirements that hardware dashboards cannot reveal.

Measure utilization alongside useful work. A GPU at high utilization with stable throughput can be healthy, while low average utilization can hide a latency-critical burst. Review pending time, service outcomes, memory headroom, and noisy-neighbor reports together. If the selected mode repeatedly misses its objectives, adjust placement or isolation rather than merely increasing the advertised count.

## Choose based on workload fit

Start with the strictest requirement, not the most attractive density number. If a workload needs predictable full-device performance and can use the capacity, assign a whole GPU. If it fits a supported MIG profile and benefits from bounded hardware resources, evaluate MIG. If it is bursty, tolerant of variability, and safe to co-locate, test time-slicing or another supported sharing model. Use a third-party manager only after confirming its exact enforcement, support matrix, and operating model.

Then test assumptions in order: hardware support, resource advertisement, scheduling behavior, runtime enforcement, observability, and failure handling. A mechanism that looks good in an isolated benchmark may not be operable when a node is drained, a plugin restarts, a profile is unavailable, or several teams submit jobs at once. Include those normal operational events in design reviews.

## Document the contract users receive

A platform resource is an interface. State whether it is dedicated, partitioned, or shared; which hardware and profiles it may select; whether performance is best-effort; and how memory constraints work. Explain what happens when capacity is full and whether a workload can fall back to another pool. This avoids disputes in which a user assumes that a request named “GPU” means one whole device while the cluster actually advertises a shared replica.

Keep a small representative benchmark and configuration record for each supported class. Rerun it after major driver, operator, device-plugin, scheduler, or model-runtime changes. Include correctness and resource behavior, not just peak throughput: ensure the application can see the intended device, handle the expected memory footprint, and meet its service target under a representative neighbor load. When no option meets the requirements, treat that as a capacity or product-design constraint rather than weakening a guarantee without telling users.

Read the implementation guides for [MIG](/blogs/nvidia-mig-kubernetes/), [time-slicing](/blogs/nvidia-gpu-time-slicing/), and [HAMi](/blogs/hami-gpu-sharing-kubernetes/) to verify the behavior of each option in your environment.

## Further reading

- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)
- [HAMi documentation](https://project-hami.io/docs/)

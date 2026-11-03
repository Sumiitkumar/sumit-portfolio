---
title: "GPU Memory and Compute Contention in Kubernetes"
seoTitle: "Kubernetes GPU Sharing: Memory and Compute Contention"
description: "A shared-GPU Pod can schedule successfully and still run out of device memory or slow down. Here is what to watch."
pubDate: 2026-11-02
author: Sumit Kumar
category: GPU Observability
tags:
  - Kubernetes
  - GPUs
  - Observability
  - Capacity planning
draft: false
---

Getting a Pod scheduled does not mean it has a quiet GPU to itself. Kubernetes places workloads using the resources advertised by the device plugin; it does not usually check live GPU utilization before each placement. Scheduling answers whether the requested resource units can be assigned according to the cluster's current accounting. It does not predict whether the workload will meet a latency objective after it starts.

That difference matters most with time-slicing and other forms of overcommit.

GPU contention can appear as slower inference, longer training steps, variable batch completion, device-memory allocation failures, or noisy performance that comes and goes as neighboring jobs change. CPU throttling, input pipelines, network traffic, storage, and application locks can produce similar symptoms. A useful diagnosis compares workload-level outcomes with GPU telemetry and host-side signals instead of treating a high utilization percentage as proof by itself.

## What “sharing” may mean

The phrase “shared GPU” can describe several different arrangements. A device plugin may expose multiple schedulable replicas for a physical card; multiple processes may use a device without a hardware partition; a device may be split into supported MIG instances; or a vendor-specific manager may apply its own accounting or limits. These arrangements have different isolation properties. Confirm what the plugin advertises and enforces before interpreting a resource request as a percentage or a promise.

Inspect the configured sharing mode, advertised resource names, and node allocatable quantities. Read the version-specific plugin or operator documentation and keep the configuration alongside your deployment records. A Pod requesting one unit could receive an entire device, a hardware partition, or one shared scheduling slot. The integer resource value alone does not explain its performance guarantee.

## Compute sharing is not a fixed percentage

With time-slicing, processes take turns using the GPU. How much work each gets depends on the workload, memory bandwidth, synchronization, kernel duration, and what else is running. A replica count tells Kubernetes how many workloads it may place; it does not reserve an equal share of compute for each one. Nor does a request for one replica usually imply a particular percentage of SMs, a minimum throughput, or a deadline guarantee.

Two workloads can interfere even if their average GPU utilization looks moderate. One may issue long kernels, use memory bandwidth intensively, or create bursts that overlap another application's latency-sensitive work. Conversely, high utilization can be perfectly acceptable for offline training if throughput remains within its target. The right signal is whether the service objective has degraded, not whether the dashboard crossed an arbitrary utilization threshold.

Time-slicing is most appropriate when workloads can tolerate variable performance and the operational model permits shared access. If strict latency isolation is a requirement, a scheduling replica should not be presented as a substitute for dedicated capacity or a supported hardware partition.

## Device memory can be the limiting resource

GPU memory is separate from the host memory Kubernetes reports for a Pod. Kubernetes CPU and memory requests/limits do not automatically cap a process's device-memory allocations. Two workloads can both start and later compete for device memory; one may fail when their combined allocations exceed what is available. Do not assume ordinary time-slicing puts a memory boundary around each workload. Check what your specific product and configuration actually enforce.

An application that gradually increases its model size, batch size, context length, or concurrent requests can consume more device memory than a brief smoke test. Framework allocators may reserve memory for reuse, and reported “used” memory can include cached allocations; interpret it alongside application behavior. A device-memory out-of-memory error may be local to a process, while the host can still have plentiful RAM. Restarting a Pod may temporarily clear allocations but does not solve a capacity mismatch if the same workload pattern returns.

On supported GPUs, MIG partitions compute and memory in hardware. The available profiles, placement rules, and reconfiguration constraints vary by model and setup. A partition can make capacity and isolation more predictable, but it may not fit every workload and can leave unusable fragments if profile choices are poorly matched to demand. Assigning a whole device is simpler to reason about and gives one workload the device, although it can underutilize hardware for small jobs. Pick based on the isolation and performance required, not just an average utilization number.

## Monitor workload outcomes and GPU telemetry

Use NVIDIA DCGM Exporter or another supported telemetry source for utilization, memory, temperature, power, and device errors. Metric availability and labeling vary by exporter version and platform. Confirm whether metrics are per physical GPU, MIG instance, process, or node before attributing a value to a tenant. Compare those signals with what users see:

- Request latency and throughput.
- Batch size and queue depth.
- Out-of-memory errors and process restarts.
- Per-tenant or per-namespace consumption.
- CPU throttling, node memory pressure, and network or storage saturation.

`nvidia-smi` is handy for a quick snapshot of a node, but it is not a historical record or a complete Kubernetes attribution system. During an incident, time-series data makes it much easier to see when contention started and what changed. Align application timestamps with node metrics, deployments, Pod placement, and workload arrivals. If several Pods share a device, device-level utilization alone may not tell you which one caused the pressure.

Instrument the application with measures that represent user experience: request duration percentiles, queue age, throughput, retries, and error rates. For training, record step time, examples per second, accelerator memory, and data-loader wait time. A GPU that is lightly used while CPU workers are saturated points toward a different remedy than a device fully occupied with rising tail latency.

Use labels and dashboards consistently, but avoid putting sensitive workload metadata into metric labels with unbounded cardinality. A small, stable set of team, workload, and pool labels is generally easier to operate than per-request or per-container identifiers. Preserve enough detail for diagnosis while keeping monitoring storage and query costs manageable.

## A safe capacity experiment

Start with one representative workload and record its throughput, tail latency, and memory use. Include the normal range of model sizes, batch sizes, input lengths, and concurrency; a tiny synthetic request can miss peak allocation behavior. Add concurrent workloads gradually, using realistic inputs and peak traffic patterns. Change only one variable at a time, such as replica count or number of concurrent jobs, so the result remains interpretable.

Before testing, define a stop condition: an error-rate limit, maximum p95 or p99 latency, minimum throughput, memory headroom, or node-health threshold. Run for long enough to include warm-up, steady-state load, and likely bursts, and repeat the experiment when the cluster has representative background activity. Record the hardware, driver, runtime, plugin configuration, and software versions; results from one GPU model or framework release may not generalize to another.

Treat a load test as a capacity estimate rather than proof of a universal safe ratio. Production arrival patterns change, jobs can peak simultaneously, and new models can have different memory footprints. Roll out a tested sharing factor gradually, monitor outcomes, and keep a way to reduce concurrency or move critical workloads back to dedicated capacity.

If workloads need performance isolation, use dedicated devices or supported MIG instances where appropriate. Quotas and capacity controls can limit who gets scheduled; they cannot add hardware isolation to a sharing mode that does not provide it. For multi-tenant clusters, define a service tier for each type of resource: dedicated, hardware-partitioned, or shared and best-effort. Describe the expected variability to users before they deploy.

When investigating a regression, compare the affected Pod with an equivalent run on an isolated device if practical. If both are slow, investigate model/runtime changes, input pipeline, and application behavior. If only shared placement is affected and GPU contention rises at the same time, reduce co-location or move the critical job to a stronger isolation mode. If changing placement does not change results, avoid blaming sharing prematurely.

## Distinguish device contention from other bottlenecks

GPU workloads are pipelines. Data must be read, transformed, moved to the accelerator, processed, and returned or written out. A GPU can appear underutilized because storage is slow, network reads are delayed, CPU preprocessing is saturated, or a framework is waiting on synchronization. Those symptoms can be mistaken for a neighbor consuming compute. Conversely, an overloaded GPU may show up first as longer queues or application latency rather than a continuously high utilization graph.

Build a timeline around the slowdown. Compare application latency and throughput with device utilization, memory usage, temperature or clock behavior, CPU and memory pressure, and network or storage indicators. Check which Pods were placed on the same node or device during the affected interval, whether a rollout changed batch sizes, and whether the workload mix shifted. If the problem follows a particular model version wherever it runs, investigate the application before changing the sharing policy.

Be cautious with averages. A five-minute average can smooth away brief bursts that create tail-latency spikes, while a single utilization sample cannot establish sustained contention. Use appropriate scrape intervals and percentile measures for the service objective. Ensure clocks are synchronized across application and monitoring systems so the workload and node timelines can be compared accurately.

For framework-level diagnosis, record the workload's configuration that drives memory and compute use: model/checkpoint, input or sequence length, batch size, precision mode, worker count, and concurrency. The same application image can have very different GPU footprints across these settings. A repeatable baseline should record them along with driver, runtime, device model, and sharing configuration.

## Use guardrails for shared capacity

Start by defining which workloads may share. Development notebooks and interruptible batch jobs often tolerate variable performance better than interactive inference serving or deadline-bound training. A cluster can expose separate node pools or resource classes so that a user opts into best-effort shared capacity instead of receiving it unexpectedly. Use quota and admission rules to constrain concurrency to tested levels, while explaining that those controls regulate scheduling and do not provide isolation.

Set operational guardrails that match your risks. Examples include a maximum number of concurrent replicas on a pool, a minimum memory headroom for sensitive workloads, and a service-level threshold that triggers moving traffic or jobs to dedicated capacity. Keep a rollback path: reduce the replica count, cordon a pool for new placements, or shift priority workloads to a dedicated pool according to your established procedure. Ensure the action does not evict critical workloads unexpectedly.

Capacity reviews should include peak demand, not just average use. Several scheduled training jobs may all enter their memory-intensive phase together, and a deployment surge can temporarily increase inference replicas. Model the scheduled demand against available nodes and expected co-location. A pool that has spare average compute but no memory headroom can still be an unsafe place to add more workloads.

Sharing can improve utilization, but it introduces coordination work. A platform team should make the sharing mode visible to users, publish the expected performance characteristics, and provide metrics that support debugging. If the configuration is opaque, workload owners cannot distinguish a code regression from a noisy neighbor and may respond by requesting more resources. Clear service tiers and transparent measurements make capacity decisions better for both platform operators and application teams.

One practical rule is to compare workload outcomes before tuning the pool. If a service stays within its latency and error budgets, rising utilization alone may not require intervention. If its p99 latency or memory failures worsen when a neighbor arrives, reduce co-location or strengthen isolation, then repeat the same workload test. This ties a change to an observable outcome rather than an arbitrary utilization target.

For configuration and trade-offs, see [NVIDIA time-slicing](/blogs/nvidia-gpu-time-slicing/) and the [GPU scheduling strategy comparison](/blogs/gpu-scheduling-strategies-compared/).

## Further reading

- [NVIDIA Kubernetes device plugin: shared access and time-slicing](https://github.com/NVIDIA/k8s-device-plugin#shared-access-to-gpus)
- [NVIDIA DCGM Exporter](https://docs.nvidia.com/datacenter/dcgm/latest/gpu-telemetry/dcgm-exporter.html)
- [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/)

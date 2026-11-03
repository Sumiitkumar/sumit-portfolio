---
title: "Kubernetes GPU Topology-Aware Scheduling for Multi-GPU Workloads"
seoTitle: "Kubernetes GPU Topology-Aware Scheduling for Multi-GPU Jobs"
description: "Requesting multiple GPUs does not guarantee a good device layout. Here is what to check for multi-GPU and distributed jobs."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Scheduling
tags:
  - Kubernetes
  - GPUs
  - Topology
  - Scheduling
draft: false
---

For a small inference job, any compatible GPU may do. Multi-GPU training is less forgiving: the arrangement of devices and the links between them can affect throughput. Requesting several GPUs does not guarantee Kubernetes will pick the layout your application needs.

## Start with the workload's topology needs

First, find out what the workload actually needs:

- Multiple GPUs on the same node.
- A particular GPU model or memory size.
- High-bandwidth links such as NVLink.
- A set of nodes connected by a fast network.
- A specific MIG profile or device layout.

Kubernetes can schedule the resources and topology constraints you declare. It cannot infer an application's communication pattern from its image.

## Label node pools intentionally

If your provisioning system can keep them accurate, use stable labels for GPU model, node pool, and network class. Node selectors or required affinity can then keep a workload on compatible nodes. Taints and tolerations help keep unrelated Pods off specialized hardware.

Labels choose nodes; they cannot tell you how two GPUs inside a node are connected. For intra-node placement, check that your device plugin and GPU Operator support the topology behavior you need, and that the application can see which devices it received.

## Request resources and validate placement

The workload still needs to request the right number and type of GPU resources. Check node capacity, scheduling events, and where the Pod landed:

```bash
kubectl describe pod <training-pod>
kubectl get pod <training-pod> -o wide
kubectl describe node <assigned-node>
```

For distributed jobs, measure the network between nodes and the collective communication performance too. A Pod can be placed successfully and still run slowly if the devices or network do not suit the workload.

## Benchmark the complete path

Run a representative job on one GPU and then on multiple GPUs. Compare end-to-end throughput, scaling, memory use, and communication overhead. Keep topology labels and scheduling rules in version control, and revisit them when hardware or GPU Operator versions change.

For node-level placement constraints, see [GPU node labels, taints, and affinity](/blogs/gpu-node-labels-taints-affinity/). For how GPU resource requests are advertised and assigned, see [Kubernetes GPU device plugins](/blogs/kubernetes-gpu-device-plugin/).

## Why device location changes performance

The phrase “four GPUs” describes quantity, not connectivity. A server may connect accelerators through NVLink, PCI Express switches, CPU root complexes, or a combination. Communication speed and latency differ across these paths. A job that keeps most tensors on one device may be insensitive to layout, while a distributed training job that exchanges gradients every step can spend a substantial fraction of its time moving data. Two runs with identical models and GPU counts can therefore scale differently.

There are several levels of locality to consider. Within a GPU, memory access is local to that accelerator. Between GPUs in one server, links can have different bandwidth and hop counts. CPUs and memory are attached to NUMA domains, so a process can also incur penalties when host-side data, worker threads, or PCIe devices are remote from the CPU socket they use. Across nodes, the network fabric, interface choice, routing, and collective library determine communication behavior. A good multi-GPU plan starts by stating which of these levels matter for the specific workload.

Do not assume that visible device numbering communicates physical proximity. Container runtimes and plugins can expose a subset of devices or reorder their logical IDs. Framework-local device 0 is not necessarily the server's physical GPU 0. Query device properties and topology from inside the allocated environment where possible, and use stable hardware identifiers for diagnostics.

## What Kubernetes can and cannot choose

The default Kubernetes scheduler places Pods on nodes using declared resource requests, labels, affinity, taints, and other scheduling constraints. It accounts for the number of extended GPU resources a node advertises, but a generic request for several GPUs does not necessarily encode a desired NVLink island, PCIe path, or NUMA relationship. A Pod can satisfy its resource request and still receive a topology that performs poorly for its communication pattern.

Topology Manager is a kubelet policy for coordinating topology hints from components such as CPU and device managers. It can influence how CPUs and devices are aligned on a node, depending on the policy, container requests, plugin support, and Kubernetes configuration. It is not a universal cluster-level GPU topology scheduler and does not invent a desired multi-node network layout. Review the Kubernetes version-specific documentation and vendor plugin behavior before relying on a particular policy. A setting that is unavailable or configured differently on one node pool can produce inconsistent outcomes.

GPU Operator and device-plugin capabilities also vary with release and configuration. Some setups can communicate device topology or support particular selection strategies; others may simply advertise counts. Check the installed plugin's supported options and confirm what it reports. Never infer topology-aware allocation solely from the presence of the GPU Operator.

Topology policies can also affect admission. A strict policy may reject a container when components cannot agree on a suitable NUMA alignment; a less strict policy may admit it with a suboptimal alignment. Understand the selected policy's behavior for your Kubernetes release, and check kubelet events when a container is rejected before it starts. Resource requests for CPUs, huge pages, and devices can influence the topology hints available to kubelet, so test the full Pod specification rather than a GPU-only fragment.

## Express requirements at the right level

For inter-node requirements, use stable node labels to distinguish hardware pools, network classes, or regions that the workload can use. Required node affinity is appropriate when a job cannot function outside a class; preferred affinity expresses a preference where fallback is acceptable. Taints and tolerations help reserve specialized nodes, while quotas and admission controls can govern who consumes them. Keep labels synchronized from a provisioning source so the selector remains accurate after node replacement.

For example, a training job that requires a high-speed fabric might select a maintained pool label:

```yaml
spec:
  template:
    spec:
      nodeSelector:
        workload-pool: multi-gpu-fast-network
      containers:
        - name: trainer
          resources:
            limits:
              nvidia.com/gpu: 4
```

This is only a simplified illustration. The resource name must match the node's advertised resource, and a Deployment or Job needs its surrounding fields. A label says something about the node as a whole; it does not guarantee a particular four-GPU arrangement inside the server. If the pool includes different models or topology classes, split it into more precise pools or use a supported topology-aware allocation mechanism.

When an application needs multiple GPUs on one host, design the workload so all devices are allocated in the same Pod and node. A multi-Pod distributed job introduces a different placement problem: replicas need coordination, rendezvous, and often compatible nodes, while the scheduler may make each placement independently unless a gang or batch scheduler coordinates the group. Verify the scheduling framework's semantics for the job type instead of assuming that matching labels create an atomic multi-node reservation.

## Inspect topology and allocation

Build an inventory for each node class. Record GPU model and count, stable IDs, NUMA association, interconnect topology, driver, firmware where relevant, and the network adapter configuration. `nvidia-smi topo -m` on supported NVIDIA systems can show relationships among devices, CPUs, and network interfaces; its output is host-specific and should be collected with the correct privileges. The output helps inform pool labels and benchmark design, but does not itself configure Kubernetes placement.

After a test Pod lands, check the assigned node and inspect the device list inside the container. Compare the devices the application sees with the expected model and topology. If a plugin offers a topology-aware selection option, validate actual allocations over repeated test Pods; do not rely on a single lucky placement. Save the plugin version and configuration with the test record because device ordering or selection behavior may change after upgrades.

For a distributed workload, record the node assigned to every worker and verify network interfaces and routes used by the communication library. It is possible for Pods to be placed on nodes with a nominally fast-network label but use a different interface because of runtime configuration. Check collective-library logs and interface selection, not just Kubernetes node labels.

Also verify that node labels describe current hardware after maintenance. A replaced accelerator, updated NIC, or changed BIOS configuration can invalidate an old assumption while leaving the Pod selectors unchanged. A periodic inventory comparison or admission validation can catch drift before a performance incident.

## Benchmark the communication path

Benchmarking should distinguish compute scaling from communication overhead. Establish a single-GPU baseline, then measure the same representative workload with multiple GPUs on one node, and finally across nodes if that deployment mode matters. Keep model, batch size, precision, data input, framework, and software versions consistent. Record throughput, step time, GPU utilization, memory usage, and communication time when available.

Use a communication microbenchmark only as one piece of evidence. It can reveal a bandwidth or latency difference in links, but it may not predict a production model whose message sizes and synchronization frequency differ. Measure realistic end-to-end steps as well. If the multi-GPU run slows down, inspect whether the job is compute-bound, data-loader-bound, or communication-bound before adding scheduling complexity.

Repeat measurements under controlled load. Other tenants, storage activity, and network congestion can distort results. Compare medians and tail behavior over enough repetitions to distinguish a stable topology effect from noisy runtime variation. Define a threshold that matters to the workload before tuning—for example, a target throughput improvement or a maximum acceptable step-time regression—rather than declaring every faster microbenchmark a production win.

## Debug placement and performance separately

If a Pod is Pending, begin with scheduler events and node resources. A topology constraint may have left no eligible nodes, but the error can also result from GPU count, CPU or memory requirements, quota, taints, or affinity. Inspect the effective Pod after admission because mutating policies may add constraints. For a distributed job, examine all worker Pods: one unschedulable member can prevent the job from becoming useful even if other members are running.

If the workload runs but scales poorly, confirm node and device placement first. Then inspect GPU-to-GPU paths, CPU affinity, NUMA locality, network interface selection, and collective settings. Compare a known-good node pool. A topology issue often shows up as low GPU utilization during communication phases, but that pattern can also arise from data loading or synchronization bugs, so correlate metrics with application traces.

If allocation differs between runs, examine resource availability, plugin strategy, device health, and concurrent Pods. A shared device model or MIG layout may change which units are eligible. Capture the allocated device identities and scheduling events each time. Avoid changing topology labels to encode transient assumptions: labels should represent stable properties, while runtime availability belongs to resource accounting.

## Keep topology policy maintainable

Topology-specific pools can improve predictability, but each pool adds capacity and operational complexity. Make labels describe stable properties, document how they are populated, and alert when a node's actual hardware no longer matches them. When nodes are drained or replaced, verify the label controller runs before scheduling topology-constrained work. A stale label can be more dangerous than no label because it gives users a false guarantee.

Use required constraints only for genuine incompatibilities. If every job requires the smallest, most specialized pool, the pool can become a bottleneck while otherwise suitable GPUs remain idle. Preferred affinity, clear fallback policy, and workload classes can balance performance and availability. For latency-sensitive training, failure to obtain an optimal layout may be preferable to silently running on a layout that misses the job's completion deadline; encode that choice in the workload's policy.

Revisit topology assumptions after driver, plugin, GPU Operator, BIOS, networking, or hardware changes. Re-run the allocation check and representative benchmarks before rolling new nodes into a pool. Keep results with the software versions and node class so operators can distinguish a real regression from different test conditions.

The goal is not to force every Pod into the most complex placement policy. It is to match scheduler constraints to measured communication needs, validate the topology actually allocated, and retain a simpler fallback when performance requirements permit it.

## Further reading

- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes Topology Manager](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)

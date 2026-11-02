---
title: "GPU Topology-Aware Scheduling for Kubernetes Workloads"
seoTitle: "Kubernetes GPU Topology-Aware Scheduling"
description: "Plan GPU placement for multi-GPU and distributed jobs using node selection, device topology, and Kubernetes scheduling constraints."
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

For a small inference Pod, any compatible GPU may be enough. For multi-GPU training or distributed inference, placement and interconnect topology can have a large effect on throughput. A Pod requesting multiple GPU units is not automatically guaranteed the ideal physical arrangement.

## Start with the workload's topology needs

Find out whether the workload requires:

- Multiple GPUs on the same node.
- A particular GPU model or memory size.
- High-bandwidth links such as NVLink.
- A set of nodes connected by a fast network.
- A specific MIG profile or device layout.

Kubernetes can schedule declared resources and supported topology constraints, but it cannot infer application communication needs from the container image.

## Label node pools intentionally

Use stable labels for GPU model, pool, and network class when your provisioning system can maintain them. Then use node selectors or required node affinity to keep workloads on compatible nodes. Taints and tolerations can protect specialized nodes from unrelated Pods.

Labels select nodes, but they do not guarantee that two devices inside one node have a particular hardware connection. For intra-node topology, verify that the device plugin and GPU Operator support the desired topology behavior and that the application can discover the resulting device assignment.

## Request resources and validate placement

A workload must still request the correct number and type of GPU resources. Check node capacity, Pod events, and the chosen node:

```bash
kubectl describe pod <training-pod>
kubectl get pod <training-pod> -o wide
kubectl describe node <assigned-node>
```

For a distributed job, also validate node-to-node network bandwidth and collective communication performance. A valid Kubernetes placement can still perform poorly if the network or device topology is not suitable.

## Benchmark the complete path

Compare one-GPU and multi-GPU runs using representative data. Measure end-to-end throughput, scaling efficiency, memory use, and communication overhead. Keep topology labels and scheduling constraints in version control, and revisit them when hardware or GPU Operator versions change.

For node-level placement constraints, see [GPU node labels, taints, and affinity](/blogs/gpu-node-labels-taints-affinity/). For how GPU resource requests are advertised and assigned, see [Kubernetes GPU device plugins](/blogs/kubernetes-gpu-device-plugin/).

## Further reading

- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes Topology Manager](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)

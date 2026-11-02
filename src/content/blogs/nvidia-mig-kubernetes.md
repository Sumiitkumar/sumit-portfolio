---
title: "NVIDIA MIG on Kubernetes: Profiles, Requests, and Trade-offs"
seoTitle: "NVIDIA MIG on Kubernetes: Profiles & Scheduling"
description: "Learn how Multi-Instance GPU partitions appear as Kubernetes resources and how to plan profiles, requests, and operational changes."
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

NVIDIA Multi-Instance GPU (MIG) partitions supported GPUs into hardware-isolated instances. Instead of competing for one whole device, workloads can be assigned a profile with a defined portion of GPU compute and memory. This makes MIG useful for predictable, smaller workloads that benefit from stronger isolation than ordinary time-slicing.

MIG is not available on every GPU. Supported profiles and maximum layouts depend on the GPU generation, driver, and software stack.

## How MIG appears to Kubernetes

The node's MIG mode and device-plugin configuration determine which resources Kubernetes advertises. A plugin might expose profile-specific resource names such as `nvidia.com/mig-<profile>`, but the exact key is cluster-specific. Inspect actual node resources rather than assuming a profile name:

```bash
kubectl describe node gpu-worker-01
```

The NVIDIA device plugin or GPU Operator can be configured to expose MIG devices in different strategies. With a mixed strategy, several profile resources may appear; with a single strategy, devices may be presented under a more uniform resource name. Confirm the mode before writing workload manifests.

## Request a matching profile

Once you know the advertised resource, request one unit:

```yaml
resources:
  limits:
    <mig-resource-advertised-by-the-node>: 1
```

Replace the placeholder with the exact resource key from your cluster. Pods that request a profile unavailable on eligible nodes remain Pending, even if those nodes have idle MIG capacity in a different profile.

## Profile planning matters

MIG layouts divide a physical GPU into a finite set of supported instances. Choosing a layout is a capacity decision: a node configured with many small instances cannot necessarily satisfy a request for a larger profile. Align profile choices with measured workload memory and compute needs, and avoid changing layouts frequently on production nodes.

Changing MIG mode or geometry can require GPU reconfiguration and may disrupt workloads. Follow the GPU Operator and platform procedures for your specific hardware; do not treat a profile change as an ordinary Pod rollout.

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

MIG is a strong option for supported workloads needing hardware partitioning, but it is less flexible than time-slicing when workloads do not fit the available profiles. Benchmark representative jobs and plan profile capacity before standardizing on a layout.

Compare MIG with [NVIDIA time-slicing](/blogs/nvidia-gpu-time-slicing/) and other [Kubernetes GPU scheduling strategies](/blogs/gpu-scheduling-strategies-compared/) before choosing a sharing model.

## Further reading

- [NVIDIA GPU Operator: MIG](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-mig.html)
- [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

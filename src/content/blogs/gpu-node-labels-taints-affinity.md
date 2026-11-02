---
title: "GPU Node Labels, Taints, and Affinity in Kubernetes"
seoTitle: "Kubernetes GPU Node Labels, Taints & Affinity"
description: "Keep GPU workloads on the right Kubernetes nodes using labels, taints, tolerations, and resource requests without confusing their roles."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes Scheduling
tags:
  - Kubernetes
  - GPUs
  - Node affinity
  - Scheduling
draft: false
---

GPU nodes are often more expensive and more specialized than general-purpose workers. Labels, taints, tolerations, and affinity help operators route accelerator workloads intentionally. They complement GPU resource requests; they do not replace them.

## Give nodes a clear identity

Use stable, organization-managed labels to describe node pools and accelerator classes. For example, a platform team might label a dedicated pool with `accelerator=nvidia`. Avoid relying on labels that are not guaranteed by your node lifecycle tooling.

Inspect labels and taints with:

```bash
kubectl get nodes --show-labels
kubectl describe node <gpu-node>
```

## Use a taint to protect scarce nodes

An operator can taint a dedicated GPU pool so general-purpose Pods do not land there by accident:

```bash
kubectl taint nodes <gpu-node> accelerator=nvidia:NoSchedule
```

Only workloads with a matching toleration can use that node. A toleration permits placement past the taint; it does not force the scheduler to choose that node.

## Combine scheduling policy with a GPU request

```yaml
spec:
  nodeSelector:
    accelerator: nvidia
  tolerations:
    - key: accelerator
      operator: Equal
      value: nvidia
      effect: NoSchedule
  containers:
    - name: inference
      image: example/inference:stable
      resources:
        limits:
          nvidia.com/gpu: 1
```

Replace the example label, taint, image, and resource key with values from your cluster. A `nodeSelector` narrows eligible nodes, the toleration allows the Pod onto tainted nodes, and the GPU request reserves the advertised accelerator resource.

## Diagnose unschedulable combinations

If a Pod stays Pending, check the scheduler event before changing policy:

```bash
kubectl describe pod <pod-name>
kubectl get nodes -L accelerator
kubectl describe node <gpu-node>
```

A valid GPU may exist but be excluded by a misspelled label, missing toleration, incompatible resource key, or insufficient CPU and memory. Keep the node-pool labels, taints, and workload templates in the same version-controlled source so they do not drift.

If a workload still cannot be placed, compare its resource request with the [GPU Pod scheduling checklist](/blogs/debugging-pending-gpu-pods/). Node selection alone does not guarantee a particular GPU interconnect; see [GPU topology-aware scheduling](/blogs/kubernetes-gpu-topology-aware-scheduling/) for that distinction.

## Further reading

- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes: Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

---
title: "GPU Resource Requests, Limits, and Quotas in Kubernetes"
seoTitle: "Kubernetes GPU Resource Quotas and Limits"
description: "Make GPU capacity predictable with correct extended-resource requests, namespace quotas, and checks for shared-resource accounting."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes Resource Management
tags:
  - Kubernetes
  - GPUs
  - Resource quotas
  - Platform engineering
draft: false
---

GPU resource governance starts with a clear resource model. Kubernetes extended resources are integer-valued scheduling units, and the device plugin decides what those units represent. A unit might mean a whole device, a MIG instance, or a configured shared replica.

Do not assume the same key has the same meaning on every node pool.

## Declare the resource in the workload

For extended GPU resources, specify the resource limit. Kubernetes uses that limit as the request when no separate request is specified; if both are present, they must be equal.

```yaml
resources:
  limits:
    <gpu-resource-key-advertised-by-your-cluster>: 1
```

Replace the placeholder with the resource shown in the node's allocatable resources. A conventional `nvidia.com/gpu` key is not correct for every MIG or sharing configuration.

## Protect namespace capacity with quota

A ResourceQuota can limit total extended-resource consumption in a namespace:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-capacity
  namespace: ml-team
spec:
  hard:
    requests.nvidia.com/gpu: "2"
```

This example applies only when the cluster advertises and accounts for `nvidia.com/gpu` under that quota key. Check how your Kubernetes version and device plugin expose extended resources, and test the quota in a non-production namespace before relying on it.

Inspect quota usage with:

```bash
kubectl describe resourcequota gpu-capacity -n ml-team
kubectl describe node <gpu-node>
```

## Include other schedulable resources

A Pod also needs CPU and host memory, and may be constrained by storage, affinity, or taints. A GPU quota does not reserve a physical device for a team, guarantee a particular GPU model, or enforce GPU memory use. Use node pools, labels, admission policy, and workload requests to encode those separate requirements.

## Make accounting understandable

Document what one GPU resource unit means for each pool. For shared replicas, explain that the unit may not represent a fixed compute share. Review quota usage, Pending Pods, and actual utilization together; quotas control admission, while node allocatable resources control scheduling.

For node placement and resource mismatch failures, see the [GPU Pod troubleshooting checklist](/blogs/debugging-pending-gpu-pods/). Compare [sharing strategies](/blogs/gpu-scheduling-strategies-compared/) before defining what a quota unit promises to tenants.

## Further reading

- [Kubernetes: Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Kubernetes: Extended resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources)

---
title: "Why Is My GPU Pod Pending? A Kubernetes Troubleshooting Checklist"
seoTitle: "Troubleshoot Pending GPU Pods in Kubernetes"
description: "Trace a Pending GPU workload through resource advertisement, scheduling events, node constraints, and device-plugin health."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes Troubleshooting
tags:
  - Kubernetes
  - GPUs
  - Troubleshooting
  - Scheduling
draft: false
---

A GPU Pod in `Pending` usually means the scheduler cannot find an eligible node with the requested resource and all other scheduling constraints satisfied. The fastest diagnosis is to read the Pod events first, then compare the request with node allocatable resources.

## 1. Read the scheduling event

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace> --sort-by=.lastTimestamp
```

Look for messages such as insufficient GPU resources, untolerated taints, affinity mismatch, or an unbound volume. These are different problems and need different fixes.

## 2. Confirm the resource name

Inspect the Pod's requested resources and the GPU nodes:

```bash
kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{.spec.containers[*].resources}'
kubectl describe nodes
```

The request must use a resource key advertised by a node. Whole GPUs, MIG profiles, and sharing plugins may expose different keys. A request for `nvidia.com/gpu` will not match a node that only advertises a MIG profile resource.

## 3. Check allocatable capacity and constraints

Even when a node has GPU capacity, it may not be eligible for the Pod. Review:

- Node selectors and required node affinity.
- Taints on GPU nodes and matching Pod tolerations.
- Namespace quotas and admission policies.
- Requested CPU and memory in addition to the GPU.
- Persistent-volume topology and other scheduling constraints.

Avoid removing a taint or relaxing production affinity just to make one Pod schedule. First verify the intended workload placement policy.

## 4. Check device-plugin health

If the GPU resource is absent from node capacity, inspect the NVIDIA device plugin or GPU Operator:

```bash
kubectl get pods -A -o wide
kubectl get events -A --sort-by=.lastTimestamp
kubectl describe node <gpu-node>
```

Check plugin logs and the installation's health resources. A driver, container runtime, plugin, or GPU Operator problem can prevent devices from being advertised. Restarting components without collecting events and logs can erase useful evidence.

## 5. Separate scheduling from container startup

A Pod can be scheduled and still fail to start. If it is assigned to a node, inspect its status and container events:

```bash
kubectl get pod <pod-name> -n <namespace> -o wide
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --all-containers
```

After the container starts, verify device visibility and application compatibility. GPU scheduling confirms resource assignment; it does not guarantee that the image, CUDA runtime, driver, or application is compatible.

For background, see how [Kubernetes GPU device plugins](/blogs/kubernetes-gpu-device-plugin/) advertise resources and how [GPU node labels, taints, and affinity](/blogs/gpu-node-labels-taints-affinity/) affect placement.

## Further reading

- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes: Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)

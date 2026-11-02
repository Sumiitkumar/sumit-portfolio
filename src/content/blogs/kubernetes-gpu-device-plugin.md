---
title: "Kubernetes GPU Device Plugins: From Driver to Pod"
seoTitle: "Kubernetes GPU Device Plugins Explained | Sumit Kumar"
description: "Follow the GPU device-plugin path from host driver discovery to Node allocatable resources and container device injection."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Infrastructure
tags:
  - Kubernetes
  - Device plugins
  - NVIDIA
  - GPUs
draft: false
---

When Kubernetes says a node has no GPUs, the card may still be physically present. Kubernetes does not discover vendor hardware by itself: a device plugin must register with kubelet, report healthy devices, and expose an extended resource.

Understanding that path makes GPU failures easier to localize.

## The discovery path

For an NVIDIA GPU, the flow generally looks like this:

1. The node operating system loads a compatible NVIDIA driver.
2. The container runtime is configured to expose NVIDIA devices.
3. The NVIDIA device plugin discovers healthy GPUs and registers with kubelet.
4. Kubelet updates Node capacity and allocatable resources.
5. The scheduler assigns a matching resource to a Pod, and the runtime injects device access.

The GPU Operator can manage several of these components, but its exact responsibilities depend on its configuration and platform.

## Inspect Kubernetes' view

```bash
kubectl describe node <gpu-node>
kubectl get pods -A -o wide
```

Look for the expected GPU or MIG resource under capacity and allocatable. If the resource is missing, focus on node-level driver, plugin, and operator health. If it is present but a Pod is Pending, inspect that Pod's events, resource key, affinity, taints, and quota.

## Follow component health

Find device-plugin and GPU Operator Pods, then inspect their status and logs:

```bash
kubectl get pods -A | grep -Ei 'nvidia|gpu'
kubectl describe pod <device-plugin-pod> -n <namespace>
kubectl logs <device-plugin-pod> -n <namespace>
```

Names and namespaces vary by installation. Review the corresponding operator resources and events too. Avoid assuming that a Running plugin Pod means all devices are healthy; use the node's reported resources and plugin logs as evidence.

## Validate the container path

Once a test Pod is assigned, use a compatible CUDA image and check device visibility:

```bash
kubectl exec <pod-name> -- nvidia-smi
```

If the Pod was scheduled but the command fails, check runtime integration, device permissions, the container image, and host-driver compatibility. Scheduling success and application-level GPU compatibility are separate checks.

## Make upgrades predictable

Pin and document driver, Kubernetes, GPU Operator, and device-plugin versions as a tested set. Roll out changes to a small GPU node pool first, verify resource advertisement and a representative workload, then expand. This makes it easier to distinguish a plugin regression from a workload or scheduler issue.

For a Pod that cannot get a GPU, follow the [Pending GPU Pod troubleshooting checklist](/blogs/debugging-pending-gpu-pods/). See also the [Kubernetes GPU scheduling guide](/blogs/gpu-scheduling-strategies-compared/).

## Further reading

- [Kubernetes device plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

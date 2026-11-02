---
title: "NVIDIA GPU Time-Slicing in Kubernetes"
seoTitle: "NVIDIA GPU Time-Slicing on Kubernetes | Sumit Kumar"
description: "A practical guide to Kubernetes GPU time-slicing, replica resources, workload behavior, and the isolation limits operators should understand."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Scheduling
tags:
  - Kubernetes
  - NVIDIA
  - Time-slicing
  - GPUs
draft: false
---

NVIDIA device-plugin time-slicing lets multiple Kubernetes workloads share access to a physical GPU. The plugin advertises additional schedulable replicas, allowing more Pods to be assigned than there are physical devices.

This improves access and utilization for bursty development jobs or small inference workloads. It is not the same as a hardware partition: time-slicing does not provide the memory isolation of MIG, and a replica count is not a guaranteed fraction of GPU compute.

## Configure the sharing model carefully

The NVIDIA device plugin supports time-slicing configuration, commonly supplied through a ConfigMap and referenced by the plugin deployment or GPU Operator. The schema and resource names depend on the version and installation method. Use the configuration guide for the exact release you run and check that the plugin actually loads the intended configuration.

A conceptual example of a resource configuration is:

```yaml
sharing:
  timeSlicing:
    resources:
      - name: nvidia.com/gpu
        replicas: 4
```

This illustrates a configuration shape, not a complete ConfigMap or universal drop-in manifest. Confirm the expected API, ConfigMap name, plugin arguments, and resource naming for your installation before applying it.

## What replicas mean

If the plugin advertises four replicas for a device, Kubernetes can schedule multiple consumers against that device. The scheduler accounts for advertised resource units, not actual GPU utilization, memory headroom, or latency. Four replicas do not mean each workload receives a fixed 25% of compute.

Containers may see the same physical GPU, and memory use can contend. A workload that allocates most device memory can interfere with another one even when both were scheduled successfully. Do not use ordinary time-slicing where a hard tenant isolation boundary is required.

## Verify before increasing sharing

After configuration, inspect the node's allocatable GPU resources and test with a small workload:

```bash
kubectl describe node gpu-worker-01
kubectl describe pod <test-pod>
kubectl exec <test-pod> -- nvidia-smi
```

Monitor GPU utilization, memory use, error rates, and application latency with your normal GPU telemetry. Increase replica counts gradually and use representative concurrency; a single idle test Pod does not reveal contention behavior.

## Choose the right workload

Time-slicing is a reasonable starting point for trusted, low-intensity jobs with flexible performance needs. Use dedicated devices or MIG when workloads need predictable performance or stronger memory isolation. In all cases, publish the actual guarantees to users rather than describing time-sliced replicas as dedicated virtual GPUs.

For a side-by-side decision guide, compare [whole GPUs, MIG, time-slicing, and HAMi](/blogs/gpu-scheduling-strategies-compared/). Also review [shared-GPU memory and compute contention](/blogs/gpu-memory-and-compute-contention/) before increasing replica counts.

## Further reading

- [NVIDIA Kubernetes device plugin: shared access and time-slicing](https://github.com/NVIDIA/k8s-device-plugin#shared-access-to-gpus)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

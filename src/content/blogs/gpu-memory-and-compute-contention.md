---
title: "GPU Memory and Compute Contention in Shared Kubernetes Clusters"
seoTitle: "Shared GPU Memory and Compute Contention"
description: "Why a successfully scheduled shared-GPU Pod can still fail, slow down, or run out of device memory—and what to monitor."
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

A Pod can be scheduled successfully and still compete with another workload for GPU compute or device memory. Kubernetes schedules the resources advertised by the device plugin; it does not normally inspect live GPU utilization when placing each Pod.

This distinction is especially important when sharing GPUs through time-slicing or another overcommit model.

## Compute sharing is not a fixed percentage

Multiple processes may take turns executing on a GPU. Their observed throughput depends on kernel duration, memory bandwidth, synchronization, and what other processes are doing. A configured replica count generally describes how many workloads can be scheduled; it does not guarantee each workload an equal or fixed compute share.

## Device memory can be the limiting resource

GPU memory is not the same as Kubernetes host memory. Two processes may both start and then one may fail when their combined allocations exceed available device memory. Ordinary time-slicing should not be assumed to provide a per-workload memory boundary. Verify the guarantees of the specific sharing product and configuration.

MIG can provide hardware-partitioned memory and compute on supported devices, while whole-device allocation provides a simpler dedicated-device model. Choose based on isolation and performance requirements, not only average utilization.

## Monitor workload outcomes and GPU telemetry

Use the NVIDIA DCGM Exporter or another supported telemetry path to observe GPU utilization, memory use, temperature, and device errors. Correlate those signals with application-level metrics such as:

- Request latency and throughput.
- Batch size and queue depth.
- Out-of-memory errors and process restarts.
- Per-tenant or per-namespace consumption.

`nvidia-smi` is useful for a node-level snapshot, but it is not a substitute for time-series data during a contention incident.

## A safe capacity experiment

Establish a baseline with one representative workload, then increase concurrency gradually while measuring throughput, tail latency, and memory headroom. Repeat with realistic inputs and peak traffic patterns. Define a stopping threshold before the experiment, and do not increase the sharing factor just because the GPU appears underutilized during a quiet period.

If performance isolation is a requirement, separate workloads onto dedicated devices or supported MIG instances. Capacity controls and quotas help protect the cluster, but they cannot turn a non-isolated sharing mode into hardware isolation.

For configuration and trade-offs, see [NVIDIA time-slicing](/blogs/nvidia-gpu-time-slicing/) and the [GPU scheduling strategy comparison](/blogs/gpu-scheduling-strategies-compared/).

## Further reading

- [NVIDIA Kubernetes device plugin: shared access and time-slicing](https://github.com/NVIDIA/k8s-device-plugin#shared-access-to-gpus)
- [NVIDIA DCGM Exporter](https://docs.nvidia.com/datacenter/dcgm/latest/gpu-telemetry/dcgm-exporter.html)
- [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/)

---
title: "Whole GPUs vs MIG vs Time-Slicing vs HAMi"
seoTitle: "Kubernetes GPU Scheduling Strategies Compared"
description: "Compare common Kubernetes GPU allocation strategies by isolation, utilization, scheduling behavior, and operational complexity."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Scheduling
tags:
  - Kubernetes
  - GPUs
  - MIG
  - HAMi
draft: false
---

There is no single best GPU allocation strategy for every Kubernetes cluster. Whole-device allocation favors simplicity, MIG partitions supported hardware, time-slicing allows several processes to share a device, and platforms such as HAMi add their own scheduler and device-sharing model.

Compare the guarantees of the actual installed versions before choosing.

## Whole-device allocation

The device plugin advertises one resource per GPU, and each Pod requests one or more units. This is easiest to reason about and provides the clearest device ownership, but small jobs can leave compute idle.

## NVIDIA MIG

MIG creates supported hardware instances with defined compute and memory resources. It is a good fit when supported profiles match workload sizes and stronger partitioning is important. Profiles are finite, hardware-specific, and require deliberate node configuration.

## NVIDIA time-slicing

Time-slicing makes more schedulable replicas available for a device. It can improve utilization for trusted or bursty jobs, but replica count is not a compute reservation, and ordinary time-slicing should not be treated as memory isolation.

## HAMi and other sharing schedulers

HAMi can provide a scheduler-integrated sharing model for supported devices. Its resource names, limits, and enforcement depend on the installed release and plugin configuration. Validate those guarantees with the version-specific documentation and real workloads instead of assuming they match MIG or NVIDIA time-slicing.

## A practical selection process

Ask these questions for each workload:

1. Does it require dedicated performance or a hard isolation boundary?
2. Does its memory footprint fit a supported MIG profile?
3. Can it tolerate variable performance from shared execution?
4. Does the sharing system enforce the compute and memory limits we need?
5. Can the team monitor per-workload outcomes and prevent noisy-neighbor impact?

Start with a representative benchmark and a small node pool. Publish the difference between dedicated, partitioned, and shared resources in your platform documentation. That avoids promising “one GPU” when the workload actually receives a shared scheduling slot.

Read the implementation guides for [MIG](/blogs/nvidia-mig-kubernetes/), [time-slicing](/blogs/nvidia-gpu-time-slicing/), and [HAMi](/blogs/hami-gpu-sharing-kubernetes/) to verify the behavior of each option in your environment.

## Further reading

- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)
- [HAMi documentation](https://project-hami.io/docs/)

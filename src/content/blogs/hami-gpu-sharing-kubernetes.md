---
title: "Sharing GPUs on Kubernetes with HAMi"
seoTitle: "Share GPUs on Kubernetes with HAMi | Sumit Kumar"
description: "An operator-focused introduction to HAMi GPU sharing: scheduler integration, device visibility, resource requests, and safe rollout checks."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes GPU Sharing
tags:
  - Kubernetes
  - HAMi
  - GPUs
  - Scheduling
draft: false
---

Whole-GPU allocation is easy to reason about, but it can strand capacity when inference or development workloads use only part of a device. HAMi provides a Kubernetes-oriented approach to sharing supported accelerators and managing device resources.

The exact resource names, supported devices, and configuration fields depend on the HAMi release and enabled device plugins. Treat the installed chart values and version-matched documentation as authoritative; do not copy a resource key from a different cluster.

## Understand the components first

A sharing setup usually includes a scheduler component that participates in placement and a device plugin or runtime integration that exposes the assigned device to the container. Both sides need to agree on the resource model. Installing only one part can result in Pods that remain Pending or start without the expected device view.

Before deploying, record:

- The Kubernetes and HAMi versions.
- The supported GPU models and driver versions.
- The resource names and units advertised by the installed plugin.
- Whether device memory and compute limits are enforced, and how.
- Which namespaces and workloads are allowed to use shared devices.

Install HAMi using its documented chart or manifests for the selected release. Pin versions and review configuration changes before applying them to production.

## Inspect advertised resources

After installation, check the node's allocatable resources:

```bash
kubectl describe node gpu-worker-01
kubectl get pods -A -o wide
```

Look for the resource keys documented by your HAMi configuration. Depending on the release and device plugin, a workload may use a vendor GPU resource or a HAMi-specific resource. The name alone does not tell you what isolation or limits are enforced.

## Request the configured resource

Use the resource key and values actually advertised in your cluster. A manifest should declare those resources in the container's resource limits, for example:

```yaml
resources:
  limits:
    <resource-name-from-your-cluster>: 1
```

The placeholder is intentional: replace it with a real key from your installed HAMi version. Do not mix a resource name from one plugin with a different scheduler's configuration. Apply tenant quotas and admission controls as appropriate so one team cannot consume all shared capacity.

## Test before onboarding workloads

Start with a small, non-critical test Pod and verify:

1. The scheduler places it on an eligible GPU node.
2. The device is visible inside the container.
3. The workload observes the expected compute and memory limits.
4. Pod events, scheduler logs, and plugin logs agree about the allocation.
5. A second test Pod behaves as expected under the chosen sharing policy.

```bash
kubectl describe pod gpu-test
kubectl logs -n <hami-namespace> <scheduler-pod>
kubectl logs -n <hami-namespace> <device-plugin-pod>
```

Replace namespace and Pod names with those used by your installation. Logs can contain sensitive operational information; follow your cluster's access and retention policies.

## Set expectations for shared devices

Sharing can improve utilization, but it does not automatically make workloads equivalent to dedicated GPUs. Confirm whether the selected mode isolates memory, limits compute, accounts for device memory, and handles competing workloads. Document those guarantees for users and monitor utilization, memory pressure, and tail latency before raising the sharing factor.

For a comparison with other approaches, see [whole GPUs, MIG, time-slicing, and HAMi](/blogs/gpu-scheduling-strategies-compared/).

## Further reading

- [HAMi documentation](https://project-hami.io/docs/userguide/configure)
- [HAMi GPU virtualization concepts](https://project-hami.io/docs/core-concepts/gpu-virtualization)
- [Kubernetes device plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

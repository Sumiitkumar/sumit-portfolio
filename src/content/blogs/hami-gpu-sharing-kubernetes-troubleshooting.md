---
title: "HAMi on Kubernetes: Troubleshoot Pending GPU Pods Step by Step"
seoTitle: "HAMi Kubernetes Troubleshooting: Pending GPU Pods"
description: "Diagnose HAMi GPU workloads that stay Pending by checking resource names, node capacity, scheduling constraints, scheduler health, and plugin registration."
pubDate: 2026-11-05
author: Sumit Kumar
category: Kubernetes GPU Troubleshooting
tags:
  - Kubernetes
  - HAMi
  - GPUs
  - Troubleshooting
draft: false
---

A HAMi-backed GPU Pod can stay Pending even when a node has a physical GPU. Kubernetes schedules the resource that the installed plugin advertises, not a GPU model inferred from the Pod name. The quickest diagnosis is to follow the allocation path in order: request, eligible node, scheduler decision, and device-plugin registration.

HAMi resource names and configuration vary by release and enabled device plugin. Treat commands below as a diagnostic sequence, not a release-independent installation recipe. Compare every request with the resources your own cluster reports.

## Start with the Pod event

First find out whether the Pod was rejected before scheduling or simply has no eligible node:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace> --sort-by=.lastTimestamp
```

Look at the latest `FailedScheduling` message and the Pod's resource requests. “Insufficient” extended resources usually points to a missing or exhausted resource, while a node-selector or taint message points to placement constraints. These messages can appear together; fix the earliest mismatch instead of changing several settings at once.

If the workload is managed by a Deployment, Job, or another controller, inspect its template as well as the generated Pod. Updating only a live Pod is temporary because the controller recreates it from the original template.

## Check the exact advertised resource key

Kubernetes treats extended-resource names as exact identifiers. A request for `nvidia.com/gpu` is not interchangeable with a HAMi-specific resource name just because both refer to GPUs. Inspect the target node:

```bash
kubectl describe node <gpu-node>
kubectl get nodes -o wide
```

Compare the node's `Capacity` and `Allocatable` values with the Pod's `resources.limits`. Use the resource key and units shown by your HAMi installation. If the key is absent, changing the Pod request to a guessed name will not solve the root cause; first determine why the plugin did not publish the resource.

Also check namespace quota and admission policy. A namespace may be prevented from requesting an advertised resource even when a node has free capacity. Use the relevant namespace policy and quota details rather than assuming a scheduler failure:

```bash
kubectl describe resourcequota -n <namespace>
kubectl get limitrange -n <namespace>
```

The commands may return no objects when those policies are not configured. If they do, compare the quota's resource names with the Pod request.

## Verify the node is eligible

The scheduler can allocate a resource only on a node that satisfies the rest of the Pod's constraints. Inspect `nodeSelector`, node affinity, taints and tolerations, topology rules, and any required node labels. A toleration allows a Pod onto a tainted node; it does not select that node by itself.

```bash
kubectl get pod <pod-name> -n <namespace> -o yaml
kubectl describe node <gpu-node>
```

For a useful test, compare the Pod template with a known eligible node. Avoid removing all placement constraints as a quick fix: that can move work onto a node with a different GPU model, driver, or sharing policy.

## Check HAMi scheduler and plugin separately

Scheduling and device injection are separate stages. A healthy scheduler does not prove that the device plugin registered the expected resources, and a Ready plugin Pod does not prove that its scheduler integration is using the intended policy.

Find the actual HAMi components and namespaces in your cluster, then inspect their status and recent logs:

```bash
kubectl get pods -A -o wide | grep -Ei 'hami|gpu'
kubectl logs -n <hami-namespace> <scheduler-pod> --since=30m
kubectl logs -n <hami-namespace> <device-plugin-pod> --since=30m
```

Look for startup errors, failed device discovery, configuration parsing errors, or a resource name that differs from the Pod request. Component labels, names, and namespace are installation-specific. If the operator manages these Pods, change its source configuration rather than editing a generated Pod or DaemonSet that reconciliation will overwrite.

## Separate Pending from runtime failures

Once a Pod is assigned to a node, it is no longer a scheduling problem. If the container starts but cannot see a device, check plugin/runtime integration, driver compatibility, and the workload image. If the device is visible but the process fails, inspect the application and its framework/runtime compatibility.

```bash
kubectl get pod <pod-name> -n <namespace> -o wide
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
```

This distinction avoids an unhelpful cycle of changing affinity on a Pod that has already been scheduled. Record the assigned node and container status before editing the manifest.

## Use a small, controlled allocation test

Before changing a shared production pool, reproduce the request in a test namespace or on a non-critical node. Request one resource unit that the node advertises, confirm the scheduler's choice, then verify device visibility and a small workload operation inside the container. A successful `nvidia-smi` query can confirm device visibility on NVIDIA systems, but it does not demonstrate that a memory or compute limit is enforced.

If the Pod remains Pending, change one factor at a time: request key, namespace quota, or placement constraint. Compare the new event with the previous one. If it schedules but behaves unexpectedly, record device visibility, GPU memory, utilization, and application latency under the actual HAMi mode. Follow the installed release's documentation before testing limits or failure behavior.

| Symptom | First check | Likely layer |
| --- | --- | --- |
| Insufficient GPU resource | Node allocatable key and Pod request | Resource registration or capacity |
| No eligible nodes | Affinity, selectors, taints, and tolerations | Placement policy |
| Namespace denied the request | ResourceQuota and admission policy | Namespace governance |
| Pod assigned, device missing | Plugin, runtime, driver, and container | Device injection |
| Device visible, workload slow | Contending Pods and workload telemetry | Shared-device performance |

## Make the fix durable

After identifying the failing layer, update the version-controlled source of truth: the workload chart, HAMi values, operator configuration, namespace quota, or node-pool policy. Apply the smallest change that addresses the observed failure. Then verify the node's advertised resources and repeat the same test Pod so the result is comparable.

For shared GPUs, document what the configured resource means for memory isolation, compute contention, and tenant access. A scheduled unit is not automatically a dedicated GPU or a guaranteed fraction of its throughput. See the [HAMi GPU-sharing setup guide](/blogs/hami-gpu-sharing-kubernetes/) and the [Kubernetes GPU quota guide](/blogs/gpu-resource-quotas-kubernetes/) for the surrounding capacity decisions.

## A quick diagnostic order

When a HAMi-backed Pod is Pending, follow this sequence:

1. Read the Pod's latest scheduling event.
2. Compare its requested resource key with the target node's allocatable key.
3. Check namespace quota and admission rules.
4. Confirm that at least one node satisfies labels, affinity, and taints.
5. Inspect scheduler and plugin health independently.
6. After assignment, switch to runtime and application diagnostics.

This order keeps the investigation tied to evidence and reduces risky changes to a shared GPU pool. For release-specific settings, supported devices, and resource semantics, use the [HAMi documentation](https://project-hami.io/docs/).
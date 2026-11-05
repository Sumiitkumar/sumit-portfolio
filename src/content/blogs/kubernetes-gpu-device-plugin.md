---
title: "From Driver to Pod: How Kubernetes Finds and Assigns a GPU"
seoTitle: "Kubernetes GPU Device Plugins: Discovery to Pod"
description: "Follow GPU discovery from the host driver through a Kubernetes device plugin, node allocatable resources, scheduling, and container access."
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

The GPU can be plugged into the server and still be invisible to Kubernetes. Kubernetes relies on a device plugin to find healthy devices, register with kubelet, and publish them as schedulable resources.

Knowing where that handoff failed narrows the search considerably.

## The discovery path

For an NVIDIA GPU, the path usually looks like this:

1. The node operating system loads a compatible NVIDIA driver.
2. The container runtime is configured to expose NVIDIA devices.
3. The NVIDIA device plugin discovers healthy GPUs and registers with kubelet.
4. Kubelet updates Node capacity and allocatable resources.
5. The scheduler assigns a matching resource to a Pod, and the runtime injects device access.

The GPU Operator can manage several of these pieces, depending on how it is configured and on the platform.

## Inspect Kubernetes' view

```bash
kubectl describe node <gpu-node>
kubectl get pods -A -o wide
```

Check Capacity and Allocatable for the GPU or MIG resource you expect. If it is missing, investigate the driver, device plugin, and operator on that node. If the resource is present but a Pod is Pending, check the Pod's events, requested key, affinity, taints, and quota.

## Follow component health

Find the device-plugin and GPU Operator Pods, then check their status and logs:

```bash
kubectl get pods -A | grep -Ei 'nvidia|gpu'
kubectl describe pod <device-plugin-pod> -n <namespace>
kubectl logs <device-plugin-pod> -n <namespace>
```

Names and namespaces vary between installations. Check the operator resources and events as well. A Running plugin Pod does not prove that every GPU is healthy; compare its logs with the resources reported on the node.

## Validate the container path

After a test Pod is assigned, use a compatible CUDA image to check whether the container can see the device:

```bash
kubectl exec <pod-name> -- nvidia-smi
```

If the Pod was scheduled but the command fails, look at runtime integration, device permissions, the image, and host-driver compatibility. Kubernetes assigning a GPU and the application being able to use it are two separate checks.

## Make upgrades predictable

Keep a record of the driver, Kubernetes, GPU Operator, and device-plugin versions you tested together. Roll changes out to a small GPU node pool first. Check that resources appear and a representative workload runs before expanding; if something breaks, the smaller rollout makes the cause easier to isolate.

For a Pod that cannot get a GPU, follow the [Pending GPU Pod troubleshooting checklist](/blogs/debugging-pending-gpu-pods/). See also the [Kubernetes GPU scheduling guide](/blogs/gpu-scheduling-strategies-compared/).

## What the device-plugin contract does

A device plugin is a node-level integration, not a scheduler replacement. It discovers devices on a node, reports them to kubelet, and participates in allocation when kubelet starts a container that requested one of its registered resources. The scheduler uses the node's published resource quantities when choosing a node. Once bound, kubelet and the runtime arrange access to the allocated device. This division helps explain why a resource can be visible in Node status while a container still fails to initialize it.

The Kubernetes device-plugin API is designed around extended resources. These resources are usually advertised as integer quantities and are not overcommitted by the standard scheduler in the way CPU requests may be. The vendor plugin decides what a unit represents and what devices to return in response to an allocation. With a conventional NVIDIA configuration, a unit generally represents a GPU; with MIG or sharing configuration, the exposed units can represent profiles or replicas instead. The resource name alone does not establish isolation, memory limits, or performance guarantees.

The plugin also reports device health. An unhealthy device should not be allocated as though it were available, but a node-level quantity is only one part of health diagnosis. Compare kubelet's view with plugin logs, operator status, and hardware telemetry. During plugin restart or device reinitialization, resource counts can temporarily change. Confirm the expected reconciliation behavior for the installed version and avoid deleting components blindly when a device is already in use.

Registration is performed through kubelet on each node, so a control-plane API query alone cannot tell you whether the local plugin socket and kubelet registration succeeded. Device plugins commonly run as a DaemonSet with host access required by the implementation. A missing Pod on one node can therefore explain why only that node lacks resources, even when the deployment appears healthy overall. Check DaemonSet desired, current, and ready counts alongside per-node Pod placement.

## Separate the layers during diagnosis

It is useful to trace the path in order:

1. **Hardware and host driver:** the operating system can enumerate the GPU, and the installed driver supports the device.
2. **Container runtime:** the configured runtime can expose NVIDIA devices to containers.
3. **Plugin discovery:** the plugin detects devices and registers the appropriate resource with kubelet.
4. **Node accounting:** Node capacity and allocatable show the resource under the expected key.
5. **Scheduling and admission:** the Pod requests that key and is eligible for a node with available quantity.
6. **Container startup:** kubelet and the runtime provide device access to the assigned container.
7. **Application initialization:** the image and libraries work with the host driver and execute a representative operation.

Run checks at the boundary that failed. If the key is missing from Node status, application code is unlikely to be the first place to look. If a Pod cannot schedule despite a visible resource, inspect its request, quota, affinity, taints, and events. If it is assigned but cannot query the GPU, focus on runtime/device injection and image compatibility. If device discovery succeeds but the application reports an unsupported CUDA runtime, verify image libraries against the host driver rather than reinstalling the device plugin.

Useful first checks include:

```bash
kubectl describe node <gpu-node>
kubectl get pods -A -o wide | grep -Ei 'nvidia|gpu'
kubectl describe pod <gpu-workload> -n <namespace>
kubectl get events -A --sort-by=.lastTimestamp
```

These are illustrative commands. Use your cluster's log aggregation and access controls if direct access is restricted. Identify the plugin Pod on the same node that reports the problem; a healthy DaemonSet elsewhere does not establish health on the affected node.

## Understand requests and node accounting

GPU requests are normally made in the container resources section, using the exact extended-resource name advertised on that cluster. A typical manifest requests one unit:

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
```

This key is common for conventional NVIDIA resources, but it is not universal for MIG or a shared-device configuration. Inspect `kubectl describe node` and the plugin's configuration before adapting examples. Extended resources are commonly specified as limits; if a manifest also includes requests, Kubernetes expects the values to follow the extended-resource rules. Avoid requesting a device in one container and assuming a sidecar automatically receives access to it; device allocation is tied to container resource requests and plugin behavior.

Node `Capacity` describes the total resource quantity reported by kubelet, while `Allocatable` is the quantity available to Pods after system reservations and related accounting. Compare both when investigating discrepancies. Neither value is a live measure of GPU utilization or free VRAM. A node can have an allocatable GPU unit already assigned to a Pod that is idle, or appear to have a free unit while another application's work is busy on shared hardware.

Kubernetes resource quotas can constrain extended-resource requests by namespace, but quota does not reserve a particular model or guarantee that a matching node is available. Pair quota with node labels and affinity when different hardware classes exist. Ensure the resource key is consistent between namespace quotas and workload requests, especially after changing plugin mode.

## Validate an allocation safely

Create a small test workload using a known compatible image and a single GPU request. Keep the Pod in a non-critical namespace, specify the intended node pool if multiple types exist, and include a timeout or cleanup plan. After scheduling, inspect Pod events and the assigned node. Then run a device query and a minimal application operation. A utility such as `nvidia-smi` can confirm that a GPU is visible in many NVIDIA environments, but it cannot prove the application's libraries, model, or workload are correct.

Test a negative scenario too: use a selector that deliberately excludes GPU nodes or request an unavailable test resource and verify that the Pod remains Pending with a diagnostic event. Restore the valid configuration and confirm it schedules normally. This teaches the team what a real scheduling failure looks like and guards against misleading fixes such as removing all affinity or resource requests.

For shared or partitioned devices, add an explicit check for what a resource unit means. Compare advertised resources to the configured mode and test concurrent workloads only in an environment where contention is acceptable. A successful `nvidia-smi` invocation does not prove memory isolation or a compute reservation. Consult the vendor documentation and exercise the policy with representative workload behavior.

## Common failure patterns

**No GPU resource on the node:** check host driver/device health, plugin Pod placement and events, plugin logs, kubelet registration, and any operator reconciliation errors. Verify that the plugin is permitted to run on the node; taints or selectors can leave an uncovered node.

**Pod remains Pending:** compare its resource key and quantity with allocatable resources. Inspect namespace quota, node selectors, required affinity, taints, tolerations, and any other requested resource. A correct GPU request can still be unschedulable if CPU, memory, or ephemeral storage is insufficient.

**Pod starts without expected device visibility:** verify that the container itself requested the resource, that the runtime integration is configured, and that no admission mutation or security policy interfered. Inspect kubelet events and runtime logs where available. Confirm that the test image is designed for the platform.

**Device query succeeds but application fails:** check the host driver, CUDA runtime bundled in the image, framework build, and workload configuration. The GPU may be available even when the application stack is incompatible.

**Resource count changes unexpectedly:** examine plugin configuration and recent rollout history, node-level logs, device health, and whether the node is configured for MIG or shared access. Capture a before-and-after resource snapshot; do not assume that restarting the DaemonSet is harmless on a busy node.

## Manage versions and changes

Keep a compatibility record for Kubernetes, GPU Operator (if used), driver, container runtime, and device-plugin release. The GPU Operator can manage drivers, toolkit configuration, and plugins, but which components it owns depends on installation values. Avoid installing a standalone plugin over an operator-managed deployment without a documented reason. Duplicate agents may contend over registration or advertise confusing resource inventories.

Treat changes to plugin arguments, configuration maps, MIG strategy, or sharing mode as capacity changes. Render and review manifests, roll them out to a canary pool, and compare Node resources before and after. Run a known workload, verify allocation and application behavior, and observe existing jobs during the rollout. For rollback, restore the pinned configuration and confirm the old resource names and quantities return before resuming admissions.

Keep system and workload versions visible in incident records. Image tags alone may be mutable, so capture the resolved image digest when reproducibility matters. Record when the node last rebooted and whether the driver came from an operator or the host image. These details help distinguish a plugin regression from a node that never received the expected driver update.

Operational documentation should include the resource key used by each pool, the component that owns it, how to find the node-local plugin, and the tested diagnostic image. Give on-call operators permission to read the needed Pod events and logs without granting broad cluster access. Record output in approved systems and redact tenant or infrastructure details when sharing it outside the operations team.

The most reliable troubleshooting habit is to identify which transition failed: discovery, registration, scheduling, container injection, or application initialization. That keeps a missing resource from being treated as an application bug and prevents a CUDA error from prompting an unnecessary cluster-wide plugin reinstall.

## Further reading

- [Kubernetes device plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

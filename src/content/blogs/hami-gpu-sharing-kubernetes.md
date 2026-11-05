---
title: "HAMi on Kubernetes: GPU Sharing Setup, Scheduling, and the Checks That Matter"
seoTitle: "HAMi GPU Sharing on Kubernetes: Setup and Scheduling"
description: "Plan a HAMi GPU-sharing rollout by checking version compatibility, advertised resources, scheduler and plugin health, and real workload behavior."
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

Giving every Pod a whole GPU is simple, but it can leave a lot of capacity unused when workloads are small. HAMi offers another option: share supported accelerators through Kubernetes, with scheduling and device-resource handling provided by its components.

Resource names, supported devices, and configuration fields vary by HAMi release and enabled plugins. Use the documentation for your installed version and inspect what your cluster advertises; a resource key copied from another cluster may not apply.

## Understand the components first

A sharing setup typically has a scheduler component and a device plugin or runtime integration. The scheduler makes placement decisions; the plugin or runtime makes the device available to the container. They must use the same resource model. If one side is missing or misconfigured, Pods may stay Pending or start without the expected device.

Before installing it, write down:

- The Kubernetes and HAMi versions.
- The supported GPU models and driver versions.
- The resource names and units advertised by the installed plugin.
- Whether device memory and compute limits are enforced, and how.
- Which namespaces and workloads are allowed to use shared devices.

Follow the chart or manifest instructions for the release you chose. Pin the versions and review configuration changes before rolling them out to production.

## Inspect advertised resources

After installation, check the node's allocatable resources:

```bash
kubectl describe node gpu-worker-01
kubectl get pods -A -o wide
```

Look for the resource keys your HAMi configuration is supposed to expose. Depending on the release and plugin, a workload may request a vendor GPU resource or a HAMi-specific one. The key's name does not tell you what isolation or limits it provides.

## Request the configured resource

Use the resource key and values actually advertised in your cluster. A manifest should declare those resources in the container's resource limits, for example:

```yaml
resources:
  limits:
    <resource-name-from-your-cluster>: 1
```

Replace the placeholder with a key from your installed version. Do not combine a resource name from one plugin with another scheduler's configuration. Consider quotas or admission controls if teams share the same pool.

## Test before onboarding workloads

Try a small, non-critical Pod before onboarding real workloads. Check that:

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

Use the namespace and Pod names from your installation. Scheduler and plugin logs may contain sensitive operational details, so follow your cluster's access and retention rules.

## Set expectations for shared devices

Sharing can improve utilization, but it is not the same as giving each workload a dedicated GPU. Check what the selected mode does about memory isolation, compute limits, device-memory accounting, and contention. Explain those limits to users, then watch utilization, memory pressure, and tail latency before increasing the sharing factor.

For a comparison with other approaches, see [whole GPUs, MIG, time-slicing, and HAMi](/blogs/gpu-scheduling-strategies-compared/).

## Plan the rollout around the actual cluster

Start with an inventory rather than an install command. Record each GPU node's model, driver version, Kubernetes version, container runtime, and any existing GPU Operator or device-plugin installation. This catches conflicts early: two components that both try to register devices or configure the same runtime can lead to confusing resource counts. Decide whether HAMi will manage the whole GPU pool or only a clearly separated set of nodes. Keep an existing production pool unchanged until a test pool passes validation.

Next, decide which workload classes are suitable for sharing. A small, intermittent development job may tolerate competition; a latency-sensitive service or an untrusted tenant may not. Write down what users can expect: whether memory is bounded, whether compute is capped, how other tenants affect latency, and what happens when a container exceeds its allocation. A resource limit is only meaningful if the installed implementation enforces it in the way your policy assumes. Review the current HAMi documentation for the exact mechanism, supported GPU types, and limitations; do not infer isolation guarantees from a resource's name.

Version compatibility is part of the design. Select a HAMi release that supports your Kubernetes version and GPU driver stack, pin chart and image versions, and keep the values file in version control. Avoid following a moving default branch for a production install. Review chart-rendered resources before applying them, paying particular attention to RBAC, node selectors, tolerations, service accounts, and privileged or host-mounted components. Apply changes to one pool first and keep a rollback path that does not require guessing which version was previously deployed.

## Confirm registration before scheduling a workload

After deployment, look at the whole chain rather than only checking whether the DaemonSet says Ready. Inspect node conditions and allocatable resources, then confirm that the resource key and quantity match the configuration you intended. Compare several nodes: a single healthy node does not prove that the plugin discovered devices consistently across models or driver versions. If resource quantities are absent or unexpected, inspect the device plugin's startup and discovery logs, its events, and the node's driver status before changing application manifests.

You can use a compact diagnostic sequence:

```bash
kubectl get nodes -o wide
kubectl describe node gpu-worker-01
kubectl get pods -A -o wide | grep -Ei 'hami|gpu'
kubectl get events -A --sort-by=.lastTimestamp
```

The commands are examples; labels, pod names, and namespaces differ. If the cluster's security policy disallows `grep` in an operator workflow, use its normal filtering and log collection tools. Record the initial resource inventory so a later configuration change can be compared against a known state.

Check scheduler and plugin health independently. A scheduler may be running but not have the expected configuration, while the plugin can publish resources that no scheduler integration is prepared to allocate. Read logs around startup and a test allocation, and correlate timestamps with Pod events. Avoid treating a successful placement as proof of device access: scheduling and container injection are separate stages.

## Build a controlled test matrix

Use a small non-critical namespace and a reproducible test image compatible with the host's driver/runtime setup. Begin with one Pod requesting exactly one advertised resource. Check that the Pod lands on a node where the resource is available, inspect its assigned device from inside the container, and run a lightweight operation that actually initializes the GPU. `nvidia-smi` can be useful on NVIDIA systems, but it does not demonstrate that a CUDA application is compatible or that the allocation policy is enforced.

Then test the boundaries you expect to support. Run two low-intensity Pods on the same eligible node and observe both allocations. Test a workload that requests more memory than the configured allowance only in a controlled environment and according to HAMi's documented behavior; do not induce failure on a shared production device. Verify whether the failure is rejected at admission, reported by the runtime, or occurs inside the workload. Those outcomes are operationally different and should be documented for users.

Include a placement-negative case. For example, request a resource that is unavailable in a test pool or use a selector that excludes all eligible nodes, then confirm that the Pod remains Pending with understandable events rather than silently falling back to an unintended device type. Remove the constraint and verify recovery. This checks both the scheduler's decision path and the clarity of your troubleshooting process.

Use a test table to keep evidence tied to the policy:

| Check | Evidence to collect | What it tells you |
| --- | --- | --- |
| Resource registration | Node allocatable values and plugin logs | Whether the plugin published the configured resource |
| Placement | Pod events and assigned node | Whether the scheduler found an eligible allocation |
| Device access | Container-level device query and application initialization | Whether runtime injection worked |
| Sharing behavior | Concurrent test results and device telemetry | Whether contention matches expectations |
| Recovery | Events and readiness after a controlled failure | Whether operators can diagnose and restore service |

Keep the test image, manifests, expected resource values, and observations together. If the operator or plugin is upgraded, rerun the relevant matrix rather than assuming old results still apply.

## Shape access and capacity policy

Resource exposure alone does not determine who may consume the pool. Use namespace quotas or admission policy where appropriate, and scope access with RBAC and namespace ownership. A quota can limit the number of advertised units a namespace requests; it does not necessarily limit total physical GPU utilization or guarantee a particular latency. Make that distinction explicit when teams request capacity. Ensure that policy covers Jobs, Deployments, and other workload controllers rather than only one manually tested Pod.

Node labels, affinity, and taints help separate shared devices from dedicated devices. Maintain labels through the node provisioning system rather than applying one-off labels by hand. A shared pool should not accidentally attract jobs that require dedicated memory or predictable throughput. Conversely, if only a subset of nodes can support the configured devices, constraints should make that explicit and failures should be visible in Pod events.

Capacity planning should use observed workload shape, not just the number of configured slices. Collect GPU utilization, memory use, allocation failures, queueing, application throughput, and tail latency over representative busy periods. Compare these signals by workload class. High utilization can be healthy if service objectives are met; low utilization may be appropriate for a latency-sensitive inference service. Do not increase a sharing factor just because some samples show an idle device.

## Troubleshoot by layer

When a Pod is Pending, inspect its events first. A message about an unavailable resource points toward a request-key mismatch, exhausted allocation, or a node constraint; it is not initially an application problem. Compare the Pod request with the node's allocatable key exactly, then inspect quota, selectors, taints, and scheduler logs. When the Pod starts but cannot see a device, focus on plugin health, runtime configuration, host-driver compatibility, and the image rather than repeatedly changing scheduling constraints.

If a Pod sees a device but runs slowly, gather concurrent workload information and telemetry before assuming a scheduler defect. Shared compute can vary with activity from other Pods; memory exhaustion and driver errors may look like application instability. Compare against a dedicated-device baseline where possible. If a node reports inconsistent quantities after a restart, inspect the plugin's discovery logs and operator reconciliation status, then verify the node's driver and device health. Capture relevant events before restarting components, since restarts can erase useful context.

Keep operational logs and diagnostic commands within your organization's access and retention rules. Pod logs and node details can expose workload names, tenant information, or infrastructure topology. Grant access to the minimum operators who need it and redact sensitive output before sharing an incident report.

## Operate upgrades and incidents deliberately

Schedule changes to the scheduler or plugin as infrastructure changes, not routine application deploys. Review release notes for changes to resource naming, configuration schema, supported devices, or runtime behavior. Test the new version on a representative node, compare its advertised resources, and run one allocation and contention test. Roll out in stages and monitor pending-Pod counts, GPU health, and workload service objectives after each step.

For incidents, make the first response safe and reversible. Stop admitting new shared workloads to an affected pool if allocations are unreliable; avoid evicting healthy tenants or changing GPU layout without understanding the impact. Collect node description, relevant events, scheduler and plugin logs, and a small set of device metrics. Communicate whether the issue affects placement, device access, or performance, since users can otherwise mistake a slow shared workload for a lost allocation.

The central operational rule is to advertise only what the installed stack can deliver and to validate that behavior under realistic concurrency. HAMi can make smaller workloads fit a GPU pool more efficiently, but it does not remove the need for capacity controls, compatibility testing, and clear service expectations.

## Further reading

- [HAMi documentation](https://project-hami.io/docs/userguide/configure)
- [HAMi GPU virtualization concepts](https://project-hami.io/docs/core-concepts/gpu-virtualization)
- [Kubernetes device plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

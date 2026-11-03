---
title: "How to Troubleshoot Pending GPU Pods in Kubernetes"
seoTitle: "Kubernetes Pending GPU Pods: Troubleshooting Guide"
description: "A GPU Pod is Pending? Start with its events, then check resource names, node constraints, and device-plugin health."
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

When a GPU Pod stays in `Pending`, it is tempting to edit its YAML until the scheduler accepts it. Resist that impulse. A Pod can be waiting because no node satisfies all of its requirements, because a namespace policy rejected its request, or because it has not progressed beyond scheduling for an entirely different reason. Start with evidence, identify which layer is blocking progress, and change one relevant condition at a time.

This guide follows the same order the Kubernetes control plane does: inspect the Pod and its events, check admission and quota, compare its requirements with eligible nodes, and only then investigate how the GPU resource is advertised.

## First identify what “Pending” means

The `Pending` phase covers more than one situation. A Pod may be accepted by the API but still have no node, or the scheduler may have selected a node while containers are waiting for image pulls, volumes, or startup. Check the `NODE` column and the detailed status before deciding which path to follow:

```bash
kubectl get pod <pod-name> -n <namespace> -o wide
kubectl describe pod <pod-name> -n <namespace>
```

If `NODE` is empty and events include `FailedScheduling`, focus on scheduler predicates: resources, selectors, affinity, taints, topology, and storage. If a node is named, read the container states and recent events. `ErrImagePull`, `ImagePullBackOff`, volume mount errors, and container runtime errors occur after placement; changing GPU scheduling policy will not fix them.

Also verify that you are looking at the intended Pod and namespace. A Deployment, Job, or custom controller can create replacement Pods with new names. Inspect its selector and desired replicas if the Pod you are watching disappears or is recreated.

## 1. Read the newest scheduling event

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace> --sort-by=.lastTimestamp
```

Look at the Pod's `Events` section, especially the newest `Warning` events and the scheduler's `FailedScheduling` message. Event text is a clue, not always a complete diagnosis: the scheduler can report several reasons across nodes, and messages may be aggregated. Record the timestamp, reason, and event message before making changes.

Typical clues include `Insufficient nvidia.com/gpu`, which suggests a resource name or capacity mismatch; `had untolerated taint`, which points to a missing toleration; and `didn't match Pod's node affinity/selector`, which suggests the selected pool does not match labels in the Pod. Messages about unbound immediate PersistentVolumeClaims or volume topology indicate storage constraints instead. If the event says the Pod violates quota or admission policy, the Pod may have been rejected or its request denied rather than merely waiting for a GPU.

Events have limited retention and may be noisy in a busy namespace. If the event has expired, reproduce the observation with a fresh Pod only when it is safe to do so, or check cluster event history and scheduler logs using your normal observability tools. Do not delete the original Pod before capturing its details; that removes useful evidence and may cause its controller to start another identical failing Pod.

## 2. Confirm the resource name

Inspect the Pod's requested resources and the GPU nodes:

```bash
kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{.spec.containers[*].resources}'
kubectl describe nodes
```

The resource key in the Pod must match one advertised by an eligible node. Whole GPUs, MIG profiles, and sharing plugins can use different keys. For example, asking for `nvidia.com/gpu` will not help if the node only advertises a MIG resource. Compare exact spelling and capitalization; an extended resource is not a generic request for “some GPU.”

Check node capacity and allocatable values, including the resource names:

```bash
kubectl get nodes -o wide
kubectl describe node <gpu-node>
kubectl get node <gpu-node> -o yaml
```

In the node description, inspect both `Capacity` and `Allocatable`. Capacity is the amount reported by the node; allocatable is what Kubernetes exposes for scheduling after system reservations and plugin accounting. Extended GPU resources are usually integer quantities. A request for one unit cannot be satisfied by a node with zero available units, even if a GPU is physically installed. Conversely, an advertised shared replica is a schedulable unit, not necessarily a whole physical card.

Resource requests are considered together. A node might have a free GPU but lack the CPU or host memory requested by the same Pod. Container requests contribute to Pod scheduling, and init-container resource behavior can affect the effective Pod request. Check the complete Pod specification rather than just the GPU line. If you have configured a limit without a separate request for an extended resource, Kubernetes uses the limit as its request; changing a CPU limit alone does not necessarily change the CPU request.

For Pods managed by a controller, inspect the template, not just the generated Pod. Update the Deployment or Job template so replacement Pods do not repeat the mismatch. Check admission-mutated resources too: a LimitRange or mutating webhook may add defaults that make the final admitted Pod different from the manifest you expected.

## 3. Check eligible nodes and all constraints

An available GPU does not automatically make a node eligible. First list the nodes in the intended pool and the labels the Pod relies on:

```bash
kubectl get nodes -L accelerator,nvidia.com/gpu.product
kubectl get pod <pod-name> -n <namespace> -o yaml
```

The example label in a query is optional and environment-specific. Kubernetes and GPU operators can provide labels, but label names depend on installed components and configuration. Verify that the node actually has the label and that its value matches the selector exactly. A `nodeSelector` is a hard requirement. Required node affinity is also hard; preferred affinity is a scoring preference and does not by itself make a node ineligible.

Review the Pod's complete set of placement constraints:

- Node selectors and required node affinity.
- Taints on GPU nodes and matching Pod tolerations.
- Namespace quotas and admission policies.
- Requested CPU and memory in addition to the GPU.
- Persistent-volume topology and other scheduling constraints.
- Pod affinity or anti-affinity, topology spread, and scheduling gates.

Tolerations and selectors are commonly confused. A toleration means a Pod may schedule onto a node with a matching taint; it does not select that node. A selector narrows the possible nodes but does not bypass a taint. Many GPU pools intentionally use both: a selector or required affinity to request the accelerator pool, and a toleration to be admitted onto its tainted nodes.

For storage, inspect the PVC and PV as well as the Pod event. A claim may still be unbound, its storage class may provision only in a different zone, or the volume's node affinity may conflict with the GPU pool. Check whether the workload really needs the volume before changing storage policy. Host networking, pod count limits, topology-spread constraints, and anti-affinity can also eliminate otherwise viable nodes.

Before removing a taint or relaxing production affinity, confirm that the workload is meant to run on that node pool. Broadly adding a toleration can send unrelated workloads to expensive machines; removing a selector might instead allow the job onto a node without the desired hardware. Make the smallest policy change that matches the workload's intent.

## 4. Verify quota, admission, and device-plugin health

If the resource is missing from node capacity, or its allocatable quantity is unexpectedly zero, inspect the device-plugin and GPU Operator health. First check whether the node is Ready and whether the plugin's DaemonSet has a healthy Pod on that specific node:

```bash
kubectl get pods -A -o wide | grep -Ei 'gpu|nvidia|device'
kubectl get daemonsets -A
kubectl describe node <gpu-node>
```

Use labels and namespaces appropriate to your installation; not every deployment names components “NVIDIA” or “GPU.” Read the plugin and operator events and logs, and compare with a known healthy node. A driver, container runtime, device-plugin, operator, or hardware health issue can stop devices from being advertised. The node may also be cordoned or under a condition that keeps it out of scheduling.

Check namespace accounting separately:

```bash
kubectl describe resourcequota -n <namespace>
kubectl get limitrange -n <namespace> -o yaml
```

A quota can cap the extended resource under a key such as `requests.nvidia.com/gpu`; the key must match the configured resource and the quota's accounting. Some policies require explicit requests or constrain which node pools a tenant may use. A quota error is not fixed by adding capacity to the node pool, and raising a quota does not create GPU capacity. Coordinate any quota change with the cluster owner.

Collect the Pod YAML, node description, events, and relevant plugin logs before restarting a DaemonSet or operator component. A restart can clear a transient fault, but it can also erase evidence or affect other workloads. Follow the operator's recovery procedure, especially on production nodes, and make one controlled change at a time.

## 5. Separate scheduling from container startup and application errors

Scheduling is only one part of the path. If the Pod has a node assigned but the container will not start, inspect status, events, and logs:

```bash
kubectl get pod <pod-name> -n <namespace> -o wide
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --all-containers
```

Once it starts, check that the device is visible from inside the container and the application can use it. A successful GPU assignment does not guarantee that the image, CUDA runtime, driver, and application work together. Use a small diagnostic workload approved for your environment if you need to separate image compatibility from application behavior. Compare the host driver version and the runtime requirements of the container without assuming that installing a toolkit in the image installs or replaces the host driver.

An application-level out-of-memory error is also different from a scheduling failure. Kubernetes typically schedules a GPU extended resource as a device unit; it does not infer a process's runtime memory footprint from that request. In a shared or time-sliced configuration, more than one process may later compete for device memory. In MIG or other partitioned setups, check the profile actually assigned and the limits the platform enforces. Once the Pod is running, correlate container logs and application metrics with GPU telemetry.

## A concise troubleshooting sequence

Use this sequence to keep the investigation reproducible:

1. Capture Pod YAML, phase, node assignment, and recent events.
2. Classify the problem: admission/quota, unscheduled Pod, post-scheduling startup, or application runtime.
3. If unscheduled, compare the Pod's exact resource key and complete requests with allocatable resources on eligible nodes.
4. Verify labels, required affinity, taints/tolerations, storage topology, and other hard constraints.
5. If the resource is absent or unhealthy, inspect node readiness and the device-plugin/operator on that node.
6. Make one targeted change, then watch a replacement Pod and verify the resulting placement.

After it schedules, check whether it landed on the intended pool and whether its observed runtime behavior matches the service objective. A technically schedulable Pod may still be poorly placed, particularly if it requires a certain GPU model, memory capacity, or network topology.

## What common symptoms usually indicate

The scheduler message is often the fastest route to a first hypothesis, but it helps to translate frequent symptoms into specific checks:

- **`Insufficient <gpu-resource>` on every candidate:** compare the exact key and requested quantity with each node's allocatable and currently assigned resources. A physically installed card is not schedulable until the node advertises it.
- **GPU available, but `Insufficient cpu` or `memory`:** review the full Pod request, including sidecars and init containers, and check remaining capacity on nodes that satisfy the other constraints.
- **Untolerated taint:** verify that the workload belongs on the tainted pool, then add a narrow toleration matching the intended key, value, and effect.
- **Node selector or affinity mismatch:** inspect actual labels, including spelling and value, and ensure the label source is applied to new nodes by provisioning automation.
- **Pod has a node but is not Ready:** read container waiting/terminated reasons, volume events, and logs. Investigate image access, mounts, runtime setup, and application compatibility rather than changing scheduler rules.
- **No useful events:** confirm the namespace and Pod identity, and determine whether a controller is recreating it. Check scheduling gates, admission, and cluster-level event retention.

These clues are not mutually exclusive: a Pod can have insufficient CPU on some nodes and an untolerated taint on others. Fix one blocker, then re-check events because another may become visible.

For background, see how [Kubernetes GPU device plugins](/blogs/kubernetes-gpu-device-plugin/) advertise resources and how [GPU node labels, taints, and affinity](/blogs/gpu-node-labels-taints-affinity/) affect placement.

## Further reading

- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes: Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)

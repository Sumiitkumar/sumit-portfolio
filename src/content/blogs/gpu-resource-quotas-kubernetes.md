---
title: "Kubernetes GPU Resource Quotas, Requests, and Limits"
seoTitle: "How to Configure GPU Resource Quotas in Kubernetes"
description: "Set Kubernetes GPU quotas without confusing a scheduled resource unit for a whole device, a memory limit, or a compute guarantee."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes Resource Management
tags:
  - Kubernetes
  - GPUs
  - Resource quotas
  - Platform engineering
draft: false
---

Before setting GPU quotas, work out what a “GPU unit” means in your cluster. Kubernetes treats extended resources as integer scheduling units; the device plugin defines whether a unit represents a whole GPU, a MIG instance, or a shared replica. A quota can limit how many such units a namespace requests, but does not reserve a physical device or create a memory limit. This distinction matters when multiple teams share an accelerator pool.

The same resource key can also mean different things on different node pools, so check each pool rather than relying on its name.

Think of accelerator capacity as three related but distinct controls: node allocatable resources determine what the scheduler can place; Pod requests consume schedulable units; namespace quotas cap what users may request. Admission policy can impose additional rules. For predictable multi-tenant operations, all of these need to use compatible resource names and a clear definition of the unit.

## Confirm the resource model before writing policy

List nodes and inspect the GPU-related entries under their capacity and allocatable resources:

```bash
kubectl describe node <gpu-node>
kubectl get nodes
```

Different node pools can advertise different keys, particularly when using MIG profiles or a sharing plugin. Record which key maps to which hardware model and allocation model. If the pool exposes a shared replica, calling its quota “number of GPUs” can mislead users; explain that it is a schedulable replica, not a guaranteed fraction of compute or device memory.

Extended resources are generally integer-valued and are not overcommitted by the Kubernetes scheduler in the same way as CPU requests. A resource name is part of the cluster's contract. The resource must be advertised by nodes and recognized in quota accounting for the workload to schedule. Consult documentation for the Kubernetes and device-plugin versions running in your cluster, because details can vary by resource type and configuration.

## Declare the resource in the workload

For an extended GPU resource, set a limit. Kubernetes uses it as the request if you do not set a separate request; when you set both, their values must match. Avoid putting a CPU or memory “GPU limit” in place of the extended-resource request: each resource category has separate accounting and semantics.

```yaml
resources:
  limits:
    <gpu-resource-key-advertised-by-your-cluster>: 1
```

Replace the placeholder with the resource shown in the node's allocatable resources. A conventional `nvidia.com/gpu` key is not correct for every MIG or sharing configuration.

The request is made at the container level and participates in the Pod's scheduling requirements. If more than one container needs a device, review the combined Pod resource behavior and the device plugin's allocation model. Sidecars can add CPU and memory requirements even if only one main container requests a GPU. Init containers can also affect effective requests under Kubernetes resource accounting, so inspect the rendered Pod rather than estimating from a single container.

An illustrative Pod might look like this, with placeholders replaced by values supported in the cluster:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-worker
spec:
  restartPolicy: Never
  containers:
    - name: worker
      image: example/worker:stable
      resources:
        requests:
          cpu: "2"
          memory: 8Gi
        limits:
          cpu: "4"
          memory: 12Gi
          nvidia.com/gpu: 1
```

The example's image and GPU key are illustrative. A production manifest should also include the namespace, image policy, security context, node placement, storage, and restart behavior appropriate to the workload. CPU and host-memory limits do not control GPU compute or video memory.

## Protect namespace capacity with quota

Use a ResourceQuota to cap how much of that resource a namespace can request:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-capacity
  namespace: ml-team
spec:
  hard:
    requests.nvidia.com/gpu: "2"
```

This quota works only if your cluster advertises and accounts for `nvidia.com/gpu` under that key. Confirm the resource name for your Kubernetes version and device plugin, then try the quota in a non-production namespace first.

For clusters that require explicit quota for extended resources, use the matching `requests.<resource-name>` key. Quota syntax and behavior should be validated against the cluster's Kubernetes version and the resource the plugin exposes. A quota with the wrong key may not constrain the intended resource, while a key the API server does not recognize may be rejected. Check with a test namespace and a small, safe request before rolling out policy to production teams.

Set quotas based on actual capacity and the intended fairness model. If several namespaces each receive a quota larger than total physical capacity, that can be intentional overcommit, but it does not reserve availability for all of them at once. If quotas sum to less than capacity, some capacity may remain unused unless a separate sharing arrangement allows other workloads to use it. A quota is a ceiling, not a reservation or guarantee that the scheduler can satisfy the request at a particular moment.

Inspect quota usage with:

```bash
kubectl describe resourcequota gpu-capacity -n ml-team
kubectl describe node <gpu-node>
```

`kubectl describe resourcequota` shows hard limits and current usage. Compare those values with Pod requests and node allocatable resources. A namespace may have quota remaining while no eligible node has capacity, or nodes may have spare units while a particular namespace has exhausted its allowance. These are different blockers and call for different changes.

Use the namespace on every diagnostic command so that you do not accidentally inspect another team's quota. For a controller-managed workload, quota applies to admitted Pods according to the resource accounting rules; deployment replicas can be rejected or remain unavailable if aggregate demand exceeds the namespace's hard limit. Check controller events as well as Pod events, and verify desired versus available replicas.

## Include other schedulable resources

GPU is only one of a Pod's scheduling requirements. It also needs CPU and host memory, and may be constrained by storage, affinity, or taints. A quota does not reserve a physical GPU for a team, promise a particular model, or limit device memory. Express those requirements separately with node pools, labels, admission policy, and workload requests.

Quota enforcement is separate from placement. A namespace quota that permits one GPU cannot express “one recent GPU with at least a particular memory size” unless the cluster's resource model exposes that as a distinct resource and policy. Node selectors, affinity, and taints can guide placement, but a GPU request is still needed to account for the device. Similarly, a quota cannot guarantee the availability zone or interconnect required by a workload.

Add quotas for CPU, memory, object counts, and other relevant resources where appropriate, and set sensible defaults with LimitRanges or admission policies. Remember that quotas can create confusing behavior if users submit a Pod without the request keys required by quota policy. The API server may reject it at admission, while a Pod that passes admission can still remain Pending for lack of an eligible node. Explain these failure modes in team guidance and include the exact commands for checking them.

## Make accounting understandable

Write down what one resource unit means in each pool. If it is a shared replica, say so plainly: it may not represent a fixed share of compute. Review quota usage, Pending Pods, and utilization together. Quotas limit what teams can request; node allocatable resources determine what can be scheduled. Publish limits together with a process for requesting quota changes, explaining which team owns the pool and how capacity is prioritized.

Avoid interpreting a namespace quota as a chargeback meter unless the accounting model accounts for the difference between requests, actual use, and hardware allocation. A team can hold a quota allocation without using it; another can have high device utilization while requesting only a small number of shared units. If showback matters, combine quota data with scheduler placement and telemetry while documenting what each measure represents.

Review quotas when node pools, device-plugin configuration, or sharing modes change. For example, changing a pool from whole-device allocation to a replica model can make the same integer hard limit represent a different level of contention. Plan the transition, communicate the changed semantics, and validate both workload manifests and existing ResourceQuota objects before migrating users.

## Test the failure path, not only the happy path

In a test namespace, verify that a correctly configured request is admitted and schedules when capacity exists. Then verify that a request over the quota is rejected with a clear error, and that a request within quota but beyond currently available node capacity stays unscheduled with an informative event. This demonstrates that quota and capacity are independent controls.

Also test the resource key each pool advertises, the effects of a node being cordoned or unavailable, and whether the workload's labels and tolerations select the intended nodes. A successful small Pod is not a full validation if its request differs from the production model or if it bypasses normal admission policy. Use representative manifests and a controlled maintenance window for tests that could consume scarce devices.

As a practical review, ask: Can the tenant request the correct resource? Does its namespace quota permit it? Is there allocatable capacity on a node matching the placement constraints? Are CPU, memory, storage, and other required resources also available? Does the quota represent the degree of isolation the team expects? These questions expose most configuration mismatches without confusing quota headroom with a schedulable device.

## Quota and capacity are separate

Imagine a team has a quota of two GPU units and has already requested one. The namespace has quota headroom for one more request. That does not mean another Pod can schedule: if every matching node has zero allocatable units remaining, it will still wait. In the reverse case, the node pool can have free devices while the namespace has exhausted quota; a new request can be denied before a scheduler considers placement.

When a user reports that a Pod cannot start, check both controls. `kubectl describe resourcequota` helps determine whether the namespace may request more. Pod events and node descriptions help determine whether eligible capacity exists. If quota is exhausted, a platform owner can decide whether to increase it based on policy. If capacity is exhausted, the team may need to wait, reduce demand, or add approved capacity. Raising quota only addresses the first condition.

This distinction matters even more when pools have different hardware. A namespace may have available quota for a general GPU but require a specialized node through affinity. If those nodes are full, quota headroom does not help. A resource key that distinguishes profiles can help account for capacity, but the platform must define and maintain that model consistently.

## Choose and communicate tenant allocation policy

Equal hard limits are simple but may not reflect team size or service criticality. Some organizations intentionally let aggregate namespace ceilings exceed physical capacity to improve utilization, accepting that every team cannot reach its maximum simultaneously. Others need reserved capacity or priority scheduling, which quota alone may not provide. State clearly whether a quota is only a ceiling or is backed by an actual reservation mechanism.

Store ResourceQuota objects alongside namespace configuration and review changes through the normal capacity-policy process. Document the key, unit semantics, maximum, owner, and procedure for requesting changes. Revisit quota objects when a device plugin changes advertised resources; an obsolete key can make policy ineffective or cause requests to fail. Show hard and used values beside allocatable capacity and pending demand, labeling shared replicas or MIG profiles accurately.

Validate behavior with a low-risk namespace before enabling a new policy broadly. Confirm that a valid request is admitted, an over-quota request receives a comprehensible error, and an in-quota request without node capacity remains pending with a scheduling explanation. These checks show that quota controls API admission while node resources control placement. They also reveal whether workload templates need to set explicit request values or match additional admission rules.

For node placement and resource mismatch failures, see the [GPU Pod troubleshooting checklist](/blogs/debugging-pending-gpu-pods/). Compare [sharing strategies](/blogs/gpu-scheduling-strategies-compared/) before defining what a quota unit promises to tenants.

## Further reading

- [Kubernetes: Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Kubernetes: Extended resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources)

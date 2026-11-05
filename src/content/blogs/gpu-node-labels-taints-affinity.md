---
title: "Kubernetes GPU Nodes: Labels, Taints, and Affinity Without the Guesswork"
seoTitle: "Kubernetes GPU Node Labels, Taints, and Affinity"
description: "Keep GPU workloads on the right Kubernetes nodes by using labels, taints, tolerations, affinity, and resource requests for distinct jobs."
pubDate: 2026-11-02
author: Sumit Kumar
category: Kubernetes Scheduling
tags:
  - Kubernetes
  - GPUs
  - Node affinity
  - Scheduling
draft: false
---

GPU nodes cost more and often serve a narrower set of workloads than general-purpose workers. Labels and affinity help select the right nodes; taints and tolerations help keep unrelated Pods off them. None of these replaces a GPU resource request. Reliable placement uses each mechanism for its intended job: extended resources express accelerator capacity, selectors or affinity express node requirements, and taints with tolerations protect pools from workloads that do not opt in.

These settings are easy to confuse because all of them influence placement. A Pod with a GPU request can still land on the wrong model if the cluster advertises several GPU types. A Pod that tolerates a GPU-node taint can still land on a general worker if there is no selector. Conversely, a selector can identify the GPU pool, but a taint may prevent the Pod from scheduling there until a matching toleration is added.

This distinction also helps make troubleshooting concrete. If no eligible node remains, inspect node labels, taints, and all hard constraints. If the Pod is placed but cannot access a GPU, inspect the advertised resource and device-plugin state. If the Pod works but performs poorly, confirm the GPU model and isolation mode rather than assuming that a label alone guarantees a device characteristic.

## Give nodes a clear, stable identity

Use labels your node provisioning process will keep consistent. A dedicated pool might use `accelerator=nvidia`, for example. Avoid depending on labels that can disappear during a node replacement or upgrade. Define labels in the system that creates or configures nodes, and verify that replacements receive them before workloads depend on them.

Separate a broad pool label from labels that express hardware capability. A pool label can identify nodes intentionally reserved for accelerator workloads; model or memory labels can distinguish nodes when a workload genuinely requires those traits. Avoid encoding every application preference into labels if it can be expressed as a resource request or a soft scheduling preference. Keep names documented and use consistent values such as `true` or a model identifier rather than several near-synonyms.

Some GPU operators or node-feature discovery tools publish hardware labels. Those can be useful for selecting a GPU generation or product, but their names and lifecycle depend on the component and configuration. Check actual node labels and the relevant product documentation rather than copying a label key from another cluster. For scheduling decisions that affect security or availability, labels should be managed by trusted administrators; Kubernetes' NodeRestriction admission plugin can limit kubelet control over certain protected label domains when configured.

Inspect labels and taints with:

```bash
kubectl get nodes --show-labels
kubectl describe node <gpu-node>
```

Use the API as the source of truth when verifying a particular key:

```bash
kubectl get nodes -L accelerator
kubectl get node <gpu-node> -o jsonpath='{.metadata.labels}'
```

The `-L` option provides a quick view of one label across nodes. Empty output for a node may mean the key is absent, not that its value is an empty string matching your expectation. Compare the exact key and value in the Pod manifest with the node metadata.

## Use a taint to protect scarce nodes

To stop general-purpose Pods from landing on a dedicated GPU pool by default, taint its nodes:

```bash
kubectl taint nodes <gpu-node> accelerator=nvidia:NoSchedule
```

The taint blocks Pods without a matching toleration. Adding the toleration only makes a Pod eligible; it does not tell the scheduler to choose that node. Taints have effects with different behavior: `NoSchedule` blocks new placement, `PreferNoSchedule` is a preference rather than a hard block, and `NoExecute` can also evict existing Pods that do not tolerate it. Use the effect that matches the operational intent.

A toleration must match the taint key, operator/value rules, and effect as intended. A toleration with `operator: Exists` can match more broadly than `Equal`; broad tolerations should be deliberate, not copied blindly. A toleration also does not grant authorization to use the GPU or override quotas. Admission policies, RBAC, and resource quotas remain separate controls.

Apply and remove taints through your node lifecycle tooling when possible, so a replacement node does not silently lose pool protection. If manually changing a node during diagnosis, note that the change may not persist and could be overwritten by an autoscaler or operator. Never remove a production taint solely to make one Pod schedule until you have confirmed the Pod is permitted to use the pool.

## Combine scheduling policy with a GPU request

```yaml
spec:
  nodeSelector:
    accelerator: nvidia
  tolerations:
    - key: accelerator
      operator: Equal
      value: nvidia
      effect: NoSchedule
  containers:
    - name: inference
      image: example/inference:stable
      resources:
        limits:
          nvidia.com/gpu: 1
```

Replace the example label, taint, image, and resource key with the values used in your cluster. The `nodeSelector` narrows the node pool, the toleration lets the Pod pass the taint, and the resource request asks for an advertised GPU unit. All three are needed only when your pool uses all three policies; do not add a toleration or selector just because a sample contains one.

For several acceptable hardware classes, required node affinity can express alternatives or more complex matching than a single `nodeSelector`. Required affinity is a hard constraint; preferred affinity influences scoring but may still allow the scheduler to select another eligible node. A `nodeSelector` combined with node affinity is conjunctive: the selected node must satisfy both. If a preference becomes an unintended hard requirement, or vice versa, Pods can either remain pending or land on a less suitable pool.

Use a complete, valid Pod template in a manifest rather than relying on imperative edits to an individual Pod. For example, a Deployment template can combine its label selector and tolerations with a GPU request, while a Job may specify backoff and parallelism appropriate to batch execution. Use the exact resource key exposed by the intended pool. If a shared plugin exposes replicas, a request for one replica should not be documented as a guarantee of one entire physical GPU.

Remember that a scheduling selector does not itself verify GPU capacity. The resource request is what makes Kubernetes account for the extended resource. Without it, a Pod that tolerates the taint and selects the pool could consume CPU and memory on a GPU node without reserving any advertised GPU unit. That can lead to accidental placement and confusing capacity reports.

## Diagnose unschedulable combinations

When a Pod stays Pending, read its scheduling event before changing policy:

```bash
kubectl describe pod <pod-name>
kubectl get nodes -L accelerator
kubectl describe node <gpu-node>
```

A node can have a healthy GPU and still be excluded by a typo in a label, a missing toleration, the wrong resource key, or insufficient CPU or memory. Keep node-pool labels, taints, and workload templates together in version control so they stay in sync.

Read `FailedScheduling` events and compare each hard requirement with the nodes that are candidates. A single workload may be excluded by several independent rules. For example, two nodes may have enough GPU capacity but lack the required label, while another matches the label but has an untolerated taint. Changing only the GPU count cannot resolve either mismatch. Check namespace quota and PVC binding as well: an event can reveal a storage or policy blocker even when GPU scheduling was the original concern.

When debugging, inspect the resulting Pod rather than assuming the source template rendered as expected. Admission webhooks, Helm values, Kustomize overlays, and operators can alter the final spec. For controller-managed workloads, fix the declarative source and let the controller replace Pods rather than hand-editing a generated Pod that will be recreated.

## Choose between hard and soft placement

Make a requirement hard only when violating it would make the workload fail or violate policy. Use required affinity or a selector for mandatory properties, such as a compatible GPU pool, and use preferred affinity for a desirable but nonessential location. If only one pool meets a genuine hardware requirement, a hard rule makes the intent explicit and creates a clear Pending state when capacity is unavailable.

Soft preferences can improve balance without making a workload unschedulable when a preferred pool is full. However, the scheduler may ignore a preference if other constraints or scoring produce a different placement. Verify the actual node after scheduling when placement matters. Do not rely on a preferred label to guarantee a GPU generation, locality, or isolation level.

For workloads with topology needs, node-level affinity is only one part of the solution. A label may identify a class of node without expressing which GPU is closest to another device or whether the desired interconnect path is available. If distributed training depends on GPU-to-GPU or GPU-to-network topology, use a supported topology-aware scheduling mechanism and validate its behavior.

## Keep placement policy maintainable

Treat labels, taints, and Pod templates as a shared interface between platform and application teams. Document who owns each label, what each value means, and which pool changes are safe. Validate manifests in CI with schema checks and policy tests, and test a representative Pod after node-image or operator upgrades. A test should verify not only that the Pod reaches `Running`, but also that it lands on the expected node class and sees the expected device.

Avoid one-off labels that no controller maintains. Autoscaling can create fresh nodes that lack manual configuration, and a label that is added after node registration may arrive too late for a workload relying on it. If labels are security-sensitive, ensure only trusted automation can set them and that the cluster's admission configuration protects them appropriately.

## Example: separate accelerator pools

Suppose one pool serves general GPU workloads and another has a specific model required by an inference application. The general pool might carry `accelerator=nvidia`; the specialized pool might additionally carry a trusted model label such as `gpu-class=serving-model`. The inference Pod can use required affinity for the specialized label, request the resource key advertised there, and tolerate that pool's taint. A flexible batch job might require only the general label and prefer the specialized pool when available.

This makes compatibility a hard rule for inference and a soft preference for batch. The serving job stays Pending rather than silently landing on unsuitable hardware, while the batch job can fall back if that matches its performance needs. The resource key may also distinguish hardware profiles, depending on how the plugin advertises them. Define labels and resource names from the actual cluster, not this illustration.

## Validate placement policy

Test a Pod that should be admitted, one that should be excluded from a reserved pool, and a case where the preferred pool has no capacity. Confirm the selected node and allocated resource, not only that the Pod reaches `Running`. Include autoscaled node creation if applicable; a policy that works on existing nodes may fail on replacements.

For production, consider admission checks that reject known-invalid combinations, such as a GPU workload without an approved resource request or a tenant tolerating a pool reserved for another service class. Keep the rules understandable and test them against generated manifests. Policy should prevent accidental use without making normal scheduling errors impossible to diagnose.

For a quick review of a manifest, trace the decisions from broad to specific: which pool is allowed, which node properties are mandatory, which taints the Pod tolerates, and which extended resource it requests? Then compare each answer with real node metadata and allocatable resources. This simple review catches most mistakes caused by copying a template from a different cluster or GPU operator configuration.

If a workload still cannot be placed, compare its resource request with the [GPU Pod scheduling checklist](/blogs/debugging-pending-gpu-pods/). Node selection alone does not guarantee a particular GPU interconnect; see [GPU topology-aware scheduling](/blogs/kubernetes-gpu-topology-aware-scheduling/) for that distinction.

## Further reading

- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes: Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)

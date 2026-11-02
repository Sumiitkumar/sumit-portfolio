# Blog SEO Audit

**Scope:** All 11 published Markdown articles in `src/content/blogs/`, plus the unpublished `first-post.md` draft. Published slugs and publication dates are preserved. The audit reflects a code and content review, not live Search Console, backlink, traffic, or rank data.

## Site-wide findings

- The Astro Content Collection validates article titles, SEO titles, descriptions, dates, authors, categories, tags, draft status, and optional cover-image/alt-text fields. Published article pages render canonical URLs, Open Graph and Twitter metadata, BlogPosting JSON-LD, and BreadcrumbList JSON-LD.
- Article-specific SEO titles are used for page and social metadata; the visible article title remains the H1 and structured-data headline. Author and category metadata are explicit in article frontmatter. No article cover images are present, so the shared author portrait remains the social-card fallback.
- The sitemap and RSS feed include published posts only; the sitemap uses `updatedDate` when present. The DNS article's modification date is recorded as 2026-11-02; other posts retain their existing dates.
- GPU articles have topic-relevant official references and contextual links to related articles. Their shared tags also produce related-article links. The DNS article has no closely related published article, so a forced internal cross-link would be irrelevant.
- No published article includes an article-specific featured image. The shared social-card image is the author's portrait, not a subject image. Consider original technical diagrams or screenshots with descriptive alt text and optimized dimensions; do not use unrelated stock images.
- Code blocks already scroll horizontally and article text wraps on narrow screens. The DNS symptom table is now horizontally scrollable on mobile; page-specific scripts are limited to shared analytics, AMP/auto-ads, and the theme toggle, so run Lighthouse against deployment before drawing Core Web Vitals conclusions.
- E-E-A-T: articles use the same named author as site metadata and structured data, and technical posts cite vendor or Kubernetes documentation. No personal production incidents, credentials, or benchmark results were invented. Add first-hand testing evidence only when it can be documented and reproduced.
- Ten GPU articles are concise (roughly 340–540 words each). They are useful focused guides, but the audit does not recommend padding them. Where search intent needs more depth, add verified version-specific manifests, reproducible outputs, and troubleshooting evidence rather than generic prose.
- Search rankings cannot be guaranteed. Indexing, competition, backlinks, and Search Console performance are outside this repository's validation.

## Keyword overlap and topic clusters

- The GPU strategy comparison targets the broad evaluation query; the HAMi, MIG, and time-slicing articles target their own implementation and trade-off queries. The shared GPU terminology is intentional, and contextual links connect the cluster without treating the methods as equivalent.
- The Pending GPU Pod checklist focuses on scheduler events and eligibility. The device-plugin article focuses on hardware discovery and resource advertisement. Their adjacent intents overlap, but the distinct diagnostic stages and links reduce duplication.
- Node labels/taints cover node selection and access; the topology article covers intra-node/inter-node hardware constraints. Keep these distinctions in titles, intros, and future expansions.
- The DNS/CoreDNS guide is a separate topic cluster. There is no relevant published DNS article to link to; do not add unrelated links just to increase internal-link counts.

## Article-by-article audit

### 1. Sharing GPUs on Kubernetes with HAMi

- **URL:** `/blogs/hami-gpu-sharing-kubernetes/`
- **Original title:** Sharing GPUs on Kubernetes with HAMi
- **Recommended SEO title:** Share GPUs on Kubernetes with HAMi | Sumit Kumar
- **Meta description:** An operator-focused introduction to HAMi GPU sharing: scheduler integration, device visibility, resource requests, and safe rollout checks.
- **Primary keyword:** HAMi GPU sharing on Kubernetes
- **Secondary keywords:** Kubernetes GPU virtualization, HAMi scheduler, GPU resource requests, GPU device plugin
- **Long-tail queries:** How to share GPUs with HAMi on Kubernetes; how to verify HAMi GPU resources; what to check before enabling GPU sharing
- **Intent / audience:** Informational and operational; Kubernetes platform engineers and GPU cluster operators.
- **Quality and accuracy:** Correctly avoids presenting resource names or isolation guarantees as universal. The placeholder resource key is safer than an unverified example. Readers may still need a tested release-specific install and Pod manifest.
- **Internal links:** Links to the strategy comparison and official HAMi/Kubernetes documentation.
- **Missing sections:** A version-pinned install walkthrough and a verified example from one selected HAMi release would close the setup gap.
- **Image SEO:** No in-article image; shared author portrait is not a HAMi-specific social image. An original architecture diagram could help if accurately maintained.
- **Priority:** Medium — useful niche guide; expand only with tested, version-specific configuration.

### 2. NVIDIA MIG on Kubernetes: Profiles, Requests, and Trade-offs

- **URL:** `/blogs/nvidia-mig-kubernetes/`
- **Original title:** NVIDIA MIG on Kubernetes: Profiles, Requests, and Trade-offs
- **Recommended SEO title:** NVIDIA MIG on Kubernetes: Profiles & Scheduling
- **Meta description:** Learn how Multi-Instance GPU partitions appear as Kubernetes resources and how to plan profiles, requests, and operational changes.
- **Primary keyword:** NVIDIA MIG on Kubernetes
- **Secondary keywords:** Multi-Instance GPU, MIG profiles, GPU Operator MIG, Kubernetes GPU resources
- **Long-tail queries:** How to request an NVIDIA MIG profile in Kubernetes; how MIG profiles appear as Kubernetes resources; how to troubleshoot a Pending MIG Pod
- **Intent / audience:** Informational and technical; operators evaluating MIG or troubleshooting profile allocation.
- **Quality and accuracy:** Correctly notes hardware and profile dependence, cluster-advertised resource names, and possible disruption when changing layouts. Resource naming examples are illustrative, not guaranteed.
- **Internal links:** Links to time-slicing and the strategy comparison, plus NVIDIA and Kubernetes documentation.
- **Missing sections:** A profile-selection example tied to a named GPU/Operator release would help readers choose among profiles.
- **Image SEO:** No article image. An original profile-layout diagram would be useful only if it matches the hardware and release being discussed.
- **Priority:** Medium — technically cautious; deepen with verified, hardware-specific examples.

### 3. NVIDIA GPU Time-Slicing in Kubernetes

- **URL:** `/blogs/nvidia-gpu-time-slicing/`
- **Original title:** NVIDIA GPU Time-Slicing in Kubernetes
- **Recommended SEO title:** NVIDIA GPU Time-Slicing on Kubernetes | Sumit Kumar
- **Meta description:** A practical guide to Kubernetes GPU time-slicing, replica resources, workload behavior, and the isolation limits operators should understand.
- **Primary keyword:** NVIDIA GPU time-slicing in Kubernetes
- **Secondary keywords:** NVIDIA device plugin, GPU replicas, shared GPU, GPU memory isolation
- **Long-tail queries:** How NVIDIA GPU time-slicing works in Kubernetes; do time-sliced GPU replicas isolate memory; how to configure GPU sharing replicas
- **Intent / audience:** Informational and implementation-oriented; GPU cluster operators assessing shared access.
- **Quality and accuracy:** Clearly distinguishes advertised replicas from guaranteed compute shares and hardware isolation. The YAML is explicitly conceptual, avoiding a misleading drop-in configuration.
- **Internal links:** Links to the comparison and contention guides, plus NVIDIA and Kubernetes documentation.
- **Missing sections:** A version-specific ConfigMap and rollout/rollback procedure would satisfy readers seeking exact setup steps.
- **Image SEO:** No article image; a timeline or resource-sharing diagram could clarify scheduling versus execution.
- **Priority:** Medium — strong caveats; add versioned configuration only after validating it against the deployed plugin.

### 4. Whole GPUs vs MIG vs Time-Slicing vs HAMi

- **URL:** `/blogs/gpu-scheduling-strategies-compared/`
- **Original title:** Whole GPUs vs MIG vs Time-Slicing vs HAMi
- **Recommended SEO title:** Kubernetes GPU Scheduling Strategies Compared
- **Meta description:** Compare common Kubernetes GPU allocation strategies by isolation, utilization, scheduling behavior, and operational complexity.
- **Primary keyword:** Kubernetes GPU scheduling strategies
- **Secondary keywords:** whole GPU allocation, NVIDIA MIG, GPU time-slicing, HAMi
- **Long-tail queries:** MIG vs time-slicing for Kubernetes; HAMi vs NVIDIA time-slicing; which GPU sharing strategy should I use
- **Intent / audience:** Comparative investigation; platform teams and engineers selecting an allocation model.
- **Quality and accuracy:** Distinguishes dedicated, partitioned, and shared access without asserting benchmark results or universal guarantees. The comparison is qualitative, not a performance benchmark.
- **Internal links:** Links to each strategy's implementation guide and official vendor/Kubernetes docs.
- **Missing sections:** A concise comparison matrix of isolation, compatibility, and operational trade-offs would make the decision intent faster to scan.
- **Image SEO:** No article image; a simple original comparison diagram could support the decision process.
- **Priority:** Medium — high-value topic cluster entry; add a summary matrix backed by current official documentation.

### 5. Why Is My GPU Pod Pending? A Kubernetes Troubleshooting Checklist

- **URL:** `/blogs/debugging-pending-gpu-pods/`
- **Original title:** Why Is My GPU Pod Pending? A Kubernetes Troubleshooting Checklist
- **Recommended SEO title:** Troubleshoot Pending GPU Pods in Kubernetes
- **Meta description:** Trace a Pending GPU workload through resource advertisement, scheduling events, node constraints, and device-plugin health.
- **Primary keyword:** Kubernetes GPU Pod Pending
- **Secondary keywords:** insufficient GPU resources, GPU device plugin troubleshooting, Kubernetes scheduling events
- **Long-tail queries:** Why is my Kubernetes GPU Pod Pending; how to check GPU allocatable resources; GPU Pod has insufficient nvidia.com/gpu
- **Intent / audience:** Troubleshooting; Kubernetes application developers and cluster operators.
- **Quality and accuracy:** Gives a sound diagnostic order and distinguishes scheduling from container startup. Command output is not fabricated; adding real expected event examples would improve diagnosis.
- **Internal links:** Links to device-plugin and node-placement articles, with Kubernetes scheduling references.
- **Missing sections:** Add a verified set of common scheduler event messages with interpretation and remediation.
- **Image SEO:** No article image; a small decision tree could improve scanability but is not required.
- **Priority:** High — direct troubleshooting intent; add verified event examples and outputs.

### 6. Kubernetes GPU Device Plugins: From Driver to Pod

- **URL:** `/blogs/kubernetes-gpu-device-plugin/`
- **Original title:** Kubernetes GPU Device Plugins: From Driver to Pod
- **Recommended SEO title:** Kubernetes GPU Device Plugins Explained | Sumit Kumar
- **Meta description:** Follow the GPU device-plugin path from host driver discovery to Node allocatable resources and container device injection.
- **Primary keyword:** Kubernetes GPU device plugin
- **Secondary keywords:** NVIDIA device plugin, kubelet device plugin, GPU allocatable resources, GPU Operator
- **Long-tail queries:** How does a Kubernetes GPU device plugin work; why is nvidia.com/gpu missing from a node; how does a GPU reach a Pod
- **Intent / audience:** Explanatory and troubleshooting; cluster operators and Kubernetes learners.
- **Quality and accuracy:** The high-level discovery path is consistent with the Kubernetes device-plugin model. It appropriately warns that a Running plugin Pod alone does not establish device health.
- **Internal links:** Links to pending-Pod troubleshooting and GPU scheduling, with upstream device-plugin documentation.
- **Missing sections:** A resource lifecycle diagram or a verified `capacity`/`allocatable` output example would strengthen the explanation.
- **Image SEO:** No article image; an original device-plugin-to-Pod flow diagram is a relevant opportunity.
- **Priority:** Medium — sound overview; add a sourced lifecycle diagram or concrete node output.

### 7. GPU Node Labels, Taints, and Affinity in Kubernetes

- **URL:** `/blogs/gpu-node-labels-taints-affinity/`
- **Original title:** GPU Node Labels, Taints, and Affinity in Kubernetes
- **Recommended SEO title:** Kubernetes GPU Node Labels, Taints & Affinity
- **Meta description:** Keep GPU workloads on the right Kubernetes nodes using labels, taints, tolerations, and resource requests without confusing their roles.
- **Primary keyword:** Kubernetes GPU node scheduling
- **Secondary keywords:** GPU node labels, taints and tolerations, node affinity, GPU nodeSelector
- **Long-tail queries:** How to schedule GPU Pods on labeled nodes; how to keep non-GPU Pods off GPU nodes; GPU nodeSelector and toleration example
- **Intent / audience:** How-to; Kubernetes administrators configuring specialized node pools.
- **Quality and accuracy:** Correctly explains that a toleration permits placement but does not attract a Pod, and that labels do not request a GPU. The example uses explicit placeholders where environment values vary.
- **Internal links:** Links to Pending GPU troubleshooting and topology scheduling, with Kubernetes placement documentation.
- **Missing sections:** A short verification example showing node labels and Pod events would improve closure.
- **Image SEO:** No article image; no image-specific defect.
- **Priority:** Medium — practical and accurate; could add a verified output-based troubleshooting example.

### 8. GPU Resource Requests, Limits, and Quotas in Kubernetes

- **URL:** `/blogs/gpu-resource-quotas-kubernetes/`
- **Original title:** GPU Resource Requests, Limits, and Quotas in Kubernetes
- **Recommended SEO title:** Kubernetes GPU Resource Quotas and Limits
- **Meta description:** Make GPU capacity predictable with correct extended-resource requests, namespace quotas, and checks for shared-resource accounting.
- **Primary keyword:** Kubernetes GPU resource quota
- **Secondary keywords:** extended GPU resources, GPU requests and limits, namespace quota, GPU capacity accounting
- **Long-tail queries:** How to set a GPU quota in Kubernetes; ResourceQuota for nvidia.com/gpu; do Kubernetes GPU quotas reserve a device
- **Intent / audience:** Configuration and policy; platform engineers managing multi-tenant clusters.
- **Quality and accuracy:** Correctly distinguishes integer extended resources from physical isolation and explains that quota does not reserve a specific device. The quota example is appropriately scoped to clusters advertising that resource key.
- **Internal links:** Links to pending-Pod troubleshooting and the strategy comparison, with Kubernetes quota/resource docs.
- **Missing sections:** A tested quota manifest plus `kubectl describe resourcequota` output would clarify accounting for readers.
- **Image SEO:** No article image; no image-specific defect.
- **Priority:** Medium — add a validated quota walkthrough if the article is expanded.

### 9. GPU Memory and Compute Contention in Shared Kubernetes Clusters

- **URL:** `/blogs/gpu-memory-and-compute-contention/`
- **Original title:** GPU Memory and Compute Contention in Shared Kubernetes Clusters
- **Recommended SEO title:** Shared GPU Memory and Compute Contention
- **Meta description:** Why a successfully scheduled shared-GPU Pod can still fail, slow down, or run out of device memory—and what to monitor.
- **Primary keyword:** shared GPU memory and compute contention
- **Secondary keywords:** GPU memory pressure, GPU noisy neighbor, DCGM Exporter, Kubernetes GPU monitoring
- **Long-tail queries:** Why does a shared GPU Pod run out of memory; how to monitor GPU contention in Kubernetes; does time-slicing isolate GPU memory
- **Intent / audience:** Diagnostic and operational; teams running shared inference or development workloads.
- **Quality and accuracy:** Correctly separates Kubernetes scheduling from live utilization and uses no invented benchmarks. Monitoring advice is general; exact metric names and collection labels vary by exporter version.
- **Internal links:** Links to time-slicing and the allocation comparison, with NVIDIA telemetry documentation.
- **Missing sections:** An example dashboard or verified DCGM metric query could make monitoring advice actionable.
- **Image SEO:** No article image; an original signal-to-symptom diagram or dashboard screenshot could help.
- **Priority:** Medium — good conceptual treatment; add version-verified metrics only if maintained.

### 10. GPU Topology-Aware Scheduling for Kubernetes Workloads

- **URL:** `/blogs/kubernetes-gpu-topology-aware-scheduling/`
- **Original title:** GPU Topology-Aware Scheduling for Kubernetes Workloads
- **Recommended SEO title:** Kubernetes GPU Topology-Aware Scheduling
- **Meta description:** Plan GPU placement for multi-GPU and distributed jobs using node selection, device topology, and Kubernetes scheduling constraints.
- **Primary keyword:** Kubernetes GPU topology-aware scheduling
- **Secondary keywords:** GPU NUMA topology, NVLink placement, multi-GPU scheduling, Kubernetes node affinity
- **Long-tail queries:** How to schedule multi-GPU workloads on Kubernetes; does node affinity select GPUs by NVLink topology; how to check GPU topology on a Kubernetes node
- **Intent / audience:** Technical planning; operators running multi-GPU training or distributed inference.
- **Quality and accuracy:** Appropriately warns that labels select nodes but do not guarantee an intra-node device topology. The title's “topology-aware” framing may imply built-in scheduler behavior; the content clarifies that actual support depends on plugins and configuration.
- **Internal links:** Links to labels/affinity and the device-plugin overview, with Kubernetes and NVIDIA documentation.
- **Missing sections:** Add verified hardware inspection commands and an explicit distinction between Kubernetes Topology Manager and GPU-device placement.
- **Image SEO:** No article image; an original node/device topology diagram would be relevant.
- **Priority:** Medium — clarify topology mechanisms with version-specific evidence before deeper implementation claims.

### 11. Kubernetes DNS Troubleshooting: CoreDNS, Services, and Fixes

- **URL:** `/blogs/troubleshoot-kubernetes-dns/`
- **Original title:** Kubernetes DNS Troubleshooting: CoreDNS, Services, and Fixes
- **Recommended SEO title:** Kubernetes DNS Troubleshooting: CoreDNS and Pods
- **Meta description:** A practical Kubernetes DNS troubleshooting guide with kubectl, nslookup, CoreDNS logs, Services, EndpointSlices, and NetworkPolicy examples.
- **Primary keyword:** Kubernetes DNS troubleshooting
- **Secondary keywords:** CoreDNS troubleshooting, Kubernetes Service DNS, DNS timeout in Pod, Kubernetes NetworkPolicy DNS
- **Long-tail queries:** How to debug CoreDNS in Kubernetes; Pod cannot resolve a Kubernetes Service; how to allow DNS through Kubernetes NetworkPolicy
- **Intent / audience:** Step-by-step troubleshooting; application developers and cluster administrators.
- **Quality and accuracy:** The diagnostic sequence separates name resolution, Service endpoints, network policy, and external forwarding. The NetworkPolicy example correctly cautions that labels and CNI enforcement vary. Validate diagnostic image/tool availability in the reader's cluster before relying on `dig` or `nc`.
- **Internal links:** Official Kubernetes and CoreDNS references are included. No closely related published article currently exists; adding a forced GPU-topic link would be irrelevant.
- **Missing sections:** A real failure/output example would add useful evidence.
- **Image SEO:** No in-article image; a resolver-flow diagram could help but is optional.
- **Priority:** Low — the most complete article in this set; retain as a strong troubleshooting pillar and validate commands when dependencies change.

## Unpublished draft

`/blogs/first-post/` is not published because its frontmatter sets `draft: true`. Its title, description, and body are boilerplate placeholders, so it has no meaningful keyword target or search intent. Keep it excluded from indexing and the feeds; replace it with a real article only when publication is requested. No SEO metadata changes were made to this draft.

## Technical references checked

- [Kubernetes: Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Kubernetes: Device Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
- [Kubernetes: Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Kubernetes: Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
- [Kubernetes: Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
- [Kubernetes: Debugging DNS Resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
- [Kubernetes: Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [NVIDIA Kubernetes device plugin](https://github.com/NVIDIA/k8s-device-plugin)
- [NVIDIA GPU Operator with MIG](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-mig.html)
- [HAMi documentation](https://project-hami.io/docs/)
- [NVIDIA DCGM Exporter](https://docs.nvidia.com/datacenter/dcgm/latest/gpu-telemetry/dcgm-exporter.html)

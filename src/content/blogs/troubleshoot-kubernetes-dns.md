---
title: "Kubernetes DNS Troubleshooting: CoreDNS, Services, and Pods"
seoTitle: "Kubernetes DNS Troubleshooting: CoreDNS, Services & Pods"
description: "Commands and checks for tracking a failed Kubernetes DNS lookup from a Pod through CoreDNS, Services, and network policy."
pubDate: 2026-10-19
updatedDate: 2026-11-03
author: Sumit Kumar
category: Kubernetes Troubleshooting
tags:
  - Kubernetes
  - DNS
  - CoreDNS
  - DevOps
draft: false
---

A healthy Pod can still fail to reach another Service because DNS is not working. The clues vary: `no such host`, `NXDOMAIN`, a DNS timeout, or a name that resolves but still cannot connect.

The checks below start where the failure happens: inside the affected Pod. From there, follow the lookup through CoreDNS and check the Service, endpoints, and network policy. Examples use `cluster.local`, but some clusters use a different DNS domain.

## Contents

- [How Kubernetes DNS works](#how-kubernetes-dns-works)
- [1. Reproduce DNS from inside the affected Pod](#1-reproduce-dns-from-inside-the-affected-pod)
- [2. Check the name, namespace, and Service type](#2-check-the-name-namespace-and-service-type)
- [3. Separate DNS resolution from application connectivity](#3-separate-dns-resolution-from-application-connectivity)
- [4. Inspect CoreDNS health and logs](#4-inspect-coredns-health-and-logs)
- [5. Check NetworkPolicy rules for DNS traffic](#5-check-networkpolicy-rules-for-dns-traffic)
- [6. Troubleshoot external DNS separately](#6-troubleshoot-external-dns-separately)
- [Quick symptom guide](#quick-symptom-guide)
- [A practical troubleshooting checklist](#a-practical-troubleshooting-checklist)
- [Further reading](#further-reading)

## How Kubernetes DNS works

Most clusters run CoreDNS behind the `kube-dns` Service in `kube-system`. Pods get a resolver configuration that sends DNS queries to that Service. CoreDNS answers cluster names and can forward public-domain lookups to upstream resolvers.

A normal Service named `catalog` in the `shop` namespace typically has this fully qualified domain name (FQDN):

```text
catalog.shop.svc.cluster.local
```

Inside `shop`, the short name `catalog` is usually enough. From another namespace, use `catalog.shop` or the full name. Search domains make short names work, but testing the FQDN first removes guesswork.

## 1. Reproduce DNS from inside the affected Pod

Run the lookup from the affected workload if you can. A laptop test does not tell you what DNS settings or network policies apply inside the Pod.

If the application image does not include DNS tools, use a temporary debug Pod in the same namespace:

```bash
kubectl run dns-debug \
  -n <namespace> \
  --image=registry.k8s.io/e2e-test-images/dnsutils:1.3 \
  --restart=Never \
  --command -- sleep 3600
```

Run a lookup for the Service that is failing:

```bash
kubectl exec -n <namespace> dns-debug -- nslookup catalog.shop.svc.cluster.local
```

You can also inspect the resolver configuration and query with `dig`:

```bash
kubectl exec -n <namespace> dns-debug -- cat /etc/resolv.conf
kubectl exec -n <namespace> dns-debug -- dig catalog.shop.svc.cluster.local
kubectl exec -n <namespace> dns-debug -- dig kubernetes.default.svc.cluster.local
```

The `kubernetes.default` lookup is a useful control. If that fails too, look at cluster DNS or Pod-to-DNS connectivity before investigating the application Service.

Pay attention to the whole response, not just whether `nslookup` printed an address. `dig` shows the status, responding server, and query time. `NXDOMAIN` means the queried name was not found; `SERVFAIL` means a resolver could not complete the lookup; a timeout means the client did not get a reply in time. Those point to different places in the path. Try the same fully qualified name twice, then compare it with the control lookup. A single failure can be transient, but repeated results help narrow it down.

If UDP queries time out, compare with TCP:

```bash
kubectl exec -n <namespace> dns-debug -- \
  dig +tcp catalog.shop.svc.cluster.local
```

This is a diagnostic comparison, not a fix. If TCP works and UDP does not, check network policy, firewall rules, and the CNI path for UDP port 53. DNS can use TCP as well as UDP, so allowing only one transport can leave some lookups unreliable.

Remove the temporary Pod when you are done:

```bash
kubectl delete pod dns-debug -n <namespace>
```

## 2. Check the name, namespace, and Service type

First make sure the Service exists where you think it does:

```bash
kubectl get service catalog -n shop
kubectl get service catalog -n shop -o yaml
```

Short names are namespace-relative. A Pod in `payments` looking up `catalog` searches `payments`; it will not automatically look in `shop`. Try the namespace-qualified name:

```bash
kubectl exec -n <namespace> dns-debug -- nslookup catalog.shop
```

Check the Service type too. A ClusterIP Service normally resolves to its virtual IP. A headless Service (`clusterIP: None`) resolves to endpoint addresses, so its DNS answers depend more directly on the backing Pods and readiness settings.

Also inspect the Pod's `/etc/resolv.conf`. The `search` entries and `options ndots` explain how short names are expanded. If the cluster uses a custom DNS domain, use the domain configured by that cluster instead of assuming `cluster.local`.

The search list can make a short name issue several queries before the one you expected. For example, a name with fewer dots than the `ndots` setting may be tried against each search suffix first. Compare the short name with the FQDN, and check the resolver settings in the affected Pod rather than assuming every namespace or workload has identical DNS configuration.

Some applications use the system resolver differently from `dig` or `nslookup`. If command-line lookups succeed but the application still fails, try the same name through the runtime or language the application uses, and check whether it caches DNS answers. Also check the exact name in the application's configuration: a typo, an unexpected trailing dot, or a stale environment variable can look like a cluster DNS problem.

## 3. Separate DNS resolution from application connectivity

DNS resolving is only the first check. It does not prove that the application is listening, that the Service has ready endpoints, or that network policy allows the connection.

Inspect the Service selector and EndpointSlices:

```bash
kubectl get service catalog -n shop -o yaml
kubectl get endpointslices -n shop \
  -l kubernetes.io/service-name=catalog
kubectl get pods -n shop --show-labels
```

For a ClusterIP Service, DNS can return the virtual IP even when there are no ready endpoints behind it. If the lookup works but the connection fails, compare the Service selector with the Pod labels and check Pod readiness.

With a headless Service, missing or unexpected endpoints can also mean missing DNS answers. Check readiness and confirm whether `publishNotReadyAddresses` is set as intended.

When inspecting a Service, compare its `port` and `targetPort` with the port the application actually listens on. DNS returns a name or address; it does not validate those port settings. A typo in the Service selector can leave it with no EndpointSlices, while a correct selector can still select Pods that are not Ready. Check both the Service and its selected Pods before changing DNS.

Test the Service port from the debug Pod after resolving the name:

```bash
kubectl exec -n <namespace> dns-debug -- sh -c 'nc -vz catalog.shop.svc.cluster.local 8080'
```

Replace `8080` with the Service port. If your debug image does not include `nc`, use an approved diagnostic image that does, or test with the application's own client.

## 4. Inspect CoreDNS health and logs

Check the `kube-dns` Service, CoreDNS Pods, and the Service's EndpointSlices:

```bash
kubectl get service kube-dns -n kube-system -o wide
kubectl get pods -n kube-system -l k8s-app=kube-dns -o wide
kubectl get endpointslices -n kube-system \
  -l kubernetes.io/service-name=kube-dns
```

The label varies by distribution. If that selector finds nothing, list the Pods and use the labels your cluster actually applies:

```bash
kubectl get pods -n kube-system --show-labels
```

Review CoreDNS logs for plugin errors, failed upstream lookups, or repeated timeouts:

```bash
kubectl logs -n kube-system -l k8s-app=kube-dns \
  --all-containers=true --tail=100
```

If CoreDNS Pods are restarting or not Ready, check their events and resource use. `kubectl top` works only when the metrics API is available:

```bash
kubectl describe pods -n kube-system -l k8s-app=kube-dns
kubectl top pods -n kube-system
```

Restarting CoreDNS may temporarily change the symptoms, but it will not fix an invalid configuration, resource pressure, or blocked traffic. Look for the cause first.

If lookups fail only during busy periods, check whether CoreDNS is under load. Look at CPU and memory use, restarts, request latency, and error metrics if your CoreDNS configuration exposes them. The `prometheus` plugin and metrics endpoint are configuration-dependent, so do not assume metrics are available on every cluster. Compare failures across nodes and namespaces too; a problem limited to one node may point to its local network or DNS cache rather than every CoreDNS replica.

Check the Corefile before changing it:

```bash
kubectl get configmap coredns -n kube-system -o yaml
```

Look for the `kubernetes` plugin, any custom zones, and the `forward` destination. The Corefile format and ConfigMap name can vary by distribution. Save the current configuration and follow your platform's rollout procedure before editing it. A syntactically valid change can still break name resolution for the whole cluster.

## 5. Check NetworkPolicy rules for DNS traffic

With default-deny egress, the application Pod may not be able to reach cluster DNS. DNS usually uses UDP port 53, and can use TCP port 53 for larger replies or fallback. Check whether your CNI enforces NetworkPolicy, then inspect policies that select the Pod:

```bash
kubectl get networkpolicies -n shop
kubectl describe networkpolicy -n shop
```

For example, this policy lets Pods in `shop` query CoreDNS Pods in `kube-system`:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: shop
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
```

The namespace and Pod labels in this example are common defaults, not guaranteed values. Confirm the CoreDNS Pod labels in your cluster before applying it. NetworkPolicy rules are additive, so this DNS allow rule does not replace the other egress rules your application needs.

Some clusters use NodeLocal DNSCache. Then `/etc/resolv.conf` may point to a node-local IP rather than the `kube-dns` Service. Make sure your policy allows traffic to the resolver the Pod actually uses.

If only some Pods are affected, compare a working Pod and a failing one: namespace, labels, service account, node, resolver configuration, and NetworkPolicies. Check policies in both the workload namespace and any cluster-specific network controls. A broad allow rule may hide the issue, so identify which rule selects the Pod and which destination it permits before changing policy. If the Pod is on a different node, repeat the lookup there; node-local agents and firewall rules can differ across pools.

## 6. Troubleshoot external DNS separately

If Service names resolve but public hostnames do not, cluster DNS is at least partly working. Check the CoreDNS logs and Corefile to see where external queries go:

```bash
kubectl get configmap coredns -n kube-system -o yaml
```

The ConfigMap name and Corefile depend on the installation. A `forward` plugin often sends queries to the resolvers in the CoreDNS Pod's `/etc/resolv.conf`. Check that CoreDNS can reach them and that node-level DNS works. Before editing the Corefile, identify which query fails and where it is forwarded.

## Quick symptom guide

| Symptom | First checks |
| --- | --- |
| `NXDOMAIN` for a Service | Service name, namespace, Service type, and FQDN |
| `kubernetes.default` also fails | Pod resolver config, `kube-dns` Service, CoreDNS Pods, and network policy |
| Name resolves but connection times out | Service port, EndpointSlices, readiness, application listener, and traffic policy |
| Cluster names work, public names fail | CoreDNS forwarding, upstream resolver health, and egress rules |
| Intermittent failures | CoreDNS restarts or saturation, packet drops, DNS cache behavior, and node-local DNS |

## Before changing the configuration

1. Reproduce the lookup from the affected Pod or namespace.
2. Test both the failing FQDN and `kubernetes.default.svc.cluster.local`.
3. Read `/etc/resolv.conf` and confirm the search domains and nameserver.
4. Verify the Service name, namespace, type, selector, and EndpointSlices.
5. Check the `kube-dns` Service, CoreDNS Pods, logs, and events.
6. Inspect egress NetworkPolicies and the resolver path used by the cluster.
7. Test the application port only after DNS resolution succeeds.

This order helps separate a bad name from a Service, CoreDNS, network-policy, or application problem. It is also a good way to avoid restarting CoreDNS before you know what failed.

## Further reading

- [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
- [CoreDNS Kubernetes plugin](https://coredns.io/plugins/kubernetes/)

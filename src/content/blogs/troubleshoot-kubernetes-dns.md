---
title: "Kubernetes DNS Troubleshooting: CoreDNS, Services, and Fixes"
description: "A practical Kubernetes DNS troubleshooting guide with kubectl, nslookup, CoreDNS logs, Services, EndpointSlices, and NetworkPolicy examples."
pubDate: 2026-10-19
tags:
  - Kubernetes
  - DNS
  - CoreDNS
  - DevOps
draft: false
---

A Kubernetes application can be healthy and still fail because it cannot find another Service. Symptoms often look like application errors: `no such host`, `NXDOMAIN`, DNS timeouts, or a connection timeout after a name resolves.

This guide walks through a repeatable way to troubleshoot Kubernetes DNS. It starts inside the affected Pod, follows the request to CoreDNS, and then checks Service records, endpoints, and network policy. The examples use the common cluster domain `cluster.local`; your cluster may use a different domain.

## How Kubernetes DNS works

Kubernetes runs a cluster DNS service, commonly CoreDNS, behind the `kube-dns` Service in the `kube-system` namespace. Pods receive a DNS configuration that points queries to that Service IP. CoreDNS answers names for Kubernetes Services and can forward external names to upstream resolvers.

A normal Service named `catalog` in the `shop` namespace typically has this fully qualified domain name (FQDN):

```text
catalog.shop.svc.cluster.local
```

From a Pod in the same namespace, `catalog` is usually enough. From another namespace, use `catalog.shop` or the full FQDN. The Pod's search domains make shorter names convenient, but the FQDN is the best first test because it avoids ambiguity.

## 1. Reproduce DNS from inside the affected Pod

Test from the failing workload whenever possible. DNS configuration and network policies can differ between namespaces and Pods, so a test from your laptop does not prove that a Pod can resolve the same name.

If the application image has no DNS tools, start a temporary debug Pod:

```bash
kubectl run dns-debug \
  --image=registry.k8s.io/e2e-test-images/dnsutils:1.3 \
  --restart=Never \
  --command -- sleep 3600
```

Run a lookup for the Service that is failing:

```bash
kubectl exec dns-debug -- nslookup catalog.shop.svc.cluster.local
```

You can also inspect the resolver configuration and query with `dig`:

```bash
kubectl exec dns-debug -- cat /etc/resolv.conf
kubectl exec dns-debug -- dig catalog.shop.svc.cluster.local
kubectl exec dns-debug -- dig kubernetes.default.svc.cluster.local
```

The last lookup is a useful control test. If `kubernetes.default.svc.cluster.local` also fails, investigate cluster DNS or Pod-to-DNS connectivity before focusing on the application Service.

Remove the temporary Pod when you are done:

```bash
kubectl delete pod dns-debug
```

## 2. Check the name, namespace, and Service type

Confirm that the Service exists in the namespace you expect:

```bash
kubectl get service catalog -n shop
kubectl get service catalog -n shop -o yaml
```

A common mistake is looking up a short name from the wrong namespace. A Pod in `payments` that queries `catalog` searches `payments` first; it does not automatically search `shop`. Try the namespace-qualified name:

```bash
kubectl exec dns-debug -- nslookup catalog.shop
```

Check whether the Service is a standard ClusterIP Service or a headless Service (`clusterIP: None`). A standard Service normally resolves to its ClusterIP. A headless Service resolves to endpoint addresses, so its answers depend more directly on the backing Pods and readiness settings.

Also inspect the Pod's `/etc/resolv.conf`. The `search` entries and `options ndots` explain how short names are expanded. If the cluster uses a custom DNS domain, use the domain configured by that cluster instead of assuming `cluster.local`.

## 3. Separate DNS resolution from application connectivity

A successful DNS lookup only proves that a name resolved. It does not prove that the application is listening, that the Service selector matches ready Pods, or that traffic is allowed.

Inspect the Service selector and EndpointSlices:

```bash
kubectl get service catalog -n shop -o yaml
kubectl get endpointslices -n shop \
  -l kubernetes.io/service-name=catalog
kubectl get pods -n shop --show-labels
```

For a standard ClusterIP Service, DNS can return the ClusterIP even when the Service has no ready endpoints. In that case, name resolution works but connections usually fail. Check that the Service selector matches the intended Pod labels and that the Pods are Ready.

For a headless Service, missing or unexpected endpoints can also explain missing DNS answers. Check readiness and whether `publishNotReadyAddresses` is configured intentionally.

Test the Service port from the debug Pod after resolving the name:

```bash
kubectl exec dns-debug -- sh -c 'nc -vz catalog.shop.svc.cluster.local 8080'
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

The label can vary by distribution. If the selector returns no Pods, list the namespace and use the labels that your cluster actually applies:

```bash
kubectl get pods -n kube-system --show-labels
```

Review CoreDNS logs for plugin errors, failed upstream lookups, or repeated timeouts:

```bash
kubectl logs -n kube-system -l k8s-app=kube-dns \
  --all-containers=true --tail=100
```

If CoreDNS Pods are restarting or not Ready, inspect their events and resource use:

```bash
kubectl describe pods -n kube-system -l k8s-app=kube-dns
kubectl top pods -n kube-system
```

A restart is not a diagnosis. First look for the underlying cause, such as an invalid configuration, resource pressure, or blocked network traffic.

## 5. Check NetworkPolicy rules for DNS traffic

If the namespace has default-deny egress, the application Pod may be unable to reach cluster DNS. DNS usually uses UDP port 53 and may use TCP port 53 for larger responses or fallback. Verify your CNI enforces NetworkPolicy and inspect policies that select the affected Pod:

```bash
kubectl get networkpolicies -n shop
kubectl describe networkpolicy -n shop
```

A policy like the following allows Pods in `shop` to query CoreDNS Pods in `kube-system`:

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

Some clusters use NodeLocal DNSCache. In that setup, Pods may query a node-local IP shown in `/etc/resolv.conf` instead of the `kube-dns` Service IP. Adapt the policy and troubleshooting steps to the resolver your Pods actually use.

## 6. Troubleshoot external DNS separately

If a Kubernetes Service resolves but a public hostname does not, cluster-local DNS is at least partly working. Check CoreDNS logs and its Corefile to see how external queries are forwarded:

```bash
kubectl get configmap coredns -n kube-system -o yaml
```

The ConfigMap name and Corefile vary by installation. A `forward` plugin commonly sends external queries to the resolvers listed in the CoreDNS Pod's `/etc/resolv.conf`. Verify those upstream resolvers are reachable from CoreDNS and that node-level DNS is healthy. Avoid changing the Corefile until you have identified which query is failing and where it is being forwarded.

## Quick symptom guide

| Symptom | First checks |
| --- | --- |
| `NXDOMAIN` for a Service | Service name, namespace, Service type, and FQDN |
| `kubernetes.default` also fails | Pod resolver config, `kube-dns` Service, CoreDNS Pods, and network policy |
| Name resolves but connection times out | Service port, EndpointSlices, readiness, application listener, and traffic policy |
| Cluster names work, public names fail | CoreDNS forwarding, upstream resolver health, and egress rules |
| Intermittent failures | CoreDNS restarts or saturation, packet drops, DNS cache behavior, and node-local DNS |

## A practical troubleshooting checklist

1. Reproduce the lookup from the affected Pod or namespace.
2. Test both the failing FQDN and `kubernetes.default.svc.cluster.local`.
3. Read `/etc/resolv.conf` and confirm the search domains and nameserver.
4. Verify the Service name, namespace, type, selector, and EndpointSlices.
5. Check the `kube-dns` Service, CoreDNS Pods, logs, and events.
6. Inspect egress NetworkPolicies and the resolver path used by the cluster.
7. Test the application port only after DNS resolution succeeds.

Following this order helps isolate whether the issue is name construction, Kubernetes Service discovery, CoreDNS, network policy, or the application itself. It also avoids masking the real cause with a blind CoreDNS restart.

## Further reading

- [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
- [CoreDNS Kubernetes plugin](https://coredns.io/plugins/kubernetes/)

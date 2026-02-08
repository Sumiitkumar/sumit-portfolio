import React, { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Docker overlayfs Orphan Size",
    summary: "Learn what overlayfs orphan size means in Docker, why it grows, and how to manage disk usage in container environments.",
    url: "#docker-overlayfs-orphan-size",
  },
  {
    id: 2,
    title: "Kubernetes Scheduler: How Pods Get Placed",
    summary: "A deep dive into the Kubernetes scheduler, pod placement strategies, and how to influence scheduling for reliability and performance.",
    url: "#kubernetes-scheduler",
  },
  {
    id: 3,
    title: "Kafka for DevOps Engineers: Patterns & Practices",
    summary: "How Apache Kafka fits into modern DevOps workflows, with real-world use cases for observability, event-driven automation, and scaling.",
    url: "#kafka-for-devops",
  },
];

const Blog = () => {
  const [openId, setOpenId] = useState(null);
  const blogContent = {
    1: (
      <>
        <p className="mb-4">Docker uses overlayfs for its storage backend. The <b>orphan size</b> refers to disk space used by deleted files that are still referenced by running containers. This can cause disk usage to grow unexpectedly, especially on busy hosts.</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Orphan size increases when containers delete files that are still open.</li>
          <li>To reclaim space, restart or remove containers holding deleted files.</li>
          <li>Monitor with <code>docker system df</code> and <code>du</code> on overlay2 dirs.</li>
        </ul>
        <p>Regularly prune unused containers and images to keep orphan size under control.</p>
      </>
    ),
    2: (
      <>
        <p className="mb-4">The <b>Kubernetes scheduler</b> decides which node each pod runs on. It considers resource requests, node taints/tolerations, affinity/anti-affinity, and custom rules.</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Default scheduling is based on available CPU/memory and node selectors.</li>
          <li>Pod affinity/anti-affinity lets you group or separate workloads.</li>
          <li>Custom schedulers and priorities can be used for advanced placement.</li>
        </ul>
        <p>Understanding the scheduler helps you design reliable, efficient clusters.</p>
      </>
    ),
    3: (
      <>
        <p className="mb-4"><b>Apache Kafka</b> is a distributed event streaming platform. For DevOps engineers, Kafka is used for:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Centralized logging and observability pipelines</li>
          <li>Event-driven automation (triggering builds, deployments, alerts)</li>
          <li>Buffering and decoupling microservices</li>
        </ul>
        <p>Kafka’s durability and scalability make it ideal for modern cloud-native architectures.</p>
      </>
    ),
  };

  return (
    <section id="blog" className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-6 py-16">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-green-600">Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Insights and tutorials on Kubernetes, DevOps, and cloud engineering.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-green-50 border border-green-200 rounded-xl p-6 shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-green-700 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.summary}</p>
              <button
                className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => setOpenId(post.id)}
              >
                Read More
              </button>
            </div>
          ))}
        </div>

        {/* Modal for blog content */}
        {openId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-8 shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-green-600 hover:text-green-800 text-2xl font-bold"
                onClick={() => setOpenId(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-4 text-green-700">{blogPosts.find(p => p.id === openId).title}</h3>
              <div className="text-gray-800 text-base">
                {blogContent[openId]}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;

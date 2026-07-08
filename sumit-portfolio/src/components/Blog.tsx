'use client'

export default function Blog() {
  const blogs = [
    {
      title: 'Kubernetes Best Practices',
      date: 'March 2024',
      description: 'Guide to implementing production-ready Kubernetes clusters with security and efficiency.',
      link: '#'
    },
    {
      title: 'Multi-cloud Strategy',
      date: 'February 2024',
      description: 'Lessons learned from managing infrastructure across AWS, GCP, and Azure.',
      link: '#'
    },
    {
      title: 'GitOps for Teams',
      date: 'January 2024',
      description: 'How to implement GitOps practices to improve deployment reliability and team collaboration.',
      link: '#'
    }
  ]

  return (
    <section id="blog" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Blog</h2>
        <div className="mt-8 space-y-6">
          {blogs.map((blog) => (
            <a
              key={blog.title}
              href={blog.link}
              className="block rounded-lg border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 hover:text-blue-600">{blog.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{blog.date}</p>
                  <p className="mt-2 text-sm text-slate-700">{blog.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

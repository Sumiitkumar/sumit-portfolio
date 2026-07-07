'use client'

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">About me</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Modern platform engineering with enterprise reliability.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            I am Sumit Kumar, a cloud native platform engineer with 3 years of experience building resilient infrastructure, automation systems, and agentic AI workflows. I help teams accelerate delivery across Kubernetes, multi-cloud, and GitOps environments.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Core strengths</p>
              <ul className="mt-4 space-y-3 text-slate-700 text-sm">
                <li>Cloud architecture</li>
                <li>Kubernetes & GitOps</li>
                <li>Infrastructure automation</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Focus areas</p>
              <ul className="mt-4 space-y-3 text-slate-700 text-sm">
                <li>Reliable deployment pipelines</li>
                <li>Observability and SRE</li>
                <li>Secure multi-cloud delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

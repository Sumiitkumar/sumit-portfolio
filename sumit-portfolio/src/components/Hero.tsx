'use client'

export default function Hero() {
  return (
    <section id="home" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 sm:text-5xl">Sumit Kumar</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700">
          I'm a cloud platform engineer. My work focuses on building Kubernetes-based automation, 
          multi-cloud delivery systems, and agentic AI-enabled workflows for resilient operations. 
          You can find my resume <a href="https://drive.google.com/uc?export=download&id=1Cmb9HhzKhbM5c_q6GEDuU5H8idpwMODS" className="text-blue-600 hover:underline">here</a>.
        </p>
      </div>
    </section>
  )
}

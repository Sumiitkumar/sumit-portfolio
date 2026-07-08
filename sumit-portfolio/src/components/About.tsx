'use client'

export default function About() {
  return (
    <section id="about" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">About</h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700">
          With 3 years of experience in cloud-native engineering, I specialize in designing and implementing 
          scalable infrastructure solutions. My expertise spans Kubernetes orchestration, multi-cloud platforms, 
          CI/CD automation, and infrastructure-as-code practices.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          I'm passionate about building robust platforms that empower teams and enable efficient operations 
          at scale. When not coding, I enjoy exploring emerging technologies in distributed systems and AI-enabled automation.
        </p>
      </div>
    </section>
  )
}

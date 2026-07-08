'use client'

export default function Skills() {
  const skillCategories = [
    {
      category: 'Cloud Platforms',
      skills: ['AWS', 'GCP', 'Azure', 'Kubernetes']
    },
    {
      category: 'DevOps & Automation',
      skills: ['Docker', 'Terraform', 'Helm', 'ArgoCD', 'GitOps']
    },
    {
      category: 'Programming',
      skills: ['Python', 'Go', 'Bash', 'TypeScript']
    },
    {
      category: 'Tools & Technologies',
      skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Jenkins', 'GitHub Actions']
    }
  ]

  return (
    <section id="skills" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Skills</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div key={category.category}>
              <h3 className="text-base font-semibold text-slate-900">{category.category}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

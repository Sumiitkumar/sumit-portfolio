'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Layers } from 'lucide-react'
import { Card } from './ui/card'

const skillGroups = [
  {
    title: 'Cloud',
    tags: ['AWS', 'Azure', 'GCP'],
  },
  {
    title: 'Containers',
    tags: ['Docker', 'Kubernetes', 'Helm'],
  },
  {
    title: 'Infrastructure as Code',
    tags: ['Terraform', 'CloudFormation', 'Ansible'],
  },
  {
    title: 'CI/CD',
    tags: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD'],
  },
  {
    title: 'Monitoring',
    tags: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'],
  },
  {
    title: 'Programming',
    tags: ['Python', 'Bash', 'Go'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Technical Skills</p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Cloud-native tooling with enterprise-grade polish.</h2>
          <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600">
            A curated skillset for platform engineering, cloud automation, and observability. Each area is designed to reflect both technical depth and hiring team relevance.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
            >
              <Card className="rounded-[2rem] p-8">
                <div className="mb-6 inline-flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-slate-500">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    {index % 2 === 0 ? <Cpu className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                  </span>
                  {group.title}
                </div>
                <div className="grid gap-4">
                  {group.tags.map((tag) => (
                    <div key={tag} className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-slate-300 hover:bg-slate-100">
                      <div>
                        <p className="text-base font-medium text-slate-900">{tag}</p>
                        <p className="mt-1 text-sm text-slate-500">Specialized expertise</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-secondary transition group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

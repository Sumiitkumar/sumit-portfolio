'use client'

import { motion } from 'framer-motion'
import { CalendarDays, Briefcase, Layers } from 'lucide-react'

const timeline = [
  {
    company: 'CloudOps Labs',
    role: 'Platform Engineer',
    duration: '2023 - Present',
    bullets: [
      'Built a GitOps-driven platform for Kubernetes clusters across AWS, GCP, and Azure.',
      'Automated blue/green deployments and policy enforcement with ArgoCD and OPA.',
      'Designed agentic AI workflows for automated runbook generation and incident response.',
    ],
    tech: ['Kubernetes', 'Terraform', 'ArgoCD', 'Prometheus', 'Grafana'],
  },
  {
    company: 'InfraScale Systems',
    role: 'DevOps Engineer',
    duration: '2021 - 2023',
    bullets: [
      'Designed multi-account AWS infrastructure using Terraform modules and IaC best practices.',
      'Implemented automated rollback and monitoring alerts to improve platform reliability.',
      'Migrated critical services to containerized microservices with EKS and Helm.',
    ],
    tech: ['AWS', 'EKS', 'Terraform', 'Docker', 'Jenkins'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden px-6 py-24 lg:px-14">
      <div className="absolute left-0 bottom-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-0 top-16 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-muted">Experience</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">3 years of cloud native delivery.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/70">
            Roles that shaped my cloud native, GitOps, and agentic AI platform engineering experience across Kubernetes and multi-cloud environments.
          </p>
        </div>

        <div className="space-y-10">
          {timeline.map((item, idx) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: idx * 0.1 }}
              className="glass-panel rounded-[2rem] border border-white/10 p-8 shadow-float"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.28em] text-secondary">{item.duration}</p>
                  <h3 className="text-3xl font-semibold text-white">{item.role}</h3>
                  <p className="text-base text-white/75">{item.company}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted">
                  <CalendarDays className="h-4 w-4 text-primary" /> {item.duration}
                </div>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
                <div>
                  <ul className="space-y-4 text-white/75">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-4 leading-7">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-[#08101E] p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-muted">Technologies used</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.tech.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

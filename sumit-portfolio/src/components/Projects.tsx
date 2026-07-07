'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Layers } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card'

const projects = [
  {
    title: 'Kubernetes Deployment Platform',
    summary: 'Built a scalable Kubernetes deployment platform with EKS, multi-tenant namespaces, and GitOps lifecycle management for rapid cloud delivery.',
    impact: 'Reduced deployment cycle time by 60% and standardized platform onboarding for engineering teams.',
    tech: ['AWS', 'EKS', 'Terraform', 'Helm', 'ArgoCD'],
    github: '#',
    live: '#',
  },
  {
    title: 'GitOps Deployment System',
    summary: 'Created a GitOps pipeline with ArgoCD, policy-as-code, and drift detection that enforced compliance across staging and production.',
    impact: 'Improved deployment safety and auditability with automated rollback policies and policy validation.',
    tech: ['GitHub Actions', 'ArgoCD', 'OPA', 'Kubernetes'],
    github: '#',
    live: '#',
  },
  {
    title: 'Multi-Cloud Infrastructure',
    summary: 'Engineered unified infrastructure templates that deployed consistent networking, security, and observability across AWS, Azure, and GCP.',
    impact: 'Enabled cross-cloud resiliency while reducing infrastructure drift and environment sprawl.',
    tech: ['Terraform', 'Azure', 'GCP', 'AWS', 'Vault'],
    github: '#',
    live: '#',
  },
  {
    title: 'Personal Portfolio & Kubernetes Deployment',
    summary: 'A modern portfolio built with Next.js, Tailwind CSS, and Framer Motion, deployed on Kubernetes for resilient self-hosted delivery.',
    impact: 'Improved personal brand visibility and demonstrated platform deployment and operational experience.',
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Kubernetes'],
    github: 'https://github.com/Sumiitkumar/sumit-portfolio',
    live: '#',
  },
  {
    title: 'AI Agent Troubleshooting',
    summary: 'Built an AI troubleshooting assistant that analyzes logs, surfaces root causes, and recommends remediation steps for production incidents.',
    impact: 'Accelerated incident resolution and reduced mean time to repair by providing contextual AI-guided diagnostics.',
    tech: ['Python', 'LangChain', 'OpenAI', 'Kubernetes', 'Prometheus'],
    github: '#',
    live: '#',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Projects</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Premium engineering showcase.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
            High-impact cloud and platform projects with architecture-led solutions and strong business outcomes.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
            >
              <Card className="rounded-[2rem] p-8">
                <CardHeader className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Project</p>
                    <CardTitle className="mt-3 text-slate-900">{project.title}</CardTitle>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                    <Layers className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardDescription className="text-slate-600 leading-7">{project.summary}</CardDescription>
                <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Business impact</p>
                  <p className="mt-3 text-slate-700 leading-7">{project.impact}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Technologies</p>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tag) => (
                      <Badge key={tag} className="bg-slate-100 text-slate-700">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-200">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-200">
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

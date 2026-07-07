'use client'

import { motion } from 'framer-motion'
import { ArrowDownRight, Cloud, ServerCog, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const roles = ['Cloud Engineer', 'DevOps Engineer', 'Platform Engineer', 'Agentic AI Practitioner']

const resumeLink = 'https://drive.google.com/uc?export=download&id=1Cmb9HhzKhbM5c_q6GEDuU5H8idpwMODS'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 py-24 lg:px-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_25%),radial-gradient(circle_at_20%_40%,_rgba(6,182,212,0.08),_transparent_20%),linear-gradient(180deg,#0A0F1F_0%,#050814_100%)]" />
      <div className="absolute left-16 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-24 top-28 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0F1F] via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted">
            <Cloud className="h-4 w-4 text-primary" /> Cloud-native platform engineering
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">Sumit Kumar</h1>
            <p className="max-w-3xl text-lg leading-8 text-white/75 sm:text-xl">
              I am Sumit Kumar, a cloud-native platform engineer with 3 years of experience building Kubernetes-based automation, multi-cloud delivery systems, and agentic AI-enabled workflows for resilient operations.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-surface/90 p-6 shadow-panel backdrop-blur-xl">
            <div className="grid gap-3 sm:grid-cols-2">
              {roles.map((role) => (
                <Badge key={role} className="rounded-[1.75rem] bg-white/5 text-white/75">
                  <Sparkles className="mr-2 h-4 w-4 text-accent" /> {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => window.open(resumeLink, '_blank')} className="inline-flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" /> Download Resume
            </Button>
            <Button variant="secondary" size="sm" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View Projects
            </Button>
            <Button variant="secondary" size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Contact Me
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }} className="relative w-full max-w-[520px]">
          <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-panel backdrop-blur-xl">
            <div className="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#0E1B33]/90 px-4 py-2 text-sm text-white/80 shadow-glow">
              <ServerCog className="h-4 w-4 text-secondary" /> Live platform preview
            </div>
            <div className="mt-10 h-[340px] rounded-[1.75rem] border border-white/10 bg-[#09101F] p-6">
              <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-muted">
                <span>Cloud Infrastructure</span>
                <span>Multi-cloud</span>
              </div>
              <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#07101B] via-[#081523] to-[#050814] p-6">
                <div className="absolute inset-x-0 top-6 h-24 rounded-[1.5rem] bg-gradient-to-b from-primary/20 to-transparent blur-2xl" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.28em] text-muted">
                      Kubernetes Platform
                    </div>
                    <h2 className="text-3xl font-semibold text-white">Platform Automation Lab</h2>
                    <p className="max-w-xl text-sm leading-7 text-white/70">
                      A polished enterprise-grade control plane preview with GitOps orchestration, service mesh insight, and self-healing operations.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">CI/CD</p>
                      <p className="mt-3 text-lg font-semibold text-white">GitOps Pipeline</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">Observability</p>
                      <p className="mt-3 text-lg font-semibold text-white">Prometheus & Grafana</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.18),_transparent_32%)]" />
        </motion.div>
      </div>
    </section>
  )
}

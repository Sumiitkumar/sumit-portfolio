'use client'

import { FileText, Download } from 'lucide-react'

export default function ResumeSection() {
  return (
    <section id="resume" className="px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Resume</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Download my resume</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            A concise resume highlighting cloud platform engineering, Kubernetes, GitOps, and infrastructure automation experience.
          </p>
          <a href="https://drive.google.com/uc?export=download&id=1Cmb9HhzKhbM5c_q6GEDuU5H8idpwMODS" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90">
            <Download className="h-4 w-4" /> Download Resume
          </a>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left text-slate-700">
            <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-slate-500">
              <FileText className="h-4 w-4 text-primary" /> Resume highlights
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6">
              <li>Cloud native infrastructure and automation</li>
              <li>Kubernetes, GitOps, and multi-cloud deployments</li>
              <li>Platform reliability and observability</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

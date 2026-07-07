'use client'

import { Github, Linkedin, Mail, Phone } from 'lucide-react'

export default function ContactSection() {
  return (
    <section id="contact" className="px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Contact</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Let’s connect.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Reach out for cloud platform engineering, GitOps, and infrastructure automation opportunities.
          </p>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Email</p>
              <p className="mt-2 text-lg text-slate-900">sumiitkumar.it@gmail.com</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Phone</p>
              <p className="mt-2 text-lg text-slate-900">+91 8709863830</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a href="https://github.com/sumiitkumar" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-100 px-5 py-4 text-sm text-slate-900 transition hover:bg-slate-200">
              <Github className="h-4 w-4 text-slate-900" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/sumiitkumar/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-100 px-5 py-4 text-sm text-slate-900 transition hover:bg-slate-200">
              <Linkedin className="h-4 w-4 text-slate-900" /> LinkedIn
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Location</p>
            <p className="mt-2 text-lg text-slate-900">Bangalore, India</p>
          </div>
        </div>
      </div>
    </section>
  )
}

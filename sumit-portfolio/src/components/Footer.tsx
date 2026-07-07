'use client'

import { ChevronUp } from 'lucide-react'
import { Button } from './ui/button'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50 px-6 py-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">sumit.cloud</p>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Premium Cloud DevOps Platform Engineering portfolio designed for hiring teams, recruiters, and engineering leaders.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="https://github.com/sumiitkumar" target="_blank" rel="noreferrer" className="text-sm text-slate-700 transition hover:text-slate-900">GitHub</a>
          <a href="https://www.linkedin.com/in/sumiitkumar/" target="_blank" rel="noreferrer" className="text-sm text-slate-700 transition hover:text-slate-900">LinkedIn</a>
          <Button variant="secondary" size="sm" onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>
            <ChevronUp className="h-4 w-4" /> Top
          </Button>
        </div>
      </div>
    </footer>
  )
}

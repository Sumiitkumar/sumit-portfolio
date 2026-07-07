'use client'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-14">
        <a href="#home" className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-primary">S</span>
          sumit.cloud
        </a>

        <div className="hidden items-center gap-4 md:flex">
          <a href="https://github.com/sumiitkumar" target="_blank" rel="noreferrer" className="text-sm text-slate-600 transition hover:text-slate-900">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/sumiitkumar/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 transition hover:text-slate-900">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  )
}

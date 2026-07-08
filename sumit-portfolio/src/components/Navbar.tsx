'use client'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-sm font-semibold text-slate-900">
          Sumit
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm text-slate-600 transition hover:text-slate-900">
            home
          </a>
          <a href="#about" className="text-sm text-slate-600 transition hover:text-slate-900">
            about
          </a>
          <a href="#skills" className="text-sm text-slate-600 transition hover:text-slate-900">
            skills
          </a>
          <a href="#blog" className="text-sm text-slate-600 transition hover:text-slate-900">
            blog
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="https://github.com/sumiitkumar" target="_blank" rel="noreferrer" className="text-sm text-slate-600 transition hover:text-slate-900">
            github
          </a>
          <a href="https://www.linkedin.com/in/sumiitkumar/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 transition hover:text-slate-900">
            linkedin
          </a>
        </div>
      </div>
    </header>
  )
}

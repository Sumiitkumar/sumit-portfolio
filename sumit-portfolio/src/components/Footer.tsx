'use client'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm text-slate-600">
          © 2024 Sumit Kumar · 
          <a href="https://github.com/sumiitkumar" target="_blank" rel="noreferrer" className="ml-2 text-slate-600 hover:text-slate-900">
            github
          </a>
          {' · '}
          <a href="https://www.linkedin.com/in/sumiitkumar/" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900">
            linkedin
          </a>
        </p>
      </div>
    </footer>
  )
}

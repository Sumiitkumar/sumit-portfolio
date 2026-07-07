"use client"

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(getInitialTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme, mounted])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
    >
      {mounted ? (
        theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  )
}

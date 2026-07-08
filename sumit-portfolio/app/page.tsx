import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Blog from '@/components/Blog'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="overflow-hidden">
        <Hero />
        <About />
        <Skills />
        <Blog />
      </div>
    </main>
  )
}

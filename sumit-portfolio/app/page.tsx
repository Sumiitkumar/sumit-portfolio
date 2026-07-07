import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import ResumeSection from '@/components/ResumeSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-slate-900">
      <div className="overflow-hidden">
        <Hero />
        <About />
        <Skills />
        <ResumeSection />
        <ContactSection />
      </div>
    </main>
  )
}

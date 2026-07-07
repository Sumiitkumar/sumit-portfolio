import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Sumit Kumar • Cloud DevOps Platform Engineer',
  description: 'Portfolio for a Cloud DevOps Platform Engineer with 3 years of cloud native experience, multi-cloud delivery, and agentic AI-enabled automation.',
  metadataBase: new URL('https://Sumiitkumar.github.io/sumit-portfolio'),
  openGraph: {
    title: 'Sumit Kumar | Cloud DevOps Portfolio',
    description: 'Cloud/DevOps portfolio showcasing infrastructure, automation, projects, certifications, and contact details.',
    type: 'website',
    url: 'https://Sumiitkumar.github.io/sumit-portfolio',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-slate-900 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}

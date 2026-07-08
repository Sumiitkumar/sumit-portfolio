import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Sumit Kumar • Cloud Platform Engineer',
  description: 'Cloud platform engineer specializing in Kubernetes, DevOps, and multi-cloud infrastructure automation.',
  metadataBase: new URL('https://Sumiitkumar.github.io/sumit-portfolio'),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}

'use client'

import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

const certifications = [
  { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' },
  { title: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft' },
  { title: 'Microsoft Certified: Azure Developer Associate (AZ-204)', issuer: 'Microsoft' },
  { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
  { title: 'Microsoft Certified: Azure Administrator', issuer: 'Microsoft' },
  { title: 'HashiCorp Certified: Terraform Associate', issuer: 'HashiCorp' },
]

export default function Certifications() {
  return (
    <section id="certifications" className="relative px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Certifications</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Validated cloud and platform credentials.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
            A collection of certifications that support a recruiter’s confidence in platform engineering rigor and cloud proficiency.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="rounded-[2rem] p-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-secondary/10 text-secondary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="mt-6 text-2xl font-semibold text-slate-900">{cert.title}</p>
                <p className="mt-3 text-sm text-slate-500">{cert.issuer}</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <Badge className="h-4 w-4 text-secondary" /> Verified
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

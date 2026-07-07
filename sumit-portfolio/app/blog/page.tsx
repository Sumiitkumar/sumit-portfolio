import Link from 'next/link'

export const metadata = {
  title: 'Blog — Coming Soon',
  description: 'Technical blog coming soon. Posts will cover Kubernetes, Terraform, CI/CD, and cloud engineering.',
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20 lg:px-14 text-slate-900">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold">Blog</h1>
        <p className="mt-4 text-lg text-slate-600">Technical posts covering Kubernetes, Terraform, CI/CD, monitoring and cloud engineering are coming soon.</p>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 hover:bg-slate-200">Back to Home</Link>
        </div>
      </div>
    </main>
  )
}

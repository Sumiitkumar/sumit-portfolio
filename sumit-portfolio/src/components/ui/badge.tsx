import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-700', className)} {...props} />
}

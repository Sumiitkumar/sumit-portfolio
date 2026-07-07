import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-12 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

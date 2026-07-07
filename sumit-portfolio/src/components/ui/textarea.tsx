import * as React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[140px] w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

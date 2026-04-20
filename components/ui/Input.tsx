import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-neutral-600" htmlFor={inputId}>
      {label ? <span className="font-medium text-neutral-900">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          'h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-brand-400',
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  )
}

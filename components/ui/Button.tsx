import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-brand-400 text-white hover:bg-brand-500',
  secondary: 'bg-accent-300 text-white hover:bg-accent-400',
  outline: 'border border-brand-400 text-brand-600 hover:bg-brand-50',
  ghost: 'text-neutral-600 hover:bg-neutral-100',
  danger: 'bg-error text-white hover:opacity-90'
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

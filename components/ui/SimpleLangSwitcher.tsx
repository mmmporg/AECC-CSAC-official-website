'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface SimpleLangSwitcherProps {
  locale: Locale
}

export function SimpleLangSwitcher({ locale }: SimpleLangSwitcherProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const buildLocalePath = (targetLocale: Locale) => {
    const nextSegments = [...segments]
    if (nextSegments.length > 0 && locales.includes(nextSegments[0] as Locale)) {
      nextSegments[0] = targetLocale
    } else {
      nextSegments.unshift(targetLocale)
    }

    return `/${nextSegments.join('/')}`
  }

  return (
    <div className="inline-flex items-center rounded-full border border-white/75 bg-white/62 p-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500/80 shadow-[0_12px_22px_-20px_rgba(26,25,24,0.18)] backdrop-blur-sm"
    >
      {locales.map((option) => {
        const isActive = option === locale

        if (isActive) {
          return (
            <span
              key={option}
              className="rounded-full bg-[#167a5e] px-2.5 py-1.5 text-white"
            >
              {option}
            </span>
          )
        }

        return (
          <Link
            key={option}
            href={buildLocalePath(option)}
            className={cn(
              'rounded-full px-2.5 py-1.5 transition-colors duration-200 hover:text-[#0f6e56]',
              option === 'en' ? 'pr-3.5' : ''
            )}
          >
            {option}
          </Link>
        )
      })}
    </div>
  )
}

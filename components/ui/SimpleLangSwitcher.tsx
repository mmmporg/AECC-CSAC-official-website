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
    <div className="inline-flex items-center rounded-full border border-neutral-200/80 bg-white/80 p-1 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 shadow-[0_14px_30px_-24px_rgba(26,25,24,0.24)] backdrop-blur-sm"
    >
      {locales.map((option) => {
        const isActive = option === locale

        if (isActive) {
          return (
            <span
              key={option}
              className="rounded-full bg-[#0f6e56] px-3 py-2 text-white"
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
              'rounded-full px-3 py-2 transition-colors duration-200 hover:text-[#0f6e56]',
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

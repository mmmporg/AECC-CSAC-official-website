'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  locale: Locale
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()

  return (
    <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1">
      {locales.map((targetLocale) => {
        const segments = pathname.split('/').filter(Boolean)
        if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
          segments[0] = targetLocale
        }

        const targetPath = `/${segments.join('/')}`

        return (
          <Link
            key={targetLocale}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors',
              locale === targetLocale
                ? 'bg-brand-400 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
            href={targetPath || `/${targetLocale}`}
          >
            {targetLocale}
          </Link>
        )
      })}
    </div>
  )
}

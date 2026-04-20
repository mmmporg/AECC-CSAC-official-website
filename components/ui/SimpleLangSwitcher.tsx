'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

interface SimpleLangSwitcherProps {
  locale: Locale
}

export function SimpleLangSwitcher({ locale }: SimpleLangSwitcherProps) {
  const pathname = usePathname()
  
  // We just show the alternative language link. If FR, show EN. If EN, show FR.
  const targetLocale = locale === 'fr' ? 'en' : 'fr'
  
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    segments[0] = targetLocale
  }

  const targetPath = `/${segments.join('/')}`

  return (
    <Link 
      href={targetPath || `/${targetLocale}`}
      className="px-3 py-1 text-sm font-bold text-[#00694c] hover:text-[#855400] transition-colors uppercase"
    >
      {targetLocale}
    </Link>
  )
}

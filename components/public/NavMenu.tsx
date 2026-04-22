'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavMenuProps {
  locale: string
  translations: {
    home: string
    histoire: string
    annonces: string
    opportunites: string
    apropos: string
    annuaire: string
  }
}

export function NavMenu({ locale, translations }: NavMenuProps) {
  const pathname = usePathname()

  const links = [
    { href: `/${locale}`, label: translations.home, exact: true },
    { href: `/${locale}/histoire`, label: translations.histoire },
    { href: `/${locale}/annonces`, label: translations.annonces },
    { href: `/${locale}/annuaire`, label: translations.annuaire },
    { href: `/${locale}/opportunites`, label: translations.opportunites },
    { href: `/${locale}/a-propos`, label: translations.apropos },
  ]

  return (
    <nav className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-7 xl:flex">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group relative flex items-center pb-2.5 pt-1.5 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200',
              isActive
                ? 'text-[#0f6e56]'
                : 'text-neutral-600 hover:text-[#1A1918]'
            )}
          >
            <span>{link.label}</span>
            <span
              className={cn(
                'absolute inset-x-0 bottom-0 h-px origin-center rounded-full transition-transform duration-200',
                isActive
                  ? 'scale-x-100 bg-[#0f6e56]'
                  : 'scale-x-0 bg-neutral-300 group-hover:scale-x-100'
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}

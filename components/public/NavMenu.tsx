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
    <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-10 text-[15px] font-semibold text-[#65635E] lg:flex">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-all duration-200 py-1',
              isActive
                ? 'border-b-2 border-[#1D9E75] text-[#1D9E75]'
                : 'hover:text-[#1A1918] border-b-2 border-transparent hover:border-neutral-200'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NavMenuProps {
  locale: string
  translations: {
    home: string
    histoire: string
    annonces: string
    galerie: string
    opportunites: string
    apropos: string
    annuaire: string
  }
}

export function NavMenu({ locale, translations }: NavMenuProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = [
    { href: `/${locale}`, label: translations.home, exact: true },
    { href: `/${locale}/histoire`, label: translations.histoire },
    { href: `/${locale}/annonces`, label: translations.annonces },
    { href: `/${locale}/galerie`, label: translations.galerie },
    { href: `/${locale}/annuaire`, label: translations.annuaire },
    { href: `/${locale}/opportunites`, label: translations.opportunites },
    { href: `/${locale}/a-propos`, label: translations.apropos }
  ]

  return (
    <>
      <nav className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 xl:flex">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group relative flex items-center pb-3 pt-2 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200',
                isActive ? 'text-[#0f6e56]' : 'text-neutral-600 hover:text-[#1A1918]'
              )}
            >
              <span>{link.label}</span>
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-full transition-transform duration-200',
                  isActive ? 'scale-x-100 bg-[#0f6e56]' : 'scale-x-0 bg-neutral-300 group-hover:scale-x-100'
                )}
              />
            </Link>
          )
        })}
      </nav>

      <button
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen((value) => !value)}
        className="relative z-[510] flex h-10 w-10 flex-none flex-col items-center justify-center gap-[5px] rounded-xl text-neutral-700 transition-colors hover:bg-neutral-100 xl:hidden"
        type="button"
      >
        <span
          className={cn(
            'block h-0.5 w-5 rounded-full bg-current transition-all duration-200',
            open && 'translate-y-[7px] rotate-45'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-5 rounded-full bg-current transition-all duration-200',
            open && 'opacity-0 scale-x-0'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-5 rounded-full bg-current transition-all duration-200',
            open && '-translate-y-[7px] -rotate-45'
          )}
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[499] bg-[rgba(0,0,0,0.4)] xl:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          'fixed inset-0 z-[500] bg-white xl:hidden',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        )}
      >
        <nav className="flex h-full flex-col overflow-y-auto pt-[62px] sm:pt-[70px]">
          {links.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center border-b border-neutral-200 px-4 py-4 text-[15px] font-semibold',
                  isActive ? 'bg-[#1d9e75]/10 text-[#0f6e56]' : 'bg-white text-neutral-800'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin/dashboard', key: 'dashboard' },
  { href: '/admin/annonces', key: 'annonces_actives' },
  { href: '/admin/opportunites', key: 'opportunites_actives' },
  { href: '/admin/histoire', key: 'history' }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations('admin')

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-sidebar bg-brand-800 p-6 text-white md:block">
      <div className="mb-10">
        <p className="text-lg font-semibold">AECC Admin</p>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            className={cn(
              'block rounded-lg px-4 py-3 text-sm transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-brand-700 text-white'
                : 'text-brand-100 hover:bg-brand-700'
            )}
            href={item.href}
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

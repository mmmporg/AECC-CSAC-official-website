'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin/dashboard', key: 'dashboard' },
  { href: '/admin/annonces', key: 'annonces_actives' },
  { href: '/admin/opportunites', key: 'opportunites_actives' },
  { href: '/admin/histoire', key: 'history' }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('admin')

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-sidebar flex-col bg-brand-800 p-6 text-white md:flex">
      <div className="mb-10">
        <p className="text-lg font-semibold">AECC Admin</p>
      </div>
      <nav className="flex-1 space-y-2">
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
      <button
        className="mt-auto w-full rounded-lg px-4 py-3 text-left text-sm text-brand-200 transition-colors hover:bg-brand-700 hover:text-white"
        onClick={handleSignOut}
        type="button"
      >
        {t('signout')}
      </button>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface AdminSidebarProps {
  canManageAccounts?: boolean
}

function getItems(canManageAccounts: boolean) {
  return [
    { href: '/admin/dashboard', key: 'dashboard' },
    { href: '/admin/annonces', key: 'annonces_actives' },
    { href: '/admin/opportunites', key: 'opportunites_actives' },
    { href: '/admin/histoire', key: 'history' },
    { href: '/admin/membres', key: 'membres' },
    { href: '/admin/galerie', key: 'galerie' },
    ...(canManageAccounts ? [{ href: '/admin/comptes', key: 'comptes' }] : [])
  ]
}

export function AdminSidebar({ canManageAccounts = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('admin')
  const items = getItems(canManageAccounts)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#04342c] p-4 text-white shadow-2xl md:flex">
      <div className="mb-6 px-2 pb-6 pt-2">
        <div className="space-y-0.5">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-white">AECC/CSAC</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-brand-100/80">
            Admin Panel
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-2 border-t border-white/10 pt-6">
        {items.map((item) => (
          <Link
            key={item.href}
            className={cn(
              'block rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all duration-200',
              pathname.startsWith(item.href)
                ? 'bg-[#0b5a47] text-accent-300 shadow-inner'
                : 'text-brand-100/75 hover:translate-x-1 hover:bg-[#0b4b3e] hover:text-white'
            )}
            href={item.href}
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-4">
        <button
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-brand-100/80 transition hover:bg-[#0b4b3e] hover:text-white"
          onClick={handleSignOut}
          type="button"
        >
          {t('signout')}
        </button>
      </div>
    </aside>
  )
}

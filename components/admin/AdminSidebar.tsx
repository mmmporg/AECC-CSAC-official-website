'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin/dashboard', key: 'dashboard' },
  { href: '/admin/annonces', key: 'annonces_actives' },
  { href: '/admin/opportunites', key: 'opportunites_actives' },
  { href: '/admin/histoire', key: 'history' },
  { href: '/admin/membres', key: 'membres' },
  { href: '/admin/galerie', key: 'galerie' }
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
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#04342c] p-4 text-white shadow-2xl md:flex">
      <div className="mb-6 flex items-center gap-3 px-2 pb-6 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#126754] text-sm font-black text-white">
          AE
        </div>
        <div>
          <p className="text-lg font-black uppercase tracking-[0.18em] text-white">AEC Chine</p>
          <p className="text-xs font-medium tracking-[0.16em] text-brand-100/80">Admin Portal</p>
        </div>
      </div>
      <button
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-300 px-4 py-3 text-sm font-bold text-[#5b3602] transition hover:bg-[#f7b349]"
        type="button"
      >
        <span className="text-base leading-none">+</span>
        <span>Post Update</span>
      </button>
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
      <div className="space-y-2 border-t border-white/10 pt-4">
        <div className="rounded-xl px-4 py-3 text-sm text-brand-100/75">Settings</div>
        <div className="rounded-xl px-4 py-3 text-sm text-brand-100/75">Support</div>
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

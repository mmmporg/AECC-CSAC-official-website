import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getCurrentAdminRole } from '@/lib/supabase/server'

interface AdminLayoutProps {
  title: string
  children: ReactNode
}

export async function AdminLayout({ title, children }: AdminLayoutProps) {
  const role = await getCurrentAdminRole()

  return (
    <div className="admin-shell min-h-screen md:pl-64">
      <AdminSidebar canManageAccounts={role === 'super_admin'} />
      <div className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-700">
                AEC Chine Admin
              </p>
              <p className="text-xs text-neutral-600">{title}</p>
            </div>
            <div className="hidden w-full max-w-sm items-center rounded-full bg-[#ece8df] px-4 py-3 md:flex">
              <span className="mr-3 text-sm text-neutral-600">Search</span>
              <div className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full bg-brand-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700 md:block">
                {role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
              <div className="hidden h-9 w-9 rounded-full bg-[#ece8df] md:block" />
              <div className="h-10 w-10 rounded-full bg-brand-800 ring-4 ring-white/80" />
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}

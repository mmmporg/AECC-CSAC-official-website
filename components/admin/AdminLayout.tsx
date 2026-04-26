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
      <main className="min-h-screen p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  )
}

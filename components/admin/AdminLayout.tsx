import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

interface AdminLayoutProps {
  title: string
  children: ReactNode
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 md:pl-sidebar">
      <AdminSidebar />
      <div className="min-h-screen">
        <header className="border-b border-neutral-200 bg-white">
          <div className="flex h-header items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
            <div className="h-10 w-10 rounded-full bg-brand-100" />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminDashboardData } from '@/lib/data/admin'

export default async function AdminDashboardPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const dashboard = await getAdminDashboardData()

  return (
    <AdminLayout title={t('dashboard')}>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [t('annonces_actives'), dashboard.activeAnnouncements],
            [t('opportunites_actives'), dashboard.activeOpportunities],
            [t('recent_announcements'), dashboard.recentAnnouncements.length],
            [t('recent_opportunities'), dashboard.recentOpportunities.length]
          ].map(([label, value]) => (
            <article className="surface-card p-5" key={label}>
              <p className="text-sm text-neutral-600">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-brand-700">{value}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link className="rounded-lg bg-brand-400 px-5 py-3 text-sm font-semibold text-white" href="/admin/annonces/new">
            {t('nouvelle_annonce')}
          </Link>
          <Link className="rounded-lg bg-accent-300 px-5 py-3 text-sm font-semibold text-white" href="/admin/opportunites/new">
            {t('nouvelle_opportunite')}
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="surface-card overflow-hidden">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="font-semibold text-neutral-900">{t('recent_announcements')}</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {dashboard.recentAnnouncements.map((announcement) => (
                <div className="flex items-center justify-between px-5 py-4" key={announcement.id}>
                  <div>
                    <p className="font-medium text-neutral-900">{announcement.title_fr}</p>
                    <p className="text-sm text-neutral-600">{announcement.city}</p>
                  </div>
                  <Link className="text-sm font-semibold text-brand-600" href={`/admin/annonces/${announcement.id}/edit`}>
                    {t('modifier')}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="font-semibold text-neutral-900">{t('recent_opportunities')}</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {dashboard.recentOpportunities.map((opportunity) => (
                <div className="flex items-center justify-between px-5 py-4" key={opportunity.id}>
                  <div>
                    <p className="font-medium text-neutral-900">{opportunity.title_fr}</p>
                    <p className="text-sm text-neutral-600">{opportunity.organization}</p>
                  </div>
                  <Link className="text-sm font-semibold text-brand-600" href={`/admin/opportunites/${opportunity.id}/edit`}>
                    {t('modifier')}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

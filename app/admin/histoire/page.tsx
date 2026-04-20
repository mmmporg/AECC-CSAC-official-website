import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminHistoryData } from '@/lib/data/admin'

export default async function AdminHistoryPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const history = await getAdminHistoryData()

  return (
    <AdminLayout title={t('history')}>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [t('timeline'), history.timeline.length],
            [t('founders'), history.founders.length],
            [t('presidents'), history.presidents.length]
          ].map(([label, value]) => (
            <article className="surface-card p-5" key={label}>
              <p className="text-sm text-neutral-600">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-brand-700">{value}</p>
            </article>
          ))}
        </div>

        <section className="surface-card overflow-hidden">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="font-semibold text-neutral-900">{t('timeline')}</h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {history.timeline.map((event) => (
              <div className="px-5 py-4" key={event.id}>
                <p className="font-medium text-neutral-900">{event.title_fr}</p>
                <p className="text-sm text-neutral-600">{event.period}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="surface-card overflow-hidden">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="font-semibold text-neutral-900">{t('founders')}</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {history.founders.map((founder) => (
                <div className="px-5 py-4" key={founder.id}>
                  <p className="font-medium text-neutral-900">{founder.full_name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="font-semibold text-neutral-900">{t('presidents')}</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {history.presidents.map((president) => (
                <div className="px-5 py-4" key={president.id}>
                  <p className="font-medium text-neutral-900">{president.full_name}</p>
                  <p className="text-sm text-neutral-600">
                    {president.year_start}
                    {president.year_end ? ` - ${president.year_end}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

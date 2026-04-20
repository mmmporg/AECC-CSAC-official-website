import { getTranslations } from 'next-intl/server'
import { FounderCard } from '@/components/public/FounderCard'
import { Timeline } from '@/components/public/Timeline'
import {
  getFounders,
  getPresidents,
  getTimelineEvents
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'

export default async function HistoryPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'histoire' })
  const [timeline, founders, presidents] = await Promise.all([
    getTimelineEvents(),
    getFounders(),
    getPresidents()
  ])

  return (
    <div className="container-shell space-y-12 py-10">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-600">{t('label')}</p>
        <h1 className="section-heading">{t('title')}</h1>
        <p className="max-w-3xl section-copy">{t('subtitle')}</p>
      </section>

      <section className="space-y-6">
        <Timeline events={timeline} locale={locale} />
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="section-heading">{t('premier_bureau')}</h2>
          <p className="section-copy">
            {locale === 'fr'
              ? 'Premier bureau issu de l’Assemblée Générale de Beijing en 1999.'
              : 'First board established during the 1999 General Assembly in Beijing.'}
          </p>
        </div>
        <div className="surface-card overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-600">
              <tr>
                <th className="px-4 py-3">{t('table_period')}</th>
                <th className="px-4 py-3">{t('table_name')}</th>
                <th className="px-4 py-3">{t('table_city')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {presidents.map((president) => (
                <tr key={president.id}>
                  <td className="px-4 py-3">
                    {president.year_start}
                    {president.year_end ? ` - ${president.year_end}` : ''}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {president.full_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{president.city ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="section-heading">{t('fondateurs_title')}</h2>
          <p className="section-copy">{t('fondateurs_subtitle')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {founders.map((founder) => (
            <FounderCard founder={founder} key={founder.id} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}

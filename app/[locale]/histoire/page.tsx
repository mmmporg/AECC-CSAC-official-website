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
    <div className="space-y-20 py-10">
      <section className="container-shell py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-accent-400">{t('label')}</p>
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-neutral-900 md:text-7xl">
              {t('title')}
            </h1>
          </div>
          <div className="border-l-4 border-accent-300 pl-6 text-base leading-7 text-neutral-600">
            {t('subtitle')}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-20">
        <div className="container-shell">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <div className="aspect-video bg-gradient-to-br from-brand-700 via-brand-500 to-accent-300" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-brand-700">
                {locale === 'fr' ? 'Le contexte initial' : 'The initial context'}
              </h2>
              <p className="text-base leading-8 text-neutral-600">
                {locale === 'fr'
                  ? "À la fin des années 90, la communauté estudiantine camerounaise en Chine se densifie. L'AECC naît de ce besoin de solidarité, d'organisation et de représentation."
                  : 'By the late 1990s, the Cameroonian student community in China was growing. AECC emerged from the need for solidarity, structure and representation.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell space-y-6">
        <Timeline events={timeline} locale={locale} />
      </section>

      <section className="bg-neutral-100 py-20">
        <div className="container-shell space-y-8">
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
        </div>
      </section>

      <section className="container-shell space-y-6">
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

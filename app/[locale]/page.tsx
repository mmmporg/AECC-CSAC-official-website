import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { FounderCard } from '@/components/public/FounderCard'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import {
  getFounders,
  getLatestAnnouncements,
  getLatestOpportunities
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'

export default async function HomePage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'home' })
  const [announcements, opportunities, founders] = await Promise.all([
    getLatestAnnouncements(3),
    getLatestOpportunities(2),
    getFounders()
  ])

  return (
    <div className="space-y-20 py-10">
      <section className="container-shell">
        <div className="surface-card overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 px-6 py-14 text-white md:px-10 md:py-20">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-100">
              AECC
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              {t('hero_title')}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-brand-50 md:text-lg">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-700"
                href={`/${locale}/histoire`}
              >
                {t('cta_histoire')}
              </Link>
              <Link
                className="rounded-lg border border-brand-100 px-5 py-3 text-sm font-semibold text-white"
                href={`/${locale}/annonces`}
              >
                {t('cta_annonces')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-4 md:grid-cols-4">
        {[
          ['1997', t('stats_reunions')],
          ['1999', t('stats_fondation')],
          ['19+', t('stats_presidents')],
          ['25+', t('stats_existence')]
        ].map(([value, label]) => (
          <article className="surface-card p-5" key={label}>
            <p className="text-3xl font-semibold text-brand-700">{value}</p>
            <p className="mt-2 text-sm text-neutral-600">{label}</p>
          </article>
        ))}
      </section>

      <section className="container-shell space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="section-heading">{t('mission_title')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [t('mission_support_title'), t('mission_support_copy')],
            [t('mission_memory_title'), t('mission_memory_copy')],
            [t('mission_opportunities_title'), t('mission_opportunities_copy')]
          ].map(([title, copy]) => (
            <article className="surface-card p-6" key={title}>
              <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-heading">{t('latest_announcements')}</h2>
          </div>
          <Link className="text-sm font-semibold text-brand-600" href={`/${locale}/annonces`}>
            {locale === 'fr' ? 'Voir toutes' : 'View all'}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((announcement) => (
            <AnnouncementCard
              announcement={announcement}
              key={announcement.id}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-heading">{t('latest_opportunities')}</h2>
          <Link
            className="text-sm font-semibold text-brand-600"
            href={`/${locale}/opportunites`}
          >
            {locale === 'fr' ? 'Voir toutes' : 'View all'}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              locale={locale}
              opportunity={opportunity}
            />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-heading">
            {locale === 'fr' ? 'Fondateurs' : 'Founders'}
          </h2>
          <Link className="text-sm font-semibold text-brand-600" href={`/${locale}/histoire`}>
            {t('founders_teaser')}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {founders.slice(0, 4).map((founder) => (
            <FounderCard founder={founder} key={founder.id} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}

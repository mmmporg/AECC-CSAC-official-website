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
    <div className="overflow-x-hidden py-10">
      <section className="container-shell py-10 md:py-16">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_0.9fr]">
          <div className="space-y-8">
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-neutral-900 md:text-7xl">
              {t('hero_title')}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-neutral-600">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                className="rounded-lg bg-brand-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white"
                href={`/${locale}/histoire`}
              >
                {t('cta_histoire')}
              </Link>
              <Link
                className="rounded-lg bg-accent-300 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white"
                href={`/${locale}/a-propos`}
              >
                {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-50 blur-3xl" />
            {[
              ['1997', t('stats_reunions'), 'translate-y-4 bg-white'],
              ['1999', t('stats_fondation'), 'bg-brand-400 text-white'],
              ['19+', t('stats_presidents'), 'bg-neutral-100'],
              ['25+', t('stats_existence'), '-translate-y-4 bg-accent-50']
            ].map(([value, label, classes]) => (
              <article
                className={`surface-card relative flex h-40 flex-col justify-between p-8 ${classes}`}
                key={label}
              >
                <p className="text-4xl font-black">{value}</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em]">
                  {label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-24">
        <div className="container-shell space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-400">
                {locale === 'fr' ? 'Valeurs fondatrices' : 'Founding values'}
              </p>
              <p className="section-heading">{t('mission_title')}</p>
            </div>
            <p className="max-w-md text-sm leading-6 text-neutral-600">
              {locale === 'fr'
                ? "Favoriser l'intégration, promouvoir l'excellence académique et maintenir le lien culturel."
                : 'Foster integration, promote academic excellence and keep a strong cultural link.'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [t('mission_support_title'), t('mission_support_copy'), 'border-brand-400'],
              [t('mission_memory_title'), t('mission_memory_copy'), 'border-accent-300'],
              [t('mission_opportunities_title'), t('mission_opportunities_copy'), 'border-brand-700']
            ].map(([title, copy, border]) => (
              <article
                className={`surface-card border-b-4 border-b-transparent p-10 transition-all hover:-translate-y-1 hover:${border}`}
                key={title}
              >
                <h2 className="text-xl font-extrabold text-neutral-900">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell space-y-6 py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-heading">{t('latest_announcements')}</h2>
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

      <section className="bg-brand-700 py-24 text-white">
        <div className="container-shell grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-100">
              {locale === 'fr' ? 'Carrière & éducation' : 'Career & education'}
            </p>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              {locale === 'fr'
                ? 'Accélérez votre futur professionnel'
                : 'Accelerate your professional future'}
            </h2>
            <p className="text-lg leading-8 text-brand-50/90">
              {locale === 'fr'
                ? "Grâce à nos relais, nous sélectionnons les opportunités les plus utiles pour la communauté camerounaise en Chine."
                : 'Through our network, we surface high-value opportunities for the Cameroonian community in China.'}
            </p>
            <Link
              className="inline-flex rounded-lg bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-brand-700"
              href={`/${locale}/opportunites`}
            >
              {locale === 'fr' ? 'Toutes les offres' : 'All opportunities'}
            </Link>
          </div>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6" key={opportunity.id}>
                <OpportunityCard locale={locale} opportunity={opportunity} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-24">
        <div className="rounded-[2rem] bg-neutral-100 px-6 py-14 text-center md:px-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
            {locale === 'fr' ? 'Héritage' : 'Legacy'}
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-neutral-900">
            {locale === 'fr' ? "Ils ont fait l'AECC" : 'They shaped AECC'}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {founders.slice(0, 4).map((founder) => (
              <FounderCard founder={founder} key={founder.id} locale={locale} />
            ))}
          </div>
          <Link className="mt-10 inline-flex text-sm font-bold uppercase tracking-wide text-brand-700" href={`/${locale}/histoire`}>
            {t('founders_teaser')}
          </Link>
        </div>
      </section>
    </div>
  )
}

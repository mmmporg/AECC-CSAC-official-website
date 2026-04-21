import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import {
  getFounders,
  getLatestAnnouncements,
  getLatestOpportunities
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { HeroSection } from '@/components/public/HeroSection'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'
import { PageTransition } from '@/components/ui/PageTransition'

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

  const missionCards = [
    {
      title: locale === 'fr' ? 'Communaute' : 'Community',
      copy:
        locale === 'fr'
          ? "Un reseau de solidarite pour accompagner les etudiants camerounais dans toutes les grandes villes de Chine."
          : 'A support network for Cameroonian students across the main cities of China.',
      href: `/${locale}/a-propos`,
      tone: 'bg-brand-50 text-brand-700'
    },
    {
      title: locale === 'fr' ? 'Memoire' : 'Memory',
      copy:
        locale === 'fr'
          ? "Preserver l'histoire de l'AECC et transmettre les repères construits par les generations precedentes."
          : 'Preserve AECC history and pass on the milestones built by previous generations.',
      href: `/${locale}/histoire`,
      tone: 'bg-accent-50 text-accent-400'
    },
    {
      title: locale === 'fr' ? 'Opportunites' : 'Opportunities',
      copy:
        locale === 'fr'
          ? "Partager les informations utiles sur les bourses, les stages, les candidatures et les evenements."
          : 'Share useful information about scholarships, internships, applications and events.',
      href: `/${locale}/opportunites`,
      tone: 'bg-[#f8efef] text-[#a6554d]'
    }
  ]

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        <HeroSection />

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-shell">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
                AECC
              </span>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-neutral-900">
                {t('mission_title')}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-neutral-600">
              {locale === 'fr'
                ? "Une plateforme pour informer, orienter et garder un lien durable entre les etudiants camerounais en Chine."
                : 'A platform to inform, support and keep a durable connection between Cameroonian students in China.'}
            </p>
          </div>

          <RevealSection className="grid gap-6 md:grid-cols-3">
            {missionCards.map((card) => (
              <RevealItem key={card.title}>
                <article className="admin-card p-8">
                  <span
                    className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black ${card.tone}`}
                  >
                    {card.title.charAt(0)}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-600">{card.copy}</p>
                  <Link
                    className="mt-6 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-brand-600"
                    href={card.href}
                  >
                    {locale === 'fr' ? 'Voir plus' : 'Learn more'}
                  </Link>
                </article>
              </RevealItem>
            ))}
          </RevealSection>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-4xl font-black tracking-tight text-neutral-900">
            {t('latest_announcements')}
          </h2>
          <Link className="text-sm font-bold text-brand-600" href={`/${locale}/annonces`}>
            {locale === 'fr' ? 'Voir toutes les annonces' : 'View all announcements'}
          </Link>
        </div>
        <RevealSection className="grid gap-6 md:grid-cols-3">
          {announcements.map((announcement) => (
            <RevealItem key={announcement.id}>
              <AnnouncementCard
                announcement={announcement}
                locale={locale}
              />
            </RevealItem>
          ))}
        </RevealSection>
      </section>

      <section className="bg-brand-800 py-20">
        <div className="container-shell grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="space-y-6">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-100">
              {locale === 'fr' ? 'Carriere et education' : 'Career and education'}
            </span>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              {locale === 'fr'
                ? 'Des opportunites utiles pour avancer'
                : 'Useful opportunities to move forward'}
            </h2>
            <p className="max-w-md text-lg leading-8 text-white/80">
              {locale === 'fr'
                ? "L'equipe AECC relaie les offres les plus pertinentes pour la communaute camerounaise en Chine."
                : 'The AECC team shares the most relevant offers for the Cameroonian community in China.'}
            </p>
            <Link
              className="inline-flex rounded-xl bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-800 transition hover:bg-neutral-100"
              href={`/${locale}/opportunites`}
            >
              {locale === 'fr' ? 'Toutes les offres' : 'All opportunities'}
            </Link>
          </div>

          <RevealSection className="space-y-5">
            {opportunities.map((opportunity) => (
              <RevealItem key={opportunity.id}>
                <div
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                >
                  <OpportunityCard locale={locale} opportunity={opportunity} />
                </div>
              </RevealItem>
            ))}
          </RevealSection>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="rounded-[2rem] bg-neutral-100 px-8 py-14 text-center md:px-16 md:py-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            AECC
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-neutral-900">
            {t('founders_teaser')}
          </h2>
          <RevealSection className="mt-12 flex flex-wrap justify-center gap-4">
            {founders.slice(0, 6).map((founder) => {
              const initials = founder.full_name
                .split(' ')
                .map((name) => name[0] ?? '')
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <RevealItem key={founder.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-2xl font-black text-white shadow-lg">
                      {initials}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-600">
                      {initials}
                    </span>
                  </div>
                </RevealItem>
              )
            })}
          </RevealSection>
          <p className="mx-auto mt-10 max-w-2xl text-sm leading-7 text-neutral-600">
            {locale === 'fr'
              ? "Decouvrez les personnes qui ont pose les fondations de l'association et ont porte sa continuite."
              : 'Discover the people who laid the foundations of the association and carried its continuity.'}
          </p>
          <Link
            className="mt-8 inline-flex rounded-xl bg-brand-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand-700"
            href={`/${locale}/histoire`}
          >
            {locale === 'fr' ? 'Voir l histoire' : 'See the history'}
          </Link>
        </div>
      </section>
      </div>
    </PageTransition>
  )
}

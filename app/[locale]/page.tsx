import Image from 'next/image'
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

type FeedItem =
  | { kind: 'announcement'; item: Awaited<ReturnType<typeof getLatestAnnouncements>>[number] }
  | { kind: 'opportunity'; item: Awaited<ReturnType<typeof getLatestOpportunities>>[number] }

export default async function HomePage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'home' })
  const [announcements, opportunities, founders] = await Promise.all([
    getLatestAnnouncements(2),
    getLatestOpportunities(2),
    getFounders()
  ])

  const mixedFeed: FeedItem[] = [
    announcements[0] ? { kind: 'announcement', item: announcements[0] } : null,
    opportunities[0] ? { kind: 'opportunity', item: opportunities[0] } : null,
    announcements[1] ? { kind: 'announcement', item: announcements[1] } : null,
    opportunities[1] ? { kind: 'opportunity', item: opportunities[1] } : null
  ].filter((entry): entry is FeedItem => entry !== null)

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

      <section className="relative overflow-hidden bg-neutral-100 py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(15,110,86,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(212,132,14,0.12),transparent_35%)]" />
        <div className="container-shell relative grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:items-start">
          <div className="space-y-6">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
              {locale === 'fr' ? 'Temps fort' : 'Highlights'}
            </span>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-neutral-900 md:text-5xl">
              {locale === 'fr'
                ? 'Un flux mixte pour agir vite'
                : 'A mixed feed built for action'}
            </h2>
            <p className="max-w-md text-lg leading-8 text-neutral-600">
              {locale === 'fr'
                ? "La homepage montre un equilibre clair entre l'entraide immediate et les trajectoires d'avenir : 2 annonces recentes et 2 opportunites utiles."
                : 'The homepage balances immediate community needs and forward-looking opportunities: 2 recent announcements and 2 useful opportunities.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex rounded-xl bg-brand-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-brand-700"
                href={`/${locale}/annonces`}
              >
                {locale === 'fr' ? 'Toutes les annonces' : 'All announcements'}
              </Link>
              <Link
                className="inline-flex rounded-xl bg-accent-300 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-400"
                href={`/${locale}/opportunites`}
              >
                {locale === 'fr' ? 'Toutes les opportunites' : 'All opportunities'}
              </Link>
            </div>
          </div>

          <RevealSection className="grid gap-6 md:grid-cols-2">
            {mixedFeed.map((entry, index) => (
              <RevealItem key={`${entry.kind}-${entry.item.id}`}>
                <div
                  className={`relative h-full overflow-hidden rounded-[1.75rem] p-[1px] ${
                    index % 2 === 0
                      ? 'bg-[linear-gradient(160deg,rgba(15,110,86,0.28),rgba(255,255,255,0.92))]'
                      : 'bg-[linear-gradient(160deg,rgba(212,132,14,0.24),rgba(255,255,255,0.92))]'
                  }`}
                >
                  <div className="absolute left-5 top-5 z-10 inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {entry.kind === 'announcement'
                      ? locale === 'fr'
                        ? 'Annonce'
                        : 'Announcement'
                      : locale === 'fr'
                        ? 'Opportunite'
                        : 'Opportunity'}
                  </div>
                  <div className="h-full rounded-[calc(1.75rem-1px)] bg-white/96 p-0 pt-8 shadow-[0_24px_60px_-30px_rgba(26,25,24,0.22)] backdrop-blur-sm">
                    {entry.kind === 'announcement' ? (
                      <AnnouncementCard announcement={entry.item} locale={locale} />
                    ) : (
                      <OpportunityCard locale={locale} opportunity={entry.item} />
                    )}
                  </div>
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
                    {founder.image_url ? (
                      <Image
                        alt={founder.full_name}
                        className="h-20 w-20 rounded-full object-cover shadow-lg"
                        height={80}
                        src={founder.image_url}
                        width={80}
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-2xl font-black text-white shadow-lg">
                        {initials}
                      </div>
                    )}
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

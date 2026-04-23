export const revalidate = 600

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
import { HomeStatsBand } from '@/components/public/HomeStatsBand'
import { HomeMissionSection } from '@/components/public/HomeMissionSection'
import { HomeFoundersSection } from '@/components/public/HomeFoundersSection'

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

  const stats = [
    { value: '1997', label: t('stats_reunions') },
    { value: '1999', label: t('stats_fondation') },
    { value: '19', label: t('stats_presidents') },
    { value: locale === 'fr' ? '25 ans' : '25 years', label: t('stats_existence') }
  ]

  const missionCards = [
    {
      title: locale === 'fr' ? 'Communaute' : 'Community',
      copy:
        locale === 'fr'
          ? "Un reseau actif pour orienter, connecter et soutenir les etudiants camerounais dans les grandes villes de Chine."
          : 'An active network to orient, connect, and support Cameroonian students across major Chinese cities.',
      index: '01',
      href: `/${locale}/a-propos`,
      icon: 'community' as const,
      theme: 'brand' as const
    },
    {
      title: locale === 'fr' ? 'Memoire' : 'Memory',
      copy:
        locale === 'fr'
          ? "Une histoire documentee pour garder visibles les reperes, les figures et les decisions qui ont structure l'AECC."
          : 'A documented history that keeps visible the milestones, people, and decisions that shaped AECC.',
      index: '02',
      href: `/${locale}/histoire`,
      icon: 'memory' as const,
      theme: 'heritage' as const
    },
    {
      title: locale === 'fr' ? 'Opportunites' : 'Opportunities',
      copy:
        locale === 'fr'
          ? 'Des informations utiles sur les bourses, stages, candidatures et initiatives a saisir rapidement.'
          : 'Useful information on scholarships, internships, applications, and initiatives worth acting on quickly.',
      index: '03',
      href: `/${locale}/opportunites`,
      icon: 'opportunities' as const,
      theme: 'accent' as const
    }
  ]

  return (
    <PageTransition>
      <div className="overflow-x-hidden bg-[linear-gradient(180deg,#fff4e9_0%,#fff8ef_18%,#f6f8ef_48%,#f8ece6_100%)]">
        <HeroSection />

        <HomeStatsBand stats={stats} />

        <HomeMissionSection
          cards={missionCards}
          eyebrow="AECC"
          intro={
            locale === 'fr'
              ? "Une structure utile, plus lisible et plus dense pour faire circuler l'information, transmettre l'histoire et renforcer l'entraide."
              : 'A clearer, denser structure built to circulate information, transmit history, and strengthen mutual support.'
          }
          locale={locale}
          statement={
            locale === 'fr'
              ? "L'AECC organise l'entraide, garde la memoire visible et rend l'opportunite actionnable."
              : 'AECC organizes support, keeps memory visible, and turns opportunity into action.'
          }
          title={t('mission_title')}
        />

        <section className="relative border-y border-neutral-200/70 bg-[linear-gradient(135deg,#0d1612_0%,#173f33_30%,#7c2015_72%,#ef9f27_115%)] py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_22%)]" />
          <div className="container-shell relative grid gap-8 md:grid-cols-[0.86fr_1.14fr] md:items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-50">
                {locale === 'fr' ? 'Flux AECC' : 'AECC feed'}
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-[2.5rem]">
                {locale === 'fr' ? 'Les informations a voir maintenant' : 'What matters right now'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/76">
                {locale === 'fr'
                  ? "Un flux court, dense et utile: annonces recentes et opportunites a saisir, sans habillage inutile."
                  : 'A short, dense, useful feed: recent announcements and timely opportunities, without ornamental clutter.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-neutral-900 shadow-[0_24px_48px_-18px_rgba(0,0,0,0.42)] transition-all hover:-translate-y-1 hover:bg-accent-50"
                  href={`/${locale}/annonces`}
                >
                  {locale === 'fr' ? 'Toutes les annonces' : 'All announcements'}
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center rounded-xl border border-white/20 bg-black/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:bg-black/25"
                  href={`/${locale}/opportunites`}
                >
                  {locale === 'fr' ? 'Toutes les opportunites' : 'All opportunities'}
                </Link>
              </div>
            </div>

            <RevealSection className="grid gap-4 md:grid-cols-2">
              {mixedFeed.map((entry) => (
                <RevealItem key={`${entry.kind}-${entry.item.id}`}>
                  {entry.kind === 'announcement' ? (
                    <AnnouncementCard announcement={entry.item} locale={locale} />
                  ) : (
                    <OpportunityCard locale={locale} opportunity={entry.item} />
                  )}
                </RevealItem>
              ))}
            </RevealSection>
          </div>
        </section>

        <HomeFoundersSection
          ctaHref={`/${locale}/histoire`}
          ctaLabel={locale === 'fr' ? 'Voir l histoire' : 'See the history'}
          eyebrow="AECC"
          founders={founders.slice(0, 6)}
          intro={
            locale === 'fr'
              ? "Les personnes qui ont pose les bases de l'association restent visibles, identifiables et reliees a notre histoire collective."
              : 'The people who laid the foundations of the association stay visible, identifiable, and tied to its collective history.'
          }
          locale={locale}
          title={t('founders_teaser')}
        />
      </div>
    </PageTransition>
  )
}

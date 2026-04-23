export const revalidate = 3600

import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { FounderCard } from '@/components/public/FounderCard'
import { PublicPageHero } from '@/components/public/PublicPageHero'
import { Timeline } from '@/components/public/Timeline'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'
import { PageTransition } from '@/components/ui/PageTransition'
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
  const firstBoard = presidents.slice(0, 2)

  return (
    <PageTransition>
      <div className="public-page space-y-20 py-10">
        <PublicPageHero
          eyebrow={t('label')}
          statement={
            locale === 'fr'
              ? 'Une trajectoire collective construite entre memoire, representation et solidarite en Chine.'
              : 'A collective trajectory shaped by memory, representation, and solidarity in China.'
          }
          subtitle={t('subtitle')}
          title={t('title')}
        />

        <section className="py-2">
          <div className="container-shell">
            <div className="public-panel grid gap-12 p-8 md:grid-cols-2 md:items-center md:p-10">
              <div className="overflow-hidden rounded-2xl shadow-card">
                <div className="aspect-video bg-gradient-to-br from-brand-700 via-brand-500 to-accent-300" />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-brand-700">
                  {locale === 'fr' ? 'Le contexte initial' : 'The initial context'}
                </h2>
                <p className="text-base leading-8 text-neutral-600">
                  {locale === 'fr'
                    ? "A la fin des annees 90, la communaute estudiantine camerounaise en Chine se densifie. L'AECC nait de ce besoin de solidarite, d'organisation et de representation."
                    : 'By the late 1990s, the Cameroonian student community in China was growing. AECC emerged from the need for solidarity, structure and representation.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell space-y-6">
          <Timeline events={timeline} locale={locale} />
        </section>

        <section className="py-2">
          <div className="container-shell space-y-8">
            <div className="public-panel p-8 md:p-10">
              <h2 className="section-heading">{t('premier_bureau')}</h2>
              <p className="section-copy">
                {locale === 'fr'
                  ? 'Premier bureau issu de l Assemblee Generale de Beijing en 1999.'
                  : 'First board established during the 1999 General Assembly in Beijing.'}
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {firstBoard.map((president, index) => {
                const period = `${president.year_start}${president.year_end ? ` - ${president.year_end}` : ''}`
                const accent =
                  index % 2 === 0
                    ? 'from-brand-700 via-brand-500 to-accent-300'
                    : 'from-[#0d1612] via-[#173f33] to-[#7c2015]'

                return (
                  <article
                    className="public-card overflow-hidden"
                    key={president.id}
                  >
                    <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                      <div className={`relative min-h-[12rem] overflow-hidden bg-gradient-to-br md:min-h-[18rem] ${accent}`}>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-15"
                          style={{
                            backgroundImage:
                              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                            backgroundSize: '22px 22px'
                          }}
                        />
                        <div className="absolute left-5 top-5 rounded-full bg-white/12 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/84 backdrop-blur-sm">
                          {locale === 'fr' ? 'Mandat fondateur' : 'Founding mandate'}
                        </div>
                        <div className="absolute inset-x-5 bottom-5 top-14 flex items-end justify-between gap-5">
                          <div>
                            <p className="text-[1.75rem] font-black leading-none tracking-[-0.06em] text-white md:text-[2.4rem] lg:text-[3rem]">
                              {period}
                            </p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-white/72 md:mt-3 md:text-sm">
                              {president.city ?? (locale === 'fr' ? 'Ville a renseigner' : 'City pending')}
                            </p>
                          </div>

                          <div className="relative h-28 w-22 shrink-0 overflow-hidden rounded-[1.2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] shadow-[0_28px_50px_-32px_rgba(0,0,0,0.72)] backdrop-blur-sm md:h-36 md:w-28">
                            {president.image_url ? (
                              <Image
                                alt={president.full_name}
                                className="h-full w-full object-cover"
                                fill
                                sizes="(min-width: 1024px) 12rem, 8rem"
                                src={president.image_url}
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                                <div className="absolute left-1/2 top-7 h-12 w-12 -translate-x-1/2 rounded-full border border-white/32 bg-white/16 md:top-9 md:h-14 md:w-14" />
                                <div className="absolute bottom-3 left-1/2 h-14 w-18 -translate-x-1/2 rounded-t-[999px] border border-white/28 bg-white/10 md:bottom-4 md:h-16 md:w-20" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-4 p-5 md:gap-6 md:p-8">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700/70">
                            {locale === 'fr' ? 'Premiere equipe executive' : 'First executive board'}
                          </p>
                          <h3 className="mt-2 text-[1.5rem] font-black leading-tight tracking-[-0.04em] text-neutral-900 md:mt-3 md:text-[2rem] md:leading-[0.94]">
                            {president.full_name}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-neutral-600 md:mt-4 md:text-base md:leading-7">
                            {locale === 'fr'
                              ? "Figure cle de la structuration initiale de l'AECC au moment de l'Assemblee Generale fondatrice."
                              : 'A key figure in the initial structuring of AECC during the founding General Assembly.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 md:gap-3">
                          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700 md:px-4 md:py-2">
                            {period}
                          </span>
                          <span className="inline-flex rounded-full bg-accent-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-400 md:px-4 md:py-2">
                            {president.city ?? '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="container-shell space-y-6">
          <div className="public-panel p-8 md:p-10">
            <h2 className="section-heading">{t('fondateurs_title')}</h2>
            <p className="section-copy">{t('fondateurs_subtitle')}</p>
          </div>
          <RevealSection className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {founders.map((founder, i) => (
              <RevealItem key={founder.id}>
                <FounderCard founder={founder} locale={locale} index={i} />
              </RevealItem>
            ))}
          </RevealSection>
        </section>
      </div>
    </PageTransition>
  )
}

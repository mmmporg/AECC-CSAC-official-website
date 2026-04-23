export const revalidate = 300

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { FilterBar } from '@/components/public/FilterBar'
import { PublicPageHero } from '@/components/public/PublicPageHero'
import { getAnnouncements } from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { getPageParam, getSearchParam } from '@/lib/utils'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'

export default async function AnnouncementsPage({
  params,
  searchParams
}: {
  params: { locale: Locale }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'annonces' })
  const category = getSearchParam(searchParams.category)
  const city = getSearchParam(searchParams.city)
  const date = getSearchParam(searchParams.date)
  const page = getPageParam(searchParams.page)
  const result = await getAnnouncements({
    category: category as never,
    city,
    date,
    page
  })
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))

  return (
    <PageTransition>
      <div className="public-page py-10">
        <PublicPageHero
          align="center"
          eyebrow={locale === 'fr' ? 'Communaute' : 'Community'}
          statement={
            locale === 'fr'
              ? 'Annonces, informations et appels utiles pour la vie etudiante camerounaise en Chine.'
              : 'Announcements, updates, and useful calls for Cameroonian student life in China.'
          }
          subtitle={t('subtitle')}
          title={t('title')}
        />

        <div className="container-shell">
          <div className="sticky top-[102px] z-10 mb-12 bg-[#fff8ef]/90 py-4 backdrop-blur">
            <div className="public-panel flex flex-col gap-6 p-4 md:flex-row md:items-center md:justify-between">
              <FilterBar
                kind="annonces"
                selectedCategory={category}
                selectedCity={city}
                selectedDate={date}
              />
              <Link
                className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow"
                href={`/${locale}/annonces/publier`}
              >
                {t('submit_btn')}
              </Link>
            </div>
          </div>

          {result.items.length === 0 ? (
            <div className="public-card p-8 text-sm text-neutral-600">{t('empty')}</div>
          ) : (
            <RevealSection className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.items.map((announcement) => (
                <RevealItem key={announcement.id}>
                  <AnnouncementCard announcement={announcement} locale={locale} />
                </RevealItem>
              ))}
            </RevealSection>
          )}

          <div className="mt-16 flex items-center justify-between">
            <Link
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:scale-[0.97] hover:border-brand-400 hover:text-brand-700"
              href={`/${locale}/annonces?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(city ? { city } : {}),
                ...(date ? { date } : {}),
                page: String(Math.max(1, page - 1))
              }).toString()}`}
            >
              ← {locale === 'fr' ? 'Precedent' : 'Previous'}
            </Link>
            <span className="text-sm tabular-nums text-neutral-500">
              {page} / {totalPages}
            </span>
            <Link
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:scale-[0.97] hover:border-brand-400 hover:text-brand-700"
              href={`/${locale}/annonces?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(city ? { city } : {}),
                ...(date ? { date } : {}),
                page: String(Math.min(totalPages, page + 1))
              }).toString()}`}
            >
              {locale === 'fr' ? 'Suivant' : 'Next'} →
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { FilterBar } from '@/components/public/FilterBar'
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
  const page = getPageParam(searchParams.page)
  const result = await getAnnouncements({
    category: category as never,
    city,
    page
  })
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))

  return (
    <PageTransition>
      <div className="container-shell py-10">
      <section className="mb-12 space-y-4 text-center">
        <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
          {locale === 'fr' ? 'Communauté' : 'Community'}
        </span>
        <h1 className="text-5xl font-black tracking-tight text-neutral-900 md:text-6xl">{t('title')}</h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-neutral-600">{t('subtitle')}</p>
      </section>

      <div className="sticky top-[88px] z-10 mb-12 bg-neutral-50/95 py-4 backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <FilterBar kind="annonces" selectedCategory={category} selectedCity={city} />
          <Link
            href={`/${locale}/annonces/publier`}
            className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow"
          >
            {t('submit_btn')}
          </Link>
        </div>
      </div>

      {result.items.length === 0 ? (
        <div className="surface-card p-8 text-sm text-neutral-600">{t('empty')}</div>
      ) : (
        <RevealSection className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((announcement) => (
            <RevealItem key={announcement.id}>
              <AnnouncementCard
                announcement={announcement}
                locale={locale}
              />
            </RevealItem>
          ))}
        </RevealSection>
      )}

      <div className="mt-16 flex items-center justify-between">
        <Link
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600"
          href={`/${locale}/annonces?${new URLSearchParams({
            ...(category ? { category } : {}),
            ...(city ? { city } : {}),
            page: String(Math.max(1, page - 1))
          }).toString()}`}
        >
          {locale === 'fr' ? 'Précédent' : 'Previous'}
        </Link>
        <span className="text-sm text-neutral-600">
          {page} / {totalPages}
        </span>
        <Link
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600"
          href={`/${locale}/annonces?${new URLSearchParams({
            ...(category ? { category } : {}),
            ...(city ? { city } : {}),
            page: String(Math.min(totalPages, page + 1))
          }).toString()}`}
        >
          {locale === 'fr' ? 'Suivant' : 'Next'}
        </Link>
      </div>
    </div>
    </PageTransition>
  )
}

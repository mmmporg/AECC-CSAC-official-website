import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { FilterBar } from '@/components/public/FilterBar'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import { getOpportunities } from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { getPageParam, getSearchParam } from '@/lib/utils'

export default async function OpportunitiesPage({
  params,
  searchParams
}: {
  params: { locale: Locale }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'opportunites' })
  const category = getSearchParam(searchParams.category)
  const page = getPageParam(searchParams.page)
  const result = await getOpportunities({
    category: category as never,
    page
  })
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))

  return (
    <div className="container-shell space-y-8 py-10">
      <section className="space-y-3">
        <h1 className="section-heading">{t('title')}</h1>
        <p className="section-copy">{t('subtitle')}</p>
      </section>

      <FilterBar kind="opportunites" selectedCategory={category} />

      {result.items.length === 0 ? (
        <div className="surface-card p-8 text-sm text-neutral-600">{t('empty')}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              locale={locale}
              opportunity={opportunity}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600"
          href={`/${locale}/opportunites?${new URLSearchParams({
            ...(category ? { category } : {}),
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
          href={`/${locale}/opportunites?${new URLSearchParams({
            ...(category ? { category } : {}),
            page: String(Math.min(totalPages, page + 1))
          }).toString()}`}
        >
          {locale === 'fr' ? 'Suivant' : 'Next'}
        </Link>
      </div>
    </div>
  )
}

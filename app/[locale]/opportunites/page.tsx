import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { FilterBar } from '@/components/public/FilterBar'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import { getOpportunities } from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { getPageParam, getSearchParam } from '@/lib/utils'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'

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
    <PageTransition>
      <div className="container-shell py-10">
      <section className="mb-12 max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
          {locale === 'fr' ? 'Opportunités' : 'Opportunities'}
        </span>
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">{t('title')}</h1>
        <p className="text-lg leading-8 text-neutral-600">{t('subtitle')}</p>
      </section>

      <div className="mb-12">
        <FilterBar kind="opportunites" selectedCategory={category} />
      </div>

      {result.items.length === 0 ? (
        <div className="surface-card p-8 text-sm text-neutral-600">{t('empty')}</div>
      ) : (
        <RevealSection className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((opportunity) => (
            <RevealItem key={opportunity.id}>
              <OpportunityCard
                locale={locale}
                opportunity={opportunity}
              />
            </RevealItem>
          ))}
        </RevealSection>
      )}

      <div className="mt-16 flex items-center justify-between">
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
    </PageTransition>
  )
}

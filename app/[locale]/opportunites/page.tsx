export const revalidate = 300

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { FilterBar } from '@/components/public/FilterBar'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import { PublicPageHero } from '@/components/public/PublicPageHero'
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
  const domain = getSearchParam(searchParams.domain)
  const deadline = getSearchParam(searchParams.deadline)
  const page = getPageParam(searchParams.page)
  const result = await getOpportunities({
    category: category as never,
    domain,
    deadline,
    page
  })
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))

  return (
    <PageTransition>
      <div className="public-page py-10">
        <PublicPageHero
          eyebrow={locale === 'fr' ? 'Opportunites' : 'Opportunities'}
          statement={
            locale === 'fr'
              ? 'Bourses, stages, programmes et appels a saisir rapidement.'
              : 'Scholarships, internships, programs, and calls worth acting on quickly.'
          }
          subtitle={t('subtitle')}
          title={t('title')}
        />

        <div className="container-shell">
          <div className="mb-12">
            <FilterBar
              kind="opportunites"
              selectedCategory={category}
              selectedDomain={domain}
              selectedDeadline={deadline}
            />
          </div>

          {result.items.length === 0 ? (
            <div className="public-card p-8 text-sm text-neutral-600">{t('empty')}</div>
          ) : (
            <RevealSection className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.items.map((opportunity) => (
                <RevealItem key={opportunity.id}>
                  <OpportunityCard locale={locale} opportunity={opportunity} />
                </RevealItem>
              ))}
            </RevealSection>
          )}

          <div className="mt-16 flex items-center justify-between">
            <Link
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:scale-[0.97] hover:border-brand-400 hover:text-brand-700"
              href={`/${locale}/opportunites?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(domain ? { domain } : {}),
                ...(deadline ? { deadline } : {}),
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
              href={`/${locale}/opportunites?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(domain ? { domain } : {}),
                ...(deadline ? { deadline } : {}),
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

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import {
  getOpportunityById,
  getSimilarOpportunities
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'

export default async function OpportunityDetailPage({
  params
}: {
  params: { locale: Locale; id: string }
}) {
  const locale = params.locale
  const opportunity = await getOpportunityById(params.id)

  if (!opportunity) {
    notFound()
  }

  const related = await getSimilarOpportunities(
    opportunity.id,
    opportunity.category
  )
  const title = locale === 'en' ? opportunity.title_en ?? opportunity.title_fr : opportunity.title_fr
  const description =
    locale === 'en'
      ? opportunity.description_en ?? opportunity.description_fr
      : opportunity.description_fr

  return (
    <PageTransition>
      <div className="container-shell space-y-8 py-10">
      <nav className="text-sm text-neutral-600">
        <Link href={`/${locale}`}>AECC</Link> /{' '}
        <Link href={`/${locale}/opportunites`}>
          {locale === 'fr' ? 'Opportunités' : 'Opportunities'}
        </Link>{' '}
        / {title}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <article className="space-y-6">
          <div className="rounded-3xl bg-brand-700 px-8 py-10 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">
              {opportunity.organization}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">{title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-brand-50/90">
              {description}
            </p>
          </div>
          <div className="surface-card p-8">
            <p className="text-base leading-8 text-neutral-600">{description}</p>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="surface-card p-5 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">
              {locale === 'fr' ? 'Date limite' : 'Deadline'}
            </p>
            <p className="mt-2">{formatDate(opportunity.deadline, locale)}</p>
            {opportunity.external_link ? (
              <>
                <p className="mt-4 font-semibold text-neutral-900">
                  {locale === 'fr' ? 'Lien' : 'Link'}
                </p>
                <a
                  className="mt-2 inline-flex text-brand-600"
                  href={opportunity.external_link}
                  rel="noreferrer"
                  target="_blank"
                >
                  {opportunity.external_link}
                </a>
              </>
            ) : null}
          </div>
        </aside>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">
          {locale === 'fr' ? 'Opportunités similaires' : 'Related opportunities'}
        </h2>
        <RevealSection className="grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <RevealItem key={item.id}>
              <OpportunityCard locale={locale} opportunity={item} />
            </RevealItem>
          ))}
        </RevealSection>
      </section>
    </div>
    </PageTransition>
  )
}

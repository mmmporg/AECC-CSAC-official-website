export const revalidate = 600

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import { PublicPageHero } from '@/components/public/PublicPageHero'
import {
  getOpportunityById,
  getSimilarOpportunities
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { getRichTextExcerpt } from '@/lib/rich-text'
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
  const descriptionExcerpt = getRichTextExcerpt(description, 220)

  return (
    <PageTransition>
      <div className="public-page py-10">
        <div className="container-shell space-y-8">
          <nav className="text-sm text-neutral-600">
            <Link href={`/${locale}`}>AECC / CSAC</Link> /{' '}
            <Link href={`/${locale}/opportunites`}>
              {locale === 'fr' ? 'Opportunites' : 'Opportunities'}
            </Link>{' '}
            / {title}
          </nav>

          <PublicPageHero
            eyebrow={locale === 'fr' ? 'Opportunite' : 'Opportunity'}
            statement={
              locale === 'fr'
                ? 'Une piste a saisir entre etudes, stages, financements et trajectoires professionnelles.'
                : 'A path worth taking across studies, internships, funding, and careers.'
            }
            subtitle={descriptionExcerpt}
            title={title}
          />

          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <article className="space-y-6">
              <div className="public-hero-dark px-8 py-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">
                  {opportunity.organization}
                </p>
                <h1 className="mt-4 text-4xl font-black leading-tight">{title}</h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-brand-50/90">
                  {descriptionExcerpt}
                </p>
              </div>
              <div
                className="public-card rich-content prose prose-lg max-w-none p-8 prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-strong:text-neutral-900 prose-a:text-[#1D9E75] prose-a:no-underline hover:prose-a:text-[#0F6E56]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </article>

            <aside className="space-y-4">
              <div className="public-card p-5 text-sm text-neutral-600">
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
              {locale === 'fr' ? 'Opportunites similaires' : 'Related opportunities'}
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
      </div>
    </PageTransition>
  )
}

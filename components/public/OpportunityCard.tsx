import Link from 'next/link'
import type { Opportunity } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'
import { formatDate, isUrgent } from '@/lib/utils'

interface OpportunityCardProps {
  opportunity: Opportunity
  locale: Locale
}

export function OpportunityCard({
  opportunity,
  locale
}: OpportunityCardProps) {
  const title = locale === 'en' ? opportunity.title_en ?? opportunity.title_fr : opportunity.title_fr
  const description =
    locale === 'en'
      ? opportunity.description_en ?? opportunity.description_fr
      : opportunity.description_fr

  return (
    <article className="surface-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <Badge category={opportunity.category} locale={locale} />
        {isUrgent(opportunity.deadline) ? (
          <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-400">
            {locale === 'fr' ? 'Urgent' : 'Urgent'}
          </span>
        ) : null}
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-600">
          {opportunity.organization}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-neutral-600">
        <span>{formatDate(opportunity.deadline, locale)}</span>
        <Link
          className="font-semibold text-brand-600"
          href={`/${locale}/opportunites/${opportunity.id}`}
        >
          {locale === 'fr' ? 'Voir le détail' : 'View details'}
        </Link>
      </div>
    </article>
  )
}

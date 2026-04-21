'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
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
  const shouldReduce = useReducedMotion()
  const title = locale === 'en' ? opportunity.title_en ?? opportunity.title_fr : opportunity.title_fr
  const description =
    locale === 'en'
      ? opportunity.description_en ?? opportunity.description_fr
      : opportunity.description_fr

  return (
    <motion.div
      whileHover={shouldReduce ? {} : { y: -4, boxShadow: '0 12px 32px rgba(29,158,117,0.12)' }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/${locale}/opportunites/${opportunity.id}`} className="focus:outline-none">
        <div className="surface-card flex h-full flex-col p-5 bg-white border border-neutral-200 rounded-xl cursor-pointer transition-colors group-hover:border-brand-400">
          <div className="mb-4 flex items-start justify-between gap-3">
            <Badge category={opportunity.category} locale={locale} />
            {isUrgent(opportunity.deadline) ? (
              <motion.span 
                animate={shouldReduce ? {} : { opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-400"
              >
                {locale === 'fr' ? 'Urgent' : 'Urgent'}
              </motion.span>
            ) : null}
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-600">
              {opportunity.organization}
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-brand-400 transition-colors">
              {title}
            </h3>
            <p className="line-clamp-3 text-sm leading-6 text-neutral-600">
              {description}
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-neutral-600">
            <span>{formatDate(opportunity.deadline, locale)}</span>
            <span className="font-semibold text-brand-600 flex items-center gap-1">
              {locale === 'fr' ? 'Voir le détail' : 'View details'}
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 0, x: -4 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="font-medium inline-block"
              >
                →
              </motion.span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

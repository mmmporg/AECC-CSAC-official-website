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
      whileHover={
        shouldReduce
          ? {}
          : {
              y: -8,
              rotate: 0.35,
              boxShadow: '0 30px 60px rgba(212,132,14,0.16)'
            }
      }
      whileTap={shouldReduce ? {} : { scale: 0.992 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link href={`/${locale}/opportunites/${opportunity.id}`} className="focus:outline-none">
        <article className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white shadow-[0_12px_30px_-18px_rgba(26,25,24,0.2)] transition-colors">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-300 via-accent-400 to-brand-400" />

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="space-y-3">
                <Badge category={opportunity.category} locale={locale} />
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  {opportunity.organization}
                </p>
              </div>
              {isUrgent(opportunity.deadline) ? (
                <motion.span
                  animate={shouldReduce ? {} : { opacity: [1, 0.72, 1], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full bg-accent-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-400"
                >
                  {locale === 'fr' ? 'Urgent' : 'Urgent'}
                </motion.span>
              ) : null}
            </div>

            <div className="relative mb-5 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgba(250,238,218,0.9),rgba(255,255,255,0.95))] px-5 py-4">
              <div className="absolute right-3 top-3 h-12 w-12 rounded-full bg-white/70 blur-xl" />
              <h3 className="relative text-xl font-black tracking-tight text-neutral-900 transition-colors group-hover:text-accent-400">
                {title}
              </h3>
            </div>

            <p className="flex-1 line-clamp-3 text-sm leading-7 text-neutral-600">
              {description}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm text-neutral-600">
              <span className="font-medium">
                {formatDate(opportunity.deadline, locale)}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
                {locale === 'fr' ? 'Voir le detail' : 'View details'}
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 0, x: -4 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="inline-block font-medium"
                >
                  →
                </motion.span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

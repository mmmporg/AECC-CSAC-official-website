'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Opportunity } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'
import { getRichTextExcerpt } from '@/lib/rich-text'
import { formatDate } from '@/lib/utils'

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
  const excerpt = getRichTextExcerpt(description)

  return (
    <motion.article
      whileHover={shouldReduce ? {} : { y: -8, rotate: 1.2, scale: 1.015 }}
      transition={{ duration: 0.22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,238,218,0.95))] p-4 shadow-[0_26px_60px_-30px_rgba(212,132,14,0.45)] sm:p-5"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1d9e75_0%,#ef9f27_100%)]" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-brand-100/65 blur-2xl transition duration-300 group-hover:scale-125" />
      <div className="mb-3">
        <Badge category={opportunity.category} locale={locale} />
      </div>

      <h3 className="text-sm font-black leading-snug text-neutral-900 transition-colors group-hover:text-brand-600 sm:text-base">
        <Link href={`/${locale}/opportunites/${opportunity.id}`} className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          {title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
        {excerpt}
      </p>

      <div className="mt-auto flex flex-col gap-1 pt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span className="truncate text-brand-700">{opportunity.organization}</span>
        <span className="shrink-0">{formatDate(opportunity.deadline, locale)}</span>
      </div>
    </motion.article>
  )
}

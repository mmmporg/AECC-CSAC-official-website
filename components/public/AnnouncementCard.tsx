'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Announcement } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeDate, isNew } from '@/lib/utils'

interface AnnouncementCardProps {
  announcement: Announcement
  locale: Locale
}

export function AnnouncementCard({
  announcement,
  locale
}: AnnouncementCardProps) {
  const shouldReduce = useReducedMotion()
  const title = locale === 'en' ? announcement.title_en ?? announcement.title_fr : announcement.title_fr
  const description =
    locale === 'en'
      ? announcement.description_en ?? announcement.description_fr
      : announcement.description_fr

  return (
    <motion.div
      whileHover={shouldReduce ? {} : { y: -4, boxShadow: '0 12px 32px rgba(29,158,117,0.12)' }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-t-xl bg-[#E1F5EE]">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#1D9E75]/30 to-transparent opacity-50"
          whileHover={shouldReduce ? {} : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        />
        <div className="absolute top-4 left-4">
          <Badge category={announcement.category} locale={locale} />
        </div>
        {isNew(announcement.created_at) ? (
          <motion.div 
            animate={shouldReduce ? {} : { opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 right-4 bg-[#EF9F27] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm"
          >
            {locale === 'fr' ? 'Nouveau' : 'New'}
          </motion.div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-400">
            {announcement.city}
          </span>
          <span className="text-[11px] text-neutral-500">
            {formatRelativeDate(announcement.created_at, locale)}
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-600">
          <Link href={`/${locale}/annonces/${announcement.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </Link>
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-6 text-neutral-600">
          {description}
        </p>
        <div className="pt-1">
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
            {locale === 'fr' ? 'Voir le détail' : 'View details'}
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
    </motion.div>
  )
}

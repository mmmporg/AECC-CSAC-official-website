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
    <motion.article
      whileHover={
        shouldReduce
          ? {}
          : {
              y: -8,
              rotate: -0.35,
              boxShadow: '0 30px 60px rgba(15,110,86,0.14)'
            }
      }
      whileTap={shouldReduce ? {} : { scale: 0.992 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white shadow-[0_12px_30px_-18px_rgba(26,25,24,0.2)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-accent-300" />

      <div className="relative h-48 w-full overflow-hidden rounded-t-[1.35rem] bg-[#E1F5EE] md:h-56">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_32%),linear-gradient(135deg,rgba(29,158,117,0.36),rgba(250,238,218,0.22),transparent)]" />
        <div className="absolute -right-8 top-6 h-24 w-24 rounded-full border border-white/30 bg-white/15 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="max-w-[70%]">
            <div className="mb-3">
              <Badge category={announcement.category} locale={locale} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700/80">
              {announcement.city}
            </p>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-neutral-700 backdrop-blur-sm">
            {formatRelativeDate(announcement.created_at, locale)}
          </span>
        </div>

        {isNew(announcement.created_at) ? (
          <motion.div
            animate={shouldReduce ? {} : { opacity: [1, 0.75, 1], y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-4 top-4 rounded-full bg-[#EF9F27] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm"
          >
            {locale === 'fr' ? 'Nouveau' : 'New'}
          </motion.div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-6">
        <h3 className="text-xl font-black tracking-tight text-[#1A1918] transition-colors group-hover:text-[#0F6E56]">
          <Link href={`/${locale}/annonces/${announcement.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </Link>
        </h3>

        <p className="flex-1 line-clamp-3 text-sm leading-7 text-[#65635E]">
          {description}
        </p>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D9E75]">
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
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            AECC
          </span>
        </div>
      </div>
    </motion.article>
  )
}

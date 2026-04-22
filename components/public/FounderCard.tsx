'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { Founder } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

interface FounderCardProps {
  founder: Founder
  locale: Locale
  index: number
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function FounderCard({ founder, locale, index }: FounderCardProps) {
  const shouldReduce = useReducedMotion()
  const role = locale === 'en' ? founder.role_en ?? founder.role_fr : founder.role_fr ?? founder.role_en

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, scale: 0.9, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      whileHover={shouldReduce ? {} : { scale: 1.03, y: -2 }}
      className="flex cursor-default items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4"
    >
      {founder.image_url ? (
        <motion.div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-brand-100"
          whileHover={shouldReduce ? {} : { scale: 1.1 }}
        >
          <Image
            alt={founder.full_name}
            className="object-cover"
            fill
            sizes="48px"
            src={founder.image_url}
          />
        </motion.div>
      ) : (
        <motion.div
          whileHover={shouldReduce ? {} : { scale: 1.1 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-100 bg-brand-50 text-sm font-semibold text-brand-600"
        >
          {getInitials(founder.full_name)}
        </motion.div>
      )}

      <div className="min-w-0">
        <p className="font-medium text-neutral-900 text-sm truncate">{founder.full_name}</p>
        {founder.in_memoriam && (
          <span className="text-xs text-neutral-400">† {locale === 'fr' ? 'In memoriam' : 'In memoriam'}</span>
        )}
        {role && !founder.in_memoriam && (
          <span className="text-xs bg-accent-50 text-accent-500 px-1.5 py-0.5 rounded-full inline-block mt-1">
            {role}
          </span>
        )}
      </div>
    </motion.div>
  )
}

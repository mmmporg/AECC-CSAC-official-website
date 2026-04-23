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

export function FounderCard({ founder, locale, index }: FounderCardProps) {
  const shouldReduce = useReducedMotion()
  const role = locale === 'en' ? founder.role_en ?? founder.role_fr : founder.role_fr ?? founder.role_en
  const hasImage = Boolean(founder.image_url)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={shouldReduce ? false : { opacity: 0, scale: 0.95, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.38, delay: (index % 4) * 0.05 }}
      whileHover={shouldReduce ? {} : { y: -4 }}
      className="group relative overflow-hidden rounded-[1.55rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,247,240,0.96))] shadow-[0_24px_60px_-34px_rgba(26,25,24,0.2)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1d9e75_0%,#d54832_58%,#ef9f27_100%)] opacity-80" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-100/30 blur-3xl transition-transform duration-300 group-hover:scale-125" />

      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,rgba(240,239,234,0.9),rgba(247,240,231,0.92))]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.26),transparent_42%,rgba(26,25,24,0.05)_100%)]" />
        {hasImage ? (
          <Image
            alt={founder.full_name}
            className="h-full w-full object-cover"
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            src={founder.image_url!}
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center pb-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(26,25,24,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(26,25,24,0.12) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            <div className="absolute inset-4 rounded-[1.25rem] border border-dashed border-neutral-300/60" />
            <div aria-hidden="true" className="relative flex flex-col items-center gap-1 opacity-[0.18]">
              <div className="h-10 w-10 rounded-full bg-neutral-500" />
              <div className="h-7 w-14 rounded-t-full bg-neutral-500" />
            </div>
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-neutral-500 shadow-sm backdrop-blur-sm">
          {num}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-sm font-black leading-snug tracking-[-0.02em] text-neutral-900 sm:text-[0.95rem]">
          {founder.full_name}
        </h3>

        <div className="flex min-h-[1.75rem] flex-wrap gap-2">
          {founder.in_memoriam && (
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-medium italic text-neutral-500">
              In memoriam
            </span>
          )}
          {role && !founder.in_memoriam && (
            <span className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1 text-[10px] font-bold text-accent-400">
              {role}
            </span>
          )}
          {!role && !founder.in_memoriam && (
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-medium text-neutral-500">
              {locale === 'fr' ? 'Membre fondateur' : 'Founding member'}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { TimelineEvent } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

const badgeColor: Record<string, string> = {
  green: '#1D9E75',
  amber: '#EF9F27',
  red:   '#E24B4A',
  gray:  '#6B6B6B',
}

function TimelineItem({
  event,
  index,
  locale,
}: {
  event: TimelineEvent
  index: number
  locale: Locale
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduce = useReducedMotion()
  const isLeft = index % 2 === 0
  const title = locale === 'en' ? event.title_en ?? event.title_fr : event.title_fr
  const description = locale === 'en' ? event.description_en ?? event.description_fr : event.description_fr
  const accent = badgeColor[event.color] ?? badgeColor.green

  return (
    <div ref={ref}>

      {/* ── Desktop: left/right alternation ── */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_80px_1fr] lg:items-start">

        {/* Left card slot */}
        <div className="flex justify-end pr-10">
          {isLeft && (
            <motion.article
              initial={shouldReduce ? false : { opacity: 0, x: -28 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[420px] rounded-xl border border-[#E0DED7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.07)]"
            >
              <h3 className="text-xl font-bold leading-snug text-neutral-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-500">{description}</p>
            </motion.article>
          )}
        </div>

        {/* Center: badge + horizontal connectors */}
        <div className="flex justify-center pt-5">
          <div className="relative">
            {/* connector → left card */}
            {isLeft && (
              <div
                aria-hidden="true"
                className="absolute right-full top-1/2 -translate-y-1/2"
                style={{ width: 24, height: 2, background: '#E0DED7' }}
              />
            )}
            {/* connector → right card */}
            {!isLeft && (
              <div
                aria-hidden="true"
                className="absolute left-full top-1/2 -translate-y-1/2"
                style={{ width: 24, height: 2, background: '#E0DED7' }}
              />
            )}
            <motion.div
              initial={shouldReduce ? false : { scale: 0.6, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="relative z-10 rounded-full px-4 py-2 text-xs font-bold text-white"
              style={{ background: accent }}
            >
              {event.period}
            </motion.div>
          </div>
        </div>

        {/* Right card slot */}
        <div className="flex justify-start pl-10">
          {!isLeft && (
            <motion.article
              initial={shouldReduce ? false : { opacity: 0, x: 28 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[420px] rounded-xl border border-[#E0DED7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.07)]"
            >
              <h3 className="text-xl font-bold leading-snug text-neutral-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-500">{description}</p>
            </motion.article>
          )}
        </div>
      </div>

      {/* ── Mobile: badge + connector + card on same row ── */}
      <div className="flex items-start gap-0 lg:hidden">
        {/* badge column, centered on the line */}
        <div className="relative z-10 flex w-[3.5rem] shrink-0 justify-center pt-1">
          <motion.div
            initial={shouldReduce ? false : { scale: 0.7, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-full px-3 py-1.5 text-[10px] font-bold leading-none text-white"
            style={{ background: accent }}
          >
            {event.period}
          </motion.div>
        </div>

        {/* horizontal connector */}
        <div
          aria-hidden="true"
          className="mt-[1.05rem] shrink-0 self-start"
          style={{ width: 24, height: 2, background: '#E0DED7' }}
        />

        {/* card */}
        <motion.article
          initial={shouldReduce ? false : { opacity: 0, x: 12 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="min-w-0 flex-1 rounded-xl border border-[#E0DED7] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-base font-bold leading-snug text-neutral-900">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-neutral-500">{description}</p>
        </motion.article>
      </div>
    </div>
  )
}

export function Timeline({ events, locale }: { events: TimelineEvent[]; locale: Locale }) {
  return (
    <section className="bg-white py-4">
      {/* Desktop: continuous center line behind all items */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-[#E0DED7] lg:block"
        />

        {/* Mobile: continuous left line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[1.65rem] w-0.5 bg-[#E0DED7] lg:hidden"
        />

        <div className="space-y-12">
          {events.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}

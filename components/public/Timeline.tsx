'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { TimelineEvent } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

const colorMap: Record<string, string> = {
  green: 'bg-brand-400 text-white',
  amber: 'bg-accent-300 text-white',
  red: 'bg-[#E24B4A] text-white',
  gray: 'bg-neutral-500 text-white',
}

function TimelineItem({ event, index, locale }: { event: TimelineEvent; index: number; locale: Locale }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduce = useReducedMotion()
  const isEven = index % 2 === 0
  
  const title = locale === 'en' ? event.title_en ?? event.title_fr : event.title_fr
  const description = locale === 'en' ? event.description_en ?? event.description_fr : event.description_fr

  return (
    <div ref={ref} className="relative flex items-start gap-6 md:gap-0">
      {/* Desktop: alternance gauche/droite */}
      <div className="hidden md:flex w-full items-start">
        {/* Contenu gauche */}
        <div className="w-5/12 pr-8">
          {isEven && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -48 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-brand-400 transition-colors"
            >
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
            </motion.div>
          )}
        </div>

        {/* Badge central avec bounce */}
        <div className="w-2/12 flex flex-col items-center">
          <motion.div
            initial={shouldReduce ? false : { scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
            className={`${colorMap[event.color] ?? colorMap.green} rounded-lg px-3 py-2 text-center font-bold text-sm min-w-[80px] z-10`}
          >
            {event.period}
          </motion.div>
          {/* Ligne verticale animée */}
          <motion.div
            initial={shouldReduce ? false : { scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-0.5 flex-1 bg-neutral-200 mt-2 origin-top"
          />
        </div>

        {/* Contenu droite */}
        <div className="w-5/12 pl-8">
          {!isEven && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: 48 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-brand-400 transition-colors"
            >
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: tout à gauche */}
      <div className="flex md:hidden gap-4 w-full">
        <div className="flex flex-col items-center">
          <motion.div
            initial={shouldReduce ? false : { scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`${colorMap[event.color] ?? colorMap.green} rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap`}
          >
            {event.period}
          </motion.div>
          <div className="w-0.5 flex-1 bg-neutral-200 mt-2" />
        </div>
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white border border-neutral-200 rounded-xl p-4 flex-1 mb-4"
        >
          <h3 className="font-bold text-neutral-900 mb-1">{title}</h3>
          <p className="text-neutral-600 text-sm">{description}</p>
        </motion.div>
      </div>
    </div>
  )
}

export function Timeline({ events, locale }: { events: TimelineEvent[]; locale: Locale }) {
  return (
    <div className="relative space-y-8">
      {events.map((event, i) => (
        <TimelineItem key={event.id} event={event} index={i} locale={locale} />
      ))}
    </div>
  )
}

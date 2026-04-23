'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { Founder } from '@/lib/supabase/types'

interface HomeFounderGridProps {
  founders: Founder[]
}

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

export function HomeFounderGrid({ founders }: HomeFounderGridProps) {
  const shouldReduce = useReducedMotion()
  const tones = [
    'from-brand-400 to-brand-700 shadow-[0_20px_42px_-22px_rgba(15,110,86,0.85)]',
    'from-heritage-400 to-heritage-700 shadow-[0_20px_42px_-22px_rgba(124,32,21,0.82)]',
    'from-accent-300 to-accent-400 shadow-[0_20px_42px_-22px_rgba(212,132,14,0.82)]'
  ]

  return (
    <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 md:grid-cols-6">
      {founders.map((founder, index) => {
        const fullName = founder.full_name
        const tone = tones[index % tones.length]

        return (
          <motion.div
            key={founder.id}
            initial={shouldReduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <div className="relative">
              <motion.div
                animate={
                  shouldReduce
                    ? undefined
                    : { y: [0, index % 2 === 0 ? -5 : -8, 0], rotate: [0, index % 2 === 0 ? -4 : 4, 0] }
                }
                whileHover={shouldReduce ? {} : { y: -6, scale: 1.09 }}
                transition={{
                  duration: shouldReduce ? 0.18 : 4.6 + (index % 3) * 0.6,
                  repeat: shouldReduce ? 0 : Infinity,
                  ease: 'easeInOut'
                }}
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black tracking-[-0.04em] text-white ${tone}`}
              >
                {getInitials(fullName)}
              </motion.div>

              <motion.div
                initial={false}
                animate={shouldReduce ? { opacity: 0 } : undefined}
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 min-w-max -translate-x-1/2 rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100"
              >
                {fullName}
              </motion.div>
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-800">
              {getFirstName(fullName)}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

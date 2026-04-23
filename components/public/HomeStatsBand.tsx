'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface StatItem {
  value: string
  label: string
}

interface HomeStatsBandProps {
  stats: StatItem[]
}

export function HomeStatsBand({ stats }: HomeStatsBandProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative w-full overflow-hidden bg-[linear-gradient(90deg,#1d9e75_0%,#0f6e56_20%,#d54832_58%,#ef9f27_100%)]">
      <motion.div
        aria-hidden="true"
        animate={shouldReduce ? { opacity: 0.4 } : { x: ['-8%', '12%', '-8%'] }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)]"
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="container-shell relative grid gap-5 py-6 text-white sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={shouldReduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={shouldReduce ? {} : { y: -6, scale: 1.02 }}
            className={`rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-4 backdrop-blur-sm ${index < stats.length - 1 ? 'md:border-r-0' : ''}`}
          >
            <motion.span
              className="text-[2rem] font-black leading-none tracking-[-0.04em] md:text-[2.5rem]"
              whileHover={shouldReduce ? {} : { scale: 1.06 }}
              transition={{ duration: 0.16 }}
            >
              {stat.value}
            </motion.span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

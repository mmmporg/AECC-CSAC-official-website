'use client'

import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

function AnimatedStat({
  delay,
  label,
  suffix,
  value
}: {
  value: number
  suffix: string
  label: string
  delay: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true })
  const shouldReduce = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) {
      return
    }

    if (shouldReduce) {
      setCount(value)
      return
    }

    let start = 0

    const step = (timestamp: number) => {
      if (!start) {
        start = timestamp
      }

      const progress = Math.min((timestamp - start) / 1600, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    const timeout = window.setTimeout(() => requestAnimationFrame(step), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, isInView, shouldReduce, value])

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="rounded-xl border border-brand-100 bg-brand-50 p-6 text-center"
      initial={shouldReduce ? false : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <div className="mb-1 text-4xl font-bold text-brand-400">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-neutral-600">{label}</div>
    </motion.div>
  )
}

function GeometricShapes() {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ rotate: [0, 5, 0], y: [0, -20, 0] }}
        className="absolute h-96 w-96 rounded-full bg-brand-50 opacity-60"
        style={{ right: '-60px', top: '-80px' }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={{ rotate: [0, 45, 0], y: [0, 12, 0] }}
        className="absolute h-24 w-24 bg-accent-50 opacity-50"
        style={{ borderRadius: '12px', bottom: '60px', left: '8%' }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.3, 1] }}
        className="absolute h-12 w-12 rounded-full bg-brand-100 opacity-40"
        style={{ left: '15%', top: '30%' }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={{ opacity: [0, 0.3, 0], scaleX: [0, 1, 0] }}
        className="absolute h-px bg-brand-100 opacity-30"
        style={{ right: '5%', top: '45%', width: '200px' }}
        transition={{ delay: 2, duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  )
}

export function HeroSection() {
  const locale = useLocale()
  const shouldReduce = useReducedMotion()
  const t = useTranslations('home')

  const words = t('hero_title').split(' ')
  const stats = [
    { value: 1997, suffix: '', label: t('stats_reunions') },
    { value: 1999, suffix: '', label: t('stats_fondation') },
    { value: 19, suffix: '', label: t('stats_presidents') },
    { value: 25, suffix: locale === 'fr' ? ' ans' : '', label: t('stats_existence') }
  ]

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#f5f1e7_100%)]">
      <GeometricShapes />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),transparent)]" />
      <div className="pointer-events-none absolute left-[6%] top-[18%] hidden h-40 w-40 rounded-full border border-brand-100/80 md:block" />
      <div className="pointer-events-none absolute bottom-[12%] right-[8%] hidden h-56 w-56 rounded-[2rem] bg-[linear-gradient(160deg,rgba(250,238,218,0.7),rgba(255,255,255,0.18))] md:block" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-[1.05fr_0.95fr] md:items-end">
        <div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-1.5 text-sm font-medium text-brand-600 backdrop-blur-sm"
          initial={shouldReduce ? false : { opacity: 0, y: -16 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
          {t('hero_badge')}
        </motion.div>

        <h1 className="mb-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-neutral-900 md:text-7xl xl:text-[5.5rem]">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              animate={{ opacity: 1, y: 0 }}
              className="mr-3 inline-block"
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 + index * 0.07, duration: 0.4 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl text-lg leading-8 text-neutral-600 md:text-xl"
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-wrap gap-4"
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <motion.div whileHover={shouldReduce ? {} : { scale: 1.03, y: -2 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
            <Link
              className="inline-flex rounded-xl bg-brand-600 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-700"
              href={`/${locale}/histoire`}
            >
              {t('cta_histoire')}
            </Link>
          </motion.div>
          <motion.div whileHover={shouldReduce ? {} : { scale: 1.03, y: -2 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
            <Link
              className="inline-flex rounded-xl border border-brand-600/20 bg-white/70 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 transition-colors hover:bg-white"
              href={`/${locale}/annonces`}
            >
              {t('cta_annonces')}
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={`${stat.label}-${index}`}
              delay={1400 + index * 100}
              label={stat.label}
              suffix={stat.suffix}
              value={stat.value}
            />
          ))}
        </div>
        </div>

        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          initial={shouldReduce ? false : { opacity: 0, x: 30 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-[2rem] bg-neutral-900 p-8 text-white shadow-[0_32px_70px_-28px_rgba(26,25,24,0.42)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-100">
              {locale === 'fr' ? 'Editorial note' : 'Editorial note'}
            </p>
            <p className="mt-4 text-3xl font-black leading-tight tracking-tight">
              {locale === 'fr'
                ? "Une memoire organisee. Une communaute utile. Une presence qui compte."
                : 'An organized memory. A useful community. A presence that matters.'}
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/70">
              <div className="rounded-2xl bg-white/6 px-4 py-3 backdrop-blur-sm">
                {locale === 'fr'
                  ? 'Annonces, opportunites et annuaire doivent etre accessibles en quelques secondes.'
                  : 'Announcements, opportunities, and directory access should be reachable in seconds.'}
              </div>
              <div className="rounded-2xl bg-white/6 px-4 py-3 backdrop-blur-sm">
                {locale === 'fr'
                  ? "L'heritage institutionnel reste visible, mais il ne ralentit jamais l'action."
                  : 'Institutional heritage stays visible, but never slows action down.'}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

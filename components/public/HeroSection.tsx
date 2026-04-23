'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'

function DotPattern() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,247,222,0.22) 1.2px, transparent 0)',
          backgroundSize: '18px 18px'
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'rgba(213,72,50,0.34)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'rgba(239,159,39,0.24)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'rgba(29,158,117,0.28)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,18,16,0.2) 0%, rgba(11,18,16,0.05) 32%, rgba(255,247,236,0.14) 100%)'
        }}
      />
    </>
  )
}

export function HeroSection() {
  const locale = useLocale()
  const shouldReduce = useReducedMotion()
  const t = useTranslations('home')

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(213,72,50,0.34),transparent_28%),radial-gradient(circle_at_top_right,rgba(239,159,39,0.24),transparent_24%),linear-gradient(135deg,#0c1511_0%,#12392f_28%,#7c2015_74%,#ef9f27_100%)]">
      <DotPattern />
      <motion.div
        aria-hidden="true"
        animate={shouldReduce ? { opacity: 0.6 } : { x: [0, 18, 0], y: [0, -12, 0], opacity: [0.45, 0.72, 0.45] }}
        className="pointer-events-none absolute left-[8%] top-[20%] h-48 w-48 rounded-full border border-white/15"
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        animate={shouldReduce ? { opacity: 0.5 } : { x: [0, -14, 0], y: [0, 16, 0], rotate: [0, 9, 0] }}
        className="pointer-events-none absolute bottom-[12%] right-[10%] h-44 w-44 rounded-[2rem] border border-accent-50/25 bg-white/5 backdrop-blur-[2px]"
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="container-shell relative z-10 grid gap-9 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
        <div className="max-w-2xl">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-50/25 bg-black/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-50 shadow-[0_16px_40px_-22px_rgba(0,0,0,0.7)] backdrop-blur-md"
            initial={shouldReduce ? false : { opacity: 0, y: -12 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            whileHover={shouldReduce ? {} : { y: -1 }}
          >
            <motion.span
              animate={shouldReduce ? undefined : { scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
              className="h-2 w-2 rounded-full bg-heritage-400"
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {t('hero_badge')}
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl text-[2.9rem] font-black leading-[0.9] tracking-[-0.06em] text-white md:text-[5.3rem]"
            initial={shouldReduce ? false : { opacity: 0, y: 22 }}
            transition={{ delay: 0.16, duration: 0.5 }}
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 max-w-xl text-base leading-7 text-white/78 md:text-lg"
            initial={shouldReduce ? false : { opacity: 0, y: 18 }}
            transition={{ delay: 0.24, duration: 0.45 }}
          >
            {t('hero_subtitle')}
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 flex flex-wrap gap-3"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            transition={{ delay: 0.32, duration: 0.45 }}
          >
            <motion.div whileHover={shouldReduce ? {} : { y: -2, scale: 1.02 }} whileTap={shouldReduce ? {} : { scale: 0.98 }}>
              <Link
                className="inline-flex min-h-11 items-center rounded-xl bg-heritage-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_20px_40px_-18px_rgba(213,72,50,0.8)] transition-all hover:bg-heritage-500 hover:shadow-[0_28px_48px_-18px_rgba(213,72,50,0.92)]"
                href={`/${locale}/histoire`}
              >
                {t('cta_histoire')}
              </Link>
            </motion.div>
            <motion.div whileHover={shouldReduce ? {} : { y: -2, scale: 1.02 }} whileTap={shouldReduce ? {} : { scale: 0.98 }}>
              <Link
                className="inline-flex min-h-11 items-center rounded-xl border border-accent-300/55 bg-accent-50/95 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-neutral-900 shadow-[0_20px_40px_-20px_rgba(239,159,39,0.65)] transition-all hover:border-accent-300 hover:bg-white hover:shadow-[0_26px_44px_-18px_rgba(239,159,39,0.78)]"
                href={`/${locale}/annonces`}
              >
                {t('cta_annonces')}
              </Link>
            </motion.div>
            <motion.div
              animate={shouldReduce ? { opacity: 1 } : { x: [0, 10, 0], opacity: [0.78, 1, 0.78] }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/82 backdrop-blur-md"
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="h-3 w-3 rounded-full bg-brand-400 shadow-[0_0_20px_rgba(29,158,117,0.95)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {locale === 'fr' ? 'Association vivante, visible, offensive' : 'Visible, active, unapologetic association'}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.aside
          animate={
            shouldReduce
              ? { opacity: 1, y: 0, rotate: -2 }
              : { opacity: 1, y: [0, -10, 0], rotate: [-2, 0, -2] }
          }
          className="relative ml-auto hidden w-full max-w-[32rem] md:block"
          initial={shouldReduce ? false : { opacity: 0, y: 24, rotate: 0 }}
          transition={
            shouldReduce
              ? { delay: 0.38, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
              : {
                  opacity: { delay: 0.38, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  y: { delay: 1, duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { delay: 1, duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
                }
          }
          whileHover={shouldReduce ? {} : { y: -8, rotate: 0.6, scale: 1.02 }}
        >
          <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[1.7rem] bg-[linear-gradient(135deg,rgba(29,158,117,0.42),rgba(213,72,50,0.42),rgba(239,159,39,0.34))] blur-sm" />
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(155deg,#05120e_0%,#10352b_34%,#631a12_72%,#ef9f27_130%)] px-7 py-7 text-white shadow-[0_35px_80px_-26px_rgba(0,0,0,0.75)]">
            <motion.div
              aria-hidden="true"
              animate={shouldReduce ? { opacity: 0.5 } : { x: ['-10%', '12%', '-10%'] }}
              className="absolute inset-y-0 left-[-15%] w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]"
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-50">
              {locale === 'fr' ? 'Note editoriale' : 'Editorial note'}
            </p>
            <blockquote className="mt-5 text-[1.8rem] font-black leading-[1.02] tracking-[-0.04em] md:text-[2.45rem]">
              {locale === 'fr'
                ? "Une communaute credible se construit quand la memoire, l'entraide et l'information vivent au meme endroit."
                : 'A credible community is built when memory, mutual support, and information live in the same place.'}
            </blockquote>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/72">
              {locale === 'fr'
                ? "L'AECC doit paraitre utile au premier regard: claire pour les nouveaux arrivants, serieuse pour les partenaires, vivante pour la communaute."
                : 'AECC should feel useful at first glance: clear for newcomers, serious for partners, alive for the community.'}
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Founder } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

interface HomeFoundersSectionProps {
  locale: Locale
  eyebrow: string
  title: string
  intro: string
  ctaLabel: string
  ctaHref: string
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

const tones = [
  {
    bubble: 'from-brand-400 to-brand-700 shadow-[0_24px_50px_-24px_rgba(15,110,86,0.82)]',
    ring: 'border-brand-400/25'
  },
  {
    bubble: 'from-heritage-400 to-heritage-700 shadow-[0_24px_50px_-24px_rgba(124,32,21,0.82)]',
    ring: 'border-heritage-400/25'
  },
  {
    bubble: 'from-accent-300 to-accent-400 shadow-[0_24px_50px_-24px_rgba(212,132,14,0.82)]',
    ring: 'border-accent-300/30'
  }
] as const

export function HomeFoundersSection({
  locale,
  eyebrow,
  title,
  intro,
  ctaLabel,
  ctaHref,
  founders
}: HomeFoundersSectionProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_38%,rgba(29,158,117,0.18),transparent_20%),radial-gradient(circle_at_50%_88%,rgba(255,235,187,0.6),transparent_24%),radial-gradient(circle_at_86%_36%,rgba(213,72,50,0.16),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-[linear-gradient(90deg,#12392f_0%,#7c2015_56%,#ef9f27_100%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[4%] top-14 h-[26rem] opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,24,39,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container-shell relative">
        <div className="overflow-hidden rounded-[2.3rem] border border-white/45 bg-[linear-gradient(135deg,rgba(255,251,242,0.88),rgba(251,244,234,0.86)_44%,rgba(248,237,231,0.82)_100%)] shadow-[0_42px_110px_-54px_rgba(26,25,24,0.42)]">
          <div className="grid gap-0 md:grid-cols-[0.96fr_1.04fr]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0d1612_0%,#14392e_34%,#7c2015_100%)] px-6 py-8 text-white md:px-10 md:py-10">
              <motion.div
                aria-hidden="true"
                animate={shouldReduce ? { opacity: 0.4 } : { x: ['-12%', '15%', '-12%'] }}
                className="pointer-events-none absolute inset-y-0 left-[-18%] w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]"
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent-50">
                {eyebrow}
              </span>
              <h2 className="mt-4 max-w-[10ch] text-[2rem] font-black leading-[0.92] tracking-[-0.05em] sm:text-[2.3rem] md:max-w-[9ch] md:text-[4.7rem]">
                {title}
              </h2>
              <p className="mt-6 max-w-[24ch] text-base leading-8 text-white/72 md:text-lg">
                {intro}
              </p>
              <Link
                className="mt-8 inline-flex min-h-12 items-center rounded-2xl bg-accent-50 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-neutral-900 shadow-[0_20px_48px_-22px_rgba(255,244,217,0.72)] transition-all hover:-translate-y-1"
                href={ctaHref}
              >
                {ctaLabel}
              </Link>
            </div>

            <div className="relative overflow-hidden px-6 py-10 md:px-8 md:py-12">
              <div className="pointer-events-none absolute inset-x-6 top-[48%] h-[3px] bg-[linear-gradient(90deg,rgba(29,158,117,0.88)_0%,rgba(213,72,50,0.82)_56%,rgba(239,159,39,0.88)_100%)] md:inset-x-8" />
              <div className="pointer-events-none absolute inset-x-6 top-[48%] h-10 bg-[linear-gradient(90deg,rgba(29,158,117,0.12),rgba(213,72,50,0.12),rgba(239,159,39,0.12))] blur-2xl md:inset-x-8" />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
                viewBox="0 0 760 360"
                preserveAspectRatio="none"
              >
                <path d="M36 180 L164 150 L278 192 L402 132 L548 170 L722 120" fill="none" stroke="rgba(17,24,39,0.14)" strokeDasharray="7 10" strokeWidth="2" />
                <circle cx="36" cy="180" r="4" fill="rgba(29,158,117,0.46)" />
                <circle cx="164" cy="150" r="4" fill="rgba(29,158,117,0.35)" />
                <circle cx="278" cy="192" r="4" fill="rgba(213,72,50,0.4)" />
                <circle cx="402" cy="132" r="4" fill="rgba(213,72,50,0.34)" />
                <circle cx="548" cy="170" r="4" fill="rgba(239,159,39,0.44)" />
                <circle cx="722" cy="120" r="4" fill="rgba(239,159,39,0.36)" />
              </svg>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-10">
                {founders.slice(0, 6).map((founder, index) => {
                  const tone = tones[index % tones.length]
                  const offset = index % 3 === 1 ? 'md:translate-y-16' : index % 3 === 2 ? 'md:translate-y-5' : 'md:-translate-y-4'

                  return (
                    <motion.div
                      key={founder.id}
                      initial={shouldReduce ? false : { opacity: 0, y: 18, scale: 0.94 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.38, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className={`group flex flex-col items-center text-center ${offset}`}
                    >
                      <motion.div
                        animate={
                          shouldReduce
                            ? undefined
                            : { y: [0, index % 2 === 0 ? -8 : -4, 0], rotate: [0, index % 2 === 0 ? -3 : 3, 0] }
                        }
                        whileHover={shouldReduce ? {} : { y: -8, scale: 1.08 }}
                        transition={{
                          duration: shouldReduce ? 0.18 : 4.5 + (index % 3) * 0.7,
                          repeat: shouldReduce ? 0 : Infinity,
                          ease: 'easeInOut'
                        }}
                        className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 bg-gradient-to-br text-[1.2rem] font-black tracking-[-0.05em] text-white sm:h-24 sm:w-24 sm:border-8 sm:text-[2rem] ${tone.bubble} ${tone.ring}`}
                      >
                        <div className="pointer-events-none absolute inset-[-10px] rounded-full border border-neutral-900/8 border-dashed" />
                        {getInitials(founder.full_name)}
                      </motion.div>
                      <span className="mt-2 text-[0.7rem] font-black uppercase tracking-[0.12em] text-neutral-900 sm:mt-4 sm:text-[1.05rem] sm:tracking-[0.18em]">
                        {getFirstName(founder.full_name)}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

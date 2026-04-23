'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, ScrollText, Users } from 'lucide-react'
import { RevealItem, RevealSection } from '@/components/ui/RevealSection'
import type { Locale } from '@/lib/i18n'

interface MissionCard {
  index: string
  title: string
  copy: string
  href: string
  icon: 'community' | 'memory' | 'opportunities'
  theme: 'brand' | 'heritage' | 'accent'
}

interface HomeMissionSectionProps {
  locale: Locale
  eyebrow: string
  title: string
  intro: string
  statement: string
  cards: MissionCard[]
}

const iconMap = {
  community: Users,
  memory: ScrollText,
  opportunities: BriefcaseBusiness
} as const

const themeStyles = {
  brand: {
    shell:
      'border-brand-400 bg-[linear-gradient(145deg,rgba(225,245,238,0.98),rgba(194,234,221,0.95))] shadow-[0_32px_90px_-46px_rgba(15,110,86,0.55)]',
    badge: 'bg-brand-400 text-white',
    icon: 'text-brand-700',
    link: 'text-brand-700'
  },
  heritage: {
    shell:
      'border-heritage-400 bg-[linear-gradient(145deg,rgba(252,231,227,0.98),rgba(247,209,200,0.96))] shadow-[0_36px_96px_-50px_rgba(124,32,21,0.58)]',
    badge: 'bg-heritage-400 text-white',
    icon: 'text-heritage-700',
    link: 'text-heritage-700'
  },
  accent: {
    shell:
      'border-accent-300 bg-[linear-gradient(145deg,rgba(250,238,218,0.98),rgba(244,224,178,0.96))] shadow-[0_34px_90px_-48px_rgba(212,132,14,0.48)]',
    badge: 'bg-accent-300 text-neutral-900',
    icon: 'text-accent-400',
    link: 'text-accent-400'
  }
} as const

export function HomeMissionSection({
  locale,
  eyebrow,
  title,
  intro,
  statement,
  cards
}: HomeMissionSectionProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-14 md:py-24">
      <motion.div
        aria-hidden="true"
        animate={shouldReduce ? { opacity: 1 } : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 10% 28%, rgba(29,158,117,0.22), transparent 22%), radial-gradient(circle at 56% 22%, rgba(255,235,187,0.72), transparent 20%), radial-gradient(circle at 84% 28%, rgba(213,72,50,0.2), transparent 18%), radial-gradient(circle at 82% 80%, rgba(239,159,39,0.22), transparent 18%)',
          backgroundSize: '170% 170%'
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(29,158,117,0.92)_0%,rgba(29,158,117,0.25)_24%,rgba(213,72,50,0.78)_62%,rgba(239,159,39,0.9)_100%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[3%] top-24 h-[30rem] opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,24,39,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="container-shell relative">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-white/50 bg-[linear-gradient(135deg,rgba(255,251,243,0.88),rgba(250,244,234,0.84)_46%,rgba(249,236,230,0.82)_100%)] px-6 py-6 shadow-[0_40px_110px_-54px_rgba(26,25,24,0.42)] backdrop-blur-md md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70" />
          <div className="pointer-events-none absolute bottom-8 left-0 top-8 w-10 border-l border-white/40" />
          <div className="pointer-events-none absolute bottom-8 right-0 top-8 w-10 border-r border-white/40" />
          <div className="pointer-events-none absolute left-8 top-8 h-10 w-10 border-l border-t border-neutral-900/12" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-10 w-10 border-b border-r border-neutral-900/12" />
          <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden rounded-[1.8rem] bg-[linear-gradient(135deg,#0c1511_0%,#12392f_34%,#7c2015_82%)] px-6 py-7 text-white shadow-[0_28px_80px_-36px_rgba(0,0,0,0.64)] md:px-8 md:py-9">
              <motion.div
                aria-hidden="true"
                animate={shouldReduce ? { opacity: 0.4 } : { x: ['-10%', '18%', '-10%'] }}
                className="pointer-events-none absolute inset-y-0 left-[-16%] w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]"
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                  backgroundSize: '22px 22px'
                }}
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent-50">
                {eyebrow}
              </span>
              <h2 className="mt-4 max-w-[10ch] text-[2rem] font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-[2.4rem] md:max-w-[8ch] md:text-[5.6rem]">
                {title}
              </h2>
            </div>

            <div className="relative flex flex-col justify-between rounded-[1.8rem] border border-white/45 bg-[linear-gradient(135deg,rgba(255,248,239,0.9),rgba(250,236,229,0.82))] px-6 py-7 md:px-8 md:py-9">
              <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#1d9e75_0%,#d54832_56%,#ef9f27_100%)]" />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
                viewBox="0 0 600 320"
                preserveAspectRatio="none"
              >
                <path d="M40 250 L170 160 L280 192 L412 110 L542 142" fill="none" stroke="rgba(17,24,39,0.16)" strokeDasharray="6 10" strokeWidth="2" />
                <circle cx="40" cy="250" r="5" fill="rgba(29,158,117,0.55)" />
                <circle cx="170" cy="160" r="5" fill="rgba(29,158,117,0.4)" />
                <circle cx="280" cy="192" r="5" fill="rgba(213,72,50,0.45)" />
                <circle cx="412" cy="110" r="5" fill="rgba(213,72,50,0.42)" />
                <circle cx="542" cy="142" r="5" fill="rgba(239,159,39,0.5)" />
              </svg>
              <p className="max-w-full text-[1.25rem] leading-[1.22] tracking-[-0.03em] text-neutral-800 sm:max-w-[20ch] sm:text-[1.5rem] md:text-[2.4rem]">
                {statement}
              </p>
              <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600 md:text-lg">
                {intro}
              </p>
            </div>
          </div>

          <RevealSection className="mt-8 grid gap-5 md:mt-[-1.4rem] md:grid-cols-[0.92fr_1.2fr_0.92fr] md:items-end">
            {cards.map((card, index) => {
              const Icon = iconMap[card.icon]
              const theme = themeStyles[card.theme]
              const isCenter = index === 1

              return (
                <RevealItem
                  key={card.title}
                  className={isCenter ? 'md:z-10 md:-translate-y-8' : index === 0 ? 'md:translate-y-10' : 'md:translate-y-14'}
                >
                  <motion.article
                    whileHover={
                      shouldReduce
                        ? {}
                        : {
                            y: isCenter ? -12 : -8,
                            rotate: isCenter ? -1 : index === 0 ? -2 : 2,
                            scale: isCenter ? 1.025 : 1.02
                          }
                    }
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className={`group relative flex min-h-[16rem] flex-col overflow-hidden rounded-[2rem] border-2 px-5 py-5 md:px-6 md:py-6 ${theme.shell} ${isCenter ? 'md:min-h-[27rem]' : 'md:min-h-[22.5rem]'}`}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#1d9e75_0%,#d54832_58%,#ef9f27_100%)]" />
                    <motion.div
                      aria-hidden="true"
                      animate={shouldReduce ? { opacity: 0.26 } : { x: ['-20%', '16%', '-20%'] }}
                      className="pointer-events-none absolute inset-y-0 left-[-18%] w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)]"
                      transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(17,24,39,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.18) 1px, transparent 1px)',
                        backgroundSize: '26px 26px'
                      }}
                    />
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 h-24 w-full opacity-30"
                      viewBox="0 0 400 90"
                      preserveAspectRatio="none"
                    >
                      <path d="M18 72 L96 50 L182 62 L248 24 L330 34 L382 18" fill="none" stroke="rgba(17,24,39,0.18)" strokeDasharray="6 8" strokeWidth="2" />
                      <circle cx="18" cy="72" r="4" fill="rgba(29,158,117,0.5)" />
                      <circle cx="96" cy="50" r="4" fill="rgba(29,158,117,0.4)" />
                      <circle cx="182" cy="62" r="4" fill="rgba(213,72,50,0.4)" />
                      <circle cx="248" cy="24" r="4" fill="rgba(213,72,50,0.38)" />
                      <circle cx="330" cy="34" r="4" fill="rgba(239,159,39,0.44)" />
                    </svg>

                    <div className="relative flex items-start justify-between gap-4">
                      <span className={`inline-flex h-14 min-w-14 items-center justify-center rounded-full text-[1rem] font-black tracking-[0.22em] ${theme.badge}`}>
                        {card.index}
                      </span>
                      <Icon className={`h-7 w-7 ${theme.icon}`} strokeWidth={2.2} />
                    </div>

                    <div className="relative mt-10 flex-1">
                      <h3 className="max-w-full text-[1.45rem] font-black leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:max-w-[10ch] sm:text-[1.7rem] md:text-[2.9rem]">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-full text-sm leading-7 text-neutral-700 sm:max-w-[28ch] md:mt-6 md:text-[1.1rem] md:leading-8">
                        {card.copy}
                      </p>
                    </div>

                    <Link
                      className={`relative mt-8 inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.24em] ${theme.link}`}
                      href={card.href}
                    >
                      {locale === 'fr' ? 'Voir plus' : 'Learn more'}
                      <motion.span
                        animate={shouldReduce ? undefined : { x: [0, 5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </Link>
                  </motion.article>
                </RevealItem>
              )
            })}
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

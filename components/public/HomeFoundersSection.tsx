'use client'

import Image from 'next/image'
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
  moreLabel: string
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


export function HomeFoundersSection({
  locale,
  eyebrow,
  title,
  intro,
  ctaLabel,
  ctaHref,
  founders,
  moreLabel
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

            <div className="flex flex-col items-center justify-center px-6 py-10 md:px-8 md:py-12">
              <div className="grid grid-cols-3 gap-x-5 gap-y-6 sm:gap-x-8 sm:gap-y-8">
                {founders.slice(0, 9).map((founder, index) => (
                  <motion.div
                    key={founder.id}
                    initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.32, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div
                      className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
                      style={{ backgroundColor: founder.image_url ? undefined : '#F1EFE8' }}
                    >
                      {founder.image_url ? (
                        <Image
                          alt={founder.full_name}
                          className="h-full w-full object-cover"
                          fill
                          sizes="72px"
                          src={founder.image_url}
                        />
                      ) : (
                        <span className="text-xs font-medium text-neutral-500 sm:text-sm">
                          {getInitials(founder.full_name)}
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[11px] sm:text-[12px]"
                      style={{ color: 'var(--color-text-secondary, #6b7280)' }}
                    >
                      {getFirstName(founder.full_name)}
                    </span>
                  </motion.div>
                ))}
              </div>
              <Link
                className="mt-7 text-[11px] sm:text-[12px] hover:underline"
                href={ctaHref}
                style={{ color: 'var(--color-text-secondary, #6b7280)' }}
              >
                {moreLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

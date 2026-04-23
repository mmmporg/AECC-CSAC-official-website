import type { ReactNode } from 'react'

interface PublicPageHeroProps {
  eyebrow: string
  title: string
  subtitle?: string
  statement?: string
  align?: 'left' | 'center'
  cta?: ReactNode
}

export function PublicPageHero({
  eyebrow,
  title,
  subtitle,
  statement,
  align = 'left',
  cta
}: PublicPageHeroProps) {
  const center = align === 'center'

  return (
    <section className="container-shell py-8 md:py-14">
      <div className="public-hero-shell px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#1d9e75_0%,#d54832_56%,#ef9f27_100%)]" />
        <div className={`grid gap-6 ${center ? '' : 'md:grid-cols-[1fr_0.88fr] md:items-end'}`}>
          <div className={`public-hero-dark px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-9 ${center ? 'text-center' : ''}`}>
            <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
            <span className="relative text-[11px] font-bold uppercase tracking-[0.28em] text-accent-50">
              {eyebrow}
            </span>
            <h1 className="relative mt-3 text-[1.9rem] font-black leading-[0.92] tracking-[-0.05em] sm:mt-4 sm:text-[2.8rem] md:text-[4.9rem]">
              {title}
            </h1>
          </div>

          {(subtitle || statement || cta) ? (
            <div className={`public-panel px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-9 ${center ? 'text-center' : ''}`}>
              {statement ? (
                <p className={`text-[1.15rem] leading-[1.24] tracking-[-0.03em] text-neutral-800 sm:max-w-[22ch] sm:text-[1.65rem] md:text-[2.2rem] ${center ? 'mx-auto' : ''}`}>
                  {statement}
                </p>
              ) : null}
              {subtitle ? (
                <p className={`text-base leading-8 text-neutral-600 md:text-lg ${statement ? 'mt-5' : ''}`}>
                  {subtitle}
                </p>
              ) : null}
              {cta ? <div className={`${statement || subtitle ? 'mt-6' : ''}`}>{cta}</div> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const sectionAssociation = locale === 'fr' ? 'Association' : 'Association'
  const sectionResources = locale === 'fr' ? 'Ressources' : 'Resources'
  const brandTitle = locale === 'fr' ? 'Réseau étudiant Cameroun - Chine' : 'Cameroon Student Network'
  const strapline = locale === 'fr'
    ? 'Étudiants camerounais en Chine, reliés par la mémoire, l’entraide et les opportunités.'
    : 'Cameroonian students in China, connected through memory, support, and opportunity.'
  const networkLabel = locale === 'fr'
    ? 'Réseau étudiant Cameroun • Chine'
    : 'Cameroon • China • Student Network'

  return (
    <footer className="relative mt-14 overflow-hidden bg-[#04342C] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1d9e75_0%,#1d9e75_22%,#d54832_62%,#ef9f27_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,158,117,0.12),transparent_24%),radial-gradient(circle_at_75%_12%,rgba(239,159,39,0.08),transparent_18%)]" />

      <div className="container-shell relative py-12 md:py-14">
        <div className="grid gap-10 border-b border-white/12 pb-8 md:grid-cols-[minmax(0,1.2fr)_0.8fr_0.8fr] md:gap-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-white/[0.07] shadow-[0_18px_44px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-sm">
                <Image
                  alt="AECC logo"
                  className="h-10 w-10 object-contain"
                  width={40}
                  height={40}
                  unoptimized
                  src="/logo-mark.png"
                />
              </div>
              <div>
                <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-accent-50/78">
                  AECC / CSAC
                </p>
                <p className="mt-1 text-[1.65rem] font-black leading-none tracking-[-0.04em] text-[#1D9E75]">
                  {brandTitle}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/74">
              {strapline}
            </p>

            <div className="mt-5">
              <Link
                className="inline-flex min-h-10 items-center rounded-full bg-white px-4 py-2.5 text-[12px] font-black uppercase tracking-[0.16em] text-neutral-900 shadow-[0_18px_42px_-24px_rgba(0,0,0,0.46)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-50"
                href="/admin/login"
              >
                {t('rejoindre')}
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-50/78">
              {sectionAssociation}
            </p>
            <div className="mt-4 flex flex-col gap-3 text-[15px] text-white/82">
              <Link className="transition-colors duration-200 hover:text-white" href={`/${locale}`}>
                {t('home')}
              </Link>
              <Link className="transition-colors duration-200 hover:text-white" href={`/${locale}/a-propos`}>
                {t('apropos')}
              </Link>
              <Link className="transition-colors duration-200 hover:text-white" href={`/${locale}/histoire`}>
                {t('histoire')}
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-50/78">
              {sectionResources}
            </p>
            <div className="mt-4 flex flex-col gap-3 text-[15px] text-white/82">
              <Link className="transition-colors duration-200 hover:text-white" href={`/${locale}/annonces`}>
                {t('annonces')}
              </Link>
              <Link className="transition-colors duration-200 hover:text-white" href={`/${locale}/opportunites`}>
                {t('opportunites')}
              </Link>
              <Link className="transition-colors duration-200 hover:text-white" href={`/${locale}/annuaire`}>
                {t('annuaire')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm text-white/62 md:flex-row md:items-center md:justify-between">
          <p>© 2026 AECC / CSAC. All rights reserved.</p>
          <p className="uppercase tracking-[0.18em] text-accent-50/72">
            {networkLabel}
          </p>
        </div>
      </div>
    </footer>
  )
}

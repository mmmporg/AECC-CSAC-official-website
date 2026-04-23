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
  const brandTitle =
    locale === 'fr'
      ? 'Association des Étudiants Camerounais en Chine'
      : 'Cameroonian Students in China'
  const strapline = locale === 'fr'
    ? "Étudiants camerounais en Chine, connectés par la mémoire, l'entraide et les opportunités."
    : 'Cameroonian students in China, connected through memory, support, and opportunity.'
  const networkLabel = locale === 'fr'
    ? 'Reseau etudiant Cameroun - Chine'
    : 'Cameroon - China - Student Network'

  return (
    <footer className="relative mt-14 overflow-hidden bg-[#04342C] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1d9e75_0%,#1d9e75_22%,#d54832_62%,#ef9f27_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,158,117,0.12),transparent_24%),radial-gradient(circle_at_75%_12%,rgba(239,159,39,0.08),transparent_18%)]" />

      <div className="container-shell relative py-8 md:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-white/12 pb-8 md:grid-cols-[minmax(0,1.2fr)_0.8fr_0.8fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[0.76rem] font-black uppercase tracking-[0.24em] text-accent-50/78">
              AECC / CSAC
            </p>
            <p className="mt-2 text-[1.45rem] font-black leading-[0.94] tracking-[-0.04em] text-[#1D9E75] md:text-[2.85rem]">
              {brandTitle}
            </p>
            <p className="mt-3 text-[14px] leading-6 text-white/74 md:mt-5 md:text-[15px] md:leading-7">
              {strapline}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-50/78">
              {sectionAssociation}
            </p>
            <div className="mt-3 flex flex-col gap-2.5 text-[14px] text-white/82 md:gap-3 md:text-[15px]">
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
            <div className="mt-3 flex flex-col gap-2.5 text-[14px] text-white/82 md:gap-3 md:text-[15px]">
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

        <div className="mt-5 flex flex-col gap-1.5 text-sm text-white/62 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-3">
          <p>Copyright 2026 AECC / CSAC. All rights reserved.</p>
          <p className="text-xs uppercase tracking-[0.18em] text-accent-50/72 md:text-sm">
            {networkLabel}
          </p>
        </div>
      </div>
    </footer>
  )
}

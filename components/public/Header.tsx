import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { NavMenu } from '@/components/public/NavMenu'
import { SimpleLangSwitcher } from '@/components/ui/SimpleLangSwitcher'
import { AnimatedHeaderWrapper } from '@/components/public/AnimatedHeaderWrapper'

interface HeaderProps {
  locale: Locale
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <AnimatedHeaderWrapper>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link className="group flex min-w-[11rem] items-center gap-4 xl:min-w-[15rem]" href={`/${locale}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/75 shadow-[0_18px_34px_-24px_rgba(26,25,24,0.32)] ring-1 ring-neutral-200/70 transition-transform duration-200 group-hover:-translate-y-0.5">
            <Image
              alt="AECC logo"
              className="h-full w-full object-contain"
              width={56}
              height={56}
              priority
              unoptimized
              src="/logo.png"
            />
          </div>
          <div className="hidden flex-col xl:flex">
            <span className="text-[0.72rem] font-black uppercase tracking-[0.24em] text-[#0f6e56]">
              AECC
            </span>
            <span className="text-sm font-medium text-neutral-500">
              Cameroon students in China
            </span>
          </div>
        </Link>

        <NavMenu locale={locale} translations={{
          home: t('home'),
          histoire: t('histoire'),
          annonces: t('annonces'),
          annuaire: t('annuaire'),
          opportunites: t('opportunites'),
          apropos: t('apropos')
        }} />

        <div className="flex min-w-[11rem] items-center justify-end gap-3 xl:min-w-[15rem]">
          <SimpleLangSwitcher locale={locale} />
          <Link
            className="inline-flex min-h-11 items-center rounded-full bg-[linear-gradient(135deg,#0f6e56_0%,#1d9e75_100%)] px-5 py-3 text-[13px] font-black uppercase tracking-[0.14em] text-white shadow-[0_20px_44px_-24px_rgba(15,110,86,0.62)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-24px_rgba(15,110,86,0.78)]"
            href="/admin/login"
          >
            {t('rejoindre')}
          </Link>
        </div>
      </nav>
    </AnimatedHeaderWrapper>
  )
}

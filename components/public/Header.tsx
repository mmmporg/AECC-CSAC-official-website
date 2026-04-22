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
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link className="group flex min-w-[10.5rem] items-center gap-3.5 xl:min-w-[14rem]" href={`/${locale}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,245,238,0.9))] shadow-[0_14px_28px_-22px_rgba(26,25,24,0.24)] ring-1 ring-white/80 transition-transform duration-200 group-hover:-translate-y-0.5">
            <Image
              alt="AECC logo"
              className="h-9 w-9 object-contain"
              width={36}
              height={36}
              priority
              unoptimized
              src="/logo-mark.png"
            />
          </div>
          <div className="hidden flex-col xl:flex">
            <span className="text-[0.69rem] font-black uppercase tracking-[0.22em] text-[#0f6e56]">
              AECC
            </span>
            <span className="text-[0.84rem] font-medium text-neutral-500/82">
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

        <div className="flex min-w-[10.5rem] items-center justify-end gap-2.5 xl:min-w-[14rem]">
          <SimpleLangSwitcher locale={locale} />
          <Link
            className="inline-flex min-h-10 items-center rounded-full bg-[linear-gradient(135deg,#0f6e56_0%,#1d9e75_100%)] px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-24px_rgba(15,110,86,0.58)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-24px_rgba(15,110,86,0.72)]"
            href="/admin/login"
          >
            {t('rejoindre')}
          </Link>
        </div>
      </nav>
    </AnimatedHeaderWrapper>
  )
}

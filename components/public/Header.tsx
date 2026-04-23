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
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-8 md:py-3">
        <Link className="flex min-w-0 flex-1 items-center xl:min-w-[8rem] xl:flex-none" href={`/${locale}`}>
          <div className="flex items-center justify-center">
            <Image
              alt="AECC logo"
              className="h-12 w-auto object-contain drop-shadow-[0_10px_18px_rgba(26,25,24,0.08)] sm:h-14 md:h-[5.75rem]"
              width={92}
              height={110}
              priority
              unoptimized
              src="/logo.png"
            />
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

        <div className="flex flex-none items-center gap-2 xl:min-w-[15rem] xl:justify-end xl:gap-2.5">
          <SimpleLangSwitcher locale={locale} />
        </div>
      </nav>
    </AnimatedHeaderWrapper>
  )
}

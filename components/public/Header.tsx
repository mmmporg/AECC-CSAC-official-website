import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

interface HeaderProps {
  locale: Locale
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-xl">
      <div className="container-shell flex h-header items-center justify-between gap-4">
        <Link className="text-2xl font-black tracking-tight text-brand-700" href={`/${locale}`}>
          AECC
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}/histoire`}>{t('histoire')}</Link>
          <Link href={`/${locale}/annonces`}>{t('annonces')}</Link>
          <Link href={`/${locale}/opportunites`}>{t('opportunites')}</Link>
          <Link href={`/${locale}/a-propos`}>{t('apropos')}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link
            className="hidden rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-bold text-white md:inline-flex"
            href="/admin/login"
          >
            {t('rejoindre')}
          </Link>
        </div>
      </div>
    </header>
  )
}

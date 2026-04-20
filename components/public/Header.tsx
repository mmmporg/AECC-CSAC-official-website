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
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-header items-center justify-between gap-4">
        <Link className="text-lg font-semibold text-brand-700" href={`/${locale}`}>
          AECC
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}/histoire`}>{t('histoire')}</Link>
          <Link href={`/${locale}/annonces`}>{t('annonces')}</Link>
          <Link href={`/${locale}/opportunites`}>{t('opportunites')}</Link>
          <Link href={`/${locale}/a-propos`}>{t('apropos')}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link
            className="hidden rounded-full bg-brand-400 px-4 py-2 text-sm font-medium text-white md:inline-flex"
            href="/admin/login"
          >
            {t('admin')}
          </Link>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <footer className="mt-20 bg-brand-800 py-12 text-white">
      <div className="container-shell flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-xl font-bold">AECC</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm uppercase tracking-wide text-brand-100">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}/histoire`}>{t('histoire')}</Link>
          <Link href={`/${locale}/annonces`}>{t('annonces')}</Link>
          <Link href={`/${locale}/opportunites`}>{t('opportunites')}</Link>
          <Link href={`/${locale}/a-propos`}>{t('apropos')}</Link>
          <Link href="/admin/login">{t('admin')}</Link>
        </div>
        <p className="text-sm text-brand-100/80">© 2026 AECC</p>
      </div>
    </footer>
  )
}

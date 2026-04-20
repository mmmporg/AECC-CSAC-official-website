import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-brand-700">AECC</p>
          <p className="max-w-xl text-sm leading-6 text-neutral-600">
            Association des Étudiants Camerounais en Chine. Réseau de mémoire,
            d&apos;entraide et d&apos;opportunités pour la communauté.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}/histoire`}>{t('histoire')}</Link>
          <Link href={`/${locale}/annonces`}>{t('annonces')}</Link>
          <Link href={`/${locale}/opportunites`}>{t('opportunites')}</Link>
          <Link href={`/${locale}/a-propos`}>{t('apropos')}</Link>
          <Link href="/admin/login">{t('admin')}</Link>
        </div>
      </div>
    </footer>
  )
}

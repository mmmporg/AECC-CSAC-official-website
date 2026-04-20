import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { NavMenu } from '@/components/public/NavMenu'
import { SimpleLangSwitcher } from '@/components/ui/SimpleLangSwitcher'

interface HeaderProps {
  locale: Locale
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f9f9f7]/80 backdrop-blur-xl shadow-[0_12px_32px_rgba(26,28,27,0.04)]">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link className="text-2xl font-black text-[#00694c]" href={`/${locale}`}>
          AECC
        </Link>
        
        <NavMenu locale={locale} translations={{
          home: t('home'),
          histoire: t('histoire'),
          annonces: t('annonces'),
          opportunites: t('opportunites'),
          apropos: t('apropos')
        }} />

        <div className="flex items-center gap-4">
          <SimpleLangSwitcher locale={locale} />
          <Link
            className="bg-[#00694c] text-white px-6 py-2 rounded-lg font-semibold scale-95 active:scale-90 duration-200 hover:bg-[#008560] transition-all"
            href="/admin/login"
          >
            {t('rejoindre')}
          </Link>
        </div>
      </nav>
    </header>
  )
}

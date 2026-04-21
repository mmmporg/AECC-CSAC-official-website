import { getTranslations } from 'next-intl/server'
import { JoinDirectoryForm } from '@/components/public/JoinDirectoryForm'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'
import type { Locale } from '@/lib/i18n'

export default async function JoinDirectoryPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'rejoindre_annuaire' })

  return (
    <PageTransition>
      <div className="container-shell py-12 md:py-20 lg:max-w-4xl">
        <RevealSection className="space-y-8">
          <RevealItem>
            <div className="text-center space-y-4">
              <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                {locale === 'fr' ? 'Réseau' : 'Network'}
              </span>
              <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-xl text-lg leading-8 text-neutral-600">
                {t('subtitle')}
              </p>
            </div>
          </RevealItem>
          
          <RevealItem>
            <JoinDirectoryForm />
          </RevealItem>
        </RevealSection>
      </div>
    </PageTransition>
  )
}

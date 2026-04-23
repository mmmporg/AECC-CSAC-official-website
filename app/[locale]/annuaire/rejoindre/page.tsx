import { getTranslations } from 'next-intl/server'
import { JoinDirectoryForm } from '@/components/public/JoinDirectoryForm'
import { PublicPageHero } from '@/components/public/PublicPageHero'
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
      <div className="public-page py-12 md:py-20">
        <PublicPageHero
          align="center"
          eyebrow={locale === 'fr' ? 'Reseau' : 'Network'}
          statement={
            locale === 'fr'
              ? 'Entrez dans le repertoire public de la communaute AECC en Chine.'
              : 'Join the public directory of the AECC community in China.'
          }
          subtitle={t('subtitle')}
          title={t('title')}
        />
        <div className="container-shell lg:max-w-4xl">
          <RevealSection className="space-y-8">
            <RevealItem>
              <JoinDirectoryForm />
            </RevealItem>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  )
}

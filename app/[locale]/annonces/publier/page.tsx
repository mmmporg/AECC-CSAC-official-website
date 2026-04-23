import { getTranslations } from 'next-intl/server'
import { PublicAnnouncementForm } from '@/components/public/PublicAnnouncementForm'
import { PublicPageHero } from '@/components/public/PublicPageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'
import type { Locale } from '@/lib/i18n'

export default async function PublicSubmitAnnouncementPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'annonces.publier' })

  return (
    <PageTransition>
      <div className="public-page py-12 md:py-20">
        <PublicPageHero
          align="center"
          eyebrow={locale === 'fr' ? 'Communaute' : 'Community'}
          statement={
            locale === 'fr'
              ? 'Soumettez une annonce utile a la communaute etudiante camerounaise en Chine.'
              : 'Submit a useful announcement to the Cameroonian student community in China.'
          }
          subtitle={t('subtitle')}
          title={t('title')}
        />
        <div className="container-shell lg:max-w-4xl">
          <RevealSection className="space-y-8">
            <RevealItem>
              <PublicAnnouncementForm />
            </RevealItem>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  )
}

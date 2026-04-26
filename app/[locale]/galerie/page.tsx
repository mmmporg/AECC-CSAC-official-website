import { getTranslations } from 'next-intl/server'
import { getAllGalleryPhotos } from '@/lib/data/public'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'
import { GalerieGrid } from '@/components/public/GalerieGrid'
import type { Locale } from '@/lib/i18n'
import { PublicPageHero } from '@/components/public/PublicPageHero'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'galerie' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function GaleriePage({
  params,
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const photos = await getAllGalleryPhotos()

  const title = locale === 'fr' ? 'Galerie Photos' : 'Photo Gallery'
  const subtitle =
    locale === 'fr'
      ? 'Retrouvez les meilleurs moments de la communaute AECC a travers les annees.'
      : 'Explore the best moments of the AECC community through the years.'

  return (
    <PageTransition>
      <div className="public-page space-y-20 py-10">
        <PublicPageHero
          eyebrow={locale === 'fr' ? 'Communaute' : 'Community'}
          statement={
            locale === 'fr'
              ? "Les moments qui ont construit la memoire visuelle de l'AECC en Chine."
              : 'The moments that built AECC’s visual memory in China.'
          }
          subtitle={subtitle}
          title={title}
        />

        <section className="container-shell">
          <RevealSection>
            <RevealItem>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-900">
                {`${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
              </h2>
            </RevealItem>
            <RevealItem>
              <div className="public-card p-4 md:p-6">
                <GalerieGrid photos={photos} locale={locale} />
              </div>
            </RevealItem>
          </RevealSection>
        </section>
      </div>
    </PageTransition>
  )
}

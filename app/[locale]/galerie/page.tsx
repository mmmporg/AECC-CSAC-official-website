import { getTranslations } from 'next-intl/server'
import { getGalleryPhotos } from '@/lib/data/public'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'
import { GalerieGrid } from '@/components/public/GalerieGrid'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

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
  const photosResult = await getGalleryPhotos()
  const photos = photosResult.items

  const title = locale === 'fr' ? 'Galerie Photos' : 'Photo Gallery'
  const subtitle =
    locale === 'fr'
      ? 'Retrouvez les meilleurs moments de la communauté AECC à travers les années.'
      : 'Explore the best moments of the AECC community through the years.'

  return (
    <PageTransition>
      <div className="space-y-20 py-10">

        {/* ─── Hero ─── */}
        <section className="container-shell py-10 md:py-16">
          <RevealSection className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <RevealItem>
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                  {locale === 'fr' ? 'Communauté' : 'Community'}
                </span>
                <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-neutral-900 md:text-7xl">
                  {title}
                </h1>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="border-l-4 border-accent-300 pl-6 text-base leading-7 text-neutral-600">
                {subtitle}
              </div>
            </RevealItem>
          </RevealSection>
        </section>

        {/* ─── Gallery Grid ─── */}
        <section className="container-shell">
          <RevealSection>
            <RevealItem>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-900">
                {locale === 'fr'
                  ? `${photos.length} photo${photos.length !== 1 ? 's' : ''}`
                  : `${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
              </h2>
            </RevealItem>
            <RevealItem>
              <GalerieGrid photos={photos} locale={locale} />
            </RevealItem>
          </RevealSection>
        </section>
      </div>
    </PageTransition>
  )
}

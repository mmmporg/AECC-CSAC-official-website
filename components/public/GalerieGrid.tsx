// components/public/GalerieGrid.tsx
// Server-compatible grid component – receives photos as props (no client fetch needed).
import Image from 'next/image'
import type { GalleryPhoto } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

interface Props {
  photos: GalleryPhoto[]
  locale: Locale
}

export function GalerieGrid({ photos, locale }: Props) {
  if (!photos.length) {
    return (
      <div className="surface-card p-12 text-center text-neutral-600">
        {locale === 'fr'
          ? 'Aucune photo disponible pour le moment.'
          : 'No photos available yet.'}
      </div>
    )
  }

  // Group photos by year for display
  const byYear = photos.reduce<Record<number, GalleryPhoto[]>>((acc, photo) => {
    acc[photo.year] = acc[photo.year] ?? []
    acc[photo.year].push(photo)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a) // newest first

  return (
    <div className="space-y-16">
      {years.map(year => (
        <div key={year}>
          <h3 className="mb-6 text-xl font-bold text-neutral-800">{year}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {byYear[year].map(photo => (
              <figure
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    alt={
                      (locale === 'fr' ? photo.title_fr : photo.title_en) ??
                      photo.event_name ??
                      `Photo ${year}`
                    }
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    src={photo.image_url}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {(photo.title_fr || photo.title_en || photo.event_name) && (
                  <figcaption className="absolute bottom-0 left-0 right-0 translate-y-2 px-3 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="truncate text-sm font-semibold text-white">
                      {(locale === 'fr' ? photo.title_fr : photo.title_en) ?? photo.event_name}
                    </p>
                    {photo.event_name && (locale === 'fr' ? photo.title_fr : photo.title_en) && (
                      <p className="truncate text-xs text-white/70">{photo.event_name}</p>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

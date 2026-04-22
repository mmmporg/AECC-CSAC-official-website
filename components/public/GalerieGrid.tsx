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
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-black tracking-tight text-neutral-800">{year}</h3>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              {byYear[year].length} {locale === 'fr' ? 'images' : 'images'}
            </span>
          </div>

          {byYear[year][0] ? (
            <figure className="group relative mb-6 overflow-hidden rounded-[2rem] bg-neutral-100 shadow-[0_24px_60px_-32px_rgba(26,25,24,0.28)]">
              <div className="relative aspect-[16/7]">
                <Image
                  alt={
                    (locale === 'fr' ? byYear[year][0].title_fr : byYear[year][0].title_en) ??
                    byYear[year][0].event_name ??
                    `Photo ${year}`
                  }
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  fill
                  sizes="100vw"
                  src={byYear[year][0].image_url}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918]/80 via-[#1a1918]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="mb-3 inline-flex rounded-full bg-white/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    {locale === 'fr' ? 'Selection de l annee' : 'Year highlight'}
                  </div>
                  <p className="max-w-2xl text-2xl font-black tracking-tight text-white md:text-3xl">
                    {(locale === 'fr' ? byYear[year][0].title_fr : byYear[year][0].title_en) ??
                      byYear[year][0].event_name ??
                      `${locale === 'fr' ? 'Temps fort' : 'Highlight'} ${year}`}
                  </p>
                  {byYear[year][0].event_name &&
                    byYear[year][0].event_name !==
                      ((locale === 'fr' ? byYear[year][0].title_fr : byYear[year][0].title_en) ?? '') ? (
                    <p className="mt-2 text-sm text-white/75">{byYear[year][0].event_name}</p>
                  ) : null}
                </div>
              </div>
            </figure>
          ) : null}

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {byYear[year].slice(1).map((photo, index) => {
              const tall = index % 4 === 0 || index % 4 === 3

              return (
                <figure
                  key={photo.id}
                  className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-neutral-100 shadow-[0_18px_40px_-28px_rgba(26,25,24,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_55px_-28px_rgba(26,25,24,0.36)]"
                >
                  <div className={`relative ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                    <Image
                      alt={
                        (locale === 'fr' ? photo.title_fr : photo.title_en) ??
                        photo.event_name ??
                        `Photo ${year}`
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={photo.image_url}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918]/72 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {(photo.title_fr || photo.title_en || photo.event_name) && (
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 px-4 py-4 opacity-95 transition-all duration-300 group-hover:translate-y-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {(locale === 'fr' ? photo.title_fr : photo.title_en) ?? photo.event_name}
                      </p>
                      {photo.event_name && (locale === 'fr' ? photo.title_fr : photo.title_en) && (
                        <p className="truncate text-xs uppercase tracking-[0.14em] text-white/70">
                          {photo.event_name}
                        </p>
                      )}
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

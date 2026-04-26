'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryPhoto } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'
import { getRichTextExcerpt, normalizeRichTextInput } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

interface Props {
  photos: GalleryPhoto[]
  locale: Locale
}

interface GalleryEvent {
  id: string
  year: number
  label: string
  subtitle: string | null
  cover: GalleryPhoto
  photos: GalleryPhoto[]
}

function getEventLabel(photo: GalleryPhoto, locale: Locale) {
  return (
    (locale === 'fr' ? photo.event_name ?? photo.title_fr : photo.event_name ?? photo.title_en) ??
    photo.title_fr ??
    photo.title_en ??
    `AECC ${photo.year}`
  )
}

function getPhotoDescription(photo: GalleryPhoto, locale: Locale) {
  const detailedDescription =
    locale === 'fr'
      ? photo.description_fr ?? photo.description_en
      : photo.description_en ?? photo.description_fr

  if (detailedDescription) {
    return detailedDescription
  }

  return (
    (locale === 'fr' ? photo.title_fr : photo.title_en) ??
    photo.title_fr ??
    photo.title_en ??
    photo.event_name ??
    null
  )
}

function groupPhotosByEvent(photos: GalleryPhoto[], locale: Locale) {
  const grouped = new Map<string, GalleryEvent>()

  for (const photo of photos) {
    const eventLabel = getEventLabel(photo, locale)
    const key = `${photo.year}::${eventLabel.trim().toLowerCase()}`
    const current = grouped.get(key)

    if (current) {
      current.photos.push(photo)
      continue
    }

    grouped.set(key, {
      id: key,
      year: photo.year,
      label: eventLabel,
      subtitle: getRichTextExcerpt(getPhotoDescription(photo, locale), 110),
      cover: photo,
      photos: [photo]
    })
  }

  return Array.from(grouped.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }

    return a.label.localeCompare(b.label)
  })
}

export function GalerieGrid({ photos, locale }: Props) {
  const events = useMemo(() => groupPhotosByEvent(photos, locale), [locale, photos])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  )

  const selectedPhoto = selectedEvent?.photos[selectedPhotoIndex] ?? null

  useEffect(() => {
    if (!selectedEvent) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedEventId(null)
      }

      if (!selectedEvent) {
        return
      }

      if (event.key === 'ArrowRight') {
        setSelectedPhotoIndex((current) => (current + 1) % selectedEvent.photos.length)
      }

      if (event.key === 'ArrowLeft') {
        setSelectedPhotoIndex((current) =>
          current === 0 ? selectedEvent.photos.length - 1 : current - 1
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedEvent])

  if (!photos.length) {
    return (
      <div className="surface-card p-12 text-center text-neutral-600">
        {locale === 'fr'
          ? 'Aucune photo disponible pour le moment.'
          : 'No photos available yet.'}
      </div>
    )
  }

  const years = Array.from(new Set(events.map((event) => event.year))).sort((a, b) => b - a)

  return (
    <>
      <div className="space-y-16">
        {years.map((year) => {
          const yearEvents = events.filter((event) => event.year === year)

          return (
            <section key={year} className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <h3 className="text-2xl font-black tracking-tight text-neutral-900">{year}</h3>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {yearEvents.length} {locale === 'fr' ? 'evenements' : 'events'}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {yearEvents.map((event) => (
                  <button
                    key={event.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-[#ece7dd] bg-white text-left shadow-[0_24px_60px_-36px_rgba(26,25,24,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-34px_rgba(26,25,24,0.36)]"
                    onClick={() => {
                      setSelectedEventId(event.id)
                      setSelectedPhotoIndex(0)
                    }}
                    type="button"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <Image
                        alt={event.label}
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        src={event.cover.image_url}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918]/72 via-[#1a1918]/12 to-transparent" />
                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#04342C]">
                        {event.photos.length} {event.photos.length > 1 ? 'photos' : 'photo'}
                      </div>
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f6e56]">
                          {year}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                          {locale === 'fr' ? 'Voir plus' : 'Open'}
                        </span>
                      </div>

                      <div>
                        <p className="text-xl font-black tracking-tight text-neutral-900">
                          {event.label}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                          {event.subtitle ??
                            (locale === 'fr'
                              ? 'Cliquez pour voir les photos et les details de cet evenement.'
                              : 'Open to see the photos and details of this event.')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {selectedEvent && selectedPhoto ? (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[rgba(11,15,13,0.76)] p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-[#f8f8f6] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.65)]">
            <button
              aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
              className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#04342C] shadow-sm transition hover:bg-white"
              onClick={() => setSelectedEventId(null)}
              type="button"
            >
              <X size={20} />
            </button>

            <div className="grid max-h-[90vh] overflow-y-auto lg:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="flex flex-col border-b border-[#e4dfd6] bg-white p-6 lg:border-b-0 lg:border-r">
                <div className="space-y-4">
                  <span className="inline-flex w-fit rounded-full bg-[#edf7f2] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f6e56]">
                    {selectedEvent.year}
                  </span>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-neutral-900">
                      {selectedEvent.label}
                    </h3>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      {selectedEvent.photos.length} {locale === 'fr' ? 'photo(s)' : 'photo(s)'}
                    </p>
                  </div>
                  <div
                    className="prose prose-sm max-w-none rounded-[1.5rem] bg-[#f7f3eb] p-4 leading-7 text-neutral-600 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-strong:text-neutral-900 prose-a:text-[#1D9E75]"
                    dangerouslySetInnerHTML={{
                      __html: normalizeRichTextInput(
                        getPhotoDescription(selectedPhoto, locale) ??
                          (locale === 'fr'
                            ? 'Aucune description disponible pour cette photo.'
                            : 'No description available for this photo.')
                      )
                    }}
                  />
                </div>

                {selectedEvent.photos.length > 1 ? (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                      {locale === 'fr' ? 'Autres photos' : 'More photos'}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedEvent.photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          className={cn(
                            'relative aspect-square overflow-hidden rounded-2xl border transition',
                            index === selectedPhotoIndex
                              ? 'border-[#1d9e75] ring-2 ring-[#1d9e75]/25'
                              : 'border-[#e6dfd2] hover:border-[#cfc6b5]'
                          )}
                          onClick={() => setSelectedPhotoIndex(index)}
                          type="button"
                        >
                          <Image
                            alt={getPhotoDescription(photo, locale) ?? selectedEvent.label}
                            className="object-cover"
                            fill
                            sizes="120px"
                            src={photo.image_url}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>

              <div className="relative flex min-h-[360px] items-center justify-center bg-[#ebe6dc] p-4 md:p-6 lg:p-8">
                {selectedEvent.photos.length > 1 ? (
                  <>
                    <button
                      aria-label={locale === 'fr' ? 'Photo precedente' : 'Previous photo'}
                      className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#04342C] shadow-sm transition hover:bg-white"
                      onClick={() =>
                        setSelectedPhotoIndex((current) =>
                          current === 0 ? selectedEvent.photos.length - 1 : current - 1
                        )
                      }
                      type="button"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      aria-label={locale === 'fr' ? 'Photo suivante' : 'Next photo'}
                      className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#04342C] shadow-sm transition hover:bg-white"
                      onClick={() =>
                        setSelectedPhotoIndex((current) => (current + 1) % selectedEvent.photos.length)
                      }
                      type="button"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                ) : null}

                <div className="relative h-full max-h-[72vh] w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_70px_-30px_rgba(26,25,24,0.42)]">
                  <div className="relative h-[72vh] min-h-[340px] w-full">
                    <Image
                      alt={getPhotoDescription(selectedPhoto, locale) ?? selectedEvent.label}
                      className="object-contain"
                      fill
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      src={selectedPhoto.image_url}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

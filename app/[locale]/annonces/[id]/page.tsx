export const revalidate = 600

import { notFound } from 'next/navigation'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { PublicPageHero } from '@/components/public/PublicPageHero'
import {
  getAnnouncementById,
  getSimilarAnnouncements
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
import { getRichTextExcerpt } from '@/lib/rich-text'
import { formatDate } from '@/lib/utils'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealSection, RevealItem } from '@/components/ui/RevealSection'

export default async function AnnouncementDetailPage({
  params
}: {
  params: { locale: Locale; id: string }
}) {
  const locale = params.locale
  const announcement = await getAnnouncementById(params.id)

  if (!announcement) {
    notFound()
  }

  const related = await getSimilarAnnouncements(
    announcement.id,
    announcement.category
  )
  const title = locale === 'en' ? announcement.title_en ?? announcement.title_fr : announcement.title_fr
  const description =
    locale === 'en'
      ? announcement.description_en ?? announcement.description_fr
      : announcement.description_fr
  const descriptionExcerpt = getRichTextExcerpt(description, 220)

  return (
    <PageTransition>
      <div className="public-page py-10">
        <div className="container-shell space-y-8">
          <div aria-hidden="true" className="h-px bg-[#E0DED7]" />

          <PublicPageHero
            eyebrow={locale === 'fr' ? 'Annonce' : 'Announcement'}
            statement={
              locale === 'fr'
                ? 'Une information communautaire a consulter, relayer et activer rapidement.'
                : 'A community update to review, relay, and act on quickly.'
            }
            subtitle={descriptionExcerpt}
            title={title}
          />

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.82fr]">
            <article className="space-y-6">
              <div className="public-hero-dark px-8 py-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-50">
                  {announcement.category}
                </p>
                <h1 className="mt-4 text-4xl font-black leading-tight">{title}</h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-brand-50/90">
                  {descriptionExcerpt}
                </p>
              </div>
              <div
                className="public-card rich-content prose prose-lg max-w-none p-8 prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-strong:text-neutral-900 prose-a:text-[#1D9E75] prose-a:no-underline hover:prose-a:text-[#0F6E56]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </article>

            <aside className="space-y-4">
              <div className="public-card p-5 text-sm text-neutral-600">
                <p className="font-semibold text-neutral-900">
                  {locale === 'fr' ? 'Ville' : 'City'}
                </p>
                <p className="mt-2">{announcement.city}</p>
                <p className="mt-4 font-semibold text-neutral-900">
                  {locale === 'fr' ? 'Contact' : 'Contact'}
                </p>
                <p className="mt-2">{announcement.contact}</p>
                <p className="mt-4 font-semibold text-neutral-900">
                  {locale === 'fr' ? 'Expiration' : 'Expiration'}
                </p>
                <p className="mt-2">{formatDate(announcement.expires_at, locale)}</p>
              </div>
            </aside>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              {locale === 'fr' ? 'Annonces similaires' : 'Related announcements'}
            </h2>
            <RevealSection className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.id}>
                  <AnnouncementCard announcement={item} locale={locale} />
                </RevealItem>
              ))}
            </RevealSection>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}

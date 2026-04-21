import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import {
  getAnnouncementById,
  getSimilarAnnouncements
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'
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

  return (
    <PageTransition>
      <div className="container-shell space-y-8 py-10">
      <nav className="text-sm text-neutral-600">
        <Link href={`/${locale}`}>AECC</Link> /{' '}
        <Link href={`/${locale}/annonces`}>
          {locale === 'fr' ? 'Annonces' : 'Announcements'}
        </Link>{' '}
        / {title}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <article className="space-y-6">
          <div className="overflow-hidden rounded-2xl shadow-card">
            <div className="aspect-[16/9] bg-gradient-to-br from-brand-700 via-brand-500 to-accent-300" />
          </div>
          <div className="surface-card p-8">
            <h1 className="text-4xl font-black leading-tight text-neutral-900">{title}</h1>
            <div className="mt-6 space-y-4 text-base leading-8 text-neutral-600">
              <p>{description}</p>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="surface-card p-5 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">
              {locale === 'fr' ? 'Ville' : 'City'}
            </p>
            <p className="mt-2">{announcement.city}</p>
            <p className="font-semibold text-neutral-900">
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
    </PageTransition>
  )
}

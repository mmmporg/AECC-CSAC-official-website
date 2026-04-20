import Link from 'next/link'
import type { Announcement } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeDate, isNew } from '@/lib/utils'

interface AnnouncementCardProps {
  announcement: Announcement
  locale: Locale
}

export function AnnouncementCard({
  announcement,
  locale
}: AnnouncementCardProps) {
  const title = locale === 'en' ? announcement.title_en ?? announcement.title_fr : announcement.title_fr
  const description =
    locale === 'en'
      ? announcement.description_en ?? announcement.description_fr
      : announcement.description_fr

  return (
    <article className="surface-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <Badge category={announcement.category} locale={locale} />
        {isNew(announcement.created_at) ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            {locale === 'fr' ? 'Nouveau' : 'New'}
          </span>
        ) : null}
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-600">
          {announcement.city}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-neutral-600">
        <span>{formatRelativeDate(announcement.created_at, locale)}</span>
        <Link
          className="font-semibold text-brand-600"
          href={`/${locale}/annonces/${announcement.id}`}
        >
          {locale === 'fr' ? 'Voir le détail' : 'View details'}
        </Link>
      </div>
    </article>
  )
}

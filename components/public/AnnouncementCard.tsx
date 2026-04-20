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
    <div className="group flex flex-col cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-t-xl bg-[#E1F5EE]">
        {/* Placeholder gradient mimicking image cover since we have no DB images */}
        <div className="absolute inset-0 opacity-50 bg-gradient-to-tr from-[#1D9E75]/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Badge category={announcement.category} locale={locale} />
        </div>
        {isNew(announcement.created_at) ? (
          <div className="absolute top-4 right-4 bg-[#EF9F27] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            {locale === 'fr' ? 'Nouveau' : 'New'}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#FAEEDA] text-[#D4840E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {announcement.city}
          </span>
          <span className="text-xs text-[#65635E]">
            {formatRelativeDate(announcement.created_at, locale)}
          </span>
        </div>
        <h3 className="text-lg font-bold group-hover:text-[#1D9E75] transition-colors text-[#1A1918]">
          <Link href={`/${locale}/annonces/${announcement.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-[#65635E] flex-1">
          {description}
        </p>
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D9E75] flex items-center gap-1 group-hover:gap-2 transition-all">
            {locale === 'fr' ? 'VOIR LE DÉTAIL' : 'VIEW DETAILS'} <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </div>
  )
}

import type { Founder } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

interface FounderCardProps {
  founder: Founder
  locale: Locale
}

export function FounderCard({ founder, locale }: FounderCardProps) {
  const role = locale === 'en' ? founder.role_en ?? founder.role_fr : founder.role_fr ?? founder.role_en

  return (
    <article className="surface-card p-5">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-neutral-900">{founder.full_name}</h3>
        {role ? <p className="text-sm text-neutral-600">{role}</p> : null}
        {founder.in_memoriam ? (
          <p className="text-sm font-medium text-error">
            {locale === 'fr' ? 'In memoriam' : 'In memoriam'}
          </p>
        ) : null}
      </div>
    </article>
  )
}

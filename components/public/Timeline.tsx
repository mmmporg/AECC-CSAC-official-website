import type { TimelineEvent } from '@/lib/supabase/types'
import type { Locale } from '@/lib/i18n'

interface TimelineProps {
  events: TimelineEvent[]
  locale: Locale
}

const colorClasses: Record<string, string> = {
  green: 'bg-brand-400',
  amber: 'bg-accent-300',
  red: 'bg-error',
  gray: 'bg-neutral-600'
}

export function Timeline({ events, locale }: TimelineProps) {
  return (
    <div className="space-y-6">
      {events.map((event) => {
        const title = locale === 'en' ? event.title_en ?? event.title_fr : event.title_fr
        const description =
          locale === 'en'
            ? event.description_en ?? event.description_fr
            : event.description_fr

        return (
          <article
            key={event.id}
            className="grid gap-4 border-l border-neutral-200 pl-6 md:grid-cols-[160px_1fr]"
          >
            <div className="space-y-3">
              <span
                className={`block h-3 w-3 -translate-x-[1.9rem] rounded-full ${
                  colorClasses[event.color] ?? 'bg-brand-400'
                }`}
              />
              <p className="text-sm font-semibold text-brand-700">{event.period}</p>
            </div>
            <div className="surface-card p-5">
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface BadgeProps {
  category: string
  locale?: Locale
}

const categoryStyles: Record<string, string> = {
  logement: 'bg-brand-50 text-brand-700',
  vente: 'bg-accent-50 text-accent-400',
  entraide: 'bg-neutral-100 text-neutral-900',
  evenement: 'bg-brand-100 text-brand-700',
  bourse: 'bg-brand-50 text-brand-700',
  stage_emploi: 'bg-accent-50 text-accent-400',
  candidature: 'bg-neutral-100 text-neutral-900',
  formation: 'bg-brand-100 text-brand-700'
}

const categoryLabels: Record<string, { fr: string; en: string }> = {
  logement: { fr: 'Logement', en: 'Housing' },
  vente: { fr: 'Vente', en: 'Sale' },
  entraide: { fr: 'Entraide', en: 'Mutual aid' },
  evenement: { fr: 'Événement', en: 'Event' },
  bourse: { fr: 'Bourse', en: 'Scholarship' },
  stage_emploi: { fr: 'Stage / Emploi', en: 'Internship / Job' },
  candidature: { fr: 'Candidature', en: 'Application' },
  formation: { fr: 'Formation', en: 'Training' }
}

export function Badge({ category, locale = 'fr' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        categoryStyles[category] ?? 'bg-neutral-100 text-neutral-600'
      )}
    >
      {categoryLabels[category]?.[locale] ?? category}
    </span>
  )
}

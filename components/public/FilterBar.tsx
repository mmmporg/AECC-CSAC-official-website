'use client'

import { useTranslations } from 'next-intl'
import { announcementCategories, opportunityCategories } from '@/lib/options'
import { Button } from '@/components/ui/Button'

interface FilterBarProps {
  kind: 'annonces' | 'opportunites'
  selectedCategory?: string
  selectedCity?: string
  selectedDate?: string
  selectedDomain?: string
  selectedDeadline?: string
}

export function FilterBar({
  kind,
  selectedCategory,
  selectedCity,
  selectedDate,
  selectedDomain,
  selectedDeadline
}: FilterBarProps) {
  const t = useTranslations(kind)
  const categories =
    kind === 'annonces' ? announcementCategories : opportunityCategories

  return (
    <form className="public-card grid gap-3 p-4 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto]">
      <select
        className="h-11 rounded-xl border border-neutral-200 bg-white/90 px-4 text-sm text-neutral-900 shadow-sm"
        defaultValue={selectedCategory ?? ''}
        name="category"
      >
        <option value="">{t('categories.all')}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {t(`categories.${category}`)}
          </option>
        ))}
      </select>
      {kind === 'annonces' ? (
        <>
          <input
            className="h-11 rounded-xl border border-neutral-200 bg-white/90 px-4 text-sm text-neutral-900 shadow-sm"
            defaultValue={selectedCity ?? ''}
            name="city"
            placeholder={t('city_placeholder')}
          />
          <input
            className="h-11 rounded-xl border border-neutral-200 bg-white/90 px-4 text-sm text-neutral-900 shadow-sm"
            defaultValue={selectedDate ?? ''}
            name="date"
            type="date"
          />
        </>
      ) : (
        <>
          <input
            className="h-11 rounded-xl border border-neutral-200 bg-white/90 px-4 text-sm text-neutral-900 shadow-sm"
            defaultValue={selectedDomain ?? ''}
            name="domain"
            placeholder={t('domain_placeholder')}
          />
          <input
            className="h-11 rounded-xl border border-neutral-200 bg-white/90 px-4 text-sm text-neutral-900 shadow-sm"
            defaultValue={selectedDeadline ?? ''}
            name="deadline"
            type="date"
          />
        </>
      )}
      <Button type="submit" variant="outline" className="sm:col-span-2 md:col-span-1">
        {t('filter_cta')}
      </Button>
    </form>
  )
}

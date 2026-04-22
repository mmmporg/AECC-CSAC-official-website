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
    <form
      className={`surface-card grid gap-4 p-4 ${
        kind === 'annonces'
          ? 'md:grid-cols-[1fr_1fr_1fr_auto]'
          : 'md:grid-cols-[1fr_1fr_1fr_auto]'
      }`}
    >
      <select
        className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
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
            className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
            defaultValue={selectedCity ?? ''}
            name="city"
            placeholder={t('city_placeholder')}
          />
          <input
            className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
            defaultValue={selectedDate ?? ''}
            name="date"
            type="date"
          />
        </>
      ) : (
        <>
          <input
            className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
            defaultValue={selectedDomain ?? ''}
            name="domain"
            placeholder={t('domain_placeholder')}
          />
          <input
            className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
            defaultValue={selectedDeadline ?? ''}
            name="deadline"
            type="date"
          />
        </>
      )}
      <Button type="submit" variant="outline">
        {t('filter_cta')}
      </Button>
    </form>
  )
}

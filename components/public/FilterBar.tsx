'use client'

import { useTranslations } from 'next-intl'
import { announcementCategories, opportunityCategories } from '@/lib/options'
import { Button } from '@/components/ui/Button'

interface FilterBarProps {
  kind: 'annonces' | 'opportunites'
  selectedCategory?: string
  selectedCity?: string
}

export function FilterBar({
  kind,
  selectedCategory,
  selectedCity
}: FilterBarProps) {
  const t = useTranslations(kind)
  const categories =
    kind === 'annonces' ? announcementCategories : opportunityCategories

  return (
    <form className="surface-card grid gap-4 p-4 md:grid-cols-[1fr_1fr_auto]">
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
        <input
          className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
          defaultValue={selectedCity ?? ''}
          name="city"
          placeholder={t('city_placeholder')}
        />
      ) : (
        <input
          className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900"
          disabled
          placeholder={t('subtitle')}
        />
      )}
      <Button type="submit" variant="outline">
        {t('title')}
      </Button>
    </form>
  )
}

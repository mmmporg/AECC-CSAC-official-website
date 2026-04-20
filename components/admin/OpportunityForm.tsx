'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createOpportunity, updateOpportunity } from '@/app/actions/opportunities'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { opportunityCategories } from '@/lib/options'
import type { Opportunity } from '@/lib/supabase/types'

interface OpportunityFormProps {
  mode: 'create' | 'edit'
  initialData?: Opportunity
}

export function OpportunityForm({
  mode,
  initialData
}: OpportunityFormProps) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [showEnglishFields, setShowEnglishFields] = useState(Boolean(initialData?.title_en))
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createOpportunity(formData)
          : await updateOpportunity(initialData?.id ?? '', formData)

      if (!result.success) {
        setFeedback(result.error ?? t('form_error'))
        return
      }

      setFeedback(mode === 'create' ? t('form_success_create') : t('form_success_update'))
      router.push('/admin/opportunites')
      router.refresh()
    })
  }

  return (
    <form action={handleSubmit} className="surface-card grid gap-5 p-6">
      <Input defaultValue={initialData?.title_fr} label="Titre (FR)" name="title_fr" required />
      <Button
        className="w-fit"
        onClick={() => setShowEnglishFields((value) => !value)}
        type="button"
        variant="ghost"
      >
        {showEnglishFields ? 'Masquer EN' : 'Ajouter EN'}
      </Button>
      {showEnglishFields ? (
        <>
          <Input defaultValue={initialData?.title_en ?? ''} label="Title (EN)" name="title_en" />
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-neutral-900">Description (EN)</span>
            <textarea
              className="min-h-32 rounded-lg border border-neutral-200 px-4 py-3 outline-none focus:border-brand-400"
              defaultValue={initialData?.description_en ?? ''}
              name="description_en"
            />
          </label>
        </>
      ) : null}
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-neutral-900">Description (FR)</span>
        <textarea
          className="min-h-32 rounded-lg border border-neutral-200 px-4 py-3 outline-none focus:border-brand-400"
          defaultValue={initialData?.description_fr}
          name="description_fr"
          required
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-neutral-900">Catégorie</span>
          <select
            className="h-11 rounded-lg border border-neutral-200 px-4 outline-none focus:border-brand-400"
            defaultValue={initialData?.category ?? opportunityCategories[0]}
            name="category"
          >
            {opportunityCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <Input
          defaultValue={initialData?.organization}
          label="Organisation"
          name="organization"
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          defaultValue={initialData?.external_link ?? ''}
          label="Lien externe"
          name="external_link"
          type="url"
        />
        <Input
          defaultValue={initialData?.deadline?.slice(0, 10) ?? ''}
          label="Deadline"
          name="deadline"
          type="date"
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-neutral-900">
        <input
          className="h-4 w-4 rounded border-neutral-300"
          defaultChecked={initialData?.is_active ?? true}
          name="is_active"
          type="checkbox"
          value="true"
        />
        <span>Active</span>
      </label>
      {feedback ? <p className="text-sm text-brand-700">{feedback}</p> : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {mode === 'create' ? t('publier') : t('enregistrer')}
        </Button>
        <Button onClick={() => router.back()} type="button" variant="outline">
          {t('annuler')}
        </Button>
      </div>
    </form>
  )
}

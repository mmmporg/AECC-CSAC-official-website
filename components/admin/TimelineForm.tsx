'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createTimelineEvent, updateTimelineEvent } from '@/app/actions/history'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import type { TimelineEvent } from '@/lib/supabase/types'

interface TimelineFormProps {
  mode: 'create' | 'edit'
  initialData?: TimelineEvent
}

const colorOptions = [
  { value: 'green', label: 'Vert' },
  { value: 'yellow', label: 'Jaune' },
  { value: 'red', label: 'Rouge' },
  { value: 'gray', label: 'Gris' }
]

export function TimelineForm({ mode, initialData }: TimelineFormProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [descriptionFr, setDescriptionFr] = useState(initialData?.description_fr ?? '')
  const [descriptionEn, setDescriptionEn] = useState(initialData?.description_en ?? '')

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createTimelineEvent(formData)
          : await updateTimelineEvent(initialData?.id ?? '', formData)

      if (!result.success) {
        setFeedback(result.error ?? 'Une erreur est survenue.')
        return
      }

      setFeedback(mode === 'create' ? 'Evenement cree.' : 'Evenement mis a jour.')
      router.push('/admin/histoire')
      router.refresh()
    })
  }

  return (
    <form action={handleSubmit} className="surface-card grid gap-5 p-6">
      <Input defaultValue={initialData?.period} label="Periode (ex: Juillet 1999)" name="period" required />
      <Input defaultValue={initialData?.title_fr} label="Titre (FR)" name="title_fr" required />
      <Input defaultValue={initialData?.title_en ?? ''} label="Title (EN)" name="title_en" />
      <RichTextEditor
        label="Description (FR)"
        name="description_fr"
        onChange={setDescriptionFr}
        placeholder="Detaillez l'evenement avec du texte riche."
        required
        value={descriptionFr}
      />
      <RichTextEditor
        label="Description (EN)"
        name="description_en"
        onChange={setDescriptionEn}
        placeholder="Add a rich text English description."
        value={descriptionEn}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-neutral-900">Couleur</span>
          <select
            className="h-11 rounded-lg border border-neutral-200 px-4 outline-none focus:border-brand-400"
            defaultValue={initialData?.color ?? 'green'}
            name="color"
          >
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </label>
        <Input
          defaultValue={String(initialData?.sort_order ?? 0)}
          label="Ordre d'affichage"
          name="sort_order"
          type="number"
        />
      </div>
      {feedback ? <p className="text-sm text-brand-700">{feedback}</p> : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {mode === 'create' ? 'Creer' : 'Enregistrer'}
        </Button>
        <Button onClick={() => router.back()} type="button" variant="outline">
          Annuler
        </Button>
      </div>
    </form>
  )
}

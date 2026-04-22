'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createFounder, updateFounder } from '@/app/actions/history'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Founder } from '@/lib/supabase/types'

interface FounderFormProps {
  mode: 'create' | 'edit'
  initialData?: Founder
}

export function FounderForm({ mode, initialData }: FounderFormProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createFounder(formData)
          : await updateFounder(initialData?.id ?? '', formData)

      if (!result.success) {
        setFeedback(result.error ?? 'Une erreur est survenue.')
        return
      }

      setFeedback(mode === 'create' ? 'Fondateur ajouté.' : 'Fondateur mis à jour.')
      router.push('/admin/histoire')
      router.refresh()
    })
  }

  return (
    <form action={handleSubmit} className="surface-card grid gap-5 p-6">
      <Input defaultValue={initialData?.full_name} label="Nom complet" name="full_name" required />
      <Input defaultValue={initialData?.role_fr ?? ''} label="Rôle (FR)" name="role_fr" />
      <Input defaultValue={initialData?.role_en ?? ''} label="Role (EN)" name="role_en" />
      <div className="grid gap-3">
        {initialData?.image_url ? (
          <Image
            alt={initialData.full_name}
            className="h-24 w-24 rounded-full object-cover ring-1 ring-neutral-200"
            height={96}
            src={initialData.image_url}
            width={96}
          />
        ) : null}
        <label className="grid gap-2 text-sm text-neutral-900">
          <span className="font-medium">Photo</span>
          <input accept="image/*" name="image" type="file" />
        </label>
        {initialData?.image_url ? (
          <label className="flex items-center gap-3 text-sm text-neutral-900">
            <input
              className="h-4 w-4 rounded border-neutral-300"
              name="remove_image"
              type="checkbox"
              value="true"
            />
            <span>Supprimer la photo actuelle</span>
          </label>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm text-neutral-900">
          <input
            className="h-4 w-4 rounded border-neutral-300"
            defaultChecked={initialData?.in_memoriam ?? false}
            name="in_memoriam"
            type="checkbox"
            value="true"
          />
          <span>In memoriam</span>
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
          {mode === 'create' ? 'Ajouter' : 'Enregistrer'}
        </Button>
        <Button onClick={() => router.back()} type="button" variant="outline">
          Annuler
        </Button>
      </div>
    </form>
  )
}

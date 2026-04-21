'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createOpportunity, updateOpportunity } from '@/app/actions/opportunities'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Toast'
import { opportunityCategories } from '@/lib/options'
import type { Opportunity } from '@/lib/supabase/types'

interface OpportunityFormProps {
  mode: 'create' | 'edit'
  initialData?: Opportunity
}

export function OpportunityForm({ mode, initialData }: OpportunityFormProps) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [showEnglishFields, setShowEnglishFields] = useState(Boolean(initialData?.title_en))
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createOpportunity(formData)
          : await updateOpportunity(initialData?.id ?? '', formData)

      if (!result.success) {
        setFeedback({ message: result.error ?? t('form_error'), type: 'error' })
        return
      }

      setFeedback({
        message: mode === 'create' ? t('form_success_create') : t('form_success_update'),
        type: 'success'
      })

      window.setTimeout(() => {
        router.push('/admin/opportunites')
        router.refresh()
      }, 1500)
    })
  }

  return (
    <form action={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className="admin-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Contenu Editorial
            </h2>
            <Button
              className="rounded-xl"
              onClick={() => setShowEnglishFields((value) => !value)}
              type="button"
              variant="ghost"
            >
              {showEnglishFields ? 'Masquer EN' : 'Ajouter EN'}
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              className="admin-input"
              defaultValue={initialData?.title_fr}
              label="TITRE (FRANCAIS) *"
              name="title_fr"
              placeholder="Ex: Bourse d'excellence..."
              required
            />
            <Input
              className="admin-input"
              defaultValue={initialData?.title_en ?? ''}
              label="TITLE (ENGLISH)"
              name="title_en"
              placeholder="Ex: Excellence Scholarship..."
            />
          </div>
          <div className="mt-5 space-y-5">
            <label className="grid gap-2 text-sm">
              <span className="font-medium tracking-wide text-neutral-900">
                DESCRIPTION (FRANCAIS) *
              </span>
              <textarea
                className="admin-textarea min-h-36"
                defaultValue={initialData?.description_fr}
                name="description_fr"
                placeholder="Detaillez l'opportunite ici..."
                required
              />
            </label>
            {showEnglishFields ? (
              <label className="grid gap-2 text-sm">
                <span className="font-medium tracking-wide text-neutral-900">
                  DESCRIPTION (ENGLISH)
                </span>
                <textarea
                  className="admin-textarea min-h-32"
                  defaultValue={initialData?.description_en ?? ''}
                  name="description_en"
                  placeholder="Provide details here..."
                />
              </label>
            ) : null}
          </div>
        </section>

        <section className="admin-card p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Organisation &amp; publication
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium tracking-wide text-neutral-900">CATEGORIE *</span>
              <select
                className="admin-select"
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
              className="admin-input"
              defaultValue={initialData?.organization}
              label="ORGANISATION *"
              name="organization"
              placeholder="Ex: Gouvernement Chinois"
              required
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input
              className="admin-input"
              defaultValue={initialData?.external_link ?? ''}
              label="LIEN EXTERNE"
              name="external_link"
              type="url"
            />
            <Input
              className="admin-input"
              defaultValue={initialData?.deadline?.slice(0, 10) ?? ''}
              label="DATE LIMITE"
              name="deadline"
              type="date"
            />
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm text-neutral-900">
            <input
              className="h-4 w-4 rounded border-neutral-300"
              defaultChecked={initialData?.is_active ?? true}
              name="is_active"
              type="checkbox"
              value="true"
            />
            <span>Publication active</span>
          </label>
          <div className="mt-4">
            <Toast
              isVisible={!!feedback}
              message={feedback?.message ?? ''}
              type={feedback?.type ?? 'success'}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="min-w-[140px] rounded-xl px-6" disabled={isPending} type="submit">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                  </svg>
                  <span>{t('loading')}</span>
                </div>
              ) : (
                mode === 'create' ? t('publier') : t('enregistrer')
              )}
            </Button>
            <Button
              className="rounded-xl"
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              {t('annuler')}
            </Button>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="admin-card p-4">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-600">
            Apercu
          </p>
          <div className="rounded-2xl border border-[#ece7dd] bg-[#f7f3eb] p-5">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
              {initialData?.category ?? 'Categorie'}
            </span>
            <p className="mt-4 text-2xl font-bold text-neutral-900">
              {initialData?.title_fr ?? "Titre de l'opportunite"}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {initialData?.organization ?? 'Organisation'}
            </p>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              {initialData?.description_fr ??
                "Le resume de l'opportunite apparaitra ici pour guider la mise en forme."}
            </p>
          </div>
        </section>
      </aside>
    </form>
  )
}

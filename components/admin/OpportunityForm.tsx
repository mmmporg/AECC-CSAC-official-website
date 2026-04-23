'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createOpportunity, updateOpportunity } from '@/app/actions/opportunities'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { Toast } from '@/components/ui/Toast'
import { opportunityCategories } from '@/lib/options'
import { normalizeRichTextInput } from '@/lib/rich-text'
import type { Opportunity } from '@/lib/supabase/types'

interface OpportunityFormProps {
  mode: 'create' | 'edit'
  initialData?: Opportunity
}

interface OpportunityFormState {
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
  category: string
  organization: string
  external_link: string
  deadline: string
  is_active: boolean
}

function getInitialState(initialData?: Opportunity): OpportunityFormState {
  return {
    title_fr: initialData?.title_fr ?? '',
    title_en: initialData?.title_en ?? '',
    description_fr: initialData?.description_fr ?? '',
    description_en: initialData?.description_en ?? '',
    category: initialData?.category ?? opportunityCategories[0],
    organization: initialData?.organization ?? '',
    external_link: initialData?.external_link ?? '',
    deadline: initialData?.deadline?.slice(0, 10) ?? '',
    is_active: initialData?.is_active ?? true
  }
}

export function OpportunityForm({ mode, initialData }: OpportunityFormProps) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [showEnglishFields, setShowEnglishFields] = useState(Boolean(initialData?.title_en))
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<OpportunityFormState>(() => getInitialState(initialData))

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

  function updateField<Key extends keyof OpportunityFormState>(
    key: Key,
    value: OpportunityFormState[Key]
  ) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const titlePreview = formState.title_fr || "Titre de l'opportunite"
  const descriptionPreview =
    formState.description_fr ||
    "<p>Le resume de l'opportunite apparaitra ici pour guider la mise en forme.</p>"

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
              label="TITRE (FRANCAIS) *"
              name="title_fr"
              onChange={(event) => updateField('title_fr', event.target.value)}
              placeholder="Ex: Bourse d'excellence..."
              required
              value={formState.title_fr}
            />
            <Input
              className="admin-input"
              label="TITLE (ENGLISH)"
              name="title_en"
              onChange={(event) => updateField('title_en', event.target.value)}
              placeholder="Ex: Excellence Scholarship..."
              value={formState.title_en}
            />
          </div>
          <div className="mt-5 space-y-5">
            <RichTextEditor
              label="DESCRIPTION (FRANCAIS) *"
              name="description_fr"
              onChange={(value) => updateField('description_fr', value)}
              placeholder="Detaillez l'opportunite ici avec du texte riche."
              required
              value={formState.description_fr}
            />
            {showEnglishFields ? (
              <RichTextEditor
                label="DESCRIPTION (ENGLISH)"
                name="description_en"
                onChange={(value) => updateField('description_en', value)}
                placeholder="Provide rich formatted details here."
                value={formState.description_en}
              />
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
                name="category"
                onChange={(event) => updateField('category', event.target.value)}
                value={formState.category}
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
              label="ORGANISATION *"
              name="organization"
              onChange={(event) => updateField('organization', event.target.value)}
              placeholder="Ex: Gouvernement Chinois"
              required
              value={formState.organization}
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input
              className="admin-input"
              label="LIEN EXTERNE"
              name="external_link"
              onChange={(event) => updateField('external_link', event.target.value)}
              type="url"
              value={formState.external_link}
            />
            <Input
              className="admin-input"
              label="DATE LIMITE"
              name="deadline"
              onChange={(event) => updateField('deadline', event.target.value)}
              type="date"
              value={formState.deadline}
            />
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm text-neutral-900">
            <input
              checked={formState.is_active}
              className="h-4 w-4 rounded border-neutral-300"
              name="is_active"
              onChange={(event) => updateField('is_active', event.target.checked)}
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
              {formState.category}
            </span>
            <p className="mt-4 text-2xl font-bold text-neutral-900">{titlePreview}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {formState.organization || 'Organisation'}
            </p>
            <div
              className="prose prose-sm mt-4 max-w-none prose-p:text-neutral-600 prose-li:text-neutral-600 prose-strong:text-neutral-900 prose-a:text-[#1D9E75]"
              dangerouslySetInnerHTML={{ __html: normalizeRichTextInput(descriptionPreview) }}
            />
            <div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
              <span>{formState.deadline || 'Sans limite'}</span>
              <span>{formState.external_link || 'Lien externe'}</span>
            </div>
          </div>
        </section>
      </aside>
    </form>
  )
}

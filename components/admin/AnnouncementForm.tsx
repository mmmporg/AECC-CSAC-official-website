'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createAnnouncement, updateAnnouncement } from '@/app/actions/announcements'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Toast'
import { announcementCategories, cityOptions } from '@/lib/options'
import type { Announcement } from '@/lib/supabase/types'

interface AnnouncementFormProps {
  mode: 'create' | 'edit'
  initialData?: Announcement
}

interface AnnouncementFormState {
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
  category: string
  city: string
  contact: string
  expires_at: string
  is_active: boolean
}

function getInitialState(initialData?: Announcement): AnnouncementFormState {
  return {
    title_fr: initialData?.title_fr ?? '',
    title_en: initialData?.title_en ?? '',
    description_fr: initialData?.description_fr ?? '',
    description_en: initialData?.description_en ?? '',
    category: initialData?.category ?? announcementCategories[0],
    city: initialData?.city ?? cityOptions[0],
    contact: initialData?.contact ?? '',
    expires_at: initialData?.expires_at?.slice(0, 10) ?? '',
    is_active: initialData?.is_active ?? true
  }
}

export function AnnouncementForm({ mode, initialData }: AnnouncementFormProps) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<AnnouncementFormState>(() => getInitialState(initialData))

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createAnnouncement(formData)
          : await updateAnnouncement(initialData?.id ?? '', formData)

      if (!result.success) {
        setFeedback({ message: result.error ?? t('form_error'), type: 'error' })
        return
      }

      setFeedback({
        message: mode === 'create' ? t('form_success_create') : t('form_success_update'),
        type: 'success'
      })

      window.setTimeout(() => {
        router.push('/admin/annonces')
        router.refresh()
      }, 1500)
    })
  }

  function updateField<Key extends keyof AnnouncementFormState>(
    key: Key,
    value: AnnouncementFormState[Key]
  ) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const titlePreview = formState.title_fr || "Titre de l'annonce apparaitra ici..."
  const descriptionPreview =
    formState.description_fr ||
    "La description que vous redigez s'affichera dans cette zone. Elle sera automatiquement tronquee si elle est trop longue."

  return (
    <form action={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className="admin-card p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Contenu Editorial
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              className="admin-input"
              label="TITRE (FRANCAIS) *"
              name="title_fr"
              onChange={(event) => updateField('title_fr', event.target.value)}
              placeholder="Ex: Reunion generale..."
              required
              value={formState.title_fr}
            />
            <Input
              className="admin-input"
              label="TITLE (ENGLISH)"
              name="title_en"
              onChange={(event) => updateField('title_en', event.target.value)}
              placeholder="Ex: General Meeting..."
              value={formState.title_en}
            />
          </div>
          <div className="mt-5 space-y-5">
            <label className="grid gap-2 text-sm">
              <span className="font-medium tracking-wide text-neutral-900">
                DESCRIPTION (FRANCAIS) *
              </span>
              <textarea
                className="admin-textarea min-h-36"
                name="description_fr"
                onChange={(event) => updateField('description_fr', event.target.value)}
                placeholder="Detaillez l'annonce ici..."
                required
                value={formState.description_fr}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium tracking-wide text-neutral-900">
                DESCRIPTION (ENGLISH)
              </span>
              <textarea
                className="admin-textarea min-h-32"
                name="description_en"
                onChange={(event) => updateField('description_en', event.target.value)}
                placeholder="Provide details here..."
                value={formState.description_en}
              />
            </label>
          </div>
        </section>

        <section className="admin-card p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Classification &amp; Contacts
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
                {announcementCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium tracking-wide text-neutral-900">
                VILLE / CAMPUS
              </span>
              <select
                className="admin-select"
                name="city"
                onChange={(event) => updateField('city', event.target.value)}
                value={formState.city}
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input
              className="admin-input"
              label="CONTACT RESPONSABLE (EMAIL OU WECHAT) *"
              name="contact"
              onChange={(event) => updateField('contact', event.target.value)}
              placeholder="Ex: contact@aec-chine.org"
              required
              value={formState.contact}
            />
            <Input
              className="admin-input"
              label="DATE D'EXPIRATION"
              name="expires_at"
              onChange={(event) => updateField('expires_at', event.target.value)}
              type="date"
              value={formState.expires_at}
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
            Apercu en direct
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#ece7dd] bg-white">
            <div className="h-36 bg-[radial-gradient(circle_at_70%_70%,rgba(239,159,39,0.5),transparent_28%),radial-gradient(circle_at_35%_40%,rgba(29,158,117,0.55),transparent_30%),linear-gradient(135deg,#234332,#10140f)]" />
            <div className="space-y-4 p-5">
              <span className="inline-flex rounded-full bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-400">
                {formState.category}
              </span>
              <div className="flex items-center gap-3 text-xs font-medium text-neutral-600">
                <span>{formState.expires_at || "Aujourd'hui"}</span>
                <span>&middot;</span>
                <span>{formState.city || 'Ville / Campus'}</span>
              </div>
              <h3 className="text-3xl font-bold leading-tight text-neutral-900">{titlePreview}</h3>
              <p className="text-sm leading-6 text-neutral-600">{descriptionPreview}</p>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                {formState.contact || 'Contact responsable'}
              </p>
            </div>
          </div>
        </section>

        <section className="admin-card p-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-600">
            Conseils de redaction
          </p>
          <div className="space-y-4 text-sm leading-6 text-neutral-600">
            <p>
              <strong className="text-neutral-900">Clarte:</strong> soyez direct dans votre titre.
            </p>
            <p>
              <strong className="text-neutral-900">Bilinguisme:</strong> gardez le meme sens entre FR et EN.
            </p>
            <p>
              <strong className="text-neutral-900">Visuel:</strong> la categorie influence la carte publique.
            </p>
          </div>
        </section>
      </aside>
    </form>
  )
}

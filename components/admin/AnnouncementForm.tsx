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

export function AnnouncementForm({ mode, initialData }: AnnouncementFormProps) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()

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

  const titlePreview = initialData?.title_fr ?? "Titre de l'annonce apparaitra ici..."
  const descriptionPreview =
    initialData?.description_fr ??
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
              defaultValue={initialData?.title_fr}
              label="TITRE (FRANCAIS) *"
              name="title_fr"
              placeholder="Ex: Reunion generale..."
              required
            />
            <Input
              className="admin-input"
              defaultValue={initialData?.title_en ?? ''}
              label="TITLE (ENGLISH)"
              name="title_en"
              placeholder="Ex: General Meeting..."
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
                placeholder="Detaillez l'annonce ici..."
                required
              />
            </label>
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
                defaultValue={initialData?.category ?? announcementCategories[0]}
                name="category"
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
                defaultValue={initialData?.city ?? cityOptions[0]}
                name="city"
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
              defaultValue={initialData?.contact}
              label="CONTACT RESPONSABLE (EMAIL OU WECHAT) *"
              name="contact"
              placeholder="Ex: contact@aec-chine.org"
              required
            />
            <Input
              className="admin-input"
              defaultValue={initialData?.expires_at?.slice(0, 10) ?? ''}
              label="DATE D'EXPIRATION"
              name="expires_at"
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
            Apercu en direct
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#ece7dd] bg-white">
            <div className="h-36 bg-[radial-gradient(circle_at_70%_70%,rgba(239,159,39,0.5),transparent_28%),radial-gradient(circle_at_35%_40%,rgba(29,158,117,0.55),transparent_30%),linear-gradient(135deg,#234332,#10140f)]" />
            <div className="space-y-4 p-5">
              <span className="inline-flex rounded-full bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-400">
                Categorie
              </span>
              <div className="flex items-center gap-3 text-xs font-medium text-neutral-600">
                <span>Aujourd&apos;hui</span>
                <span>&middot;</span>
                <span>Ville / Campus</span>
              </div>
              <h3 className="text-3xl font-bold leading-tight text-neutral-900">{titlePreview}</h3>
              <p className="text-sm leading-6 text-neutral-600">{descriptionPreview}</p>
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

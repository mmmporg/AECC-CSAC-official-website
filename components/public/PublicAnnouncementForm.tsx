'use client'

import { useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { submitPublicAnnouncement } from '@/app/actions/announcements'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Toast'
import { cityOptions, announcementCategories } from '@/lib/options'
import Link from 'next/link'

export function PublicAnnouncementForm() {
  const locale = useLocale()
  const t = useTranslations('annonces.publier')
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  function handleSubmit(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const result = await submitPublicAnnouncement(formData)
      if (!result.success) {
        setFeedback({ message: result.error ?? 'Error', type: 'error' })
        return
      }
      setIsSuccess(true)
      setFeedback({ message: t('success_msg'), type: 'success' })
    })
  }

  if (isSuccess) {
    return (
      <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-neutral-900">{t('success_msg')}</h3>
        <p className="text-neutral-600">
          Notre équipe validera et publiera votre annonce très prochainement.
        </p>
        <div className="mt-8">
          <Link
            href={`/${locale}/annonces`}
            className="inline-flex items-center justify-center rounded-lg border border-brand-400 text-brand-600 hover:bg-brand-50 h-10 px-5 text-sm font-medium transition-colors"
          >
            Retour aux annonces
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="surface-card p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            label={t('form_title_label')}
            name="title_fr"
            placeholder={t('form_title_placeholder')}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium tracking-wide text-neutral-900">
            {t('form_desc_label')}
            <textarea
              className="mt-2 w-full min-h-[140px] rounded-xl border border-neutral-300 bg-white p-3 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            name="description_fr"
            placeholder={t('form_desc_placeholder')}
            required
          />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium tracking-wide text-neutral-900">
            {t('form_category_label')}
          </label>
          <select
            className="w-full rounded-xl border-neutral-300 p-3 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            name="category"
            required
          >
            {announcementCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium tracking-wide text-neutral-900">
            {t('form_city_label')}
          </label>
          <select
            className="w-full rounded-xl border-neutral-300 p-3 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            name="city"
            required
          >
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <Input
            className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            label={t('form_contact_label')}
            name="contact"
            placeholder={t('form_contact_placeholder')}
            required
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Button className="w-full md:w-auto px-10 py-3 text-lg rounded-xl" disabled={isPending} type="submit">
          {isPending ? (
            <div className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span>Chargement...</span>
            </div>
          ) : (
            t('submit')
          )}
        </Button>
        <Toast
          isVisible={!!feedback && !isSuccess}
          message={feedback?.message ?? ''}
          type={feedback?.type ?? 'error'}
        />
      </div>
    </form>
  )
}

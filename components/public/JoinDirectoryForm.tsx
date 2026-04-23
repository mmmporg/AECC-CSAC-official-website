'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { submitPublicMember } from '@/app/actions/members'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Toast'
import { cityOptions } from '@/lib/options'

export function JoinDirectoryForm() {
  const locale = useLocale()
  const t = useTranslations('rejoindre_annuaire')
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  function handleSubmit(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const result = await submitPublicMember(formData)

      if (!result.success) {
        setFeedback({ message: result.error ?? t('error_generic'), type: 'error' })
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
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-neutral-900">{t('success_msg')}</h3>
        <p className="text-neutral-600">{t('success_pending')}</p>
        <div className="mt-8">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg border border-brand-400 px-5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
            href={`/${locale}/annuaire`}
          >
            {t('back_to_directory')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="surface-card p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_first_name')}
          name="first_name"
          required
        />
        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_last_name')}
          name="last_name"
          required
        />

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium tracking-wide text-neutral-900">
            {t('form_city')}
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

        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_university')}
          name="university"
          placeholder={t('placeholder_university')}
          required
        />
        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_degree')}
          name="degree"
          placeholder={t('placeholder_degree')}
          required
        />

        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_entry_year')}
          max={new Date().getFullYear()}
          min="1990"
          name="entry_year"
          type="number"
        />
        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_grad_year')}
          max={new Date().getFullYear() + 6}
          min="1990"
          name="graduation_year"
          type="number"
        />

        <div className="md:col-span-2">
          <Input
            className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            label={t('form_linkedin')}
            name="linkedin_url"
            placeholder="https://linkedin.com/in/..."
            type="url"
          />
        </div>

        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_email')}
          name="email"
          placeholder={t('placeholder_email')}
          type="email"
        />
        <Input
          className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          label={t('form_wechat')}
          name="wechat"
          placeholder={t('placeholder_wechat')}
          type="text"
        />

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium tracking-wide text-neutral-900">
            {t('form_bio')}
          </label>
          <textarea
            className="w-full min-h-[100px] rounded-xl border-neutral-300 p-3 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            maxLength={300}
            name="bio"
            placeholder={t('placeholder_bio')}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Button className="w-full rounded-xl px-10 py-3 text-lg md:w-auto" disabled={isPending} type="submit">
          {isPending ? (
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
              </svg>
              <span>{t('loading')}</span>
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

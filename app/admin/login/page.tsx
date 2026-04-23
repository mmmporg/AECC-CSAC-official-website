'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const t = useTranslations('admin')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const email = formData.get('email')
    const password = formData.get('password')

    if (typeof email !== 'string' || typeof password !== 'string') {
      setError(t('form_error'))
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="admin-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[10%] -top-[20%] h-[28rem] w-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -bottom-[12%] -left-[10%] h-80 w-80 rounded-full bg-accent-50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[440px]">
        <form action={handleSubmit} className="admin-card space-y-6 p-8 sm:p-10">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ece8df] text-3xl text-brand-700 shadow-inner">
              <span aria-hidden="true">●</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{t('login_title')}</h1>
            <p className="mt-3 max-w-xs text-base leading-7 text-neutral-600">
              Association des Etudiants Camerounais en Chine
            </p>
          </div>

          <Input
            className="admin-input h-14 pl-4"
            label={t('email').toUpperCase()}
            name="email"
            placeholder="admin@aec-chine.org"
            required
            type="email"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-wide text-neutral-900">
                {t('password').toUpperCase()}
              </span>
              <span className="text-sm font-medium text-brand-600">Oublie ?</span>
            </div>
            <Input
              className="admin-input h-14 pl-4"
              label={undefined}
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>

          {error ? <p className="text-sm text-error">{error}</p> : null}

          <Button className="mt-4 h-14 w-full rounded-xl text-base font-semibold" disabled={loading} type="submit">
            {t('signin')}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-neutral-600">
          <span aria-hidden="true" className="text-xs">●</span>
          <span>Acces securise et restreint</span>
        </div>
      </div>
    </div>
  )
}

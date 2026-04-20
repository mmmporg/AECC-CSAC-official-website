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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form action={handleSubmit} className="surface-card w-full max-w-md space-y-5 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">{t('login_title')}</h1>
          <p className="text-sm text-neutral-600">{t('login_subtitle')}</p>
        </div>
        <Input label={t('email')} name="email" required type="email" />
        <Input label={t('password')} name="password" required type="password" />
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {t('signin')}
        </Button>
      </form>
    </div>
  )
}

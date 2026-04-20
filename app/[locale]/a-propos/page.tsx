import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

export default async function AboutPage({
  params
}: {
  params: { locale: Locale }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' })

  return (
    <div className="container-shell space-y-8 py-10">
      <section className="max-w-3xl space-y-4">
        <h1 className="section-heading">{t('title')}</h1>
        <p className="section-copy">{t('subtitle')}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="surface-card p-6">
          <p className="text-sm leading-7 text-neutral-600">{t('body_1')}</p>
        </article>
        <article className="surface-card p-6">
          <p className="text-sm leading-7 text-neutral-600">{t('body_2')}</p>
        </article>
      </section>
    </div>
  )
}

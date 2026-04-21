import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/PageTransition'

export default async function AboutPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <PageTransition>
      <div className="space-y-20 py-10">
        <section className="container-shell py-10 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent-400">
              {locale === 'fr' ? 'Notre association' : 'Our association'}
            </span>
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-brand-700 md:text-7xl">
              {locale === 'fr' ? 'À propos' : 'About'}
            </h1>
            <p className="text-lg leading-8 text-neutral-600">{t('subtitle')}</p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-card">
            <div className="aspect-square bg-gradient-to-br from-brand-700 via-brand-500 to-accent-300" />
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-24">
        <div className="container-shell grid gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-brand-700">
              {locale === 'fr' ? 'Notre mission' : 'Our mission'}
            </h2>
            <p className="text-base leading-8 text-neutral-600">{t('body_1')}</p>
            <div className="flex items-center gap-4">
              <div className="h-1 w-16 rounded-full bg-accent-300" />
              <p className="text-sm font-bold italic text-accent-400">
                {locale === 'fr'
                  ? 'Ensemble, bâtissons l’avenir de la nation.'
                  : 'Together, let us build the future of the nation.'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-700">
              {locale === 'fr' ? 'Nos valeurs' : 'Our values'}
            </h2>
            {[
              locale === 'fr' ? 'Solidarité communautaire' : 'Community solidarity',
              locale === 'fr' ? 'Excellence académique' : 'Academic excellence',
              locale === 'fr' ? 'Intégrité et respect' : 'Integrity and respect'
            ].map((value) => (
              <article className="surface-card p-6" key={value}>
                <p className="text-lg font-bold text-neutral-900">{value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            ['1999', locale === 'fr' ? 'Fondée à Beijing' : 'Founded in Beijing'],
            ['15', locale === 'fr' ? 'Villes représentées' : 'Cities represented'],
            ['19', locale === 'fr' ? 'Présidents successifs' : 'Successive presidents'],
            ['25+', locale === 'fr' ? "Ans d'héritage" : 'Years of legacy']
          ].map(([value, label]) => (
            <article className="rounded-xl bg-brand-700 p-8 text-center text-white" key={label}>
              <p className="text-4xl font-black text-accent-300">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
                {label}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-brand-700">
              {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
            </h2>
            <p className="text-base leading-8 text-neutral-600">{t('body_2')}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-card p-5 text-sm text-neutral-600">contact@aecc.org</div>
              <div className="surface-card p-5 text-sm text-neutral-600">
                {locale === 'fr' ? 'Beijing, Chine' : 'Beijing, China'}
              </div>
            </div>
          </div>
          <div className="surface-card rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold text-brand-700">
              {locale === 'fr' ? 'Rejoignez notre WeChat' : 'Join our WeChat'}
            </h3>
            <div className="mx-auto mt-8 flex h-56 w-56 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              QR
            </div>
            <p className="mt-6 text-sm font-medium text-neutral-600">AECC_Official_China</p>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  )
}

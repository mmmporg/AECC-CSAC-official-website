import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/PageTransition'
import { PublicPageHero } from '@/components/public/PublicPageHero'

export default async function AboutPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <PageTransition>
      <div className="public-page space-y-16 py-10">
        <PublicPageHero
          eyebrow={locale === 'fr' ? 'Notre association' : 'Our association'}
          statement={
            locale === 'fr'
              ? 'Une structure de soutien, de memoire et de representation pour les etudiants camerounais en Chine.'
              : 'A structure for support, memory, and representation for Cameroonian students in China.'
          }
          subtitle={t('subtitle')}
          title={locale === 'fr' ? 'A propos' : 'About'}
        />

        <section className="container-shell grid gap-10 md:grid-cols-2">
          <div className="public-panel p-8 md:p-10">
            <h2 className="text-3xl font-bold text-brand-700">
              {locale === 'fr' ? 'Notre mission' : 'Our mission'}
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600">{t('body_1')}</p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-1 w-16 rounded-full bg-accent-300" />
              <p className="text-sm font-bold italic text-accent-400">
                {locale === 'fr'
                  ? 'Ensemble, batissons l avenir de la nation.'
                  : 'Together, let us build the future of the nation.'}
              </p>
            </div>
          </div>

          <div className="public-panel p-8 md:p-10">
            <h2 className="text-3xl font-bold text-brand-700">
              {locale === 'fr' ? 'Nos valeurs' : 'Our values'}
            </h2>
            <div className="mt-6 grid gap-4">
              {[
                locale === 'fr' ? 'Solidarite communautaire' : 'Community solidarity',
                locale === 'fr' ? 'Excellence academique' : 'Academic excellence',
                locale === 'fr' ? 'Integrite et respect' : 'Integrity and respect'
              ].map((value) => (
                <article className="public-card p-6" key={value}>
                  <p className="text-lg font-bold text-neutral-900">{value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell py-2">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              ['1999', locale === 'fr' ? 'Fondee a Beijing' : 'Founded in Beijing'],
              ['15', locale === 'fr' ? 'Villes representees' : 'Cities represented'],
              ['19', locale === 'fr' ? 'Presidents successifs' : 'Successive presidents'],
              ['25+', locale === 'fr' ? 'Ans d heritage' : 'Years of legacy']
            ].map(([value, label]) => (
              <article className="public-hero-dark p-8 text-center" key={label}>
                <p className="text-4xl font-black text-accent-300">{value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
                  {label}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-shell grid gap-10 py-2 md:grid-cols-2">
          <div className="public-panel p-8 md:p-10">
            <h2 className="text-4xl font-black text-brand-700">
              {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600">{t('body_2')}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="public-card p-5 text-sm text-neutral-600">contact@aecc.org</div>
              <div className="public-card p-5 text-sm text-neutral-600">
                {locale === 'fr' ? 'Beijing, Chine' : 'Beijing, China'}
              </div>
            </div>
          </div>
          <div className="public-card rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold text-brand-700">
              {locale === 'fr' ? 'Rejoignez notre WeChat' : 'Join our WeChat'}
            </h3>
            <div className="mx-auto mt-8 flex h-56 w-56 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              QR
            </div>
            <p className="mt-6 text-sm font-medium text-neutral-600">AECC_Official_China</p>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

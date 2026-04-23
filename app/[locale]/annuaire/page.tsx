import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getPublicMembers } from '@/app/actions/members'
import { CITY_COORDS } from '@/components/public/ClientMap'
import { MemberCard } from '@/components/public/MemberCard'
import { PublicPageHero } from '@/components/public/PublicPageHero'

const InteractiveMap = dynamic(
  () => import('@/components/public/InteractiveMap').then(m => m.InteractiveMap),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
  }
)
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealItem, RevealSection } from '@/components/ui/RevealSection'
import type { Locale } from '@/lib/i18n'

export const revalidate = 1800

export default async function DirectoryPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'annuaire' })
  const members = await getPublicMembers()

  const cityCounts = members.reduce<Record<string, number>>((accumulator, member) => {
    accumulator[member.city] = (accumulator[member.city] || 0) + 1
    return accumulator
  }, {})

  const markers = Object.entries(cityCounts).map(([cityName, count]) => {
    const coords = CITY_COORDS[cityName] || { lat: 35.8617, lng: 104.1954 }

    return {
      count,
      id: cityName,
      lat: coords.lat,
      lng: coords.lng,
      title: cityName
    }
  })

  return (
    <PageTransition>
      <div className="public-page py-10 md:py-16">
        <PublicPageHero
          cta={
            <Link
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-sm transition-all hover:-translate-y-1 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.97]"
              href={`/${locale}/annuaire/rejoindre`}
            >
              {t('join_btn')}
            </Link>
          }
          eyebrow={t('network_badge')}
          statement={
            locale === 'fr'
              ? 'Un reseau visible a travers les grandes villes universitaires de Chine.'
              : 'A visible network across major university cities in China.'
          }
          subtitle={t('subtitle')}
          title={t('title')}
        />

        <div className="container-shell">
          <RevealSection className="space-y-10">
            <RevealItem>
              <div className="public-card overflow-hidden p-3 md:p-4">
                <InteractiveMap markers={markers} />
              </div>
            </RevealItem>

            <div>
              <RevealItem>
                <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-900">
                  {t('directory_heading', { count: members.length })}
                </h2>
              </RevealItem>

              {members.length === 0 ? (
                <RevealItem>
                  <div className="public-card p-12 text-center text-neutral-600">
                    {t('empty')}
                  </div>
                </RevealItem>
              ) : (
                <RevealSection className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {members.map((member) => (
                    <RevealItem key={member.id}>
                      <MemberCard locale={locale} member={member} />
                    </RevealItem>
                  ))}
                </RevealSection>
              )}
            </div>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  )
}

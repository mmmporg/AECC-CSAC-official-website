import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getPublicMembers } from '@/app/actions/members'
import { CITY_COORDS } from '@/components/public/ClientMap'
import { InteractiveMap } from '@/components/public/InteractiveMap'
import { MemberCard } from '@/components/public/MemberCard'
import { PageTransition } from '@/components/ui/PageTransition'
import { RevealItem, RevealSection } from '@/components/ui/RevealSection'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

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
      <div className="container-shell py-12 md:py-20">
        <RevealSection className="space-y-8">
          <RevealItem>
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                  {t('network_badge')}
                </span>
                <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
                  {t('title')}
                </h1>
                <p className="mt-4 text-lg leading-8 text-neutral-600">
                  {t('subtitle')}
                </p>
              </div>
              <Link
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-sm transition-all hover:-translate-y-1 hover:bg-brand-600 hover:shadow-md"
                href={`/${locale}/annuaire/rejoindre`}
              >
                {t('join_btn')}
              </Link>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="mt-8">
              <InteractiveMap markers={markers} />
            </div>
          </RevealItem>

          <div className="mt-16">
            <RevealItem>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-900">
                {t('directory_heading', { count: members.length })}
              </h2>
            </RevealItem>

            {members.length === 0 ? (
              <RevealItem>
                <div className="surface-card p-12 text-center text-neutral-600">
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
    </PageTransition>
  )
}

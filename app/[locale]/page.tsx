import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { OpportunityCard } from '@/components/public/OpportunityCard'
import {
  getFounders,
  getLatestAnnouncements,
  getLatestOpportunities
} from '@/lib/data/public'
import type { Locale } from '@/lib/i18n'

export default async function HomePage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: 'home' })
  const [announcements, opportunities, founders] = await Promise.all([
    getLatestAnnouncements(3),
    getLatestOpportunities(2),
    getFounders()
  ])

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-8 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-6 z-10 w-full lg:pr-10">
          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-black text-[#1A1918] tracking-tight leading-[1.05]">
            L'association des étudiants <span className="text-[#0F6E56]">camerounais</span> en Chine
          </h1>
          <p className="text-lg text-[#65635E] max-w-xl leading-relaxed mt-6">
            Unir, soutenir et propulser la jeunesse estudiantine camerounaise dans l'Empire du Milieu. Depuis 1997, nous bâtissons des ponts entre nos cultures et nos ambitions.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              className="px-8 py-4 bg-[#0F6E56] text-white rounded-md font-bold text-[0.8rem] uppercase tracking-widest hover:bg-[#085041] transition-colors shadow-sm"
              href={`/${locale}/histoire`}
            >
              EXPLORER L'AECC
            </Link>
            <Link
              className="px-8 py-4 bg-[#EF9F27] text-white rounded-md font-bold text-[0.8rem] uppercase tracking-widest hover:bg-[#D4840E] transition-colors shadow-sm"
              href={`/${locale}/a-propos`}
            >
              NOUS CONTACTER
            </Link>
          </div>
        </div>

        {/* Hero Stats Grid */}
        <div className="flex-1 w-full grid grid-cols-2 gap-4 relative">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#EF9F27] opacity-[0.15] blur-3xl rounded-full"></div>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-transparent flex flex-col justify-between h-[160px] transform md:translate-y-6">
            <span className="text-[#EF9F27] font-black text-3xl md:text-4xl">1997</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#65635E]">FONDATION</span>
          </div>
          <div className="bg-[#1D9E75] text-white p-6 md:p-8 rounded-xl shadow-[0_10px_30px_rgba(29,158,117,0.3)] flex flex-col justify-between h-[160px]">
            <span className="font-black text-3xl md:text-4xl">1999</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-90">RECONNAISSANCE</span>
          </div>
          <div className="bg-[#F0EFEA] p-6 md:p-8 rounded-xl shadow-sm border border-transparent flex flex-col justify-between h-[160px] transform md:translate-y-6">
            <span className="text-[#1A1918] font-black text-3xl md:text-4xl">19</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#65635E]">PRÉSIDENTS</span>
          </div>
          <div className="bg-[#FAEEDA] p-6 md:p-8 rounded-xl shadow-sm border border-transparent flex flex-col justify-between h-[160px]">
            <span className="text-[#1A1918] font-black text-3xl md:text-4xl">25 ans</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#EF9F27]">D'IMPACT</span>
          </div>
        </div>
      </section>

      {/* Notre Mission Section */}
      <section className="bg-[#F8F8F6] py-24 border-t border-[#E0DED7]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="space-y-2">
              <span className="text-[#D4840E] font-bold text-[10px] uppercase tracking-[0.2em]">{locale === 'fr' ? 'Valeurs Fondatrices' : 'Founding Values'}</span>
              <h2 className="text-[2.5rem] font-black tracking-tight text-[#1A1918]">{t('mission_title')}</h2>
            </div>
            <div className="max-w-md text-[#65635E] text-sm leading-relaxed mb-2">
              Favoriser l'intégration, promouvoir l'excellence académique et maintenir le lien culturel avec la patrie.
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mission Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#E1F5EE] rounded-lg flex items-center justify-center mb-6">
                <span className="text-xl">🤝</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#1A1918]">Communauté</h3>
              <p className="text-[#65635E] text-sm leading-[1.6] mb-6">Un réseau de solidarité s'étendant à travers toutes les provinces de Chine pour ne jamais se sentir seul à l'étranger.</p>
              <Link className="text-[#1D9E75] font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all" href={`/${locale}/a-propos`}>
                DÉCOUVRIR →
              </Link>
            </div>
            {/* Mission Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#FAEEDA] rounded-lg flex items-center justify-center mb-6">
                <span className="text-xl">🗂️</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#1A1918]">Mémoire</h3>
              <p className="text-[#65635E] text-sm leading-[1.6] mb-6">Préserver notre héritage culturel camerounais tout en apprenant de la richesse millénaire de la civilisation chinoise.</p>
              <Link className="text-[#D4840E] font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all" href={`/${locale}/histoire`}>
                NOTRE HISTOIRE →
              </Link>
            </div>
            {/* Mission Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#FDECEC] rounded-lg flex items-center justify-center mb-6">
                <span className="text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#1A1918]">Opportunités</h3>
              <p className="text-[#65635E] text-sm leading-[1.6] mb-6">Faciliter l'accès aux bourses, stages et carrières pour nos membres au sein des entreprises leaders mondiales.</p>
              <Link className="text-[#E24B4A] font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all" href={`/${locale}/opportunites`}>
                SAISIR →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières Annonces Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto bg-[#F8F8F6]">
        <div className="text-center mb-16">
          <h2 className="text-[2.5rem] font-black tracking-tight text-[#1A1918] mb-3">Dernières Annonces</h2>
          <div className="h-1 w-20 bg-[#1D9E75] mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <AnnouncementCard
              announcement={announcement}
              key={announcement.id}
              locale={locale}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
            <Link className="text-brand-600 font-bold hover:underline" href={`/${locale}/annonces`}>Voir toutes les annonces →</Link>
        </div>
      </section>

      {/* Opportunités Récentes Section */}
      <section className="bg-brand-800 py-24">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-brand-100 font-bold text-sm uppercase tracking-[0.2em] mb-4 block">Carrière & Éducation</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">Accélérez votre futur professionnel</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Grâce à nos relais, nous sélectionnons les opportunités les plus utiles pour la communauté camerounaise en Chine.
            </p>
            <Link className="inline-block px-8 py-4 bg-white text-brand-800 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-neutral-100 transition-all" href={`/${locale}/opportunites`}>
              Toutes les offres
            </Link>
          </div>
          <div className="space-y-6">
            {opportunities.map((opportunity) => (
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group" key={opportunity.id}>
                 <OpportunityCard locale={locale} opportunity={opportunity} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-8 bg-[#F8F8F6]">
        <div className="bg-[#F0EFEA] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <span className="text-[#0F6E56] font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">Héritage</span>
            <h2 className="text-4xl font-black mb-14 tracking-tight text-[#1A1918]">Ils ont fait l'AECC</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {founders.slice(0, 6).map((founder) => {
                const initials = founder.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                return (
                  <div className="group relative flex flex-col items-center" key={founder.id} title={founder.full_name}>
                    <div className="w-[84px] h-[84px] flex items-center justify-center rounded-full border-[3px] border-[#65635E] shadow-xl overflow-hidden bg-[#1A1918] text-white font-black text-2xl transition-transform duration-300 hover:scale-105">
                      <span className="opacity-40">{initials}</span>
                    </div>
                    <div className="absolute -bottom-2 bg-black text-white text-[9px] font-bold px-2 py-[2px] rounded-full border border-[#F0EFEA] uppercase tracking-widest z-10 shadow-sm">
                      {initials}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[#65635E] max-w-2xl mx-auto mb-10 text-sm leading-[1.6]">
              Ils ont posé les fondations de ce que nous sommes aujourd'hui. Découvrez leurs parcours inspirants et comment l'AECC a façonné leur carrière internationale.
            </p>
            <Link className="group relative inline-flex px-8 py-3 bg-[#0F6E56] text-white rounded-md font-bold text-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow" href={`/${locale}/histoire`}>
              <span className="relative z-10 flex items-center gap-2">Découvrir les témoignages <span className="text-lg">🎓</span></span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

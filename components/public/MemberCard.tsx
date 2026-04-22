import type { Locale } from '@/lib/i18n'
import type { Member } from '@/lib/supabase/types'

interface MemberCardProps {
  member: Member
  locale: Locale
}

export function MemberCard({ member, locale }: MemberCardProps) {
  const initials = `${member.first_name[0] || ''}${member.last_name[0] || ''}`.toUpperCase()
  const graduationLabel = member.graduation_year
    ? locale === 'fr'
      ? `(Promo ${member.graduation_year})`
      : `(Class of ${member.graduation_year})`
    : ''
  const profileLabel = locale === 'fr' ? 'Consulter le profil' : 'View profile'

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] bg-white shadow-[0_14px_34px_-22px_rgba(26,25,24,0.24)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_54px_-26px_rgba(26,25,24,0.3)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-accent-300" />
      <div className="absolute -right-8 top-8 h-28 w-28 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-110" />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0F6E56,#1D9E75)] text-lg font-black text-white shadow-[0_12px_24px_-16px_rgba(15,110,86,0.6)]">
            {initials}
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              {member.city}
            </p>
            <h3 className="truncate text-xl font-black tracking-tight text-neutral-900">
              {member.first_name} {member.last_name}
            </h3>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
          <div className="space-y-3 text-sm text-neutral-600">
            <p className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="line-clamp-2">{member.university}</span>
            </p>
            <p className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>
                {member.degree} {graduationLabel}
              </span>
            </p>
          </div>
        </div>

        {member.bio ? (
          <p className="mt-4 line-clamp-3 text-sm italic leading-7 text-neutral-500">
            &ldquo;{member.bio}&rdquo;
          </p>
        ) : null}

        {!member.linkedin_url ? (
          <div className="mt-5 rounded-2xl border border-dashed border-neutral-200 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              {locale === 'fr' ? 'Contact direct' : 'Direct contact'}
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              {locale === 'fr'
                ? 'Email et WeChat seront affiches ici lorsque ces champs seront disponibles.'
                : 'Email and WeChat will appear here when these fields are available.'}
            </p>
          </div>
        ) : null}
      </div>

      {member.linkedin_url ? (
        <div className="border-t border-neutral-100 px-6 py-4">
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a66c2] hover:underline"
            href={member.linkedin_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            {profileLabel}
          </a>
        </div>
      ) : null}
    </article>
  )
}

import type { Locale } from '@/lib/i18n'
import type { Member } from '@/lib/supabase/types'
import { WeChatCopyButton } from './WeChatCopyButton'

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
  const wechatCopiedLabel = locale === 'fr' ? 'ID copié !' : 'ID copied!'

  const hasLinks = member.linkedin_url || member.email || member.wechat

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
          {initials}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="truncate text-lg font-bold text-neutral-900">
            {member.first_name} {member.last_name}
          </h3>
          <p className="truncate text-sm font-medium text-brand-600">{member.city}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-neutral-600">
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

      {member.bio ? (
        <p className="mt-4 line-clamp-3 text-sm italic text-neutral-500">
          &ldquo;{member.bio}&rdquo;
        </p>
      ) : null}

      {hasLinks ? (
        <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4">
          {member.linkedin_url ? (
            <a
              className="flex items-center gap-2 text-sm font-semibold text-[#0a66c2] hover:underline"
              href={member.linkedin_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              {profileLabel}
            </a>
          ) : null}

          {member.email ? (
            <a
              className="flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-brand-600"
              href={`mailto:${member.email}`}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
              </svg>
              {member.email}
            </a>
          ) : null}

          {member.wechat ? (
            <WeChatCopyButton copiedLabel={wechatCopiedLabel} wechatId={member.wechat} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

import { getTranslations } from 'next-intl/server'
import { toggleMemberStatus } from '@/app/actions/members'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminMembers } from '@/lib/data/admin'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const members = await getAdminMembers()

  return (
    <AdminLayout title={t('membres')}>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
              {t('members_title')}
            </h1>
            <p className="mt-2 max-w-2xl text-lg leading-8 text-neutral-600">
              {t('members_subtitle')}
            </p>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
            <thead className="bg-[#f0ece4] text-left text-neutral-600">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('members_student')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('members_university')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('members_city')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('members_status')}</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">
                  {t('members_actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dd] bg-white">
              {members.map((member) => {
                const statusLabel = member.is_active ? t('status_active') : t('status_pending')
                const statusClass = member.is_active
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-accent-50 text-accent-400'
                const initials = `${member.first_name[0] || ''}${member.last_name[0] || ''}`.toUpperCase()

                return (
                  <tr className="group hover:bg-[#faf7f1]" key={member.id}>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-600">
                          {initials}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-neutral-900">
                            {member.first_name} {member.last_name}
                          </p>
                          <span className="mt-1 block text-sm text-neutral-500">
                            {t('members_arrived_in')} {member.entry_year || '?'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-neutral-600">
                      <p className="font-medium text-neutral-900">{member.university}</p>
                      <p className="text-sm">{member.degree}</p>
                    </td>
                    <td className="px-6 py-5 font-medium text-neutral-600">{member.city}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {member.is_active ? (
                          <form action={toggleMemberStatus.bind(null, member.id, false)}>
                            <button className="rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10" type="submit">
                              {t('members_revoke')}
                            </button>
                          </form>
                        ) : (
                          <form action={toggleMemberStatus.bind(null, member.id, true)}>
                            <button className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50" type="submit">
                              {t('members_approve')}
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}

              {members.length === 0 ? (
                <tr>
                  <td className="py-12 text-center text-neutral-500" colSpan={5}>
                    {t('members_empty')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

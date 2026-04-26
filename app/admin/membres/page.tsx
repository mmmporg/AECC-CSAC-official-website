import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminMembersClient } from '@/components/admin/AdminMembersClient'
import { getAdminMembers } from '@/lib/data/admin'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const members = await getAdminMembers()

  return (
    <AdminLayout title={t('membres')}>
      <AdminMembersClient
        labels={{
          formSuccessUpdate: t('form_success_update'),
          loading: t('loading'),
          membersActions: t('members_actions'),
          membersApprove: t('members_approve'),
          membersArrivedIn: t('members_arrived_in'),
          membersCity: t('members_city'),
          membersEmpty: t('members_empty'),
          membersRevoke: t('members_revoke'),
          membersStatus: t('members_status'),
          membersStudent: t('members_student'),
          membersSubtitle: t('members_subtitle'),
          membersTitle: t('members_title'),
          membersUniversity: t('members_university'),
          statusActive: t('status_active'),
          statusPending: t('status_pending')
        }}
        members={members}
      />
    </AdminLayout>
  )
}

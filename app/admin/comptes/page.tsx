import { getTranslations } from 'next-intl/server'
import { AdminAccountsClient } from '@/components/admin/AdminAccountsClient'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminAccounts } from '@/lib/data/admin'
import { requireSuperAdminUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminAccountsPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const currentUser = await requireSuperAdminUser()
  const accounts = await getAdminAccounts()

  return (
    <AdminLayout title={t('comptes')}>
      <AdminAccountsClient
        accounts={accounts}
        currentUserId={currentUser.id}
        labels={{
          accountActions: t('account_actions'),
          accountCreated: t('account_created'),
          accountCreateSubmit: t('account_create_submit'),
          accountCreateTitle: t('account_create_title'),
          accountCurrent: t('account_current'),
          accountEmail: t('account_email'),
          accountEmpty: t('account_empty'),
          accountEnable: t('account_enable'),
          accountLastSignIn: t('account_last_sign_in'),
          accountPassword: t('account_password'),
          accountResetPassword: t('account_reset_password'),
          accountRole: t('account_role'),
          accountStatus: t('account_status'),
          accountUpdateRole: t('account_update_role'),
          accountsSubtitle: t('accounts_subtitle'),
          accountsTitle: t('accounts_title'),
          email: t('email'),
          formSuccessCreate: t('form_success_create'),
          formSuccessUpdate: t('form_success_update'),
          loading: t('loading'),
          roleAdmin: t('role_admin'),
          roleSuperAdmin: t('role_super_admin'),
          statusActive: t('status_active'),
          statusDisabled: t('status_disabled'),
          toggleDisable: t('account_disable')
        }}
      />
    </AdminLayout>
  )
}

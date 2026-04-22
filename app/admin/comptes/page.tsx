import { getTranslations } from 'next-intl/server'
import {
  createAdminAccount,
  resetAdminPassword,
  toggleAdminAccountAccess,
  updateAdminRole
} from '@/app/actions/admin-users'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminAccounts } from '@/lib/data/admin'
import { requireSuperAdminUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

export default async function AdminAccountsPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const currentUser = await requireSuperAdminUser()
  const accounts = await getAdminAccounts()

  return (
    <AdminLayout title={t('comptes')}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
            {t('accounts_title')}
          </h1>
          <p className="mt-2 max-w-3xl text-lg leading-8 text-neutral-600">
            {t('accounts_subtitle')}
          </p>
        </div>

        <section className="admin-card grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900">{t('account_create_title')}</h2>
            <p className="text-sm leading-7 text-neutral-600">{t('account_create_subtitle')}</p>
          </div>

          <form action={createAdminAccount} className="grid gap-4 rounded-2xl bg-[#faf7f1] p-5">
            <label className="space-y-2 text-sm font-medium text-neutral-700">
              <span>{t('email')}</span>
              <input
                className="w-full rounded-xl border border-[#ddd6ca] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500"
                name="email"
                required
                type="email"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-neutral-700">
              <span>{t('account_password')}</span>
              <input
                className="w-full rounded-xl border border-[#ddd6ca] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500"
                minLength={10}
                name="password"
                required
                type="password"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-neutral-700">
              <span>{t('account_role')}</span>
              <select
                className="w-full rounded-xl border border-[#ddd6ca] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500"
                defaultValue="admin"
                name="role"
              >
                <option value="admin">{t('role_admin')}</option>
                <option value="super_admin">{t('role_super_admin')}</option>
              </select>
            </label>

            <button
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              type="submit"
            >
              {t('account_create_submit')}
            </button>
          </form>
        </section>

        <section className="admin-card overflow-hidden">
          <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
            <thead className="bg-[#f0ece4] text-left text-neutral-600">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('account_email')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('account_role')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('account_status')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('account_created')}</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">{t('account_last_sign_in')}</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">
                  {t('account_actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dd] bg-white">
              {accounts.map((account) => {
                const isCurrentUser = currentUser.id === account.id

                return (
                  <tr className="align-top hover:bg-[#faf7f1]" key={account.id}>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="font-semibold text-neutral-900">{account.email}</p>
                        {isCurrentUser ? (
                          <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                            {t('account_current')}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <form action={updateAdminRole} className="flex gap-2">
                        <input name="id" type="hidden" value={account.id} />
                        <select
                          className="min-w-[10rem] rounded-lg border border-[#ddd6ca] bg-white px-3 py-2 text-sm text-neutral-900"
                          defaultValue={account.role}
                          disabled={isCurrentUser}
                          name="role"
                        >
                          <option value="admin">{t('role_admin')}</option>
                          <option value="super_admin">{t('role_super_admin')}</option>
                        </select>
                        <button
                          className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-neutral-400"
                          disabled={isCurrentUser}
                          type="submit"
                        >
                          {t('account_update_role')}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          account.isDisabled
                            ? 'bg-error/10 text-error'
                            : 'bg-brand-50 text-brand-700'
                        }`}
                      >
                        {account.isDisabled ? t('status_disabled') : t('status_active')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-neutral-600">{formatDate(account.createdAt)}</td>
                    <td className="px-6 py-5 text-neutral-600">{formatDate(account.lastSignInAt)}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-end gap-3">
                        <form action={resetAdminPassword} className="flex gap-2">
                          <input name="id" type="hidden" value={account.id} />
                          <input
                            className="min-w-[12rem] rounded-lg border border-[#ddd6ca] bg-white px-3 py-2 text-sm text-neutral-900"
                            minLength={10}
                            name="password"
                            placeholder={t('account_password')}
                            required
                            type="password"
                          />
                          <button
                            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
                            type="submit"
                          >
                            {t('account_reset_password')}
                          </button>
                        </form>

                        <form action={toggleAdminAccountAccess}>
                          <input name="id" type="hidden" value={account.id} />
                          <input
                            name="disabled"
                            type="hidden"
                            value={account.isDisabled ? 'false' : 'true'}
                          />
                          <button
                            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400"
                            disabled={isCurrentUser}
                            type="submit"
                          >
                            {account.isDisabled ? t('account_enable') : t('account_disable')}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {accounts.length === 0 ? (
                <tr>
                  <td className="py-12 text-center text-neutral-500" colSpan={6}>
                    {t('account_empty')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  )
}

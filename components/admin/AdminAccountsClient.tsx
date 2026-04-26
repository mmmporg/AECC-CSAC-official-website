'use client'

import { useFormState, useFormStatus } from 'react-dom'
import {
  type AdminUserActionState,
  createAdminAccountFormAction,
  resetAdminPasswordFormAction,
  toggleAdminAccountAccessFormAction,
  updateAdminRoleFormAction
} from '@/app/actions/admin-users'
import type { AdminAccount } from '@/lib/data/admin'
import { cn } from '@/lib/utils'

interface AdminAccountsClientProps {
  accounts: AdminAccount[]
  currentUserId: string
  labels: {
    accountActions: string
    accountCreated: string
    accountCreateSubmit: string
    accountCreateTitle: string
    accountCurrent: string
    accountEmail: string
    accountEmpty: string
    accountEnable: string
    accountLastSignIn: string
    accountPassword: string
    accountResetPassword: string
    accountRole: string
    accountStatus: string
    accountUpdateRole: string
    accountsSubtitle: string
    accountsTitle: string
    email: string
    formSuccessCreate: string
    formSuccessUpdate: string
    loading: string
    roleAdmin: string
    roleSuperAdmin: string
    statusActive: string
    statusDisabled: string
    toggleDisable: string
  }
}

const initialAdminUserActionState: AdminUserActionState = {
  success: false
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function FormMessage({
  error,
  success,
  successMessage
}: {
  error?: string
  success: boolean
  successMessage: string
}) {
  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
        {error}
      </p>
    )
  }

  if (!success) {
    return null
  }

  return (
    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
      {successMessage}
    </p>
  )
}

function SubmitButton({
  children,
  className,
  pendingLabel,
  disabled = false
}: {
  children: React.ReactNode
  className: string
  pendingLabel: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <button className={className} disabled={disabled || pending} type="submit">
      {pending ? pendingLabel : children}
    </button>
  )
}

function CreateAccountForm({
  labels
}: Pick<AdminAccountsClientProps, 'labels'>) {
  const [state, formAction] = useFormState(
    createAdminAccountFormAction,
    initialAdminUserActionState
  )

  return (
    <form action={formAction} className="grid gap-4 rounded-2xl bg-[#faf7f1] p-5">
      <label className="space-y-2 text-sm font-medium text-neutral-700">
        <span>{labels.email}</span>
        <input
          className="w-full rounded-xl border border-[#ddd6ca] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500"
          name="email"
          required
          type="email"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-neutral-700">
        <span>{labels.accountPassword}</span>
        <input
          className="w-full rounded-xl border border-[#ddd6ca] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500"
          minLength={10}
          name="password"
          required
          type="password"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-neutral-700">
        <span>{labels.accountRole}</span>
        <select
          className="w-full rounded-xl border border-[#ddd6ca] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500"
          defaultValue="admin"
          name="role"
        >
          <option value="admin">{labels.roleAdmin}</option>
          <option value="super_admin">{labels.roleSuperAdmin}</option>
        </select>
      </label>

      <FormMessage
        error={state.error}
        success={state.success}
        successMessage={labels.formSuccessCreate}
      />

      <SubmitButton
        className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
        pendingLabel={labels.loading}
      >
        {labels.accountCreateSubmit}
      </SubmitButton>
    </form>
  )
}

function UpdateRoleForm({
  account,
  isCurrentUser,
  labels
}: {
  account: AdminAccount
  isCurrentUser: boolean
  labels: AdminAccountsClientProps['labels']
}) {
  const [state, formAction] = useFormState(
    updateAdminRoleFormAction,
    initialAdminUserActionState
  )

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <input name="id" type="hidden" value={account.id} />
        <select
          className="min-w-[10rem] rounded-lg border border-[#ddd6ca] bg-white px-3 py-2 text-sm text-neutral-900"
          defaultValue={account.role}
          disabled={isCurrentUser}
          name="role"
        >
          <option value="admin">{labels.roleAdmin}</option>
          <option value="super_admin">{labels.roleSuperAdmin}</option>
        </select>
        <SubmitButton
          className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-neutral-400"
          disabled={isCurrentUser}
          pendingLabel={labels.loading}
        >
          {labels.accountUpdateRole}
        </SubmitButton>
      </div>

      <FormMessage
        error={state.error}
        success={state.success}
        successMessage={labels.formSuccessUpdate}
      />
    </form>
  )
}

function ResetPasswordForm({
  accountId,
  labels
}: {
  accountId: string
  labels: AdminAccountsClientProps['labels']
}) {
  const [state, formAction] = useFormState(
    resetAdminPasswordFormAction,
    initialAdminUserActionState
  )

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <input name="id" type="hidden" value={accountId} />
        <input
          className="min-w-[12rem] rounded-lg border border-[#ddd6ca] bg-white px-3 py-2 text-sm text-neutral-900"
          minLength={10}
          name="password"
          placeholder={labels.accountPassword}
          required
          type="password"
        />
        <SubmitButton
          className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-neutral-400"
          pendingLabel={labels.loading}
        >
          {labels.accountResetPassword}
        </SubmitButton>
      </div>

      <FormMessage
        error={state.error}
        success={state.success}
        successMessage={labels.formSuccessUpdate}
      />
    </form>
  )
}

function ToggleAccessForm({
  account,
  isCurrentUser,
  labels
}: {
  account: AdminAccount
  isCurrentUser: boolean
  labels: AdminAccountsClientProps['labels']
}) {
  const [state, formAction] = useFormState(
    toggleAdminAccountAccessFormAction,
    initialAdminUserActionState
  )

  return (
    <form action={formAction} className="space-y-2">
      <input name="id" type="hidden" value={account.id} />
      <input name="disabled" type="hidden" value={account.isDisabled ? 'false' : 'true'} />
      <SubmitButton
        className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400"
        disabled={isCurrentUser}
        pendingLabel={labels.loading}
      >
        {account.isDisabled ? labels.accountEnable : labels.toggleDisable}
      </SubmitButton>

      <FormMessage
        error={state.error}
        success={state.success}
        successMessage={labels.formSuccessUpdate}
      />
    </form>
  )
}

export function AdminAccountsClient({
  accounts,
  currentUserId,
  labels
}: AdminAccountsClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
          {labels.accountsTitle}
        </h1>
        <p className="mt-2 max-w-3xl text-lg leading-8 text-neutral-600">
          {labels.accountsSubtitle}
        </p>
      </div>

      <section className="admin-card grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{labels.accountCreateTitle}</h2>
        </div>

        <CreateAccountForm labels={labels} />
      </section>

      <section className="admin-card overflow-hidden">
        <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
          <thead className="bg-[#f0ece4] text-left text-neutral-600">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.accountEmail}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.accountRole}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.accountStatus}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.accountCreated}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.accountLastSignIn}
              </th>
              <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">
                {labels.accountActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece7dd] bg-white">
            {accounts.map((account) => {
              const isCurrentUser = currentUserId === account.id

              return (
                <tr className="align-top hover:bg-[#faf7f1]" key={account.id}>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-900">{account.email}</p>
                      {isCurrentUser ? (
                        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                          {labels.accountCurrent}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <UpdateRoleForm account={account} isCurrentUser={isCurrentUser} labels={labels} />
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                        account.isDisabled ? 'bg-error/10 text-error' : 'bg-brand-50 text-brand-700'
                      )}
                    >
                      {account.isDisabled ? labels.statusDisabled : labels.statusActive}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-neutral-600">{formatDate(account.createdAt)}</td>
                  <td className="px-6 py-5 text-neutral-600">{formatDate(account.lastSignInAt)}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-end gap-3">
                      <ResetPasswordForm accountId={account.id} labels={labels} />
                      <ToggleAccessForm account={account} isCurrentUser={isCurrentUser} labels={labels} />
                    </div>
                  </td>
                </tr>
              )
            })}

            {accounts.length === 0 ? (
              <tr>
                <td className="py-12 text-center text-neutral-500" colSpan={6}>
                  {labels.accountEmpty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}

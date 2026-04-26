'use client'

import { useFormState, useFormStatus } from 'react-dom'
import {
  type MemberActionState,
  toggleMemberStatusFormAction
} from '@/app/actions/members'
import type { Member } from '@/lib/supabase/types'

interface AdminMembersClientProps {
  members: Member[]
  labels: {
    formSuccessUpdate: string
    membersActions: string
    membersApprove: string
    membersArrivedIn: string
    membersCity: string
    membersEmpty: string
    membersRevoke: string
    membersStatus: string
    membersStudent: string
    membersSubtitle: string
    membersTitle: string
    membersUniversity: string
    loading: string
    statusActive: string
    statusPending: string
  }
}

const initialMemberActionState: MemberActionState = {
  success: false
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
  pendingLabel
}: {
  children: React.ReactNode
  className: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingLabel : children}
    </button>
  )
}

function ToggleMemberForm({
  active,
  id,
  labels
}: {
  active: boolean
  id: string
  labels: AdminMembersClientProps['labels']
}) {
  const [state, formAction] = useFormState(
    toggleMemberStatusFormAction.bind(null, id, active),
    initialMemberActionState
  )

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton
        className={
          active
            ? 'rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-neutral-400'
            : 'rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10 disabled:cursor-not-allowed disabled:text-neutral-400'
        }
        pendingLabel={labels.loading}
      >
        {active ? labels.membersApprove : labels.membersRevoke}
      </SubmitButton>

      <FormMessage
        error={state.error}
        success={state.success}
        successMessage={labels.formSuccessUpdate}
      />
    </form>
  )
}

export function AdminMembersClient({ members, labels }: AdminMembersClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
            {labels.membersTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-lg leading-8 text-neutral-600">
            {labels.membersSubtitle}
          </p>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
          <thead className="bg-[#f0ece4] text-left text-neutral-600">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.membersStudent}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.membersUniversity}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.membersCity}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                {labels.membersStatus}
              </th>
              <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">
                {labels.membersActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece7dd] bg-white">
            {members.map((member) => {
              const statusLabel = member.is_active ? labels.statusActive : labels.statusPending
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
                          {labels.membersArrivedIn} {member.entry_year || '?'}
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
                    <div className="flex justify-end">
                      <ToggleMemberForm
                        active={!member.is_active}
                        id={member.id}
                        labels={labels}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}

            {members.length === 0 ? (
              <tr>
                <td className="py-12 text-center text-neutral-500" colSpan={5}>
                  {labels.membersEmpty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  archiveOpportunity,
  unarchiveOpportunity,
  deleteOpportunity
} from '@/app/actions/opportunities'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminOpportunities } from '@/lib/data/admin'

export default async function AdminOpportunitiesPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const opportunities = await getAdminOpportunities()

  return (
    <AdminLayout title={t('opportunites_actives')}>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
              Gestion des Opportunites
            </h1>
            <p className="mt-2 max-w-2xl text-lg leading-8 text-neutral-600">
              Centralisez les candidatures, bourses et publications actives.
            </p>
          </div>
          <Link className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700" href="/admin/opportunites/new">
            {t('nouvelle_opportunite')}
          </Link>
        </div>

        <div className="admin-card overflow-hidden">
          <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
            <thead className="bg-[#f0ece4] text-left text-neutral-600">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                  Titre &amp; categorie
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                  Organisation
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                  Deadline
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Statut</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dd] bg-white">
              {opportunities.slice(0, 12).map((opportunity, index) => {
                const statusLabel = opportunity.is_active ? t('status_active') : t('status_archived')
                const statusClass = opportunity.is_active
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-neutral-100 text-neutral-600'

                return (
                  <tr className="group hover:bg-[#faf7f1]" key={opportunity.id}>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            index % 2 === 0
                              ? 'bg-brand-50 text-brand-700'
                              : 'bg-accent-50 text-accent-400'
                          }`}
                        >
                          {opportunity.category.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-neutral-900">
                            {opportunity.title_fr}
                          </p>
                          <span className="mt-2 inline-flex rounded-full bg-[#eaf4e6] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#3b6d11]">
                            {opportunity.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-neutral-600">{opportunity.organization}</td>
                    <td className="px-6 py-5 text-neutral-600">
                      {opportunity.deadline
                        ? new Date(opportunity.deadline).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                        <Link
                          className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
                          href={`/admin/opportunites/${opportunity.id}/edit`}
                        >
                          {t('modifier')}
                        </Link>
                        {opportunity.is_active ? (
                          <form action={archiveOpportunity.bind(null, opportunity.id)}>
                            <button className="rounded-lg px-3 py-2 text-sm font-medium text-accent-400 transition hover:bg-accent-50" type="submit">
                              {t('archiver')}
                            </button>
                          </form>
                        ) : (
                          <form action={unarchiveOpportunity.bind(null, opportunity.id)}>
                            <button className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50" type="submit">
                              {t('desarchiver')}
                            </button>
                          </form>
                        )}
                        <form action={deleteOpportunity.bind(null, opportunity.id)}>
                          <button className="rounded-lg px-3 py-2 text-sm font-medium text-error transition hover:bg-red-50" type="submit">
                            {t('supprimer')}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

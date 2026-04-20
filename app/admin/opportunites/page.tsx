import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  archiveOpportunity,
  deleteOpportunity
} from '@/app/actions/opportunities'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminOpportunities } from '@/lib/data/admin'

export default async function AdminOpportunitiesPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const opportunities = await getAdminOpportunities()

  return (
    <AdminLayout title={t('opportunites_actives')}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link className="rounded-lg bg-brand-400 px-5 py-3 text-sm font-semibold text-white" href="/admin/opportunites/new">
            {t('nouvelle_opportunite')}
          </Link>
        </div>

        <div className="surface-card overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-600">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Organisation</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {opportunity.title_fr}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{opportunity.organization}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {opportunity.is_active ? t('status_active') : t('status_archived')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link className="text-brand-600" href={`/admin/opportunites/${opportunity.id}/edit`}>
                        {t('modifier')}
                      </Link>
                      {opportunity.is_active ? (
                        <form action={archiveOpportunity.bind(null, opportunity.id)}>
                          <button className="text-accent-400" type="submit">
                            {t('archiver')}
                          </button>
                        </form>
                      ) : null}
                      <form action={deleteOpportunity.bind(null, opportunity.id)}>
                        <button className="text-error" type="submit">
                          {t('supprimer')}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

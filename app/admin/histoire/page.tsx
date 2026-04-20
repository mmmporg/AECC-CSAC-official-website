import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminHistoryData } from '@/lib/data/admin'
import {
  deleteTimelineEvent,
  deleteFounder,
  deletePresident
} from '@/app/actions/history'

export default async function AdminHistoryPage() {
  const history = await getAdminHistoryData()

  return (
    <AdminLayout title="Gestion de l'histoire">
      <div className="space-y-10">

        {/* ── FRISE CHRONOLOGIQUE ─────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Frise chronologique ({history.timeline.length})
            </h2>
            <Link
              className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-white"
              href="/admin/histoire/timeline/new"
            >
              + Ajouter un événement
            </Link>
          </div>
          <div className="surface-card overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-100 text-left text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Période</th>
                  <th className="px-4 py-3">Titre (FR)</th>
                  <th className="px-4 py-3">Couleur</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {history.timeline.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-3 text-neutral-600">{event.period}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{event.title_fr}</td>
                    <td className="px-4 py-3 text-neutral-600">{event.color}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link className="text-brand-600" href={`/admin/histoire/timeline/${event.id}/edit`}>
                          Modifier
                        </Link>
                        <form action={deleteTimelineEvent.bind(null, event.id)}>
                          <button className="text-red-500" type="submit">
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FONDATEURS ──────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Fondateurs ({history.founders.length})
            </h2>
            <Link
              className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-white"
              href="/admin/histoire/fondateurs/new"
            >
              + Ajouter un fondateur
            </Link>
          </div>
          <div className="surface-card overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-100 text-left text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3">In memoriam</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {history.founders.map((founder) => (
                  <tr key={founder.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">{founder.full_name}</td>
                    <td className="px-4 py-3 text-neutral-600">{founder.role_fr ?? '—'}</td>
                    <td className="px-4 py-3">
                      {founder.in_memoriam ? (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                          In memoriam
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link className="text-brand-600" href={`/admin/histoire/fondateurs/${founder.id}/edit`}>
                          Modifier
                        </Link>
                        <form action={deleteFounder.bind(null, founder.id)}>
                          <button className="text-red-500" type="submit">
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── PRÉSIDENTS ──────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Présidents ({history.presidents.length})
            </h2>
            <Link
              className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-white"
              href="/admin/histoire/presidents/new"
            >
              + Ajouter un président
            </Link>
          </div>
          <div className="surface-card overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-100 text-left text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Période</th>
                  <th className="px-4 py-3">Ville</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {history.presidents.map((president) => (
                  <tr key={president.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">{president.full_name}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {president.year_start}{president.year_end ? ` – ${president.year_end}` : ''}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{president.city ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link className="text-brand-600" href={`/admin/histoire/presidents/${president.id}/edit`}>
                          Modifier
                        </Link>
                        <form action={deletePresident.bind(null, president.id)}>
                          <button className="text-red-500" type="submit">
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </AdminLayout>
  )
}

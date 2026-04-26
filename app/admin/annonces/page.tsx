import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  archiveAnnouncement,
  unarchiveAnnouncement,
  deleteAnnouncement
} from '@/app/actions/announcements'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminAnnouncements } from '@/lib/data/admin'

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const announcements = await getAdminAnnouncements()

  return (
    <AdminLayout title={t('annonces_actives')}>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
              Gestion des Annonces
            </h1>
            <p className="mt-2 max-w-2xl text-lg leading-8 text-neutral-600">
              Supervisez, modifiez ou archivez les annonces de la communaute etudiante.
            </p>
          </div>
          <Link className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700" href="/admin/annonces/new">
            {t('nouvelle_annonce')}
          </Link>
        </div>

        <div className="admin-card overflow-hidden">
          <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
            <thead className="bg-[#f0ece4] text-left text-neutral-600">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">
                  Titre &amp; categorie
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Ville</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Dates</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Statut</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dd] bg-white">
              {announcements.map((announcement, index) => {
                const statusLabel = announcement.is_active ? t('status_active') : t('status_archived')
                const statusClass = announcement.is_active
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-neutral-100 text-neutral-600'

                return (
                  <tr className="group hover:bg-[#faf7f1]" key={announcement.id}>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            index % 3 === 0
                              ? 'bg-accent-50 text-accent-400'
                              : index % 3 === 1
                                ? 'bg-[#f9e8ee] text-[#8d4f68]'
                                : 'bg-brand-50 text-brand-700'
                          }`}
                        >
                          {announcement.category.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-neutral-900">
                            {announcement.title_fr}
                          </p>
                          <span className="mt-2 inline-flex rounded-full bg-[#f4ebda] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8c5a0a]">
                            {announcement.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-neutral-600">{announcement.city}</td>
                    <td className="px-6 py-5 text-sm text-neutral-600">
                      <div className="space-y-1">
                        <p>
                          Pub:{' '}
                          {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="opacity-70">
                          Exp:{' '}
                          {announcement.expires_at
                            ? new Date(announcement.expires_at).toLocaleDateString('fr-FR')
                            : '-'}
                        </p>
                      </div>
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
                          href={`/admin/annonces/${announcement.id}/edit`}
                        >
                          {t('modifier')}
                        </Link>
                        {announcement.is_active ? (
                          <form action={archiveAnnouncement.bind(null, announcement.id)}>
                            <button className="rounded-lg px-3 py-2 text-sm font-medium text-accent-400 transition hover:bg-accent-50" type="submit">
                              {t('archiver')}
                            </button>
                          </form>
                        ) : (
                          <form action={unarchiveAnnouncement.bind(null, announcement.id)}>
                            <button className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50" type="submit">
                              {t('desarchiver')}
                            </button>
                          </form>
                        )}
                        <form action={deleteAnnouncement.bind(null, announcement.id)}>
                          <button className="rounded-lg px-3 py-2 text-sm font-medium text-error transition hover:bg-red-50" type="submit">
                            {t('supprimer')}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {announcements.length === 0 ? (
                <tr>
                  <td className="py-12 text-center text-neutral-500" colSpan={5}>
                    Aucune annonce disponible.
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

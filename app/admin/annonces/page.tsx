import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  archiveAnnouncement,
  deleteAnnouncement
} from '@/app/actions/announcements'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminAnnouncements } from '@/lib/data/admin'

export default async function AdminAnnouncementsPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const announcements = await getAdminAnnouncements()

  return (
    <AdminLayout title={t('annonces_actives')}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link className="rounded-lg bg-brand-400 px-5 py-3 text-sm font-semibold text-white" href="/admin/annonces/new">
            {t('nouvelle_annonce')}
          </Link>
        </div>

        <div className="surface-card overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-600">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {announcement.title_fr}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{announcement.city}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {announcement.is_active ? t('status_active') : t('status_archived')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link className="text-brand-600" href={`/admin/annonces/${announcement.id}/edit`}>
                        {t('modifier')}
                      </Link>
                      {announcement.is_active ? (
                        <form action={archiveAnnouncement.bind(null, announcement.id)}>
                          <button className="text-accent-400" type="submit">
                            {t('archiver')}
                          </button>
                        </form>
                      ) : null}
                      <form action={deleteAnnouncement.bind(null, announcement.id)}>
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

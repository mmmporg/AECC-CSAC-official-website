import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AnnouncementForm } from '@/components/admin/AnnouncementForm'

export default async function NewAnnouncementPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })

  return (
    <AdminLayout title={t('nouvelle_annonce')}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
            Creer une annonce
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Redigez et publiez des informations officielles pour le reseau.
          </p>
        </div>
        <AnnouncementForm mode="create" />
      </div>
    </AdminLayout>
  )
}

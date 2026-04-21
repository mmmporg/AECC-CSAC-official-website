import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AnnouncementForm } from '@/components/admin/AnnouncementForm'
import { getAdminAnnouncement } from '@/lib/data/admin'

export default async function EditAnnouncementPage({
  params
}: {
  params: { id: string }
}) {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const announcement = await getAdminAnnouncement(params.id)

  if (!announcement) {
    notFound()
  }

  return (
    <AdminLayout title={t('modifier')}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
            Modifier l&apos;annonce
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Ajustez le contenu editorial et les informations de diffusion.
          </p>
        </div>
        <AnnouncementForm initialData={announcement} mode="edit" />
      </div>
    </AdminLayout>
  )
}

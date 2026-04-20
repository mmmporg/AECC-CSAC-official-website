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
      <AnnouncementForm initialData={announcement} mode="edit" />
    </AdminLayout>
  )
}

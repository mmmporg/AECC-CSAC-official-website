import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AnnouncementForm } from '@/components/admin/AnnouncementForm'

export default async function NewAnnouncementPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })

  return (
    <AdminLayout title={t('nouvelle_annonce')}>
      <AnnouncementForm mode="create" />
    </AdminLayout>
  )
}

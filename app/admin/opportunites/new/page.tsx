import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OpportunityForm } from '@/components/admin/OpportunityForm'

export default async function NewOpportunityPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })

  return (
    <AdminLayout title={t('nouvelle_opportunite')}>
      <OpportunityForm mode="create" />
    </AdminLayout>
  )
}

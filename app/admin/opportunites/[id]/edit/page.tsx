import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OpportunityForm } from '@/components/admin/OpportunityForm'
import { getAdminOpportunity } from '@/lib/data/admin'

export default async function EditOpportunityPage({
  params
}: {
  params: { id: string }
}) {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const opportunity = await getAdminOpportunity(params.id)

  if (!opportunity) {
    notFound()
  }

  return (
    <AdminLayout title={t('modifier')}>
      <OpportunityForm initialData={opportunity} mode="edit" />
    </AdminLayout>
  )
}

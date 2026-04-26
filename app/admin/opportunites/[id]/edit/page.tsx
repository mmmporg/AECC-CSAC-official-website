import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OpportunityForm } from '@/components/admin/OpportunityForm'
import { getAdminOpportunity } from '@/lib/data/admin'

export const dynamic = 'force-dynamic'

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
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
            Modifier l&apos;opportunite
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Mettez a jour les details et la fenetre de candidature.
          </p>
        </div>
        <OpportunityForm initialData={opportunity} mode="edit" />
      </div>
    </AdminLayout>
  )
}

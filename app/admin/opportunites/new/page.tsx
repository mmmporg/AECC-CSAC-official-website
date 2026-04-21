import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OpportunityForm } from '@/components/admin/OpportunityForm'

export default async function NewOpportunityPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })

  return (
    <AdminLayout title={t('nouvelle_opportunite')}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
            Creer une opportunite
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Centralisez les opportunites utiles pour la communaute AECC.
          </p>
        </div>
        <OpportunityForm mode="create" />
      </div>
    </AdminLayout>
  )
}

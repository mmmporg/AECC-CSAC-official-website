import { notFound } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { FounderForm } from '@/components/admin/FounderForm'
import { getAdminHistoryData } from '@/lib/data/admin'

export default async function EditFounderPage({
  params
}: {
  params: { id: string }
}) {
  const history = await getAdminHistoryData()
  const founder = history.founders.find((f) => f.id === params.id)

  if (!founder) notFound()

  return (
    <AdminLayout title="Modifier le fondateur">
      <FounderForm initialData={founder} mode="edit" />
    </AdminLayout>
  )
}

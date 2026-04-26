import { notFound } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PresidentForm } from '@/components/admin/PresidentForm'
import { getAdminHistoryData } from '@/lib/data/admin'

export const dynamic = 'force-dynamic'

export default async function EditPresidentPage({
  params
}: {
  params: { id: string }
}) {
  const history = await getAdminHistoryData()
  const president = history.presidents.find((p) => p.id === params.id)

  if (!president) notFound()

  return (
    <AdminLayout title="Modifier le président">
      <PresidentForm initialData={president} mode="edit" />
    </AdminLayout>
  )
}

import { notFound } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TimelineForm } from '@/components/admin/TimelineForm'
import { getAdminHistoryData } from '@/lib/data/admin'

export default async function EditTimelineEventPage({
  params
}: {
  params: { id: string }
}) {
  const history = await getAdminHistoryData()
  const event = history.timeline.find((e) => e.id === params.id)

  if (!event) notFound()

  return (
    <AdminLayout title="Modifier l'événement">
      <TimelineForm initialData={event} mode="edit" />
    </AdminLayout>
  )
}

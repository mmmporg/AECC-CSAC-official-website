import { AdminLayout } from '@/components/admin/AdminLayout'
import { TimelineForm } from '@/components/admin/TimelineForm'

export default function NewTimelineEventPage() {
  return (
    <AdminLayout title="Nouvel événement de frise">
      <TimelineForm mode="create" />
    </AdminLayout>
  )
}

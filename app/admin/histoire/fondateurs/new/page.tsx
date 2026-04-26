import { AdminLayout } from '@/components/admin/AdminLayout'
import { FounderForm } from '@/components/admin/FounderForm'

export const dynamic = 'force-dynamic'

export default function NewFounderPage() {
  return (
    <AdminLayout title="Nouveau fondateur">
      <FounderForm mode="create" />
    </AdminLayout>
  )
}

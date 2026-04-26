import { AdminLayout } from '@/components/admin/AdminLayout'
import { PresidentForm } from '@/components/admin/PresidentForm'

export const dynamic = 'force-dynamic'

export default function NewPresidentPage() {
  return (
    <AdminLayout title="Nouveau président">
      <PresidentForm mode="create" />
    </AdminLayout>
  )
}

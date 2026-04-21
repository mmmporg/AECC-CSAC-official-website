import { getTranslations } from 'next-intl/server'
import { GalerieAdminClient } from '@/components/admin/GalerieAdminClient'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getGalleryPhotos } from '@/lib/data/public'
import { requireAdminUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin - Galerie'
}

export default async function AdminGaleriePage() {
  await requireAdminUser()

  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const photos = await getGalleryPhotos()

  return (
    <AdminLayout title={t('galerie')}>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
              Galerie Photos
            </h1>
            <p className="mt-2 max-w-2xl text-lg leading-8 text-neutral-600">
              Gere les photos publiees sur la galerie publique.
            </p>
          </div>
        </div>

        <GalerieAdminClient initialImages={photos} />
      </div>
    </AdminLayout>
  )
}

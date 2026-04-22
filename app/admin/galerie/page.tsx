import { getTranslations } from 'next-intl/server'
import { GalerieAdminClient } from '@/components/admin/GalerieAdminClient'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getGalleryPhotos } from '@/lib/data/public'
import { requireAdminUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin - Galerie'
}

export default async function AdminGaleriePage({ searchParams }: { searchParams?: { [key: string]: string | string[] } }) {
  await requireAdminUser()

  const page = Number(searchParams?.page ?? 1)
  const pageSize = 12
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const { items: photos, total } = await getGalleryPhotos(page, pageSize)

  const totalPages = Math.ceil(total / pageSize)

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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              return (
                <a
                  key={p}
                  href={`?page=${p}`}
                  className={`px-3 py-1 rounded ${p === page ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-800'} transition`}
                >
                  {p}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

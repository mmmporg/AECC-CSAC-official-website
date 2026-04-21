import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminHistoryData } from '@/lib/data/admin'

function toneClass(color: string) {
  switch (color) {
    case 'red':
      return 'bg-[#f7d7d3] text-[#9c4840]'
    case 'yellow':
      return 'bg-[#f6dfb9] text-[#8a5b11]'
    case 'gray':
      return 'bg-neutral-200 text-neutral-700'
    default:
      return 'bg-brand-100 text-brand-700'
  }
}

export default async function AdminHistoryPage() {
  const history = await getAdminHistoryData()

  return (
    <AdminLayout title="Gestion de l'histoire">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 md:text-6xl">
            Gestion de l&apos;Histoire
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#ebe6db] px-6 py-3 text-sm font-semibold text-neutral-700">
            Frise chronologique
          </span>
          <span className="rounded-full px-6 py-3 text-sm font-medium text-neutral-600">
            Fondateurs
          </span>
          <span className="rounded-full px-6 py-3 text-sm font-medium text-neutral-600">
            Presidents
          </span>
          <Link
            className="ml-auto rounded-xl bg-brand-600 px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-brand-700"
            href="/admin/histoire/timeline/new"
          >
            + Ajouter un evenement
          </Link>
        </div>

        <p className="text-sm text-neutral-600">
          Glissez et deposez les cartes pour reorganiser l&apos;ordre d&apos;affichage sur la frise publique.
        </p>

        <div className="space-y-3">
          {history.timeline.map((event) => (
            <article
              className="admin-card flex items-center gap-5 px-5 py-6"
              key={event.id}
            >
              <div className="text-xl text-neutral-300">::</div>
              <div
                className={`rounded-full px-5 py-2 text-sm font-bold ${toneClass(event.color)}`}
              >
                {event.period}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-neutral-900">{event.title_fr}</h2>
                <p className="mt-1 text-base leading-7 text-neutral-600">
                  {event.description_fr}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
                  href={`/admin/histoire/timeline/${event.id}/edit`}
                >
                  Modifier
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="admin-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">
                Fondateurs ({history.founders.length})
              </h2>
              <Link
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-600 ring-1 ring-[#e3ded3] transition hover:bg-brand-50"
                href="/admin/histoire/fondateurs/new"
              >
                Ajouter
              </Link>
            </div>
            <div className="space-y-3">
              {history.founders.map((founder) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-[#ece7dd] bg-[#faf7f1] px-4 py-4"
                  key={founder.id}
                >
                  <div>
                    <p className="font-semibold text-neutral-900">{founder.full_name}</p>
                    <p className="text-sm text-neutral-600">{founder.role_fr ?? 'Sans role'}</p>
                  </div>
                  <Link
                    className="text-sm font-semibold text-brand-600"
                    href={`/admin/histoire/fondateurs/${founder.id}/edit`}
                  >
                    Modifier
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">
                Presidents ({history.presidents.length})
              </h2>
              <Link
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-600 ring-1 ring-[#e3ded3] transition hover:bg-brand-50"
                href="/admin/histoire/presidents/new"
              >
                Ajouter
              </Link>
            </div>
            <div className="space-y-3">
              {history.presidents.map((president) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-[#ece7dd] bg-[#faf7f1] px-4 py-4"
                  key={president.id}
                >
                  <div>
                    <p className="font-semibold text-neutral-900">{president.full_name}</p>
                    <p className="text-sm text-neutral-600">
                      {president.year_start}
                      {president.year_end ? ` - ${president.year_end}` : ''}
                      {president.city ? ` • ${president.city}` : ''}
                    </p>
                  </div>
                  <Link
                    className="text-sm font-semibold text-brand-600"
                    href={`/admin/histoire/presidents/${president.id}/edit`}
                  >
                    Modifier
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

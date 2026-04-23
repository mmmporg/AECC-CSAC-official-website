import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  archiveAnnouncement,
  deleteAnnouncement,
  unarchiveAnnouncement
} from '@/app/actions/announcements'
import {
  archiveOpportunity,
  deleteOpportunity,
  unarchiveOpportunity
} from '@/app/actions/opportunities'
import { getAdminDashboardData } from '@/lib/data/admin'
import { getRichTextExcerpt } from '@/lib/rich-text'

export default async function AdminDashboardPage() {
  const t = await getTranslations({ locale: 'fr', namespace: 'admin' })
  const dashboard = await getAdminDashboardData()
  const metrics = [
    {
      label: 'Announcements',
      value: dashboard.activeAnnouncements,
      hint: '+12% ce mois',
      tone: 'bg-brand-50 text-brand-700'
    },
    {
      label: 'Opportunities',
      value: dashboard.activeOpportunities,
      hint: '+3 cette semaine',
      tone: 'bg-accent-50 text-accent-400'
    },
    {
      label: 'Founders',
      value: dashboard.recentAnnouncements.length,
      hint: 'Historique complet',
      tone: 'bg-[#f8efef] text-[#a6554d]'
    },
    {
      label: 'Presidents',
      value: dashboard.recentOpportunities.length,
      hint: 'Mandats enregistres',
      tone: 'bg-brand-50 text-brand-700'
    }
  ]

  return (
    <AdminLayout title={t('dashboard')}>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-brand-700 md:text-5xl">
              Tableau de Bord
            </h1>
            <p className="mt-2 text-lg text-neutral-600">Vue d&apos;ensemble et gestion rapide.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              href="/admin/annonces/new"
            >
              {t('nouvelle_annonce')}
            </Link>
            <Link
              className="rounded-xl bg-[#e9e4da] px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-[#ddd7cc]"
              href="/admin/opportunites/new"
            >
              {t('nouvelle_opportunite')}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article className="admin-card relative overflow-hidden p-6" key={metric.label}>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-black/[0.03] blur-2xl" />
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-neutral-600">
                {metric.label}
              </p>
              <p className="mt-4 text-5xl font-black tracking-tight text-neutral-900">
                {metric.value}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${metric.tone}`}
              >
                {metric.hint}
              </span>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#ece7dd] bg-white px-6 py-5">
              <h2 className="text-2xl font-bold text-neutral-900">{t('recent_announcements')}</h2>
              <Link className="text-sm font-semibold text-brand-600" href="/admin/annonces">
                Voir tout
              </Link>
            </div>
            <div className="space-y-1 bg-white px-6 py-4">
              {dashboard.recentAnnouncements.map((announcement, index) => (
                <div className="flex gap-4 py-4" key={announcement.id}>
                  <div
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0
                        ? 'bg-accent-50 text-accent-400'
                        : index === 1
                          ? 'bg-brand-50 text-brand-700'
                          : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-neutral-900">{announcement.title_fr}</p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600">
                          {getRichTextExcerpt(announcement.description_fr)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                            href={`/admin/annonces/${announcement.id}/edit`}
                          >
                            {t('modifier')}
                          </Link>
                          {announcement.is_active ? (
                            <form action={archiveAnnouncement.bind(null, announcement.id)}>
                              <button
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-accent-400 transition hover:bg-accent-50"
                                type="submit"
                              >
                                {t('archiver')}
                              </button>
                            </form>
                          ) : (
                            <form action={unarchiveAnnouncement.bind(null, announcement.id)}>
                              <button
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                                type="submit"
                              >
                                {t('desarchiver')}
                              </button>
                            </form>
                          )}
                          <form action={deleteAnnouncement.bind(null, announcement.id)}>
                            <button
                              className="rounded-lg px-3 py-2 text-xs font-semibold text-error transition hover:bg-red-50"
                              type="submit"
                            >
                              {t('supprimer')}
                            </button>
                          </form>
                        </div>
                      </div>
                      <span className="rounded-md bg-[#f0ece4] px-2 py-1 text-xs font-medium text-neutral-600">
                        {announcement.city}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#ece7dd] bg-white px-6 py-5">
              <h2 className="text-2xl font-bold text-neutral-900">{t('recent_opportunities')}</h2>
              <Link className="text-sm font-semibold text-brand-600" href="/admin/opportunites">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4 bg-white px-6 py-5">
              {dashboard.recentOpportunities.map((opportunity) => (
                <div className="rounded-2xl border border-[#ece7dd] bg-[#f7f3eb] p-5" key={opportunity.id}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
                      {opportunity.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-medium text-neutral-600">
                      {opportunity.deadline ? `Exp: ${new Date(opportunity.deadline).toLocaleDateString('fr-FR')}` : 'Sans limite'}
                    </span>
                  </div>
                  <p className="mt-3 text-xl font-bold text-neutral-900">{opportunity.title_fr}</p>
                  <p className="mt-1 text-sm text-neutral-600">{opportunity.organization}</p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {getRichTextExcerpt(opportunity.description_fr)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                      href={`/admin/opportunites/${opportunity.id}/edit`}
                    >
                      {t('modifier')}
                    </Link>
                    {opportunity.is_active ? (
                      <form action={archiveOpportunity.bind(null, opportunity.id)}>
                        <button
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-accent-400 transition hover:bg-accent-50"
                          type="submit"
                        >
                          {t('archiver')}
                        </button>
                      </form>
                    ) : (
                      <form action={unarchiveOpportunity.bind(null, opportunity.id)}>
                        <button
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                          type="submit"
                        >
                          {t('desarchiver')}
                        </button>
                      </form>
                    )}
                    <form action={deleteOpportunity.bind(null, opportunity.id)}>
                      <button
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-error transition hover:bg-red-50"
                        type="submit"
                      >
                        {t('supprimer')}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

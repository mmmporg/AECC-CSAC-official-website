import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function AdminUnauthorizedPage() {
  return (
    <AdminLayout title="Acces refuse">
      <div className="mx-auto max-w-3xl">
        <div className="admin-card overflow-hidden">
          <div className="bg-[#f7efe3] px-8 py-10">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8c5a0a]">
              Autorisation requise
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
              Vous n&apos;avez pas acces a cette section.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600">
              Votre compte est bien authentifie, mais il ne possede pas le role admin
              necessaire pour consulter cette page.
            </p>
          </div>

          <div className="space-y-6 bg-white px-8 py-8">
            <div className="rounded-2xl border border-[#ece7dd] bg-[#faf7f1] p-5 text-sm leading-7 text-neutral-600">
              Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, verifiez le metadata role de
              votre utilisateur dans Supabase Auth ou reconnectez-vous avec un compte admin.
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                href="/admin/login"
              >
                Retour a la connexion
              </Link>
              <Link
                className="rounded-xl border border-[#e3ded3] bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                href="/fr"
              >
                Retour au site public
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

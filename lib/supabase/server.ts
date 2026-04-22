import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export type AdminRole = 'admin' | 'super_admin'

type AdminUserMetadata = User['user_metadata'] & {
  role?: string
}

type AdminAppMetadata = User['app_metadata'] & {
  role?: string
}

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            return
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            return
          }
        }
      }
    }
  )
}

export function resolveUserRole(user: Pick<User, 'user_metadata' | 'app_metadata'>): AdminRole | null {
  const userMetadata = (user.user_metadata ?? {}) as AdminUserMetadata
  const appMetadata = (user.app_metadata ?? {}) as AdminAppMetadata
  const role = userMetadata.role ?? appMetadata.role ?? null

  return role === 'admin' || role === 'super_admin' ? role : null
}

function hasRequiredRole(user: User, allowedRoles: AdminRole[]) {
  const role = resolveUserRole(user)
  return role ? allowedRoles.includes(role) : false
}

async function requireUserWithRole(allowedRoles: AdminRole[]) {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  if (!hasRequiredRole(user, allowedRoles)) {
    redirect('/admin/unauthorized')
  }

  return user
}

export async function requireAdminUser() {
  return requireUserWithRole(['admin', 'super_admin'])
}

export async function requireSuperAdminUser() {
  return requireUserWithRole(['super_admin'])
}

export async function getCurrentAdminRole() {
  const user = await requireAdminUser()
  return resolveUserRole(user)
}

export const getAdminUser = requireAdminUser

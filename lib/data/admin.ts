import {
  createClient,
  requireAdminUser,
  requireSuperAdminUser,
  resolveUserRole,
  type AdminRole
} from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type {
  Announcement,
  Founder,
  GalleryPhoto,
  Member,
  Opportunity,
  President,
  TimelineEvent
} from '@/lib/supabase/types'

export interface AdminAccount {
  id: string
  email: string
  role: AdminRole
  createdAt: string | null
  lastSignInAt: string | null
  isDisabled: boolean
}

export async function getAdminDashboardData() {
  await requireAdminUser()
  const supabase = createClient()

  const [
    announcementStats,
    opportunityStats,
    recentAnnouncements,
    recentOpportunities
  ] = await Promise.all([
    supabase
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return {
    activeAnnouncements: announcementStats.count ?? 0,
    activeOpportunities: opportunityStats.count ?? 0,
    recentAnnouncements: (recentAnnouncements.data ?? []) as Announcement[],
    recentOpportunities: (recentOpportunities.data ?? []) as Opportunity[]
  }
}

export async function getAdminAnnouncements() {
  await requireAdminUser()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as Announcement[]
}

export async function getAdminAnnouncement(id: string) {
  await requireAdminUser()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Announcement
}

export async function getAdminOpportunities() {
  await requireAdminUser()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as Opportunity[]
}

export async function getAdminOpportunity(id: string) {
  await requireAdminUser()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Opportunity
}

export async function getAdminHistoryData() {
  await requireAdminUser()
  const supabase = createClient()

  const [timeline, founders, presidents] = await Promise.all([
    supabase
      .from('timeline_events')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase.from('founders').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('presidents')
      .select('*')
      .order('sort_order', { ascending: true })
  ])

  return {
    timeline: (timeline.data ?? []) as TimelineEvent[],
    founders: (founders.data ?? []) as Founder[],
    presidents: (presidents.data ?? []) as President[]
  }
}

export async function getAdminMembers() {
  await requireAdminUser()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as Member[]
}

export async function getAdminGalleryPhotos() {
  await requireAdminUser()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true })

  if (error) return []
  return (data ?? []) as GalleryPhoto[]
}

export async function getAdminAccounts() {
  await requireSuperAdminUser()
  const supabase = createAdminClient()
  const accounts: AdminAccount[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    })

    if (error) {
      throw new Error(error.message)
    }

    const users = data.users ?? []

    accounts.push(
      ...users.flatMap((user) => {
        const role = resolveUserRole(user)

        if (!role) {
          return []
        }

        return [
          {
            createdAt: user.created_at ?? null,
            email: user.email ?? 'Unknown email',
            id: user.id,
            isDisabled: Boolean(user.banned_until && new Date(user.banned_until).getTime() > Date.now()),
            lastSignInAt: user.last_sign_in_at ?? null,
            role
          }
        ]
      })
    )

    if (users.length < perPage) {
      break
    }

    page += 1
  }

  return accounts.sort((left, right) => {
    if (left.role !== right.role) {
      return left.role === 'super_admin' ? -1 : 1
    }

    return (right.createdAt ?? '').localeCompare(left.createdAt ?? '')
  })
}

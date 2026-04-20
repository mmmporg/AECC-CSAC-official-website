import { createClient, requireAdminUser } from '@/lib/supabase/server'
import type {
  Announcement,
  Founder,
  Opportunity,
  President,
  TimelineEvent
} from '@/lib/supabase/types'

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

  if (error) throw new Error(error.message)
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

  if (error) throw new Error(error.message)
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

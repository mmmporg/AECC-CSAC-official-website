import { createClient } from '@/lib/supabase/server'
import type {
  Announcement,
  AnnouncementCategory,
  Founder,
  Opportunity,
  OpportunityCategory,
  PaginatedResult,
  President,
  TimelineEvent
} from '@/lib/supabase/types'

interface AnnouncementFilters {
  category?: AnnouncementCategory
  city?: string
  page?: number
  pageSize?: number
}

interface OpportunityFilters {
  category?: OpportunityCategory
  page?: number
  pageSize?: number
}

export async function getLatestAnnouncements(limit = 3) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as Announcement[]
}

export async function getLatestOpportunities(limit = 2) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as Opportunity[]
}

export async function getFounders() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('founders')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Founder[]
}

export async function getPresidents() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('presidents')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as President[]
}

export async function getTimelineEvents() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as TimelineEvent[]
}

export async function getAnnouncements(
  filters: AnnouncementFilters
): Promise<PaginatedResult<Announcement>> {
  const supabase = createClient()
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 12
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('announcements')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    items: (data ?? []) as Announcement[],
    total: count ?? 0,
    page,
    pageSize
  }
}

export async function getAnnouncementById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    return null
  }

  return data as Announcement
}

export async function getSimilarAnnouncements(
  id: string,
  category: AnnouncementCategory
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return (data ?? []) as Announcement[]
}

export async function getOpportunities(
  filters: OpportunityFilters
): Promise<PaginatedResult<Opportunity>> {
  const supabase = createClient()
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 12
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('opportunities')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    items: (data ?? []) as Opportunity[],
    total: count ?? 0,
    page,
    pageSize
  }
}

export async function getOpportunityById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    return null
  }

  return data as Opportunity
}

export async function getSimilarOpportunities(
  id: string,
  category: OpportunityCategory
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return (data ?? []) as Opportunity[]
}

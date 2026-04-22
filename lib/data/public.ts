import { createClient } from '@/lib/supabase/server'

export interface GalerieImage {
  id: string;
  annuaire_id: string | null;
  storage_path: string;
  title: string | null;
  description: string | null;
  uploaded_at: string;
  created_by: string | null;
}

import type {
  Announcement,
  AnnouncementCategory,
  Founder,
  Opportunity,
  OpportunityCategory,
  PaginatedResult,
  President,
  TimelineEvent,
  GalleryPhoto
} from '@/lib/supabase/types'
import { getDateRangeForDay } from '@/lib/utils'

interface AnnouncementFilters {
  category?: AnnouncementCategory
  city?: string
  date?: string
  page?: number
  pageSize?: number
}

interface OpportunityFilters {
  category?: OpportunityCategory
  domain?: string
  deadline?: string
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

  if (error) return []
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

  if (error) return []
  return (data ?? []) as Opportunity[]
}

export async function getFounders() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('founders')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return []
  return (data ?? []) as Founder[]
}

export async function getPresidents() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('presidents')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return []
  return (data ?? []) as President[]
}

export async function getTimelineEvents() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return []
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

  if (filters.date) {
    const range = getDateRangeForDay(filters.date)

    if (range) {
      query = query.gte('created_at', range.start).lte('created_at', range.end)
    }
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { items: [], total: 0, page, pageSize }

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

  if (error) return []
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

  if (filters.domain) {
    const search = filters.domain.trim()

    if (search) {
      query = query.or(
        `organization.ilike.%${search}%,title_fr.ilike.%${search}%,title_en.ilike.%${search}%,description_fr.ilike.%${search}%,description_en.ilike.%${search}%`
      )
    }
  }

  if (filters.deadline) {
    const range = getDateRangeForDay(filters.deadline)

    if (range) {
      query = query.lte('deadline', range.end)
    }
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { items: [], total: 0, page, pageSize }

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

  if (error) return []
  return (data ?? []) as Opportunity[]
}

export async function getGalleryPhotos(page: number = 1, pageSize: number = 12) {
  const supabase = createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact' })
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true })
    .range(from, to)

  if (error) return { items: [], total: 0, page, pageSize }
  return { items: (data ?? []) as GalleryPhoto[], total: count ?? 0, page, pageSize }
}

export async function getGalerieImages() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('galerie_images')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .order('sort_order', { ascending: true })

  if (error) return []
  return (data ?? []) as GalerieImage[]
}

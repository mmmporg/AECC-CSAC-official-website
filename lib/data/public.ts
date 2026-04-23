import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

async function timed<T>(name: string, fn: () => Promise<T>): Promise<T> {
  if (process.env.NODE_ENV !== 'development') return fn()
  const t0 = performance.now()
  const result = await fn()
  console.log(`[db] ${name} ${(performance.now() - t0).toFixed(1)}ms`)
  return result
}

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
  return timed('getLatestAnnouncements', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) return []
    return (data ?? []) as Announcement[]
  })
}

export async function getLatestOpportunities(limit = 2) {
  return timed('getLatestOpportunities', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) return []
    return (data ?? []) as Opportunity[]
  })
}

export const getFounders = cache(async () => {
  return timed('getFounders', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return []
    return (data ?? []) as Founder[]
  })
})

export const getPresidents = cache(async () => {
  return timed('getPresidents', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('presidents')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return []
    return (data ?? []) as President[]
  })
})

export const getTimelineEvents = cache(async () => {
  return timed('getTimelineEvents', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return []
    return (data ?? []) as TimelineEvent[]
  })
})

export async function getAnnouncements(
  filters: AnnouncementFilters
): Promise<PaginatedResult<Announcement>> {
  return timed('getAnnouncements', async () => {
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
  })
}

export async function getAnnouncementById(id: string) {
  return timed('getAnnouncementById', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) return null
    return data as Announcement
  })
}

export async function getSimilarAnnouncements(
  id: string,
  category: AnnouncementCategory
) {
  return timed('getSimilarAnnouncements', async () => {
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
  })
}

export async function getOpportunities(
  filters: OpportunityFilters
): Promise<PaginatedResult<Opportunity>> {
  return timed('getOpportunities', async () => {
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
  })
}

export async function getOpportunityById(id: string) {
  return timed('getOpportunityById', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) return null
    return data as Opportunity
  })
}

export async function getSimilarOpportunities(
  id: string,
  category: OpportunityCategory
) {
  return timed('getSimilarOpportunities', async () => {
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
  })
}

export async function getGalleryPhotos(page: number = 1, pageSize: number = 12) {
  return timed('getGalleryPhotos', async () => {
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
  })
}

export async function getGalerieImages() {
  return timed('getGalerieImages', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('galerie_images')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .order('sort_order', { ascending: true })

    if (error) return []
    return (data ?? []) as GalerieImage[]
  })
}

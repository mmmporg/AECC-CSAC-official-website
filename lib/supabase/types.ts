export type AnnouncementCategory = 'logement' | 'vente' | 'entraide' | 'evenement'
export type OpportunityCategory =
  | 'bourse'
  | 'stage_emploi'
  | 'candidature'
  | 'formation'

export interface Announcement {
  id: string
  title_fr: string
  title_en: string | null
  description_fr: string
  description_en: string | null
  category: AnnouncementCategory
  city: string
  contact: string
  is_active: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: string
  title_fr: string
  title_en: string | null
  description_fr: string
  description_en: string | null
  category: OpportunityCategory
  organization: string
  external_link: string | null
  deadline: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  period: string
  title_fr: string
  title_en: string | null
  description_fr: string
  description_en: string | null
  color: string
  sort_order: number
}

export interface Founder {
  id: string
  full_name: string
  role_fr: string | null
  role_en: string | null
  image_url: string | null
  in_memoriam: boolean
  sort_order: number
}

export interface President {
  id: string
  full_name: string
  year_start: number
  year_end: number | null
  city: string | null
  image_url: string | null
  sort_order: number
}

export interface Member {
  id: string
  first_name: string
  last_name: string
  city: string
  university: string
  degree: string
  entry_year: number | null
  graduation_year: number | null
  linkedin_url: string | null
  bio: string | null
  is_active: boolean
  created_at: string
}

export interface GalleryPhoto {
  id: string
  title_fr: string | null
  title_en: string | null
  image_url: string
  year: number
  event_name: string | null
  sort_order: number
  created_at: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

import type { AnnouncementCategory, OpportunityCategory } from '@/lib/supabase/types'

export const announcementCategories: AnnouncementCategory[] = [
  'logement',
  'vente',
  'entraide',
  'evenement'
]

export const opportunityCategories: OpportunityCategory[] = [
  'bourse',
  'stage_emploi',
  'candidature',
  'formation'
]

export const cityOptions = [
  'Beijing',
  'Shanghai',
  'Guangzhou',
  'Wuhan',
  'Nanjing',
  'Hangzhou',
  'Shenzhen'
]

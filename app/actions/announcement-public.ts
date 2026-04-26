'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { announcementCategories } from '@/lib/options'

interface ActionResult {
  success: boolean
  error?: string
}

function readField(formData: FormData, key: string, required = true) {
  const value = formData.get(key)

  if (typeof value !== 'string') {
    if (required) {
      throw new Error(`Missing field: ${key}`)
    }

    return null
  }

  const trimmed = value.trim()

  if (!trimmed && required) {
    throw new Error(`Missing field: ${key}`)
  }

  return trimmed || null
}

export async function submitPublicAnnouncement(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = createAdminClient()
    const category = readField(formData, 'category')

    if (!announcementCategories.includes(category as (typeof announcementCategories)[number])) {
      throw new Error('Invalid category')
    }

    const payload = {
      title_fr: readField(formData, 'title_fr'),
      title_en: '',
      description_fr: readField(formData, 'description_fr'),
      description_en: '',
      category,
      city: readField(formData, 'city'),
      contact: readField(formData, 'contact'),
      expires_at: null,
      is_active: false,
      created_by: null
    }

    const { error } = await supabase.from('announcements').insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/annonces')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

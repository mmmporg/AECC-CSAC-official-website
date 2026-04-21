'use server'

import { revalidatePath } from 'next/cache'
import { createClient, requireAdminUser } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
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

function parsePayload(formData: FormData) {
  const category = readField(formData, 'category')
  if (!announcementCategories.includes(category as (typeof announcementCategories)[number])) {
    throw new Error('Invalid category')
  }

  return {
    title_fr: readField(formData, 'title_fr'),
    title_en: readField(formData, 'title_en', false),
    description_fr: readField(formData, 'description_fr'),
    description_en: readField(formData, 'description_en', false),
    category,
    city: readField(formData, 'city'),
    contact: readField(formData, 'contact'),
    expires_at: readField(formData, 'expires_at', false),
    is_active: readField(formData, 'is_active', false) === 'true'
  }
}

function revalidateAnnouncementPaths() {
  revalidatePath('/admin/annonces')
  revalidatePath('/fr/annonces')
  revalidatePath('/en/annonces')
  revalidatePath('/fr')
  revalidatePath('/en')
}

export async function createAnnouncement(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const user = await requireAdminUser()
    const payload = parsePayload(formData)
    const { error } = await supabase.from('announcements').insert({
      ...payload,
      created_by: user.id
    })

    if (error) throw new Error(error.message)
    revalidateAnnouncementPaths()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

export async function updateAnnouncement(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = createClient()
    await requireAdminUser()
    const payload = parsePayload(formData)
    const { error } = await supabase
      .from('announcements')
      .update(payload)
      .eq('id', id)

    if (error) throw new Error(error.message)
    revalidateAnnouncementPaths()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

export async function archiveAnnouncement(id: string) {
  const supabase = createClient()
  await requireAdminUser()
  const { error } = await supabase
    .from('announcements')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidateAnnouncementPaths()
}

export async function deleteAnnouncement(id: string) {
  const supabase = createClient()
  await requireAdminUser()
  const { error } = await supabase.from('announcements').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidateAnnouncementPaths()
}

export async function submitPublicAnnouncement(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Parse public payload (only French, no expiry, defaults)
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
      is_active: false, // Strict public enforcement
      created_by: null
    }

    const { error } = await supabase.from('announcements').insert(payload)

    if (error) throw new Error(error.message)
    // Ne pas revalider les chemins publics immédiatement pour empêcher un rechargement inutile
    // vu que l'annonce n'est pas active, mais on revalide admin au cas où.
    revalidatePath('/admin/annonces')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

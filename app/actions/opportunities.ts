'use server'

import { revalidatePath } from 'next/cache'
import { opportunityCategories } from '@/lib/options'
import { createClient, requireAdminUser } from '@/lib/supabase/server'

interface ActionResult {
  success: boolean
  error?: string
}

function readField(formData: FormData, key: string, required = true) {
  const value = formData.get(key)

  if (typeof value !== 'string') {
    if (required) throw new Error(`Missing field: ${key}`)
    return null
  }

  const trimmed = value.trim()
  if (!trimmed && required) throw new Error(`Missing field: ${key}`)
  return trimmed || null
}

function parsePayload(formData: FormData) {
  const category = readField(formData, 'category')
  if (!opportunityCategories.includes(category as (typeof opportunityCategories)[number])) {
    throw new Error('Invalid category')
  }

  return {
    title_fr: readField(formData, 'title_fr'),
    title_en: readField(formData, 'title_en', false),
    description_fr: readField(formData, 'description_fr'),
    description_en: readField(formData, 'description_en', false),
    category,
    organization: readField(formData, 'organization'),
    external_link: readField(formData, 'external_link', false),
    deadline: readField(formData, 'deadline', false),
    is_active: readField(formData, 'is_active', false) === 'true'
  }
}

function revalidateOpportunityPaths() {
  revalidatePath('/admin/opportunites')
  revalidatePath('/fr/opportunites')
  revalidatePath('/en/opportunites')
}

export async function createOpportunity(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const user = await requireAdminUser()
    const payload = parsePayload(formData)
    const { error } = await supabase.from('opportunities').insert({
      ...payload,
      created_by: user.id
    })

    if (error) throw new Error(error.message)
    revalidateOpportunityPaths()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

export async function updateOpportunity(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = createClient()
    await requireAdminUser()
    const payload = parsePayload(formData)
    const { error } = await supabase
      .from('opportunities')
      .update(payload)
      .eq('id', id)

    if (error) throw new Error(error.message)
    revalidateOpportunityPaths()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

export async function archiveOpportunity(id: string) {
  const supabase = createClient()
  await requireAdminUser()
  const { error } = await supabase
    .from('opportunities')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidateOpportunityPaths()
}

export async function unarchiveOpportunity(id: string) {
  const supabase = createClient()
  await requireAdminUser()
  const { error } = await supabase
    .from('opportunities')
    .update({ is_active: true })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidateOpportunityPaths()
}

export async function deleteOpportunity(id: string) {
  const supabase = createClient()
  await requireAdminUser()
  const { error } = await supabase.from('opportunities').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidateOpportunityPaths()
}

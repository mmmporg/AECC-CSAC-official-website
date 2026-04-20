'use server'

import { revalidatePath } from 'next/cache'
import { createClient, requireAdminUser } from '@/lib/supabase/server'

interface ActionResult {
  success: boolean
  error?: string
}

function revalidateHistoryPaths() {
  revalidatePath('/admin/histoire')
  revalidatePath('/fr/histoire')
  revalidatePath('/en/histoire')
  revalidatePath('/fr')
  revalidatePath('/en')
}

// ─── TIMELINE EVENTS ────────────────────────────────────────────────────────

export async function createTimelineEvent(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('timeline_events').insert({
      period: (formData.get('period') as string).trim(),
      title_fr: (formData.get('title_fr') as string).trim(),
      title_en: ((formData.get('title_en') as string) || '').trim() || null,
      description_fr: (formData.get('description_fr') as string).trim(),
      description_en: ((formData.get('description_en') as string) || '').trim() || null,
      color: (formData.get('color') as string) || 'green',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    })

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function updateTimelineEvent(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('timeline_events').update({
      period: (formData.get('period') as string).trim(),
      title_fr: (formData.get('title_fr') as string).trim(),
      title_en: ((formData.get('title_en') as string) || '').trim() || null,
      description_fr: (formData.get('description_fr') as string).trim(),
      description_en: ((formData.get('description_en') as string) || '').trim() || null,
      color: (formData.get('color') as string) || 'green',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    }).eq('id', id)

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function deleteTimelineEvent(id: string): Promise<void> {
  await requireAdminUser()
  const supabase = createClient()
  const { error } = await supabase.from('timeline_events').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateHistoryPaths()
}

// ─── FOUNDERS ───────────────────────────────────────────────────────────────

export async function createFounder(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('founders').insert({
      full_name: (formData.get('full_name') as string).trim(),
      role_fr: ((formData.get('role_fr') as string) || '').trim() || null,
      role_en: ((formData.get('role_en') as string) || '').trim() || null,
      in_memoriam: formData.get('in_memoriam') === 'true',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    })

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function updateFounder(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('founders').update({
      full_name: (formData.get('full_name') as string).trim(),
      role_fr: ((formData.get('role_fr') as string) || '').trim() || null,
      role_en: ((formData.get('role_en') as string) || '').trim() || null,
      in_memoriam: formData.get('in_memoriam') === 'true',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    }).eq('id', id)

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function deleteFounder(id: string): Promise<void> {
  await requireAdminUser()
  const supabase = createClient()
  const { error } = await supabase.from('founders').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateHistoryPaths()
}

// ─── PRESIDENTS ─────────────────────────────────────────────────────────────

export async function createPresident(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('presidents').insert({
      full_name: (formData.get('full_name') as string).trim(),
      year_start: parseInt(formData.get('year_start') as string, 10),
      year_end: formData.get('year_end') ? parseInt(formData.get('year_end') as string, 10) : null,
      city: ((formData.get('city') as string) || '').trim() || null,
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    })

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function updatePresident(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('presidents').update({
      full_name: (formData.get('full_name') as string).trim(),
      year_start: parseInt(formData.get('year_start') as string, 10),
      year_end: formData.get('year_end') ? parseInt(formData.get('year_end') as string, 10) : null,
      city: ((formData.get('city') as string) || '').trim() || null,
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    }).eq('id', id)

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function deletePresident(id: string): Promise<void> {
  await requireAdminUser()
  const supabase = createClient()
  const { error } = await supabase.from('presidents').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateHistoryPaths()
}

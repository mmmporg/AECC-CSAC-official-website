'use server'

import { createClient, requireAdminUser } from '@/lib/supabase/server'

interface UploadActionResult {
  success: boolean
  error?: string
  url?: string
}

export async function uploadAnnouncementEditorImage(
  formData: FormData
): Promise<UploadActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()
    const file = formData.get('image')

    if (!(file instanceof File) || file.size === 0) {
      throw new Error('Image requise')
    }

    const extension = file.name.split('.').pop() ?? 'bin'
    const fileName = `editor_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${extension}`
    const filePath = `editor/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('announcements')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage.from('announcements').getPublicUrl(filePath)

    if (!data.publicUrl) {
      throw new Error('Impossible de recuperer l URL publique')
    }

    return {
      success: true,
      url: data.publicUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

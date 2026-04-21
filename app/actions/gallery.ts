'use server'

import { revalidatePath } from 'next/cache'
import { createClient, requireAdminUser } from '@/lib/supabase/server'

interface ActionResult {
  success: boolean
  error?: string
}

export async function uploadGalleryPhoto(formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireAdminUser()
    const supabase = createClient()

    const file = formData.get('image') as File
    if (!file || file.size === 0) {
      throw new Error('Image requise')
    }

    const title_fr = formData.get('title_fr') as string || null
    const yearStr = formData.get('year') as string
    const event_name = formData.get('event_name') as string || null

    if (!yearStr) {
      throw new Error('Année requise')
    }
    const year = parseInt(yearStr, 10)

    // 1. Upload the image to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${year}/${fileName}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('gallery')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // 2. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    if (!publicUrlData) {
      throw new Error('Could not generate public URL')
    }

    // 3. Create database record
    const { error: dbError } = await supabase
      .from('gallery_photos')
      .insert({
        title_fr,
        title_en: null,
        image_url: publicUrlData.publicUrl,
        year,
        event_name,
        created_by: user.id
      })

    if (dbError) {
      // Optional: rollback storage upload
      await supabase.storage.from('gallery').remove([filePath])
      throw new Error(`Database error: ${dbError.message}`)
    }

    revalidatePath('/admin/galerie')
    revalidatePath('/fr/galerie')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

export async function deleteGalleryPhoto(id: string, imageUrl: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    // Extract file path from public URL
    const bucketUrlPart = '/storage/v1/object/public/gallery/'
    const pathIndex = imageUrl.indexOf(bucketUrlPart)
    
    if (pathIndex !== -1) {
      const filePath = imageUrl.substring(pathIndex + bucketUrlPart.length)
      // Delete from storage
      const { error: storageError } = await supabase.storage.from('gallery').remove([filePath])
      if (storageError) {
          console.error('Failed to delete from storage', storageError)
      }
    }

    // Delete from DB
    const { error: dbError } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    revalidatePath('/admin/galerie')
    revalidatePath('/fr/galerie')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

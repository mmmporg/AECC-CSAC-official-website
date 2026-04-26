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
    const files = formData
      .getAll('images')
      .filter((value): value is File => value instanceof File && value.size > 0)

    const fallbackFile = formData.get('image')
    if (!files.length && fallbackFile instanceof File && fallbackFile.size > 0) {
      files.push(fallbackFile)
    }

    if (!files.length) {
      throw new Error('Image requise')
    }

    const title_fr = (formData.get('title_fr') as string) || null
    const title_en = (formData.get('title_en') as string) || null
    const description_fr = (formData.get('description_fr') as string) || null
    const description_en = (formData.get('description_en') as string) || null
    const yearStr = formData.get('year') as string
    const event_name = (formData.get('event_name') as string) || null

    if (!yearStr) {
      throw new Error('Annee requise')
    }

    const year = parseInt(yearStr, 10)
    const uploadedPaths: string[] = []
    const insertedIds: string[] = []
    let sortOrderStart = 0

    if (event_name) {
      const { data: existingPhotos, error: existingPhotosError } = await supabase
        .from('gallery_photos')
        .select('sort_order')
        .eq('year', year)
        .eq('event_name', event_name)
        .order('sort_order', { ascending: false })
        .limit(1)

      if (existingPhotosError) {
        throw new Error(`Database error: ${existingPhotosError.message}`)
      }

      sortOrderStart = (existingPhotos?.[0]?.sort_order ?? -1) + 1
    }

    for (const [index, file] of files.entries()) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_${index}.${fileExt}`
      const filePath = `${year}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) {
        if (uploadedPaths.length) {
          await supabase.storage.from('gallery').remove(uploadedPaths)
        }

        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      uploadedPaths.push(filePath)

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)

      if (!publicUrlData?.publicUrl) {
        await supabase.storage.from('gallery').remove(uploadedPaths)
        throw new Error('Could not generate public URL')
      }

      const { data: insertedPhoto, error: dbError } = await supabase
        .from('gallery_photos')
        .insert({
          title_fr,
          title_en,
          description_fr,
          description_en,
          image_url: publicUrlData.publicUrl,
          year,
          event_name,
          sort_order: sortOrderStart + index,
          created_by: user.id
        })
        .select('id')
        .single()

      if (dbError) {
        if (insertedIds.length) {
          await supabase.from('gallery_photos').delete().in('id', insertedIds)
        }

        await supabase.storage.from('gallery').remove(uploadedPaths)
        throw new Error(`Database error: ${dbError.message}`)
      }

      insertedIds.push(insertedPhoto.id)
    }

    revalidatePath('/admin/galerie')
    revalidatePath('/fr/galerie')
    revalidatePath('/en/galerie')
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
    const bucketUrlPart = '/storage/v1/object/public/gallery/'
    const pathIndex = imageUrl.indexOf(bucketUrlPart)

    if (pathIndex !== -1) {
      const filePath = imageUrl.substring(pathIndex + bucketUrlPart.length)
      const { error: storageError } = await supabase.storage.from('gallery').remove([filePath])

      if (storageError) {
        console.error('Failed to delete from storage', storageError)
      }
    }

    const { error: dbError } = await supabase.from('gallery_photos').delete().eq('id', id)

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    revalidatePath('/admin/galerie')
    revalidatePath('/fr/galerie')
    revalidatePath('/en/galerie')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error'
    }
  }
}

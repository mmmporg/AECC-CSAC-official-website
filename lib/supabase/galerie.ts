import { supabase } from '@/lib/supabase/client'

export interface GalerieEntry {
  id: string
  storage_path: string
  title: string | null
  description: string | null
  uploaded_at: string
  uploaded_by: string | null
}

export async function uploadImage(
  file: File,
  title?: string,
  description?: string
): Promise<GalerieEntry | null> {
  const ext = file.name.split('.').pop()
  const filename = `${crypto.randomUUID()}.${ext ?? 'bin'}`
  const storagePath = `galerie_images/${filename}`

  const { error: uploadError } = await supabase.storage
    .from('galerie_images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Supabase storage upload error:', uploadError)
    return null
  }

  const { data: userData } = await supabase.auth.getUser()

  const { data, error: insertError } = await supabase
    .from('galerie')
    .insert({
      storage_path: storagePath,
      title: title?.trim() || null,
      description: description?.trim() || null,
      uploaded_by: userData.user?.id ?? null
    })
    .select('*')
    .single()

  if (insertError) {
    await supabase.storage.from('galerie_images').remove([filename])
    console.error('Supabase DB insert error:', insertError)
    return null
  }

  return data as GalerieEntry
}

export async function getGallery(): Promise<GalerieEntry[]> {
  const { data, error } = await supabase
    .from('galerie')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Supabase getGallery error:', error)
    return []
  }

  return (data ?? []) as GalerieEntry[]
}

export async function deleteImage(id: string): Promise<boolean> {
  const { data: row, error: fetchError } = await supabase
    .from('galerie')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (fetchError || !row) {
    console.error('Supabase fetch for delete error:', fetchError)
    return false
  }

  const bucketFile = row.storage_path.replace(/^galerie_images\//, '')

  const { error: storageError } = await supabase.storage
    .from('galerie_images')
    .remove([bucketFile])

  if (storageError) {
    console.error('Supabase storage delete error:', storageError)
    return false
  }

  const { error: dbError } = await supabase
    .from('galerie')
    .delete()
    .eq('id', id)

  if (dbError) {
    console.error('Supabase DB delete error:', dbError)
    return false
  }

  return true
}

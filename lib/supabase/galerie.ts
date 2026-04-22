import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

export type GalerieEntry = Database['public']['Tables']['galerie']['Row'];

/**
 * Upload an image file to the `galerie_images` bucket and create a record in the `galerie` table.
 * Returns the inserted row on success, or null on failure.
 */
export async function uploadImage(
  file: File,
  title?: string,
  description?: string
): Promise<GalerieEntry | null> {
  // 1️⃣ Generate a unique filename preserving the original extension
  const ext = file.name.split('.').pop();
  const filename = `${crypto.randomUUID()}.${ext ?? 'bin'}`;
  const storagePath = `galerie_images/${filename}`;

  // 2️⃣ Upload the file to storage bucket
  const { error: uploadError } = await supabase.storage
    .from('galerie_images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase storage upload error:', uploadError);
    return null;
  }

  // 3️⃣ Insert metadata into the `galerie` table
  const { data, error: insertError } = await supabase
    .from('galerie')
    .insert({
      storage_path: storagePath,
      title: title ?? null,
      description: description ?? null,
      uploaded_by: supabase.auth.user()?.id,
    })
    .single();

  if (insertError) {
    // Cleanup the uploaded file if DB insert fails to avoid orphaned objects
    await supabase.storage.from('galerie_images').remove([filename]);
    console.error('Supabase DB insert error:', insertError);
    return null;
  }

  return data as GalerieEntry;
}

/** Retrieve all gallery entries ordered by newest first */
export async function getGallery(): Promise<GalerieEntry[]> {
  const { data, error } = await supabase
    .from('galerie')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Supabase getGallery error:', error);
    return [];
  }
  return (data ?? []) as GalerieEntry[];
}

/** Delete a gallery entry – removes both the DB row and the storage object */
export async function deleteImage(id: string): Promise<boolean> {
  // 1️⃣ Fetch the row to obtain the storage path
  const { data: row, error: fetchError } = await supabase
    .from('galerie')
    .select('storage_path')
    .eq('id', id)
    .single();
  if (fetchError || !row) {
    console.error('Supabase fetch for delete error:', fetchError);
    return false;
  }

  const storagePath: string = row.storage_path as string;
  const bucketFile = storagePath.replace(/^galerie_images\//, '');

  // 2️⃣ Remove file from bucket
  const { error: storageError } = await supabase.storage
    .from('galerie_images')
    .remove([bucketFile]);
  if (storageError) {
    console.error('Supabase storage delete error:', storageError);
    return false;
  }

  // 3️⃣ Delete DB row
  const { error: dbError } = await supabase
    .from('galerie')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Supabase DB delete error:', dbError);
    return false;
  }

  return true;
}

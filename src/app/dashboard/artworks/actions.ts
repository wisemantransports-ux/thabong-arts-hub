'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const artworkSchema = z.object({
  artist_id: z.string().uuid(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
  status: z.enum(['draft', 'published']),
});

export async function addArtwork(
  prevState: { message: string, type: 'success' | 'error' | 'idle' },
  formData: FormData
): Promise<{ message: string, type: 'success' | 'error' }> {
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Not authenticated.', type: 'error' };
  }
  
  const validatedFields = artworkSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || 'Invalid data provided.';
    return {
      message: firstError,
      type: 'error',
    };
  }

  const imageFile = formData.get('image') as File;
  if (!imageFile || imageFile.size === 0) {
    return { message: 'Artwork image is required.', type: 'error' };
  }
  
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${validatedFields.data.artist_id}-${Date.now()}.${fileExt}`;
  const filePath = `artwork-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('artworks')
    .upload(filePath, imageFile);

  if (uploadError) {
    return { message: `Storage Error: ${uploadError.message}`, type: 'error' };
  }

  const publicUrl = supabase.storage.from('artworks').getPublicUrl(filePath).data.publicUrl;

  const { error: insertError } = await supabase
    .from('artworks')
    .insert({
      ...validatedFields.data,
      image_url: publicUrl,
    });

  if (insertError) {
    // Attempt to delete the orphaned image file if the DB insert fails
    await supabase.storage.from('artworks').remove([filePath]);
    return { message: `Database Error: ${insertError.message}`, type: 'error' };
  }

  revalidatePath('/dashboard/artworks');
  revalidatePath('/dashboard');
  revalidatePath('/marketplace');
  
  return { message: 'Artwork added successfully!', type: 'success' };
}

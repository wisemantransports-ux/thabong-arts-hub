'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const artworkSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
  category: z.string().min(1, 'Please select a category.'),
  status: z.enum(['available', 'sold', 'reserved']),
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

  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (artistError || !artist) {
    return { message: 'Artist profile not found.', type: 'error' };
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
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
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
      artist_id: artist.id,
      image_url: publicUrl,
    });

  if (insertError) {
    return { message: `Database Error: ${insertError.message}`, type: 'error' };
  }

  revalidatePath('/dashboard/artworks');
  revalidatePath('/dashboard');
  
  return { message: 'Artwork added successfully!', type: 'success' };
}

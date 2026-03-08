'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(8, 'Please enter a valid phone number.').optional().or(z.literal('')),
  bio: z.string().min(20, 'Biography should be at least 20 characters long.').optional().or(z.literal('')),
  slug: z.string().min(3, 'Slug must be at least 3 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
});

export async function updateProfile(
  prevState: { message: string, type: 'success' | 'error' | 'idle' },
  formData: FormData
): Promise<{ message: string, type: 'success' | 'error' }> {
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Not authenticated. Please log in.', type: 'error' };
  }

  const validatedFields = profileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
      const errorMessages = validatedFields.error.flatten().fieldErrors;
      const firstError = Object.values(errorMessages).flat()[0] || 'Invalid data provided.';
    return {
      message: firstError,
      type: 'error',
    };
  }

  const { name, phone, bio, slug } = validatedFields.data;
  let publicUrl: string | undefined = undefined;
  const imageFile = formData.get('profile_image') as File;

  // Handle image upload if a new one is provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}-profile.${fileExt}`;
    const filePath = `artist-profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('artworks') // Note: Using a single bucket for simplicity
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      return { message: `Storage Error: ${uploadError.message}`, type: 'error' };
    }

    publicUrl = supabase.storage.from('artworks').getPublicUrl(filePath).data.publicUrl;
  }
  
  const updateData: { 
    name: string; 
    phone?: string; 
    bio?: string; 
    slug: string; 
    profile_image?: string 
  } = {
    name,
    phone,
    bio,
    slug
  };
  
  if (publicUrl) {
    updateData.profile_image = publicUrl;
  }

  // Update artist profile in the database
  const { error: updateError } = await supabase
    .from('artists')
    .update(updateData)
    .eq('user_id', user.id);

  if (updateError) {
    if (updateError.code === '23505' && updateError.message.includes('artists_slug_key')) {
         return { message: `Database Error: The profile URL slug '${slug}' is already taken. Please choose another.`, type: 'error' };
    }
    return { message: `Database Error: ${updateError.message}`, type: 'error' };
  }
  
  // Revalidate paths to show updated data across the site
  revalidatePath('/dashboard/edit-profile');
  revalidatePath('/dashboard');
  revalidatePath('/artists');
  revalidatePath(`/artist/${slug}`);

  return { message: 'Profile updated successfully!', type: 'success' };
}

'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(8, 'Please enter a valid phone number.'),
  bio: z.string().min(20, 'Biography should be at least 20 characters long.'),
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

  const validatedFields = profileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    bio: formData.get('bio'),
    slug: formData.get('slug'),
  });

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
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // Using upsert: true to replace the image if it already exists.
    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      return { message: `Storage Error: ${uploadError.message}`, type: 'error' };
    }

    publicUrl = supabase.storage.from('artworks').getPublicUrl(filePath).data.publicUrl;
  }
  
  // Prepare data for upsert
  const upsertData: { 
    user_id: string;
    email: string;
    name: string; 
    phone: string; 
    bio: string; 
    slug: string; 
    profile_image?: string 
  } = {
    user_id: user.id, // This is the key for the upsert operation
    email: user.email!,
    name,
    phone,
    bio,
    slug
  };
  
  if (publicUrl) {
    upsertData.profile_image = publicUrl;
  }

  // Use upsert to either create a new profile or update an existing one.
  // Supabase uses the 'user_id' as the conflict target to find the row to update.
  const { error: upsertError } = await supabase
    .from('artists')
    .upsert(upsertData, { onConflict: 'user_id', defaultToNull: false });

  if (upsertError) {
    // Check for unique constraint violation on slug
    if (upsertError.code === '23505' && upsertError.message.includes('artists_slug_key')) {
         return { message: `Database Error: The profile URL slug '${slug}' is already taken. Please choose another.`, type: 'error' };
    }
    return { message: `Database Error: ${upsertError.message}`, type: 'error' };
  }
  
  // Revalidate paths to show updated data
  revalidatePath('/dashboard/edit-profile');
  revalidatePath('/dashboard');
  revalidatePath('/artists');
  revalidatePath(`/artists/${slug}`);

  return { message: 'Profile updated successfully!', type: 'success' };
}

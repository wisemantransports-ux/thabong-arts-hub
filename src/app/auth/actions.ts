'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect(`/login?message=${error.message}`)
  }
  
  revalidatePath('/', 'layout');
  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (signUpError) {
    return redirect(`/signup?message=${signUpError.message}`)
  }

  if (signUpData.user) {
    // Immediately create a profile for the new user.
    // Using upsert is robust: it will create the profile or do nothing if it already exists.
    const { error: profileError } = await supabase
      .from('artists')
      .upsert({ 
        user_id: signUpData.user.id, 
        email: signUpData.user.email || '',
        name: '', // Initially empty, user will be forced to complete it
        slug: signUpData.user.id, // Placeholder slug, user should update
        bio: '', // Initially empty
        profile_image: `https://picsum.photos/seed/${signUpData.user.id}/400/400`, // Placeholder image
        phone: '', // Initially empty
      }, { onConflict: 'user_id' });
      
    if (profileError) {
      // Log the error, but don't block the user. The edit-profile page has its own
      // upsert logic that can recover from this failure.
      console.error('Failed to create artist profile during signup:', profileError);
    }
  } else {
    return redirect(`/signup?message=Could not create user account. Please try again.`);
  }

  // Check if the user object has identities. If not, it means email confirmation is required.
  if (signUpData.user.identities && signUpData.user.identities.length === 0) {
    return redirect('/login?message=Check your email to continue the sign-in process')
  }
  
  // If email confirmation is NOT required, the user is already logged in.
  // Redirect them to complete their profile.
  revalidatePath('/', 'layout');
  return redirect('/dashboard/edit-profile');
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout');
  return redirect('/')
}

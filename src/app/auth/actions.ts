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

  // 1. Create the user in Supabase Auth
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

  if (!signUpData.user) {
    return redirect(`/signup?message=Could not create user account. Please try again.`);
  }

  // 2. Create the corresponding artist profile immediately.
  // This is a critical step to ensure every user has an artist profile.
  // Using `upsert` is robust. The RLS policies we set up will allow this operation.
  const { error: profileError } = await supabase
    .from('artists')
    .upsert({ 
      user_id: signUpData.user.id, 
      email: signUpData.user.email,
      name: '', // Initially empty, user will be prompted to complete it
      slug: signUpData.user.id, // Placeholder slug, user should update
      bio: '',
      profile_image: `https://picsum.photos/seed/${signUpData.user.id}/400/400`,
      phone: '',
      role: 'artist' // Default role
    }, { onConflict: 'user_id' });
    
  if (profileError) {
    // This is a critical failure. We should sign the user out and show an error.
    await supabase.auth.signOut();
    return redirect(`/signup?message=Failed to create artist profile: ${profileError.message}`);
  }

  // Check if email confirmation is required.
  if (signUpData.user.identities && signUpData.user.identities.length === 0) {
    return redirect('/login?message=Check your email to continue the sign-in process')
  }
  
  // If email confirmation is NOT required, the user is already logged in.
  // Redirect them straight to the dashboard.
  revalidatePath('/', 'layout');
  return redirect('/dashboard');
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout');
  return redirect('/')
}

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

  // After successful signup, create a corresponding artist profile.
  if (signUpData.user) {
    const { error: profileError } = await supabase
      .from('artists')
      .insert({ 
        user_id: signUpData.user.id, 
        email: signUpData.user.email || '',
        name: '', // Initially empty, to be filled in by the user
        slug: signUpData.user.id, // Placeholder slug, user should update
        bio: '', // Initially empty
        profile_image: `https://picsum.photos/seed/${signUpData.user.id}/400/400`, // Placeholder image
        phone: '', // Initially empty
      });
      
    if (profileError) {
      // If profile creation fails, we should ideally handle this, maybe by deleting the user
      // or flagging the account. For now, we'll redirect with an error.
      // Note: This could happen if RLS prevents the insert.
      console.error('Failed to create artist profile:', profileError);
      // We can't easily undo the signup, so we'll just log the user out and show an error.
      await supabase.auth.signOut();
      return redirect(`/signup?message=Could not create your artist profile. Please contact support. Error: ${profileError.message}`);
    }
  }

  return redirect('/login?message=Check your email to continue the sign-in process')
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout');
  return redirect('/')
}

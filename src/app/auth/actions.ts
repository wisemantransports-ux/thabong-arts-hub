'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

export async function login(formData: FormData) {
  // If using mock data, simulate a successful login and redirect to dashboard
  if (USE_MOCK_DATA) {
    return redirect('/dashboard')
  }

  const supabase = createClient()
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
  // If using mock data, simulate the email confirmation step
  if (USE_MOCK_DATA) {
    return redirect('/login?message=Check your email to continue the sign-in process');
  }

  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/signup?message=${error.message}`)
  }

  return redirect('/login?message=Check your email to continue the sign-in process')
}

export async function signOut() {
  // If using mock data, just redirect to home
  if (USE_MOCK_DATA) {
    return redirect('/');
  }
  
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/')
}

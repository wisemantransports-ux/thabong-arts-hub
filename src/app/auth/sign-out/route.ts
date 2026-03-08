import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/config'

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })

  if (!isSupabaseConfigured) {
    response.cookies.set('mock_session', '', { maxAge: -1 });
    revalidatePath('/', 'layout')
    return response
  }

  const supabase = createClient()

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  }

  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}

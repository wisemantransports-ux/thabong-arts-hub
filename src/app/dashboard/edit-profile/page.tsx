import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProfileForm from './_components/profile-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { Artist } from '@/lib/types';

export const metadata = {
  title: "Edit Profile | Artist Dashboard",
  description: "Update your artist profile details.",
};

export default async function EditProfilePage() {
  // ✅ Server-side Supabase client
  const supabase = createServerSupabaseClient();

  // ✅ Get session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/login');

  // ✅ Fetch artist associated with logged-in user
  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Could not load your profile. Please try again later.
            <p className="text-xs text-muted-foreground mt-2">{error.message}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!artist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>
            We couldn't find an artist profile associated with your account. 
            If the problem persists, please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // ✅ Render Profile Form with logged-in artist
  return <ProfileForm artist={artist as Artist} />;
}

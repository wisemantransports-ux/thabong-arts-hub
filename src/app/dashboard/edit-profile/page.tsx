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
  const supabase = createServerSupabaseClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/login');

  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  // If there's an error and it's not the "no rows found" error, show an error page.
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

  // If the artist profile doesn't exist yet, we still render the form,
  // but we may pass a null or partial artist object to it.
  // The ProfileForm component should handle this gracefully.
  // A new profile will be created on first submission.
  const artistData = artist || { email: session.user.email };

  return <ProfileForm artist={artistData as Artist} />;
}

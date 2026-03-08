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

  // ✅ Server-side session check
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/login');

  // ✅ Fetch logged-in artist profile using the user's ID
  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  // If there's a major error (not "no rows found"), show an error page.
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

  // If the artist profile doesn't exist yet (new signup), we still render the form
  // with a partial artist object containing the user's email.
  // This allows the ProfileForm to handle the initial profile CREATION.
  const artistData = artist || {
    id: '', // No ID yet
    user_id: session.user.id,
    email: session.user.email || '',
    name: '',
    slug: '',
    bio: '',
    phone: '',
    profile_image: '',
    created_at: '',
  };

  return <ProfileForm artist={artistData as Artist} />;
}

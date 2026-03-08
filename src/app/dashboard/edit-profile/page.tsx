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
  // ✅ Use the server client for secure session and data fetching.
  const supabase = createServerSupabaseClient();

  // ✅ Get the user session.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/login');

  // ✅ Fetch the artist profile linked to the logged-in user.
  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  // Handle database errors, but ignore the "PGRST116" error, which just means
  // no row was found. This is expected for new users.
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

  // ✅ If the artist profile doesn't exist (new signup), create a default object.
  // The ProfileForm will use this to render the form for the first time.
  // The form's server action will then 'upsert' this data to create the profile.
  const artistData = artist || {
    id: '', // No ID yet for a new profile
    user_id: session.user.id,
    email: session.user.email || '',
    name: '',
    slug: '',
    bio: '',
    phone: '',
    profile_image: `https://picsum.photos/seed/${session.user.id}/400/400`,
    created_at: '',
  };

  return <ProfileForm artist={artistData as Artist} />;
}

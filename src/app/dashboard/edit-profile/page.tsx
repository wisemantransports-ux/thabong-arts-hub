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

  // Handle database errors, but ignore "PGRST116" (no row found), as this is expected for new users.
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

  // If the artist profile doesn't exist (new signup), create a default object.
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

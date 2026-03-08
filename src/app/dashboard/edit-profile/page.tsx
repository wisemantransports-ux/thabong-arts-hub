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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?next=/dashboard/edit-profile');
  }

  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !artist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Could not load your artist profile. If you just signed up, please wait a moment and refresh.
            <p className="text-xs text-muted-foreground mt-2">{error?.message}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <ProfileForm artist={artist as Artist} />;
}

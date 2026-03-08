import { createClient } from '@/lib/supabase/server';
import ProfileForm from './_components/profile-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { Artist } from '@/lib/types';

export default async function MyProfilePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // This should be handled by middleware, but as a safeguard.
        redirect('/login');
    }

    const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    if (!artist) {
       return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Not Found</CardTitle>
                    <CardDescription>
                        We couldn't find an artist profile associated with your account. 
                        This can sometimes happen if the profile is still being created. Please wait a moment and refresh the page.
                        If the problem persists, please contact support.
                    </CardDescription>
                </CardHeader>
            </Card>
       )
    }

    return <ProfileForm artist={artist as Artist} />;
}

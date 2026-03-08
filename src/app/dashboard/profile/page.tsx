import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './_components/profile-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function MyProfilePage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // This should be handled by middleware, but as a safeguard.
        redirect('/login');
    }

    const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching artist profile:', error.message);
    }

    if (!artist) {
       return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Not Found</CardTitle>
                    <CardDescription>
                        We couldn't find an artist profile associated with your account. 
                        Please contact support if you believe this is an error.
                    </CardDescription>
                </CardHeader>
            </Card>
       )
    }

    return <ProfileForm artist={artist} />;
}

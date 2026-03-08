import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AddArtworkForm from './_components/add-artwork-form';

export const metadata = {
  title: "Add New Artwork | Artist Dashboard",
  description: "Add a new piece to the marketplace.",
};


export default async function NewArtworkPage() {
    const supabase = createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login?next=/dashboard/artworks/new');
    }
    
    const { data: artist } = await supabase.from('artists').select('id, name').eq('user_id', user.id).single();

    if (!artist || !artist.name) {
        redirect('/dashboard/edit-profile?message=Please complete your profile before adding artworks.');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Artwork</CardTitle>
                <CardDescription>
                    Fill in the details of your new piece to add it to the marketplace.
                </CardDescription>
            </CardHeader>
            <AddArtworkForm artistId={artist.id} />
        </Card>
    );
}

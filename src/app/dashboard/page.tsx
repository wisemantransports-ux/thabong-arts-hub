import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paintbrush, User, PlusCircle, AlertTriangle } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // This check is redundant due to middleware and layout, but good for safety
    redirect('/login?next=/dashboard');
  }

  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (artistError || !artist) {
    // This should ideally not happen due to the signup flow, but handle it gracefully
    redirect('/login?message=Could not find your artist profile.');
  }
  
  const isProfileComplete = artist.name && artist.slug && artist.bio;

  const { data: artworks, error: artworksError } = await supabase
    .from('artworks')
    .select('id, status, price')
    .eq('artist_id', artist.id)

  const totalArtworks = artworks?.length || 0;
  const publishedArtworks = artworks?.filter(a => a.status === 'published').length || 0;
  const draftArtworks = artworks?.filter(a => a.status === 'draft').length || 0;
  
  return (
    <div className="space-y-6">
       {!isProfileComplete && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center gap-4">
             <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <CardTitle className="text-yellow-900">Complete Your Profile</CardTitle>
              <CardDescription className="text-yellow-700">
                Your profile is incomplete. Please add your name, bio, and other details to be visible in the marketplace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
             <Button asChild variant="default">
                <Link href="/dashboard/edit-profile">Edit Profile</Link>
             </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArtworks}</div>
            <p className="text-xs text-muted-foreground">pieces listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Paintbrush className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedArtworks}</div>
            <p className="text-xs text-muted-foreground">artworks live in the marketplace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftArtworks}</div>
            <p className="text-xs text-muted-foreground">artworks hidden from public view</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Artworks</CardTitle>
          <CardDescription>View, edit, or add new pieces to your public gallery.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/artworks">
              <Paintbrush className="mr-2 h-4 w-4" /> Go to My Artworks
            </Link>
          </Button>
           <Button asChild variant="secondary">
            <Link href="/dashboard/artworks/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Artwork
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

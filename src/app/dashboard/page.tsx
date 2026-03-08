import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paintbrush, User, PlusCircle } from 'lucide-react';
import { getArtworks } from '@/lib/data';
import { Artwork } from '@/lib/types';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  // ✅ Server-side Supabase client to securely get the session
  const supabase = createServerSupabaseClient();

  // ✅ Server-side session check. Middleware has already run, but we double-check.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/login');

  // ✅ Get artist for the *currently logged-in user*
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  // If artist profile is missing or incomplete (name is empty), force the user to complete it.
  if (!artist || artistError || !artist.name) {
    redirect('/dashboard/edit-profile');
  }

  // ✅ Fetch artworks scoped to the logged-in artist
  const artworks: Artwork[] = await getArtworks({ artist_id: artist.id });

  const totalArtworks = artworks.length;
  const availableArtworks = artworks.filter(a => a.status === 'available').length;
  const soldArtworks = artworks.filter(a => a.status === 'sold').length;
  const totalValue = artworks.reduce((sum, art) => sum + art.price, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Artworks */}
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

        {/* Available */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available for Sale</CardTitle>
            <Paintbrush className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableArtworks}</div>
            <p className="text-xs text-muted-foreground">{totalArtworks > 0 ? ((availableArtworks/totalArtworks)*100).toFixed(0) : 0}% of your collection</p>
          </CardContent>
        </Card>

        {/* Sold */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Artworks</CardTitle>
            <Paintbrush className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldArtworks}</div>
            <p className="text-xs text-muted-foreground">Congratulations!</p>
          </CardContent>
        </Card>

        {/* Portfolio Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BWP {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on listed prices</p>
          </CardContent>
        </Card>
      </div>

      {/* Manage Artworks & Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Artworks</CardTitle>
            <CardDescription>View, edit, or add new pieces to your public gallery.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/artworks">
                <Paintbrush className="mr-2 h-4 w-4" /> Go to My Artworks
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Your Profile</CardTitle>
            <CardDescription>Keep your biography and contact information up-to-date.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/edit-profile">
                <User className="mr-2 h-4 w-4" /> Edit My Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add New Artwork CTA */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Ready to list a new masterpiece?</CardTitle>
          <CardDescription className="text-primary-foreground/80">Add your latest creation to the marketplace in just a few steps.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/artworks">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Artwork
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

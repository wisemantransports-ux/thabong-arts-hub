import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import AddArtworkSheet from './_components/add-artwork-sheet';
import { getArtworks } from '@/lib/data';

export default async function MyArtworksPage() {
  // ✅ Server-side Supabase client
  const supabase = createServerSupabaseClient();

  // ✅ Get session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/login');

  // ✅ Fetch logged-in artist
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (artistError || !artist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Artworks</CardTitle>
          <CardDescription>
            We couldn't find an artist profile associated with your account. Please complete your profile first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // ✅ Fetch artworks for this artist
  let artworks = [];
  try {
    artworks = await getArtworks({ artist_id: artist.id });
  } catch (err) {
    artworks = [];
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Artworks</CardTitle>
          <CardDescription>A list of all your artworks on the platform.</CardDescription>
        </div>
        <AddArtworkSheet artistName={artist.name}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Artwork
          </Button>
        </AddArtworkSheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow key={artwork.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={artwork.title}
                    className="aspect-square rounded-md object-cover"
                    height={64}
                    width={64}
                    src={artwork.image_url}
                    data-ai-hint="artwork painting"
                  />
                </TableCell>
                <TableCell className="font-medium">{artwork.title}</TableCell>
                <TableCell>
                  <Badge variant={artwork.status === 'available' ? 'outline' : 'destructive'}>
                    {artwork.status}
                  </Badge>
                </TableCell>
                <TableCell>BWP {artwork.price.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

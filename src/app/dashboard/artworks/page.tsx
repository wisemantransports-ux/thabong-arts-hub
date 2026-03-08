import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default async function MyArtworksPage() {
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?next=/dashboard/artworks');
  }

  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (artistError || !artist) {
    redirect('/dashboard/edit-profile?next=/dashboard/artworks&message=Please complete your profile first.');
  }

  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .eq('artist_id', artist.id)
    .order('created_at', { ascending: false });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Artworks</CardTitle>
          <CardDescription>A list of all your artworks on the platform.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/dashboard/artworks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Artwork
          </Link>
        </Button>
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
            {artworks && artworks.map((artwork) => (
              <TableRow key={artwork.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={artwork.title}
                    className="aspect-square rounded-md object-cover"
                    height={64}
                    width={64}
                    src={artwork.image_url || `https://picsum.photos/seed/${artwork.id}/64`}
                    data-ai-hint="artwork painting"
                  />
                </TableCell>
                <TableCell className="font-medium">{artwork.title}</TableCell>
                <TableCell>
                   <Badge variant={artwork.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                    {artwork.status}
                  </Badge>
                </TableCell>
                <TableCell>BWP {artwork.price?.toLocaleString()}</TableCell>
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

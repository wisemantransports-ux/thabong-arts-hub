import { getArtworks } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminArtworksPage() {
    const artworks = await getArtworks();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Artworks</CardTitle>
                    <CardDescription>A list of all artworks on the platform.</CardDescription>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Artwork
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Artist</TableHead>
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
                                        height="64"
                                        src={artwork.image_url}
                                        width="64"
                                        data-ai-hint="artwork painting"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link href={`/artworks/${artwork.id}`} className="hover:underline" target="_blank">{artwork.title}</Link>
                                </TableCell>
                                <TableCell>{artwork.artist_name}</TableCell>
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
    )
}

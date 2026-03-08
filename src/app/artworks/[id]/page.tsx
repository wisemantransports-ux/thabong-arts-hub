import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getArtworkById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artwork = await getArtworkById(params.id);

  if (!artwork || artwork.status !== 'published') {
      return {
          title: 'Artwork Not Found'
      }
  }

  return {
    title: artwork.title,
    description: artwork.description,
    openGraph: {
        title: artwork.title,
        description: artwork.description || '',
        images: [
            {
                url: artwork.image_url || '',
                width: 800,
                height: 800,
                alt: artwork.title,
            },
        ],
    },
  };
}


export default async function ArtworkDetailPage({ params }: Props) {
  const artwork = await getArtworkById(params.id);
  
  if (!artwork || artwork.status !== 'published') {
      notFound();
  }

  const artist = artwork.artists;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="relative aspect-square">
            <Image
              src={artwork.image_url || 'https://picsum.photos/seed/placeholder/800'}
              alt={artwork.title}
              fill
              className="object-contain rounded-lg shadow-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              data-ai-hint="artwork painting"
            />
          </div>
          <div>
            <h1 className="font-headline text-4xl lg:text-5xl font-bold">{artwork.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">
              by <Link href={`/artist/${artist?.slug}`} className="hover:text-primary transition-colors">{artist?.name}</Link>
            </p>
            <p className="text-3xl font-semibold my-6">BWP {artwork.price?.toLocaleString()}</p>
            
            <div className="mt-8 space-y-4">
              <h2 className="font-headline text-2xl font-semibold">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{artwork.description}</p>
            </div>

             <div className="mt-8 space-y-4">
                <h2 className="font-headline text-2xl font-semibold">Details</h2>
                <ul className="text-muted-foreground list-none space-y-1">
                    <li><strong>Category:</strong> {artwork.category}</li>
                </ul>
            </div>
          </div>
        </div>
        
        {artist && (
          <div className="mt-16 lg:mt-24">
            <Card>
                <CardHeader>
                    <CardTitle>About the Artist</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                                src={artist.profile_image || 'https://picsum.photos/seed/placeholder-artist/400'}
                                alt={artist.name || 'Artist'}
                                fill
                                className="object-cover"
                                data-ai-hint="artist portrait"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-headline">{artist.name}</h3>
                            <p className="text-muted-foreground mt-2 mb-4">{artist.bio}</p>
                            <Button variant="outline" asChild>
                                <Link href={`/artist/${artist.slug}`}>View Profile & Artworks</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

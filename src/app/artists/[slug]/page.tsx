import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getArtistBySlug, getArtworks } from '@/lib/data';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtistBySlug(params.slug);

  if (!artist) {
    return {
      title: 'Artist Not Found',
    }
  }

  return {
    title: `Original African Art – Botswana Artist ${artist.name}`,
    description: artist.bio,
    openGraph: {
        title: `Original African Art – Botswana Artist ${artist.name}`,
        description: artist.bio,
        images: [
            {
                url: artist.profile_image,
                width: 400,
                height: 400,
                alt: artist.name,
            },
        ],
    },
  };
}


export default async function ArtistProfilePage({ params }: Props) {
  const artist = await getArtistBySlug(params.slug);
  
  if (!artist) {
    notFound();
  }

  const artworks = await getArtworks({ artist_id: artist.id });

  const whatsappMessage = encodeURIComponent(
    `Hello ${artist.name}, I'm reaching out from your profile on the Thapong Visual Art Centre website.`
  );
  const whatsappUrl = `https://wa.me/${artist.phone}?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
          <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
            <Image
              src={artist.profile_image}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, 256px"
              priority
              data-ai-hint="artist portrait"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">{artist.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{artist.bio}</p>
            <Button asChild size="lg" className="mt-6">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                Contact {artist.name}
              </a>
            </Button>
          </div>
        </div>

        <h2 className="text-3xl font-headline font-bold mb-8 text-center md:text-left">Artworks by {artist.name}</h2>
        
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden group h-full flex flex-col">
                <CardContent className="p-0 flex flex-col flex-grow">
                  <Link href={`/artworks/${artwork.id}`} className="flex flex-col flex-grow">
                    <div className="relative aspect-square">
                      <Image
                        src={artwork.image_url}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        data-ai-hint="artwork painting"
                      />
                      {artwork.status !== 'available' && (
                        <Badge variant="destructive" className="absolute top-2 right-2 capitalize">{artwork.status}</Badge>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-headline font-semibold text-lg truncate">{artwork.title}</h3>
                      <div className="flex-grow" />
                      <p className="font-semibold mt-2">BWP {artwork.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">This artist has not listed any artworks yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

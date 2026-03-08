import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getArtists } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Our Artists | Thapong Visual Art Centre',
  description: 'Meet the talented artists of Thapong Visual Art Centre.',
};

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Meet Our Artists</h1>
            <p className="text-lg text-muted-foreground mt-2">The creative souls behind the masterpieces.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <Card key={artist.id} className="group text-center transition-shadow duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <Link href={`/artists/${artist.slug}`}>
                  <div className="relative h-40 w-40 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-background group-hover:ring-primary transition-all duration-300">
                    <Image
                      src={artist.profile_image}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="160px"
                      data-ai-hint="artist portrait"
                    />
                  </div>
                  <h3 className="font-headline font-bold text-xl">{artist.name}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-3">{artist.bio}</p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

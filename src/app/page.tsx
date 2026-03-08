import Image from 'next/image';
import Link from 'next/link';

import { getPublishedArtworks, getArtists } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';

export default async function Home() {
  const featuredArtworks = await getPublishedArtworks({ limit: 6 });
  const featuredArtists = await getArtists();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-gray-900">
          <Image
            src="https://picsum.photos/seed/hero-art/1800/1000"
            alt="Artistic background"
            fill
            className="object-cover opacity-30"
            priority
            data-ai-hint="abstract art"
          />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4 shadow-lg">
              The Heart of Botswana's Art
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Discover, connect, and collect unique artworks from the vibrant artists of the Thapong Visual Art Centre.
            </p>
            <Button asChild size="lg" className="font-bold">
              <Link href="/marketplace">Explore Gallery</Link>
            </Button>
          </div>
        </section>

        {/* Featured Artworks */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-headline font-bold">Featured Artworks</h2>
              <Button variant="ghost" asChild>
                <Link href="/marketplace">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden group">
                  <CardContent className="p-0">
                    <Link href={`/artwork/${artwork.id}`}>
                      <div className="relative aspect-square">
                        <Image
                          src={artwork.image_url || 'https://picsum.photos/seed/placeholder/800'}
                          alt={artwork.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="artwork painting"
                        />
                         {artwork.status !== 'published' && (
                          <Badge variant="destructive" className="absolute top-2 right-2">{artwork.status}</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-headline font-semibold text-lg truncate">{artwork.title}</h3>
                        <p className="text-muted-foreground">{artwork.artists?.name}</p>
                        <p className="font-semibold mt-2">BWP {artwork.price?.toLocaleString()}</p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-headline font-bold">Featured Artists</h2>
              <Button variant="ghost" asChild>
                <Link href="/artists">Meet All Artists <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtists.slice(0, 3).map((artist) => (
                <Card key={artist.id} className="group text-center">
                  <CardContent className="p-6">
                    <Link href={`/artist/${artist.slug}`}>
                      <div className="relative h-32 w-32 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-background group-hover:ring-primary transition-all">
                        <Image
                          src={artist.profile_image || 'https://picsum.photos/seed/placeholder-artist/400'}
                          alt={artist.name || 'Artist'}
                          fill
                          className="object-cover"
                          data-ai-hint="artist portrait"
                        />
                      </div>
                      <h3 className="font-headline font-bold text-xl">{artist.name}</h3>
                      <p className="text-muted-foreground line-clamp-2">{artist.bio}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';

import { getArtworks, getArtists, getEvents, getBusinesses } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, CalendarIcon } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default async function Home() {
  const featuredArtworks = (await getArtworks()).slice(0, 6);
  const featuredArtists = (await getArtists()).slice(0, 3);
  const allEvents = await getEvents();
  const upcomingEvents = allEvents.filter(event => new Date(event.event_date) >= new Date()).slice(0, 3);
  const creativeBusinesses = (await getBusinesses()).slice(0, 3);

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
              <Link href="/artworks">Explore Gallery</Link>
            </Button>
          </div>
        </section>

        {/* Featured Artworks */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-headline font-bold">Featured Artworks</h2>
              <Button variant="ghost" asChild>
                <Link href="/artworks">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden group">
                  <CardContent className="p-0">
                    <Link href={`/artworks/${artwork.id}`}>
                      <div className="relative aspect-square">
                        <Image
                          src={artwork.image_url}
                          alt={artwork.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="artwork painting"
                        />
                         {artwork.status === 'sold' && (
                          <Badge variant="destructive" className="absolute top-2 right-2">Sold</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-headline font-semibold text-lg truncate">{artwork.title}</h3>
                        <p className="text-muted-foreground">{artwork.artist_name}</p>
                        <p className="font-semibold mt-2">BWP {artwork.price.toLocaleString()}</p>
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
              {featuredArtists.map((artist) => (
                <Card key={artist.id} className="group text-center">
                  <CardContent className="p-6">
                    <Link href={`/artists/${artist.slug}`}>
                      <div className="relative h-32 w-32 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-background group-hover:ring-primary transition-all">
                        <Image
                          src={artist.profile_image}
                          alt={artist.name}
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

        {/* Upcoming Events */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-headline font-bold">Upcoming Events</h2>
                <Button variant="ghost" asChild>
                  <Link href="/events">All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {upcomingEvents.map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="relative aspect-video">
                            <Image
                              src={event.image_url}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint="event poster"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="font-headline font-bold text-xl mb-2">{event.title}</h3>
                            <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>{new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12"/>
            </Carousel>
          </div>
        </section>

        {/* Creative Businesses */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-center mb-8">Discover Creative Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {creativeBusinesses.map(business => (
                <Card key={business.id} className="group overflow-hidden">
                  <Link href={`/businesses/${business.slug}`}>
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/3 aspect-square">
                        <Image
                          src={business.image_url}
                          alt={business.name}
                          fill
                          className="object-cover"
                          data-ai-hint="business storefront"
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold font-headline">{business.name}</h3>
                        <p className="text-muted-foreground mt-2 line-clamp-3">{business.description}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/businesses">Explore All Businesses</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

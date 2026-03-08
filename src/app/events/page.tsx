import Image from 'next/image';
import { getEvents } from '@/lib/data';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Events | Thapong Visual Art Centre',
  description: 'Join us for workshops, exhibitions, and cultural events at Thapong Visual Art Centre.',
};

export default async function EventsPage() {
  const allEvents = await getEvents();
  const upcomingEvents = allEvents.filter(event => new Date(event.event_date) >= new Date());
  const pastEvents = allEvents.filter(event => new Date(event.event_date) < new Date()).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Events at Thapong Visual Art Centre</h1>
          <p className="text-lg text-muted-foreground mt-2">Immerse yourself in creativity and culture.</p>
        </div>

        <section>
          <h2 className="text-3xl font-headline font-bold mb-8">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden group">
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
                      <p className="text-muted-foreground mb-4 line-clamp-3 h-[72px]">{event.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No upcoming events scheduled. Check back soon!</p>
            </div>
          )}
        </section>

        {pastEvents.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-headline font-bold mb-8">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden group opacity-70">
                  <CardContent className="p-0 flex">
                    <div className="relative w-1/3 aspect-square">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                        data-ai-hint="event poster"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="font-headline font-bold text-xl mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

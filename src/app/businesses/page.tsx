import Image from 'next/image';
import Link from 'next/link';
import { getBusinesses } from '@/lib/data';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Clock } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

export const metadata = {
  title: 'Creative Businesses | Thapong Visual Art Centre',
  description: 'Explore the shops, restaurants, and services at Thapong Visual Art Centre.',
};

export default async function BusinessesPage() {
  const businesses = await getBusinesses();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Creative Businesses</h1>
          <p className="text-lg text-muted-foreground mt-2">More than just a gallery, a hub of creativity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {businesses.map((business) => {
            const whatsappUrl = `https://wa.me/${business.whatsapp}`;
            return(
            <Card key={business.id} className="overflow-hidden group">
              <Link href={`/businesses/${business.slug}`}>
                <div className="relative h-56 w-full">
                  <Image
                    src={business.image_url}
                    alt={business.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="business storefront"
                  />
                </div>
              </Link>
              <CardContent className="p-6">
                <Link href={`/businesses/${business.slug}`}>
                    <h3 className="text-2xl font-bold font-headline hover:text-primary">{business.name}</h3>
                </Link>
                <p className="text-muted-foreground mt-2 mb-4 line-clamp-3">{business.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    <a href={`tel:${business.phone}`} className="hover:text-primary">{business.phone}</a>
                  </div>
                   <div className="flex items-center text-muted-foreground">
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Contact on WhatsApp</a>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{business.opening_hours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      </main>
      <Footer />
    </div>
  );
}

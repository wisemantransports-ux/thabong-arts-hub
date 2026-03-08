import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getBusinessBySlug } from '@/lib/data';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Phone, Clock } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    return {
      title: 'Business Not Found',
    };
  }

  return {
    title: `${business.name} | Thapong Visual Art Centre`,
    description: business.description,
     openGraph: {
        title: `${business.name} | Thapong Visual Art Centre`,
        description: business.description,
        images: [
            {
                url: business.image_url,
                width: 800,
                height: 800,
                alt: business.name,
            },
        ],
    },
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const business = await getBusinessBySlug(params.slug);
  if (!business) {
    notFound();
  }

  const whatsappUrl = `https://wa.me/${business.whatsapp}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="relative aspect-video lg:aspect-square">
            <Image
              src={business.image_url}
              alt={business.name}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
              data-ai-hint="business storefront"
            />
          </div>
          <div>
            <h1 className="font-headline text-4xl lg:text-5xl font-bold">{business.name}</h1>
            <p className="text-lg text-muted-foreground mt-4">{business.description}</p>
            
            <div className="my-8 space-y-3">
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
                <a href={`tel:${business.phone}`} className="hover:text-primary">{business.phone}</a>
              </div>
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>{business.opening_hours}</span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                Contact on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

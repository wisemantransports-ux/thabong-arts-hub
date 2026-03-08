import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Thapong Visual Art Centre',
  description: 'Learn about the history, mission, and vision of Thapong Visual Art Centre.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] flex items-center justify-center text-center text-white bg-gray-900">
          <Image
            src="https://picsum.photos/seed/about-hero/1800/600"
            alt="Thapong Visual Art Centre building"
            fill
            className="object-cover opacity-40"
            data-ai-hint="art gallery"
          />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight shadow-lg">
              About Thapong Visual Art Centre
            </h1>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose lg:prose-lg max-w-none text-muted-foreground">
              <h2 className="text-3xl font-headline font-bold text-foreground mb-4">Our Mission</h2>
              <p>
                Thapong Visual Art Centre is a vibrant hub for the creative community in Gaborone, Botswana. Our mission is to promote and develop the visual arts in Botswana, providing a platform for both emerging and established artists to thrive, innovate, and connect with a global audience.
              </p>
              
              <h2 className="text-3xl font-headline font-bold text-foreground mt-12 mb-4">Our History</h2>
              <p>
                Founded in 1998, Thapong Visual Art Centre has grown from a small collective of passionate artists into a cornerstone of the nation's cultural landscape. Housed in the historic former magistrate's house, the centre has been instrumental in nurturing artistic talent, fostering collaboration, and advocating for the importance of the arts in society. This digital platform, the Africa Arts Hub, is the next step in our evolution, bringing the spirit of Thapong Visual Art Centre to the world.
              </p>

              <div className="relative aspect-video my-8 rounded-lg overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/gallery-inside/1200/675"
                  alt="Inside of Thapong Art Gallery"
                  fill
                  className="object-cover"
                  data-ai-hint="gallery interior"
                />
              </div>

              <h2 className="text-3xl font-headline font-bold text-foreground mt-12 mb-4">What We Offer</h2>
              <ul>
                <li><strong>Artist Studios:</strong> Affordable studio spaces where artists can create and collaborate.</li>
                <li><strong>Exhibitions:</strong> A dynamic schedule of exhibitions in our main gallery, showcasing the best of Botswana's contemporary art.</li>
                <li><strong>Workshops & Training:</strong> Educational programs for artists of all levels, from children's classes to professional development workshops.</li>
                <li><strong>Community:</strong> A welcoming space for artists, collectors, and art lovers to meet, share ideas, and be inspired.</li>
              </ul>
            </div>
            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/contact">Get In Touch</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

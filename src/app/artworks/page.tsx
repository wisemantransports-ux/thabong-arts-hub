import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getArtworks, getArtists } from '@/lib/data';
import ArtworksGrid from './_components/artworks-grid';

export const metadata = {
  title: 'Artworks Gallery | Thapong Visual Art Centre',
  description: 'Browse a diverse collection of artworks from Botswana\'s finest artists.',
};

export default async function ArtworksPage() {
  const artworks = await getArtworks();
  const artists = await getArtists();
  const categories = [...new Set(artworks.map(a => a.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Artworks Gallery</h1>
            <p className="text-lg text-muted-foreground mt-2">Find a piece that speaks to you.</p>
        </div>
        <ArtworksGrid 
            artworks={artworks} 
            artists={artists} 
            categories={categories}
        />
      </main>
      <Footer />
    </div>
  );
}

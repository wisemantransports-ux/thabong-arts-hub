'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { Artwork, Artist } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ArtworksGridProps {
  artworks: Artwork[];
  artists: Artist[];
  categories: string[];
}

export default function ArtworksGrid({ artworks, artists, categories }: ArtworksGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const maxPrice = useMemo(() => Math.max(...artworks.map(a => a.price), 0), [artworks]);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork => {
      const searchMatch = searchTerm === '' ||
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist_name.toLowerCase().includes(searchTerm.toLowerCase());
      const artistMatch = selectedArtist === 'all' || artwork.artist_id === selectedArtist;
      const categoryMatch = selectedCategory === 'all' || artwork.category === selectedCategory;
      const availabilityMatch = !showAvailableOnly || artwork.status === 'available';
      const priceMatch = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];

      return searchMatch && artistMatch && categoryMatch && availabilityMatch && priceMatch;
    });
  }, [artworks, searchTerm, selectedArtist, selectedCategory, showAvailableOnly, priceRange]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 sticky top-16 bg-background/95 py-4 z-40 backdrop-blur-sm border-b">
        <Input
          placeholder="Search by title or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-2"
        />
        <Select value={selectedArtist} onValueChange={setSelectedArtist}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by artist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Artists</SelectItem>
            {artists.map(artist => (
              <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
         <div className="md:col-span-3 space-y-2">
            <Label>Price Range: BWP {priceRange[0].toLocaleString()} - BWP {priceRange[1].toLocaleString()}</Label>
             <Slider
                min={0}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
            />
        </div>
        <div className="flex items-center space-x-2 justify-self-start md:justify-self-end">
            <Checkbox id="available" checked={showAvailableOnly} onCheckedChange={(checked) => setShowAvailableOnly(!!checked)} />
            <Label htmlFor="available">Show Available Only</Label>
        </div>
      </div>
      
      <AnimatePresence>
        <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden group h-full flex flex-col">
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
                      {artwork.status === 'sold' && (
                        <Badge variant="destructive" className="absolute top-2 right-2">Sold</Badge>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-headline font-semibold text-lg truncate">{artwork.title}</h3>
                      <p className="text-muted-foreground">{artwork.artist_name}</p>
                      <div className="flex-grow" />
                      <p className="font-semibold mt-2">BWP {artwork.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {filteredArtworks.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No artworks match your filters.</p>
        </div>
      )}
    </div>
  );
}

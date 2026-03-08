import { createClient } from '@/lib/supabase/server';
import { Artwork, Artist, Event, Business, ArtworkWithArtist } from './types';
import { notFound } from 'next/navigation';
import { mockArtists, mockArtworks, mockEvents, mockBusinesses } from './mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url-here';

// ARTISTS
export async function getArtists(): Promise<Artist[]> {
  if (USE_MOCK_DATA) return mockArtists;

  const supabase = createClient();
  const { data, error } = await supabase.from('artists').select('*');
  if (error) {
    console.error('Error fetching artists:', error.message);
    return mockArtists;
  }
  return data;
}

export async function getArtistBySlug(slug: string): Promise<Artist> {
    if (USE_MOCK_DATA) {
        const artist = mockArtists.find(a => a.slug === slug);
        if (!artist) notFound();
        return artist;
    }

  const supabase = createClient();
  const { data, error } = await supabase.from('artists').select('*').eq('slug', slug).single();
  if (error || !data) {
    console.error(`Error fetching artist with slug ${slug}:`, error?.message);
    const artist = mockArtists.find(a => a.slug === slug);
    if (!artist) notFound();
    return artist;
  }
  return data;
}

export async function getArtistById(id: string): Promise<Artist> {
    if (USE_MOCK_DATA) {
        const artist = mockArtists.find(a => a.id === id);
        if (!artist) notFound();
        return artist;
    }
    const supabase = createClient();
    const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();
    if (error || !data) {
      console.error(`Error fetching artist with id ${id}:`, error?.message);
      const artist = mockArtists.find(a => a.id === id);
      if (!artist) notFound();
      return artist;
    }
    return data;
}

// ARTWORKS
export async function getArtworks(filters: { artist_id?: string; limit?: number } = {}): Promise<ArtworkWithArtist[]> {
  if (USE_MOCK_DATA) {
      let artworks = mockArtworks;
      if (filters.artist_id) {
          artworks = artworks.filter(a => a.artist_id === filters.artist_id);
      }
      if (filters.limit) {
          artworks = artworks.slice(0, filters.limit);
      }
      return artworks;
  }

  const supabase = createClient();
  let query = supabase
    .from('artworks')
    .select('*, artists (name, slug, phone, profile_image, bio)')
    .order('created_at', { ascending: false });

  if (filters.artist_id) {
    query = query.eq('artist_id', filters.artist_id);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching artworks:', error.message);
    // Return filtered mock data on error
    let artworks = mockArtworks;
    if (filters.artist_id) {
        artworks = artworks.filter(a => a.artist_id === filters.artist_id);
    }
    if (filters.limit) {
        artworks = artworks.slice(0, filters.limit);
    }
    return artworks;
  }
  return data as ArtworkWithArtist[];
}

export async function getArtworkById(id: string): Promise<ArtworkWithArtist> {
   if (USE_MOCK_DATA) {
        const artwork = mockArtworks.find(a => a.id === id);
        if (!artwork) notFound();
        return artwork;
    }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('artworks')
    .select('*, artists (name, slug, phone, profile_image, bio)')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error fetching artwork with id ${id}:`, error?.message);
    const artwork = mockArtworks.find(a => a.id === id);
    if (!artwork) notFound();
    return artwork;
  }
  return data as ArtworkWithArtist;
}

// EVENTS
export async function getEvents(filters: { limit?: number, past?: boolean } = {}): Promise<Event[]> {
  if (USE_MOCK_DATA) {
      const sortedEvents = [...mockEvents].sort((a, b) => 
          filters.past 
          ? new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
          : new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
      return filters.limit ? sortedEvents.slice(0, filters.limit) : sortedEvents;
  }
  const supabase = createClient();
  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: filters.past ? false : true });
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching events:', error.message);
    const sortedEvents = [...mockEvents].sort((a, b) => 
        filters.past 
        ? new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        : new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
    return filters.limit ? sortedEvents.slice(0, filters.limit) : sortedEvents;
  }
  return data;
}

// BUSINESSES
export async function getBusinesses(filters: { limit?: number } = {}): Promise<Business[]> {
    if (USE_MOCK_DATA) {
        return filters.limit ? mockBusinesses.slice(0, filters.limit) : mockBusinesses;
    }
    const supabase = createClient();
    let query = supabase.from('businesses').select('*');

    if(filters.limit){
        query = query.limit(filters.limit);
    }
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching businesses:', error.message);
    return filters.limit ? mockBusinesses.slice(0, filters.limit) : mockBusinesses;
  }
  return data;
}

export async function getBusinessBySlug(slug: string): Promise<Business> {
    if (USE_MOCK_DATA) {
        const business = mockBusinesses.find(b => b.slug === slug);
        if (!business) notFound();
        return business;
    }
    const supabase = createClient();
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();
    if (error || !data) {
        console.error(`Error fetching business with slug ${slug}:`, error?.message);
        const business = mockBusinesses.find(b => b.slug === slug);
        if (!business) notFound();
        return business;
    }
    return data;
}

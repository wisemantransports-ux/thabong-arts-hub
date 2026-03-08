
import { createClient } from '@/lib/supabase/server';
import { Artwork, Artist, Event, Business, ArtworkWithArtist } from './types';
import { notFound } from 'next/navigation';
import { mockArtists, mockArtworks, mockEvents, mockBusinesses } from './mock-data';
import { isSupabaseConfigured } from './config';

// Helper to apply filters to mock artworks
const getMockArtworks = (filters: { artist_id?: string; limit?: number } = {}) => {
  let filteredArtworks = mockArtworks;
  if (filters.artist_id) {
    filteredArtworks = filteredArtworks.filter(a => a.artist_id === filters.artist_id);
  }
  if (filters.limit) {
    return filteredArtworks.slice(0, filters.limit);
  }
  return filteredArtworks;
}

// Helper to apply filters to mock events
const getMockEvents = (filters: { limit?: number, past?: boolean } = {}) => {
  // Mock data doesn't distinguish past/future well, so just apply limit
  let events = mockEvents;
  if (filters.limit) {
    return events.slice(0, filters.limit);
  }
  return events;
}

// Helper to apply filters to mock businesses
const getMockBusinesses = (filters: { limit?: number } = {}) => {
  let businesses = mockBusinesses;
  if (filters.limit) {
    return businesses.slice(0, filters.limit);
  }
  return businesses;
}


// ARTISTS
export async function getArtists(): Promise<Artist[]> {
  if (!isSupabaseConfigured) {
    return mockArtists;
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('artists').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Could not fetch artists from Supabase, falling back to mock data. Error:', (error as Error).message);
    return mockArtists;
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist> {
  if (!isSupabaseConfigured) {
    const artist = mockArtists.find(a => a.slug === slug);
    if (!artist) notFound();
    return artist;
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('artists').select('*').eq('slug', slug).single();
    if (error || !data) {
      console.warn(`Error fetching artist with slug ${slug}, falling back to mock data:`, error?.message);
      const mockArtist = mockArtists.find(a => a.slug === slug);
      if (!mockArtist) notFound();
      return mockArtist;
    }
    return data;
  } catch (error) {
    console.warn(`Could not fetch artist ${slug} from Supabase, falling back to mock data. Error:`, (error as Error).message);
    const artist = mockArtists.find(a => a.slug === slug);
    if (!artist) notFound();
    return artist;
  }
}

export async function getArtistById(id: string): Promise<Artist> {
  if (!isSupabaseConfigured) {
    const artist = mockArtists.find(a => a.id === id);
    if (!artist) notFound();
    return artist;
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();
    if (error || !data) {
      console.warn(`Error fetching artist with id ${id}, falling back to mock data:`, error?.message);
      const mockArtist = mockArtists.find(a => a.id === id);
      if (!mockArtist) notFound();
      return mockArtist;
    }
    return data;
  } catch (error) {
    console.warn(`Could not fetch artist ${id} from Supabase, falling back to mock data. Error:`, (error as Error).message);
    const artist = mockArtists.find(a => a.id === id);
    if (!artist) notFound();
    return artist;
  }
}

// ARTWORKS
export async function getArtworks(filters: { artist_id?: string; limit?: number } = {}): Promise<ArtworkWithArtist[]> {
  if (!isSupabaseConfigured) {
    return getMockArtworks(filters);
  }
  try {
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
      throw error;
    }
    return data as ArtworkWithArtist[];
  } catch(error) {
    console.warn('Could not fetch artworks from Supabase, falling back to mock data:', (error as Error).message);
    return getMockArtworks(filters);
  }
}

export async function getArtworkById(id: string): Promise<ArtworkWithArtist> {
  if (!isSupabaseConfigured) {
    const artwork = mockArtworks.find(a => a.id === id);
    if (!artwork) notFound();
    return artwork;
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('artworks')
      .select('*, artists (name, slug, phone, profile_image, bio)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.warn(`Error fetching artwork with id ${id}, falling back to mock data:`, error?.message);
      const mockArtwork = mockArtworks.find(a => a.id === id);
      if (!mockArtwork) notFound();
      return mockArtwork;
    }
    return data as ArtworkWithArtist;
  } catch (error) {
    console.warn(`Could not fetch artwork ${id} from Supabase, falling back to mock data. Error:`, (error as Error).message);
    const artwork = mockArtworks.find(a => a.id === id);
    if (!artwork) notFound();
    return artwork;
  }
}

// EVENTS
export async function getEvents(filters: { limit?: number, past?: boolean } = {}): Promise<Event[]> {
  if (!isSupabaseConfigured) {
    return getMockEvents(filters);
  }
  try {
    const supabase = createClient();
    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: filters.past ? false : true });
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch(error) {
    console.warn('Could not fetch events from Supabase, falling back to mock data:', (error as Error).message);
    return getMockEvents(filters);
  }
}

// BUSINESSES
export async function getBusinesses(filters: { limit?: number } = {}): Promise<Business[]> {
    if (!isSupabaseConfigured) {
      return getMockBusinesses(filters);
    }
    try {
      const supabase = createClient();
      let query = supabase.from('businesses').select('*');

      if(filters.limit){
          query = query.limit(filters.limit);
      }
      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch(error) {
      console.warn('Could not fetch businesses from Supabase, falling back to mock data:', (error as Error).message);
      return getMockBusinesses(filters);
    }
}

export async function getBusinessBySlug(slug: string): Promise<Business> {
    if (!isSupabaseConfigured) {
      const business = mockBusinesses.find(b => b.slug === slug);
      if (!business) notFound();
      return business;
    }
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();
      if (error || !data) {
          console.warn(`Error fetching business with slug ${slug}, falling back to mock data:`, error?.message);
          const mockBusiness = mockBusinesses.find(b => b.slug === slug);
          if (!mockBusiness) notFound();
          return mockBusiness;
      }
      return data;
    } catch(error) {
      console.warn(`Could not fetch business ${slug} from Supabase, falling back to mock data. Error:`, (error as Error).message);
      const business = mockBusinesses.find(b => b.slug === slug);
      if (!business) notFound();
      return business;
    }
}

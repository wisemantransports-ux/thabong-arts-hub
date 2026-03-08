import { createClient } from '@/lib/supabase/server';
import { Artwork, Artist, Event, Business, ArtworkWithArtist } from './types';
import { notFound } from 'next/navigation';

const supabase = createClient();

// ARTISTS
export async function getArtists(): Promise<Artist[]> {
  const { data, error } = await supabase.from('artists').select('*');
  if (error) {
    console.error('Error fetching artists:', error.message);
    return [];
  }
  return data;
}

export async function getArtistBySlug(slug: string): Promise<Artist> {
  const { data, error } = await supabase.from('artists').select('*').eq('slug', slug).single();
  if (error || !data) {
    console.error(`Error fetching artist with slug ${slug}:`, error?.message);
    notFound();
  }
  return data;
}

export async function getArtistById(id: string): Promise<Artist> {
    const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();
    if (error || !data) {
      console.error(`Error fetching artist with id ${id}:`, error?.message);
      notFound();
    }
    return data;
}

// ARTWORKS
export async function getArtworks(filters: { artist_id?: string; limit?: number } = {}): Promise<ArtworkWithArtist[]> {
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
    return [];
  }
  return data as ArtworkWithArtist[];
}

export async function getArtworkById(id: string): Promise<ArtworkWithArtist> {
  const { data, error } = await supabase
    .from('artworks')
    .select('*, artists (name, slug, phone, profile_image, bio)')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error fetching artwork with id ${id}:`, error?.message);
    notFound();
  }
  return data as ArtworkWithArtist;
}

// EVENTS
export async function getEvents(filters: { limit?: number, past?: boolean } = {}): Promise<Event[]> {
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
    return [];
  }
  return data;
}

// BUSINESSES
export async function getBusinesses(filters: { limit?: number } = {}): Promise<Business[]> {
    let query = supabase.from('businesses').select('*');

    if(filters.limit){
        query = query.limit(filters.limit);
    }
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching businesses:', error.message);
    return [];
  }
  return data;
}

export async function getBusinessBySlug(slug: string): Promise<Business> {
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();
    if (error || !data) {
        console.error(`Error fetching business with slug ${slug}:`, error?.message);
        notFound();
    }
    return data;
}


import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Artwork, Artist, Event, Business, ArtworkWithArtist } from './types';

// ARTISTS
export async function getArtists(): Promise<Artist[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from('artists').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Warning: Error fetching artists. Returning empty array.', (error as Error).message);
    return [];
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from('artists').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') { // PGRST116: "exact one row expected, but found no rows" - this is not an error for us.
        throw error;
    }
    return data;
  } catch (error) {
    console.warn(`Warning: Error fetching artist with slug ${slug}. Returning null.`, (error as Error).message);
    return null;
  }
}

export async function getArtistById(id: string): Promise<Artist | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.warn(`Warning: Error fetching artist with id ${id}. Returning null.`, (error as Error).message);
    return null;
  }
}

// ARTWORKS
export async function getArtworks(filters: { artist_id?: string; limit?: number } = {}): Promise<ArtworkWithArtist[]> {
  try {
    const supabase = createServerSupabaseClient();
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
    if (error) throw error;
    return (data as ArtworkWithArtist[]) || [];
  } catch (error) {
    console.warn('Warning: Error fetching artworks. Returning empty array.', (error as Error).message);
    return [];
  }
}

export async function getArtworkById(id: string): Promise<ArtworkWithArtist | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('artworks')
      .select('*, artists (name, slug, phone, profile_image, bio)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as ArtworkWithArtist;
  } catch (error) {
    console.warn(`Warning: Error fetching artwork with id ${id}. Returning null.`, (error as Error).message);
    return null;
  }
}

// EVENTS
export async function getEvents(filters: { limit?: number, past?: boolean } = {}): Promise<Event[]> {
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: filters.past ? false : true });
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Warning: Error fetching events. Returning empty array.', (error as Error).message);
    return [];
  }
}

// BUSINESSES
export async function getBusinesses(filters: { limit?: number } = {}): Promise<Business[]> {
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase.from('businesses').select('*');

    if(filters.limit){
        query = query.limit(filters.limit);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch(error) {
    console.warn('Warning: Error fetching businesses. Returning empty array.', (error as Error).message);
    return [];
  }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.warn(`Warning: Error fetching business with slug ${slug}. Returning null.`, (error as Error).message);
    return null;
  }
}

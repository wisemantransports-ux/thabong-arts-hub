
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Artwork, Artist, Event, Business, ArtworkWithArtist } from './types';

// ============================================================================
// ARTIST DATA
// ============================================================================

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
    if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        throw error;
    }
    return data;
  } catch (error) {
    console.warn(`Warning: Error fetching artist with slug ${slug}. Returning null.`, (error as Error).message);
    return null;
  }
}


// ============================================================================
// ARTWORK DATA
// ============================================================================

/**
 * Fetches artworks for the public marketplace.
 * Only returns artworks with 'published' status.
 */
export async function getPublishedArtworks(filters: { limit?: number } = {}): Promise<ArtworkWithArtist[]> {
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from('artworks')
      .select('*, artists (name, slug)')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as any[]) || []; // Cast needed because of generated types
  } catch (error) {
    console.warn('Warning: Error fetching published artworks. Returning empty array.', (error as Error).message);
    return [];
  }
}

export async function getArtworkById(id: string): Promise<ArtworkWithArtist | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('artworks')
      .select('*, artists (name, slug)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as any;
  } catch (error) {
    console.warn(`Warning: Error fetching artwork with id ${id}. Returning null.`, (error as Error).message);
    return null;
  }
}


// ============================================================================
// EVENT & BUSINESS DATA (Unchanged)
// ============================================================================

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

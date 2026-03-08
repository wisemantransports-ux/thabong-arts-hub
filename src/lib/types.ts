import { Database } from "./types/supabase";

export type Artist = Database['public']['Tables']['artists']['Row'];
export type Artwork = Database['public']['Tables']['artworks']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Business = Database['public']['Tables']['businesses']['Row'];

// Custom type for joining artworks with artist details
export type ArtworkWithArtist = Artwork & {
  artists: Pick<Artist, 'name' | 'slug' | 'phone' | 'profile_image' | 'bio'> | null;
};

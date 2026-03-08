import { getArtists as originalGetArtists, getArtworkById as originalGetArtworkById } from './data';
import type { Artist } from './types';

export async function getArtworkById(id: string) {
    return originalGetArtworkById(id);
}

export async function getArtistById(id: string): Promise<Artist | undefined> {
    const artists = await originalGetArtists();
    return artists.find(a => a.id === id);
}

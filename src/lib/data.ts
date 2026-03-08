import type { Artist, Artwork, Event, Business } from './types';

// This is mock data. In a real application, you would fetch this from a database.
const artists: Artist[] = [
  {
    id: '1',
    name: 'Mary Molefe',
    slug: 'mary-molefe',
    bio: 'A contemporary wildlife painter from Botswana, inspired by the Okavango Delta. Her work captures the spirit of Africa\'s majestic animals.',
    profile_image: 'https://picsum.photos/seed/artist1/400/400',
    phone: '26771234567',
    email: 'mary.molefe@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Pule',
    slug: 'john-pule',
    bio: 'Specializing in abstract sculptures, John uses recycled materials to create thought-provoking pieces about urban life and tradition.',
    profile_image: 'https://picsum.photos/seed/artist2/400/400',
    phone: '26772345678',
    email: 'john.pule@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sarah Lesedi',
    slug: 'sarah-lesedi',
    bio: 'A photographer whose lens captures the subtle beauty of Botswana\'s landscapes and the intimate moments of its people.',
    profile_image: 'https://picsum.photos/seed/artist3/400/400',
    phone: '26773456789',
    email: 'sarah.lesedi@example.com',
    created_at: new Date().toISOString(),
  },
];

const artworks: Artwork[] = [
  {
    id: '101',
    artist_id: '1',
    artist_name: 'Mary Molefe',
    artist_phone: '26771234567',
    title: 'Echoes of the Delta',
    description: 'An original oil on canvas painting depicting a herd of elephants at sunset in the Okavango Delta. The vibrant colors and rich textures bring the scene to life, evoking a sense of peace and awe.',
    price: 15000,
    image_url: 'https://picsum.photos/seed/artwork1/800/800',
    category: 'Painting',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  {
    id: '102',
    artist_id: '1',
    artist_name: 'Mary Molefe',
    artist_phone: '26771234567',
    title: 'Kalahari Gaze',
    description: 'A striking portrait of a leopard, rendered in acrylics. The intense gaze of the animal is captured with remarkable detail, showcasing its power and grace.',
    price: 12500,
    image_url: 'https://picsum.photos/seed/artwork2/800/800',
    category: 'Painting',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  {
    id: '103',
    artist_id: '2',
    artist_name: 'John Pule',
    artist_phone: '26772345678',
    title: 'Urban Weaver',
    description: 'A mixed-media sculpture crafted from reclaimed steel and wire. It represents the complex, interwoven fabric of city life in Gaborone.',
    price: 9000,
    image_url: 'https://picsum.photos/seed/artwork3/800/800',
    category: 'Sculpture',
    status: 'sold',
    created_at: new Date().toISOString(),
  },
  {
    id: '104',
    artist_id: '2',
    artist_name: 'John Pule',
    artist_phone: '26772345678',
    title: 'Ancestral Echo',
    description: 'This bronze sculpture merges traditional forms with modern abstraction, exploring the connection between past and present.',
    price: 18000,
    image_url: 'https://picsum.photos/seed/artwork4/800/800',
    category: 'Sculpture',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  {
    id: '105',
    artist_id: '3',
    artist_name: 'Sarah Lesedi',
    artist_phone: '26773456789',
    title: 'Salt Pan Serenity',
    description: 'A large-format photographic print of the Makgadikgadi Salt Pans under a vast, starry sky. The minimalist composition emphasizes the scale and solitude of the landscape.',
    price: 7500,
    image_url: 'https://picsum.photos/seed/artwork5/800/800',
    category: 'Photography',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  {
    id: '106',
    artist_id: '3',
    artist_name: 'Sarah Lesedi',
    artist_phone: '26773456789',
    title: 'The Storyteller',
    description: 'An intimate black and white portrait of a village elder, his face a roadmap of life experiences. The photograph captures a moment of quiet reflection.',
    price: 6000,
    image_url: 'https://picsum.photos/seed/artwork6/800/800',
    category: 'Photography',
    status: 'sold',
    created_at: new Date().toISOString(),
  },
];

const events: Event[] = [
  {
    id: '201',
    title: 'Live Painting Exhibition',
    description: 'Watch as our resident artists create masterpieces right before your eyes. An interactive and inspiring experience for all art lovers.',
    event_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    location: 'Africa Arts Hub Main Gallery',
    image_url: 'https://picsum.photos/seed/event1/1200/800',
    created_at: new Date().toISOString(),
  },
  {
    id: '202',
    title: 'Beginner\'s Pottery Workshop',
    description: 'Get your hands dirty and learn the basics of pottery from master craftsmen. All materials are provided. Limited spots available.',
    event_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    location: 'Africa Arts Hub Pottery Studio',
    image_url: 'https://picsum.photos/seed/event2/1200/800',
    created_at: new Date().toISOString(),
  },
];

const businesses: Business[] = [
  {
    id: '301',
    name: 'The Clay Pot Restaurant',
    slug: 'the-clay-pot-restaurant',
    description: 'Serving authentic Botswana cuisine in a rustic, art-filled setting. The perfect place to dine after a day of exploring the arts hub.',
    phone: '2673123456',
    whatsapp: '26774567890',
    image_url: 'https://picsum.photos/seed/business1/800/800',
    opening_hours: 'Mon-Sat: 9am - 10pm, Sun: 10am - 4pm',
    created_at: new Date().toISOString(),
  },
  {
    id: '302',
    name: 'Ledi\'s Craft & Curios',
    slug: 'ledis-craft-curios',
    description: 'A treasure trove of handcrafted jewelry, textiles, and souvenirs made by local artisans. Find the perfect gift to remember your visit.',
    phone: '2673987654',
    whatsapp: '26775678901',
    image_url: 'https://picsum.photos/seed/business2/800/800',
    opening_hours: 'Mon-Sat: 9am - 6pm',
    created_at: new Date().toISOString(),
  },
];

// In a real app, these would be API calls to your Supabase backend.
// For this MVP, we simulate async fetching.

export async function getArtists(): Promise<Artist[]> {
  return new Promise(resolve => setTimeout(() => resolve(artists), 100));
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(artists.find(a => a.slug === slug)), 100));
}

export async function getArtworks(filters: { artist_id?: string; category?: string; price_range?: [number, number]; status?: string } = {}): Promise<Artwork[]> {
  return new Promise(resolve => setTimeout(() => {
    let filtered = artworks;
    if (filters.artist_id) {
      filtered = filtered.filter(a => a.artist_id === filters.artist_id);
    }
    // More filters can be added here
    resolve(filtered);
  }, 100));
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(artworks.find(a => a.id === id)), 100));
}

export async function getEvents(): Promise<Event[]> {
  return new Promise(resolve => setTimeout(() => resolve(events.sort((a,b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())), 100));
}

export async function getBusinesses(): Promise<Business[]> {
  return new Promise(resolve => setTimeout(() => resolve(businesses), 100));
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
    return new Promise(resolve => setTimeout(() => resolve(businesses.find(b => b.slug === slug)), 100));
}

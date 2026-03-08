export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  profile_image: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface Artwork {
  id: string;
  artist_id: string;
  artist_name: string;
  artist_phone: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  status: 'available' | 'sold';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  phone: string;
  whatsapp: string;
  image_url: string;
  opening_hours: string;
  created_at: string;
}

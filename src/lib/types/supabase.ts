export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          bio: string
          profile_image: string
          phone: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          bio: string
          profile_image: string
          phone: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          bio?: string
          profile_image?: string
          phone?: string
          email?: string
          created_at?: string
        }
      }
      artworks: {
        Row: {
          id: string
          artist_id: string
          title: string
          description: string
          price: number
          image_url: string
          category: string
          status: 'available' | 'sold' | 'reserved'
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          description: string
          price: number
          image_url: string
          category: string
          status?: 'available' | 'sold' | 'reserved'
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          status?: 'available' | 'sold' | 'reserved'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          event_date: string
          location: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          event_date: string
          location: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          event_date?: string
          location?: string
          image_url?: string
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          phone: string
          whatsapp: string
          image_url: string
          opening_hours: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          phone: string
          whatsapp: string
          image_url: string
          opening_hours: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          phone?: string
          whatsapp?: string
          image_url?: string
          opening_hours?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

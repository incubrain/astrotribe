export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          title?: string
        }
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: number
          id: number
          is_attending: boolean
          user_id: number
        }
        Insert: {
          created_at?: string | null
          event_id: number
          id?: number
          is_attending?: boolean
          user_id: number
        }
        Update: {
          created_at?: string | null
          event_id?: number
          id?: number
          is_attending?: boolean
          user_id?: number
        }
      }
      event_hosts: {
        Row: {
          created_at: string | null
          event_id: number
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          event_id: number
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          event_id?: number
          id?: number
          user_id?: number
        }
      }
      events: {
        Row: {
          body: string | null
          created_at: string | null
          date: string
          id: number
          title: string
          venue_id: number
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          date: string
          id?: number
          title: string
          venue_id: number
        }
        Update: {
          body?: string | null
          created_at?: string | null
          date?: string
          id?: number
          title?: string
          venue_id?: number
        }
      }
      host_reviews: {
        Row: {
          created_at: string | null
          event_id: number
          id: number
          review_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          event_id: number
          id?: number
          review_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          event_id?: number
          id?: number
          review_id?: number
          user_id?: number
        }
      }
      location: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: number
          lat_long: string | null
          state_province: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: number
          lat_long?: string | null
          state_province?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: number
          lat_long?: string | null
          state_province?: string | null
        }
      }
      post_categories: {
        Row: {
          category_id: number
          created_at: string | null
          id: number
          post_id: number
        }
        Insert: {
          category_id: number
          created_at?: string | null
          id?: number
          post_id: number
        }
        Update: {
          category_id?: number
          created_at?: string | null
          id?: number
          post_id?: number
        }
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: number
          post_id: number
          reaction_type_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          post_id: number
          reaction_type_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          post_id?: number
          reaction_type_id?: number
          user_id?: string
        }
      }
      posts: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          image: string | null
          status_id: number
          title: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          status_id: number
          title?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          status_id?: number
          title?: string | null
          user_id?: string
        }
      }
      reaction_types: {
        Row: {
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          title: string
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string
        }
      }
      reviews: {
        Row: {
          body: string
          created_at: string | null
          id: number
          rating: number
          user_id: number
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: number
          rating: number
          user_id: number
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: number
          rating?: number
          user_id?: number
        }
      }
      roles: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          title?: string
        }
      }
      skills: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          title?: string
        }
      }
      statuses: {
        Row: {
          created_at: string | null
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string | null
        }
      }
      user_connections: {
        Row: {
          created_at: string | null
          id: number
          user1_id: number
          user2_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          user1_id: number
          user2_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          user1_id?: number
          user2_id?: number
        }
      }
      user_followers: {
        Row: {
          created_at: string | null
          followed_id: number
          follower_id: number
          id: number
        }
        Insert: {
          created_at?: string | null
          followed_id: number
          follower_id: number
          id?: number
        }
        Update: {
          created_at?: string | null
          followed_id?: number
          follower_id?: number
          id?: number
        }
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          role_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          role_id?: number
          user_id?: number
        }
      }
      users: {
        Row: {
          created_at: string | null
          dob: string | null
          email: string
          gender_id: number | null
          given_name: string
          id: number
          last_seen: string | null
          location_id: number | null
          surname: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          dob?: string | null
          email: string
          gender_id?: number | null
          given_name: string
          id?: number
          last_seen?: string | null
          location_id?: number | null
          surname: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          dob?: string | null
          email?: string
          gender_id?: number | null
          given_name?: string
          id?: number
          last_seen?: string | null
          location_id?: number | null
          surname?: string
          updated_at?: string | null
          username?: string | null
        }
      }
      venue_reviews: {
        Row: {
          created_at: string | null
          id: number
          review_id: number
          venue_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          review_id: number
          venue_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          review_id?: number
          venue_id?: number
        }
      }
      venues: {
        Row: {
          body: Json | null
          created_at: string | null
          id: number
          location_id: number
          name: string
          socials_id: number | null
        }
        Insert: {
          body?: Json | null
          created_at?: string | null
          id?: number
          location_id: number
          name: string
          socials_id?: number | null
        }
        Update: {
          body?: Json | null
          created_at?: string | null
          id?: number
          location_id?: number
          name?: string
          socials_id?: number | null
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


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
      cities: {
        Row: {
          country_id: number | null
          id: number
          latitude: number | null
          longitude: number | null
          name: string | null
          state_id: number | null
        }
        Insert: {
          country_id?: number | null
          id: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          state_id?: number | null
        }
        Update: {
          country_id?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          state_id?: number | null
        }
      }
      companies: {
        Row: {
          company_size: string | null
          created_at: string | null
          description: string | null
          headquarters_location_id: number | null
          id: number
          logo: string | null
          name: string
          slogan: string | null
          socials_id: number | null
          website_url: string | null
        }
        Insert: {
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          headquarters_location_id?: number | null
          id?: number
          logo?: string | null
          name: string
          slogan?: string | null
          socials_id?: number | null
          website_url?: string | null
        }
        Update: {
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          headquarters_location_id?: number | null
          id?: number
          logo?: string | null
          name?: string
          slogan?: string | null
          socials_id?: number | null
          website_url?: string | null
        }
      }
      company_employees: {
        Row: {
          company_id: number
          id: number
          position: string
          user_id: number
        }
        Insert: {
          company_id: number
          id?: number
          position: string
          user_id: number
        }
        Update: {
          company_id?: number
          id?: number
          position?: string
          user_id?: number
        }
      }
      countries: {
        Row: {
          capital: string | null
          currency: string | null
          currency_name: string | null
          currency_symbol: string | null
          emoji: string | null
          emojiU: string | null
          id: number
          iso2: string | null
          iso3: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          native: string | null
          numeric_code: number | null
          phone_code: string | null
          region: string | null
          subregion: string | null
          timezones: Json | null
          tld: string | null
        }
        Insert: {
          capital?: string | null
          currency?: string | null
          currency_name?: string | null
          currency_symbol?: string | null
          emoji?: string | null
          emojiU?: string | null
          id: number
          iso2?: string | null
          iso3?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          native?: string | null
          numeric_code?: number | null
          phone_code?: string | null
          region?: string | null
          subregion?: string | null
          timezones?: Json | null
          tld?: string | null
        }
        Update: {
          capital?: string | null
          currency?: string | null
          currency_name?: string | null
          currency_symbol?: string | null
          emoji?: string | null
          emojiU?: string | null
          id?: number
          iso2?: string | null
          iso3?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          native?: string | null
          numeric_code?: number | null
          phone_code?: string | null
          region?: string | null
          subregion?: string | null
          timezones?: Json | null
          tld?: string | null
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
          featured_image: string | null
          id: number
          title: string
          venue_id: number
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          date: string
          featured_image?: string | null
          id?: number
          title: string
          venue_id: number
        }
        Update: {
          body?: string | null
          created_at?: string | null
          date?: string
          featured_image?: string | null
          id?: number
          title?: string
          venue_id?: number
        }
      }
      gender: {
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
      hashtags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
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
      language_endorsements: {
        Row: {
          created_at: string | null
          endorsor_id: number
          id: number
          is_admin: boolean
          rating: number
          user_language_id: number
        }
        Insert: {
          created_at?: string | null
          endorsor_id: number
          id?: number
          is_admin?: boolean
          rating: number
          user_language_id: number
        }
        Update: {
          created_at?: string | null
          endorsor_id?: number
          id?: number
          is_admin?: boolean
          rating?: number
          user_language_id?: number
        }
      }
      languages: {
        Row: {
          id: number
          iso_639_1: string | null
          iso_639_2: string | null
          name: string | null
        }
        Insert: {
          id: number
          iso_639_1?: string | null
          iso_639_2?: string | null
          name?: string | null
        }
        Update: {
          id?: number
          iso_639_1?: string | null
          iso_639_2?: string | null
          name?: string | null
        }
      }
      locations: {
        Row: {
          address: string | null
          city_id: number
          country_id: number
          created_at: string | null
          id: number
          latitude: number | null
          longitude: number | null
          state_id: number
        }
        Insert: {
          address?: string | null
          city_id: number
          country_id: number
          created_at?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          state_id: number
        }
        Update: {
          address?: string | null
          city_id?: number
          country_id?: number
          created_at?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          state_id?: number
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
      profile_guide: {
        Row: {
          created_at: string | null
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          user_id?: number
        }
      }
      profile_mentor: {
        Row: {
          created_at: string | null
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          user_id?: number
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
          name: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          name?: string
        }
      }
      skill_endorsements: {
        Row: {
          endorser_id: number
          id: number
          is_admin: boolean
          rating: number
          user_skill_id: number
        }
        Insert: {
          endorser_id: number
          id?: number
          is_admin?: boolean
          rating: number
          user_skill_id: number
        }
        Update: {
          endorser_id?: number
          id?: number
          is_admin?: boolean
          rating?: number
          user_skill_id?: number
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
      socials: {
        Row: {
          id: number
          platform: string
          url: string
          username: string | null
        }
        Insert: {
          id?: number
          platform: string
          url: string
          username?: string | null
        }
        Update: {
          id?: number
          platform?: string
          url?: string
          username?: string | null
        }
      }
      states: {
        Row: {
          country_id: number | null
          id: number
          latitude: number | null
          longitude: number | null
          name: string | null
          state_code: string | null
        }
        Insert: {
          country_id?: number | null
          id: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          state_code?: string | null
        }
        Update: {
          country_id?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          state_code?: string | null
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
      user_hashtags: {
        Row: {
          hashtag_id: number
          id: number
          user_id: number
        }
        Insert: {
          hashtag_id: number
          id?: number
          user_id: number
        }
        Update: {
          hashtag_id?: number
          id?: number
          user_id?: number
        }
      }
      user_languages: {
        Row: {
          id: number
          language_id: number
          user_id: number
        }
        Insert: {
          id?: number
          language_id: number
          user_id: number
        }
        Update: {
          id?: number
          language_id?: number
          user_id?: number
        }
      }
      user_locations: {
        Row: {
          created_at: string | null
          from: string | null
          id: number
          is_home: boolean
          location_id: number
          to: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          from?: string | null
          id?: number
          is_home?: boolean
          location_id: number
          to?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          from?: string | null
          id?: number
          is_home?: boolean
          location_id?: number
          to?: string | null
          user_id?: number
        }
      }
      user_profiles: {
        Row: {
          avatar: string | null
          cover_image: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          follow_count: number | null
          followed_count: number | null
          gender_id: number | null
          given_name: string | null
          id: string
          introduction: string | null
          last_seen: string | null
          quote: string | null
          surname: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          follow_count?: number | null
          followed_count?: number | null
          gender_id?: number | null
          given_name?: string | null
          id: string
          introduction?: string | null
          last_seen?: string | null
          quote?: string | null
          surname?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          follow_count?: number | null
          followed_count?: number | null
          gender_id?: number | null
          given_name?: string | null
          id?: string
          introduction?: string | null
          last_seen?: string | null
          quote?: string | null
          surname?: string | null
          updated_at?: string | null
          username?: string | null
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
      user_skills: {
        Row: {
          id: number
          skill_id: number
          user_id: number
        }
        Insert: {
          id?: number
          skill_id: number
          user_id: number
        }
        Update: {
          id?: number
          skill_id?: number
          user_id?: number
        }
      }
      user_socials: {
        Row: {
          id: number
          social_id: number
          user_id: number
        }
        Insert: {
          id?: number
          social_id: number
          user_id: number
        }
        Update: {
          id?: number
          social_id?: number
          user_id?: number
        }
      }
      users: {
        Row: {
          auth_id: string | null
          avatar: string | null
          cover_image: string | null
          created_at: string | null
          dob: string | null
          email: string
          follow_count: number | null
          followed_count: number | null
          gender_id: number | null
          given_name: string
          id: number
          introduction: string | null
          last_seen: string | null
          quote: string | null
          surname: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          auth_id?: string | null
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          dob?: string | null
          email: string
          follow_count?: number | null
          followed_count?: number | null
          gender_id?: number | null
          given_name: string
          id?: number
          introduction?: string | null
          last_seen?: string | null
          quote?: string | null
          surname: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          auth_id?: string | null
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string
          follow_count?: number | null
          followed_count?: number | null
          gender_id?: number | null
          given_name?: string
          id?: number
          introduction?: string | null
          last_seen?: string | null
          quote?: string | null
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
          body: string | null
          bortle_rating: number | null
          created_at: string | null
          featured_image: string | null
          id: number
          location_id: number
          logo: string | null
          name: string
          socials_id: number | null
        }
        Insert: {
          body?: string | null
          bortle_rating?: number | null
          created_at?: string | null
          featured_image?: string | null
          id?: number
          location_id: number
          logo?: string | null
          name: string
          socials_id?: number | null
        }
        Update: {
          body?: string | null
          bortle_rating?: number | null
          created_at?: string | null
          featured_image?: string | null
          id?: number
          location_id?: number
          logo?: string | null
          name?: string
          socials_id?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_skills: {
        Args: {
          userid: number
          skillids: number[]
        }
        Returns: undefined
      }
      get_event_hosts: {
        Args: {
          p_event_id: number
        }
        Returns: Json
      }
      get_event_single: {
        Args: {
          eventid: number
        }
        Returns: {
          id: number
          created_at: string
          date: string
          title: string
          body: string
          featured_image: string
          venue: Json
          hosts: Json
        }[]
      }
      get_event_venue: {
        Args: {
          p_venue_id: number
        }
        Returns: Json
      }
      get_events_many: {
        Args: {
          p_limit?: number
        }
        Returns: {
          id: number
          created_at: string
          date: string
          title: string
          body: string
          featured_image: string
          venue: Json
          hosts: Json
        }[]
      }
      get_location: {
        Args: {
          p_location_id: number
        }
        Returns: Json
      }
      get_user_followed: {
        Args: {
          userid: number
        }
        Returns: {
          id: number
          given_name: string
          surname: string
          username: string
          avatar: string
          last_seen: string
          introduction: string
          follow_count: number
          followed_count: number
          user_roles: Json
          is_connection: boolean
        }[]
      }
      get_user_followers: {
        Args: {
          userid: number
        }
        Returns: {
          id: number
          given_name: string
          surname: string
          username: string
          avatar: string
          last_seen: string
          introduction: string
          follow_count: number
          followed_count: number
          user_roles: Json
          is_connection: boolean
        }[]
      }
      get_user_languages: {
        Args: {
          p_user_id: number
        }
        Returns: Json
      }
      get_user_locations: {
        Args: {
          p_user_id: number
        }
        Returns: Json
      }
      get_user_main_role: {
        Args: {
          userid: number
        }
        Returns: Json
      }
      get_user_role_main: {
        Args: {
          userid: number
        }
        Returns: Json
      }
      get_user_roles: {
        Args: {
          current_user_id: number
        }
        Returns: Json
      }
      get_user_single: {
        Args: {
          p_user_id: number
          p_current_user_id: number
        }
        Returns: {
          id: number
          given_name: string
          surname: string
          username: string
          email: string
          avatar: string
          cover_image: string
          introduction: string
          quote: string
          follow_count: number
          followed_count: number
          last_seen: string
          created_at: string
          updated_at: string
          dob: string
          gender_id: number
          user_roles: Json
          main_role: Json
          user_skills: Json
          user_languages: Json
          user_socials: Json
          user_locations: Json
          is_following: boolean
        }[]
      }
      get_user_skills: {
        Args: {
          p_user_id: number
        }
        Returns: Json
      }
      get_user_socials: {
        Args: {
          p_user_id: number
        }
        Returns: Json
      }
      get_users_many: {
        Args: {
          p_user_id: number
        }
        Returns: {
          id: number
          given_name: string
          surname: string
          username: string
          avatar: string
          introduction: string
          follow_count: number
          followed_count: number
          email: string
          last_seen: string
          main_role: Json
          is_following: boolean
          user_roles: Json
        }[]
      }
      get_venue_avg_rating: {
        Args: {
          p_venue_id: number
        }
        Returns: number
      }
      get_venue_event_count: {
        Args: {
          venueid: number
        }
        Returns: number
      }
      get_venue_events: {
        Args: {
          p_venue_id: number
        }
        Returns: Json
      }
      get_venue_single: {
        Args: {
          p_venue_id: number
        }
        Returns: {
          id: number
          bortle_rating: number
          created_at: string
          name: string
          body: string
          featured_image: string
          logo: string
          avg_rating: number
          location: Json
          events: Json
        }[]
      }
      get_venues_many: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
          name: string
          body: string
          logo: string
          featured_image: string
          location: Json
          rating: number
          events_hosted: number
        }[]
      }
      is_follower: {
        Args: {
          followerid: number
          followedid: number
        }
        Returns: boolean
      }
      post_user_roles: {
        Args: {
          p_user_ids: number[]
          p_role_id: number
        }
        Returns: undefined
      }
      update_follow_count: {
        Args: {
          userid: number
        }
        Returns: undefined
      }
      upsert_skill_endorsements: {
        Args: {
          userid: number
          skillids: number[]
          ratings: number[]
          endorserid: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


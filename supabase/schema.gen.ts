export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_type: Database["public"]["Enums"]["address_type"] | null
          city_id: number
          company_id: number | null
          country_id: number
          created_at: string | null
          id: number
          is_primary: boolean | null
          name: string | null
          street1: string
          street2: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_type?: Database["public"]["Enums"]["address_type"] | null
          city_id: number
          company_id?: number | null
          country_id: number
          created_at?: string | null
          id?: number
          is_primary?: boolean | null
          name?: string | null
          street1: string
          street2?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_type?: Database["public"]["Enums"]["address_type"] | null
          city_id?: number
          company_id?: number | null
          country_id?: number
          created_at?: string | null
          id?: number
          is_primary?: boolean | null
          name?: string | null
          street1?: string
          street2?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_city"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          body: string | null
          created_at: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          country_id: number
          id: number
          name: string
          state: string | null
        }
        Insert: {
          country_id: number
          id?: number
          name: string
          state?: string | null
        }
        Update: {
          country_id?: number
          id?: number
          name?: string
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          founding_year: number | null
          id: number
          is_government: boolean
          last_scraped_at: string | null
          logo_url: string | null
          name: string
          scrape_frequency:
            | Database["public"]["Enums"]["scrape_frequency"]
            | null
          social_media_id: number | null
          updated_at: string | null
          website_url: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          id?: number
          is_government?: boolean
          last_scraped_at?: string | null
          logo_url?: string | null
          name: string
          scrape_frequency?:
            | Database["public"]["Enums"]["scrape_frequency"]
            | null
          social_media_id?: number | null
          updated_at?: string | null
          website_url: string
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          id?: number
          is_government?: boolean
          last_scraped_at?: string | null
          logo_url?: string | null
          name?: string
          scrape_frequency?:
            | Database["public"]["Enums"]["scrape_frequency"]
            | null
          social_media_id?: number | null
          updated_at?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_social_media"
            columns: ["social_media_id"]
            isOneToOne: false
            referencedRelation: "social_media"
            referencedColumns: ["id"]
          },
        ]
      }
      company_employees: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          company_id: number
          created_at: string | null
          end_date: string | null
          job_description: string | null
          role: string
          start_date: string | null
          status: boolean | null
          updated_at: string | null
          user_profile_id: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          company_id: number
          created_at?: string | null
          end_date?: string | null
          job_description?: string | null
          role: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_profile_id: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          company_id?: number
          created_at?: string | null
          end_date?: string | null
          job_description?: string | null
          role?: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_employees_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_news: {
        Row: {
          company_id: number
          created_at: string | null
          importance_level:
            | Database["public"]["Enums"]["news_importance_level"]
            | null
          news_id: number
          relation_type: Database["public"]["Enums"]["news_relation_type"]
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          importance_level?:
            | Database["public"]["Enums"]["news_importance_level"]
            | null
          news_id: number
          relation_type: Database["public"]["Enums"]["news_relation_type"]
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          importance_level?:
            | Database["public"]["Enums"]["news_importance_level"]
            | null
          news_id?: number
          relation_type?: Database["public"]["Enums"]["news_relation_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_news_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_news_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company_id: number | null
          contact_type: Database["public"]["Enums"]["contact_type"] | null
          created_at: string | null
          email: string | null
          id: number
          is_primary: boolean | null
          phone: string | null
          privacy_level: Database["public"]["Enums"]["privacy_level"] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: number | null
          contact_type?: Database["public"]["Enums"]["contact_type"] | null
          created_at?: string | null
          email?: string | null
          id?: number
          is_primary?: boolean | null
          phone?: string | null
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: number | null
          contact_type?: Database["public"]["Enums"]["contact_type"] | null
          created_at?: string | null
          email?: string | null
          id?: number
          is_primary?: boolean | null
          phone?: string | null
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          created_at: string | null
          id: number
          type: string
          vector: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          type: string
          vector?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          type?: string
          vector?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          body: string
          category_id: number
          created_at: string
          description: string | null
          featured_image: string | null
          has_summary: boolean
          id: number
          published_at: string | null
          source: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          author?: string | null
          body: string
          category_id?: number
          created_at?: string
          description?: string | null
          featured_image?: string | null
          has_summary?: boolean
          id?: number
          published_at?: string | null
          source: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          author?: string | null
          body?: string
          category_id?: number
          created_at?: string
          description?: string | null
          featured_image?: string | null
          has_summary?: boolean
          id?: number
          published_at?: string | null
          source?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news_embeddings: {
        Row: {
          embedding_id: number
          id: number
          news_id: number
        }
        Insert: {
          embedding_id: number
          id?: number
          news_id: number
        }
        Update: {
          embedding_id?: number
          id?: number
          news_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_embeddings_embedding_id_fkey"
            columns: ["embedding_id"]
            isOneToOne: false
            referencedRelation: "embeddings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_embeddings_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_tags: {
        Row: {
          id: number
          news_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          news_id: number
          tag_id: number
        }
        Update: {
          id?: number
          news_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_tags_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      research: {
        Row: {
          author: string | null
          body: string | null
          created_at: string
          description: string | null
          id: string
          published_at: string | null
          title: string | null
          updated_at: string | null
          url: string
          version: number | null
        }
        Insert: {
          author?: string | null
          body?: string | null
          created_at?: string
          description?: string | null
          id?: string
          published_at?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
          version?: number | null
        }
        Update: {
          author?: string | null
          body?: string | null
          created_at?: string
          description?: string | null
          id?: string
          published_at?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
          version?: number | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string | null
          downvotes: number | null
          id: number
          output: string
          search_id: number
          upvotes: number | null
        }
        Insert: {
          created_at?: string | null
          downvotes?: number | null
          id?: number
          output: string
          search_id: number
          upvotes?: number | null
        }
        Update: {
          created_at?: string | null
          downvotes?: number | null
          id?: number
          output?: string
          search_id?: number
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "searches"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          body: string | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      searches: {
        Row: {
          created_at: string | null
          id: number
          input: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          input: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          input?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media: {
        Row: {
          created_at: string | null
          facebook_url: string | null
          id: number
          instagram_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          updated_at: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string | null
          facebook_url?: string | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string | null
          facebook_url?: string | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_followers: {
        Row: {
          created_at: string | null
          followed_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          followed_id: string
          follower_id: string
          id: string
        }
        Update: {
          created_at?: string | null
          followed_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar: string | null
          cover_image: string | null
          created_at: string | null
          dob: string | null
          email: string
          followed_count: number | null
          followers_count: number | null
          gender_id: number | null
          given_name: string | null
          id: string
          introduction: string | null
          last_seen: string | null
          quote: string | null
          role_id: number
          surname: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          dob?: string | null
          email: string
          followed_count?: number | null
          followers_count?: number | null
          gender_id?: number | null
          given_name?: string | null
          id?: string
          introduction?: string | null
          last_seen?: string | null
          quote?: string | null
          role_id?: number
          surname?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string
          followed_count?: number | null
          followers_count?: number | null
          gender_id?: number | null
          given_name?: string | null
          id?: string
          introduction?: string | null
          last_seen?: string | null
          quote?: string | null
          role_id?: number
          surname?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      access_level: "Viewer" | "Editor" | "Admin" | "Super Admin"
      address_type:
        | "Residential"
        | "Headquarters"
        | "Office"
        | "Factory"
        | "Lab"
        | "Warehouse"
        | "R&D"
        | "Retail"
        | "Showroom"
        | "Branch"
      contact_type:
        | "Personal"
        | "Company"
        | "Professional"
        | "Recruitment"
        | "Founder"
      news_importance_level: "High" | "Medium" | "Low"
      news_relation_type: "Source" | "Topic" | "Mention"
      privacy_level: "Private" | "Connected" | "Public"
      scrape_frequency:
        | "FourTimesDaily"
        | "TwiceDaily"
        | "Daily"
        | "Weekly"
        | "BiWeekly"
        | "Monthly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never


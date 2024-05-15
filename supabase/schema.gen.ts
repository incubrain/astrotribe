export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
          address_type: Database['public']['Enums']['address_type'] | null
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
          address_type?: Database['public']['Enums']['address_type'] | null
          city_id: number
          company_id?: number | null
          country_id: number
          created_at?: string | null
          id?: never
          is_primary?: boolean | null
          name?: string | null
          street1: string
          street2?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_type?: Database['public']['Enums']['address_type'] | null
          city_id?: number
          company_id?: number | null
          country_id?: number
          created_at?: string | null
          id?: never
          is_primary?: boolean | null
          name?: string | null
          street1?: string
          street2?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_city_id'
            columns: ['city_id']
            isOneToOne: false
            referencedRelation: 'cities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_company_id'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_country_id'
            columns: ['country_id']
            isOneToOne: false
            referencedRelation: 'countries'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_user_id'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
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
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: never
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
          id?: never
          name: string
          state?: string | null
        }
        Update: {
          country_id?: number
          id?: never
          name?: string
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_country_id'
            columns: ['country_id']
            isOneToOne: false
            referencedRelation: 'countries'
            referencedColumns: ['id']
          }
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
          scrape_frequency: Database['public']['Enums']['scrape_frequency'] | null
          social_media_id: number | null
          updated_at: string | null
          website_url: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          id?: never
          is_government?: boolean
          last_scraped_at?: string | null
          logo_url?: string | null
          name: string
          scrape_frequency?: Database['public']['Enums']['scrape_frequency'] | null
          social_media_id?: number | null
          updated_at?: string | null
          website_url: string
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          id?: never
          is_government?: boolean
          last_scraped_at?: string | null
          logo_url?: string | null
          name?: string
          scrape_frequency?: Database['public']['Enums']['scrape_frequency'] | null
          social_media_id?: number | null
          updated_at?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_category_id'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_social_media_id'
            columns: ['social_media_id']
            isOneToOne: false
            referencedRelation: 'social_media'
            referencedColumns: ['id']
          }
        ]
      }
      company_employees: {
        Row: {
          access_level: Database['public']['Enums']['access_level']
          company_id: number
          created_at: string | null
          end_date: string | null
          id: number
          job_description: string | null
          role: string
          start_date: string | null
          status: boolean | null
          updated_at: string | null
          user_profile_id: string
        }
        Insert: {
          access_level?: Database['public']['Enums']['access_level']
          company_id: number
          created_at?: string | null
          end_date?: string | null
          id?: never
          job_description?: string | null
          role: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_profile_id: string
        }
        Update: {
          access_level?: Database['public']['Enums']['access_level']
          company_id?: number
          created_at?: string | null
          end_date?: string | null
          id?: never
          job_description?: string | null
          role?: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company_id'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_user_id'
            columns: ['user_profile_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      company_news: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          importance_level: Database['public']['Enums']['news_importance_level'] | null
          news_id: number
          relation_type: Database['public']['Enums']['news_relation_type']
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: never
          importance_level?: Database['public']['Enums']['news_importance_level'] | null
          news_id: number
          relation_type?: Database['public']['Enums']['news_relation_type']
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: never
          importance_level?: Database['public']['Enums']['news_importance_level'] | null
          news_id?: number
          relation_type?: Database['public']['Enums']['news_relation_type']
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company_id'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_news_id'
            columns: ['news_id']
            isOneToOne: false
            referencedRelation: 'news'
            referencedColumns: ['id']
          }
        ]
      }
      contacts: {
        Row: {
          company_id: number | null
          contact_type: Database['public']['Enums']['contact_type'] | null
          created_at: string | null
          email: string | null
          id: number
          is_primary: boolean | null
          phone: string | null
          privacy_level: Database['public']['Enums']['privacy_level'] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: number | null
          contact_type?: Database['public']['Enums']['contact_type'] | null
          created_at?: string | null
          email?: string | null
          id?: never
          is_primary?: boolean | null
          phone?: string | null
          privacy_level?: Database['public']['Enums']['privacy_level'] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: number | null
          contact_type?: Database['public']['Enums']['contact_type'] | null
          created_at?: string | null
          email?: string | null
          id?: never
          is_primary?: boolean | null
          phone?: string | null
          privacy_level?: Database['public']['Enums']['privacy_level'] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company_id'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_user_id'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
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
          id?: never
          name: string
        }
        Update: {
          code?: string
          id?: never
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
          id?: never
          type: string
          vector?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          type?: string
          vector?: string | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          created_at: string
          device_info: string | null
          feedback_type: Database['public']['Enums']['feedback_type'] | null
          id: number
          message: string
          page_identifier: string
          resolution_comment: string | null
          status: Database['public']['Enums']['feedback_status'] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          feedback_type?: Database['public']['Enums']['feedback_type'] | null
          id?: never
          message: string
          page_identifier: string
          resolution_comment?: string | null
          status?: Database['public']['Enums']['feedback_status'] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: string | null
          feedback_type?: Database['public']['Enums']['feedback_type'] | null
          id?: never
          message?: string
          page_identifier?: string
          resolution_comment?: string | null
          status?: Database['public']['Enums']['feedback_status'] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_user_id'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      news: {
        Row: {
          author: string | null
          body: string
          category_id: number
          created_at: string | null
          description: string | null
          featured_image: string | null
          has_summary: boolean
          id: number
          published_at: string | null
          source: string
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          author?: string | null
          body: string
          category_id?: number
          created_at?: string | null
          description?: string | null
          featured_image?: string | null
          has_summary?: boolean
          id?: never
          published_at?: string | null
          source: string
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          author?: string | null
          body?: string
          category_id?: number
          created_at?: string | null
          description?: string | null
          featured_image?: string | null
          has_summary?: boolean
          id?: never
          published_at?: string | null
          source?: string
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_category_id'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
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
          id?: never
          news_id: number
        }
        Update: {
          embedding_id?: number
          id?: never
          news_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'fk_embedding_id'
            columns: ['embedding_id']
            isOneToOne: false
            referencedRelation: 'embeddings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_news_id'
            columns: ['news_id']
            isOneToOne: false
            referencedRelation: 'news'
            referencedColumns: ['id']
          }
        ]
      }
      news_tags: {
        Row: {
          id: number
          news_id: number
          tag_id: number
        }
        Insert: {
          id?: never
          news_id: number
          tag_id: number
        }
        Update: {
          id?: never
          news_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'fk_news_id'
            columns: ['news_id']
            isOneToOne: false
            referencedRelation: 'news'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_tag_id'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      plan_permissions: {
        Row: {
          feature: string
          id: number
          plan: Database['public']['Enums']['app_plan_enum']
        }
        Insert: {
          feature: string
          id?: never
          plan: Database['public']['Enums']['app_plan_enum']
        }
        Update: {
          feature?: string
          id?: never
          plan?: Database['public']['Enums']['app_plan_enum']
        }
        Relationships: []
      }
      research: {
        Row: {
          author: string | null
          body: string | null
          created_at: string
          description: string | null
          id: number
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
          id?: never
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
          id?: never
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
          id?: never
          output: string
          search_id: number
          upvotes?: number | null
        }
        Update: {
          created_at?: string | null
          downvotes?: number | null
          id?: never
          output?: string
          search_id?: number
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_search_id'
            columns: ['search_id']
            isOneToOne: false
            referencedRelation: 'searches'
            referencedColumns: ['id']
          }
        ]
      }
      role_permissions: {
        Row: {
          delete: boolean | null
          id: number
          insert: boolean | null
          role: Database['public']['Enums']['app_role_enum']
          select: boolean | null
          table_name: string
          update: boolean | null
        }
        Insert: {
          delete?: boolean | null
          id?: never
          insert?: boolean | null
          role: Database['public']['Enums']['app_role_enum']
          select?: boolean | null
          table_name: string
          update?: boolean | null
        }
        Update: {
          delete?: boolean | null
          id?: never
          insert?: boolean | null
          role?: Database['public']['Enums']['app_role_enum']
          select?: boolean | null
          table_name?: string
          update?: boolean | null
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
          id?: never
          input: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          input?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_user_id'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
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
          id?: never
          instagram_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string | null
          facebook_url?: string | null
          id?: never
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
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: never
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
          id: number
        }
        Insert: {
          created_at?: string | null
          followed_id: string
          follower_id: string
          id?: never
        }
        Update: {
          created_at?: string | null
          followed_id?: string
          follower_id?: string
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: 'user_followers_followed_id_fkey'
            columns: ['followed_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_followers_follower_id_fkey'
            columns: ['follower_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
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
          plan: Database['public']['Enums']['app_plan_enum'] | null
          quote: string | null
          role: Database['public']['Enums']['app_role_enum']
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
          id: string
          introduction?: string | null
          last_seen?: string | null
          plan?: Database['public']['Enums']['app_plan_enum'] | null
          quote?: string | null
          role?: Database['public']['Enums']['app_role_enum']
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
          plan?: Database['public']['Enums']['app_plan_enum'] | null
          quote?: string | null
          role?: Database['public']['Enums']['app_role_enum']
          surname?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_auth_id'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_authorize_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      assign_role_permissions_from_config: {
        Args: {
          json_config: Json
        }
        Returns: undefined
      }
      authorize: {
        Args: {
          requested_permission: string
        }
        Returns: boolean
      }
      binary_quantize:
        | {
            Args: {
              '': string
            }
            Returns: unknown
          }
        | {
            Args: {
              '': unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          '': number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          '': unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              '': unknown
            }
            Returns: number
          }
        | {
            Args: {
              '': unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              '': string
            }
            Returns: string
          }
        | {
            Args: {
              '': unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              '': unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          '': unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          '': number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              '': string
            }
            Returns: number
          }
        | {
            Args: {
              '': unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          '': string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          '': string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          '': string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      access_level: 'viewer' | 'editor' | 'admin' | 'super_admin'
      address_type:
        | 'residential'
        | 'headquarters'
        | 'office'
        | 'factory'
        | 'lab'
        | 'warehouse'
        | 'research'
        | 'retail'
        | 'showroom'
        | 'branch'
      app_plan_enum: 'free' | 'basic' | 'intermediate' | 'premium' | 'enterprise' | 'custom'
      app_role_enum:
        | 'guest'
        | 'user'
        | 'astroguide'
        | 'mentor'
        | 'moderator'
        | 'tenant_member'
        | 'tenant_admin'
        | 'tenant_super_admin'
        | 'admin'
        | 'super_admin'
      contact_type: 'personal' | 'company' | 'professional' | 'recruitment' | 'founder'
      feedback_status:
        | 'new'
        | 'under_review'
        | 'backlog'
        | 'working_on'
        | 'resolved'
        | 'rejected'
        | 'deferred'
      feedback_type:
        | 'bug_report'
        | 'feature_request'
        | 'user_interface_issue'
        | 'performance_issue'
        | 'documentation'
      news_importance_level: 'high' | 'medium' | 'low'
      news_relation_type: 'source' | 'topic' | 'mention'
      privacy_level: 'private' | 'connected' | 'public'
      scrape_frequency:
        | 'four_times_daily'
        | 'twice_daily'
        | 'daily'
        | 'weekly'
        | 'bi_weekly'
        | 'monthly'
      user_status: 'online' | 'offline'
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
            foreignKeyName: 'objects_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          }
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
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          }
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
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
            columns: ['upload_id']
            isOneToOne: false
            referencedRelation: 's3_multipart_uploads'
            referencedColumns: ['id']
          }
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never

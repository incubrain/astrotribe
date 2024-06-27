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
          id: number
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
            foreignKeyName: 'fk_city'
            columns: ['city_id']
            isOneToOne: false
            referencedRelation: 'cities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_country'
            columns: ['country_id']
            isOneToOne: false
            referencedRelation: 'countries'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_addresses_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_addresses_user_id_fkey'
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
          created_at: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id: number
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
          id: number
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
            foreignKeyName: 'fk_country'
            columns: ['country_id']
            isOneToOne: false
            referencedRelation: 'countries'
            referencedColumns: ['id']
          }
        ]
      }
      companies: {
        Row: {
          category: string | null
          category_id: number | null
          created_at: string | null
          description: string | null
          founding_year: number | null
          id: number
          is_government: boolean
          keywords: string[] | null
          logo_url: string | null
          name: string
          scrape_frequency: Database['public']['Enums']['scrape_frequency'] | null
          social_media_id: number | null
          updated_at: string | null
          website_url: string
        }
        Insert: {
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          id?: number
          is_government?: boolean
          keywords?: string[] | null
          logo_url?: string | null
          name: string
          scrape_frequency?: Database['public']['Enums']['scrape_frequency'] | null
          social_media_id?: number | null
          updated_at?: string | null
          website_url: string
        }
        Update: {
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          id?: number
          is_government?: boolean
          keywords?: string[] | null
          logo_url?: string | null
          name?: string
          scrape_frequency?: Database['public']['Enums']['scrape_frequency'] | null
          social_media_id?: number | null
          updated_at?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_category'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_social_media'
            columns: ['social_media_id']
            isOneToOne: false
            referencedRelation: 'social_media'
            referencedColumns: ['id']
          }
        ]
      }
      company_contacts: {
        Row: {
          company_id: number
          contact_id: number
          created_at: string
          id: number
          updated_at: string
        }
        Insert: {
          company_id: number
          contact_id: number
          created_at?: string
          id?: number
          updated_at?: string
        }
        Update: {
          company_id?: number
          contact_id?: number
          created_at?: string
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_contact'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
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
          job_description?: string | null
          role?: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'company_employees_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'company_employees_user_profile_id_fkey'
            columns: ['user_profile_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      company_extras: {
        Row: {
          category: string
          company_id: number
          created_at: string
          id: number
          level: number
          success: boolean
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          company_id: number
          created_at?: string
          id?: number
          level: number
          success: boolean
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          company_id?: number
          created_at?: string
          id?: number
          level?: number
          success?: boolean
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          }
        ]
      }
      company_news: {
        Row: {
          company_id: number
          created_at: string | null
          importance_level: Database['public']['Enums']['news_importance_level'] | null
          news_id: number
          relation_type: Database['public']['Enums']['news_relation_type']
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          importance_level?: Database['public']['Enums']['news_importance_level'] | null
          news_id: number
          relation_type: Database['public']['Enums']['news_relation_type']
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          importance_level?: Database['public']['Enums']['news_importance_level'] | null
          news_id?: number
          relation_type?: Database['public']['Enums']['news_relation_type']
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'company_news_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          }
        ]
      }
      company_urls: {
        Row: {
          category: string
          company_id: number
          created_at: string
          data: Json | null
          id: number
          level: number
          success: boolean
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          company_id: number
          created_at?: string
          data?: Json | null
          id?: number
          level: number
          success: boolean
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          company_id?: number
          created_at?: string
          data?: Json | null
          id?: number
          level?: number
          success?: boolean
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
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
          id: number
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
          id?: number
          is_primary?: boolean | null
          phone?: string | null
          privacy_level?: Database['public']['Enums']['privacy_level'] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_company'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fk_user'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      content_sources: {
        Row: {
          content_type: Database['public']['Enums']['content_type']
          created_at: string | null
          description: string | null
          has_errors: boolean
          id: number
          is_outdated: boolean | null
          last_scraped: string | null
          link_scraper_id: number | null
          name: string
          paginated_url: string | null
          scrape_frequency: Database['public']['Enums']['scrape_frequency']
          updated_at: string | null
          url: string
        }
        Insert: {
          content_type: Database['public']['Enums']['content_type']
          created_at?: string | null
          description?: string | null
          has_errors?: boolean
          id?: number
          is_outdated?: boolean | null
          last_scraped?: string | null
          link_scraper_id?: number | null
          name: string
          paginated_url?: string | null
          scrape_frequency: Database['public']['Enums']['scrape_frequency']
          updated_at?: string | null
          url: string
        }
        Update: {
          content_type?: Database['public']['Enums']['content_type']
          created_at?: string | null
          description?: string | null
          has_errors?: boolean
          id?: number
          is_outdated?: boolean | null
          last_scraped?: string | null
          link_scraper_id?: number | null
          name?: string
          paginated_url?: string | null
          scrape_frequency?: Database['public']['Enums']['scrape_frequency']
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_content_sources_link_scraper_id_fkey'
            columns: ['link_scraper_id']
            isOneToOne: false
            referencedRelation: 'scraper_configs'
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
          id: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      embedding_review: {
        Row: {
          agent_review: boolean | null
          created_at: string
          human_review: boolean | null
          id: number
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          agent_review?: boolean | null
          created_at?: string
          human_review?: boolean | null
          id?: number
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_review?: boolean | null
          created_at?: string
          human_review?: boolean | null
          id?: number
          notes?: string | null
          updated_at?: string | null
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
          id?: number
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
          id?: number
          message?: string
          page_identifier?: string
          resolution_comment?: string | null
          status?: Database['public']['Enums']['feedback_status'] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_user'
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
          body: string | null
          category_id: number
          created_at: string
          description: string | null
          featured_image: string | null
          has_summary: boolean
          hash: number | null
          id: string
          published_at: string | null
          source: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          author?: string | null
          body?: string | null
          category_id?: number
          created_at?: string
          description?: string | null
          featured_image?: string | null
          has_summary?: boolean
          hash?: number | null
          id?: string
          published_at?: string | null
          source: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          author?: string | null
          body?: string | null
          category_id?: number
          created_at?: string
          description?: string | null
          featured_image?: string | null
          has_summary?: boolean
          hash?: number | null
          id?: string
          published_at?: string | null
          source?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'news_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      news_embeddings: {
        Row: {
          chunk: string | null
          embedding: string | null
          id: number
          news_id: number
        }
        Insert: {
          chunk?: string | null
          embedding?: string | null
          id: number
          news_id: number
        }
        Update: {
          chunk?: string | null
          embedding?: string | null
          id?: number
          news_id?: number
        }
        Relationships: []
      }
      news_tags: {
        Row: {
          id: number
          news_id: number
          tag_id: number
        }
        Insert: {
          id: number
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
            foreignKeyName: 'news_tags_tag_id_fkey'
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
          id?: number
          plan: Database['public']['Enums']['app_plan_enum']
        }
        Update: {
          feature?: string
          id?: number
          plan?: Database['public']['Enums']['app_plan_enum']
        }
        Relationships: []
      }
      research: {
        Row: {
          abstract: string | null
          abstract_url: string
          affiliations: string[] | null
          authors: Json | null
          category: string | null
          comments: string | null
          created_at: string
          doi_url: string | null
          figure_count: number | null
          fts: unknown | null
          has_embedding: boolean | null
          id: string
          is_flagged: boolean
          keywords: string | null
          month: string | null
          page_count: number | null
          pdf_url: string | null
          published_at: string | null
          published_in: string | null
          table_count: number | null
          title: string | null
          updated_at: string | null
          version: number | null
          year: string | null
        }
        Insert: {
          abstract?: string | null
          abstract_url: string
          affiliations?: string[] | null
          authors?: Json | null
          category?: string | null
          comments?: string | null
          created_at?: string
          doi_url?: string | null
          figure_count?: number | null
          fts?: unknown | null
          has_embedding?: boolean | null
          id?: string
          is_flagged?: boolean
          keywords?: string | null
          month?: string | null
          page_count?: number | null
          pdf_url?: string | null
          published_at?: string | null
          published_in?: string | null
          table_count?: number | null
          title?: string | null
          updated_at?: string | null
          version?: number | null
          year?: string | null
        }
        Update: {
          abstract?: string | null
          abstract_url?: string
          affiliations?: string[] | null
          authors?: Json | null
          category?: string | null
          comments?: string | null
          created_at?: string
          doi_url?: string | null
          figure_count?: number | null
          fts?: unknown | null
          has_embedding?: boolean | null
          id?: string
          is_flagged?: boolean
          keywords?: string | null
          month?: string | null
          page_count?: number | null
          pdf_url?: string | null
          published_at?: string | null
          published_in?: string | null
          table_count?: number | null
          title?: string | null
          updated_at?: string | null
          version?: number | null
          year?: string | null
        }
        Relationships: []
      }
      research_authors: {
        Row: {
          affiliations: string[] | null
          created_at: string
          email: string | null
          id: string
          is_flagged: boolean | null
          name: string
          research_urls: string[] | null
          updated_at: string
          url: string
        }
        Insert: {
          affiliations?: string[] | null
          created_at?: string
          email?: string | null
          id?: string
          is_flagged?: boolean | null
          name: string
          research_urls?: string[] | null
          updated_at?: string
          url: string
        }
        Update: {
          affiliations?: string[] | null
          created_at?: string
          email?: string | null
          id?: string
          is_flagged?: boolean | null
          name?: string
          research_urls?: string[] | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      research_citations: {
        Row: {
          author: string | null
          created_at: string
          id: string
          is_flagged: boolean | null
          research_urls: string[] | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          id: string
          is_flagged?: boolean | null
          research_urls?: string[] | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          author?: string | null
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          research_urls?: string[] | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      research_embeddings: {
        Row: {
          chunk: string
          created_at: string | null
          embedding: string | null
          embedding_review_id: number | null
          id: number
          is_flagged: boolean | null
          research_id: string
          updated_at: string
          url: string | null
        }
        Insert: {
          chunk: string
          created_at?: string | null
          embedding?: string | null
          embedding_review_id?: number | null
          id?: number
          is_flagged?: boolean | null
          research_id: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          chunk?: string
          created_at?: string | null
          embedding?: string | null
          embedding_review_id?: number | null
          id?: number
          is_flagged?: boolean | null
          research_id?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_research_embeddings_embedding_review_id_fkey'
            columns: ['embedding_review_id']
            isOneToOne: false
            referencedRelation: 'embedding_review'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_research_embeddings_research_id_fkey'
            columns: ['research_id']
            isOneToOne: true
            referencedRelation: 'research'
            referencedColumns: ['id']
          }
        ]
      }
      research_figures: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_flagged: boolean | null
          research_url: string | null
          src: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id: string
          is_flagged?: boolean | null
          research_url?: string | null
          src: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          research_url?: string | null
          src?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_math: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_flagged: boolean | null
          latex: string
          research_urls: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          is_flagged?: boolean | null
          latex: string
          research_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_flagged?: boolean | null
          latex?: string
          research_urls?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      research_metrics: {
        Row: {
          chunks: Json
          count: Json | null
          created_at: string
          error_count: number | null
          errors: Json | null
          id: number
          length: Json | null
          performance: Json | null
          token_usage: Json | null
          type: string | null
          updated_at: string
        }
        Insert: {
          chunks: Json
          count?: Json | null
          created_at?: string
          error_count?: number | null
          errors?: Json | null
          id?: number
          length?: Json | null
          performance?: Json | null
          token_usage?: Json | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          chunks?: Json
          count?: Json | null
          created_at?: string
          error_count?: number | null
          errors?: Json | null
          id?: number
          length?: Json | null
          performance?: Json | null
          token_usage?: Json | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      research_notes: {
        Row: {
          body: string
          created_at: string
          id: string
          is_flagged: boolean | null
          research_url: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id: string
          is_flagged?: boolean | null
          research_url?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          research_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      research_tables: {
        Row: {
          caption: string | null
          columns: Json
          created_at: string
          hash: string | null
          id: string
          is_flagged: boolean | null
          research_urls: string[] | null
          rows: Json
          updated_at: string
        }
        Insert: {
          caption?: string | null
          columns: Json
          created_at?: string
          hash?: string | null
          id: string
          is_flagged?: boolean | null
          research_urls?: string[] | null
          rows: Json
          updated_at?: string
        }
        Update: {
          caption?: string | null
          columns?: Json
          created_at?: string
          hash?: string | null
          id?: string
          is_flagged?: boolean | null
          research_urls?: string[] | null
          rows?: Json
          updated_at?: string
        }
        Relationships: []
      }
      research_tools: {
        Row: {
          created_at: string
          id: string
          is_flagged: boolean | null
          name: string | null
          research_urls: string[] | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          name?: string | null
          research_urls?: string[] | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          name?: string | null
          research_urls?: string[] | null
          updated_at?: string
          url?: string
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
            foreignKeyName: 'responses_search_id_fkey'
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
          id?: number
          insert?: boolean | null
          role: Database['public']['Enums']['app_role_enum']
          select?: boolean | null
          table_name: string
          update?: boolean | null
        }
        Update: {
          delete?: boolean | null
          id?: number
          insert?: boolean | null
          role?: Database['public']['Enums']['app_role_enum']
          select?: boolean | null
          table_name?: string
          update?: boolean | null
        }
        Relationships: []
      }
      scraper_configs: {
        Row: {
          base_selector: string | null
          created_at: string | null
          fields: Json
          id: number
          scraper_type: string
          updated_at: string | null
        }
        Insert: {
          base_selector?: string | null
          created_at?: string | null
          fields: Json
          id?: number
          scraper_type: string
          updated_at?: string | null
        }
        Update: {
          base_selector?: string | null
          created_at?: string | null
          fields?: Json
          id?: number
          scraper_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      searches: {
        Row: {
          created_at: string | null
          embedding: string | null
          id: number
          input: string
          tokens_used: number | null
          user_ids: string[] | null
        }
        Insert: {
          created_at?: string | null
          embedding?: string | null
          id?: number
          input: string
          tokens_used?: number | null
          user_ids?: string[] | null
        }
        Update: {
          created_at?: string | null
          embedding?: string | null
          id?: number
          input?: string
          tokens_used?: number | null
          user_ids?: string[] | null
        }
        Relationships: []
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
          id: number
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
      spider_metrics: {
        Row: {
          average_content_size: number
          average_time_per_url: number
          category_counts: Json
          created_at: string
          error_count: number
          failed_urls: Json
          id: number
          ignored_count: number
          total_content_size: number
          total_pages_attempted: number
          total_time: number
          total_urls_ignored: number
          total_urls_scraped: number
          unique_domains: number
        }
        Insert: {
          average_content_size: number
          average_time_per_url: number
          category_counts: Json
          created_at?: string
          error_count: number
          failed_urls: Json
          id?: number
          ignored_count: number
          total_content_size: number
          total_pages_attempted: number
          total_time: number
          total_urls_ignored: number
          total_urls_scraped: number
          unique_domains: number
        }
        Update: {
          average_content_size?: number
          average_time_per_url?: number
          category_counts?: Json
          created_at?: string
          error_count?: number
          failed_urls?: Json
          id?: number
          ignored_count?: number
          total_content_size?: number
          total_pages_attempted?: number
          total_time?: number
          total_urls_ignored?: number
          total_urls_scraped?: number
          unique_domains?: number
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
          id: number
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
            foreignKeyName: 'public_user_profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      research_metrics_monthly_totals: {
        Row: {
          avg_chunk_length: number | null
          largest_chunk_length: number | null
          month_start: string | null
          row_count: number | null
          smallest_chunk_length: number | null
          total_abstract_length: number | null
          total_authors: number | null
          total_authors_length: number | null
          total_chunk_length: number | null
          total_chunks: number | null
          total_citations: number | null
          total_citations_length: number | null
          total_figures: number | null
          total_figures_length: number | null
          total_math: number | null
          total_math_length: number | null
          total_notes: number | null
          total_notes_length: number | null
          total_tables: number | null
          total_tables_length: number | null
          total_tools: number | null
          total_tools_length: number | null
        }
        Relationships: []
      }
      research_metrics_totals: {
        Row: {
          avg_chunk_length: number | null
          largest_chunk_length: number | null
          row_count: number | null
          smallest_chunk_length: number | null
          total_abstract_length: number | null
          total_authors: number | null
          total_authors_length: number | null
          total_chunk_length: number | null
          total_chunks: number | null
          total_citations: number | null
          total_citations_length: number | null
          total_figures: number | null
          total_figures_length: number | null
          total_math: number | null
          total_math_length: number | null
          total_notes: number | null
          total_notes_length: number | null
          total_tables: number | null
          total_tables_length: number | null
          total_tools: number | null
          total_tools_length: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_authorize_rls_policies: {
        Args: Record<PropertyKey, never>
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
      calculate_monthly_research_metrics_totals: {
        Args: Record<PropertyKey, never>
        Returns: {
          month_start: string
          row_count: number
          total_chunks: number
          avg_chunk_length: number
          smallest_chunk_length: number
          largest_chunk_length: number
          total_citations: number
          total_figures: number
          total_math: number
          total_tables: number
          total_notes: number
          total_tools: number
          total_authors: number
          total_chunk_length: number
          total_math_length: number
          total_tools_length: number
          total_authors_length: number
          total_notes_length: number
          total_tables_length: number
          total_abstract_length: number
          total_citations_length: number
          total_figures_length: number
        }[]
      }
      calculate_research_metrics_totals: {
        Args: Record<PropertyKey, never>
        Returns: {
          row_count: number
          total_chunks: number
          avg_chunk_length: number
          smallest_chunk_length: number
          largest_chunk_length: number
          total_citations: number
          total_figures: number
          total_math: number
          total_tables: number
          total_notes: number
          total_tools: number
          total_authors: number
          total_chunk_length: number
          total_math_length: number
          total_tools_length: number
          total_authors_length: number
          total_notes_length: number
          total_tables_length: number
          total_abstract_length: number
          total_citations_length: number
          total_figures_length: number
        }[]
      }
      get_citation_ids_by_url:
        | {
            Args: {
              urls: string[]
            }
            Returns: {
              id: string
              url: string
            }[]
          }
        | {
            Args: {
              urls: string[]
            }
            Returns: {
              id: string
              url: string
            }[]
          }
      get_latest_articles: {
        Args: {
          base_urls: string[]
          return_limit: number
        }
        Returns: {
          id: string
          title: string
          url: string
          created_at: string
        }[]
      }
      get_math_ids_by_latex: {
        Args: {
          latexes: string[]
        }
        Returns: {
          id: string
          latex: string
        }[]
      }
      get_note_ids_by_body: {
        Args: {
          bodies: string[]
        }
        Returns: {
          id: string
          body: string
        }[]
      }
      get_table_ids_by_hashes: {
        Args: {
          hashes: string[]
        }
        Returns: {
          id: string
          hash: string
        }[]
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
      insert_company_news_by_source: {
        Args: {
          p_company_id: number
          p_source: string
        }
        Returns: undefined
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
      match_research: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          chunk: string
          created_at: string | null
          embedding: string | null
          embedding_review_id: number | null
          id: number
          is_flagged: boolean | null
          research_id: string
          updated_at: string
          url: string | null
        }[]
      }
      remove_placeholders: {
        Args: {
          text_array: string[]
        }
        Returns: string[]
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
      content_type: 'news' | 'events' | 'jobs' | 'research'
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

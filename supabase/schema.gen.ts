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
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
          },
        ]
      }
      blacklisted_domains: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          url?: string
        }
        Relationships: []
      }
      blacklisted_urls: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: number
          reason: string | null
          url: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: number
          reason?: string | null
          url: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: number
          reason?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_blacklisted_urls_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      bookmarks: {
        Row: {
          content_id: string
          content_type: Database['public']['Enums']['content_type']
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: Database['public']['Enums']['content_type']
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: Database['public']['Enums']['content_type']
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookmarks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
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
          },
        ]
      }
      classified_urls: {
        Row: {
          actual_category: Database['public']['Enums']['content_type'] | null
          added_to_training: boolean | null
          created_at: string | null
          id: number
          is_reviewed: boolean | null
          predicted_category: Database['public']['Enums']['content_type'] | null
          updated_at: string | null
          url: string
        }
        Insert: {
          actual_category?: Database['public']['Enums']['content_type'] | null
          added_to_training?: boolean | null
          created_at?: string | null
          id?: number
          is_reviewed?: boolean | null
          predicted_category?: Database['public']['Enums']['content_type'] | null
          updated_at?: string | null
          url: string
        }
        Update: {
          actual_category?: Database['public']['Enums']['content_type'] | null
          added_to_training?: boolean | null
          created_at?: string | null
          id?: number
          is_reviewed?: boolean | null
          predicted_category?: Database['public']['Enums']['content_type'] | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          content_id: string
          content_type: Database['public']['Enums']['content_type']
          created_at: string | null
          id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          content_id: string
          content_type: Database['public']['Enums']['content_type']
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          content_id?: string
          content_type?: Database['public']['Enums']['content_type']
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_parent_comment_id_fkey'
            columns: ['parent_comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      companies: {
        Row: {
          category: string | null
          category_id: number | null
          content_status: Database['public']['Enums']['content_status']
          created_at: string | null
          description: string | null
          failed_count: number | null
          founding_year: number | null
          id: string
          is_english: boolean | null
          is_government: boolean | null
          keywords: Json | null
          logo_url: string | null
          name: string | null
          scrape_frequency: Database['public']['Enums']['scrape_frequency'] | null
          scrape_rating: number | null
          scraped_at: string | null
          social_media_id: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          category?: string | null
          category_id?: number | null
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string | null
          description?: string | null
          failed_count?: number | null
          founding_year?: number | null
          id: string
          is_english?: boolean | null
          is_government?: boolean | null
          keywords?: Json | null
          logo_url?: string | null
          name?: string | null
          scrape_frequency?: Database['public']['Enums']['scrape_frequency'] | null
          scrape_rating?: number | null
          scraped_at?: string | null
          social_media_id?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: string | null
          category_id?: number | null
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string | null
          description?: string | null
          failed_count?: number | null
          founding_year?: number | null
          id?: string
          is_english?: boolean | null
          is_government?: boolean | null
          keywords?: Json | null
          logo_url?: string | null
          name?: string | null
          scrape_frequency?: Database['public']['Enums']['scrape_frequency'] | null
          scrape_rating?: number | null
          scraped_at?: string | null
          social_media_id?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_social_media'
            columns: ['social_media_id']
            isOneToOne: false
            referencedRelation: 'social_media'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_companies_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_companies_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
        ]
      }
      company_contacts: {
        Row: {
          company_id: string | null
          contact_id: number
          created_at: string
          id: number
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          contact_id: number
          created_at?: string
          id?: number
          updated_at?: string
        }
        Update: {
          company_id?: string | null
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
          },
        ]
      }
      company_employees: {
        Row: {
          access_level: Database['public']['Enums']['access_level']
          company_id: string | null
          created_at: string | null
          end_date: string | null
          job_description: string | null
          role: string
          start_date: string | null
          status: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level?: Database['public']['Enums']['access_level']
          company_id?: string | null
          created_at?: string | null
          end_date?: string | null
          job_description?: string | null
          role: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: Database['public']['Enums']['access_level']
          company_id?: string | null
          created_at?: string | null
          end_date?: string | null
          job_description?: string | null
          role?: string
          start_date?: string | null
          status?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'company_employees_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      company_extras: {
        Row: {
          body: string | null
          category: string
          company_id: string | null
          created_at: string
          found_count: number | null
          id: number
          level: number
          review: Json | null
          success: boolean | null
          updated_at: string
          url: string
        }
        Insert: {
          body?: string | null
          category: string
          company_id?: string | null
          created_at?: string
          found_count?: number | null
          id?: number
          level: number
          review?: Json | null
          success?: boolean | null
          updated_at?: string
          url: string
        }
        Update: {
          body?: string | null
          category?: string
          company_id?: string | null
          created_at?: string
          found_count?: number | null
          id?: number
          level?: number
          review?: Json | null
          success?: boolean | null
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
          },
        ]
      }
      company_metrics: {
        Row: {
          company_id: string
          crawl_id: string
          id: number
          metric_id: number | null
          timestamp: string
          value: Json
        }
        Insert: {
          company_id: string
          crawl_id: string
          id?: number
          metric_id?: number | null
          timestamp: string
          value: Json
        }
        Update: {
          company_id?: string
          crawl_id?: string
          id?: number
          metric_id?: number | null
          timestamp?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'company_metrics_metric_id_fkey'
            columns: ['metric_id']
            isOneToOne: false
            referencedRelation: 'metric_definitions'
            referencedColumns: ['id']
          },
        ]
      }
      company_urls: {
        Row: {
          category: string
          company_id: string | null
          content: string | null
          created_at: string
          distance: number | null
          id: number
          success: boolean | null
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          company_id?: string | null
          content?: string | null
          created_at?: string
          distance?: number | null
          id?: number
          success?: boolean | null
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          company_id?: string | null
          content?: string | null
          created_at?: string
          distance?: number | null
          id?: number
          success?: boolean | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_company_urls_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      contacts: {
        Row: {
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
          },
        ]
      }
      content_categories: {
        Row: {
          category_id: number
          content_id: string
          is_primary: boolean
        }
        Insert: {
          category_id: number
          content_id: string
          is_primary: boolean
        }
        Update: {
          category_id?: number
          content_id?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'content_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'content_categories_content_id_fkey'
            columns: ['content_id']
            isOneToOne: false
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
        ]
      }
      content_sources: {
        Row: {
          company_id: string | null
          content_type: Database['public']['Enums']['content_type']
          created_at: string | null
          expected_count: number | null
          failed_count: number | null
          has_failed: boolean | null
          hash: number | null
          id: number
          priority: Database['public']['Enums']['priority']
          refreshed_at: string | null
          scrape_frequency: Database['public']['Enums']['scrape_frequency']
          scraped_at: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          company_id?: string | null
          content_type: Database['public']['Enums']['content_type']
          created_at?: string | null
          expected_count?: number | null
          failed_count?: number | null
          has_failed?: boolean | null
          hash?: number | null
          id?: number
          priority: Database['public']['Enums']['priority']
          refreshed_at?: string | null
          scrape_frequency: Database['public']['Enums']['scrape_frequency']
          scraped_at?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          company_id?: string | null
          content_type?: Database['public']['Enums']['content_type']
          created_at?: string | null
          expected_count?: number | null
          failed_count?: number | null
          has_failed?: boolean | null
          hash?: number | null
          id?: number
          priority?: Database['public']['Enums']['priority']
          refreshed_at?: string | null
          scrape_frequency?: Database['public']['Enums']['scrape_frequency']
          scraped_at?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'content_sources_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      content_statuses: {
        Row: {
          content_id: string
          content_status: Database['public']['Enums']['content_status']
          created_at: string | null
          id: string
          notes: string | null
        }
        Insert: {
          content_id: string
          content_status: Database['public']['Enums']['content_status']
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          content_id?: string
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'content_statuses_content_id_fkey'
            columns: ['content_id']
            isOneToOne: false
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
        ]
      }
      content_tags: {
        Row: {
          content_id: string
          tag_id: number
        }
        Insert: {
          content_id: string
          tag_id: number
        }
        Update: {
          content_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'content_tags_content_id_fkey'
            columns: ['content_id']
            isOneToOne: false
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'content_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          },
        ]
      }
      contents: {
        Row: {
          content_type: Database['public']['Enums']['content_type']
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          content_type?: Database['public']['Enums']['content_type']
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          content_type?: Database['public']['Enums']['content_type']
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          code_3: string | null
          id: number
          name: string
        }
        Insert: {
          code: string
          code_3?: string | null
          id: number
          name: string
        }
        Update: {
          code?: string
          code_3?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      customer_payments: {
        Row: {
          acquirer_data: Json | null
          amount: number
          amount_refunded: number | null
          amount_transferred: number | null
          bank: string | null
          captured: boolean | null
          created_at: string | null
          currency: string
          description: string | null
          error_code: string | null
          error_description: string | null
          error_reason: string | null
          error_source: string | null
          error_step: string | null
          external_order_id: string | null
          external_payment_id: string
          fee: number | null
          id: number
          international: boolean | null
          invoice_id: string | null
          method: string | null
          notes: Json | null
          order_id: string | null
          payment_provider_id: number
          refund_status: string | null
          status: string
          subscription_id: number | null
          tax: number | null
          user_id: string
          vpa: string | null
          wallet: string | null
        }
        Insert: {
          acquirer_data?: Json | null
          amount: number
          amount_refunded?: number | null
          amount_transferred?: number | null
          bank?: string | null
          captured?: boolean | null
          created_at?: string | null
          currency: string
          description?: string | null
          error_code?: string | null
          error_description?: string | null
          error_reason?: string | null
          error_source?: string | null
          error_step?: string | null
          external_order_id?: string | null
          external_payment_id: string
          fee?: number | null
          id?: number
          international?: boolean | null
          invoice_id?: string | null
          method?: string | null
          notes?: Json | null
          order_id?: string | null
          payment_provider_id: number
          refund_status?: string | null
          status: string
          subscription_id?: number | null
          tax?: number | null
          user_id: string
          vpa?: string | null
          wallet?: string | null
        }
        Update: {
          acquirer_data?: Json | null
          amount?: number
          amount_refunded?: number | null
          amount_transferred?: number | null
          bank?: string | null
          captured?: boolean | null
          created_at?: string | null
          currency?: string
          description?: string | null
          error_code?: string | null
          error_description?: string | null
          error_reason?: string | null
          error_source?: string | null
          error_step?: string | null
          external_order_id?: string | null
          external_payment_id?: string
          fee?: number | null
          id?: number
          international?: boolean | null
          invoice_id?: string | null
          method?: string | null
          notes?: Json | null
          order_id?: string | null
          payment_provider_id?: number
          refund_status?: string | null
          status?: string
          subscription_id?: number | null
          tax?: number | null
          user_id?: string
          vpa?: string | null
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'customer_payments_payment_provider_id_fkey'
            columns: ['payment_provider_id']
            isOneToOne: false
            referencedRelation: 'payment_providers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_payments_subscription_id_fkey'
            columns: ['subscription_id']
            isOneToOne: false
            referencedRelation: 'customer_subscriptions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_payments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      customer_processed_webhooks: {
        Row: {
          event_id: string
          event_type: string
          id: number
          processed_at: string
        }
        Insert: {
          event_id: string
          event_type: string
          id?: number
          processed_at: string
        }
        Update: {
          event_id?: string
          event_type?: string
          id?: number
          processed_at?: string
        }
        Relationships: []
      }
      customer_refunds: {
        Row: {
          acquirer_data: Json | null
          amount: number
          batch_id: string | null
          created_at: string | null
          currency: string | null
          external_refund_id: string
          id: number
          notes: Json | null
          payment_id: number
          receipt: string | null
          speed_processed: string | null
          speed_requested: string | null
          status: string
        }
        Insert: {
          acquirer_data?: Json | null
          amount: number
          batch_id?: string | null
          created_at?: string | null
          currency?: string | null
          external_refund_id: string
          id?: number
          notes?: Json | null
          payment_id: number
          receipt?: string | null
          speed_processed?: string | null
          speed_requested?: string | null
          status: string
        }
        Update: {
          acquirer_data?: Json | null
          amount?: number
          batch_id?: string | null
          created_at?: string | null
          currency?: string | null
          external_refund_id?: string
          id?: number
          notes?: Json | null
          payment_id?: number
          receipt?: string | null
          speed_processed?: string | null
          speed_requested?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customer_refunds_payment_id_fkey'
            columns: ['payment_id']
            isOneToOne: false
            referencedRelation: 'customer_payments'
            referencedColumns: ['id']
          },
        ]
      }
      customer_subscription_plans: {
        Row: {
          annual_amount: number
          created_at: string | null
          currency: string
          description: string | null
          external_plan_id: string | null
          features: Json | null
          id: number
          interval: number
          interval_type: string
          is_active: boolean | null
          monthly_amount: number
          name: string
          updated_at: string | null
        }
        Insert: {
          annual_amount: number
          created_at?: string | null
          currency: string
          description?: string | null
          external_plan_id?: string | null
          features?: Json | null
          id?: number
          interval: number
          interval_type: string
          is_active?: boolean | null
          monthly_amount: number
          name: string
          updated_at?: string | null
        }
        Update: {
          annual_amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          external_plan_id?: string | null
          features?: Json | null
          id?: number
          interval?: number
          interval_type?: string
          is_active?: boolean | null
          monthly_amount?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_subscriptions: {
        Row: {
          auth_attempts: number | null
          cancel_at_period_end: boolean | null
          cancel_initiated_by: string | null
          change_scheduled_at: string | null
          charge_at: string | null
          created_at: string | null
          current_end: string
          current_start: string
          customer_notify: boolean | null
          end_at: string | null
          ended_at: string | null
          expire_by: string | null
          external_subscription_id: string
          has_scheduled_changes: boolean | null
          id: number
          notes: Json | null
          offer_id: string | null
          paid_count: number | null
          pause_initiated_by: string | null
          payment_provider_id: number
          plan_id: number
          quantity: number | null
          remaining_count: number | null
          short_url: string | null
          source: string | null
          start_at: string | null
          status: string
          total_count: number | null
          type: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_attempts?: number | null
          cancel_at_period_end?: boolean | null
          cancel_initiated_by?: string | null
          change_scheduled_at?: string | null
          charge_at?: string | null
          created_at?: string | null
          current_end: string
          current_start: string
          customer_notify?: boolean | null
          end_at?: string | null
          ended_at?: string | null
          expire_by?: string | null
          external_subscription_id: string
          has_scheduled_changes?: boolean | null
          id?: number
          notes?: Json | null
          offer_id?: string | null
          paid_count?: number | null
          pause_initiated_by?: string | null
          payment_provider_id: number
          plan_id: number
          quantity?: number | null
          remaining_count?: number | null
          short_url?: string | null
          source?: string | null
          start_at?: string | null
          status: string
          total_count?: number | null
          type?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth_attempts?: number | null
          cancel_at_period_end?: boolean | null
          cancel_initiated_by?: string | null
          change_scheduled_at?: string | null
          charge_at?: string | null
          created_at?: string | null
          current_end?: string
          current_start?: string
          customer_notify?: boolean | null
          end_at?: string | null
          ended_at?: string | null
          expire_by?: string | null
          external_subscription_id?: string
          has_scheduled_changes?: boolean | null
          id?: number
          notes?: Json | null
          offer_id?: string | null
          paid_count?: number | null
          pause_initiated_by?: string | null
          payment_provider_id?: number
          plan_id?: number
          quantity?: number | null
          remaining_count?: number | null
          short_url?: string | null
          source?: string | null
          start_at?: string | null
          status?: string
          total_count?: number | null
          type?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customer_subscriptions_payment_provider_id_fkey'
            columns: ['payment_provider_id']
            isOneToOne: false
            referencedRelation: 'payment_providers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_subscriptions_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'customer_subscription_plans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      embedding_reviews: {
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
          feedback_status: Database['public']['Enums']['feedback_status'] | null
          feedback_type: Database['public']['Enums']['feedback_type'] | null
          id: number
          message: string
          page_identifier: string
          resolution_comment: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          feedback_status?: Database['public']['Enums']['feedback_status'] | null
          feedback_type?: Database['public']['Enums']['feedback_type'] | null
          id?: number
          message: string
          page_identifier: string
          resolution_comment?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: string | null
          feedback_status?: Database['public']['Enums']['feedback_status'] | null
          feedback_type?: Database['public']['Enums']['feedback_type'] | null
          id?: number
          message?: string
          page_identifier?: string
          resolution_comment?: string | null
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
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          followed_entity: Database['public']['Enums']['followed_entity']
          followed_id: string
          user_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          followed_entity: Database['public']['Enums']['followed_entity']
          followed_id: string
          user_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          followed_entity?: Database['public']['Enums']['followed_entity']
          followed_id?: string
          user_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'follows_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      metric_definitions: {
        Row: {
          category: string | null
          description: string | null
          id: number
          is_dimensional: boolean | null
          name: string
          type: string
          unit: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: number
          is_dimensional?: boolean | null
          name: string
          type: string
          unit?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: number
          is_dimensional?: boolean | null
          name?: string
          type?: string
          unit?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          body: string | null
          category_id: number
          company_id: string | null
          content_status: Database['public']['Enums']['content_status']
          created_at: string
          description: string | null
          failed_count: number | null
          featured_image: string | null
          has_summary: boolean
          hash: number | null
          id: string
          keywords: Json | null
          published_at: string | null
          scrape_frequency: Database['public']['Enums']['scrape_frequency']
          scraped_at: string | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          author?: string | null
          body?: string | null
          category_id?: number
          company_id?: string | null
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string
          description?: string | null
          failed_count?: number | null
          featured_image?: string | null
          has_summary?: boolean
          hash?: number | null
          id: string
          keywords?: Json | null
          published_at?: string | null
          scrape_frequency?: Database['public']['Enums']['scrape_frequency']
          scraped_at?: string | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          author?: string | null
          body?: string | null
          category_id?: number
          company_id?: string | null
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string
          description?: string | null
          failed_count?: number | null
          featured_image?: string | null
          has_summary?: boolean
          hash?: number | null
          id?: string
          keywords?: Json | null
          published_at?: string | null
          scrape_frequency?: Database['public']['Enums']['scrape_frequency']
          scraped_at?: string | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_news_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_news_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_news_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
        ]
      }
      news_summaries: {
        Row: {
          embedding: string | null
          id: number
          news_id: string
          summary: string | null
        }
        Insert: {
          embedding?: string | null
          id: number
          news_id: string
          summary?: string | null
        }
        Update: {
          embedding?: string | null
          id?: number
          news_id?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_news_summaries_news_id_fkey'
            columns: ['news_id']
            isOneToOne: false
            referencedRelation: 'news'
            referencedColumns: ['id']
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
          },
        ]
      }
      newsletters: {
        Row: {
          content_status: Database['public']['Enums']['content_status']
          created_at: string | null
          end_date: string
          frequency: string
          generated_content: string | null
          id: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string | null
          end_date: string
          frequency: string
          generated_content?: string | null
          id: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string | null
          end_date?: string
          frequency?: string
          generated_content?: string | null
          id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'newsletters_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
        ]
      }
      payment_providers: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
          affiliations: Json | null
          authors: Json | null
          category: string | null
          comments: string | null
          content_status: Database['public']['Enums']['content_status']
          created_at: string
          doi_url: string | null
          figure_count: number | null
          has_embedding: boolean | null
          id: string
          is_flagged: boolean
          keywords: string | null
          month: string | null
          page_count: number | null
          pdf_url: string | null
          published_at: string | null
          published_in: string | null
          summary: string | null
          table_count: number | null
          title: string | null
          updated_at: string | null
          version: number | null
          year: string | null
        }
        Insert: {
          abstract?: string | null
          abstract_url: string
          affiliations?: Json | null
          authors?: Json | null
          category?: string | null
          comments?: string | null
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string
          doi_url?: string | null
          figure_count?: number | null
          has_embedding?: boolean | null
          id?: string
          is_flagged?: boolean
          keywords?: string | null
          month?: string | null
          page_count?: number | null
          pdf_url?: string | null
          published_at?: string | null
          published_in?: string | null
          summary?: string | null
          table_count?: number | null
          title?: string | null
          updated_at?: string | null
          version?: number | null
          year?: string | null
        }
        Update: {
          abstract?: string | null
          abstract_url?: string
          affiliations?: Json | null
          authors?: Json | null
          category?: string | null
          comments?: string | null
          content_status?: Database['public']['Enums']['content_status']
          created_at?: string
          doi_url?: string | null
          figure_count?: number | null
          has_embedding?: boolean | null
          id?: string
          is_flagged?: boolean
          keywords?: string | null
          month?: string | null
          page_count?: number | null
          pdf_url?: string | null
          published_at?: string | null
          published_in?: string | null
          summary?: string | null
          table_count?: number | null
          title?: string | null
          updated_at?: string | null
          version?: number | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'research_content_fk'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'contents'
            referencedColumns: ['id']
          },
        ]
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
            referencedRelation: 'embedding_reviews'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_research_embeddings_research_id_fkey'
            columns: ['research_id']
            isOneToOne: true
            referencedRelation: 'research'
            referencedColumns: ['id']
          },
        ]
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
          },
        ]
      }
      role_permissions: {
        Row: {
          conditions: Json | null
          id: number
          permissions: Json | null
          role: Database['public']['Enums']['app_role_enum']
          table_name: string
        }
        Insert: {
          conditions?: Json | null
          id?: number
          permissions?: Json | null
          role: Database['public']['Enums']['app_role_enum']
          table_name: string
        }
        Update: {
          conditions?: Json | null
          id?: number
          permissions?: Json | null
          role?: Database['public']['Enums']['app_role_enum']
          table_name?: string
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
          crawl_id: string
          id: number
          metric_id: number | null
          timestamp: string
          value: Json
        }
        Insert: {
          crawl_id: string
          id?: number
          metric_id?: number | null
          timestamp: string
          value: Json
        }
        Update: {
          crawl_id?: string
          id?: number
          metric_id?: number | null
          timestamp?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'spider_metrics_metric_id_fkey'
            columns: ['metric_id']
            isOneToOne: false
            referencedRelation: 'metric_definitions'
            referencedColumns: ['id']
          },
        ]
      }
      table_maintenance_log: {
        Row: {
          detail: string | null
          id: number
          logged_at: string | null
          operation: string | null
        }
        Insert: {
          detail?: string | null
          id?: number
          logged_at?: string | null
          operation?: string | null
        }
        Update: {
          detail?: string | null
          id?: number
          logged_at?: string | null
          operation?: string | null
        }
        Relationships: []
      }
      table_query_performance: {
        Row: {
          avg_duration: unknown | null
          capture_time: string | null
          execution_count: number | null
          query: string | null
        }
        Insert: {
          avg_duration?: unknown | null
          capture_time?: string | null
          execution_count?: number | null
          query?: string | null
        }
        Update: {
          avg_duration?: unknown | null
          capture_time?: string | null
          execution_count?: number | null
          query?: string | null
        }
        Relationships: []
      }
      table_sequence_usage: {
        Row: {
          capture_time: string | null
          current_value: number | null
          max_value: number | null
          sequence_name: string | null
        }
        Insert: {
          capture_time?: string | null
          current_value?: number | null
          max_value?: number | null
          sequence_name?: string | null
        }
        Update: {
          capture_time?: string | null
          current_value?: number | null
          max_value?: number | null
          sequence_name?: string | null
        }
        Relationships: []
      }
      table_statistics: {
        Row: {
          buffer_cache_hit_ratio: number | null
          capture_time: string
          dead_tuples: number | null
          estimated_bloat_ratio: number | null
          index_scan_count: number | null
          index_size: number | null
          index_usage: Json | null
          last_analyze: string | null
          last_vacuum: string | null
          live_tuples: number | null
          row_count: number | null
          seq_scan_count: number | null
          table_name: string
          table_size: number | null
        }
        Insert: {
          buffer_cache_hit_ratio?: number | null
          capture_time: string
          dead_tuples?: number | null
          estimated_bloat_ratio?: number | null
          index_scan_count?: number | null
          index_size?: number | null
          index_usage?: Json | null
          last_analyze?: string | null
          last_vacuum?: string | null
          live_tuples?: number | null
          row_count?: number | null
          seq_scan_count?: number | null
          table_name: string
          table_size?: number | null
        }
        Update: {
          buffer_cache_hit_ratio?: number | null
          capture_time?: string
          dead_tuples?: number | null
          estimated_bloat_ratio?: number | null
          index_scan_count?: number | null
          index_size?: number | null
          index_usage?: Json | null
          last_analyze?: string | null
          last_vacuum?: string | null
          live_tuples?: number | null
          row_count?: number | null
          seq_scan_count?: number | null
          table_name?: string
          table_size?: number | null
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
          user_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          followed_id: string
          user_id: string
          id: string
        }
        Update: {
          created_at?: string | null
          followed_id?: string
          user_id?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar: string | null
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
          role: Database['public']['Enums']['app_role_enum']
          surname: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
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
          role?: Database['public']['Enums']['app_role_enum']
          surname?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
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
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      calculate_table_growth:
        | {
            Args: {
              p_table_name: string
              p_end_date?: string
            }
            Returns: {
              period: string
              start_date: string
              end_date: string
              start_row_count: number
              end_row_count: number
              row_growth: number
              growth_percentage: number
            }[]
          }
        | {
            Args: {
              p_table_name: string
              p_time_period: unknown
              p_num_periods: number
            }
            Returns: {
              period_end_time: string
              row_count: number
              growth_count: number
              growth_percentage: number
            }[]
          }
      cleanup_table_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enable_rls_on_all_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      execute_weekly_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      extract_base_url: {
        Args: {
          p_full_url: string
        }
        Returns: string
      }
      gather_database_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_autovacuum_candidates: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          dead_tuples: number
          threshold: number
        }[]
      }
      get_connection_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          max_connections: number
          used_connections: number
          available_connections: number
          connection_ratio: number
        }[]
      }
      get_connection_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          usage_percentage: number
          current_connections: number
          max_connections: number
        }[]
      }
      get_duplicate_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          index1: string
          index2: string
          table_name: string
        }[]
      }
      get_fragmented_objects: {
        Args: Record<PropertyKey, never>
        Returns: {
          object_name: string
          fragmentation: number
        }[]
      }
      get_high_sequence_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          sequence_name: string
          usage_percentage: number
        }[]
      }
      get_indexes_to_reindex: {
        Args: Record<PropertyKey, never>
        Returns: {
          indexname: string
          tablename: string
          index_size: number
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
      get_long_running_transactions: {
        Args: Record<PropertyKey, never>
        Returns: {
          pid: number
          duration: unknown
          query: string
        }[]
      }
      get_maintenance_objects: {
        Args: Record<PropertyKey, never>
        Returns: {
          object_type: string
          object_name: string
        }[]
      }
      get_suboptimal_queries: {
        Args: Record<PropertyKey, never>
        Returns: {
          query_detail: string
        }[]
      }
      get_tables_to_vacuum: {
        Args: Record<PropertyKey, never>
        Returns: {
          tablename: string
          dead_tuples: number
          live_tuples: number
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
      perform_weekly_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: {
          operation: string
          detail: string
          additional_info: Json
        }[]
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
      update_role_permissions: {
        Args: {
          config: Json
        }
        Returns: undefined
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
      content_status:
        | 'draft'
        | 'pending_agent_action'
        | 'pending_agent_review'
        | 'pending_human_review'
        | 'pending_relevance_check'
        | 'irrelevant'
        | 'scheduled'
        | 'unpublished'
        | 'archived'
        | 'published'
        | 'failed'
        | 'pending_crawl'
        | 'scraped'
        | 'outdated'
        | 'updated'
        | 'new'
      content_type:
        | 'news'
        | 'events'
        | 'opportunities'
        | 'research'
        | 'companies'
        | 'contact'
        | 'people'
        | 'unknown'
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
      followed_entity: 'company' | 'user'
      news_importance_level: 'high' | 'medium' | 'low'
      news_relation_type: 'source' | 'topic' | 'mention'
      priority: 'very_low' | 'low' | 'medium' | 'high' | 'critical'
      privacy_level: 'private' | 'connected' | 'public'
      scrape_frequency:
        | 'four_times_daily'
        | 'twice_daily'
        | 'daily'
        | 'twice_weekly'
        | 'weekly'
        | 'bi_weekly'
        | 'monthly'
        | 'quarterly'
        | 'biannual'
        | 'annually'
        | 'never'
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
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
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
          upload_uuid: string
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
          upload_uuid: string
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
          upload_uuid?: string
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
            foreignKeyName: 's3_multipart_uploads_parts_upload_uuid_fkey'
            columns: ['upload_uuid']
            isOneToOne: false
            referencedRelation: 's3_multipart_uploads'
            referencedColumns: ['id']
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
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
    : never = never,
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
    : never = never,
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
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

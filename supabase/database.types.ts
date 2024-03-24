export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          body: string | null
          created_at: string
          id: number
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          title?: string
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
          body: string | null
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
          body?: string | null
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
          body?: string | null
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
            foreignKeyName: 'news_embeddings_embedding_id_fkey'
            columns: ['embedding_id']
            isOneToOne: false
            referencedRelation: 'embeddings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'news_embeddings_news_id_fkey'
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
            foreignKeyName: 'news_tags_news_id_fkey'
            columns: ['news_id']
            isOneToOne: false
            referencedRelation: 'news'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'news_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      register_interest: {
        Row: {
          created_at: string
          email: string
          id: number
          interest: string | null
          name: string
          referral: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          interest?: string | null
          name: string
          referral?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          interest?: string | null
          name?: string
          referral?: string | null
        }
        Relationships: []
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
      seo_data: {
        Row: {
          ads: Json
          country: string
          domain: string
          general: Json
          id: number
          keyword: string
          organic: Json
          scrape_date: string
        }
        Insert: {
          ads: Json
          country: string
          domain: string
          general: Json
          id?: number
          keyword: string
          organic: Json
          scrape_date: string
        }
        Update: {
          ads?: Json
          country?: string
          domain?: string
          general?: Json
          id?: number
          keyword?: string
          organic?: Json
          scrape_date?: string
        }
        Relationships: []
      }
      statuses: {
        Row: {
          created_at: string
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          title?: string
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
      users: {
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
          id: string
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
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hnswhandler: {
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
      vector_avg: {
        Args: {
          '': number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          '': string
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

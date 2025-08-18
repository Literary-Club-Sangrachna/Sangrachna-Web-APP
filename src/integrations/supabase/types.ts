export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      book_requests: {
        Row: {
          academic_year: string | null
          book_id: string
          created_at: string
          id: string
          mobile_no: string | null
          notes: string | null
          preferred_due_date: string | null
          request_date: string
          roll_no: string | null
          status: string
          updated_at: string
          user_email: string
          user_name: string
        }
        Insert: {
          academic_year?: string | null
          book_id: string
          created_at?: string
          id?: string
          mobile_no?: string | null
          notes?: string | null
          preferred_due_date?: string | null
          request_date?: string
          roll_no?: string | null
          status?: string
          updated_at?: string
          user_email: string
          user_name: string
        }
        Update: {
          academic_year?: string | null
          book_id?: string
          created_at?: string
          id?: string
          mobile_no?: string | null
          notes?: string | null
          preferred_due_date?: string | null
          request_date?: string
          roll_no?: string | null
          status?: string
          updated_at?: string
          user_email?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_requests_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          available_copies: number
          created_at: string
          description: string | null
          genre: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_recommended: boolean
          isbn: string | null
          publication_year: number | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          author: string
          available_copies?: number
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_recommended?: boolean
          isbn?: string | null
          publication_year?: number | null
          title: string
          total_copies?: number
          updated_at?: string
        }
        Update: {
          author?: string
          available_copies?: number
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_recommended?: boolean
          isbn?: string | null
          publication_year?: number | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          registration_link: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          registration_link?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          registration_link?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pendown_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          published_at: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      poem_likes: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          poem_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
          poem_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          poem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poem_likes_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "poems"
            referencedColumns: ["id"]
          },
        ]
      }
      poems: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          likes_count: number
          published_at: string | null
          status: string
          submitted_by_email: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          published_at?: string | null
          status?: string
          submitted_by_email?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          published_at?: string | null
          status?: string
          submitted_by_email?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          order_priority: number | null
          position: string
          updated_at: string
          year: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          order_priority?: number | null
          position: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          order_priority?: number | null
          position?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      toggle_poem_like: {
        Args: { poem_id_param: string; ip_address_param: string }
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
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

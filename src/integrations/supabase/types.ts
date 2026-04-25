export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ad_projects: {
        Row: {
          created_at: string
          credits: Json
          eyebrow: string | null
          hero_image_url: string | null
          hero_video_url: string | null
          id: string
          intro: string | null
          is_featured: boolean
          is_visible: boolean
          slug: string
          sort_order: number
          story_blocks: Json
          title: string
          title_accent: string | null
          title_lead: string | null
          updated_at: string
          year: string | null
        }
        Insert: {
          created_at?: string
          credits?: Json
          eyebrow?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          intro?: string | null
          is_featured?: boolean
          is_visible?: boolean
          slug: string
          sort_order?: number
          story_blocks?: Json
          title: string
          title_accent?: string | null
          title_lead?: string | null
          updated_at?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          credits?: Json
          eyebrow?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          intro?: string | null
          is_featured?: boolean
          is_visible?: boolean
          slug?: string
          sort_order?: number
          story_blocks?: Json
          title?: string
          title_accent?: string | null
          title_lead?: string | null
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          project_type: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          project_type?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          project_type?: string | null
        }
        Relationships: []
      }
      editorial_projects: {
        Row: {
          cover_url: string | null
          created_at: string
          credits: Json
          gallery: Json
          grid_pos: string
          id: string
          intro: string | null
          is_visible: boolean
          publication: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          credits?: Json
          gallery?: Json
          grid_pos?: string
          id?: string
          intro?: string | null
          is_visible?: boolean
          publication?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          credits?: Json
          gallery?: Json
          grid_pos?: string
          id?: string
          intro?: string | null
          is_visible?: boolean
          publication?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      media_cases: {
        Row: {
          client: string
          created_at: string
          discipline: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          client: string
          created_at?: string
          discipline?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          client?: string
          created_at?: string
          discipline?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_services: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wedding_films: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_visible: boolean
          place: string | null
          sort_order: number
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean
          place?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean
          place?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      wedding_photos: {
        Row: {
          aspect: string
          caption: string | null
          col_span: string
          created_at: string
          id: string
          image_url: string
          is_visible: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          aspect?: string
          caption?: string | null
          col_span?: string
          created_at?: string
          id?: string
          image_url: string
          is_visible?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          aspect?: string
          caption?: string | null
          col_span?: string
          created_at?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      work_items: {
        Row: {
          category: string
          created_at: string
          href: string
          id: string
          image_url: string | null
          is_visible: boolean
          meta: string | null
          sort_order: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          href: string
          id?: string
          image_url?: string | null
          is_visible?: boolean
          meta?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          href?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean
          meta?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_profiles: {
        Row: {
          bio: string
          created_at: string
          locale: string
          profile_image_url: string
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          locale: string
          profile_image_url: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          locale?: string
          profile_image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_kv_frames: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          url?: string
        }
        Relationships: []
      }
      illustration_works: {
        Row: {
          alt: string | null
          created_at: string | null
          height: number
          id: string
          is_active: boolean | null
          order_index: number | null
          url: string
          width: number
          year: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          height: number
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          url: string
          width: number
          year: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          height?: number
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          url?: string
          width?: number
          year?: string
        }
        Relationships: []
      }
      manga_images: {
        Row: {
          height: number
          id: string
          locale: string | null
          manga_id: string | null
          order_index: number | null
          url: string
          width: number
        }
        Insert: {
          height: number
          id?: string
          locale?: string | null
          manga_id?: string | null
          order_index?: number | null
          url: string
          width: number
        }
        Update: {
          height?: number
          id?: string
          locale?: string | null
          manga_id?: string | null
          order_index?: number | null
          url?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "manga_images_manga_id_fkey"
            columns: ["manga_id"]
            isOneToOne: false
            referencedRelation: "manga_works"
            referencedColumns: ["id"]
          },
        ]
      }
      manga_works: {
        Row: {
          cover_url: string
          created_at: string
          height: number
          id: string
          is_active: boolean | null
          is_completed: boolean
          order_index: number | null
          summary_en: string | null
          summary_zh: string | null
          title_en: string | null
          title_zh: string | null
          width: number
          year: string
        }
        Insert: {
          cover_url: string
          created_at?: string
          height: number
          id?: string
          is_active?: boolean | null
          is_completed?: boolean
          order_index?: number | null
          summary_en?: string | null
          summary_zh?: string | null
          title_en?: string | null
          title_zh?: string | null
          width: number
          year: string
        }
        Update: {
          cover_url?: string
          created_at?: string
          height?: number
          id?: string
          is_active?: boolean | null
          is_completed?: boolean
          order_index?: number | null
          summary_en?: string | null
          summary_zh?: string | null
          title_en?: string | null
          title_zh?: string | null
          width?: number
          year?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string | null
          href: string | null
          id: string
          is_active: boolean | null
          key: string
          order_index: number
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          order_index?: number
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          order_index?: number
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          created_at: string | null
          height: number
          id: string
          order_index: number | null
          project_id: string | null
          url: string
          width: number
        }
        Insert: {
          created_at?: string | null
          height: number
          id?: string
          order_index?: number | null
          project_id?: string | null
          url: string
          width: number
        }
        Update: {
          created_at?: string | null
          height?: number
          id?: string
          order_index?: number | null
          project_id?: string | null
          url?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_works"
            referencedColumns: ["id"]
          },
        ]
      }
      project_works: {
        Row: {
          cover_url: string
          created_at: string | null
          description_en: string | null
          description_zh: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          slug: string
          subtitle_en: string | null
          subtitle_zh: string | null
          title_en: string | null
          title_zh: string | null
        }
        Insert: {
          cover_url: string
          created_at?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          slug: string
          subtitle_en?: string | null
          subtitle_zh?: string | null
          title_en?: string | null
          title_zh?: string | null
        }
        Update: {
          cover_url?: string
          created_at?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          slug?: string
          subtitle_en?: string | null
          subtitle_zh?: string | null
          title_en?: string | null
          title_zh?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          label: string
          logo_url: string
          sort_order: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label: string
          logo_url: string
          sort_order?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label?: string
          logo_url?: string
          sort_order?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      ui_translations: {
        Row: {
          id: string
          key: string
          locale: string
          namespace: string | null
          updatedAt: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          locale: string
          namespace?: string | null
          updatedAt?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          locale?: string
          namespace?: string | null
          updatedAt?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extract_cloudinary_public_id: {
        Args: { cloudinary_url: string }
        Returns: string
      }
      get_distinct_years: {
        Args: never
        Returns: {
          year: string
        }[]
      }
      public_id:
        | {
            Args: {
              record: Database["public"]["Tables"]["about_profiles"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: {
              record: Database["public"]["Tables"]["home_kv_frames"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: {
              record: Database["public"]["Tables"]["illustration_works"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: {
              record: Database["public"]["Tables"]["manga_images"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { record: Database["public"]["Tables"]["manga_works"]["Row"] }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: {
              record: Database["public"]["Tables"]["project_images"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: {
              record: Database["public"]["Tables"]["project_works"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: {
              record: Database["public"]["Tables"]["social_links"]["Row"]
            }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.public_id(record => about_profiles), public.public_id(record => home_kv_frames), public.public_id(record => illustration_works), public.public_id(record => manga_images), public.public_id(record => manga_works), public.public_id(record => project_images), public.public_id(record => project_works), public.public_id(record => social_links). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      sync_all_nav_items: { Args: never; Returns: undefined }
      sync_illustration_nav: { Args: never; Returns: undefined }
      sync_manga_nav: { Args: never; Returns: undefined }
      sync_project_nav: { Args: never; Returns: undefined }
    }
    Enums: {
      ContentAccessLevel: "FREE" | "SUBSCRIBER"
      ContentBundleStatus:
        | "DRAFT"
        | "REVIEW"
        | "SCHEDULED"
        | "PUBLISHED"
        | "ARCHIVED"
      ContentBundleType:
        | "PAGE"
        | "COLLECTION"
        | "ARTICLE"
        | "NAVIGATION"
        | "FEATURE"
      MediaAssetKind: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT"
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
      ContentAccessLevel: ["FREE", "SUBSCRIBER"],
      ContentBundleStatus: [
        "DRAFT",
        "REVIEW",
        "SCHEDULED",
        "PUBLISHED",
        "ARCHIVED",
      ],
      ContentBundleType: [
        "PAGE",
        "COLLECTION",
        "ARTICLE",
        "NAVIGATION",
        "FEATURE",
      ],
      MediaAssetKind: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_generators: {
        Row: {
          ai_model: string | null
          context_instructions: string | null
          created_at: string
          example_output: string | null
          id: string
          key: string | null
          model_name: string | null
          parameters: string | null
          prompt_text: string
          slug: string
          system_prompt: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_model?: string | null
          context_instructions?: string | null
          created_at?: string
          example_output?: string | null
          id?: string
          key?: string | null
          model_name?: string | null
          parameters?: string | null
          prompt_text: string
          slug: string
          system_prompt?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_model?: string | null
          context_instructions?: string | null
          created_at?: string
          example_output?: string | null
          id?: string
          key?: string | null
          model_name?: string | null
          parameters?: string | null
          prompt_text?: string
          slug?: string
          system_prompt?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      episode_guests: {
        Row: {
          created_at: string
          episode_id: string
          guest_id: string
          id: string
        }
        Insert: {
          created_at?: string
          episode_id: string
          guest_id: string
          id?: string
        }
        Update: {
          created_at?: string
          episode_id?: string
          guest_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "episode_guests_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_guests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          cover_art: string | null
          created_at: string
          episode_number: number
          id: string
          introduction: string
          introduction_versions: Json | null
          notes: string | null
          notes_versions: Json | null
          podcast_urls: Json | null
          publish_date: string | null
          recording_links: Json | null
          resources: Json | null
          scheduled: string
          status: string
          title: string
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_art?: string | null
          created_at?: string
          episode_number: number
          id?: string
          introduction: string
          introduction_versions?: Json | null
          notes?: string | null
          notes_versions?: Json | null
          podcast_urls?: Json | null
          publish_date?: string | null
          recording_links?: Json | null
          resources?: Json | null
          scheduled: string
          status?: string
          title: string
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_art?: string | null
          created_at?: string
          episode_number?: number
          id?: string
          introduction?: string
          introduction_versions?: Json | null
          notes?: string | null
          notes_versions?: Json | null
          podcast_urls?: Json | null
          publish_date?: string | null
          recording_links?: Json | null
          resources?: Json | null
          scheduled?: string
          status?: string
          title?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          background_research: string | null
          background_research_versions: Json | null
          bio: string
          bio_versions: Json | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          image: string | null
          image_url: string | null
          name: string
          notes: string | null
          phone: string | null
          social_links: Json
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background_research?: string | null
          background_research_versions?: Json | null
          bio: string
          bio_versions?: Json | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image?: string | null
          image_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          social_links?: Json
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background_research?: string | null
          background_research_versions?: Json | null
          bio?: string
          bio_versions?: Json | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image?: string | null
          image_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          social_links?: Json
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

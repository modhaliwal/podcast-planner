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
          context_instructions: string | null
          created_at: string
          example_output: string | null
          id: string
          key: string
          prompt_text: string
          system_prompt: string | null
          title: string
          updated_at: string
        }
        Insert: {
          context_instructions?: string | null
          created_at?: string
          example_output?: string | null
          id?: string
          key: string
          prompt_text: string
          system_prompt?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          context_instructions?: string | null
          created_at?: string
          example_output?: string | null
          id?: string
          key?: string
          prompt_text?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

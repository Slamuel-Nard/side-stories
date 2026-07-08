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
      artifacts: {
        Row: {
          display_order: number
          id: string
          image_url: string | null
          name: string
          quest: string
          relic_title: string
          type: string
        }
        Insert: {
          display_order?: number
          id: string
          image_url?: string | null
          name: string
          quest: string
          relic_title?: string
          type: string
        }
        Update: {
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          quest?: string
          relic_title?: string
          type?: string
        }
        Relationships: []
      }
      alpha_stories: {
        Row: {
          artifact_id: string
          created_at: string
          event: string | null
          id: string
          instagram_handle: string | null
          message_to_future_holders: string | null
          next_destination: string | null
          story: string
          traveler_name: string | null
        }
        Insert: {
          artifact_id: string
          created_at?: string
          event?: string | null
          id?: string
          instagram_handle?: string | null
          message_to_future_holders?: string | null
          next_destination?: string | null
          story: string
          traveler_name?: string | null
        }
        Update: {
          artifact_id?: string
          created_at?: string
          event?: string | null
          id?: string
          instagram_handle?: string | null
          message_to_future_holders?: string | null
          next_destination?: string | null
          story?: string
          traveler_name?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          artifact_id: string
          created_at: string
          event: string | null
          id: string
          instagram_handle: string | null
          message_to_future_holders: string | null
          next_destination: string | null
          story: string
          traveler_name: string | null
        }
        Insert: {
          artifact_id: string
          created_at?: string
          event?: string | null
          id?: string
          instagram_handle?: string | null
          message_to_future_holders?: string | null
          next_destination?: string | null
          story: string
          traveler_name?: string | null
        }
        Update: {
          artifact_id?: string
          created_at?: string
          event?: string | null
          id?: string
          instagram_handle?: string | null
          message_to_future_holders?: string | null
          next_destination?: string | null
          story?: string
          traveler_name?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      submit_alpha_story: {
        Args: {
          p_artifact_id: string
          p_event: string | null
          p_fingerprint: string
          p_instagram_handle: string | null
          p_message_to_future_holders: string | null
          p_next_destination: string | null
          p_story: string
          p_traveler_name: string | null
        }
        Returns: string
      }
      submit_story: {
        Args: {
          p_artifact_id: string
          p_event: string | null
          p_fingerprint: string
          p_instagram_handle: string | null
          p_message_to_future_holders: string | null
          p_next_destination: string | null
          p_story: string
          p_traveler_name: string | null
        }
        Returns: string
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

// Supabase Database Types
// Bu dosya tablolarımızla tam uyumlu TypeScript interface'lerini içerir

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // UUID, auth.users.id ile bağlantılı
          display_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'premium';
          dream_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'premium';
          dream_count?: number;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'premium';
          dream_count?: number;
        };
      };
      dreams: {
        Row: {
          id: string;
          user_id: string; // profiles.id ile foreign key
          title: string | null;
          content: string;
          input_type: 'voice' | 'text';
          status: 'processing' | 'completed' | 'failed';
          audio_url: string | null;
          interpretation: string | null;
          interpretation_summary: string | null;
          symbols_detected: any | null; // JSONB
          mood_analysis: any | null; // JSONB
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title?: string | null;
          content: string;
          input_type: 'voice' | 'text';
          status?: 'processing' | 'completed' | 'failed';
          audio_url?: string | null;
          interpretation?: string | null;
          interpretation_summary?: string | null;
          symbols_detected?: any | null;
          mood_analysis?: any | null;
          is_favorite?: boolean;
        };
        Update: {
          title?: string | null;
          content?: string;
          status?: 'processing' | 'completed' | 'failed';
          interpretation?: string | null;
          interpretation_summary?: string | null;
          symbols_detected?: any | null;
          mood_analysis?: any | null;
          is_favorite?: boolean;
        };
      };
      dream_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          icon?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          icon?: string | null;
        };
      };
      user_settings: {
        Row: {
          user_id: string; // profiles.id ile foreign key
          notifications_enabled: boolean;
          privacy_mode: boolean;
          preferred_language: string;
          dream_reminders: boolean;
          reminder_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          notifications_enabled?: boolean;
          privacy_mode?: boolean;
          preferred_language?: string;
          dream_reminders?: boolean;
          reminder_time?: string;
        };
        Update: {
          notifications_enabled?: boolean;
          privacy_mode?: boolean;
          preferred_language?: string;
          dream_reminders?: boolean;
          reminder_time?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      dream_input_type: 'voice' | 'text';
      dream_status: 'processing' | 'completed' | 'failed';
      user_subscription_tier: 'free' | 'premium';
    };
  };
};

// Convenience types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Dream = Database['public']['Tables']['dreams']['Row'];
export type DreamCategory = Database['public']['Tables']['dream_categories']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type DreamInsert = Database['public']['Tables']['dreams']['Insert'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type DreamUpdate = Database['public']['Tables']['dreams']['Update'];
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: AuthUser;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface AuthResponse extends ApiResponse<AuthSession> {
  user?: AuthUser;
}
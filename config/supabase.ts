import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Web için storage polyfill, mobile için AsyncStorage  
let storage: any;
if (Platform.OS === 'web') {
  // Web için basit in-memory storage
  const webStorage: { [key: string]: string } = {};
  storage = {
    getItem: (key: string) => Promise.resolve(webStorage[key] || null),
    setItem: (key: string, value: string) => {
      webStorage[key] = value;
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      delete webStorage[key];
      return Promise.resolve();
    },
  };
} else {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  storage = AsyncStorage;
}

// Environment variables'ları kontrol et
const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    supabaseUrl,
    supabaseAnonKey: supabaseAnonKey ? '[REDACTED]' : undefined,
    expoConfig: Constants.expoConfig?.extra
  });
  throw new Error('Missing Supabase environment variables. Please check your app.config.js and .env file.');
}

// Supabase client'i oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Platform-specific storage
    storage: storage,
    // Auto refresh token
    autoRefreshToken: true,
    // Persist session in secure storage
    persistSession: true,
    // Detect session from URL (web için, RN'de false)
    detectSessionInUrl: false,
  },
  // Real-time subscriptions için
  realtime: {
    enabled: true,
  },
});

// Database types (gelecekte type generation için)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
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
          user_id: string;
          title: string | null;
          content: string;
          input_type: 'voice' | 'text';
          status: 'processing' | 'completed' | 'failed';
          audio_url: string | null;
          interpretation: string | null;
          interpretation_summary: string | null;
          symbols_detected: any | null;
          mood_analysis: any | null;
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
      user_settings: {
        Row: {
          user_id: string;
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
  };
};
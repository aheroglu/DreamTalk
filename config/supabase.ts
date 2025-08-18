import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { Database } from '@/types/database';

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

// Supabase client'i oluştur (typed)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

// Export Database type from types/database.ts
export type { Database, Profile, Dream, AuthUser, AuthSession } from '@/types/database';
import Constants from 'expo-constants';

// Environment configuration
export const ENV = {
  SUPABASE_URL: Constants.expoConfig?.extra?.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || '',
  OPENAI_API_KEY: Constants.expoConfig?.extra?.OPENAI_API_KEY || '',
  NODE_ENV: Constants.expoConfig?.extra?.NODE_ENV || 'development',
};

// Validate required environment variables
const requiredEnvVars = {
  SUPABASE_URL: ENV.SUPABASE_URL,
  SUPABASE_ANON_KEY: ENV.SUPABASE_ANON_KEY,
  OPENAI_API_KEY: ENV.OPENAI_API_KEY,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0 && ENV.NODE_ENV !== 'development') {
  console.warn(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export default ENV;
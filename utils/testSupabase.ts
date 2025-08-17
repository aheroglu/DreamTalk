import { supabase } from '@/config/supabase';

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .single();

    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function testAuthFlow() {
  try {
    // Test auth session
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth session error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Auth session check successful!');
    console.log('Current session:', session.session ? 'Logged in' : 'Not logged in');
    
    return { success: true, session: session.session };
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return { success: false, error: String(error) };
  }
}
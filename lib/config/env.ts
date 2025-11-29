// Supabase configuration
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(config.supabase.url && config.supabase.anonKey);
};
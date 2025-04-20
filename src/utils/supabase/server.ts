import { createServerClient } from '@supabase/ssr';

export const createServerSupabase = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: 'sb' },
      cookies: { getAll: () => [], setAll: () => {} },
      cookieEncoding: 'base64url',
    }
  );

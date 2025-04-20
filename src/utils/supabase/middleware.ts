import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Create an initial response object (needed for cookie manipulation)
  const response = NextResponse.next();

  // Setup Supabase with correct cookie handlers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value ?? null;
        },
        set(name, value, options) {
          try {
            response.cookies.set(name, value, options);
          } catch (err) {
            console.warn(`Unable to set cookie "${name}" in middleware`, err);
          }
        },
        remove(name, options) {
          try {
            response.cookies.set(name, '', { ...options, maxAge: -1 });
          } catch (err) {
            console.warn(`Unable to remove cookie "${name}" in middleware`, err);
          }
        },
      },
    }
  );

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to sign-in if not authenticated
  if (!user && !request.nextUrl.pathname.startsWith('/signin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  return response;
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  console.log('[AuthCallback] Request URL:', requestUrl.href);
  console.log('[AuthCallback] Code received:', code ? 'Sí' : 'No');

  if (code) {
    console.log('[AuthCallback] Attempting to exchange code for session...');
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[AuthCallback] Error exchanging code for session:', error.message);
      // Opcional: Redirigir a una página de error o pasar el error como param
      // return NextResponse.redirect(new URL('/error?message=' + error.message, requestUrl).toString());
    } else if (data?.session) {
      console.log('[AuthCallback] Session successfully exchanged and set. User ID:', data.session.user.id);
    } else {
      console.warn('[AuthCallback] Code exchanged, but no session returned in data. Possible email verification pending or RLS issue?');
    }
  } else {
    console.warn('[AuthCallback] No code found in URL search params.');
  }

  // Redirigir siempre a la página principal después del intento de autenticación
  console.log('[AuthCallback] Redirecting to home page.');
  return NextResponse.redirect(new URL('/', requestUrl).toString());
}
import { NextResponse } from 'next/server';

const allowedOrigins = ['https://addaura-trial.vercel.app']; // your allowed origins

export function middleware(req) {
  const origin = req.headers.get('origin');
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    const headers = {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
    return new NextResponse(null, { status: 200, headers });
  }

  // For other requests, add CORS headers if origin is allowed
  const res = NextResponse.next();
  if (isAllowedOrigin && origin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return res;
}

// Apply middleware only to API routes
export const config = {
  matcher: '/api/:path*',
};

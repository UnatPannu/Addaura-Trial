export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import { createClient } from '@sanity/client';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const sanityClient = createClient({
  projectId: '5d4g60fj',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await sanityClient.assets.upload('file', buffer, {
      filename: file.name || 'upload',
      contentType: file.type || 'application/octet-stream',
    });

    return new Response(JSON.stringify({ asset }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (err) {
    console.error('upload-cv error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Sanity upload failed' }), { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
  }
}

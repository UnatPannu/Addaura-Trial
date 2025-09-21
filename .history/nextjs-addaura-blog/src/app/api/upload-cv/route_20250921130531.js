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

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    // quick env check
    if (!process.env.SANITY_API_TOKEN) {
      console.error('SANITY_API_TOKEN missing');
      return jsonResponse({ error: 'Server misconfiguration: missing SANITY_API_TOKEN' }, 500);
    }

    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      console.error('upload-cv: no file in formData');
      return jsonResponse({ error: 'No file uploaded' }, 400);
    }

    // inspect file for debugging
    const arrayBuffer = await file.arrayBuffer();
    const size = arrayBuffer.byteLength;
    console.log('upload-cv: received file:', { name: file.name, type: file.type, size });

    // optional safety: reject very large uploads early (adjust limit as needed)
    const MAX_BYTES = 6 * 1024 * 1024; // 6MB for debug
    if (size > MAX_BYTES) {
      console.error('upload-cv: file too large', size);
      return jsonResponse({ error: 'File too large', size }, 413);
    }

    const buffer = Buffer.from(arrayBuffer);

    let asset;
    try {
      asset = await sanityClient.assets.upload('file', buffer, {
        filename: file.name || 'upload',
        contentType: file.type || 'application/octet-stream',
      });
      console.log('upload-cv: sanity asset created id=', asset?._id || asset?.asset?._id || '(no id)');
    } catch (sanityErr) {
      console.error('upload-cv sanity upload error:', sanityErr);
      // return error body with message for debugging (safe to remove later)
      return jsonResponse({ error: 'Sanity upload failed', details: String(sanityErr) }, 502);
    }

    return jsonResponse({ asset });
  } catch (err) {
    console.error('upload-cv error:', err);
    return jsonResponse({ error: err.message || 'Unknown server error', stack: (err.stack || '').split('\n').slice(0,5) }, 500);
  }
}

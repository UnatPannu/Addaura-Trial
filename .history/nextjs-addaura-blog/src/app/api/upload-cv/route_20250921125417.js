export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import { IncomingForm } from 'formidable';
import fs from 'fs';
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
  return new Promise((resolve) => {
    const form = new IncomingForm();

    // formidable expects a Node request; runtime=nodejs ensures compatibility
    form.parse(request, async (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: 'File parsing error' }), { status: 500, headers: CORS_HEADERS }));
        return;
      }

      const file = files?.resume;
      if (!file) {
        resolve(new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400, headers: CORS_HEADERS }));
        return;
      }

      try {
        const fileBuffer = fs.readFileSync(file.filepath);
        const asset = await sanityClient.assets.upload('file', fileBuffer, {
          filename: file.originalFilename,
          contentType: file.mimetype,
        });

        resolve(new Response(JSON.stringify({ asset }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }));
      } catch (error) {
        console.error('Sanity upload error:', error);
        resolve(new Response(JSON.stringify({ error: 'Sanity upload failed' }), { status: 500, headers: CORS_HEADERS }));
      }
    });
  });
}

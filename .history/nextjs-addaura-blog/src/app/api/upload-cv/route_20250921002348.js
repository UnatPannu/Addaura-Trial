import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createClient } from '@sanity/client';

// Disable Next.js body parsing to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

const sanityClient = createClient({
  projectId: '5d4g60fj', 
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

if (request.method === 'OPTIONS') {
  return new Response(null, { headers });
}
export async function POST(request) {
  return new Promise((resolve) => {
    const form = new IncomingForm();

    // formidable expects a Node.js IncomingMessage, so get raw request from fetch Request object
    form.parse(request, async (err, fields, files) => {
      if (err) {
        resolve(
          new Response(JSON.stringify({ error: 'File parsing error' }), { status: 500 })
        );
        return;
      }

      const file = files.resume;
      if (!file) {
        resolve(
          new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 })
        );
        return;
      }

      try {
        const fileBuffer = fs.readFileSync(file.filepath);
        const asset = await sanityClient.assets.upload('file', fileBuffer, {
          filename: file.originalFilename,
          contentType: file.mimetype,
        });

        resolve(
          new Response(JSON.stringify({ asset }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      } catch (error) {
        console.error('Sanity upload error:', error);
        resolve(
          new Response(JSON.stringify({ error: 'Sanity upload failed' }), { status: 500 })
        );
      }
    });
  });
}

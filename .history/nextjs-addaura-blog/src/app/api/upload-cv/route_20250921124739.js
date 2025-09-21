import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createClient } from '@sanity/client';

export const config = { api: { bodyParser: false } };

const sanityClient = createClient({
  projectId: '5d4g60fj',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request) {
  return new Promise((resolve) => {
    const form = new IncomingForm();

    form.parse(request, async (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: 'File parsing error' }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" }}));
        return;
      }

      const file = files.resume;
      if (!file) {
        resolve(new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400, headers: { "Access-Control-Allow-Origin": "*" }}));
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
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }));
      } catch (error) {
        console.error('Sanity upload error:', error);
        resolve(new Response(JSON.stringify({ error: 'Sanity upload failed' }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" }}));
      }
    });
  });
}

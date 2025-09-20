import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createClient } from '@sanity/client';

export const config = { api: { bodyParser: false } };

const sanityClient = createClient({
  projectId: '5d4g60fj', // replace with your projectId
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export default async function handler(req, res) {
  //CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://addaura-trial.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  //Form Submission Handling
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File parsing error' });

    const file = files.resume;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const fileBuffer = fs.readFileSync(file.filepath);
      const asset = await sanityClient.assets.upload('file', fileBuffer, {
        filename: file.originalFilename,
        contentType: file.mimetype,
      });
      res.status(200).json({ asset });
    } catch (uploadError) {
      res.status(500).json({ error: 'Sanity upload failed' });
    }
  });
}

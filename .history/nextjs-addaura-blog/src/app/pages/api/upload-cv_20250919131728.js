import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createClient } from '@sanity/client';

export const config = { api: { bodyParser: false } };

const sanityClient = createClient({
  projectId: '', // replace with your projectId
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.skX33uiBi0RsrJjM881rfx04KyQhEgv5ogk56is63QA5yiJ1CYYaQj9PLV3xwmxrPMOcb10qEGeWbeSpQfmn35R3a7Peq3H65pTGkQP8KbCglv9BIBWKGv2Gx9YMFm7x0PeQdikbONcKofOGRxEQUKE056u99VdiuPwPQqQLyRwOaxyh3suZ,
  useCdn: false,
});

export default async function handler(req, res) {
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

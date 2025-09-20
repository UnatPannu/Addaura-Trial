import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: '5d4g60fj', 
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export default async function handler(req, res) {
  
  res.setHeader('Access-Control-Allow-Origin', 'https://addaura-trial.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const data = req.body;
  const { name, email, mobile, 'mobile-no': mobileNo, query, formType, cvAssetId } = data;

  if (!name || !email || !formType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const doc = {
    _type: 'formSubmission',
    name,
    email,
    submittedAt: new Date().toISOString(),
    formType,
  };

  if (formType === 'Hiring') {
    doc.mobile = mobileNo || mobile || '';
    doc.message = query || '';
  } else if (formType === 'Talent') {
    doc.mobile = mobile || '';
    if (cvAssetId) {
      doc.cv = {
        _type: 'reference',
        _ref: cvAssetId.replace('file-', ''), // Sanity asset ID cleaning
      };
    }
  }

  try {
    await sanityClient.create(doc);
    res.status(200).json({ message: 'Form submission saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save submission' });
  }
}

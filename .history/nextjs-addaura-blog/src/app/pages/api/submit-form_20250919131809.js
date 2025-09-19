import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: '5d4g60fj', 
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.skX33uiBi0RsrJjM881rfx04KyQhEgv5ogk56is63QA5yiJ1CYYaQj9PLV3xwmxrPMOcb10qEGeWbeSpQfmn35R3a7Peq3H65pTGkQP8KbCglv9BIBWKGv2Gx9YMFm7x0PeQdikbONcKofOGRxEQUKE056u99VdiuPwPQqQLyRwOaxyh3suZ,
  useCdn: false,
});

export default async function handler(req, res) {
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

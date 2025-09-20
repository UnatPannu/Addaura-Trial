import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: '5d4g60fj',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  const data = await request.json();
  const { name, email, mobile, 'mobile-no': mobileNo, query, formType, cvAssetId } = data;

  if (!name || !email || !formType) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
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
        _ref: cvAssetId.replace('file-', ''),
      };
    }
  }

  try {
    await sanityClient.create(doc);
    return new Response(JSON.stringify({ message: 'Form submission saved' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to save submission' }), { status: 500 });
  }
}

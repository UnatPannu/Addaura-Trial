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
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, mobile, 'mobile-no': mobileNo, query, formType, cvAssetId } = data;

    if (!name || !email || !formType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: CORS_HEADERS }
      );
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
        // store as a "file" object that references the uploaded asset
        doc.cv = {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: cvAssetId,
          },
        };
      }
    }

    await sanityClient.create(doc);

    return new Response(
      JSON.stringify({ message: 'Form submission saved' }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to save submission', details: String(error) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

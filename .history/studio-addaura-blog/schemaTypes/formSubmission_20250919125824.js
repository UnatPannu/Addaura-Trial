export default {
  name: 'formSubmission',
  type: 'document',
  title: 'Form Submission',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'email', type: 'string', title: 'Email' },
    { name: 'mobile', type: 'string', title: 'Mobile' },
    { name: 'message', type: 'text', title: 'Message' },
    { name: 'formType', type: 'string', title: 'Form Type' },
    {
      name: 'cv',
      title: 'CV File',
      type: 'reference',
      to: [{ type: 'sanity.fileAsset' }],
    },
    { name: 'submittedAt', type: 'datetime', title: 'Submitted At' },
  ],
};

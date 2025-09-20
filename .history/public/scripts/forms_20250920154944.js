// Add this script below or in a separate module/script tag
import { createClient } from '@sanity/client';

document.addEventListener('DOMContentLoaded', () => {
  const sanityClient = createClient({
    projectId: '5d4g60fj',
    dataset: 'production',
    apiVersion: '2025-01-01',
    token: 'YOUR_SANITY_WRITE_TOKEN', // Use restricted token with upload and create doc permissions
    useCdn: false,
  });

  // Utility function for basic validation
  function validateForm(form) {
    return form.checkValidity();
  }

  // Upload CV directly to Sanity from file input
  async function uploadCV(file) {
    const asset = await sanityClient.assets.upload('file', file, {
      filename: file.name,
      contentType: file.type,
    });
    return asset._id;
  }

  // Create form submission document in Sanity
  async function createFormSubmission(data) {
    const doc = {
      _type: 'formSubmission',
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      submittedAt: new Date().toISOString(),
      formType: data.formType,
    };

    if (data.formType === 'Hiring') {
      doc.message = data.query || '';
    } else if (data.formType === 'Talent' && data.cvAssetId) {
      doc.cv = {
        _type: 'reference',
        _ref: data.cvAssetId.replace('file-', ''),
      };
    }

    return await sanityClient.create(doc);
  }

  // Handle Hiring form
  const hiringForm = document.getElementById('hiring');
  const hiringButton = document.querySelector('#hiring-section .wave-button');

  hiringButton.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validateForm(hiringForm)) {
      alert('Please fill all required fields correctly in Hiring form.');
      return;
    }

    const data = {
      name: hiringForm.name.value.trim(),
      email: hiringForm.email.value.trim(),
      mobile: hiringForm['mobile-no'].value.trim(),
      query: hiringForm.query.value.trim(),
      formType: 'Hiring',
    };

    try {
      await createFormSubmission(data);
      alert('Hiring form submitted successfully!');
      hiringForm.reset();
    } catch (error) {
      console.error(error);
      alert('Hiring form submission failed. Please try again later.');
    }
  });

  // Handle Talent form
  const talentForm = document.getElementById('talent');
  const talentButton = document.querySelector('#talent-section .wave-button');
  const fileInput = document.getElementById('resume');
  const fileNameSpan = document.getElementById('file-name');

  talentButton.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validateForm(talentForm)) {
      alert('Please fill all required fields correctly in Talent form.');
      return;
    }

    let cvAssetId = null;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Optional: check file size and type here

      try {
        cvAssetId = await uploadCV(file);
      } catch (error) {
        alert('CV upload failed. Please try again.');
        return;
      }
    }

    const data = {
      name: talentForm.name1.value.trim(),
      email: talentForm.email1.value.trim(),
      mobile: talentForm.mobile1.value.trim(),
      formType: 'Talent',
      cvAssetId,
    };

    try {
      await createFormSubmission(data);
      alert('Talent form submitted successfully!');
      talentForm.reset();
      fileNameSpan.textContent = 'No file chosen';
    } catch (error) {
      console.error(error);
      alert('Talent form submission failed. Please try again later.');
    }
  });

  // Display chosen file name for Talent CV upload
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileNameSpan.textContent = e.target.files[0].name;
    } else {
      fileNameSpan.textContent = 'No file chosen';
    }
  });
});

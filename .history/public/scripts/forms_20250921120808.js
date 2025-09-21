document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = "https://addaura-trial-next.vercel.app";
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB

  const hiringForm = document.getElementById('hiring');
  const hiringSubmitButton = document.getElementById('hiring-submit');

  const talentForm = document.getElementById('talent');
  const talentSubmitButton = document.getElementById('talent-submit');

  const fileInput = document.getElementById('resume');
  const fileNameSpan = document.getElementById('file-name');

  // Update displayed file name on file selection
  fileInput.addEventListener('change', () => {
    fileNameSpan.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
  });

  // Upload CV file to backend with size check
  async function uploadCV(file) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 4.5 MB limit');
    }

    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_BASE}/api/upload-cv`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('CV upload failed');
    }

    const data = await res.json();
    return data.asset._id;
  }

  // Send form data with optional CV asset ID in JSON format
  async function sendFormData(formEl, formType, cvAssetId = null) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;

    if (cvAssetId) {
      data.cvAssetId = cvAssetId;
    }

    const res = await fetch(`${API_BASE}/api/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = 'Form submission failed';
      try {
        const errorData = await res.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {}
      throw new Error(errorMessage);
    }
  }

  // Submit hiring form on external button click
  hiringSubmitButton.addEventListener('click', () => {
    hiringForm.requestSubmit();
  });

  // Submit talent form on external button click
  talentSubmitButton.addEventListener('click', () => {
    talentForm.requestSubmit();
  });

  // Handle hiring form submission event
  hiringForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await sendFormData(hiringForm, 'Hiring');
      alert('Hiring form submitted successfully!');
      hiringForm.reset();
    } catch (error) {
      console.error('Hiring form submission error:', error);
      alert(`Hiring form submission failed: ${error.message}`);
    }
  });

  // Handle talent form submission event
  talentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      let cvAssetId = null;
      if (fileInput.files.length > 0) {
        cvAssetId = await uploadCV(fileInput.files[0]);
      }
      await sendFormData(talentForm, 'Talent', cvAssetId);
      alert('Talent form submitted successfully!');
      talentForm.reset();
      fileNameSpan.textContent = 'No file chosen';
    } catch (error) {
      console.error('Talent form submission error:', error);
      alert(`Talent form submission failed: ${error.message}`);
    }
  });
});

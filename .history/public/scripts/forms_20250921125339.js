document.addEventListener('DOMContentLoaded', () => {
  // use relative path to avoid cross-origin preflight/405 issues
  const API_BASE = "/api";
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB limit

  const hiringForm = document.getElementById('hiring');
  const hiringSubmitButton = document.getElementById('hiring-submit');

  const talentForm = document.getElementById('talent');
  const talentSubmitButton = document.getElementById('talent-submit');

  const fileInput = document.getElementById('resume');
  const fileNameSpan = document.getElementById('file-name');

  // Show selected file name for CV upload
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

    let res;
    try {
      res = await fetch(`${API_BASE}/upload-cv`, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      // network / CORS failure
      throw new Error(`CV upload network error: ${err.message}`);
    }

    if (!res.ok) {
      // try to extract server error message
      let text;
      try {
        const json = await res.json();
        text = json?.error || JSON.stringify(json);
      } catch (_) {
        text = await res.text().catch(() => 'Unknown error');
      }
      throw new Error(`CV upload failed: ${text}`);
    }

    const data = await res.json();
    return data.asset._id;
  }

  // Send form data to submit API
  async function sendFormData(formEl, formType, cvAssetId = null) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;

    if (cvAssetId) {
      data.cvAssetId = cvAssetId;
    }

    let res;
    try {
      res = await fetch(`${API_BASE}/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw new Error(`Form submission network error: ${err.message}`);
    }

    if (!res.ok) {
      let errorMessage = 'Form submission failed';
      try {
        const errorData = await res.json();
        if (errorData?.error) errorMessage = errorData.error;
        else errorMessage = JSON.stringify(errorData);
      } catch {
        const text = await res.text().catch(() => '');
        if (text) errorMessage = text;
      }
      throw new Error(errorMessage);
    }
  }

  // External button triggers hiring form submit
  hiringSubmitButton.addEventListener('click', () => {
    hiringForm.requestSubmit();
  });

  // External button triggers talent form submit
  talentSubmitButton.addEventListener('click', () => {
    talentForm.requestSubmit();
  });

  // Handle hiring form submission
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

  // Handle talent form submission
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

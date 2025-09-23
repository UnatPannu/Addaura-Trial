document.addEventListener('DOMContentLoaded', () => {
  // Use the deployed Next API host (same origin will use relative path)
  // Set to your deployed API to avoid 404s from the static site origin
  const API_BASE = "https://addaura-trial-next.vercel.app/api";
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB limit

  // ------ HIRING FORM ------
  const hiringForm = document.getElementById('hiring');
  const hiringSubmitButton = document.getElementById('hiring-submit');

  // ------ TALENT FORM ------
  const talentForm = document.getElementById('talent');
  const talentSubmitButton = document.getElementById('talent-submit');
  const talentFileInput = document.getElementById('resume');
  const talentFileNameSpan = document.getElementById('file-name');

  // ------ SEND CV FORM ------
  const cvForm = document.getElementById('cv-form');
  const cvSubmitButton = document.getElementById('cv-submit');
  const cvFileInput = document.getElementById('resume');
  const cvFileNameSpan = document.getElementById('file-name');

  // -- Shared utility: Upload CV with size check
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
      throw new Error(`CV upload network error: ${err.message}`);
    }

    if (!res.ok) {
      let bodyText = '';
      try {
        const json = await res.json();
        bodyText = JSON.stringify(json);
      } catch (e) {
        bodyText = await res.text().catch(() => '');
      }
      throw new Error(`CV upload failed (status ${res.status}): ${bodyText || 'empty response'}`);
    }

    const data = await res.json();
    if (!data || !data.asset || !data.asset._id) {
      throw new Error(`CV upload returned unexpected body: ${JSON.stringify(data)}`);
    }
    return data.asset._id;
  }

  // -- Shared utility: Send any form data
  async function sendFormData(formEl, formType, cvAssetId = null) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;

    if (cvAssetId) {
      data.cvAssetId = cvAssetId;
      delete data.resume; // remove raw file field
    }

    // debug: log final payload
    console.log('Submitting form payload:', data);

    const res = await fetch(`${API_BASE}/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let bodyText = '';
      try {
        bodyText = JSON.stringify(await res.json());
      } catch {
        bodyText = await res.text().catch(() => '');
      }
      throw new Error(`Form submission failed (status ${res.status}): ${bodyText || 'empty response'}`);
    }
    return await res.json();
  }

  // ---------- Setup HIRING FORM --------------
  if (hiringForm && hiringSubmitButton) {
    hiringSubmitButton.addEventListener('click', () => {
      hiringForm.requestSubmit();
    });

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
  }

  // ---------- Setup TALENT FORM --------------
  if (talentForm && talentSubmitButton && talentFileInput && talentFileNameSpan) {
    talentSubmitButton.addEventListener('click', () => {
      talentForm.requestSubmit();
    });

    talentFileInput.addEventListener('change', () => {
      talentFileNameSpan.textContent = talentFileInput.files.length > 0 ? talentFileInput.files[0].name : 'No file chosen';
    });

    talentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        let cvAssetId = null;
        if (talentFileInput.files.length > 0) {
          console.log('Uploading CV file:', talentFileInput.files[0].name, talentFileInput.files[0].size);
          cvAssetId = await uploadCV(talentFileInput.files[0]);
          console.log('CV uploaded, asset id:', cvAssetId);
        } else {
          console.log('No CV selected for upload.');
        }
        const result = await sendFormData(talentForm, 'Talent', cvAssetId);
        console.log('Talent form submit result:', result);
        alert('Talent form submitted successfully!');
        talentForm.reset();
        talentFileNameSpan.textContent = 'No file chosen';
      } catch (error) {
        console.error('Talent form submission error:', error);
        alert(`Talent form submission failed: ${error.message}`);
      }
    });
  }

  // ---------- Setup SEND CV FORM --------------
  if (cvForm && cvSubmitButton && cvFileInput && cvFileNameSpan) {
    cvSubmitButton.addEventListener('click', () => {
      cvForm.requestSubmit();
    });

    cvFileInput.addEventListener('change', () => {
      cvFileNameSpan.textContent = cvFileInput.files.length > 0 ? cvFileInput.files[0].name : 'No file chosen';
    });

    cvForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        cvSubmitButton.disabled = true;
        let cvAssetId = null;
        if (cvFileInput.files.length > 0) {
          cvAssetId = await uploadCV(cvFileInput.files[0]);
        }
        await sendFormData(cvForm, 'SendCV', cvAssetId);
        alert('CV submitted successfully!');
        cvForm.reset();
        cvFileNameSpan.textContent = 'No file chosen';
      } catch (error) {
        alert('Form submission failed: ' + (error.message || error));
        console.error('SendCV form error:', error);
      } finally {
        cvSubmitButton.disabled = false;
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = "https://addaura-trial-next.vercel.app/api";
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB limit

  // ----- HIRING FORM -----
  const hiringForm = document.getElementById('hiring');
  const hiringSubmitButton = document.getElementById('hiring-submit');

  // ----- TALENT FORM -----
  const talentForm = document.getElementById('talent');
  const talentSubmitButton = document.getElementById('talent-submit');
  const talentFileInput = document.getElementById('resume'); // Talent form's input id kept as 'resume'
  const talentFileNameSpan = document.getElementById('file-name'); // Talent file name span id

  // ----- SEND CV FORM -----
  const cvForm = document.getElementById('cv-form');
  const cvSubmitButton = document.getElementById('cv-submit');
  const cvFileInput = document.getElementById('cv-resume');      // Unique ID as in your HTML
  const cvFileNameSpan = document.getElementById('cv-file-name'); // Unique ID as in your HTML

  if (cvForm && cvSubmitButton && cvFileInput && cvFileNameSpan) {
    // This listener updates the file name display immediately upon file select
    cvFileInput.addEventListener('change', () => {
      if (cvFileInput.files.length > 0) {
        cvFileNameSpan.textContent = cvFileInput.files[0].name;
      } else {
        cvFileNameSpan.textContent = 'No file chosen';
      }
    });

    // Submit button triggers form submit programmatically (in case it is outside form)
    cvSubmitButton.addEventListener('click', () => {
      cvForm.requestSubmit();
    });

    // Form submission handler
    cvForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        cvSubmitButton.disabled = true;
        let cvAssetId = null;
        if (cvFileInput.files.length > 0) {
          cvAssetId = await uploadCV(cvFileInput.files[0]);  // Your existing uploadCV function
        }
        await sendFormData(cvForm, 'Talent', cvAssetId);  // Use 'Talent' formType as you requested
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
  // --- Shared utility: upload CV file ---
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

  // --- Shared utility: send form data ---
  async function sendFormData(formEl, formType, cvAssetId = null) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;

    if (cvAssetId) {
      data.cvAssetId = cvAssetId;
      delete data.resume; // Remove raw file from JSON if present
    }

    console.log('Submitting form payload:', data);

    const res = await fetch(`${API_BASE}/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let bodyText = '';
      try { bodyText = JSON.stringify(await res.json()); } catch { bodyText = await res.text().catch(() => ''); }
      throw new Error(`Form submission failed (status ${res.status}): ${bodyText || 'empty response'}`);
    }

    return res.json();
  }

  // --- Setup Hiring form ---
  if (hiringForm && hiringSubmitButton) {
    hiringSubmitButton.addEventListener('click', () => hiringForm.requestSubmit());

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

  // --- Setup Talent form ---
  if (talentForm && talentSubmitButton && talentFileInput && talentFileNameSpan) {
    talentSubmitButton.addEventListener('click', () => talentForm.requestSubmit());

    talentFileInput.addEventListener('change', () => {
      talentFileNameSpan.textContent = talentFileInput.files.length > 0 ? talentFileInput.files[0].name : 'No file chosen';
    });

    talentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        let cvAssetId = null;
        if (talentFileInput.files.length > 0) {
          cvAssetId = await uploadCV(talentFileInput.files[0]);
        }
        await sendFormData(talentForm, 'Talent', cvAssetId);
        alert('Talent form submitted successfully!');
        talentForm.reset();
        talentFileNameSpan.textContent = 'No file chosen';
      } catch (error) {
        console.error('Talent form submission error:', error);
        alert(`Talent form submission failed: ${error.message}`);
      }
    });
  }

  // --- Setup Send CV form ---
  if (cvForm && cvSubmitButton && cvFileInput && cvFileNameSpan) {
    cvSubmitButton.addEventListener('click', () => cvForm.requestSubmit());

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

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = "https://addaura-trial-next.vercel.app/api";
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB

  // ---- CORE UTILS ----

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

  async function sendFormData(formEl, formType, cvAssetId = null) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;

    if (cvAssetId) {
      data.cvAssetId = cvAssetId;
      delete data.resume;
    }

    const res = await fetch(`${API_BASE}/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let bodyText = '';
      try { bodyText = JSON.stringify(await res.json()); } catch { bodyText = await res.text().catch(()=>''); }
      throw new Error(`Form submission failed (status ${res.status}): ${bodyText || 'empty response'}`);
    }

    return await res.json();
  }

  // ---- HIRING FORM ----

  (() => {
    const form = document.getElementById('hiring');
    const submitButton = document.getElementById('hiring-submit');
    if (!form || !submitButton) return;
    submitButton.addEventListener('click', () => form.requestSubmit());
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await sendFormData(form, 'Hiring');
        alert('Hiring form submitted successfully!');
        form.reset();
      } catch (error) {
        console.error('Hiring form submission error:', error);
        alert(`Hiring form submission failed: ${error.message}`);
      }
    });
  })();

  // ---- TALENT FORM ----

  (() => {
    const form = document.getElementById('talent');
    const submitButton = document.getElementById('talent-submit');
    const fileInput = form ? form.querySelector('input[type="file"]') : null;
    const fileNameSpan = form ? form.querySelector('#file-name') : null;
    if (!form || !submitButton) return;
    submitButton.addEventListener('click', () => form.requestSubmit());
    if (fileInput && fileNameSpan) {
      fileInput.addEventListener('change', () => {
        fileNameSpan.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
      });
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        let cvAssetId = null;
        if (fileInput && fileInput.files.length > 0) {
          cvAssetId = await uploadCV(fileInput.files[0]);
        }
        await sendFormData(form, 'Talent', cvAssetId);
        alert('Talent form submitted successfully!');
        form.reset();
        if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
      } catch (error) {
        console.error('Talent form submission error:', error);
        alert(`Talent form submission failed: ${error.message}`);
      }
    });
  })();

  // ---- SEND CV FORM ----

  (() => {
    const form = document.getElementById('cv-form');
    const submitButton = document.getElementById('cv-submit');
    const fileInput = document.getElementById('resume');
    const fileNameSpan = document.getElementById('file-name');
    if (!form || !submitButton) return;
    submitButton.addEventListener('click', () => form.requestSubmit());
    if (fileInput && fileNameSpan) {
      fileInput.addEventListener('change', () => {
        fileNameSpan.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
      });
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        submitButton.disabled = true;
        let cvAssetId = null;
        if (fileInput && fileInput.files.length > 0) {
          cvAssetId = await uploadCV(fileInput.files[0]);
        }
        await sendFormData(form, 'SendCV', cvAssetId);
        alert('CV submitted successfully!');
        form.reset();
        if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
      } catch (error) {
        alert('Form submission failed: ' + (error.message || error));
        console.error('SendCV form error:', error);
      } finally {
        submitButton.disabled = false;
      }
    });
  })();
});

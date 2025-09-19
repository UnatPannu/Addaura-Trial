document.addEventListener('DOMContentLoaded', () => {
  const hiringForm = document.getElementById('hiring');
  const hiringButton = document.querySelector('#hiring-section .wave-button');

  const talentForm = document.getElementById('talent');
  const talentButton = document.querySelector('#talent-section .wave-button');

  // CV upload function
  async function uploadCV(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('http://localhost:3000/api/upload-cv', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error('CV upload failed');
    }
    const data = await res.json();
    return data.asset._id; // Sanity asset document id
  }

  // Send form data to submit API with optional CV asset id
  async function sendFormData(formEl, formType, cvAssetId = null) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;
    if (cvAssetId) {
      data.cvAssetId = cvAssetId;
    }

    const res = await fetch('http://localhost:3000/api/submit-form', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Form submission failed');
  }

  hiringButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await sendFormData(hiringForm, 'Hiring');
      alert('Hiring form submitted successfully!');
      hiringForm.reset();
    } catch {
      alert('Hiring form submission failed!');
    }
  });

  talentButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const fileInput = document.getElementById('resume');
      let cvAssetId = null;
      if (fileInput.files.length > 0) {
        cvAssetId = await uploadCV(fileInput.files[0]);
      }
      await sendFormData(talentForm, 'Talent', cvAssetId);
      alert('Talent form submitted successfully!');
      talentForm.reset();
      document.getElementById('file-name').textContent = 'No file chosen';
    } catch {
      alert('Talent form submission failed!');
    }
  });

  // Update file name display when file selected
  document.getElementById('resume').addEventListener('change', (e) => {
    const fileNameSpan = document.getElementById('file-name');
    if (e.target.files.length > 0) {
      fileNameSpan.textContent = e.target.files[0].name;
    } else {
      fileNameSpan.textContent = 'No file chosen';
    }
  });
});

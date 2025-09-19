window.onload = () => {
  // Enable scrolling after full page load
  document.body.style.overflow = 'auto';
  // Remove any loading screen or placeholder here
};
document.addEventListener('DOMContentLoaded', () => {
  // Menu Toggle for Mobile
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
  }

  // Marquee duplication
  const marquees = document.querySelectorAll(".marquee");
  marquees.forEach((marquee) => {
    const content = marquee.querySelector(".marquee-content");
    if (content) {
      const originalHTML = content.innerHTML;
      while (marquee.scrollWidth < window.innerWidth * 2) {
        content.innerHTML += originalHTML;
      }
    }
  });

  // Form sections click logic
  const formSections = document.querySelectorAll('.form-section');
  if (formSections.length > 0) {
    formSections.forEach(section => {
      section.addEventListener('click', function (e) {
        if (e.target.closest('form') || e.target.classList.contains('wave-button')) return;
        const isActive = this.classList.contains('active');
        formSections.forEach(sec => sec.classList.remove('active'));
        if (!isActive) {
          this.classList.add('active');
        }
      });
    });
  }

  // CV Upload section handling
  const cvLabel = document.getElementById('cv-label');
  const cvClickDiv = document.getElementById('cv-click');
  const fileInput = document.getElementById('resume');
  const customUploadLabel = document.getElementById('resume-label');
  const fileNameSpan = document.getElementById('file-name');

  if (cvLabel && cvClickDiv && fileInput && customUploadLabel && fileNameSpan) {
    // Toggle expansion on CV label click
    cvLabel.addEventListener('click', () => {
      cvClickDiv.classList.toggle('focus');
    });

    // Update file name display when files selected
    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      if (files.length === 0) {
        fileNameSpan.textContent = 'No file chosen';
        cvClickDiv.classList.remove('focus');
      } else if (files.length === 1) {
        fileNameSpan.textContent = files[0].name;
        cvClickDiv.classList.add('focus');
      } else {
        fileNameSpan.textContent = `${files.length} files selected`;
        cvClickDiv.classList.add('focus');
      }
    });
  }

  // Testimonials Logo Scroller
  const logoContainer = document.querySelector('.logo-container');
  if (logoContainer) {
    const logosVisible = 5;
    const scrollAmount = logoContainer.clientWidth / logosVisible;
    logoContainer.innerHTML += logoContainer.innerHTML; // Duplicate logos for seamless loop

    function scrollToNextLogo() {
      if (logoContainer.scrollLeft >= logoContainer.scrollWidth / 2) {
        logoContainer.scrollLeft = 0;
      }
      logoContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    setInterval(scrollToNextLogo, 2000);
  }
});

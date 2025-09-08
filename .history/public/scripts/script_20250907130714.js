document.addEventListener('DOMContentLoaded', () => {
  //Menu Toggle for Mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
  // Marquee duplication
  const marquees = document.querySelectorAll(".marquee");
  marquees.forEach((marquee) => {
    const content = marquee.querySelector(".marquee-content");
    const originalHTML = content.innerHTML;
    while (marquee.scrollWidth < window.innerWidth * 2) {
      content.innerHTML += originalHTML;
    }
  });
   // Form sections click logic
    const formSections = document.querySelectorAll('.form-section');
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
});
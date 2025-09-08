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
  








});








document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('.intro-card-wrapper');
  const introSection = document.querySelector('.intro-section');

  function collapseAll() {
    wrappers.forEach(wrapper => wrapper.classList.remove('expanded'));
    introSection.classList.remove('expanded');
  }

  wrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent clicks bubbling up and collapsing

      const isExpanded = wrapper.classList.contains('expanded');

      if (isExpanded) {
        // If already expanded, collapse it
        wrapper.classList.remove('expanded');
        introSection.classList.remove('expanded');
      } else {
        // Collapse others and expand this one
        collapseAll();
        wrapper.classList.add('expanded');
        introSection.classList.add('expanded');
      }
    });
  });

  // Collapse if clicking outside any card
  document.addEventListener('click', () => {
    collapseAll();
  });
});
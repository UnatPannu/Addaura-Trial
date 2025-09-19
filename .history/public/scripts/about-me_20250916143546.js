document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('.intro-card-wrapper');
  const introSection = document.querySelector('.intro-section');
  const navbar = document.querySelector('.navbar'); // selects your <nav> element

  function collapseAll() {
    wrappers.forEach(wrapper => wrapper.classList.remove('expanded'));
    introSection.classList.remove('expanded');
    // Always revert navbar style to light
    navbar.classList.add('light-navbar');
  }

  wrappers.forEach((wrapper, i) => {
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();

      const isExpanded = wrapper.classList.contains('expanded');
      collapseAll();

      if (!isExpanded) {
        // Expand clicked card
        wrapper.classList.add('expanded');
        introSection.classList.add('expanded');

        // If it's the FIRST card (index 0), switch navbar style
        if (i === 0) {
          navbar.classList.remove('light-navbar');
        }
      }
    });
  });

  // Collapse all if clicking outside
  document.addEventListener('click', collapseAll);
});

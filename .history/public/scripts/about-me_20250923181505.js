document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('.intro-card-wrapper');
  const introSection = document.querySelector('.intro-section');

  function collapseAll() {
    wrappers.forEach(wrapper => wrapper.classList.remove('expanded'));
    introSection.classList.remove('expanded');
  }

  wrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();

      const isExpanded = wrapper.classList.contains('expanded');
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (isExpanded) {
        wrapper.classList.remove('expanded');
        introSection.classList.remove('expanded');
      } else {
        collapseAll();
        wrapper.classList.add('expanded');
        introSection.classList.add('expanded');

        if (isMobile) {
          // On mobile, prevent width or transform changes here if applied by JS
          // For example, remove inline styles or reset transforms if your code changes those
          wrapper.style.width = "";
          wrapper.style.transform = "";
          const card = wrapper.querySelector('.intro-card');
          if (card) {
            card.style.width = "";
            card.style.transform = "";
          }
        }
      }
    });
  });

  // Collapse if clicking outside cards
  document.addEventListener('click', () => {
    collapseAll();
  });
});

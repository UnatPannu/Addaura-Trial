document.addEventListener('DOMContentLoaded', () => {
  const firstSection = document.querySelector('.intro-card-wrapper');
  const navbar = document.querySelector('nav.navbar.light-navbar');
  const introSection = document.querySelector('.intro-section');

  console.log('firstSection:', firstSection);
  console.log('navbar:', navbar);
  console.log('introSection:', introSection);

  if (!firstSection || !navbar || !introSection) {
    console.error('One or more elements not found');
    return;
  }

  firstSection.addEventListener('click', () => {
    navbar.classList.toggle('dark-mode');
    introSection.classList.toggle('dark-bg');
    console.log('click toggled');
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
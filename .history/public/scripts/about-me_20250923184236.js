//Navbar Toggle - Intro Section
document.addEventListener('DOMContentLoaded', () => {
  const firstSection = document.querySelector('.intro-card-wrapper');
  const navbar = document.querySelector('nav.navbar.light-navbar');
  const introSection = document.querySelector('.intro-section');

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

//Intro-Section Clicking (SINGLE VERSION - remove the duplicate)
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

      if (isExpanded) {
        wrapper.classList.remove('expanded');
        introSection.classList.remove('expanded');
      } else {
        collapseAll();
        wrapper.classList.add('expanded');
        introSection.classList.add('expanded');
      }
    });
  });

  document.addEventListener('click', () => {
    collapseAll();
  });
});

// Background hover effects
document.querySelectorAll('.card-bg.rotated-bg').forEach(triangle => {
  triangle.addEventListener('mouseenter', () => {
    const wrapper = triangle.closest('.intro-card-wrapper');
    if (wrapper) {
      wrapper.classList.add('hovered');
    }
  });

  triangle.addEventListener('mouseleave', () => {
    const wrapper = triangle.closest('.intro-card-wrapper');
    if (wrapper) {
      wrapper.classList.remove('hovered');
    }
  });
});

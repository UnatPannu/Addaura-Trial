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
document.addEventListener('DOMContentLoaded', () => {
  //Menu Toggle for Mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
  // Glitch Effect
  const glitchImage = document.querySelector('.glitch-image');
if (glitchImage) {
  const pixelGrid = glitchImage.querySelector('.pixel-grid');
  for (let i = 0; i < 10000; i++) {
    const pixel = document.createElement('div');
    const delay = (Math.random() * 1).toFixed(2);
    pixel.style.transitionDelay = `${delay}s`;
    pixelGrid.appendChild(pixel);
  }

  let hasPlayed = false; // prevent replay on scroll up

  const glitchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        glitchImage.classList.add('visible');
        hasPlayed = true; // only trigger once
      }
    });
  }, { threshold: 0.5 });

  glitchObserver.observe(glitchImage);
}
});
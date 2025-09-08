document.addEventListener('DOMContentLoaded', () => {
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

// Testimonials Logo Scroller
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        const logosVisible = 5;
        const scrollAmount = logoContainer.clientWidth / logosVisible;
    logoContainer.innerHTML += logoContainer.innerHTML; // Duplicate logos for seamless loop
    function scrollToNextLogo() {
        if (logoContainer.scrollLeft >= logoContainer.scrollWidth / 2) {     // If we’re near the reset point, jump back instantly
            logoContainer.scrollLeft = 0;
        }
        logoContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });         // Then scroll smoothly
  }
  setInterval(scrollToNextLogo, 2000); // one logo every 2s
}
//Testimonials Mobile Scroller (works with 80% width + gap)
const carousel =
  document.querySelector(".testimonials-carousel") ||
  document.querySelector(".testimonials-container");
if (carousel && window.innerWidth <= 768) {
  const items = Array.from(carousel.querySelectorAll(".testimonial"));
  if (items.length) {
    let i = 0;
    const centerTo = (el) => { // Center any slide in the viewport, regardless of widths/padding/gap
      const left =
        el.offsetLeft - (carousel.clientWidth - el.clientWidth) / 2;
      carousel.scrollTo({ left, behavior: "smooth" });
      items.forEach(it => it.classList.toggle("active", it === el));
    };
    requestAnimationFrame(() => centerTo(items[0]));  // Ensure first slide is centered after layout paint
    const AUTO_MS = 5000;       // Auto-advance
    let timer = setInterval(() => {
      i = (i + 1) % items.length;
      centerTo(items[i]);
    }, AUTO_MS);
    const setActiveByCenter = () => {   // If user scrolls by hand, highlight the centered one   
      const mid = carousel.scrollLeft + carousel.clientWidth / 2;
      let best = items[0], bestDist = Infinity;
      for (const el of items) {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = Math.abs(mid - c);
        if (d < bestDist) { bestDist = d; best = el; }
      }
      items.forEach(it => it.classList.toggle("active", it === best));
    };
    carousel.addEventListener("scroll", setActiveByCenter);
   
    window.addEventListener("resize", () => {      // On resize, re-center current slide (dimensions change)
      centerTo(items[i]);
    });
  }
}

});
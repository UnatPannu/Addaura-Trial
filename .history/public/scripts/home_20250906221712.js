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
// Duplicate logos for seamless loop
    logoContainer.innerHTML += logoContainer.innerHTML;
    function scrollToNextLogo() {
    // If we’re near the reset point, jump back instantly
        if (logoContainer.scrollLeft >= logoContainer.scrollWidth / 2) {
            logoContainer.scrollLeft = 0;
        }
        // Then scroll smoothly
        logoContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  setInterval(scrollToNextLogo, 2000); // one logo every 2s
}
  //Testimonials Mobile Scroller
// Mobile testimonials auto-center scroller (works with 80% width + gap)
const carousel =
  document.querySelector(".testimonials-carousel") ||
  document.querySelector(".testimonials-container");

if (carousel && window.innerWidth <= 768) {
  const items = Array.from(carousel.querySelectorAll(".testimonial"));
  if (items.length) {
    let i = 0;

    // Center any slide in the viewport, regardless of widths/padding/gap
    const centerTo = (el) => {
      const left =
        el.offsetLeft - (carousel.clientWidth - el.clientWidth) / 2;
      carousel.scrollTo({ left, behavior: "smooth" });
      items.forEach(it => it.classList.toggle("active", it === el));
    };

    // Ensure first slide is centered after layout paint
    requestAnimationFrame(() => centerTo(items[0]));

    // Auto-advance
    const AUTO_MS = 5000;
    let timer = setInterval(() => {
      i = (i + 1) % items.length;
      centerTo(items[i]);
    }, AUTO_MS);

    // If user scrolls by hand, highlight the centered one
    const setActiveByCenter = () => {
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

    // On resize, re-center current slide (dimensions change)
    window.addEventListener("resize", () => {
      centerTo(items[i]);
    });
  }
}

});
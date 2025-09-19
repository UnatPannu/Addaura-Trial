//Industry Expertise Parallax
document.addEventListener("scroll", () => {
  const section = document.querySelector(".industry-expertise");
  const img = document.querySelector(".industry-expertise .images-section img");
  if (!img) {
    console.warn("Image inside .industry-expertise not found.");
  }

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight && rect.bottom > 0) {
    // How far into the section we are
    let progress = (windowHeight - rect.top) / (windowHeight + rect.height);

    // Increase parallax strength (try 200–300px instead of 100)
    let offset = (progress - 0.5) * 400; 
    img.style.transform = `translateY(${offset}px)`;
  }
});
//for-teams-and-talent-services
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-section");
  const labels = document.querySelectorAll(".label");
  let isClickScrolling = false;

  window.addEventListener("scroll", () => {
    if (isClickScrolling) return;

    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const secMidpoint = rect.top + rect.height / 2;
      const distanceToCenter = Math.abs(secMidpoint - viewportCenter);

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (distanceToCenter < minDistance) {
          minDistance = distanceToCenter;
          closestIndex = i;
        }
      }
    });

    sections.forEach((sec, i) => sec.classList.toggle("active", i === closestIndex));
    labels.forEach((label, i) => label.classList.toggle("active", i === closestIndex));
  });

  // Click → scroll to exact section top with offset
  labels.forEach((label, i) => {
    label.addEventListener("click", () => {
      isClickScrolling = true;

      const yOffset = -70; // adjust gap if needed
      const y = sections[i].getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      sections.forEach((sec, j) => sec.classList.toggle("active", j === i));
      labels.forEach((label, j) => label.classList.toggle("active", j === i));

      setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });
});

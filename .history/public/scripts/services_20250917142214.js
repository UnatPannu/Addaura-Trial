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

  // Scroll spy
  window.addEventListener("scroll", () => {
  if (isClickScrolling) return;
  let closestIdx = 0;
  let minDist = Infinity;
  const viewportCenter = window.innerHeight / 2;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const dist = Math.abs(mid - viewportCenter);
    if (dist < minDist && rect.bottom > 0 && rect.top < window.innerHeight) {
      minDist = dist;
      closestIdx = i;
    }
  });
  // If out of all view, make last section active
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
    closestIdx = sections.length - 1;
  }
  sections.forEach((sec, i) => sec.classList.toggle("active", i === closestIdx));
  labels.forEach((label, i) => label.classList.toggle("active", i === closestIdx));
});


  // Click → scroll to exact section top
  labels.forEach((label, i) => {
    label.addEventListener("click", () => {
      isClickScrolling = true;

      const yOffset = -70; // adjust this if you want a small gap
      const y = sections[i].getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });

      sections.forEach((sec, j) => sec.classList.toggle("active", j === i));
      labels.forEach((label, j) => label.classList.toggle("active", j === i));

      setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const rightPanel = document.querySelector(".right-panel");

  rightPanel.addEventListener("wheel", (e) => {
    const atTop = rightPanel.scrollTop === 0;
    const atBottom =
      rightPanel.scrollHeight - rightPanel.scrollTop === rightPanel.clientHeight;

    // If we are not at the boundary, prevent scrolling the page
    if (!(atTop && e.deltaY < 0) && !(atBottom && e.deltaY > 0)) {
      e.stopPropagation();
    }
  }, { passive: false });
});
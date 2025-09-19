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
  const rightPanel = document.querySelector(".right-panel");
  const sections = rightPanel.querySelectorAll(".content-section");
  const labels = document.querySelectorAll(".label");
  let isClickScrolling = false;
  let scrollingPaused = false;

  // Scroll spy on rightPanel scroll
  rightPanel.addEventListener("scroll", () => {
    if (isClickScrolling) return;

    const scrollTop = rightPanel.scrollTop;
    const viewportHeight = rightPanel.clientHeight;

    let index = 0;
    sections.forEach((sec, i) => {
      const offsetTop = sec.offsetTop;
      if (scrollTop >= offsetTop - viewportHeight * 0.2 &&
          scrollTop < offsetTop + sec.offsetHeight - viewportHeight * 0.8) {
        index = i;
      }
    });

    sections.forEach((sec, i) => sec.classList.toggle("active", i === index));
    labels.forEach((label, i) => label.classList.toggle("active", i === index));
  });

  // Scroll pause on wheel inside rightPanel
  rightPanel.addEventListener("wheel", (e) => {
    if (scrollingPaused || isClickScrolling) {
      e.preventDefault();
      return false;
    }

    const scrollTop = rightPanel.scrollTop;
    const viewportHeight = rightPanel.clientHeight;
    const direction = e.deltaY > 0 ? 1 : -1;

    let currentSectionIndex = 0;
    sections.forEach((sec, i) => {
      const offsetTop = sec.offsetTop;
      if (scrollTop >= offsetTop - viewportHeight * 0.2 &&
          scrollTop < offsetTop + sec.offsetHeight - viewportHeight * 0.8) {
        currentSectionIndex = i;
      }
    });

    const nextIndex = direction > 0 ? currentSectionIndex + 1 : currentSectionIndex - 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const nextSectionTop = sections[nextIndex].offsetTop;
    const distanceToNext = nextSectionTop - scrollTop;

    if (direction > 0 && distanceToNext > 0 && distanceToNext < 100 && !scrollingPaused) {
      scrollingPaused = true;

      rightPanel.scrollTo({ top: nextSectionTop, behavior: "smooth" });

      setTimeout(() => { scrollingPaused = false; }, 600);

      e.preventDefault();
      return false;
    }
  }, { passive: false });

  // Label click scroll
  labels.forEach((label, i) => {
    label.addEventListener("click", () => {
      isClickScrolling = true;
      const y = sections[i].offsetTop;

      rightPanel.scrollTo({ top: y, behavior: "smooth" });

      sections.forEach((sec, j) => sec.classList.toggle("active", j === i));
      labels.forEach((label, j) => label.classList.toggle("active", j === i));

      setTimeout(() => { isClickScrolling = false; }, 800);
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
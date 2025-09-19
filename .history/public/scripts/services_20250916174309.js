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
    let index = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.2 && rect.bottom >= window.innerHeight * 0.8) {
        index = i;
      }
    });
    sections.forEach((sec, i) => sec.classList.toggle("active", i === index));
    labels.forEach((label, i) => label.classList.toggle("active", i === index));
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
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.right-panel > *');
  const labels = document.querySelectorAll('.left-panel .label'); // adjust selector for your labels

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target);
        labels.forEach(label => label.classList.remove('active'));
        if (labels[index]) labels[index].classList.add('active');
      }
    });
  }, { threshold: 0.6 }); // 60% of section visible triggers

  sections.forEach(section => observer.observe(section));
});

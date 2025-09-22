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

  // Only change: if we've scrolled below the last section, keep last active
  const lastSection = sections[sections.length - 1];
  const lastRect = lastSection.getBoundingClientRect();
  if (lastRect.bottom <= window.innerHeight * 0.8) {
    index = sections.length - 1;
  }

  sections.forEach((sec, i) => sec.classList.toggle("active", i === index));
  labels.forEach((label, i) => label.classList.toggle("active", i === index));
});

  // Click → scroll to exact section top
  labels.forEach((label, i) => {
    label.addEventListener("click", () => {
      isClickScrolling = true;

      const yOffset = -160; // adjust this if you want a small gap
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
document.addEventListener("DOMContentLoaded", function() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    const accordions = document.querySelectorAll('.for-teams-and-talent .section');
    
    function closeAll() {
      accordions.forEach(section => {
        section.classList.remove('expanded');
        const dd = section.querySelector('.mobile-dropdown');
        if (dd) {
          dd.style.maxHeight = "0";
          dd.style.overflow = "hidden";
        }
      });
    }

    accordions.forEach(section => {
      const dd = section.querySelector('.mobile-dropdown');
      if (!dd) return;
      dd.style.maxHeight = "0";
      dd.style.overflow = "hidden";
      dd.style.transition = "max-height 0.4s cubic-bezier(.77,0,.18,1)";
      
      section.addEventListener('click', function(e) {
        // Ignore clicks on interactive elements inside
        if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
        // Collapse if already open, expand otherwise
        const alreadyOpen = section.classList.contains('expanded');
        closeAll();
        if (!alreadyOpen) {
          section.classList.add('expanded');
          dd.style.maxHeight = dd.scrollHeight + "px";
          dd.style.overflow = "visible";
        }
      });
    });
  }
});

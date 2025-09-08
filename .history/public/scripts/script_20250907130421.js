document.addEventListener('DOMContentLoaded', () => {
  //Menu Toggle for Mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
  // Marquee duplication
  const marquees = document.querySelectorAll(".marquee");
  marquees.forEach((marquee) => {
    const content = marquee.querySelector(".marquee-content");
    const originalHTML = content.innerHTML;
    while (marquee.scrollWidth < window.innerWidth * 2) {
      content.innerHTML += originalHTML;
    }
  });
  








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



document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('.intro-card-wrapper');
  const introSection = document.querySelector('.intro-section');

  function collapseAll() {
    wrappers.forEach(wrapper => wrapper.classList.remove('expanded'));
    introSection.classList.remove('expanded');
  }

  wrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent clicks bubbling up and collapsing

      const isExpanded = wrapper.classList.contains('expanded');

      if (isExpanded) {
        // If already expanded, collapse it
        wrapper.classList.remove('expanded');
        introSection.classList.remove('expanded');
      } else {
        // Collapse others and expand this one
        collapseAll();
        wrapper.classList.add('expanded');
        introSection.classList.add('expanded');
      }
    });
  });

  // Collapse if clicking outside any card
  document.addEventListener('click', () => {
    collapseAll();
  });
});


  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
  });
const marquees = document.querySelectorAll(".marquee");

marquees.forEach((marquee) => {
  const content = marquee.querySelector(".marquee-content");
  const originalHTML = content.innerHTML;

  while (marquee.scrollWidth < window.innerWidth * 2) {
    content.innerHTML += originalHTML;
  }
});
//Glitch Effect
document.addEventListener("DOMContentLoaded", () => {
  const glitchImage = document.querySelector('.glitch-image');
  const pixelGrid = glitchImage.querySelector('.pixel-grid');

  for (let i = 0; i < 10000; i++) {
    const pixel = document.createElement('div');
    const delay = (Math.random() * 1).toFixed(2);
    pixel.style.transitionDelay = `${delay}s`;
    pixelGrid.appendChild(pixel);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        glitchImage.classList.add('visible');
      } else {
        glitchImage.classList.remove('visible');
      }
    });
  }, { threshold: 0.5 });

  observer.observe(glitchImage);
});
//Testimonials Logo Scroller
const logoContainer = document.querySelector('.logo-container');
const logos = document.querySelectorAll('.testimonial-logo');
const logosVisible = 5; // number of logos visible at once

const scrollAmount = logoContainer.clientWidth / logosVisible;
let currentScroll = 0;

function scrollToNextLogo() {
  currentScroll += scrollAmount;
  if (currentScroll >= logoContainer.scrollWidth - logoContainer.clientWidth) {
    currentScroll = 0;
  }
  logoContainer.scrollTo({
    left: currentScroll,
    behavior: 'smooth',
  });
}

setInterval(scrollToNextLogo, 2000);


//Teams and Talent positioning
window.addEventListener("load", function () {
  const teamsTalent = document.querySelector(".teams-talent");
  const screenHeight = window.innerHeight;

  // Increase height based on scroll length or pin duration
  teamsTalent.style.minHeight = `${screenHeight/2}px`; // adjust as needed
});

//Teams And Talent Scroll Animation
window.addEventListener("load", function () {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 👇 Everything from GSAP registration to animation timeline
      gsap.registerPlugin(ScrollTrigger);

      const heading = document.querySelector(".teams-talent .heading");
      const sections = gsap.utils.toArray(".teams-talent .section");
      const headingTitle = heading.querySelector("h3");
      const headingDesc = heading.querySelector("p");
      const headingList = heading.querySelector(".heading-list");

      headingTitle.textContent = "For Teams and Talent";
      headingDesc.textContent = "Addaura adapts to your hiring needs in Fintech, Greentech, and AI.";

      let textChanged = false;
      const headingHeight = heading.offsetHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".teams-talent",
          start: `top+=${headingHeight+100} bottom`,
          end: "+=300%",
          scrub: true,
          pin: true,
          markers: false
        }
      });

      tl.to(heading, {
        duration: 1,
        width: "25%",
        height: "350px",
        y: "-30vh",
        ease: "power1.inOut",
        onUpdate: () => {
          const progress = tl.progress();
          if (progress > 0.3 && !textChanged) {
            headingTitle.textContent = "Spot Hiring";
            headingDesc.textContent = "For urgent, high-impact roles that require extra attention.";
            heading.classList.add("spot-hiring");
            headingList.innerHTML = `
              <li>Targeted, efficient sourcing</li>
              <li>Ideal for niche or time-sensitive hires</li>
              <li>Process handled from sourcing to offer</li>
            `;
            textChanged = true;
          } else if (progress <= 0.3 && textChanged) {
            headingTitle.textContent = "For Teams and Talent";
            headingDesc.textContent = "Addaura adapts to your hiring needs in Fintech, Greentech, and AI.";
            heading.classList.remove("spot-hiring");
            headingList.innerHTML = "";
            textChanged = false;
          }
        }
      });

      sections.forEach((section) => {
        gsap.set(section, {
          opacity: 0,
          x: 0,
          zIndex: 0,
          position: "absolute",
          top: "-30vh",
          width: "25%"
        });
      });

      tl.to(sections[0], {
        duration: 1,
        opacity: 1,
        x: "-110%",
        ease: "power2.out",
        zIndex: 1,
      }, ">0.5");

      tl.to(sections[2], {
        duration: 1,
        opacity: 1,
        x: "110%",
        ease: "power2.out",
        zIndex: 1,
      }, "<");

      ScrollTrigger.refresh(); // recalculate scroll positions
    });
  });
});
const formSections = document.querySelectorAll('.form-section');

formSections.forEach(section => {
  section.addEventListener('click', function (e) {
    // Don't toggle when clicking inside the form or button
    if (e.target.closest('form') || e.target.classList.contains('wave-button')) return;

    const isActive = this.classList.contains('active');

    // Remove 'active' from all
    formSections.forEach(sec => sec.classList.remove('active'));

    // Toggle only if it wasn't already active
    if (!isActive) {
      this.classList.add('active');
    }
  });
});
document.querySelectorAll('input[type="file"]').forEach(fileInput => {
  fileInput.addEventListener('change', function () {
    const sectionId = this.closest('.form-section').id;
    const fileNameSpan = document.querySelector(`#${sectionId} #file-name`);
    const fileNames = Array.from(this.files).map(file => file.name).join('<br/>');
    fileNameSpan.innerHTML = fileNames || 'No file chosen';
  });
});

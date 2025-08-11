document.addEventListener('DOMContentLoaded', () => {
  // ✅ Menu toggle logic
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
    const glitchObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        glitchImage.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.5 });
    glitchObserver.observe(glitchImage);
  }

  // Testimonials Logo Scroller
  const logoContainer = document.querySelector('.logo-container');
  if (logoContainer) {
    const logosVisible = 5;
    const scrollAmount = logoContainer.clientWidth / logosVisible;
    let currentScroll = 0;

    function scrollToNextLogo() {
      currentScroll += scrollAmount;
      if (currentScroll >= logoContainer.scrollWidth - logoContainer.clientWidth) {
        currentScroll = 0;
      }
      logoContainer.scrollTo({ left: currentScroll, behavior: 'smooth' });
    }

    setInterval(scrollToNextLogo, 2000);
  }

  // Teams and Talent height adjustment
  const teamsTalent = document.querySelector(".teams-talent");
  if (teamsTalent) {
    const screenHeight = window.innerHeight;
    teamsTalent.style.minHeight = `${screenHeight / 2}px`;
  }

  // Teams And Talent Scroll Animation
  if (window.innerWidth > 768) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      const heading = document.querySelector(".teams-talent .heading");
      if (!heading) return;

      const sections = gsap.utils.toArray(".teams-talent .section");
      const headingTitle = heading.querySelector("h3");
      const headingDesc = heading.querySelector("p");
      const headingList = heading.querySelector(".heading-list");

      let textChanged = false;
      const headingHeight = heading.offsetHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".teams-talent",
          start: `top+=${headingHeight + 100} bottom`,
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

      ScrollTrigger.refresh();
    });
  });
}
  // Form sections click logic
  const formSections = document.querySelectorAll('.form-section');
  formSections.forEach(section => {
    section.addEventListener('click', function (e) {
      if (e.target.closest('form') || e.target.classList.contains('wave-button')) return;
      const isActive = this.classList.contains('active');
      formSections.forEach(sec => sec.classList.remove('active'));
      if (!isActive) {
        this.classList.add('active');
      }
    });
  });

  // Triangle intersection animations
  const triangleSections = document.querySelectorAll('.triangle-section');
  const triangleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.6
  });
  triangleSections.forEach(section => triangleObserver.observe(section));

  // Navbar hover sync with intro card wrappers
const navbar = document.querySelector('.navbar');
const firstCard = document.querySelector('.intro-card-wrapper:nth-child(1)');
const logo = document.querySelector('#logo');

if (navbar && firstCard && logo) {
  firstCard.addEventListener('mouseenter', () => {
    navbar.classList.add('hovered-intro');
    logo.src = 'assets/logo.svg'; // your hover version
  });

  firstCard.addEventListener('mouseleave', () => {
    navbar.classList.remove('hovered-intro');
    logo.src = 'assets/logo-black.svg'; // original logo
  });
}


});

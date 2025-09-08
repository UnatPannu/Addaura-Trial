document.addEventListener('DOMContentLoaded', () => {
    //Glitch animation
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

    //Testimonials Logo Scroller
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
    const logosVisible = 5;
    const scrollAmount = logoContainer.clientWidth / logosVisible;
    logoContainer.innerHTML += logoContainer.innerHTML;     // Duplicate logos for seamless loop
    function scrollToNextLogo() {
        if (logoContainer.scrollLeft >= logoContainer.scrollWidth / 2) {  // If we’re near the reset point, jump back instantly
        logoContainer.scrollLeft = 0;
        }
        logoContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });         // Then scroll smoothly
    }
    setInterval(scrollToNextLogo, 2000); // one logo every 2s
    }
    //Testimonials Mobile Scroller - auto-center (works with 80% width + gap)
    const carousel =
    document.querySelector(".testimonials-carousel") ||
    document.querySelector(".testimonials-container");
    if (carousel && window.innerWidth <= 768) {
    const items = Array.from(carousel.querySelectorAll(".testimonial"));
    if (items.length) {
        let i = 0;
        const centerTo = (el) => {         // Center any slide in the viewport, regardless of widths/padding/gap
        const left =
            el.offsetLeft - (carousel.clientWidth - el.clientWidth) / 2;
        carousel.scrollTo({ left, behavior: "smooth" });
        items.forEach(it => it.classList.toggle("active", it === el));
        };
        requestAnimationFrame(() => centerTo(items[0]));         // Ensure first slide is centered after layout paint
        const AUTO_MS = 5000;         // Auto-advance
        let timer = setInterval(() => {
        i = (i + 1) % items.length;
        centerTo(items[i]);
        }, AUTO_MS);
        const setActiveByCenter = () => {         // If user scrolls by hand, highlight the centered one
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
        window.addEventListener("resize", () => {         // On resize, re-center current slide (dimensions change)
        centerTo(items[i]);
        });
    }
    }

    // Teams and Talent height adjustment
    const teamsTalent = document.querySelector(".teams-talent");
    if (teamsTalent) {
        const screenHeight = window.innerHeight;
        teamsTalent.style.minHeight = `${screenHeight / 2}px`;
    }
    // Teams And Talent Scroll Animation
    let currentMode = null; // "mobile" or "desktop"
    function initTeamsTalentAnimation() {
    if (window.ScrollTrigger) {     // Kill old animations before restarting
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    if (window.gsap) {
        gsap.globalTimeline.clear();
    }
    if (window.innerWidth <= 768) {
        console.log("Mobile mode: GSAP disabled");
        currentMode = "mobile";
        return; // No GSAP for mobile
    }
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
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    const targetHeight = isTablet ? 450 : 350;
    const targetY = isTablet ? "-45vh" : "-30vh";
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
        width: isTablet ? "30%" : "25%",
        height: `${targetHeight}px`,
        y: targetY,
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
        top: targetY,
        width: isTablet ? "30%" : "25%"
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
    currentMode = "desktop"; // Mark current mode
    }
    initTeamsTalentAnimation();    // Run on load
    window.addEventListener("resize", () => {     // Re-run when switching between mobile & desktop/tablet
    const width = window.innerWidth;
    if (width <= 768 && currentMode !== "mobile") {
        initTeamsTalentAnimation(); // Switch to mobile mode
    } else if (width > 768 && currentMode !== "desktop") {
        initTeamsTalentAnimation(); // Switch to desktop/tablet mode
    }
    });
    // Run when page loads
    document.addEventListener("DOMContentLoaded", initTeamsTalentAnimation);
    // Run when navigating back/forward
    window.addEventListener("pageshow", initTeamsTalentAnimation);
    // Run when resizing
    window.addEventListener("resize", initTeamsTalentAnimation);

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
    


    // Testimonials desktop scroller
    const testimonials = [
    {
        text: "I've had the pleasure of engaging with Marco in his role as recruiter and find him to be a diligent, persistent and focused individual.",
        author: "~ Ex-Klarna, Spotify, and Volvo Cars Engineering and Product leader"
    },
    {
        text: "Marco reached out to me for a position of VP of Engineering at Treyd while I had been freelancing for a couple of years, and has been straightforward and helpful from the start with communication and expectations which led me to follow through the offer and accept the offer in the end! Good follow up throughout the process on my side as a prospect, with a kind and nice touch in our communication that was much appreciated.",
        author: "~ Ex-CTO at Zimpler and VP Engineering at Treyd"
    },
    {
        text: "My relationship with Marco has been very smooth and cooperative from the beginning. Marco is highly competent and respectful of each request from the candidate taking care of all the aspects during the selection process. It was really a pleasure to meet him and I trusted his work.",
        author: "~ Top biometric cards engineer and CISO in EU"
    }
    ];
    let index = 0;
    const testimonialEl = document.querySelector(".testimonial-2");
    const leftArrow = document.querySelector(".arrow.left");
    const rightArrow = document.querySelector(".arrow.right");

    function showTestimonial(i) {
    testimonialEl.classList.remove("fade");
    void testimonialEl.offsetWidth; // reset animation
    testimonialEl.classList.add("fade");

    testimonialEl.innerHTML = `
        <p>“${testimonials[i].text}”</p>
        <span>${testimonials[i].author}</span>
    `;
    }

    function nextTestimonial() {
    index = (index + 1) % testimonials.length;
    showTestimonial(index);
    }

    function prevTestimonial() {
    index = (index - 1 + testimonials.length) % testimonials.length;
    showTestimonial(index);
    }

    rightArrow.addEventListener("click", nextTestimonial);
    leftArrow.addEventListener("click", prevTestimonial);

    setInterval(nextTestimonial, 5000); // auto scroll every 5s



    });


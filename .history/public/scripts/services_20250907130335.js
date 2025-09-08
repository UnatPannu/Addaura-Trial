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
    let offset = (progress - 0.5) * 300; 
    img.style.transform = `translateY(${offset}px)`;
  }
});
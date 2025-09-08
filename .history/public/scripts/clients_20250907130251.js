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

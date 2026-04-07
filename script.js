const preloader = document.getElementById("preloader");
const revealItems = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
const counters = document.querySelectorAll(".counter");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const cursorGlow = document.getElementById("cursor-glow");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevBtn = document.getElementById("prev-testimonial");
const nextBtn = document.getElementById("next-testimonial");
const bookingForm = document.getElementById("booking-form");
const statusText = document.getElementById("form-status");
const waBookBtn = document.getElementById("wa-book-btn");
const header = document.querySelector(".site-header");
const premiumHoverTargets = document.querySelectorAll(
  ".service-card, .portfolio-item, .btn, .stat-card, .carousel-btn, .socials a, .floating-whatsapp"
);

let testimonialIndex = 0;
let carouselTimer;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined";

window.addEventListener("load", () => {
  setTimeout(() => preloader.classList.add("hidden"), 550);
  runInitialAnimations();
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 14);
  },
  { passive: true }
);

function runInitialAnimations() {
  if (reducedMotion || !hasGSAP) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero .eyebrow", { y: 22, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
  gsap.from(".hero h1", { y: 34, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.25 });
  gsap.from(".hero-sub", { y: 26, opacity: 0, duration: 1, ease: "power2.out", delay: 0.33 });
  gsap.from(".hero-actions .btn", { y: 18, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power2.out", delay: 0.42 });

  revealItems.forEach((item) => {
    const dirX = item.classList.contains("reveal-left") ? -24 : item.classList.contains("reveal-right") ? 24 : 0;
    const dirY = dirX === 0 ? 24 : 0;
    gsap.fromTo(
      item,
      { y: dirY, x: dirX, opacity: 0 },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 84%" },
      }
    );
  });

  gsap.to(".hero", {
    backgroundPosition: "50% 65%",
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  gsap.from(".section h2", {
    opacity: 0,
    y: 22,
    duration: 0.75,
    stagger: 0.07,
    scrollTrigger: { trigger: "main", start: "top 70%" },
  });
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

function animateCounter(el) {
  const target = Number(el.dataset.target);
  const hasDecimal = String(el.dataset.target).includes(".");
  const obj = { val: 0 };

  if (hasGSAP && !reducedMotion) {
    gsap.to(obj, {
      val: target,
      duration: 1.7,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = hasDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
      },
      onComplete: () => {
        el.textContent = hasDecimal ? target.toFixed(1) : target;
      },
    });
    return;
  }

  const duration = 1400;
  const start = performance.now();
  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = target * eased;
    el.textContent = hasDecimal ? val.toFixed(1) : Math.floor(val);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    if (hasGSAP && !reducedMotion) {
      gsap.fromTo("#lightbox-image", { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
    if (i === index && hasGSAP && !reducedMotion) {
      gsap.fromTo(card, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }
  });
}

function nextTestimonial() {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  showTestimonial(testimonialIndex);
}

function prevTestimonial() {
  testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(testimonialIndex);
}

function restartCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextTestimonial, 4800);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    prevTestimonial();
    restartCarousel();
  });
  nextBtn.addEventListener("click", () => {
    nextTestimonial();
    restartCarousel();
  });
  restartCarousel();
}

if (cursorGlow) {
  window.addEventListener(
    "mousemove",
    (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (hasGSAP && !reducedMotion) {
        gsap.to(cursorGlow, { x, y, duration: 0.35, ease: "power3.out" });
      } else {
        cursorGlow.style.left = `${x}px`;
        cursorGlow.style.top = `${y}px`;
      }
    },
    { passive: true }
  );
}

premiumHoverTargets.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    if (hasGSAP && !reducedMotion) {
      gsap.to(element, { y: -4, duration: 0.25, ease: "power2.out" });
    }
  });
  element.addEventListener("mouseleave", () => {
    if (hasGSAP && !reducedMotion) {
      gsap.to(element, { y: 0, duration: 0.32, ease: "power2.out" });
    }
  });
});

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    const valid = validateForm(data);

    if (!valid) {
      statusText.textContent = "Please fix the highlighted fields and try again.";
      statusText.style.color = "#b3261e";
      if (hasGSAP && !reducedMotion) {
        gsap.fromTo(bookingForm, { x: -6 }, { x: 6, yoyo: true, repeat: 3, duration: 0.05 });
      }
      return;
    }

    statusText.textContent = "Appointment request sent. Our concierge will contact you shortly.";
    statusText.style.color = "#1f7a34";
    if (hasGSAP && !reducedMotion) {
      gsap.fromTo(statusText, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
    }
    bookingForm.reset();
  });
}

function setFieldError(id, message) {
  const field = document.getElementById(id);
  const error = field.parentElement.querySelector(".error");
  error.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateForm(data) {
  let isValid = true;
  const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;

  setFieldError("name", "");
  setFieldError("phone", "");
  setFieldError("service", "");
  setFieldError("datetime", "");

  if (!data.name || data.name.trim().length < 2) {
    setFieldError("name", "Enter a valid name.");
    isValid = false;
  }
  if (!phoneRegex.test(String(data.phone || "").trim())) {
    setFieldError("phone", "Enter a valid phone number.");
    isValid = false;
  }
  if (!data.service) {
    setFieldError("service", "Please choose a service.");
    isValid = false;
  }
  if (!data.datetime) {
    setFieldError("datetime", "Please select date and time.");
    isValid = false;
  }

  return isValid;
}

if (waBookBtn && bookingForm) {
  waBookBtn.addEventListener("click", () => {
    const formData = new FormData(bookingForm);
    const name = formData.get("name") || "Guest";
    const phone = formData.get("phone") || "Not provided";
    const service = formData.get("service") || "General inquiry";
    const datetime = formData.get("datetime") || "Flexible";
    const message = formData.get("message") || "No additional notes";

    const text = `Hello Lovely Looks,%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(
      phone
    )}%0AService: ${encodeURIComponent(service)}%0ADate/Time: ${encodeURIComponent(
      datetime
    )}%0ANote: ${encodeURIComponent(message)}`;

    waBookBtn.href = `https://wa.me/918210237275?text=${text}`;
  });
}

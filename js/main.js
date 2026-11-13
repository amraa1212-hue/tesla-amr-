// Mobile navigation toggle
const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".navbar__toggle");

if (navbar && navToggle) {
  navToggle.addEventListener("click", () => {
    const open = navbar.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Цэс хаах" : "Цэс нээх");
  });
}

// Offers slider: arrows, dots, and active-dot tracking
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".slider__track");
  const slides = Array.from(track.children);
  const dotsWrap = slider.querySelector(".slider__dots");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");

  const maxScroll = () => track.scrollWidth - track.clientWidth;
  const slideLeft = (i) => slides[i].offsetLeft - slides[0].offsetLeft;
  const atStart = () => track.scrollLeft <= 2;
  const atEnd = () => track.scrollLeft >= maxScroll() - 2;

  const goTo = (i) => track.scrollTo({ left: Math.min(slideLeft(i), maxScroll()) });

  const currentIndex = () => {
    if (atEnd()) return slides.length - 1;
    let closest = 0;
    slides.forEach((_, i) => {
      if (Math.abs(slideLeft(i) - track.scrollLeft) < Math.abs(slideLeft(closest) - track.scrollLeft)) {
        closest = i;
      }
    });
    return closest;
  };

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider__dot";
    dot.setAttribute("aria-label", `${i + 1}-р слайд`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.append(dot);
    return dot;
  });

  const update = () => {
    const active = currentIndex();
    dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === active)));
  };

  // Wrap around at either end so the arrows always do something
  prev.addEventListener("click", () => (atStart() ? goTo(slides.length - 1) : goTo(Math.max(currentIndex() - 1, 0))));
  next.addEventListener("click", () => (atEnd() ? goTo(0) : goTo(currentIndex() + 1)));

  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

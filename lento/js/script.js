/* =====================
   SP Menu toggle
===================== */

const menuBtn = document.getElementById("menuBtn");
const spMenu = document.getElementById("spMenu");

if (menuBtn && spMenu) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    spMenu.classList.toggle("active");
  });
}

/* =====================
   SP search toggle
===================== */

const searchBtn = document.getElementById("searchBtn");
const spSearch = document.getElementById("spSearch");

if (searchBtn && spSearch) {
  searchBtn.addEventListener("click", () => {
    spSearch.classList.toggle("active");
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    spSearch?.classList.remove("active");
    spMenu?.classList.remove("active");
    menuBtn?.classList.remove("active");
  }
});


/* =====================
   FADE IN
===================== */

const targets = document.querySelectorAll(".fade");

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }

  });

}, { threshold: 0.1 });

targets.forEach(el => observer.observe(el));


/* =====================
   HERO SLIDER
   (変更なし)
===================== */

document.addEventListener("DOMContentLoaded", function () {

  const slider = document.querySelector(".hero-slider-track");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots .dot");

  if (slider && slides.length) {

    let current = 0;
    let startX = 0;
    let isDragging = false;
    let autoSlide;

    function updateSlider() {

      slides.forEach(s => s.classList.remove("active"));
      slides[current].classList.add("active");

      dots.forEach(d => d.classList.remove("active"));
      dots[current]?.classList.add("active");

    }

    dots.forEach((dot, index) => {

      dot.addEventListener("click", () => {

        stopAuto();
        current = index;
        updateSlider();
        startAuto();

      });

    });

    function nextSlide() {

      current = (current + 1) % slides.length;
      updateSlider();

    }

    function startAuto() {

      clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, 5000);

    }

    function stopAuto() {

      clearInterval(autoSlide);

    }

    function onStart(e) {

      isDragging = true;

      startX =
        e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;

    }

    function onEnd(e) {

      if (!isDragging) return;

      isDragging = false;

      const endX =
        e.type.includes("mouse")
        ? e.clientX
        : e.changedTouches?.[0]?.clientX;

      const diff = startX - endX;

      if (Math.abs(diff) > 50) {

        if (diff > 0) {
          current = (current + 1) % slides.length;
        } else {
          current = (current - 1 + slides.length) % slides.length;
        }

        updateSlider();

      }

      startAuto();

    }

    slider.addEventListener("mousedown", onStart);
    slider.addEventListener("mouseup", onEnd);
    slider.addEventListener("mouseleave", onEnd);

    slider.addEventListener("touchstart", onStart);
    slider.addEventListener("touchend", onEnd);

    updateSlider();
    startAuto();

  }


/* =====================
   SNAP SLIDER
   (iOS + 慣性)
===================== */

function enableSnapSlider(
  sectionSelector,
  trackSelector,
  itemSelector,
  dotsSelector,
  visiblePC,
  visibleSP
) {

  const section = document.querySelector(sectionSelector);
  const track = section?.querySelector(trackSelector);
  const items = section?.querySelectorAll(itemSelector);
  const dotsContainer = section?.querySelector(dotsSelector);

  if (!track || !items.length || !dotsContainer) return;

  let current = 0;
  let startX = 0;
  let lastX = 0;
  let velocity = 0;
  let isDragging = false;

  function getVisibleCount() {
    return window.innerWidth <= 768 ? visibleSP : visiblePC;
  }

  function getTotalSlides() {
    return Math.ceil(items.length / getVisibleCount());
  }

  function createDots() {

    dotsContainer.innerHTML = "";

    for (let i = 0; i < getTotalSlides(); i++) {

      const dot = document.createElement("button");

      if (i === 0) dot.classList.add("active");

      dotsContainer.appendChild(dot);

      dot.addEventListener("click", () => {

        current = i;
        updateSlider();

      });

    }

  }

  function updateSlider() {

    const visible = getVisibleCount();
    const itemWidth = items[0].offsetWidth;
    const gap = 24;

    track.style.transform =
      `translateX(-${current * (itemWidth + gap) * visible}px)`;

    dotsContainer.querySelectorAll("button").forEach(d =>
      d.classList.remove("active")
    );

    dotsContainer.children[current]?.classList.add("active");

  }

  function onStart(e) {

    isDragging = true;

    startX =
      e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;

    lastX = startX;

  }

  function onMove(e) {

    if (!isDragging) return;

    const x =
      e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;

    velocity = x - lastX;
    lastX = x;

  }

  function onEnd() {

    if (!isDragging) return;

    isDragging = false;

    const threshold = 40;

    if (velocity < -threshold && current < getTotalSlides() - 1) {

      current++;

    } else if (velocity > threshold && current > 0) {

      current--;

    }

    updateSlider();

  }

  track.addEventListener("mousedown", onStart);
  track.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  track.addEventListener("touchstart", onStart, { passive: true });
  track.addEventListener("touchmove", onMove, { passive: true });

  /* iOS問題修正 */
  document.addEventListener("touchend", onEnd);

  window.addEventListener("resize", () => {

    current = 0;
    createDots();
    updateSlider();

  });

  createDots();
  updateSlider();

}


/* NEW ARRIVALS */

enableSnapSlider(
  ".new-arrivals",
  ".arrivals-track",
  ".arrival-item",
  ".arrivals-dots",
  4,
  2
);


/* RANKING */

enableSnapSlider(
  ".ranking-slider",
  ".arrivals-track",
  ".arrival-item",
  ".ranking-dots",
  2,
  2
);

});
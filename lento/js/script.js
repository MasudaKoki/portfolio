/* =====================
   SP MENU
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
   SP SEARCH
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
   SP ACCORDION
===================== */

document.querySelectorAll(".sp-accordion").forEach(btn => {

  btn.addEventListener("click", () => {

    const submenu = btn.nextElementSibling;

    if (!submenu) return;

    const isOpen = submenu.classList.contains("open");

    if (isOpen) {

      submenu.style.maxHeight = submenu.scrollHeight + "px";

      requestAnimationFrame(() => {
        submenu.style.maxHeight = "0px";
      });

      submenu.classList.remove("open");

    } else {

      submenu.classList.add("open");
      submenu.style.maxHeight = submenu.scrollHeight + "px";

    }

  });

});


/* =====================
   FADE IN
===================== */

const fadeTargets = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {

  fadeTargets.forEach(el => {

    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }

  });

});


/* =====================
   HERO SLIDER
===================== */

document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".hero-slider-track");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots .dot");

  if (!track || !slides.length) return;

  let current = 0;
  let startX = 0;
  let isDragging = false;
  let auto;

  function update() {

    slides.forEach(s => s.classList.remove("active"));
    slides[current].classList.add("active");

    dots.forEach(d => d.classList.remove("active"));
    dots[current]?.classList.add("active");

  }

  function next() {

    current = (current + 1) % slides.length;
    update();

  }

  function startAuto() {

    clearInterval(auto);
    auto = setInterval(next, 5000);

  }

  function stopAuto() {

    clearInterval(auto);

  }

  dots.forEach((dot, i) => {

    dot.addEventListener("click", () => {

      stopAuto();
      current = i;
      update();
      startAuto();

    });

  });

  function startDrag(e) {

    isDragging = true;

    startX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;

  }

  function endDrag(e) {

    if (!isDragging) return;

    isDragging = false;

    const endX = e.type.includes("mouse")
      ? e.clientX
      : e.changedTouches[0].clientX;

    const diff = startX - endX;

    if (Math.abs(diff) > 50) {

      if (diff > 0) {
        current = (current + 1) % slides.length;
      } else {
        current = (current - 1 + slides.length) % slides.length;
      }

      update();

    }

    startAuto();

  }

  track.addEventListener("mousedown", startDrag);
  track.addEventListener("mouseup", endDrag);
  track.addEventListener("mouseleave", endDrag);

  track.addEventListener("touchstart", startDrag, { passive: true });
  track.addEventListener("touchend", endDrag);

  update();
  startAuto();


/* =====================
   SNAP SLIDER
   (NEW ARRIVALS / RANKING)
===================== */

function enableSnapSlider(section) {

  const wrapper = section.querySelector(".arrivals-wrapper");
  const track = section.querySelector(".arrivals-track");
  const items = section.querySelectorAll(".arrival-item");
  const dotsBox = section.querySelector(".arrivals-dots");

  if (!track || !items.length || !dotsBox) return;

  let current = 0;
  let startX = 0;
  let dragging = false;

  function visible() {
    return window.innerWidth <= 768 ? 1 : 4;
  }

  function total() {
    return Math.ceil(items.length / visible());
  }

  function createDots() {

    dotsBox.innerHTML = "";

    for (let i = 0; i < total(); i++) {

      const dot = document.createElement("button");

      if (i === current) dot.classList.add("active");

      dot.addEventListener("click", () => {

        current = i;
        update();

      });

      dotsBox.appendChild(dot);

    }

  }

  function update() {

    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = 24;

    track.style.transform =
      `translateX(-${current * (itemWidth + gap) * visible()}px)`;

    dotsBox.querySelectorAll("button").forEach(d =>
      d.classList.remove("active")
    );

    dotsBox.children[current]?.classList.add("active");

  }

  function start(e) {

    dragging = true;

    startX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;

  }

  function end(e) {

    if (!dragging) return;

    dragging = false;

    const endX = e.type.includes("mouse")
      ? e.clientX
      : e.changedTouches[0].clientX;

    const diff = endX - startX;

    if (diff < -50 && current < total() - 1) current++;
    if (diff > 50 && current > 0) current--;

    update();

  }

  track.addEventListener("mousedown", start);
  track.addEventListener("mouseup", end);

  track.addEventListener("touchstart", start, { passive: true });
  track.addEventListener("touchend", end);

  window.addEventListener("resize", () => {

    current = Math.min(current, total() - 1);
    createDots();
    update();

  });

  createDots();
  update();

}

document.querySelectorAll(".new-arrivals, .ranking-slider")
  .forEach(enableSnapSlider);

});


/* =====================
   PRODUCT PAGE SLIDER
===================== */

const mainTrack = document.querySelector(".main-track");
const mainSlides = document.querySelectorAll(".main-track img");
const thumbs = document.querySelectorAll(".thumb-list img");
const prevBtn = document.querySelector(".main-prev");
const nextBtn = document.querySelector(".main-next");
const mainContainer = document.querySelector(".main-image");

if (mainTrack && mainSlides.length) {

  let current = 1;
  let startX = 0;
  let dragging = false;

  const firstClone = mainSlides[0].cloneNode(true);
  const lastClone = mainSlides[mainSlides.length - 1].cloneNode(true);

  mainTrack.appendChild(firstClone);
  mainTrack.insertBefore(lastClone, mainSlides[0]);

  const slides = document.querySelectorAll(".main-track img");

  function setPosition() {
    mainTrack.style.transform = `translateX(-${current * 100}%)`;
  }

  function move() {

    mainTrack.style.transition = "transform .4s ease";
    setPosition();

  }

  function next() {

    if (current >= slides.length - 1) return;

    current++;
    move();

  }

  function prev() {

    if (current <= 0) return;

    current--;
    move();

  }

  mainTrack.addEventListener("transitionend", () => {

    if (current === slides.length - 1) {

      mainTrack.style.transition = "none";
      current = 1;
      setPosition();

    }

    if (current === 0) {

      mainTrack.style.transition = "none";
      current = slides.length - 2;
      setPosition();

    }

  });

  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  thumbs.forEach((thumb, i) => {

    thumb.addEventListener("click", () => {

      current = i + 1;
      move();

    });

  });

  mainContainer?.addEventListener("mousedown", e => {

    dragging = true;
    startX = e.clientX;

  });

  document.addEventListener("mouseup", e => {

    if (!dragging) return;

    dragging = false;

    const diff = startX - e.clientX;

    if (diff > 60) next();
    if (diff < -60) prev();

  });

  mainContainer?.addEventListener("touchstart", e => {

    startX = e.touches[0].clientX;

  });

  mainContainer?.addEventListener("touchend", e => {

    const diff = startX - e.changedTouches[0].clientX;

    if (diff > 60) next();
    if (diff < -60) prev();

  });

  mainTrack.style.transition = "none";
  setPosition();

}
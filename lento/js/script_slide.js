// SP MENU
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const spMenu = document.getElementById("spMenu");

menuBtn.addEventListener("click", () => {
  spMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  spMenu.style.display = "none";
});

// FADE IN
const targets = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
  targets.forEach(target => {
    const rect = target.getBoundingClientRect().top;
    if (rect < window.innerHeight - 100) {
      target.classList.add("active");
    }
  });
});
const slider = document.querySelector(".hero-slider");
const track = document.querySelector(".hero-slider-track");
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

let index = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;
let autoSlideTimer;

/* ===== 基本処理 ===== */
function updateSlider() {
  const slideWidth = slider.offsetWidth;
  currentTranslate = -slideWidth * index;
  track.style.transform = `translateX(${currentTranslate}px)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

/* ===== Auto Slide ===== */
function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}

/* ===== dots ===== */
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    updateSlider();
  });
});

/* ===== Drag & Swipe ===== */
function dragStart(x) {
  startX = x;
  isDragging = true;
  stopAutoSlide();
  track.style.transition = "none";
}

function dragMove(x) {
  if (!isDragging) return;
  const diff = x - startX;
  track.style.transform = `translateX(${currentTranslate + diff}px)`;
}

function dragEnd(x) {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = "transform 0.6s ease";

  const diff = x - startX;
  const threshold = slider.offsetWidth * 0.15;

  if (diff < -threshold && index < slides.length - 1) index++;
  if (diff > threshold && index > 0) index--;

  updateSlider();
  startAutoSlide();
}

/* Mouse（hoverでは反応しない） */
slider.addEventListener("mousedown", e => dragStart(e.pageX));
window.addEventListener("mousemove", e => dragMove(e.pageX));
window.addEventListener("mouseup", e => dragEnd(e.pageX));

/* Touch */
slider.addEventListener("touchstart", e =>
  dragStart(e.touches[0].clientX)
);
slider.addEventListener("touchmove", e =>
  dragMove(e.touches[0].clientX)
);
slider.addEventListener("touchend", e =>
  dragEnd(e.changedTouches[0].clientX)
);

/* ===== Init ===== */
updateSlider();
startAutoSlide();

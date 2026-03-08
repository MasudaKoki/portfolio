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
   SP Accordion
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
const targets = document.querySelectorAll(".fade");
window.addEventListener("scroll", () => {
  targets.forEach(target => {
    if (target.getBoundingClientRect().top < window.innerHeight - 100) {
      target.classList.add("active");
    }
  });
});

/* =====================
   HERO SLIDER
===================== */
document.addEventListener("DOMContentLoaded", function () {

  /* =====================
     HERO
  ===================== */

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
    stopAuto();        // 自動再生止める
    current = index;   // クリック位置へ移動
    updateSlider();
    startAuto();       // 再開
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
  e.preventDefault();  // ← 追加
  isDragging = true;
  startX = e.type.includes("mouse")
    ? e.clientX
    : e.touches[0].clientX;
}

    function onEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.type.includes("mouse")
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

slider.addEventListener("touchstart", onStart, { passive: true });
slider.addEventListener("touchend", onEnd);

    updateSlider();
    startAuto();
  }


  /* =====================
     共通スナップスライダー関数
  ===================== */

  function enableSnapSlider(sectionSelector, trackSelector, itemSelector, dotsSelector, visiblePC, visibleSP) {

    const section = document.querySelector(sectionSelector);
    const track = section?.querySelector(trackSelector);
    const items = section?.querySelectorAll(itemSelector);
    const dotsContainer = section?.querySelector(dotsSelector);

    if (!track || !items.length || !dotsContainer) return;

    let current = 0;
    let startX = 0;
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
      const itemWidth = items[0].getBoundingClientRect().width;
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
      startX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
    }

function onEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.type.includes("mouse")
    ? e.clientX
    : e.changedTouches?.[0]?.clientX;

  const diff = endX - startX;

  const threshold = 60; // ← ここで感度調整（40〜60でOK）

  if (diff < -threshold && current < getTotalSlides() - 1) {
    current += 1;   // 必ず1スライドだけ進む
  } else if (diff > threshold && current > 0) {
    current -= 1;   // 必ず1スライドだけ戻る
  }

  updateSlider();
}

/* PC */
track.addEventListener("mousedown", onStart);
document.addEventListener("mouseup", onEnd);

/* SP */
track.addEventListener("touchstart", onStart, { passive: true });
track.addEventListener("touchmove", onStart, { passive: true });
track.addEventListener("touchend", onEnd);

    window.addEventListener("resize", () => {
      current = 0;
      createDots();
      updateSlider();
    });

    createDots();
    updateSlider();
  }


  /* =====================
     NEW ARRIVALS
  ===================== */

  enableSnapSlider(
    ".new-arrivals",
    ".arrivals-track",
    ".arrival-item",
    ".arrivals-dots",
    4,  // PC表示枚数
    2   // SP表示枚数
  );


  /* =====================
     RANKING
  ===================== */

  enableSnapSlider(
    ".ranking-slider",
    ".arrivals-track",
    ".arrival-item",
    ".ranking-dots",
    2,  // PC
    2   // SP
  );

});

/* =====================
   CATEGORY SIDEBAR ACCORDION (PC)
===================== */
document.addEventListener("click", e => {
  const toggle = e.target.closest(".category-toggle");
  if (!toggle) return;

  const item = toggle.closest(".category-item");
  const content = item.querySelector(".category-children");
  const isOpen = content.classList.contains("open");

  document.querySelectorAll(".category-children").forEach(el => {
    el.classList.remove("open");
    el.style.maxHeight = null;
    el.previousElementSibling?.classList.remove("is-open");
  });

  if (!isOpen) {
    content.classList.add("open");
    content.style.maxHeight = content.scrollHeight + "px";
    toggle.classList.add("is-open");
  }
});

// サムネイル → メイン画像切替
const track = document.querySelector(".main-track");
const slides = document.querySelectorAll(".main-track img");
const thumbs = document.querySelectorAll(".thumb-list img");
const prevBtn = document.querySelector(".main-prev");
const nextBtn = document.querySelector(".main-next");
const container = document.querySelector(".main-image");

let current = 1; // クローン分ずらす
let isDragging = false;
let startX = 0;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

const allSlides = document.querySelectorAll(".main-track img");

function setPosition() {
  track.style.transform = `translateX(-${current * 100}%)`;
}

function updateThumb() {
  thumbs.forEach(t => t.classList.remove("active"));
  const index = (current - 1 + thumbs.length) % thumbs.length;
  thumbs[index].classList.add("active");
}

function moveToSlide() {
  track.style.transition = "transform .4s ease";
  setPosition();
  updateThumb();
}

function nextSlide() {
  if (current >= allSlides.length - 1) return;
  current++;
  moveToSlide();
}

function prevSlide() {
  if (current <= 0) return;
  current--;
  moveToSlide();
}

track.addEventListener("transitionend", () => {
  if (current === allSlides.length - 1) {
    track.style.transition = "none";
    current = 1;
    setPosition();
  }
  if (current === 0) {
    track.style.transition = "none";
    current = allSlides.length - 2;
    setPosition();
  }
});

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

thumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {
    current = index + 1;
    moveToSlide();
  });
});

/* ===== PCドラッグ 安定版 ===== */

let isDown = false;
let moved = false;

container.addEventListener("mousedown", (e) => {
  e.preventDefault(); // 画像選択防止
  isDown = true;
  moved = false;
  startX = e.clientX;
});

document.addEventListener("mousemove", (e) => {
  if (!isDown) return;

  const diff = startX - e.clientX;

  if (Math.abs(diff) > 10) {
    moved = true; // ドラッグ確定
  }
});

document.addEventListener("mouseup", (e) => {
  if (!isDown) return;
  isDown = false;

  const diff = startX - e.clientX;
  const threshold = 60;

  if (moved) {
    if (diff > threshold) nextSlide();
    if (diff < -threshold) prevSlide();
  }
});

/* ===== SPスワイプ ===== */

container.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

container.addEventListener("touchend", (e) => {
  const diff = startX - e.changedTouches[0].clientX;
  const threshold = 60;

  if (diff > threshold) nextSlide();
  if (diff < -threshold) prevSlide();
});

/* 初期位置 */
track.style.transition = "none";
setPosition();
updateThumb();

// タブ切替
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

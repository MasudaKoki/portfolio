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

  const heroSlider = document.querySelector(".hero-slider-track");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll(".hero-dots .dot");

  if (heroSlider && heroSlides.length) {

    let current = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let moved = false;
    let suppressClick = false;
    let autoSlide;

    heroSlider.querySelectorAll("img").forEach(img => {
      img.draggable = false;
    });

    heroSlides.forEach(slide => {
      slide.addEventListener("dragstart", e => e.preventDefault());
      slide.addEventListener("click", e => {
        if (suppressClick) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    function updateSlider() {
      heroSlides.forEach(s => s.classList.remove("active"));
      heroSlides[current].classList.add("active");

      heroDots.forEach(d => d.classList.remove("active"));
      heroDots[current]?.classList.add("active");
    }

    heroDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        stopAuto();
        current = index;
        updateSlider();
        startAuto();
      });
    });

    function nextSlide() {
      current = (current + 1) % heroSlides.length;
      updateSlider();
    }

    function startAuto() {
      clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
      clearInterval(autoSlide);
    }

    function getPointerX(e) {
      if (e.type.includes("mouse")) return e.clientX;
      if (e.touches && e.touches[0]) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
      return currentX;
    }

    function onStart(e) {
      isDragging = true;
      moved = false;
      startX = getPointerX(e);
      currentX = startX;
      stopAuto();
    }

    function onMove(e) {
      if (!isDragging) return;
      currentX = getPointerX(e);
      if (Math.abs(currentX - startX) > 10) {
        moved = true;
      }
    }

    function onEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      const endX = getPointerX(e);
      const diff = startX - endX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          current = (current + 1) % heroSlides.length;
        } else {
          current = (current - 1 + heroSlides.length) % heroSlides.length;
        }
        updateSlider();

        suppressClick = true;
        setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      startAuto();
    }

    heroSlider.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);

    heroSlider.addEventListener("touchstart", onStart, { passive: true });
    heroSlider.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);

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
    let currentX = 0;
    let isDragging = false;

    track.querySelectorAll("img").forEach(img => {
      img.draggable = false;
    });

    track.querySelectorAll("a").forEach(link => {
      link.addEventListener("dragstart", e => e.preventDefault());
    });

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
        if (i === current) dot.classList.add("active");
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

    function getPointerX(e) {
      if (e.type.includes("mouse")) return e.clientX;
      if (e.touches && e.touches[0]) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
      return currentX;
    }

    function onStart(e) {
      isDragging = true;
      startX = getPointerX(e);
      currentX = startX;
    }

    function onMove(e) {
      if (!isDragging) return;
      currentX = getPointerX(e);
    }

    function onEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      const endX = getPointerX(e);
      const diff = endX - startX;
      const threshold = 50;

      if (diff < -threshold && current < getTotalSlides() - 1) {
        current += 1;
      } else if (diff > threshold && current > 0) {
        current -= 1;
      }

      updateSlider();
    }

    /* PC */
    track.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);

    /* SP */
    track.addEventListener("touchstart", onStart, { passive: true });
    track.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);

    window.addEventListener("resize", () => {
      current = Math.min(current, getTotalSlides() - 1);
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
    4,
    2
  );

  /* =====================
     RANKING
  ===================== */
  enableSnapSlider(
    ".ranking-slider",
    ".arrivals-track",
    ".arrival-item",
    ".ranking-dots",
    2,
    2
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

/* =====================
   PRODUCT PAGE MAIN SLIDER
===================== */
const mainTrack = document.querySelector(".main-track");
const mainSlides = document.querySelectorAll(".main-track img");
const thumbs = document.querySelectorAll(".thumb-list img");
const prevBtn = document.querySelector(".main-prev");
const nextBtn = document.querySelector(".main-next");
const mainContainer = document.querySelector(".main-image");

if (mainTrack && mainSlides.length && mainContainer) {

  let current = 1;
  let startX = 0;
  let currentX = 0;
  let isDown = false;
  let moved = false;

  mainTrack.querySelectorAll("img").forEach(img => {
    img.draggable = false;
  });

  const firstClone = mainSlides[0].cloneNode(true);
  const lastClone = mainSlides[mainSlides.length - 1].cloneNode(true);

  mainTrack.appendChild(firstClone);
  mainTrack.insertBefore(lastClone, mainSlides[0]);

  const allSlides = document.querySelectorAll(".main-track img");

  function setPosition() {
    mainTrack.style.transform = `translateX(-${current * 100}%)`;
  }

  function updateThumb() {
    thumbs.forEach(t => t.classList.remove("active"));
    const index = (current - 1 + thumbs.length) % thumbs.length;
    thumbs[index]?.classList.add("active");
  }

  function moveToSlide() {
    mainTrack.style.transition = "transform .4s ease";
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

  mainTrack.addEventListener("transitionend", () => {
    if (current === allSlides.length - 1) {
      mainTrack.style.transition = "none";
      current = 1;
      setPosition();
    }
    if (current === 0) {
      mainTrack.style.transition = "none";
      current = allSlides.length - 2;
      setPosition();
    }
  });

  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", prevSlide);

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      current = index + 1;
      moveToSlide();
    });
  });

  /* PCドラッグ */
  mainContainer.addEventListener("mousedown", (e) => {
    e.preventDefault(); // ← これを戻す
    isDown = true;
    moved = false;
    startX = e.clientX;
    currentX = startX;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    currentX = e.clientX;
    if (Math.abs(currentX - startX) > 10) {
      moved = true;
    }
  });

  document.addEventListener("mouseup", () => {
    if (!isDown) return;

    isDown = false;

    const diff = startX - currentX;
    const threshold = 60;

    if (!moved) return;

    if (diff > threshold) nextSlide();
    if (diff < -threshold) prevSlide();
  });

  /* SPスワイプ */
  mainContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    currentX = startX;
  }, { passive: true });

  mainContainer.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
  }, { passive: true });

  mainContainer.addEventListener("touchend", () => {
    const diff = startX - currentX;
    const threshold = 60;

    if (diff > threshold) nextSlide();
    if (diff < -threshold) prevSlide();
  });

  mainTrack.style.transition = "none";
  setPosition();
  updateThumb();
}

/* =====================
   TAB SWITCH
===================== */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab)?.classList.add("active");
  });
});
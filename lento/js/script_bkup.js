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
    submenu.classList.toggle("open");
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
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

if (slides.length && dots.length) {
  let current = 0;

  function updateSlider() {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  setInterval(() => {
    current = (current + 1) % slides.length;
    updateSlider();
  }, 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      current = i;
      updateSlider();
    });
  });

  updateSlider();
}

/* =====================
   HEADER SCROLL SHRINK
===================== */
const header = document.querySelector(".site-header");
const mainEl = document.querySelector("main");

if (header && mainEl) {
  const updateHeader = () => {
    header.classList.toggle("header--small", window.scrollY > 50);
    mainEl.style.setProperty("--header-height", header.offsetHeight + "px");
  };

  window.addEventListener("load", updateHeader);
  window.addEventListener("scroll", updateHeader);
  window.addEventListener("resize", updateHeader);
}

/* =====================
   NEW ARRIVALS SLIDER
===================== */

const arrivalsSection = document.querySelector(".new-arrivals");
const track = arrivalsSection?.querySelector(".arrivals-track");
const items = arrivalsSection?.querySelectorAll(".arrival-item");
const dotsContainer = arrivalsSection?.querySelector(".arrivals-dots");

if (track && items.length && dotsContainer) {

  let current = 0;

  function getVisibleCount() {
    return window.innerWidth <= 768 ? 2 : 4;
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

  window.addEventListener("resize", () => {
    current = 0;
    createDots();
    updateSlider();
  });

  createDots();
  updateSlider();
}


/* =====================
   RANKING SLIDER (SP)
===================== */

const rankingTrack = document.querySelector(".ranking-slider .arrivals-track");
const rankingItems = document.querySelectorAll(".ranking-slider .arrival-item");
const rankingDots = document.querySelector(".ranking-dots");

if (rankingTrack && rankingItems.length && rankingDots) {

  let current = 0;

  function getVisibleCount() {
    return window.innerWidth <= 768 ? 2 : 5;
  }

  function getTotalSlides() {
    return Math.ceil(rankingItems.length / 2);
  }

  function createDots() {
    rankingDots.innerHTML = "";
    for (let i = 0; i < getTotalSlides(); i++) {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      rankingDots.appendChild(dot);

      dot.addEventListener("click", () => {
        current = i;
        updateSlider();
      });
    }
  }

  function updateSlider() {
    const itemWidth = rankingItems[0].getBoundingClientRect().width;
    const gap = 24;
    rankingTrack.style.transform =
      `translateX(-${current * (itemWidth + gap) * 2}px)`;

    rankingDots.querySelectorAll("button").forEach(d =>
      d.classList.remove("active")
    );
    rankingDots.children[current]?.classList.add("active");
  }

  window.addEventListener("resize", () => {
    current = 0;
    createDots();
    updateSlider();
  });

  createDots();
  updateSlider();
}



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
document.querySelectorAll(".thumb-list img").forEach(img => {
  img.addEventListener("click", () => {
    document.querySelector(".main-image img").src = img.src;
  });
});

// タブ切替
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

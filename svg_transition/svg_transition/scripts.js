// Lenis smooth scroll initialization
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const cardContainers = document.querySelectorAll(".card-container");

// Viewport Overlay Elements
const viewportOverlay = document.querySelector(".viewport-overlay");
const overlayPath1 = document.querySelector(".viewport-path-1");
const overlayPath2 = document.querySelector(".viewport-path-2");

// Initial state for Overlay Paths
[overlayPath1, overlayPath2].forEach((path) => {
  if (path) {
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      attr: { "stroke-width": 100, stroke: "transparent" },
      opacity: 1
    });
  }
});

cardContainers.forEach((cardContainer) => {
  const cardPaths = cardContainer.querySelectorAll(".svg-stroke path");
  const cardTitle = cardContainer.querySelector(".card-title h3");
  const split = new SplitType(cardTitle, { types: "words" });

  gsap.set(split.words, { yPercent: 100 });

  cardPaths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  let tl;

  cardContainer.addEventListener("mouseenter", () => {
    if (tl) tl.kill();
    tl = gsap.timeline();
    cardPaths.forEach((path) => {
      tl.to(path, {
        strokeDashoffset: 0,
        attr: { "stroke-width": 800 },
        duration: 2.5,
        ease: "power2.out",
      }, 0);
    });
    tl.to(split.words, {
      yPercent: 0,
      duration: 1.25,
      ease: "power3.out",
      stagger: 0.1,
    }, 0.35);
  });

  cardContainer.addEventListener("mouseleave", () => {
    if (tl) tl.kill();
    tl = gsap.timeline();
    cardPaths.forEach((path) => {
      const length = path.getTotalLength();
      tl.to(path, {
        strokeDashoffset: length,
        attr: { "stroke-width": 200 },
        duration: 1,
        ease: "power2.out",
      }, 0);
    });
    tl.to(split.words, {
      yPercent: 100,
      duration: 0.5,
      ease: "power2.in",
    }, 0);
  });
});

// Navbar Interaction Logic
const navHome = document.getElementById("nav-home");
const navAbout = document.getElementById("nav-about");
const navContact = document.getElementById("nav-contact");

function animateViewport(colors) {
  const paths = [overlayPath1, overlayPath2];
  
  // Kill any ongoing animations
  gsap.killTweensOf(paths);

  // Setup initial state
  paths.forEach((path, index) => {
    const length = path.getTotalLength();
    const color = colors[index] || colors[0];
    gsap.set(path, { 
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
      attr: { stroke: color, "stroke-width": 20 }
    });
  });

  const tl = gsap.timeline();

  // Fast and snappy screen fill
  paths.forEach((path) => {
    tl.to(path, {
      strokeDashoffset: 0,
      attr: { "stroke-width": 650 },
      duration: 3, // Reduced from 2.5s to make it much faster
      ease: "power2.out",
    }, 0);
  });

  // After filling the screen, advance forwards to exit out the other side
  paths.forEach((path) => {
    const length = path.getTotalLength();
    tl.to(path, {
      strokeDashoffset: -length, // Negative length makes it exit forward!
      attr: { "stroke-width": 20 },
      duration: 2, // Keep exit slightly smooth
      ease: "power2.inOut",
    }, 2); // Starts immediately after the 1.2s fill finishes
  });
}

if(navHome) {
  navHome.addEventListener("click", () => animateViewport(["#FE5E41", "#d5ababff"])); // Orange & Gray
}
if(navAbout) {
  navAbout.addEventListener("click", () => animateViewport(["#6E44FF", "#d59fdfff"])); // Purple & Yellow
}
if(navContact) {
  navContact.addEventListener("click", () => animateViewport(["#39e6d0", "#88e7d3ff"])); // Teal & Pink
}

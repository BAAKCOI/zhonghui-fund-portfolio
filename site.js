const viewer = document.querySelector(".viewer");

if (typeof viewer.showModal === "function") {
  const title = viewer.querySelector("#viewer-title");
  const zoom = viewer.querySelector("[data-zoom]");
  const stage = viewer.querySelector(".viewer-stage");
  const image = stage.querySelector("img");
  let opener;

  function setZoom(zoomed) {
    stage.classList.toggle("is-zoomed", zoomed);
    zoom.setAttribute("aria-pressed", String(zoomed));
    zoom.textContent = zoomed ? "适应窗口" : "放大";
    stage.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-image-viewer]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = link.dataset.caption;
      image.alt = link.dataset.alt || link.querySelector("img").alt;
      image.src = link.href;
      setZoom(false);
      viewer.showModal();
    });
  });

  zoom.addEventListener("click", () => setZoom(zoom.getAttribute("aria-pressed") === "false"));
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => opener.focus({ preventScroll: true }));
}

const chapterLinks = Array.from(document.querySelectorAll(".navigation a"));
const chapters = chapterLinks.map((link) => document.querySelector(link.hash));

function updateCurrentChapter() {
  const readingLine = document.querySelector(".header").offsetHeight + Math.min(190, window.innerHeight / 4);
  const current = chapters.findLastIndex((chapter) => chapter.getBoundingClientRect().top <= readingLine);
  chapterLinks.forEach((link, index) => {
    if (current === index) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateCurrentChapter, { passive: true });
window.addEventListener("resize", updateCurrentChapter);
updateCurrentChapter();

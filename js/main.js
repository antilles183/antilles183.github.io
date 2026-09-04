(() => {
  "use strict";

  /* ============================================================
     Theme toggle (persisted)
     ============================================================ */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) applyTheme(storedTheme);

  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ============================================================
     Sticky header shadow on scroll
     ============================================================ */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============================================================
     Reveal-on-scroll via IntersectionObserver
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ============================================================
     Footer year
     ============================================================ */
  document.getElementById("year").textContent = new Date().getFullYear();
})();

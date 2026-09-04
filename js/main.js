(() => {
  "use strict";

  /* ============================================================
     Component: Tag
     Instances of a single "Tag" component, one variant per
     technology. Mirrors a Figma component-with-variants setup.
     ============================================================ */
  const TAG_VARIANTS = {
    ai:         "AI",
    openai:     "OpenAI",
    html:       "HTML",
    css:        "CSS",
    javascript: "JavaScript",
    typescript: "TypeScript",
    python:     "Python",
    cpp:        "C++",
    java:       "Java",
    react:      "React",
    fastapi:    "FastAPI",
    sheets:     "Google Sheets API",
    smtp:       "SMTP",
  };

  function createTag(variant) {
    const label = TAG_VARIANTS[variant];
    if (!label) throw new Error(`Unknown tag variant: "${variant}"`);

    const el = document.createElement("span");
    el.className = "tag";
    el.dataset.variant = variant;

    const dot = document.createElement("span");
    dot.className = "tag-dot";
    dot.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = label;

    el.append(dot, text);
    return el;
  }

  /* ============================================================
     Component: Badge
     Instances of a single "Badge" component — Live / TBD.
     ============================================================ */
  const BADGE_VARIANTS = {
    live: "Live",
    shipped: "Shipped",
    tbd: "TBD",
  };

  function createBadge(variant) {
    const label = BADGE_VARIANTS[variant];
    if (!label) throw new Error(`Unknown badge variant: "${variant}"`);

    const el = document.createElement("span");
    el.className = "badge";
    el.dataset.variant = variant;

    const dot = document.createElement("span");
    dot.className = "badge-dot";
    dot.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = label;

    el.append(dot, text);
    return el;
  }

  /* ============================================================
     Content data
     ============================================================ */
  const HERO_TAGS = ["ai", "typescript", "python", "javascript"];
  const SKILL_TAGS = [
    "ai", "openai", "html", "css", "javascript", "typescript", "python", "cpp", "java",
  ];

  const PROJECTS = [
    {
      title: "Twenty Questions",
      desc: "A classic 20 Questions game where you either quiz an AI-powered bot or let it guess what you've come up with — React frontend, FastAPI backend, real OpenAI-driven reasoning.",
      tags: ["ai", "openai", "react", "fastapi", "python", "html", "css", "typescript"],
      badge: "live",
      demo: "https://twenty-questions-alpha.vercel.app/",
      repo: null,
    },
    {
      title: "VFX Google Sheets Tracker",
      desc: "Automated monitoring bot that watches a Google Sheet for status changes and emails row owners plus an admin summary — built with Python, Google Sheets API, and Gmail SMTP.",
      tags: ["python", "sheets", "smtp"],
      badge: "shipped",
      demo: null,
      repo: "https://github.com/antilles183/vfx-google-sheets-tracker-bot",
    },
    {
      title: "Feature Selection",
      desc: "An implementation of Forward Selection and Backward Elimination feature selection algorithms — built from scratch in C++ for an Intro to AI course. Parses and normalizes Titanic data sets before performing chosen algorithm with verbose output.",
      tags: ["ai", "cpp"],
      badge: null,
      demo: null,
      repo: "https://github.com/antilles183/feature-selector",
    },
  ];

  /* ============================================================
     Render: hero + skills tag lists
     ============================================================ */
  const heroTagsEl = document.getElementById("hero-tags");
  HERO_TAGS.forEach((variant) => heroTagsEl.appendChild(createTag(variant)));

  const skillsTagsEl = document.getElementById("skills-tags");
  SKILL_TAGS.forEach((variant) => skillsTagsEl.appendChild(createTag(variant)));

  /* ============================================================
     Render: project cards
     ============================================================ */
  const linkIcon = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg>`;

  const grid = document.getElementById("project-grid");
  PROJECTS.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card reveal";

    const top = document.createElement("div");
    top.className = "card-top";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = project.title;

    top.appendChild(title);
    if (project.badge) top.appendChild(createBadge(project.badge));

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = project.desc;

    const tagRow = document.createElement("div");
    tagRow.className = "card-tags";
    project.tags.forEach((variant) => tagRow.appendChild(createTag(variant)));

    const links = document.createElement("div");
    links.className = "card-links";
    if (project.demo) {
      links.innerHTML += `<a class="card-link" href="${project.demo}" target="_blank" rel="noopener">${linkIcon}Live demo</a>`;
    }
    if (project.repo) {
      links.innerHTML += `<a class="card-link" href="${project.repo}" target="_blank" rel="noopener">${linkIcon}Source</a>`;
    }

    card.append(top, desc, tagRow, links);
    grid.appendChild(card);
  });

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
     Mobile nav toggle
     ============================================================ */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ============================================================
     Sticky header shadow on scroll
     ============================================================ */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============================================================
     Active nav link + reveal-on-scroll via IntersectionObserver
     ============================================================ */
  const navLinks = Array.from(nav.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

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
     Contact form (client-side only)
     ============================================================ */
  const form = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formNote.textContent = "Please fill in every field with a valid value.";
      formNote.classList.add("is-error");
      return;
    }

    formNote.classList.remove("is-error");
    formNote.textContent = "Thanks — your message has been noted. I'll reply soon.";
    form.reset();
  });

  /* ============================================================
     Footer year
     ============================================================ */
  document.getElementById("year").textContent = new Date().getFullYear();
})();

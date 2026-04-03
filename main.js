// ============================================
// CHETAN SAI GOLI — PORTFOLIO INTERACTIONS
// ============================================

// ── Mobile Menu Toggle ──
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

// ── Active Nav Link Detection ──
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Map filenames to nav link text
  const pageMap = {
    "index.html": "Home",
    "": "Home",
    "skills.html": "Skills",
    "projects.html": "Projects",
    "education.html": "Education",
    "contact.html": "Contact",
  };

  const activeName = pageMap[currentPage];
  if (!activeName) return;

  // Desktop nav
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.textContent.trim() === activeName) {
      link.classList.add("active");
    }
  });

  // Mobile nav
  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    if (link.textContent.trim() === activeName) {
      link.classList.add("active");
    }
  });
}

// ── Scroll Reveal Animation ──
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(
      ".project-card, .skill-group, .cert-card, .stat-card, .edu-content, .resume-card, .bio-card, .proficiency-card, .cta-card, .contact-card",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition =
        "opacity 0.5s ease, transform 0.5s ease, border-color 0.3s";
      observer.observe(el);
    });
}

// ── Proficiency Bar Animation ──
function initProficiencyBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll(".proficiency-fill");
          fills.forEach((fill) => {
            const target = fill.getAttribute("data-width");
            // Small delay for staggered effect
            setTimeout(() => {
              fill.style.width = target + "%";
            }, 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  document.querySelectorAll(".proficiency-card").forEach((card) => {
    observer.observe(card);
  });
}

// ── Initialize on DOM Ready ──
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initScrollReveal();
  initProficiencyBars();
});

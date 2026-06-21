// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 30);
}, { passive: true });

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

// ---------- Scrollspy: highlight current section in nav ----------
const navAnchors = Array.from(document.querySelectorAll('[data-nav]'));
const spySections = navAnchors
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (spySections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = navAnchors.find(a => a.getAttribute('href') === id);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  spySections.forEach(s => spy.observe(s));
}

// ---------- Reveal on scroll (sections + staggered children) ----------
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
  document.querySelectorAll('[data-countup]').forEach(el => {
    el.textContent = el.dataset.target;
  });
  document.querySelectorAll('[data-target]').forEach(el => {
    if (el.classList.contains('progress__fill')) el.style.width = el.dataset.target + '%';
  });
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        runRevealExtras(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

function runRevealExtras(section) {
  // animate progress bar
  const fill = section.querySelector('.progress__fill[data-target]');
  if (fill) {
    requestAnimationFrame(() => { fill.style.width = fill.dataset.target + '%'; });
  }
  // count-up numbers
  section.querySelectorAll('[data-countup]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ---------- Magnetic buttons ----------
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ---------- 3D tilt: hero photo + certificate cards ----------
function attachTilt(el, strength = 10) {
  if (!el || isTouch || reduceMotion) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}
attachTilt(document.getElementById('photoTilt'), 10);
document.querySelectorAll('.cert-card.tilt').forEach(card => attachTilt(card, 5));

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxMeta = document.getElementById('lightboxMeta');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    lightboxImg.src = card.dataset.img;
    lightboxImg.alt = card.dataset.title;
    lightboxTitle.textContent = card.dataset.title;
    lightboxMeta.textContent = `${card.dataset.issuer} · ${card.dataset.date}`;
    lightbox.classList.add('is-open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('is-open');
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

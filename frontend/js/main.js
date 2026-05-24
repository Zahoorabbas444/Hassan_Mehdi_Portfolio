/**
 * Hassan Mehdi Portfolio — main.js
 * Handles: loader, navbar, theme, typed text,
 *          scroll reveal, skill bars, counters,
 *          project filters, contact form (→ backend)
 */

/* ═══════════════════════════════════════
   ★ CONFIGURATION — Edit these values
═══════════════════════════════════════ */
const CONFIG = {
  // Your backend API URL (change when deployed)
  // Local development:  http://localhost:5000/api/contact
  // Deployed (Render):  https://your-app.onrender.com/api/contact
  
  API_URL: 'https://hassanmehdiportfolio-production.up.railway.app/api/contact',

  // Typed text phrases in the hero section
  typedPhrases: [
    'I build fast, modern web apps.',
    'MERN Stack Developer.',
    'Full Stack Engineer.',
    'Open to freelance & full-time.',
  ],
};

/* ═══════════════════════════════════════
   1. LOADER
═══════════════════════════════════════ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Hide after animation (~1.9s)
  setTimeout(() => loader.classList.add('hide'), 1900);
});

/* ═══════════════════════════════════════
   2. CURSOR GLOW (desktop only)
═══════════════════════════════════════ */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    cursorGlow.style.left = clientX + 'px';
    cursorGlow.style.top  = clientY + 'px';
  });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

/* ═══════════════════════════════════════
   3. NAVBAR — scroll effect + active link
═══════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#navMenu .nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar () {
  // Scrolled state
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link (which section is in view)
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === '#' + current
    );
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // Run once on load

/* Close mobile nav when a link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const collapseEl = document.getElementById('navMenu');
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
    if (bsCollapse) bsCollapse.hide();
  });
});

/* Smooth scroll for any element with class="js-scroll" data-target="#section" */
document.querySelectorAll('.js-scroll').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════
   4. DARK / LIGHT THEME TOGGLE
═══════════════════════════════════════ */
const themeBtn  = document.getElementById('themeToggle');
const ROOT      = document.documentElement;
let isDark      = localStorage.getItem('theme') !== 'light';

function applyTheme (dark) {
  ROOT.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.innerHTML = dark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

applyTheme(isDark); // Apply saved preference

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme(isDark);
  });
}

/* ═══════════════════════════════════════
   5. TYPED TEXT (hero tagline)
═══════════════════════════════════════ */
const typedEl    = document.getElementById('typed-text');
const phrases    = CONFIG.typedPhrases;
let   phraseIdx  = 0;
let   charIdx    = 0;
let   deleting   = false;

function typeLoop () {
  if (!typedEl) return;
  const phrase = phrases[phraseIdx];

  typedEl.textContent = deleting
    ? phrase.substring(0, charIdx--)
    : phrase.substring(0, charIdx++);

  let delay = deleting ? 38 : 72;

  if (!deleting && charIdx > phrase.length) {
    deleting = true;
    delay = 1800; // pause before deleting
  } else if (deleting && charIdx < 0) {
    deleting  = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay     = 350;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

/* ═══════════════════════════════════════
   6. SCROLL REVEAL
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════
   7. SKILL BARS
═══════════════════════════════════════ */
const skillsSection = document.getElementById('skills');

if (skillsSection) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  skillObserver.observe(skillsSection);
}

/* ═══════════════════════════════════════
   8. COUNTER ANIMATION (hero stats)
═══════════════════════════════════════ */
function animateCounter (el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400; // ms
  const step     = target / (duration / 16);
  let   current  = 0;

  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current < target) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const heroSection = document.getElementById('hero');
let   countersRan = false;

if (heroSection) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !countersRan) {
        countersRan = true;
        document.querySelectorAll('.counter').forEach(animateCounter);
      }
    },
    { threshold: 0.5 }
  );
  heroObserver.observe(heroSection);
}

/* ═══════════════════════════════════════
   9. PROJECT FILTER
═══════════════════════════════════════ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      // Smooth show/hide
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (match) {
        item.style.display   = '';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
      } else {
        item.style.opacity   = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ═══════════════════════════════════════
   10. BACK TO TOP BUTTON
═══════════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('show', window.scrollY > 400);
  }
}, { passive: true });

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════
   11. FOOTER YEAR
═══════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════
   12. CONTACT FORM → BACKEND API
   ★ How it works:
   - Sends POST request to your Node.js backend
   - Backend saves to MongoDB AND emails you
   - You receive a notification email instantly
═══════════════════════════════════════ */
const sendBtn    = document.getElementById('sendBtn');
const btnText    = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

function showAlert (el, duration = 5000) {
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, duration);
}

function setLoading (loading) {
  if (!btnText || !btnLoading || !sendBtn) return;
  btnText.style.display    = loading ? 'none'   : 'inline-flex';
  btnLoading.style.display = loading ? 'inline-flex' : 'none';
  sendBtn.disabled         = loading;
}

function getFormData () {
  return {
    name:    document.getElementById('fname')?.value.trim()    || '',
    email:   document.getElementById('femail')?.value.trim()   || '',
    subject: document.getElementById('fsubject')?.value.trim() || '',
    message: document.getElementById('fmessage')?.value.trim() || '',
  };
}

function clearForm () {
  ['fname','femail','fsubject','fmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function validateForm (data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.name)                    return 'Please enter your name.';
  if (!emailRegex.test(data.email))  return 'Please enter a valid email address.';
  if (!data.subject)                 return 'Please enter a subject.';
  if (data.message.length < 10)      return 'Message must be at least 10 characters.';
  return null; // valid
}

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const data  = getFormData();
    const error = validateForm(data);

    if (error) {
      // Show inline validation error
      if (formError) {
        formError.querySelector
          ? (formError.innerHTML = `<i class="bi bi-x-circle-fill"></i> ${error}`)
          : null;
        showAlert(formError, 4000);
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(CONFIG.API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert(formSuccess);
        clearForm();
      } else {
        throw new Error(result.message || 'Server error');
      }
    } catch (err) {
      console.error('Form submission error:', err.message);
      showAlert(formError);
    } finally {
      setLoading(false);
    }
  });
}

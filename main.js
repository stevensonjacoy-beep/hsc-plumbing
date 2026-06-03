/* FlowPro Plumbing — Main JS */

// ── Theme Toggle ─────────────────────────────
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function setIcon(t) {
    if (!toggle) return;
    toggle.innerHTML =
      t === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
  }

  setIcon(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      setIcon(theme);
    });
  }
})();

// ── Mobile Menu ──────────────────────────────
(function () {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    nav.setAttribute('aria-hidden', !open);
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', false);
      nav.setAttribute('aria-hidden', true);
    });
  });
})();

// ── Header scroll behavior ───────────────────
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }, { passive: true });
})();

// ── Scroll fade-in animations ─────────────────
(function () {
  const targets = document.querySelectorAll(
    '.service-card, .gallery__item, .testimonial, .stat, .trust-bar__item, .about__value, .contact__detail'
  );

  targets.forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

// ── Contact form ─────────────────────────────
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--color-error)';
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('[required]:not([value]),[required][style*="error"]');
      if (firstError) firstError.focus();
      return;
    }

    // Submit to Formspree
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';

    const data = new FormData(form);

    fetch('https://formspree.io/f/mrevznbd', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send My Request';
      if (response.ok) {
        form.reset();
        if (success) {
          success.textContent = '✓ Your request has been received! We\'ll get back to you within 2 hours.';
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { success.classList.remove('show'); }, 6000);
        }
      } else {
        if (success) {
          success.textContent = '✗ Something went wrong. Please call us at 437-776-0989.';
          success.classList.add('show');
          setTimeout(() => { success.classList.remove('show'); }, 6000);
        }
      }
    })
    .catch(() => {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send My Request';
      if (success) {
        success.textContent = '✗ Something went wrong. Please call us at 437-776-0989.';
        success.classList.add('show');
        setTimeout(() => { success.classList.remove('show'); }, 6000);
      }
    });
  });

  // Live validation clear on input
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
})();

// ── Smooth scroll for nav links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

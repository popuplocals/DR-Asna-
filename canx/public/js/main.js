/* Can X Global — homepage interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  var toTop = document.getElementById('toTop');
  var form = document.getElementById('getStartedForm');
  var status = document.getElementById('formStatus');

  /* ---- Sticky header shadow + back-to-top visibility ---- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle('is-scrolled', y > 8);
      if (toTop) toTop.hidden = y < 600;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Mobile navigation ---- */
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Sub-menu accordions (mobile only; desktop uses hover/focus).
    var subToggles = nav.querySelectorAll('.nav__sub-toggle');
    Array.prototype.forEach.call(subToggles, function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.nav__item');
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    // Close the drawer when a link is chosen or Escape is pressed.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ---- Reveal-on-scroll (progressive enhancement) ---- */
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.card, .post, .testimonial, .step, .why__points li, .stat');
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---- Get Started form (AJAX with graceful fallback) ---- */
  if (form && window.fetch) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      status.className = 'form__status';
      if (!data.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || '')) {
        status.textContent = 'Please enter your name and a valid email address.';
        status.classList.add('is-error');
        return;
      }

      button.disabled = true;
      status.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.ok) {
            status.textContent = res.message || 'Thank you! We will be in touch shortly.';
            status.classList.add('is-ok');
            form.reset();
          } else {
            status.textContent = res.error || 'Something went wrong. Please try again.';
            status.classList.add('is-error');
          }
        })
        .catch(function () {
          status.textContent = 'Network error. Please call us at +1 778 564 3555.';
          status.classList.add('is-error');
        })
        .finally(function () { button.disabled = false; });
    });
  }
})();

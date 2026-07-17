/* ===================== TSplus Manager — landing interactions ===================== */
(function () {
  'use strict';

  /* --- Apply aspect ratios to image placeholders from data-ratio --- */
  document.querySelectorAll('.shot[data-ratio]').forEach(function (el) {
    el.style.setProperty('--ratio', el.getAttribute('data-ratio'));
    el.style.aspectRatio = el.getAttribute('data-ratio');
  });

  /* --- Header shadow on scroll --- */
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile nav toggle --- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Scroll reveal --- */
  var revealTargets = document.querySelectorAll(
    '.feature-card, .split-copy, .split-media, .platform-card, .stat, .ai-point, .ai-media, .section-head, .contact-form, .contact-copy'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Current year in footer --- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --- Contact form (mailto handoff, no backend required) --- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var RECIPIENT = 'contact@tsplusmanager.com';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.className = 'form-note';
      note.textContent = '';

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        servers: form.servers.value.trim(),
        message: form.message.value.trim()
      };

      var subject = 'TSplus Manager enquiry — ' + (data.name || data.email);
      var bodyLines = [
        'Name: ' + data.name,
        'Company: ' + (data.company || '—'),
        'Email: ' + data.email,
        'TSplus servers: ' + (data.servers || '—'),
        '',
        'Message:',
        data.message
      ];
      var href = 'mailto:' + RECIPIENT +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = href;

      note.className = 'form-note ok';
      note.textContent = 'Opening your email app… If nothing happens, write us at ' + RECIPIENT + '.';
    });
  }
})();

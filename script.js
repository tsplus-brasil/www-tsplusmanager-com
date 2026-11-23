/* ===================== TSplus Manager — landing interactions ===================== */
(function () {
  'use strict';

  var LANGS = window.TSM_LANGS || [{ code: 'en', label: 'English', short: 'EN' }];
  var DICT = window.TSM_I18N;
  var STORE_KEY = 'tsm-lang';
  var current = 'en';

  /* ---------- i18n ---------- */
  // English source text is captured from the page itself.
  var en = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { en[el.getAttribute('data-i18n')] = el.textContent; });
  document.querySelectorAll('[data-i18n-content]').forEach(function (el) { en[el.getAttribute('data-i18n-content')] = el.getAttribute('content'); });
  en['form.opening'] = 'Opening your email app… If nothing happens, write to us at';
  DICT.en = en;

  function langMeta(code) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i]; return null; }

  function resolve(code) {
    if (!code) return null;
    if (langMeta(code)) return code;
    var lower = code.toLowerCase();
    for (var i = 0; i < LANGS.length; i++) {
      var c = LANGS[i].code.toLowerCase();
      if (c === lower || c.split('-')[0] === lower.split('-')[0]) return LANGS[i].code;
    }
    return null;
  }

  function t(key) { var d = DICT[current] || {}; return d[key] != null ? d[key] : en[key]; }

  function apply(code) {
    current = code;
    var meta = langMeta(code) || LANGS[0];
    var html = document.documentElement;
    html.lang = code;
    html.dir = meta.dir || 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-content'));
      if (v != null) el.setAttribute('content', v);
    });
    document.getElementById('langCurrent').textContent = meta.short;
    document.querySelectorAll('#langMenu button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-lang') === code));
    });
    if (meta.font && !document.getElementById('font-' + code)) {
      var l = document.createElement('link');
      l.id = 'font-' + code; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + meta.font + '&display=swap';
      document.head.appendChild(l);
    }
    try { localStorage.setItem(STORE_KEY, code); } catch (e) {}
    var url = new URL(window.location.href);
    if (code === 'en') url.searchParams.delete('lang'); else url.searchParams.set('lang', code);
    try { history.replaceState(null, '', url.toString()); } catch (e) {}
  }

  function setLang(code) {
    code = resolve(code) || 'en';
    if (code === 'en' || DICT[code]) { apply(code); return; }
    var s = document.createElement('script');
    s.src = 'i18n/' + code + '.js';
    s.onload = function () { apply(DICT[code] ? code : 'en'); };
    s.onerror = function () { apply('en'); };
    document.head.appendChild(s);
  }

  // Build the language menu
  var menu = document.getElementById('langMenu');
  var wrap = document.getElementById('langSwitcher');
  var btn = document.getElementById('langBtn');
  LANGS.forEach(function (l) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'option'); b.setAttribute('data-lang', l.code);
    b.setAttribute('lang', l.code); if (l.dir) b.setAttribute('dir', l.dir);
    b.innerHTML = '<span></span><small></small>';
    b.firstChild.textContent = l.label; b.lastChild.textContent = l.short;
    b.addEventListener('click', function () { setLang(l.code); closeMenu(); });
    li.appendChild(b); menu.appendChild(li);
  });
  function closeMenu() { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Initial language: ?lang= > saved choice > browser language > English
  var initial = null;
  try { initial = resolve(new URLSearchParams(window.location.search).get('lang')); } catch (e) {}
  if (!initial) { try { initial = resolve(localStorage.getItem(STORE_KEY)); } catch (e) {} }
  if (!initial) {
    var navs = navigator.languages || [navigator.language];
    for (var i = 0; i < navs.length && !initial; i++) initial = resolve(navs[i]);
  }
  setLang(initial || 'en');

  /* ---------- Header shadow ---------- */
  var header = document.getElementById('siteHeader');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- Scroll reveal ---------- */
  var targets = document.querySelectorAll('.feature-card, .split-copy, .split-media, .platform-card, .stat, .sec-card, .section-head, .step, .flow, .problem-card, .perf-item, .plan, .gallery, .contact-form, .contact-copy');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Contact form (mailto handoff) ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var RECIPIENT = 'contact@tsplusmanager.com';
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    note.className = 'form-note'; note.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var d = {
      name: form.name.value.trim(), company: form.company.value.trim(), email: form.email.value.trim(),
      servers: form.servers.value.trim(), message: form.message.value.trim()
    };
    var subject = 'TSplus Manager — ' + (d.company || d.name || d.email);
    var body = [
      'Name: ' + d.name, 'Company: ' + (d.company || '—'), 'Email: ' + d.email,
      'TSplus servers: ' + (d.servers || '—'), 'Language: ' + current, '', d.message
    ].join('\n');
    window.location.href = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.className = 'form-note ok';
    note.textContent = t('form.opening') + ' ' + RECIPIENT;
  });
})();

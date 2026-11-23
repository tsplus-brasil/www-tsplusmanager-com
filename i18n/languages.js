/* Supported languages. English is the source text in index.html; every other
   language lives in i18n/<code>.js and is loaded on demand. To add a language,
   create i18n/<code>.js (copy pt-BR.js as a template) and add a line here. */
window.TSM_LANGS = [
  { code: 'en',    label: 'English',            short: 'EN' },
  { code: 'pt-BR', label: 'Português (Brasil)', short: 'PT' },
  { code: 'es',    label: 'Español',            short: 'ES' },
  { code: 'fr',    label: 'Français',           short: 'FR' },
  { code: 'de',    label: 'Deutsch',            short: 'DE' },
  { code: 'it',    label: 'Italiano',           short: 'IT' },
  { code: 'ru',    label: 'Русский',            short: 'RU' },
  { code: 'tr',    label: 'Türkçe',             short: 'TR' },
  { code: 'ar',    label: 'العربية',            short: 'AR', dir: 'rtl', font: 'Noto+Sans+Arabic:wght@400;500;600;700;800' },
  { code: 'hi',    label: 'हिन्दी',              short: 'HI', font: 'Noto+Sans+Devanagari:wght@400;500;600;700;800' },
  { code: 'zh-CN', label: '简体中文',            short: 'ZH' },
  { code: 'ja',    label: '日本語',              short: 'JA' },
  { code: 'ko',    label: '한국어',              short: 'KO' }
];
window.TSM_I18N = window.TSM_I18N || {};

(() => {
  'use strict';
  const config = window.PortfolioConfig;
  const dictionaries = {};
  const listeners = new Set();
  let activeLanguage = config.fallbackLanguage;

  function readPreference(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }

  function writePreference(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* Preferences remain session-only. */ }
  }

  function initialLanguage() {
    const stored = readPreference(config.storage.language);
    if (config.languages.includes(stored)) return stored;
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const language of browserLanguages) {
      const base = language.toLowerCase().split('-')[0];
      if (config.languages.includes(base)) return base;
    }
    return config.fallbackLanguage;
  }

  function lookup(path) {
    const value = path.split('.').reduce((node, part) => node?.[part], dictionaries[activeLanguage]);
    if (value === undefined) throw new Error(`Missing translation: ${activeLanguage}:${path}`);
    return value;
  }

  function translateDOM() {
    document.documentElement.lang = activeLanguage;
    for (const node of document.querySelectorAll('[data-i18n]')) {
      node.textContent = lookup(node.dataset.i18n);
    }
    for (const node of document.querySelectorAll('[data-i18n-attr]')) {
      for (const assignment of node.dataset.i18nAttr.split(';')) {
        const [attribute, key] = assignment.split(':');
        node.setAttribute(attribute, lookup(key));
      }
    }
    for (const button of document.querySelectorAll('[data-lang]')) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === activeLanguage));
    }
    const page = document.body.dataset.page;
    const titleKey = page === 'imprint' ? 'meta.imprintTitle' : page === 'privacy' ? 'meta.privacyTitle' : 'meta.homeTitle';
    document.title = lookup(titleKey);
    document.querySelector('meta[name="description"]')?.setAttribute('content', lookup('meta.homeDescription'));
  }

  async function init() {
    const loaded = await Promise.all(config.languages.map(async language => {
      const response = await fetch(`locales/${language}.json`);
      if (!response.ok) throw new Error(`Failed to load ${language} translations`);
      return [language, await response.json()];
    }));
    for (const [language, content] of loaded) dictionaries[language] = content;
    activeLanguage = initialLanguage();
    translateDOM();
  }

  function setLanguage(language) {
    if (!config.languages.includes(language) || !dictionaries[language]) return;
    activeLanguage = language;
    writePreference(config.storage.language, language);
    translateDOM();
    listeners.forEach(listener => listener());
  }

  window.PortfolioI18n = Object.freeze({
    init, t: lookup, setLanguage, getLanguage: () => activeLanguage,
    onChange: listener => listeners.add(listener),
    readPreference, writePreference
  });
})();

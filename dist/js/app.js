(() => {
  'use strict';
  const config = window.PortfolioConfig;
  const i18n = window.PortfolioI18n;
  const root = document.documentElement;
  let theme = 'light';

  function preferredTheme() {
    const stored = i18n.readPreference(config.storage.theme);
    if (config.themes.includes(stored)) return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(nextTheme, persist = false) {
    theme = nextTheme;
    root.dataset.theme = theme;
    if (persist) i18n.writePreference(config.storage.theme, theme);
    const button = document.getElementById('theme-toggle');
    if (button) button.textContent = i18n.t(theme === 'dark' ? 'controls.light' : 'controls.dark');
  }

  async function start() {
    await i18n.init();
    setTheme(preferredTheme());
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.addEventListener('click', () => i18n.setLanguage(button.dataset.lang));
    });
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      setTheme(theme === 'dark' ? 'light' : 'dark', true);
    });
    i18n.onChange(() => setTheme(theme));
    window.PortfolioContent?.init();
    window.PortfolioInteractions?.init();
    window.PortfolioContact?.init();
  }

  start().catch(error => {
    console.error('Unable to initialise portfolio', error);
  });
})();

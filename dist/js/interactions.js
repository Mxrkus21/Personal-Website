(() => {
  'use strict';
  const i18n = window.PortfolioI18n;
  const config = window.PortfolioConfig;

  function updateLabels() {
    document.querySelectorAll('[data-panel]').forEach(button => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.querySelector('[data-toggle-label]').textContent = i18n.t(expanded ? button.dataset.closeKey : button.dataset.openKey);
    });
  }

  function init() {
    for (const panelId of config.sections) {
      const button = document.querySelector(`[data-panel="${panelId}"]`);
      const panel = document.getElementById(panelId);
      if (!button || !panel) continue;
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        panel.classList.toggle('is-open', !expanded);
        panel.inert = expanded;
        panel.setAttribute('aria-hidden', String(expanded));
        updateLabels();
      });
    }
    updateLabels();
    i18n.onChange(updateLabels);
  }
  window.PortfolioInteractions = Object.freeze({ init });
})();

/* Non-linguistic configuration, shared by all modules. */
window.PortfolioConfig = Object.freeze({
  languages: Object.freeze(['de', 'en']),
  fallbackLanguage: 'de',
  storage: Object.freeze({ language: 'mb-portfolio-language', theme: 'mb-portfolio-theme' }),
  themes: Object.freeze(['light', 'dark']),
  // Replace only after a secure, same-origin endpoint has been implemented.
  contactEndpoint: null,
  sections: Object.freeze(['personal-detail', 'studies-detail', 'project-app-detail', 'project-math-detail'])
});

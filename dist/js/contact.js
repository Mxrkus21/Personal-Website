(() => {
  'use strict';
  const i18n = window.PortfolioI18n;
  const config = window.PortfolioConfig;
  const fields = ['name', 'email', 'message'];
  const errorKeys = {};
  let statusKey = '';
  let statusState = '';
  let sending = false;

  function fieldNode(name) { return document.getElementById(`contact-${name}`); }
  function setError(name, key) {
    errorKeys[name] = key;
    fieldNode(name).setAttribute('aria-invalid', String(Boolean(key)));
    document.getElementById(`${name}-error`).textContent = key ? i18n.t(key) : '';
  }
  function showStatus(key, state = '') {
    statusKey = key; statusState = state;
    const node = document.getElementById('form-status');
    node.textContent = key ? i18n.t(key) : '';
    node.dataset.state = state;
  }
  function validate(name) {
    const value = fieldNode(name).value.trim();
    let key = '';
    if (!value) key = 'contact.required';
    else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) key = 'contact.invalidEmail';
    else if (name === 'message' && value.length < 10) key = 'contact.shortMessage';
    setError(name, key);
    return !key;
  }
  function translateCurrentState() {
    for (const name of fields) {
      document.getElementById(`${name}-error`).textContent = errorKeys[name] ? i18n.t(errorKeys[name]) : '';
    }
    const status = document.getElementById('form-status');
    status.textContent = statusKey ? i18n.t(statusKey) : '';
    status.dataset.state = statusState;
    document.querySelector('.send-button').textContent = i18n.t(sending ? 'contact.sending' : 'contact.submit');
  }
  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      const firstInvalid = fields.find(name => errorKeys[name]);
      fieldNode(firstInvalid)?.focus();
      showStatus('', '');
      return;
    }
    if (!config.contactEndpoint) {
      showStatus('contact.unavailable', 'error');
      return;
    }
    const button = document.querySelector('.send-button');
    sending = true; button.disabled = true;
    translateCurrentState();
    showStatus('', '');
    try {
      const response = await fetch(config.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(Object.fromEntries(fields.map(name => [name, fieldNode(name).value.trim()])))
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error('Delivery unconfirmed');
      showStatus('contact.success', 'success');
      document.getElementById('contact-form').reset();
      for (const name of fields) setError(name, '');
    } catch {
      showStatus('contact.networkError', 'error');
    } finally {
      sending = false; button.disabled = false; translateCurrentState();
    }
  }
  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    for (const name of fields) {
      fieldNode(name).addEventListener('blur', () => { if (fieldNode(name).value || errorKeys[name]) validate(name); });
      fieldNode(name).addEventListener('input', () => { if (errorKeys[name]) validate(name); });
    }
    form.addEventListener('submit', submit);
    i18n.onChange(translateCurrentState);
  }
  window.PortfolioContact = Object.freeze({ init });
})();

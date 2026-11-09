(() => {
  'use strict';

  const i18n = window.PortfolioI18n;
  let timelineCategory = 'academic';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function timelineEntries(category, mobile = false) {
    const column = element('div', mobile ? 'mobile-timeline-column' : 'timeline-column');
    column.append(element('h4', null, category.title));

    const list = element('div', 'timeline-items');
    for (const entry of category.entries) {
      const item = element('article', `timeline-entry${entry.kind === 'ongoing' ? ' is-ongoing' : ''}`);
      item.append(
        element('p', 'timeline-date', entry.date),
        element('h5', null, entry.title)
      );
      if (entry.text) item.append(element('p', null, entry.text));
      if (entry.goals) {
        const goals = element('ul', 'timeline-goals');
        goals.replaceChildren(...entry.goals.map(goal => element('li', null, goal)));
        item.append(goals);
      }
      list.append(item);
    }
    column.append(list);
    return column;
  }

  function selectTimeline(id, focus = false) {
    timelineCategory = id;
    const categories = i18n.t('studies.timeline');
    const category = categories.find(item => item.id === id) || categories[0];
    const mobile = document.getElementById('timeline-mobile');
    if (!mobile) return;

    mobile.replaceChildren(timelineEntries(category, true));
    mobile.setAttribute('aria-labelledby', `timeline-tab-${category.id}`);

    for (const button of document.querySelectorAll('#timeline-tabs [role="tab"]')) {
      const selected = button.dataset.category === category.id;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    }
  }

  function renderTimeline() {
    const categories = i18n.t('studies.timeline');
    const desktop = document.getElementById('timeline-columns');
    const tabs = document.getElementById('timeline-tabs');
    if (!desktop || !tabs) return;

    desktop.replaceChildren(...categories.map(category => timelineEntries(category)));
    tabs.replaceChildren(...categories.map(category => {
      const button = element('button', null, category.title);
      button.type = 'button';
      button.id = `timeline-tab-${category.id}`;
      button.dataset.category = category.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'timeline-mobile');
      button.addEventListener('click', () => selectTimeline(category.id));
      return button;
    }));

    selectTimeline(timelineCategory);
  }

  function initTabKeyboard() {
    const tabs = document.getElementById('timeline-tabs');
    if (!tabs) return;

    tabs.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const buttons = [...tabs.querySelectorAll('[role="tab"]')];
      const current = buttons.indexOf(document.activeElement);
      if (current < 0) return;

      event.preventDefault();
      const last = buttons.length - 1;
      const next = event.key === 'Home' ? 0
        : event.key === 'End' ? last
        : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      selectTimeline(buttons[next].dataset.category, true);
    });
  }

  function init() {
    if (!document.getElementById('timeline-columns')) return;
    renderTimeline();
    initTabKeyboard();
    i18n.onChange(renderTimeline);
  }

  window.PortfolioContent = Object.freeze({ init });
})();

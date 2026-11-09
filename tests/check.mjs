import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const read = path => readFileSync(join(dist, path), 'utf8');
const de = JSON.parse(read('locales/de.json'));
const en = JSON.parse(read('locales/en.json'));
const errors = [];

function compare(a, b, path = '') {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    errors.push(`Different types at ${path}`); return;
  }
  if (a && typeof a === 'object') {
    const ak = Object.keys(a).sort(), bk = Object.keys(b).sort();
    if (ak.join('|') !== bk.join('|')) errors.push(`Different keys at ${path}: ${ak} / ${bk}`);
    for (const key of ak) if (key in b) compare(a[key], b[key], `${path}.${key}`);
  } else if (typeof a === 'string' && (!a.trim() || !b.trim())) {
    errors.push(`Empty text at ${path}`);
  }
}
compare(de, en);

const get = (data, key) => key.split('.').reduce((value, part) => value?.[part], data);
for (const file of ['index.html', 'impressum.html', 'datenschutz.html']) {
  const html = read(file);
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) {
    if (get(de, match[1]) === undefined) errors.push(`${file}: missing ${match[1]}`);
  }
  for (const match of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const mapping of match[1].split(';')) {
      const key = mapping.split(':')[1];
      if (get(de, key) === undefined) errors.push(`${file}: missing attribute ${key}`);
    }
  }
  for (const match of html.matchAll(/data-(?:open|close)-key="([^"]+)"/g)) {
    if (get(de, match[1]) === undefined) errors.push(`${file}: missing toggle text ${match[1]}`);
  }
  for (const match of html.matchAll(/(?:src|href)="((?:css|js|assets)\/[^"#]+)"/g)) {
    if (!existsSync(join(dist, match[1]))) errors.push(`${file}: missing file ${match[1]}`);
  }
  if (/<style\b/i.test(html) || /style="/i.test(html)) errors.push(`${file}: CSS must remain separate`);
}
for (const key of ['app', 'math']) {
  if (de.projects[key].detailPoints.length !== de.projects.detailFields.length) errors.push(`${key}: detail points mismatch`);
}
for (const language of [de, en]) {
  if (language.studies.timeline.length !== 3) errors.push('Expected three timeline categories');
  for (const category of language.studies.timeline) {
    for (const entry of category.entries) if (!['event', 'ongoing'].includes(entry.kind)) errors.push(`Invalid entry kind ${entry.kind}`);
  }
  const initiative = language.studies.timeline.find(category => category.id === 'initiative');
  if (!initiative?.entries.some(entry => entry.goals?.length === 3)) errors.push('Expected three future goals within initiative');
}
const html = read('index.html');
if ((html.match(/class="reveal-panel"/g) || []).length !== 4) errors.push('Expected four independent disclosures');
if ((html.match(/class="project-feature /g) || []).length !== 2) errors.push('Expected exactly two project features');
if (!html.includes('data-panel="studies-detail"') || !html.includes('data-i18n="studies.summary"')) errors.push('Studies need a summary and disclosure');
if (!html.includes('data-project-detail="app"') || !html.includes('data-project-detail="math"')) errors.push('Missing project detail surfaces');
if ((html.match(/class="detail-point"/g) || []).length !== 8) errors.push('Each project needs four directly rendered detail points');
if (html.includes('hero-statement') || html.includes('hero-intro')) errors.push('Hero contains unwanted narrative text');
if (html.includes('looking-ahead')) errors.push('Future goals must be part of the initiative timeline');
if (html.includes('contact-direct')) errors.push('Remove direct contact placeholder');
if ((html.match(/class="project-entry-heading"/g) || []).length !== 2) errors.push('Projects need title-first disclosure headings');
if ((html.match(/class="project-entry-title"/g) || []).length !== 2) errors.push('Projects need a visible title and metadata group');
if ((html.match(/class="project-type"/g) || []).length !== 2 || (html.match(/class="project-tech"/g) || []).length !== 2) errors.push('Project metadata must remain visible');
if (!html.includes('assets/kartenspiel.jpeg')) errors.push('Missing the original card-game image');
if (!html.includes('data-i18n="hero.subtitle"')) errors.push('Missing the requested hero subtitle');
if (html.includes('data-i18n="hero.field"') || html.includes('data-i18n="hero.school"')) errors.push('Old hero institution remains');
if ((html.match(/<input\b/g) || []).length !== 2 || (html.match(/<textarea\b/g) || []).length !== 1) errors.push('Expected exactly three contact fields');
if (de.meta.homeTitle !== 'Markus Baier' || en.meta.homeTitle !== 'Markus Baier') errors.push('Unexpected home title');
for (const file of ['locales/de.json', 'locales/en.json', 'index.html']) {
  if (/[–·]/u.test(read(file))) errors.push(`${file}: excluded punctuation found`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('OK: translation structures, content data, HTML references and page structure');
}

import { UI, lang, names, setLanguage, t } from './modules/language.js';
import { searchText } from './modules/exercise-search.js';
import { loadCatalog, readCachedCatalog } from './modules/exercise-catalog.js';
import { parseRoutineFile, serializeRoutine } from './modules/routine-transfer.js';
import { PAGE_NAMES, pageFromHash, exerciseIdFromHash } from './modules/routing.js';
import {
  makeRoutineDay,
  normalizeRoutineDB,
  sectionItemCount,
  SECTION_TYPES,
} from './modules/routine-storage.js';
import { updateOfflineLanguage } from './modules/offline.js';

const $ = (s) => document.querySelector(s);
const STORAGE_KEY = 'form-routines-v1';
const LANGUAGE_KEY = 'form-language';
const THEME_KEY = 'repzena-theme';
const SECTION_LABEL_KEYS = {
  mobility: 'sectionMobility',
  core: 'sectionCore',
  'main-work': 'sectionMain',
  accessories: 'sectionAccessories',
  finisher: 'sectionFinisher',
  cooldown: 'sectionCooldown',
};
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
let themePreference = ['light', 'dark', 'system'].includes(readStorage(THEME_KEY))
  ? readStorage(THEME_KEY)
  : 'system';
let guideHistoryEntry = false;
let closingFromNavigation = false;
let guideReturnState = null;
let activePage = 'home';
let currentExercisePage = 1;
let exerciseColumnCount = 0;
let exerciseResizeTimer;
let scrollSaveTimer;
let exercises = [];
let db = loadDB();
let selectedDay = 0;
let selectedSectionId = null;
let editingSectionId = null;
let editingRoutineItem = null;
const collapsedSectionIds = new Set();
let toastTimer;
function makeSection(type = 'main-work', name = '', items = []) {
  return {
    id: crypto.randomUUID(),
    type: SECTION_TYPES.includes(type) ? type : 'custom',
    name: String(name || '').slice(0, 60),
    items,
  };
}
function sectionTitle(section) {
  if (section.type === 'custom') return section.name || t('sectionCustom');
  return t(SECTION_LABEL_KEYS[section.type]);
}
function loadDB() {
  try {
    return normalizeRoutineDB(JSON.parse(readStorage(STORAGE_KEY) || 'null'), {
      sectionTypes: SECTION_TYPES,
      makeSection,
      defaultSessionName: UI.en.session,
    });
  } catch {
    return { routines: [], current: null };
  }
}
function saveDB() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Routine storage failed', error);
    toast(t('storageError'));
    return false;
  }
  $('#routine-name').value = currentRoutine() ? routineDisplayName(currentRoutine()) : '';
  renderRoutines();
  return true;
}
function commitDBChange(change) {
  const previousDB = JSON.parse(JSON.stringify(db));
  const previousSelectedDay = selectedDay;
  change();
  if (saveDB()) return true;
  db = previousDB;
  selectedDay = previousSelectedDay;
  renderRoutines();
  return false;
}
function applyTheme() {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  const resolvedTheme =
    themePreference === 'system' ? (prefersDark ? 'dark' : 'light') : themePreference;
  document.documentElement.dataset.theme = resolvedTheme;
  $('#theme').value = themePreference;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolvedTheme === 'dark' ? '#101714' : '#f6f5ef');
}
function routineDisplayName(routine) {
  if (!routine.defaultName) return routine.name;
  const index = db.routines.indexOf(routine);
  return db.routines.length > 1 ? `${t('routineLabel')} ${index + 1}` : t('untitled');
}
function sessionDisplayName(day, index) {
  return day.defaultName ? `${t('session')} ${index + 1}` : day.name;
}
function localized(obj) {
  return obj?.[lang] || obj?.en || '';
}
function label(kind, id) {
  return names[kind]?.[id]?.[lang] || id;
}
function allMuscles(exercise) {
  return [...(exercise.primaryMuscles || []), ...(exercise.secondaryMuscles || [])];
}
function focusLabels(exercise) {
  return exercise.focus.map((id) => label('focus', id)).join(', ');
}
function pageTitle(page) {
  const titleKey = {
    home: 'pageTitleHome',
    exercises: 'pageTitleExercises',
    routines: 'pageTitleRoutines',
  }[page];
  return t(titleKey);
}
function setActivePage(page) {
  activePage = PAGE_NAMES.has(page) ? page : 'home';
  document.querySelectorAll('[data-page]').forEach((view) => {
    view.hidden = view.dataset.page !== activePage;
  });
  document.querySelectorAll('[data-page-link]').forEach((link) => {
    if (link.dataset.pageLink === activePage) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (activePage === 'exercises') renderExercises();
  if (!$('#exercise-dialog').open) document.title = pageTitle(activePage);
  window.dispatchEvent(
    new window.CustomEvent('repzena:pageview', {
      detail: {
        path: `${location.pathname}${location.search}${location.hash}`,
        title: document.title,
      },
    }),
  );
}
function setScrollPosition(position) {
  const root = document.documentElement;
  const currentBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, Math.max(0, position));
  root.style.scrollBehavior = currentBehavior;
}
function saveCurrentScrollPosition() {
  if (exerciseIdFromHash(location.hash)) return;
  history.replaceState(
    { ...history.state, repzenaPage: activePage, scrollY: window.scrollY },
    '',
    location.href,
  );
}
history.scrollRestoration = 'manual';
function navigateToPage(page) {
  if (!PAGE_NAMES.has(page) || (page === activePage && !$('#exercise-dialog').open)) return;
  saveCurrentScrollPosition();
  history.pushState({ repzenaPage: page, scrollY: 0 }, '', `#${page}`);
  guideHistoryEntry = false;
  guideReturnState = null;
  setActivePage(page);
  setScrollPosition(0);
}
function applyLanguage() {
  document.documentElement.lang = lang === 'en' ? 'en-GB' : 'es-AR';
  document.title = lang === 'es' ? 'Repzena — Guía de ejercicios' : 'Repzena — Exercise guide';
  $('#language').value = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = t(el.dataset.i18n);
    if (val.includes('<')) el.innerHTML = val;
    else el.textContent = val;
  });
  document
    .querySelectorAll('[data-i18n-placeholder]')
    .forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => (el.alt = t(el.dataset.i18nAlt)));
  document
    .querySelectorAll('[data-i18n-aria-label]')
    .forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)));
  document
    .querySelectorAll('[data-i18n-title]')
    .forEach((el) => (el.title = t(el.dataset.i18nTitle)));
  renderFilters();
  renderExercises();
  renderRoutines();
  updateOfflineLanguage();
  if ($('#exercise-dialog').open) {
    const id = exerciseIdFromHash(location.hash);
    if (id && exercises.some((exercise) => exercise.id === id)) openDetail(id, false);
  }
}
function optionsFor(select, dict, first) {
  const old = select.value;
  select.innerHTML =
    `<option value="">${t(first)}</option>` +
    Object.entries(dict)
      .map(([id, v]) => `<option value="${id}">${v[lang]}</option>`)
      .join('');
  if ([...select.options].some((o) => o.value === old)) select.value = old;
}
function renderFilters() {
  optionsFor($('#pattern-filter'), names.pattern, 'allPatterns');
  const eq = Object.fromEntries(
    Object.entries(names.equipment).filter(([id]) =>
      exercises.some((e) => e.equipment.includes(id)),
    ),
  );
  optionsFor($('#equipment-filter'), eq, 'allEquipment');
  const mu = Object.fromEntries(
    Object.entries(names.muscles).filter(([id]) =>
      exercises.some((e) => allMuscles(e).includes(id)),
    ),
  );
  optionsFor($('#muscle-filter'), mu, 'allMuscles');
  optionsFor($('#focus-filter'), names.focus, 'allFocuses');
  renderSectionTypeOptions();
  $('#add-exercise').innerHTML =
    `<option value="">${t('chooseExercise')}</option>` +
    exercises
      .map((e) => `<option value="${escapeHtml(e.id)}">${escapeHtml(localized(e.name))}</option>`)
      .join('');
}
function renderSectionTypeOptions() {
  const select = $('#section-type');
  const previous = select.value;
  const types = SECTION_TYPES;
  select.innerHTML = types
    .map(
      (type) =>
        `<option value="${type}">${escapeHtml(t(SECTION_LABEL_KEYS[type] || 'sectionCustom'))}</option>`,
    )
    .join('');
  if (types.includes(previous)) select.value = previous;
  $('#custom-section-name-wrap').hidden = select.value !== 'custom';
}
function imageMarkup(ex) {
  if (Array.isArray(ex.images) && ex.images.length) {
    const first = ex.images[0];
    const imageCount = ex.images.length;
    return `<div class="exercise-art exercise-photo-art" data-card-gallery data-exercise-id="${escapeHtml(ex.id)}" data-image-index="0"><img data-card-image src="${escapeHtml(first.src)}" alt="${escapeHtml(first.alt?.[lang] || localized(ex.name))}" loading="lazy" decoding="async" width="1024" height="1024">${imageCount > 1 ? `<button class="card-image-arrow card-image-arrow-prev" type="button" data-card-image-change="-1" aria-label="${escapeHtml(t('previousImage'))}">‹</button><button class="card-image-arrow card-image-arrow-next" type="button" data-card-image-change="1" aria-label="${escapeHtml(t('nextImage'))}">›</button><span class="card-image-count" data-card-image-count aria-live="polite" aria-atomic="true" aria-label="${escapeHtml(lang === 'es' ? `Imagen 1 de ${imageCount}` : `Image 1 of ${imageCount}`)}">1 / ${imageCount}</span>` : ''}</div>`;
  }
  return `<div class="exercise-art art-${escapeHtml(ex.image)}" aria-hidden="true"><div class="art-index">${String(ex.id.length).padStart(2, '0')}</div><svg viewBox="0 0 280 180"><path class="art-floor" d="M20 151h240"/><circle class="art-head" cx="142" cy="42" r="16"/><path class="art-limb" d="M142 59l-9 45 34 17m-34-17-30 26m30-26-5 30 35 17m-35-17-28 18m37-76 31 12 20-15m-82 4-25-13"/><path class="art-equip" d="M212 76v29m-9-24h18m-18 19h18"/><path class="art-arrow" d="M224 125c8-16 8-29 1-41m-3 7 3-8 6 5"/></svg><span class="art-label">${escapeHtml(label('pattern', ex.pattern))}</span></div>`;
}
function changeCardThumbnail(gallery, direction) {
  const exercise = exercises.find((item) => item.id === gallery?.dataset.exerciseId);
  if (!exercise?.images?.length) return;
  const currentIndex = Number(gallery.dataset.imageIndex) || 0;
  const nextIndex = (currentIndex + direction + exercise.images.length) % exercise.images.length;
  const image = exercise.images[nextIndex];
  gallery.dataset.imageIndex = String(nextIndex);
  const thumbnail = gallery.querySelector('[data-card-image]');
  thumbnail.src = image.src;
  thumbnail.alt = image.alt?.[lang] || localized(exercise.name);
  const count = gallery.querySelector('[data-card-image-count]');
  count.textContent = `${nextIndex + 1} / ${exercise.images.length}`;
  count.setAttribute(
    'aria-label',
    lang === 'es'
      ? `Imagen ${nextIndex + 1} de ${exercise.images.length}`
      : `Image ${nextIndex + 1} of ${exercise.images.length}`,
  );
}
function renderExerciseGallery(ex, container, { enlarged = false } = {}) {
  const images = Array.isArray(ex.images) ? ex.images : [];
  if (!images.length) return;
  let activeIndex = 0;
  const showImage = (index, focusSelector) => {
    activeIndex = (index + images.length) % images.length;
    render();
    if (focusSelector) container.querySelector(focusSelector)?.focus();
  };
  const render = () => {
    const image = images[activeIndex];
    const alt = image.alt?.[lang] || localized(ex.name);
    container.innerHTML = `<div class="exercise-gallery${enlarged ? ' exercise-gallery-large' : ''}" data-gallery-swipe><button class="gallery-image-button" type="button" data-gallery-enlarge aria-label="${escapeHtml(lang === 'es' ? 'Ampliar imagen' : 'Enlarge image')}"><img class="gallery-image" src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" decoding="async"></button>${images.length > 1 ? `<button type="button" class="gallery-arrow gallery-arrow-prev" data-gallery-prev aria-label="${escapeHtml(t('previousImage'))}">‹</button><button type="button" class="gallery-arrow gallery-arrow-next" data-gallery-next aria-label="${escapeHtml(t('nextImage'))}">›</button><div class="gallery-dots" role="group" aria-label="${escapeHtml(lang === 'es' ? 'Imágenes del ejercicio' : 'Exercise images')}">${images.map((_, index) => `<button type="button" class="gallery-dot${index === activeIndex ? ' is-active' : ''}" data-gallery-index="${index}" aria-label="${escapeHtml(lang === 'es' ? `Imagen ${index + 1} de ${images.length}` : `Image ${index + 1} of ${images.length}`)}" aria-pressed="${index === activeIndex}"></button>`).join('')}</div>` : ''}</div>`;
    container.querySelector('[data-gallery-enlarge]').onclick = () =>
      openImageViewer(ex, activeIndex);
    container.querySelectorAll('[data-gallery-index]').forEach((dot) => {
      dot.onclick = () => {
        showImage(
          Number(dot.dataset.galleryIndex),
          `[data-gallery-index="${dot.dataset.galleryIndex}"]`,
        );
      };
    });
    container
      .querySelector('[data-gallery-prev]')
      ?.addEventListener('click', () => showImage(activeIndex - 1, '[data-gallery-prev]'));
    container
      .querySelector('[data-gallery-next]')
      ?.addEventListener('click', () => showImage(activeIndex + 1, '[data-gallery-next]'));
    const swipeArea = container.querySelector('[data-gallery-swipe]');
    let startX = null;
    swipeArea.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
    });
    swipeArea.addEventListener('pointerup', (event) => {
      if (startX === null || images.length < 2) return;
      const delta = event.clientX - startX;
      startX = null;
      if (Math.abs(delta) < 45) return;
      showImage(activeIndex + (delta < 0 ? 1 : -1));
    });
    swipeArea.addEventListener('keydown', (event) => {
      if (images.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const selector = event.target.closest('[data-gallery-prev]')
        ? '[data-gallery-prev]'
        : event.target.closest('[data-gallery-index]')
          ? `[data-gallery-index="${(activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + images.length) % images.length}"]`
          : event.target.closest('[data-gallery-next]')
            ? '[data-gallery-next]'
            : '[data-gallery-enlarge]';
      showImage(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), selector);
    });
    swipeArea.addEventListener('pointercancel', () => {
      startX = null;
    });
  };
  render();
}
function openImageViewer(ex, initialIndex = 0) {
  const viewer = $('#image-viewer');
  const content = $('#image-viewer-content');
  const close = viewer.querySelector('[data-viewer-close]');
  viewer.setAttribute('aria-label', lang === 'es' ? 'Imágenes del ejercicio' : 'Exercise images');
  close.setAttribute('aria-label', t('close'));
  let activeIndex = Math.max(0, Math.min(initialIndex, ex.images.length - 1));
  const showImage = (index, focusSelector) => {
    activeIndex = (index + ex.images.length) % ex.images.length;
    render();
    if (focusSelector) content.querySelector(focusSelector)?.focus();
  };
  const render = () => {
    const image = ex.images[activeIndex];
    const alt = image.alt?.[lang] || localized(ex.name);
    content.innerHTML = `<div class="exercise-gallery exercise-gallery-large" data-gallery-swipe><button class="gallery-image-button" type="button" data-viewer-zoom aria-label="${escapeHtml(lang === 'es' ? 'Cerrar imagen ampliada' : 'Close enlarged image')}"><img class="gallery-image" src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" decoding="async"></button>${ex.images.length > 1 ? `<button type="button" class="gallery-arrow gallery-arrow-prev" data-viewer-prev aria-label="${escapeHtml(t('previousImage'))}">‹</button><button type="button" class="gallery-arrow gallery-arrow-next" data-viewer-next aria-label="${escapeHtml(t('nextImage'))}">›</button><div class="gallery-dots" role="group" aria-label="${escapeHtml(lang === 'es' ? 'Imágenes del ejercicio' : 'Exercise images')}">${ex.images.map((_, index) => `<button type="button" class="gallery-dot${index === activeIndex ? ' is-active' : ''}" data-viewer-index="${index}" aria-label="${escapeHtml(lang === 'es' ? `Imagen ${index + 1} de ${ex.images.length}` : `Image ${index + 1} of ${ex.images.length}`)}" aria-pressed="${index === activeIndex}"></button>`).join('')}</div>` : ''}</div>`;
    content.querySelector('[data-viewer-zoom]').onclick = () => viewer.close();
    content.querySelectorAll('[data-viewer-index]').forEach((dot) => {
      dot.onclick = () => {
        showImage(
          Number(dot.dataset.viewerIndex),
          `[data-viewer-index="${dot.dataset.viewerIndex}"]`,
        );
      };
    });
    content
      .querySelector('[data-viewer-prev]')
      ?.addEventListener('click', () => showImage(activeIndex - 1, '[data-viewer-prev]'));
    content
      .querySelector('[data-viewer-next]')
      ?.addEventListener('click', () => showImage(activeIndex + 1, '[data-viewer-next]'));
    const swipeArea = content.querySelector('[data-gallery-swipe]');
    let startX = null;
    swipeArea.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
    });
    swipeArea.addEventListener('pointerup', (event) => {
      if (startX === null || ex.images.length < 2) return;
      const delta = event.clientX - startX;
      startX = null;
      if (Math.abs(delta) < 45) return;
      showImage(activeIndex + (delta < 0 ? 1 : -1));
    });
    swipeArea.addEventListener('keydown', (event) => {
      if (ex.images.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const selector = event.target.closest('[data-viewer-prev]')
        ? '[data-viewer-prev]'
        : event.target.closest('[data-viewer-index]')
          ? `[data-viewer-index="${(activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + ex.images.length) % ex.images.length}"]`
          : event.target.closest('[data-viewer-next]')
            ? '[data-viewer-next]'
            : '[data-viewer-zoom]';
      showImage(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), selector);
    });
    swipeArea.addEventListener('pointercancel', () => {
      startX = null;
    });
  };
  render();
  if (!viewer.open) viewer.showModal();
}
function renderExercises() {
  const q = searchText($('#search').value.trim());
  const pat = $('#pattern-filter').value,
    eq = $('#equipment-filter').value,
    mu = $('#muscle-filter').value,
    focus = $('#focus-filter').value;
  const filtered = exercises.filter((e) => {
    const hay = searchText(
      [
        localized(e.name),
        e.name.en,
        e.name.es,
        ...Object.values(e.aliases || {}).flat(),
        ...e.equipment.flatMap((x) => [names.equipment[x]?.en, names.equipment[x]?.es]),
        ...allMuscles(e).flatMap((x) => [names.muscles[x]?.en, names.muscles[x]?.es]),
        ...Object.values(names.pattern[e.pattern] || {}),
        ...e.focus.flatMap((id) => Object.values(names.focus[id] || {})),
      ].join(' '),
    );
    return (
      (!q || hay.includes(q)) &&
      (!pat || e.pattern === pat) &&
      (!eq || e.equipment.includes(eq)) &&
      (!mu || allMuscles(e).includes(mu)) &&
      (!focus || e.focus.includes(focus))
    );
  });
  const grid = $('#exercise-grid');
  const columns = Math.max(
    1,
    getComputedStyle(grid).gridTemplateColumns.split(/\s+/).filter(Boolean).length,
  );
  if (exerciseColumnCount && columns !== exerciseColumnCount) currentExercisePage = 1;
  exerciseColumnCount = columns;
  const pageSize = columns * 2;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  currentExercisePage = Math.min(currentExercisePage, pageCount);
  const startIndex = (currentExercisePage - 1) * pageSize;
  const pageExercises = filtered.slice(startIndex, startIndex + pageSize);
  $('#result-count').textContent =
    `${String(filtered.length).padStart(2, '0')} ${lang === 'es' ? 'MOVIMIENTOS' : 'MOVES'}`;
  grid.innerHTML = filtered.length
    ? pageExercises
        .map(
          (e, i) =>
            `<article class="exercise-card" style="--delay:${i * 35}ms"><a class="exercise-card-link" data-detail="${escapeHtml(e.id)}" href="#exercise/${encodeURIComponent(e.id)}" aria-label="${escapeHtml(lang === 'es' ? `Abrir guía: ${localized(e.name)}` : `Open guide: ${localized(e.name)}`)}"></a>${imageMarkup(e)}<div class="card-body"><div class="card-kicker">${escapeHtml(label('pattern', e.pattern))} <span>·</span> ${escapeHtml(focusLabels(e))} <span>·</span> ${e.level === 'beginner' ? t('beginner') : e.level === 'advanced' ? t('advanced') : t('intermediate')}</div><h3>${escapeHtml(localized(e.name))}</h3><div class="tag-row">${e.primaryMuscles?.length ? `<span class="primary-muscle">${escapeHtml(t('primaryMuscle'))}: ${escapeHtml(e.primaryMuscles.map((x) => label('muscles', x)).join(', '))}</span>` : ''}${e.secondaryMuscles?.length ? `<span class="additional-muscles">${escapeHtml(t('secondaryMuscle'))}: ${escapeHtml(e.secondaryMuscles.map((x) => label('muscles', x)).join(', '))}</span>` : ''}</div><div class="card-actions"><span class="detail-link" aria-hidden="true">${lang === 'es' ? 'Ver guía' : 'View guide'} <span aria-hidden="true">↗</span></span><button class="quick-add" data-add="${escapeHtml(e.id)}" aria-label="${escapeHtml(t('addToRoutine'))}: ${escapeHtml(localized(e.name))}" title="${escapeHtml(t('add'))}">＋</button></div></div></article>`,
        )
        .join('')
    : `<div class="no-results">${t('emptySearch')}</div>`;
  renderPagination(filtered.length, pageSize, pageCount, startIndex, pageExercises.length);
  grid.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => addById(b.dataset.add)));
  grid.querySelectorAll('[data-card-image-change]').forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      changeCardThumbnail(
        button.closest('[data-card-gallery]'),
        Number(button.dataset.cardImageChange),
      );
    };
  });
  grid.querySelectorAll('.exercise-card').forEach((card) => {
    let touchStart = null;
    let suppressGuideClick = false;
    card.addEventListener('pointerdown', (event) => {
      suppressGuideClick = false;
      if (event.pointerType !== 'touch' || event.target.closest('[data-card-image-change]')) return;
      const gallery = card.querySelector('[data-card-gallery]');
      const bounds = gallery?.getBoundingClientRect();
      if (!bounds || event.clientX < bounds.left || event.clientX > bounds.right) return;
      if (event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      touchStart = { x: event.clientX, y: event.clientY };
    });
    card.addEventListener('pointerup', (event) => {
      if (!touchStart) return;
      const deltaX = event.clientX - touchStart.x;
      const deltaY = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      changeCardThumbnail(card.querySelector('[data-card-gallery]'), deltaX < 0 ? 1 : -1);
      suppressGuideClick = true;
    });
    card.addEventListener('pointercancel', () => {
      touchStart = null;
    });
    card.addEventListener(
      'click',
      (event) => {
        if (!suppressGuideClick || !event.target.closest('.exercise-card-link')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressGuideClick = false;
      },
      true,
    );
  });
  renderFilterChips();
}
function renderPagination(total, pageSize, pageCount, startIndex, visibleCount) {
  const nav = $('#exercise-pagination');
  const status = $('#pagination-status');
  const controls = $('#pagination-controls');
  nav.hidden = total <= pageSize;
  status.textContent = t('showingExercises')
    .replace('{start}', String(total ? startIndex + 1 : 0))
    .replace('{end}', String(startIndex + visibleCount))
    .replace('{total}', String(total));
  if (nav.hidden) {
    controls.innerHTML = '';
    return;
  }
  const visiblePages =
    pageCount <= 5
      ? Array.from({ length: pageCount }, (_, i) => i + 1)
      : currentExercisePage <= 3
        ? [1, 2, 3, 4, null, pageCount]
        : currentExercisePage >= pageCount - 2
          ? [1, null, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
          : [
              1,
              null,
              currentExercisePage - 1,
              currentExercisePage,
              currentExercisePage + 1,
              null,
              pageCount,
            ];
  controls.innerHTML = [
    `<button class="page-button" type="button" data-page="${currentExercisePage - 1}" aria-label="${escapeHtml(t('previousPage'))}" ${currentExercisePage === 1 ? 'disabled' : ''}>‹</button>`,
    ...visiblePages.map((page) =>
      page === null
        ? '<span class="page-ellipsis" aria-hidden="true">…</span>'
        : `<button class="page-button" type="button" data-page="${page}" aria-label="${escapeHtml(t('pageLabel'))} ${page}" ${page === currentExercisePage ? 'aria-current="page"' : ''}>${page}</button>`,
    ),
    `<button class="page-button" type="button" data-page="${currentExercisePage + 1}" aria-label="${escapeHtml(t('nextPage'))}" ${currentExercisePage === pageCount ? 'disabled' : ''}>›</button>`,
  ].join('');
  controls.querySelectorAll('[data-page]').forEach((button) => {
    button.onclick = () => {
      const page = Number(button.dataset.page);
      if (page < 1 || page > pageCount || page === currentExercisePage) return;
      currentExercisePage = page;
      renderExercises();
      $('#exercise-grid').querySelector('[data-detail]')?.focus();
    };
  });
}
function renderFilterChips() {
  const arr = [
    ['pattern-filter', 'pattern'],
    ['equipment-filter', 'equipment'],
    ['muscle-filter', 'muscles'],
    ['focus-filter', 'focus'],
  ].filter(([id]) => $('#' + id).value);
  $('#active-filters').innerHTML = arr
    .map(
      ([id, kind]) =>
        `<button class="filter-chip" data-clear="${id}" aria-label="${escapeHtml(t('clearFilter'))}: ${escapeHtml(label(kind, $('#' + id).value))}">${escapeHtml(label(kind, $('#' + id).value))} ×</button>`,
    )
    .join('');
  $('#active-filters')
    .querySelectorAll('[data-clear]')
    .forEach(
      (b) =>
        (b.onclick = () => {
          $('#' + b.dataset.clear).value = '';
          currentExercisePage = 1;
          renderExercises();
        }),
    );
}
function openDetail(id, updateUrl = true) {
  const e = exercises.find((x) => x.id === id);
  if (!e) return;
  document.title = `Repzena — ${localized(e.name)} | ${lang === 'es' ? 'Guía de ejercicios' : 'Exercise guide'}`;
  const guideHash = `#exercise/${encodeURIComponent(id)}`;
  if (updateUrl && location.hash !== guideHash) {
    saveCurrentScrollPosition();
    guideReturnState = { page: activePage, scrollY: window.scrollY };
    guideHistoryEntry = true;
    history.pushState(
      {
        repzenaGuide: true,
        repzenaReturnPage: activePage,
        repzenaReturnScrollY: guideReturnState.scrollY,
      },
      '',
      `${location.pathname}${location.search}${guideHash}`,
    );
  } else if (exerciseIdFromHash(location.hash) === id) {
    guideHistoryEntry = history.state?.repzenaGuide === true;
    guideReturnState = {
      page: PAGE_NAMES.has(history.state?.repzenaReturnPage)
        ? history.state.repzenaReturnPage
        : 'exercises',
      scrollY: Number.isFinite(history.state?.repzenaReturnScrollY)
        ? history.state.repzenaReturnScrollY
        : 0,
    };
  }
  window.dispatchEvent(
    new window.CustomEvent('repzena:pageview', {
      detail: {
        path: `${location.pathname}${location.search}${location.hash}`,
        title: document.title,
      },
    }),
  );
  const primaryMuscles = (e.primaryMuscles || [])
    .map((id) => escapeHtml(label('muscles', id)))
    .join(', ');
  $('#dialog-content').innerHTML =
    `${e.images?.length ? '<div data-exercise-gallery></div>' : imageMarkup(e)}<div class="dialog-copy"><div class="card-kicker">${escapeHtml(label('pattern', e.pattern))} · ${escapeHtml(focusLabels(e))}</div><h2 id="exercise-dialog-title">${escapeHtml(localized(e.name))}</h2><button class="guide-link" type="button" data-copy-guide>${escapeHtml(t('copyGuideLink'))}</button><div class="detail-facts"><div><small>${escapeHtml(t('equipment'))}</small><b>${e.equipment.map((x) => escapeHtml(label('equipment', x))).join(', ')}</b></div>${primaryMuscles ? `<div><small>${escapeHtml(t('primaryMuscle'))}</small><b>${primaryMuscles}</b></div>` : ''}<div><small>${escapeHtml(t('secondaryMuscle'))}</small><b>${e.secondaryMuscles.map((x) => escapeHtml(label('muscles', x))).join(', ') || '—'}</b></div></div><h3>${escapeHtml(t('howTo'))}</h3><ol>${e.how[lang].map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ol><h3>${escapeHtml(t('watchFor'))}</h3><ul class="cue-list">${e.cues[lang].map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul><button class="button button-dark detail-add" data-detail-add="${escapeHtml(e.id)}">${escapeHtml(t('addToRoutine'))} <span aria-hidden="true">＋</span></button></div>`;
  if (e.images?.length)
    renderExerciseGallery(e, $('#dialog-content [data-exercise-gallery]'), { enlarged: true });
  $('#dialog-content').querySelector('[data-detail-add]').onclick = () => addById(id);
  $('#dialog-content').querySelector('[data-copy-guide]').onclick = copyGuideLink;
  if (!$('#exercise-dialog').open) $('#exercise-dialog').showModal();
}
function syncRouteWithUrl() {
  const id = exerciseIdFromHash(location.hash);
  if (id && exercises.some((exercise) => exercise.id === id)) {
    activePage = PAGE_NAMES.has(history.state?.repzenaReturnPage)
      ? history.state.repzenaReturnPage
      : 'exercises';
    setActivePage(activePage);
    openDetail(id, false);
    return;
  }
  const page = pageFromHash(location.hash);
  const canonicalHash = `#${page}`;
  if (location.hash !== canonicalHash) {
    history.replaceState(
      { ...history.state, repzenaPage: page, scrollY: history.state?.scrollY || 0 },
      '',
      canonicalHash,
    );
  }
  guideHistoryEntry = false;
  guideReturnState = null;
  setActivePage(page);
  if ($('#exercise-dialog').open) {
    closingFromNavigation = true;
    $('#exercise-dialog').close();
  }
  setScrollPosition(history.state?.scrollY || 0);
}
async function copyGuideLink() {
  const url = location.href;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      const copied = document.execCommand('copy');
      input.remove();
      if (!copied) throw new Error('clipboard-unavailable');
    }
    toast(t('linkCopied'));
  } catch {
    toast(t('linkCopyError'));
  }
}
function currentRoutine() {
  return db.routines.find((r) => r.id === db.current) || db.routines[0] || null;
}
function ensureRoutine() {
  if (!db.routines.length) {
    const r = {
      id: crypto.randomUUID(),
      name: t('untitled'),
      defaultName: true,
      days: [makeRoutineDay(`${t('session')} 1`, true)],
    };
    db.routines = [r];
    db.current = r.id;
  }
  if (!currentRoutine()) db.current = db.routines[0].id;
  const routine = currentRoutine();
  if (!routine.days.length) {
    routine.days.push(makeRoutineDay(`${t('session')} 1`, true));
  }
  if (selectedDay >= routine.days.length) selectedDay = 0;
}
function renderRoutines() {
  ensureRoutine();
  const r = currentRoutine();
  $('#routine-select').innerHTML = db.routines
    .map(
      (x) =>
        `<option value="${escapeHtml(x.id)}" ${x.id === r.id ? 'selected' : ''}>${escapeHtml(routineDisplayName(x))}</option>`,
    )
    .join('');
  $('#routine-name').value = routineDisplayName(r);
  $('#day-tabs').innerHTML = r.days
    .map((d, i) => {
      const name = sessionDisplayName(d, i);
      return `<div class="day-tab-wrap"><button class="day-tab ${i === selectedDay ? 'selected' : ''}" data-day="${i}" aria-pressed="${i === selectedDay}">${escapeHtml(name)} <span>${sectionItemCount(d)}</span></button><button class="day-tab-remove" type="button" data-remove-day="${i}" aria-label="${escapeHtml(t('removeSession'))}: ${escapeHtml(name)}" title="${escapeHtml(t('removeSession'))}" ${r.days.length <= 1 ? 'disabled' : ''}>×</button></div>`;
    })
    .join('');
  $('#remove-routine').disabled = db.routines.length <= 1;
  $('#day-tabs')
    .querySelectorAll('[data-day]')
    .forEach(
      (b) =>
        (b.onclick = () => {
          selectedDay = +b.dataset.day;
          editingRoutineItem = null;
          renderRoutines();
        }),
    );
  $('#day-tabs')
    .querySelectorAll('[data-remove-day]')
    .forEach((button) => {
      button.onclick = () => removeRoutineDay(r, Number(button.dataset.removeDay));
    });
  const day = r.days[selectedDay] || r.days[0];
  if (!day) return;
  const directItems = day.items.length
    ? `<div class="unsectioned-items">${day.items.map((item, itemIndex) => renderRoutineItem(item, itemIndex, '', day.items.length)).join('')}</div>`
    : '';
  $('#routine-sections').innerHTML =
    directItems +
    day.sections
      .map((section, sectionIndex) =>
        renderRoutineSection(section, sectionIndex, day.sections.length),
      )
      .join('');
  $('#routine-sections')
    .querySelectorAll('[data-routine-detail]')
    .forEach((button) => {
      button.onclick = () => openDetail(button.dataset.routineDetail);
    });
  $('#routine-sections')
    .querySelectorAll('[data-routine-match]')
    .forEach((button) => {
      button.onclick = () => {
        const section = day.sections.find((item) => item.id === button.dataset.sectionId);
        const items = section ? section.items : day.items;
        const item = items[Number(button.dataset.routineItem)];
        if (item) openRoutineGuideMatcher(item);
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-edit-item]')
    .forEach((button) => {
      button.onclick = () => {
        editingRoutineItem = {
          sectionId: button.dataset.sectionId,
          index: Number(button.dataset.editItem),
        };
        renderRoutines();
        $('#routine-sections [data-edit-sets]')?.focus();
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-edit-item-form]')
    .forEach((form) => {
      form.onsubmit = (event) => {
        event.preventDefault();
        const button = form.querySelector('[data-save-item]');
        if (button) saveRoutineItem(day, button);
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-cancel-item]')
    .forEach((button) => {
      button.onclick = () => {
        editingRoutineItem = null;
        renderRoutines();
      };
    });
  renderSectionTarget(day);
  const empty = sectionItemCount(day) === 0;
  $('#routine-empty').hidden = !empty;
  $('#add-exercise-button').disabled = false;
  $('#use-starter-layout').hidden = Boolean(day.sections.length || !empty);
  $('#routine-sections')
    .querySelectorAll('[data-toggle-section]')
    .forEach((button) => {
      button.onclick = () => {
        const sectionId = button.dataset.toggleSection;
        if (collapsedSectionIds.has(sectionId)) collapsedSectionIds.delete(sectionId);
        else collapsedSectionIds.add(sectionId);
        renderRoutines();
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-remove-item]')
    .forEach((button) => {
      button.onclick = () => {
        const section = day.sections.find((item) => item.id === button.dataset.sectionId);
        const items = section ? section.items : day.items;
        editingRoutineItem = null;
        commitDBChange(() => items.splice(Number(button.dataset.removeItem), 1));
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-item-up], [data-item-down]')
    .forEach((button) => {
      button.onclick = () => {
        const section = day.sections.find((item) => item.id === button.dataset.sectionId);
        const items = section ? section.items : day.items;
        const index = Number(button.dataset.itemUp ?? button.dataset.itemDown);
        editingRoutineItem = null;
        moveItem(items, index, button.hasAttribute('data-item-up') ? -1 : 1);
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-move-section]')
    .forEach((button) => {
      button.onclick = () =>
        moveSection(day, Number(button.dataset.moveSection), Number(button.dataset.delta));
    });
  $('#routine-sections')
    .querySelectorAll('[data-edit-section]')
    .forEach((button) => {
      button.onclick = () => {
        editingSectionId = button.dataset.editSection;
        renderRoutines();
        $('#routine-sections [data-section-name]')?.focus();
        $('#routine-sections [data-section-name]')?.select();
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-save-section]')
    .forEach((button) => {
      button.onclick = () => renameSection(day, button.dataset.saveSection);
    });
  $('#routine-sections')
    .querySelectorAll('[data-cancel-section]')
    .forEach((button) => {
      button.onclick = () => {
        editingSectionId = null;
        renderRoutines();
      };
    });
  $('#routine-sections')
    .querySelectorAll('[data-delete-section]')
    .forEach((button) => {
      button.onclick = () => removeSection(day, button.dataset.deleteSection);
    });
}
function renderSectionTarget(day) {
  const select = $('#section-target');
  if (
    selectedSectionId === null ||
    (selectedSectionId && !day.sections.some((section) => section.id === selectedSectionId))
  )
    selectedSectionId = day.sections[0]?.id || null;
  select.innerHTML = `<option value="">${escapeHtml(t('noSection'))}</option>${day.sections
    .map(
      (section) =>
        `<option value="${escapeHtml(section.id)}">${escapeHtml(sectionTitle(section))}</option>`,
    )
    .join('')}`;
  select.value = selectedSectionId || '';
  select.closest('label').hidden = !day.sections.length;
}
function exerciseNameKey(value) {
  return searchText(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
function routineExercise(item) {
  const id = item.exerciseId || item.exercise_id || item.id;
  const byId = exercises.find((exercise) => exercise.id === id);
  if (byId) return byId;

  const itemNames = [item.name, item.names?.en, item.names?.es]
    .filter((name) => typeof name === 'string' && name.trim())
    .map(exerciseNameKey);
  if (!itemNames.length) return null;
  return (
    exercises.find((exercise) => {
      const catalogueNames = [
        exercise.name.en,
        exercise.name.es,
        ...(exercise.aliases?.en || []),
        ...(exercise.aliases?.es || []),
      ].map(exerciseNameKey);
      return catalogueNames.some((name) => itemNames.includes(name));
    }) || null
  );
}
function openRoutineGuideMatcher(item) {
  const options = exercises
    .map(
      (exercise) =>
        `<option value="${escapeHtml(exercise.id)}">${escapeHtml(localized(exercise.name))}</option>`,
    )
    .join('');
  $('#dialog-content').innerHTML =
    `<div class="dialog-copy routine-guide-linker"><div class="card-kicker">${escapeHtml(t('matchRoutineExercise'))}</div><h2 id="exercise-dialog-title">${escapeHtml(localized(item.names) || item.name || t('exercise'))}</h2><p>${escapeHtml(t('matchRoutineExerciseHelp'))}</p><label class="routine-guide-match"><span>${escapeHtml(t('exercise'))}</span><select id="routine-guide-match-select"><option value="">${escapeHtml(t('chooseExercise'))}</option>${options}</select></label><button class="button button-dark" type="button" data-open-matched-guide>${escapeHtml(t('openMatchedGuide'))}</button></div>`;
  $('#dialog-content').querySelector('[data-open-matched-guide]').onclick = () => {
    const exercise = exercises.find(
      (candidate) => candidate.id === $('#routine-guide-match-select').value,
    );
    if (!exercise) {
      $('#routine-guide-match-select').focus();
      return;
    }
    if (
      commitDBChange(() => {
        item.exerciseId = exercise.id;
        item.name = exercise.name.en;
        item.names = { en: exercise.name.en, es: exercise.name.es };
      })
    )
      openDetail(exercise.id, false);
  };
  if (!$('#exercise-dialog').open) $('#exercise-dialog').showModal();
}
function migrateRoutineExerciseIds() {
  let changed = false;
  for (const routine of db.routines) {
    for (const day of routine.days) {
      const items = [...day.items, ...day.sections.flatMap((section) => section.items)];
      for (const item of items) {
        const exercise = routineExercise(item);
        if (!exercise) continue;
        if (
          item.exerciseId !== exercise.id ||
          item.name !== exercise.name.en ||
          item.names?.en !== exercise.name.en ||
          item.names?.es !== exercise.name.es
        ) {
          item.exerciseId = exercise.id;
          item.name = exercise.name.en;
          item.names = { en: exercise.name.en, es: exercise.name.es };
          changed = true;
        }
      }
    }
  }
  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
      console.warn('Could not save exercise ID updates for this routine', error);
    }
  }
}
function renderRoutineItem(item, itemIndex, sectionId = '', itemCount = 0) {
  const exercise = routineExercise(item);
  const itemName = escapeHtml(
    exercise ? localized(exercise.name) : localized(item.names) || item.name,
  );
  const guideId = exercise?.id || null;
  const itemTarget = guideId
    ? `data-routine-detail="${escapeHtml(guideId)}"`
    : `data-routine-match data-routine-item="${itemIndex}" data-section-id="${escapeHtml(sectionId)}"`;
  const actionLabel = guideId ? t('openGuide') : t('matchRoutineExercise');
  const open = `<button type="button" class="routine-item-open" ${itemTarget} aria-label="${escapeHtml(actionLabel)}: ${itemName}">`;
  const close = '</button>';
  const isEditing =
    editingRoutineItem?.sectionId === sectionId && editingRoutineItem.index === itemIndex;
  const details = isEditing
    ? `<form class="routine-item-edit" data-edit-item-form><label><span>${escapeHtml(t('editSets'))}</span><input data-edit-sets type="number" min="1" max="99" required value="${escapeHtml(item.sets)}"></label><label><span>${escapeHtml(t('editReps'))}</span><input data-edit-reps type="text" maxlength="80" value="${escapeHtml(item.reps || '')}"></label><div class="routine-item-edit-actions"><button type="submit" class="text-button" data-save-item="${itemIndex}" data-section-id="${escapeHtml(sectionId)}" aria-label="${escapeHtml(t('saveExercise'))}">${escapeHtml(t('save'))}</button><button type="button" class="text-button muted" data-cancel-item aria-label="${escapeHtml(t('cancel'))}">${escapeHtml(t('cancel'))}</button></div></form>`
    : `${open}<span class="item-order">${String(itemIndex + 1).padStart(2, '0')}</span><div class="item-info"><b>${itemName}</b><small>${escapeHtml(item.sets)} ${escapeHtml(t('sets').toLowerCase())} <span>·</span> ${escapeHtml(item.reps || '—')}</small></div>${close}<button type="button" class="item-action" data-edit-item="${itemIndex}" data-section-id="${escapeHtml(sectionId)}" aria-label="${escapeHtml(t('editExercise'))}: ${itemName}" title="${escapeHtml(t('editExercise'))}">✎</button>`;
  return `<div class="routine-item">${details}<button type="button" class="item-action" data-item-up="${itemIndex}" data-section-id="${escapeHtml(sectionId)}" aria-label="${escapeHtml(t('moveUp'))}" ${itemIndex === 0 ? 'disabled' : ''}>↑</button><button type="button" class="item-action" data-item-down="${itemIndex}" data-section-id="${escapeHtml(sectionId)}" aria-label="${escapeHtml(t('moveDown'))}" ${itemIndex === itemCount - 1 ? 'disabled' : ''}>↓</button><button type="button" class="item-action remove" data-remove-item="${itemIndex}" data-section-id="${escapeHtml(sectionId)}" aria-label="${escapeHtml(t('delete'))}">×</button></div>`;
}
function saveRoutineItem(day, button) {
  const row = button.closest('.routine-item');
  const setsInput = row?.querySelector('[data-edit-sets]');
  const repsInput = row?.querySelector('[data-edit-reps]');
  if (!setsInput?.reportValidity()) return;
  const section = day.sections.find((item) => item.id === button.dataset.sectionId);
  const items = section ? section.items : day.items;
  const item = items[Number(button.dataset.saveItem)];
  if (!item) return;
  if (
    commitDBChange(() => {
      item.sets = Number(setsInput.value);
      item.reps = String(repsInput?.value || '').slice(0, 80);
      editingRoutineItem = null;
    })
  )
    toast(t('saved'));
}
function renderRoutineSection(section, index, sectionCount) {
  const isCollapsed = collapsedSectionIds.has(section.id);
  const editing = editingSectionId === section.id;
  const sectionTitleText = sectionTitle(section);
  const title = editing
    ? `<div class="section-rename"><label class="sr-only" for="section-name-${escapeHtml(section.id)}">${escapeHtml(t('sectionName'))}</label><input id="section-name-${escapeHtml(section.id)}" data-section-name maxlength="60" value="${escapeHtml(sectionTitleText)}"><button type="button" class="text-button" data-save-section="${escapeHtml(section.id)}">${escapeHtml(t('save'))}</button><button type="button" class="text-button muted" data-cancel-section>${escapeHtml(t('cancel'))}</button></div>`
    : `<button type="button" class="section-toggle" data-toggle-section="${escapeHtml(section.id)}" aria-expanded="${!isCollapsed}" aria-controls="section-items-${escapeHtml(section.id)}"><span class="section-name">${escapeHtml(sectionTitleText)}</span><span class="section-count">${section.items.length}</span></button>`;
  const content = isCollapsed
    ? ''
    : section.items.length
      ? section.items
          .map((item, itemIndex) =>
            renderRoutineItem(item, itemIndex, section.id, section.items.length),
          )
          .join('')
      : `<p class="section-empty">${escapeHtml(t('noExercisesInSection'))}</p>`;
  return `<section class="routine-group"><header class="routine-group-header">${title}<div class="section-actions"><button type="button" class="section-action" data-move-section="${index}" data-delta="-1" aria-label="${escapeHtml(t('moveSectionUp'))}" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" class="section-action" data-move-section="${index}" data-delta="1" aria-label="${escapeHtml(t('moveSectionDown'))}" ${index === sectionCount - 1 ? 'disabled' : ''}>↓</button><button type="button" class="section-action" data-edit-section="${escapeHtml(section.id)}" aria-label="${escapeHtml(t('renameSection'))}">✎</button><button type="button" class="section-action remove" data-delete-section="${escapeHtml(section.id)}" aria-label="${escapeHtml(t('removeSection'))}">×</button></div></header><div class="section-items" id="section-items-${escapeHtml(section.id)}" ${isCollapsed ? 'hidden' : ''}>${content}</div></section>`;
}
function moveItem(items, i, delta) {
  if (i + delta < 0 || i + delta >= items.length) return;
  commitDBChange(() => {
    [items[i], items[i + delta]] = [items[i + delta], items[i]];
  });
}
function moveSection(day, i, delta) {
  if (i + delta < 0 || i + delta >= day.sections.length) return;
  commitDBChange(() => {
    [day.sections[i], day.sections[i + delta]] = [day.sections[i + delta], day.sections[i]];
  });
}
function renameSection(day, id) {
  const input = $('#routine-sections [data-section-name]');
  const name = String(input?.value || '')
    .trim()
    .slice(0, 60);
  if (!name) {
    toast(t('sectionNameRequired'));
    input?.focus();
    return;
  }
  const section = day.sections.find((item) => item.id === id);
  if (!section) return;
  if (
    commitDBChange(() => {
      section.type = 'custom';
      section.name = name;
      editingSectionId = null;
    })
  )
    selectedSectionId = section.id;
}
function removeSection(day, id) {
  const section = day.sections.find((item) => item.id === id);
  if (!section) return;
  const title = sectionTitle(section);
  if (
    section.items.length &&
    !window.confirm(
      t('confirmRemoveSection')
        .replace('{section}', title)
        .replace('{count}', String(section.items.length)),
    )
  )
    return;
  if (
    commitDBChange(() => {
      day.sections = day.sections.filter((item) => item.id !== id);
      if (selectedSectionId === id) selectedSectionId = day.sections[0]?.id || null;
      collapsedSectionIds.delete(id);
      if (editingSectionId === id) editingSectionId = null;
      editingRoutineItem = null;
    })
  )
    renderRoutines();
}
function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}
function addById(id) {
  if ($('#exercise-dialog').open) $('#exercise-dialog').close();
  openAddDialog(id);
}
function fillAddSessionTargets() {
  const routine = db.routines.find((item) => item.id === $('#add-routine-target').value);
  if (!routine) return;
  const sessionSelect = $('#add-session-target');
  const previousSession = sessionSelect.value;
  sessionSelect.innerHTML = routine.days
    .map(
      (day, index) =>
        `<option value="${index}">${escapeHtml(sessionDisplayName(day, index))}</option>`,
    )
    .join('');
  if ([...sessionSelect.options].some((option) => option.value === previousSession))
    sessionSelect.value = previousSession;
  fillAddSectionTargets();
}
function fillAddSectionTargets() {
  const routine = db.routines.find((item) => item.id === $('#add-routine-target').value);
  const day = routine?.days[Number($('#add-session-target').value)];
  $('#add-section-target').innerHTML = day
    ? `<option value="">${escapeHtml(t('noSection'))}</option>${day.sections
        .map(
          (section) =>
            `<option value="${escapeHtml(section.id)}">${escapeHtml(sectionTitle(section))}</option>`,
        )
        .join('')}`
    : '';
  $('#add-section-target').closest('label').hidden = !day?.sections.length;
  $('#add-section-target').disabled = !day?.sections.length;
  $('#confirm-add-to-routine').disabled = !day;
  $('#create-section-from-chooser').hidden = Boolean(day?.sections.length);
}
function openAddDialog(id) {
  if (!exercises.some((exercise) => exercise.id === id)) return;
  ensureRoutine();
  const routineSelect = $('#add-routine-target');
  routineSelect.innerHTML = db.routines
    .map(
      (routine) =>
        `<option value="${escapeHtml(routine.id)}">${escapeHtml(routineDisplayName(routine))}</option>`,
    )
    .join('');
  routineSelect.value = currentRoutine().id;
  fillAddSessionTargets();
  const sessionSelect = $('#add-session-target');
  sessionSelect.value = String(selectedDay);
  fillAddSectionTargets();
  const day = currentRoutine()?.days[selectedDay];
  if (day?.sections.some((section) => section.id === selectedSectionId))
    $('#add-section-target').value = selectedSectionId;
  $('#confirm-add-to-routine').dataset.exerciseId = id;
  $('#add-dialog').showModal();
  $('#add-routine-target').focus();
}
function addExerciseToRoutine(id, sets = 3, reps = '8–12', target = {}) {
  const e = exercises.find((x) => x.id === id);
  if (!e) return false;
  const routine = db.routines.find((item) => item.id === target.routineId) || currentRoutine();
  const day =
    routine?.days[Number.isInteger(target.dayIndex) ? target.dayIndex : selectedDay] ||
    routine?.days[0];
  if (!day) return false;
  const defaultSectionId = Object.hasOwn(target, 'sectionId')
    ? String(target.sectionId || '')
    : routine.id === currentRoutine()?.id
      ? $('#section-target').value
      : '';
  const section = defaultSectionId
    ? day.sections.find((item) => item.id === defaultSectionId)
    : null;
  const saved = commitDBChange(() => {
    const item = {
      exerciseId: id,
      name: localized(e.name),
      names: e.name,
      sets: Number(sets) || 3,
      reps: String(reps || ''),
    };
    if (section) section.items.push(item);
    else day.items.push(item);
  });
  if (saved)
    toast(
      section
        ? t('addedToSection').replace('{section}', sectionTitle(section))
        : t('exerciseAdded'),
    );
  return saved;
}
function createSectionForChooser() {
  const routine = db.routines.find((item) => item.id === $('#add-routine-target').value);
  const day = routine?.days[Number($('#add-session-target').value)];
  if (!day || day.sections.length) return;
  const section = makeSection('main-work');
  if (commitDBChange(() => day.sections.push(section))) {
    fillAddSessionTargets();
    $('#add-section-target').value = section.id;
  }
}
function addSelected() {
  const id = $('#add-exercise').value;
  if (!id) {
    $('#add-exercise').focus();
    return;
  }
  addExerciseToRoutine(id, $('#add-sets').value, $('#add-reps').value);
}
function openSectionForm(open) {
  $('#section-form').hidden = !open;
  $('#toggle-section-form').setAttribute('aria-expanded', String(open));
  if (open) $('#section-type').focus();
}
function addSection(type, name = '') {
  const day = currentRoutine()?.days[selectedDay];
  if (!day) return;
  const section = makeSection(type, name);
  if (
    commitDBChange(() => {
      day.sections.push(section);
      selectedSectionId = section.id;
      collapsedSectionIds.delete(section.id);
    })
  ) {
    openSectionForm(false);
    $('#custom-section-name').value = '';
    toast(t('sectionAdded'));
  }
}
function useStarterLayout() {
  const day = currentRoutine()?.days[selectedDay];
  if (!day || day.sections.length || sectionItemCount(day)) return;
  if (
    commitDBChange(() => {
      day.sections = [makeSection('mobility'), makeSection('core'), makeSection('main-work')];
      selectedSectionId = day.sections[2].id;
    })
  )
    toast(t('starterLayoutAdded'));
}
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2300);
}
function exportRoutine() {
  const r = currentRoutine();
  const out = serializeRoutine(r, {
    language: lang,
    displayName: routineDisplayName,
    displaySessionName: sessionDisplayName,
    resolveExercise: routineExercise,
  });
  const a = document.createElement('a');
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }),
  );
  a.href = url;
  const filename = routineDisplayName(r)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  a.download = `${filename || 'routine'}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(t('exported'));
}
async function importRoutine(file) {
  try {
    const routine = await parseRoutineFile(file, {
      language: lang,
      translate: t,
      sectionTypes: SECTION_TYPES,
      makeSection,
      makeRoutineDay,
    });
    if (
      commitDBChange(() => {
        db.routines.push(routine);
        db.current = routine.id;
        selectedDay = 0;
      })
    )
      toast(t('imported'));
  } catch (err) {
    console.error(err);
    toast(err.message === 'routine-file-too-large' ? t('importTooLarge') : t('errorImport'));
  }
}

const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
systemThemeQuery?.addEventListener('change', () => {
  if (themePreference === 'system') applyTheme();
});
$('#theme').addEventListener('change', (e) => {
  themePreference = e.target.value;
  applyTheme();
  try {
    localStorage.setItem(THEME_KEY, themePreference);
  } catch (error) {
    console.warn('Theme preference could not be saved', error);
  }
});
applyTheme();
document.querySelectorAll('[data-page-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateToPage(link.dataset.pageLink);
  });
});
document.addEventListener('click', (event) => {
  const detailLink =
    event.target instanceof window.Element ? event.target.closest('[data-detail]') : null;
  if (!detailLink || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openDetail(detailLink.dataset.detail);
});
window.addEventListener(
  'scroll',
  () => {
    window.clearTimeout(scrollSaveTimer);
    scrollSaveTimer = window.setTimeout(saveCurrentScrollPosition, 120);
  },
  { passive: true },
);
$('#language').addEventListener('change', (e) => {
  setLanguage(e.target.value);
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.error('Language preference could not be saved', error);
  }
  applyLanguage();
});
$('#search').addEventListener('input', () => {
  currentExercisePage = 1;
  renderExercises();
});
['pattern-filter', 'equipment-filter', 'muscle-filter', 'focus-filter'].forEach((id) =>
  $('#' + id).addEventListener('change', () => {
    currentExercisePage = 1;
    renderExercises();
  }),
);
window.addEventListener('resize', () => {
  window.clearTimeout(exerciseResizeTimer);
  exerciseResizeTimer = window.setTimeout(() => {
    const columns = Math.max(
      1,
      getComputedStyle($('#exercise-grid')).gridTemplateColumns.split(/\s+/).filter(Boolean).length,
    );
    if (columns === exerciseColumnCount) return;
    currentExercisePage = 1;
    renderExercises();
  }, 100);
});
$('#dialog-close').onclick = () => $('#exercise-dialog').close();
$('#close-add-dialog').onclick = () => $('#add-dialog').close();
$('#image-viewer').querySelector('[data-viewer-close]').onclick = () => $('#image-viewer').close();
$('#exercise-dialog').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
$('#image-viewer').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
$('#exercise-dialog').addEventListener('close', () => {
  if (closingFromNavigation) {
    closingFromNavigation = false;
    return;
  }
  if (guideHistoryEntry) {
    guideHistoryEntry = false;
    history.back();
  } else if (exerciseIdFromHash(location.hash)) {
    const returnPage = guideReturnState?.page || 'exercises';
    const scrollY = guideReturnState?.scrollY || 0;
    history.replaceState(
      { repzenaPage: returnPage, scrollY },
      '',
      `${location.pathname}${location.search}#${returnPage}`,
    );
    guideReturnState = null;
    setActivePage(returnPage);
    setScrollPosition(scrollY);
  } else {
    document.title = pageTitle(activePage);
  }
});
window.addEventListener('popstate', syncRouteWithUrl);
window.addEventListener('hashchange', syncRouteWithUrl);
$('#new-routine').onclick = () => {
  const r = {
    id: crypto.randomUUID(),
    name: t('untitled'),
    defaultName: true,
    days: [makeRoutineDay(`${t('session')} 1`, true)],
  };
  if (
    commitDBChange(() => {
      db.routines.push(r);
      db.current = r.id;
      selectedDay = 0;
      selectedSectionId = null;
      editingSectionId = null;
      editingRoutineItem = null;
    })
  ) {
    $('#routine-name').focus();
    $('#routine-name').select();
  }
};
$('#routine-select').onchange = (e) => {
  const selectedRoutineId = e.target.value;
  commitDBChange(() => {
    db.current = selectedRoutineId;
    selectedDay = 0;
    selectedSectionId = null;
    editingSectionId = null;
    editingRoutineItem = null;
  });
};
$('#remove-routine').onclick = () => removeRoutine(currentRoutine());
$('#routine-name').onchange = (e) => {
  const name = e.target.value;
  commitDBChange(() => setRoutineName(currentRoutine(), name));
};
$('#save-routine').onclick = () => {
  const name = $('#routine-name').value;
  if (commitDBChange(() => setRoutineName(currentRoutine(), name))) toast(t('saved'));
};
function setRoutineName(routine, value) {
  const name = String(value || '').trim();
  if (!name) {
    routine.name = t('untitled');
    routine.defaultName = true;
    return;
  }
  routine.name = name.slice(0, 60);
  routine.defaultName = name === routineDisplayName(routine) || name === t('untitled');
}
function removeRoutine(routine) {
  if (db.routines.length <= 1) return;
  const routineName = routineDisplayName(routine);
  if (!window.confirm(t('confirmRemoveRoutine').replace('{routine}', routineName))) return;
  if (
    commitDBChange(() => {
      db.routines = db.routines.filter((item) => item.id !== routine.id);
      if (db.current === routine.id) db.current = db.routines[0].id;
      selectedDay = 0;
      selectedSectionId = null;
      editingSectionId = null;
      editingRoutineItem = null;
    })
  )
    toast(t('routineRemoved'));
}
function removeRoutineDay(routine, dayIndex) {
  if (routine.days.length <= 1 || !routine.days[dayIndex]) return;
  const sessionName = sessionDisplayName(routine.days[dayIndex], dayIndex);
  if (!window.confirm(t('confirmRemoveSession').replace('{session}', sessionName))) return;
  if (
    commitDBChange(() => {
      routine.days.splice(dayIndex, 1);
      selectedDay = Math.min(dayIndex, routine.days.length - 1);
      selectedSectionId = null;
      editingSectionId = null;
      editingRoutineItem = null;
    })
  )
    toast(t('sessionRemoved'));
}
$('#add-day').onclick = () => {
  commitDBChange(() => {
    const routine = currentRoutine();
    routine.days.push(makeRoutineDay(`${t('session')} ${routine.days.length + 1}`, true));
    selectedDay = routine.days.length - 1;
    selectedSectionId = null;
    editingSectionId = null;
    editingRoutineItem = null;
  });
};
$('#section-target').addEventListener('change', (event) => {
  selectedSectionId = event.target.value;
  renderExercises();
});
$('#toggle-section-form').onclick = () => openSectionForm($('#section-form').hidden);
$('#cancel-section-button').onclick = () => openSectionForm(false);
$('#section-type').addEventListener('change', () => {
  $('#custom-section-name-wrap').hidden = $('#section-type').value !== 'custom';
  if ($('#section-type').value === 'custom') $('#custom-section-name').focus();
});
$('#add-section-button').onclick = () => {
  const type = $('#section-type').value;
  const name = type === 'custom' ? $('#custom-section-name').value.trim() : '';
  if (type === 'custom' && !name) {
    toast(t('sectionNameRequired'));
    $('#custom-section-name').focus();
    return;
  }
  addSection(type, name);
};
$('#use-starter-layout').onclick = useStarterLayout;
$('#add-exercise-button').onclick = addSelected;
$('#add-routine-target').addEventListener('change', fillAddSessionTargets);
$('#add-session-target').addEventListener('change', fillAddSectionTargets);
$('#confirm-add-to-routine').onclick = () => {
  const routineId = $('#add-routine-target').value;
  const dayIndex = Number($('#add-session-target').value);
  const sectionId = $('#add-section-target').value;
  if (
    addExerciseToRoutine($('#confirm-add-to-routine').dataset.exerciseId, 3, '8–12', {
      routineId,
      dayIndex,
      sectionId,
    })
  )
    $('#add-dialog').close();
};
$('#create-section-from-chooser').onclick = createSectionForChooser;
$('#export-routine').onclick = exportRoutine;
$('#routine-file').onchange = (e) => {
  if (e.target.files[0]) importRoutine(e.target.files[0]);
  e.target.value = '';
};
$('#search').addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    e.target.focus();
  }
});
function showCatalog(data) {
  exercises = data;
  migrateRoutineExerciseIds();
  applyLanguage();
  syncRouteWithUrl();
}
loadCatalog()
  .then(showCatalog)
  .catch((error) => {
    console.warn('Could not load the online exercise catalog; trying its offline copy', error);
    const cached = readCachedCatalog();
    if (cached) {
      showCatalog(cached);
      return;
    }
    $('#exercise-grid').innerHTML = `<div class="no-results">${t('loadError')}</div>`;
  });

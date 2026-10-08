const $ = (s) => document.querySelector(s);
const UI = {
  en: {
    brandHome: 'Repzena home',
    navLabel: 'Main navigation',
    sessions: 'Routine sessions',
    heroImageAlt: 'Illustration of a goblet squat',
    newRoutine: 'New routine',
    routineName: 'Routine name',
    addExercise: 'Add exercise',
    close: 'Close',
    navLibrary: 'Exercise library',
    navLibraryShort: 'Exercises',
    navRoutines: 'My routines',
    navRoutinesShort: 'Routines',
    language: 'Language',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    eyebrow: 'THE GYM, MADE CLEAR',
    headline: 'Know the move.<br><em>Own your workout.</em>',
    intro:
      'Clear, visual exercise guides and routines that stay yours. No noise, just what you need between sets.',
    explore: 'Explore exercises',
    heroNote: 'Built for real gym floors',
    artCaption: 'SQUAT · CONTROL · REPEAT',
    libraryEyebrow: 'YOUR MOVEMENT LIBRARY',
    libraryTitle: 'Find your next <em>move.</em>',
    levelNote: 'Experience levels are rough guides, not personal assessments.',
    searchPlaceholder: 'Search exercise, muscle or equipment',
    allPatterns: 'All movements',
    allEquipment: 'All equipment',
    allMuscles: 'All muscles',
    filterMovement: 'Movement',
    filterEquipment: 'Equipment',
    filterMuscle: 'Muscles',
    routineEyebrow: 'YOUR TRAINING, YOUR WAY',
    routineTitle: 'Build a routine<br>that <em>sticks.</em>',
    routineIntro:
      'Create a separate routine for each training day. Name each one, add its exercises and keep them saved on this device.',
    localNote: 'Private by default. Routines are stored in this browser.',
    importRoutine: 'Import routine',
    currentRoutine: 'YOUR ROUTINES',
    save: 'Save',
    addDay: 'Add session',
    export: 'Export',
    emptyRoutine: 'Start with one exercise.',
    emptyRoutineHint: 'Use the + button on an exercise card to add it to this session.',
    addToSession: 'ADD TO THIS SESSION',
    exercise: 'Exercise',
    sets: 'Sets',
    repsTime: 'Reps / time',
    principleOne: 'Learn the movement',
    principleOneText: 'One clear visual. Cues that matter.',
    principleTwo: 'Make it your plan',
    principleTwoText: 'Your sessions, your order, your pace.',
    principleThree: 'Keep it simple',
    principleThreeText: 'No accounts. No clutter. Just training.',
    footer: 'A little more confident, every rep.',
    add: 'Add',
    howTo: 'How to do it',
    watchFor: 'Pay attention to',
    equipment: 'Equipment',
    muscles: 'Muscles involved',
    movement: 'Movement',
    level: 'Suggested level',
    related: 'In the routine',
    day: 'Session',
    delete: 'Remove',
    imported: 'Routine imported',
    saved: 'Saved on this device',
    exported: 'Routine exported',
    emptySearch: 'No matches. Try another search or clear a filter.',
    all: 'All',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    added: 'Added to current session',
    chooseExercise: 'Choose an exercise',
    confirmDelete: 'Delete this routine?',
    untitled: 'My routine',
    routineLabel: 'Routine',
    session: 'Session',
    errorImport: 'Could not read that routine file.',
    sourceRoutine: 'Imported from your personal routine file',
    storageError: 'Could not save on this device. Check available browser storage.',
    moveUp: 'Move exercise up',
    moveDown: 'Move exercise down',
    importTooLarge: 'That routine file is too large to import.',
    loadError:
      'The exercise library could not be loaded and no offline copy is available. Check your connection and reload. If you opened a file directly, use a local web server.',
    clearFilter: 'Clear filter',
    copyGuideLink: 'Copy guide link',
    linkCopied: 'Guide link copied',
    linkCopyError: 'Could not copy the link. Copy it from the address bar.',
    pagination: 'Exercise pages',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pageLabel: 'Page',
    showingExercises: 'Showing {start}–{end} of {total}',
  },
  es: {
    brandHome: 'Inicio de Repzena',
    navLabel: 'Navegación principal',
    sessions: 'Sesiones de la rutina',
    heroImageAlt: 'Ilustración de una sentadilla goblet',
    newRoutine: 'Nueva rutina',
    routineName: 'Nombre de la rutina',
    addExercise: 'Agregar ejercicio',
    close: 'Cerrar',
    navLibrary: 'Ejercicios',
    navLibraryShort: 'Ejercicios',
    navRoutines: 'Mis rutinas',
    navRoutinesShort: 'Rutinas',
    language: 'Idioma',
    theme: 'Apariencia',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    eyebrow: 'EL GIMNASIO, MÁS CLARO',
    headline: 'Entendé el movimiento.<br><em>Entrená con confianza.</em>',
    intro:
      'Guías visuales para aprender ejercicios y armar rutinas a tu manera. Sin distracciones: solo lo que necesitás entre series.',
    explore: 'Ver ejercicios',
    heroNote: 'Pensado para entrenar en el gimnasio',
    artCaption: 'SENTADILLA · CONTROL · REPETICIÓN',
    libraryEyebrow: 'BIBLIOTECA DE MOVIMIENTOS',
    libraryTitle: 'Encontrá tu próximo <em>ejercicio.</em>',
    levelNote: 'El nivel es orientativo y no reemplaza una evaluación personal.',
    searchPlaceholder: 'Buscá por ejercicio, músculo o equipo',
    allPatterns: 'Todos los movimientos',
    allEquipment: 'Todo el equipamiento',
    allMuscles: 'Todos los músculos',
    filterMovement: 'Movimiento',
    filterEquipment: 'Equipamiento',
    filterMuscle: 'Músculos',
    routineEyebrow: 'TU ENTRENAMIENTO, A TU MANERA',
    routineTitle: 'Creá una rutina<br>que <em>te sirva.</em>',
    routineIntro:
      'Creá una rutina distinta para cada día de entrenamiento. Poneles un nombre, agregá sus ejercicios y guardá todo en este dispositivo.',
    localNote: 'Tus rutinas quedan guardadas en este navegador.',
    importRoutine: 'Importá una rutina',
    currentRoutine: 'TUS RUTINAS',
    save: 'Guardá',
    addDay: 'Agregá una sesión',
    export: 'Exportá',
    emptyRoutine: 'Empezá con un ejercicio.',
    emptyRoutineHint: 'Usá el botón + de una tarjeta para agregarlo a esta sesión.',
    addToSession: 'AGREGAR A ESTA SESIÓN',
    exercise: 'Ejercicio',
    sets: 'Series',
    repsTime: 'Reps / tiempo',
    principleOne: 'Aprendé el movimiento',
    principleOneText: 'Una imagen clara. Consejos útiles.',
    principleTwo: 'Armá tu rutina a tu manera',
    principleTwoText: 'Tus sesiones, tu orden, tu ritmo.',
    principleThree: 'Sin complicaciones',
    principleThreeText: 'Sin cuentas ni distracciones.',
    footer: 'Un poco más de confianza, en cada repetición.',
    add: 'Agregar',
    howTo: 'Cómo hacerlo',
    watchFor: 'Qué tener en cuenta',
    equipment: 'Equipo',
    muscles: 'Músculos involucrados',
    movement: 'Movimiento',
    level: 'Nivel orientativo',
    related: 'En la rutina',
    day: 'Sesión',
    delete: 'Eliminar',
    imported: 'Rutina importada',
    saved: 'Guardada en este dispositivo',
    exported: 'Rutina exportada',
    emptySearch: 'No encontramos resultados. Probá otra búsqueda o sacá algún filtro.',
    all: 'Todos',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    added: 'Se agregó a la sesión actual',
    chooseExercise: 'Elegí un ejercicio',
    confirmDelete: '¿Querés eliminar esta rutina?',
    untitled: 'Mi rutina',
    routineLabel: 'Rutina',
    session: 'Sesión',
    errorImport: 'No se pudo leer el archivo de rutina.',
    sourceRoutine: 'Importada desde tu archivo personal',
    storageError:
      'No se pudo guardar en este dispositivo. Revisá el espacio disponible del navegador.',
    moveUp: 'Mover ejercicio hacia arriba',
    moveDown: 'Mover ejercicio hacia abajo',
    importTooLarge: 'El archivo de rutina es demasiado grande para importarlo.',
    loadError:
      'No se pudo cargar la biblioteca y no hay una copia sin conexión disponible. Revisá tu conexión y volvé a cargar la página. Si abriste un archivo directamente, usá un servidor web local.',
    clearFilter: 'Quitar filtro',
    copyGuideLink: 'Copiar enlace de la guía',
    linkCopied: 'Se copió el enlace de la guía',
    linkCopyError: 'No se pudo copiar el enlace. Copialo desde la barra de direcciones.',
    pagination: 'Páginas de ejercicios',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente',
    pageLabel: 'Página',
    showingExercises: 'Mostrando {start}–{end} de {total}',
  },
};
const names = {
  pattern: {
    'horizontal-push': { en: 'Horizontal push', es: 'Empuje horizontal' },
    'horizontal-pull': { en: 'Horizontal pull', es: 'Tracción horizontal' },
    'vertical-push': { en: 'Vertical push', es: 'Empuje vertical' },
    'vertical-pull': { en: 'Vertical pull', es: 'Tracción vertical' },
    squat: { en: 'Squat', es: 'Sentadilla' },
    hinge: { en: 'Hip hinge', es: 'Bisagra de cadera' },
    lunge: { en: 'Lunge', es: 'Estocada' },
    core: { en: 'Core', es: 'Zona media' },
    mobility: { en: 'Mobility', es: 'Movilidad' },
    'elbow-flexion': { en: 'Elbow flexion', es: 'Flexión de codo' },
    'elbow-extension': { en: 'Elbow extension', es: 'Extensión de codo' },
    'knee-flexion': { en: 'Knee flexion', es: 'Flexión de rodilla' },
    'knee-extension': { en: 'Knee extension', es: 'Extensión de rodilla' },
    'ankle-plantar-flexion': { en: 'Ankle plantar flexion', es: 'Flexión plantar del tobillo' },
    'shoulder-abduction': { en: 'Shoulder abduction', es: 'Abducción de hombro' },
    'horizontal-adduction': {
      en: 'Horizontal shoulder adduction',
      es: 'Aducción horizontal de hombro',
    },
  },
  equipment: {
    barbell: { en: 'Barbell', es: 'Barra' },
    'ez-bar': { en: 'EZ bar', es: 'Barra EZ' },
    step: { en: 'Step or platform', es: 'Escalón o plataforma' },
    bench: { en: 'Bench', es: 'Banco' },
    rack: { en: 'Rack', es: 'Soporte' },
    dumbbells: { en: 'Dumbbells', es: 'Mancuernas' },
    cable: { en: 'Cable', es: 'Polea' },
    machine: { en: 'Machine', es: 'Máquina' },
    bodyweight: { en: 'Bodyweight', es: 'Peso corporal' },
    band: { en: 'Resistance band', es: 'Banda elástica' },
    stick: { en: 'Stick', es: 'Bastón' },
    'pull-up-bar': { en: 'Pull-up bar', es: 'Barra fija' },
    'ab-wheel': { en: 'Ab wheel', es: 'Rueda abdominal' },
  },
  muscles: {
    chest: { en: 'Chest', es: 'Pectorales' },
    triceps: { en: 'Triceps', es: 'Tríceps' },
    shoulders: { en: 'Shoulders', es: 'Hombros' },
    back: { en: 'Back', es: 'Espalda' },
    biceps: { en: 'Biceps', es: 'Bíceps' },
    quads: { en: 'Quadriceps', es: 'Cuádriceps' },
    glutes: { en: 'Glutes', es: 'Glúteos' },
    core: { en: 'Core', es: 'Zona media' },
    hamstrings: { en: 'Hamstrings', es: 'Isquiotibiales' },
    calves: { en: 'Calves', es: 'Gemelos' },
    'hip-flexors': { en: 'Hip flexors', es: 'Flexores de cadera' },
    obliques: { en: 'Obliques', es: 'Oblicuos' },
    adductors: { en: 'Adductors', es: 'Aductores' },
  },
};
const STORAGE_KEY = 'form-routines-v1';
const LANGUAGE_KEY = 'form-language';
const THEME_KEY = 'repzena-theme';
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
let lang = readStorage(LANGUAGE_KEY) === 'es' ? 'es' : 'en';
let themePreference = ['light', 'dark', 'system'].includes(readStorage(THEME_KEY))
  ? readStorage(THEME_KEY)
  : 'system';
let guideHistoryEntry = false;
let closingFromNavigation = false;
let currentExercisePage = 1;
let exerciseColumnCount = 0;
let resizeTimer;
let exercises = [];
let db = loadDB();
let selectedDay = 0;
let toastTimer;
function loadDB() {
  try {
    const parsed = JSON.parse(readStorage(STORAGE_KEY) || 'null');
    if (!parsed || !Array.isArray(parsed.routines)) return { routines: [], current: null };
    const routines = parsed.routines
      .filter(
        (r) => r && typeof r.id === 'string' && typeof r.name === 'string' && Array.isArray(r.days),
      )
      .map((r) => ({
        id: r.id,
        name: r.name.slice(0, 120),
        defaultName:
          typeof r.defaultName === 'boolean' ? r.defaultName : isDefaultRoutineName(r.name),
        days: r.days
          .filter((d) => d && typeof d === 'object')
          .map((d, i) => {
            const savedName = String(d.name || `${UI.en.session} ${i + 1}`).slice(0, 120);
            return {
              name: savedName,
              defaultName:
                typeof d.defaultName === 'boolean'
                  ? d.defaultName
                  : isDefaultSessionName(savedName),
              items: Array.isArray(d.items)
                ? d.items
                    .filter((item) => item && typeof item === 'object')
                    .map((item) => ({
                      exerciseId: typeof item.exerciseId === 'string' ? item.exerciseId : null,
                      name: String(item.name || '').slice(0, 200),
                      names:
                        item.names && typeof item.names === 'object'
                          ? {
                              en:
                                typeof item.names.en === 'string'
                                  ? item.names.en.slice(0, 200)
                                  : '',
                              es:
                                typeof item.names.es === 'string'
                                  ? item.names.es.slice(0, 200)
                                  : '',
                            }
                          : null,
                      block: String(item.block || '').slice(0, 120),
                      sets: Math.min(99, Math.max(1, Number(item.sets) || 3)),
                      reps: String(item.reps || '').slice(0, 80),
                    }))
                : [],
            };
          }),
      }));
    return {
      routines,
      current: routines.some((r) => r.id === parsed.current)
        ? parsed.current
        : routines[0]?.id || null,
    };
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
function t(key) {
  return UI[lang][key] || key;
}
function isDefaultRoutineName(name) {
  return ['My routine', 'Mi rutina'].includes(String(name || '').trim());
}
function isDefaultSessionName(name) {
  return /^(?:session|sesión)\s+\d+$/i.test(String(name || '').trim());
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
function importText(value, fallback = '') {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  for (const locale of [lang, 'en', 'es']) {
    if (typeof value[locale] === 'string' && value[locale].trim()) return value[locale];
  }
  return fallback;
}
function label(kind, id) {
  return names[kind]?.[id]?.[lang] || id;
}
function searchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
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
  document
    .querySelectorAll('[data-i18n-aria-label]')
    .forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)));
  document
    .querySelectorAll('[data-i18n-title]')
    .forEach((el) => (el.title = t(el.dataset.i18nTitle)));
  renderFilters();
  renderExercises();
  renderRoutines();
  if ($('#exercise-dialog').open) {
    const id = exerciseIdFromHash();
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
    Object.entries(names.muscles).filter(([id]) => exercises.some((e) => e.muscles.includes(id))),
  );
  optionsFor($('#muscle-filter'), mu, 'allMuscles');
  $('#add-exercise').innerHTML =
    `<option value="">${t('chooseExercise')}</option>` +
    exercises
      .map((e) => `<option value="${escapeHtml(e.id)}">${escapeHtml(localized(e.name))}</option>`)
      .join('');
}
function imageMarkup(ex) {
  return `<div class="exercise-art art-${escapeHtml(ex.image)}" aria-hidden="true"><div class="art-index">${String(ex.id.length).padStart(2, '0')}</div><svg viewBox="0 0 280 180"><path class="art-floor" d="M20 151h240"/><circle class="art-head" cx="142" cy="42" r="16"/><path class="art-limb" d="M142 59l-9 45 34 17m-34-17-30 26m30-26-5 30 35 17m-35-17-28 18m37-76 31 12 20-15m-82 4-25-13"/><path class="art-equip" d="M212 76v29m-9-24h18m-18 19h18"/><path class="art-arrow" d="M224 125c8-16 8-29 1-41m-3 7 3-8 6 5"/></svg><span class="art-label">${escapeHtml(label('pattern', ex.pattern))}</span></div>`;
}
function renderExercises() {
  const q = searchText($('#search').value.trim());
  const pat = $('#pattern-filter').value,
    eq = $('#equipment-filter').value,
    mu = $('#muscle-filter').value;
  const filtered = exercises.filter((e) => {
    const hay = searchText(
      [
        localized(e.name),
        e.name.en,
        e.name.es,
        ...Object.values(e.aliases || {}).flat(),
        ...e.equipment.flatMap((x) => [names.equipment[x]?.en, names.equipment[x]?.es]),
        ...e.muscles.flatMap((x) => [names.muscles[x]?.en, names.muscles[x]?.es]),
        ...Object.values(names.pattern[e.pattern] || {}),
      ].join(' '),
    );
    return (
      (!q || hay.includes(q)) &&
      (!pat || e.pattern === pat) &&
      (!eq || e.equipment.includes(eq)) &&
      (!mu || e.muscles.includes(mu))
    );
  });
  const grid = $('#exercise-grid');
  const columns = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  if (exerciseColumnCount && columns !== exerciseColumnCount) currentExercisePage = 1;
  exerciseColumnCount = columns;
  const pageSize = columns * 3;
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
            `<article class="exercise-card" style="--delay:${i * 35}ms">${imageMarkup(e)}<div class="card-body"><div class="card-kicker">${escapeHtml(label('pattern', e.pattern))} <span>·</span> ${e.level === 'beginner' ? t('beginner') : e.level === 'advanced' ? t('advanced') : t('intermediate')}</div><h3>${escapeHtml(localized(e.name))}</h3><div class="tag-row">${e.muscles
              .slice(0, 2)
              .map((m) => `<span>${escapeHtml(label('muscles', m))}</span>`)
              .join(
                '',
              )}</div><div class="card-actions"><button class="detail-link" data-detail="${escapeHtml(e.id)}">${lang === 'es' ? 'Ver guía' : 'View guide'} <span aria-hidden="true">↗</span></button><button class="quick-add" data-add="${escapeHtml(e.id)}" aria-label="${escapeHtml(t('addExercise'))}: ${escapeHtml(localized(e.name))}" title="${escapeHtml(t('add'))}">＋</button></div></div></article>`,
        )
        .join('')
    : `<div class="no-results">${t('emptySearch')}</div>`;
  renderPagination(filtered.length, pageSize, pageCount, startIndex, pageExercises.length);
  grid
    .querySelectorAll('[data-detail]')
    .forEach((b) => (b.onclick = () => openDetail(b.dataset.detail)));
  grid.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => addById(b.dataset.add)));
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
    guideHistoryEntry = true;
    history.pushState(
      { repzenaGuide: true },
      '',
      `${location.pathname}${location.search}${guideHash}`,
    );
  }
  $('#dialog-content').innerHTML =
    `${imageMarkup(e)}<div class="dialog-copy"><div class="card-kicker">${escapeHtml(label('pattern', e.pattern))}</div><h2 id="exercise-dialog-title">${escapeHtml(localized(e.name))}</h2><button class="guide-link" type="button" data-copy-guide>${escapeHtml(t('copyGuideLink'))}</button><div class="detail-facts"><div><small>${t('equipment')}</small><b>${e.equipment.map((x) => escapeHtml(label('equipment', x))).join(', ')}</b></div><div><small>${t('muscles')}</small><b>${e.muscles.map((x) => escapeHtml(label('muscles', x))).join(', ')}</b></div></div><h3>${t('howTo')}</h3><ol>${e.how[lang].map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ol><h3>${t('watchFor')}</h3><ul class="cue-list">${e.cues[lang].map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul><button class="button button-dark detail-add" data-detail-add="${escapeHtml(e.id)}">${t('add')} <span aria-hidden="true">＋</span></button></div>`;
  $('#dialog-content').querySelector('[data-detail-add]').onclick = () => addById(id);
  $('#dialog-content').querySelector('[data-copy-guide]').onclick = copyGuideLink;
  if (!$('#exercise-dialog').open) $('#exercise-dialog').showModal();
}
function exerciseIdFromHash() {
  const match = location.hash.match(/^#exercise\/(.+)$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
function syncGuideWithUrl() {
  const id = exerciseIdFromHash();
  if (id && exercises.some((exercise) => exercise.id === id)) {
    guideHistoryEntry = false;
    openDetail(id, false);
    return;
  }
  if (id) history.replaceState(history.state, '', `${location.pathname}${location.search}#library`);
  if ($('#exercise-dialog').open) {
    closingFromNavigation = true;
    $('#exercise-dialog').close();
  }
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
      days: [{ name: `${t('session')} 1`, defaultName: true, items: [] }],
    };
    db.routines = [r];
    db.current = r.id;
  }
  if (!currentRoutine()) db.current = db.routines[0].id;
  const routine = currentRoutine();
  if (!routine.days.length) {
    routine.days.push({ name: `${t('session')} 1`, defaultName: true, items: [] });
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
    .map(
      (d, i) =>
        `<button class="day-tab ${i === selectedDay ? 'selected' : ''}" data-day="${i}" aria-pressed="${i === selectedDay}">${escapeHtml(sessionDisplayName(d, i))} <span>${d.items.length}</span></button>`,
    )
    .join('');
  $('#day-tabs')
    .querySelectorAll('[data-day]')
    .forEach(
      (b) =>
        (b.onclick = () => {
          selectedDay = +b.dataset.day;
          renderRoutines();
        }),
    );
  const day = r.days[selectedDay] || r.days[0];
  if (!day) return;
  $('#routine-items').innerHTML = day.items
    .map(
      (item, i) =>
        `<div class="routine-item"><span class="item-order">${String(i + 1).padStart(2, '0')}</span><div class="item-info"><b>${escapeHtml(localized(item.names) || item.name)}</b><small>${item.block ? escapeHtml(item.block) + ' · ' : ''}${escapeHtml(item.sets)} ${t('sets').toLowerCase()} <span>·</span> ${escapeHtml(item.reps || '—')}</small></div><button class="item-action" data-up="${i}" aria-label="${t('moveUp')}" ${i === 0 ? 'disabled' : ''}>↑</button><button class="item-action" data-down="${i}" aria-label="${t('moveDown')}" ${i === day.items.length - 1 ? 'disabled' : ''}>↓</button><button class="item-action remove" data-remove="${i}" aria-label="${t('delete')}">×</button></div>`,
    )
    .join('');
  $('#routine-empty').hidden = day.items.length > 0;
  $('#routine-items')
    .querySelectorAll('[data-remove]')
    .forEach(
      (b) =>
        (b.onclick = () => {
          commitDBChange(() => day.items.splice(+b.dataset.remove, 1));
        }),
    );
  $('#routine-items')
    .querySelectorAll('[data-up]')
    .forEach((b) => (b.onclick = () => moveItem(day, +b.dataset.up, -1)));
  $('#routine-items')
    .querySelectorAll('[data-down]')
    .forEach((b) => (b.onclick = () => moveItem(day, +b.dataset.down, 1)));
}
function moveItem(day, i, delta) {
  commitDBChange(() => {
    [day.items[i], day.items[i + delta]] = [day.items[i + delta], day.items[i]];
  });
}
function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}
function addById(id) {
  if (addExerciseToRoutine(id) && $('#exercise-dialog').open) $('#exercise-dialog').close();
}
function addExerciseToRoutine(id, sets = 3, reps = '8–12') {
  const e = exercises.find((x) => x.id === id);
  if (!e) return false;
  ensureRoutine();
  const routine = currentRoutine();
  const day = routine.days[selectedDay] || routine.days[0];
  if (!day) return false;
  const saved = commitDBChange(() => {
    day.items.push({
      exerciseId: id,
      name: localized(e.name),
      names: e.name,
      sets: Number(sets) || 3,
      reps: String(reps || ''),
    });
  });
  if (saved) toast(t('added'));
  return saved;
}
function addSelected() {
  const id = $('#add-exercise').value;
  if (!id) {
    $('#add-exercise').focus();
    return;
  }
  addExerciseToRoutine(id, $('#add-sets').value, $('#add-reps').value);
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
  const out = {
    format: 'gym-exercise-routine',
    version: 1,
    routine: {
      name: { [lang]: routineDisplayName(r) },
      default_name: r.defaultName,
      days: r.days.map((d, i) => ({
        name: { [lang]: sessionDisplayName(d, i) },
        default_name: d.defaultName,
        exercises: d.items.map((item) => ({
          name: item.names || { [lang]: item.name },
          exercise_id: item.exerciseId || null,
          sets: Number(item.sets) || 3,
          reps_or_time: { [lang]: item.reps || '' },
        })),
      })),
    },
  };
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
    if (!file || file.size > MAX_IMPORT_BYTES) throw new Error('routine-file-too-large');
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== 'object' || Array.isArray(data))
      throw new Error('invalid-routine');
    const src = data.routine || data;
    if (!src || !Array.isArray(src.days) || src.days.length > 50)
      throw new Error('invalid-routine-days');
    const days = src.days.map((d, i) => {
      if (!d || typeof d !== 'object' || (d.exercises !== undefined && !Array.isArray(d.exercises)))
        throw new Error('invalid-routine-day');
      if ((d.exercises || []).length > 500) throw new Error('too-many-exercises');
      const importedDayName = importText(d.name);
      return {
        name: (importedDayName || `${t('session')} ${i + 1}`).slice(0, 120),
        defaultName: typeof d.default_name === 'boolean' ? d.default_name : !importedDayName,
        items: (d.exercises || []).map((ex) => {
          if (!ex || typeof ex !== 'object') throw new Error('invalid-exercise');
          const rawSets = Number(ex.sets);
          const rawName = importText(ex.name, 'Exercise');
          return {
            name: rawName.slice(0, 200),
            names:
              ex.name && typeof ex.name === 'object' && !Array.isArray(ex.name)
                ? {
                    en: String(ex.name.en || '').slice(0, 200),
                    es: String(ex.name.es || '').slice(0, 200),
                  }
                : null,
            block: importText(ex.block).slice(0, 120),
            section: importText(ex.section).slice(0, 120),
            exerciseId:
              typeof ex.exercise_id === 'string'
                ? ex.exercise_id.slice(0, 120)
                : typeof ex.id === 'string'
                  ? ex.id.slice(0, 120)
                  : null,
            sets: Number.isFinite(rawSets) ? Math.min(99, Math.max(1, Math.round(rawSets))) : 3,
            reps: importText(ex.reps_or_time).slice(0, 80),
          };
        }),
      };
    });
    const importedRoutineName = importText(src.name);
    const r = {
      id: crypto.randomUUID(),
      name: (importedRoutineName || t('untitled')).slice(0, 60),
      defaultName: typeof src.default_name === 'boolean' ? src.default_name : !importedRoutineName,
      days: days.length ? days : [{ name: `${t('session')} 1`, defaultName: true, items: [] }],
    };
    if (
      commitDBChange(() => {
        db.routines.push(r);
        db.current = r.id;
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
$('#language').addEventListener('change', (e) => {
  lang = e.target.value;
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
['pattern-filter', 'equipment-filter', 'muscle-filter'].forEach((id) =>
  $('#' + id).addEventListener('change', () => {
    currentExercisePage = 1;
    renderExercises();
  }),
);
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const columns = Math.max(
      1,
      getComputedStyle($('#exercise-grid')).gridTemplateColumns.split(' ').length,
    );
    if (columns !== exerciseColumnCount) {
      exerciseColumnCount = columns;
      currentExercisePage = 1;
      renderExercises();
    }
  }, 120);
});
$('#dialog-close').onclick = () => $('#exercise-dialog').close();
$('#exercise-dialog').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
$('#exercise-dialog').addEventListener('close', () => {
  document.title = lang === 'es' ? 'Repzena — Guía de ejercicios' : 'Repzena — Exercise guide';
  if (closingFromNavigation) {
    closingFromNavigation = false;
    return;
  }
  if (guideHistoryEntry) {
    guideHistoryEntry = false;
    history.back();
  } else if (exerciseIdFromHash()) {
    history.replaceState(history.state, '', `${location.pathname}${location.search}#library`);
  }
});
window.addEventListener('hashchange', syncGuideWithUrl);
$('#new-routine').onclick = () => {
  const r = {
    id: crypto.randomUUID(),
    name: t('untitled'),
    defaultName: true,
    days: [{ name: `${t('session')} 1`, defaultName: true, items: [] }],
  };
  if (
    commitDBChange(() => {
      db.routines.push(r);
      db.current = r.id;
      selectedDay = 0;
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
  });
};
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
$('#add-day').onclick = () => {
  commitDBChange(() => {
    const routine = currentRoutine();
    routine.days.push({
      name: `${t('session')} ${routine.days.length + 1}`,
      defaultName: true,
      items: [],
    });
    selectedDay = routine.days.length - 1;
  });
};
$('#add-exercise-button').onclick = addSelected;
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
const CATALOG_CACHE_KEY = 'repzena.exerciseCatalog.v1';
function validCatalog(data) {
  return Array.isArray(data) && data.length > 0;
}
async function loadCatalog() {
  const response = await fetch('./data/exercises.json');
  if (!response.ok) throw Error(`Could not load exercise data (${response.status})`);
  const data = await response.json();
  if (!validCatalog(data)) throw Error('Exercise data is empty or invalid');
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not save an offline copy of exercise data', error);
  }
  return data;
}
function readCachedCatalog() {
  try {
    const data = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    return validCatalog(data) ? data : null;
  } catch (error) {
    console.warn('Could not read the offline exercise data', error);
    return null;
  }
}
function showCatalog(data) {
  exercises = data;
  applyLanguage();
  syncGuideWithUrl();
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch((error) => {
    console.warn('Offline support could not be installed', error);
  });
}

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
      'Put together your sessions, set your reps and keep everything saved on this device.',
    localNote: 'Private by default. Routines are stored in this browser.',
    importRoutine: 'Import routine',
    currentRoutine: 'CURRENT ROUTINE',
    save: 'Save',
    addDay: 'Add session',
    export: 'Export',
    emptyRoutine: 'Start with one exercise.',
    emptyRoutineHint: 'Use an exercise card to add it to this session.',
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
    added: 'Added to routine',
    chooseExercise: 'Choose an exercise',
    confirmDelete: 'Delete this routine?',
    untitled: 'My routine',
    session: 'Session',
    errorImport: 'Could not read that routine file.',
    sourceRoutine: 'Imported from your personal routine file',
    storageError: 'Could not save on this device. Check available browser storage.',
    moveUp: 'Move exercise up',
    moveDown: 'Move exercise down',
    importTooLarge: 'That routine file is too large to import.',
    loadError: 'Exercise data could not be loaded. Open this project through a local web server.',
    clearFilter: 'Clear filter',
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
      'Armá tus sesiones, definí series y repeticiones, y guardá todo en este dispositivo.',
    localNote: 'Tus rutinas quedan guardadas en este navegador.',
    importRoutine: 'Importá una rutina',
    currentRoutine: 'RUTINA ACTUAL',
    save: 'Guardá',
    addDay: 'Agregá una sesión',
    export: 'Exportá',
    emptyRoutine: 'Empezá con un ejercicio.',
    emptyRoutineHint: 'Agregá un ejercicio desde su tarjeta.',
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
    added: 'Se agregó a la rutina',
    chooseExercise: 'Elegí un ejercicio',
    confirmDelete: '¿Querés eliminar esta rutina?',
    untitled: 'Mi rutina',
    session: 'Sesión',
    errorImport: 'No se pudo leer el archivo de rutina.',
    sourceRoutine: 'Importada desde tu archivo personal',
    storageError:
      'No se pudo guardar en este dispositivo. Revisá el espacio disponible del navegador.',
    moveUp: 'Mover ejercicio hacia arriba',
    moveDown: 'Mover ejercicio hacia abajo',
    importTooLarge: 'El archivo de rutina es demasiado grande para importarlo.',
    loadError: 'No se pudieron cargar los ejercicios. Abrí el proyecto desde un servidor local.',
    clearFilter: 'Quitar filtro',
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
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
let lang = readStorage(LANGUAGE_KEY) === 'es' ? 'es' : 'en';
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
        days: r.days
          .filter((d) => d && typeof d === 'object')
          .map((d, i) => ({
            name: String(d.name || `${UI.en.session} ${i + 1}`).slice(0, 120),
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
                              typeof item.names.en === 'string' ? item.names.en.slice(0, 200) : '',
                            es:
                              typeof item.names.es === 'string' ? item.names.es.slice(0, 200) : '',
                          }
                        : null,
                    block: String(item.block || '').slice(0, 120),
                    sets: Math.min(99, Math.max(1, Number(item.sets) || 3)),
                    reps: String(item.reps || '').slice(0, 80),
                  }))
              : [],
          })),
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
    renderRoutines();
    return false;
  }
  $('#routine-name').value = currentRoutine()?.name || '';
  renderRoutines();
  return true;
}
function t(key) {
  return UI[lang][key] || key;
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
  $('#result-count').textContent =
    `${String(filtered.length).padStart(2, '0')} ${lang === 'es' ? 'MOVIMIENTOS' : 'MOVES'}`;
  $('#exercise-grid').innerHTML = filtered.length
    ? filtered
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
  $('#exercise-grid')
    .querySelectorAll('[data-detail]')
    .forEach((b) => (b.onclick = () => openDetail(b.dataset.detail)));
  $('#exercise-grid')
    .querySelectorAll('[data-add]')
    .forEach((b) => (b.onclick = () => addById(b.dataset.add)));
  renderFilterChips();
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
          renderExercises();
        }),
    );
}
function openDetail(id) {
  const e = exercises.find((x) => x.id === id);
  if (!e) return;
  $('#dialog-content').innerHTML =
    `${imageMarkup(e)}<div class="dialog-copy"><div class="card-kicker">${escapeHtml(label('pattern', e.pattern))}</div><h2 id="exercise-dialog-title">${escapeHtml(localized(e.name))}</h2><div class="detail-facts"><div><small>${t('equipment')}</small><b>${e.equipment.map((x) => escapeHtml(label('equipment', x))).join(', ')}</b></div><div><small>${t('muscles')}</small><b>${e.muscles.map((x) => escapeHtml(label('muscles', x))).join(', ')}</b></div></div><h3>${t('howTo')}</h3><ol>${e.how[lang].map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ol><h3>${t('watchFor')}</h3><ul class="cue-list">${e.cues[lang].map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul><button class="button button-dark detail-add" data-detail-add="${escapeHtml(e.id)}">${t('add')} <span aria-hidden="true">＋</span></button></div>`;
  $('#dialog-content').querySelector('[data-detail-add]').onclick = () => addById(id);
  $('#exercise-dialog').showModal();
}
function currentRoutine() {
  return db.routines.find((r) => r.id === db.current) || db.routines[0] || null;
}
function ensureRoutine() {
  if (!db.routines.length) {
    const r = {
      id: crypto.randomUUID(),
      name: t('untitled'),
      days: [{ name: `${t('session')} 1`, items: [] }],
    };
    db.routines = [r];
    db.current = r.id;
  }
  if (!currentRoutine()) db.current = db.routines[0].id;
}
function renderRoutines() {
  ensureRoutine();
  const r = currentRoutine();
  $('#routine-select').innerHTML = db.routines
    .map(
      (x) =>
        `<option value="${escapeHtml(x.id)}" ${x.id === r.id ? 'selected' : ''}>${escapeHtml(x.name)}</option>`,
    )
    .join('');
  $('#routine-name').value = r.name;
  $('#day-tabs').innerHTML = r.days
    .map(
      (d, i) =>
        `<button class="day-tab ${i === selectedDay ? 'selected' : ''}" data-day="${i}" aria-pressed="${i === selectedDay}">${escapeHtml(d.name)} <span>${d.items.length}</span></button>`,
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
          day.items.splice(+b.dataset.remove, 1);
          saveDB();
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
  [day.items[i], day.items[i + delta]] = [day.items[i + delta], day.items[i]];
  saveDB();
}
function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}
function addById(id) {
  const e = exercises.find((x) => x.id === id);
  if (!e) return;
  $('#add-exercise').value = id;
  $('#add-reps').value = '8–12';
  document.querySelector('#routines').scrollIntoView({ behavior: 'smooth' });
  $('#add-reps').focus();
  if ($('#exercise-dialog').open) $('#exercise-dialog').close();
}
function addSelected() {
  const id = $('#add-exercise').value;
  if (!id) {
    $('#add-exercise').focus();
    return;
  }
  const e = exercises.find((x) => x.id === id);
  const day = currentRoutine().days[selectedDay];
  day.items.push({
    exerciseId: id,
    name: localized(e.name),
    names: e.name,
    sets: $('#add-sets').value || 3,
    reps: $('#add-reps').value || '',
  });
  if (saveDB()) toast(t('added'));
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
      name: { [lang]: r.name },
      days: r.days.map((d) => ({
        name: { [lang]: d.name },
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
  const filename = r.name
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
      return {
        name: (importText(d.name) || `${t('session')} ${i + 1}`).slice(0, 120),
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
    const r = {
      id: crypto.randomUUID(),
      name: importText(src.name, t('untitled')).slice(0, 60),
      days: days.length ? days : [{ name: `${t('session')} 1`, items: [] }],
    };
    db.routines.push(r);
    db.current = r.id;
    selectedDay = 0;
    if (saveDB()) toast(t('imported'));
  } catch (err) {
    console.error(err);
    toast(err.message === 'routine-file-too-large' ? t('importTooLarge') : t('errorImport'));
  }
}
$('#language').addEventListener('change', (e) => {
  lang = e.target.value;
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.error('Language preference could not be saved', error);
  }
  applyLanguage();
});
$('#search').addEventListener('input', renderExercises);
['pattern-filter', 'equipment-filter', 'muscle-filter'].forEach((id) =>
  $('#' + id).addEventListener('change', renderExercises),
);
$('#dialog-close').onclick = () => $('#exercise-dialog').close();
$('#exercise-dialog').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
$('#new-routine').onclick = () => {
  const r = {
    id: crypto.randomUUID(),
    name: t('untitled'),
    days: [{ name: `${t('session')} 1`, items: [] }],
  };
  db.routines.push(r);
  db.current = r.id;
  selectedDay = 0;
  saveDB();
};
$('#routine-select').onchange = (e) => {
  db.current = e.target.value;
  selectedDay = 0;
  saveDB();
};
$('#routine-name').onchange = (e) => {
  currentRoutine().name = e.target.value.trim() || t('untitled');
  saveDB();
};
$('#save-routine').onclick = () => {
  currentRoutine().name = $('#routine-name').value.trim() || t('untitled');
  if (saveDB()) toast(t('saved'));
};
$('#add-day').onclick = () => {
  const r = currentRoutine();
  r.days.push({ name: `${t('session')} ${r.days.length + 1}`, items: [] });
  selectedDay = r.days.length - 1;
  saveDB();
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
fetch('./data/exercises.json')
  .then((r) => {
    if (!r.ok) throw Error('Could not load exercise data');
    return r.json();
  })
  .then((data) => {
    exercises = data;
    applyLanguage();
  })
  .catch((err) => {
    console.error(err);
    $('#exercise-grid').innerHTML = `<div class="no-results">${t('loadError')}</div>`;
  });

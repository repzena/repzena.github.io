export const SECTION_TYPES = [
  'mobility',
  'core',
  'main-work',
  'accessories',
  'finisher',
  'cooldown',
  'custom',
];

export function makeRoutineItem(item) {
  return {
    exerciseId:
      typeof (item.exerciseId || item.exercise_id || item.id) === 'string'
        ? (item.exerciseId || item.exercise_id || item.id).slice(0, 120)
        : null,
    name: String(item.name || '').slice(0, 200),
    names:
      item.names && typeof item.names === 'object' && !Array.isArray(item.names)
        ? {
            en: typeof item.names.en === 'string' ? item.names.en.slice(0, 200) : '',
            es: typeof item.names.es === 'string' ? item.names.es.slice(0, 200) : '',
          }
        : null,
    block: String(item.block || '').slice(0, 120),
    sets: Math.min(99, Math.max(1, Number(item.sets) || 3)),
    reps: String(item.reps || '').slice(0, 80),
  };
}
export function makeRoutineDay(name, defaultName, sections = [], items = []) {
  return {
    name,
    defaultName,
    sections,
    items,
  };
}
export function sectionItemCount(day) {
  return (
    (day.items?.length || 0) +
    day.sections.reduce((total, section) => total + section.items.length, 0)
  );
}
export function isDefaultRoutineName(name) {
  return ['My routine', 'Mi rutina'].includes(String(name || '').trim());
}
export function isDefaultSessionName(name) {
  return /^(?:session|sesión)\s+\d+$/i.test(String(name || '').trim());
}
export function normalizeRoutineDB(
  parsed,
  { sectionTypes = SECTION_TYPES, makeSection, defaultSessionName = 'Session' } = {},
) {
  try {
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
            const savedName = String(d.name || `${defaultSessionName} ${i + 1}`).slice(0, 120);
            const sections = Array.isArray(d.sections)
              ? d.sections
                  .slice(0, 30)
                  .filter((section) => section && typeof section === 'object')
                  .map((section) => {
                    const type = sectionTypes.includes(section.type) ? section.type : 'custom';
                    const items = Array.isArray(section.items)
                      ? section.items
                          .slice(0, 500)
                          .filter((item) => item && typeof item === 'object')
                          .map(makeRoutineItem)
                      : [];
                    return makeSection(type, section.name, items);
                  })
              : [];
            const items = Array.isArray(d.items)
              ? d.items
                  .slice(0, 500)
                  .filter((item) => item && typeof item === 'object')
                  .map(makeRoutineItem)
              : [];
            return makeRoutineDay(
              savedName,
              typeof d.defaultName === 'boolean' ? d.defaultName : isDefaultSessionName(savedName),
              sections,
              items,
            );
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

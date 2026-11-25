const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

function importText(value, language, fallback = '') {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  for (const locale of [language, 'en', 'es']) {
    if (typeof value[locale] === 'string' && value[locale].trim()) return value[locale];
  }
  return fallback;
}

export async function parseRoutineFile(
  file,
  { language, translate, sectionTypes, makeSection, makeRoutineDay },
) {
  if (!file || file.size > MAX_IMPORT_BYTES) throw new Error('routine-file-too-large');
  const data = JSON.parse(await file.text());
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('invalid-routine');
  if (data.format === 'gym-exercise-routine' && ![1, 2, 3].includes(data.version))
    throw new Error('unsupported-routine-version');
  if (data.format && data.format !== 'gym-exercise-routine')
    throw new Error('unsupported-routine-format');
  const source = data.routine || data;
  if (!source || !Array.isArray(source.days) || source.days.length > 50)
    throw new Error('invalid-routine-days');

  let totalImportedExercises = 0;
  const parseExercises = (items) => {
    if (!Array.isArray(items)) throw new Error('invalid-routine-exercises');
    totalImportedExercises += items.length;
    if (totalImportedExercises > 500) throw new Error('too-many-exercises');
    return items.map((exercise) => {
      if (!exercise || typeof exercise !== 'object' || Array.isArray(exercise))
        throw new Error('invalid-exercise');
      const rawSets = Number(exercise.sets);
      const rawName = importText(exercise.name, language, 'Exercise');
      const prescription = exercise.prescription;
      const hasLocalizedText = (value) =>
        typeof value === 'string' ||
        (value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          ['en', 'es'].some((locale) => typeof value[locale] === 'string'));
      if (
        data.version === 3 &&
        (!prescription ||
          typeof prescription !== 'object' ||
          Array.isArray(prescription) ||
          !['reps', 'time'].includes(prescription.mode) ||
          (prescription.mode === 'time' &&
            (!Number.isInteger(prescription.duration_seconds) ||
              prescription.duration_seconds < 1 ||
              prescription.duration_seconds > 3600 ||
              Object.keys(prescription).some(
                (key) => !['mode', 'duration_seconds'].includes(key),
              ))) ||
          (prescription.mode === 'reps' &&
            (!hasLocalizedText(prescription.reps) ||
              Object.keys(prescription).some((key) => !['mode', 'reps'].includes(key)))))
      )
        throw new Error('invalid-prescription');
      return {
        name: rawName.slice(0, 200),
        names:
          exercise.name && typeof exercise.name === 'object' && !Array.isArray(exercise.name)
            ? {
                en: String(exercise.name.en || '').slice(0, 200),
                es: String(exercise.name.es || '').slice(0, 200),
              }
            : null,
        block: importText(exercise.block, language).slice(0, 120),
        exerciseId:
          typeof exercise.exercise_id === 'string'
            ? exercise.exercise_id.slice(0, 120)
            : typeof exercise.id === 'string'
              ? exercise.id.slice(0, 120)
              : null,
        sets: Number.isFinite(rawSets) ? Math.min(99, Math.max(1, Math.round(rawSets))) : 3,
        reps:
          prescription?.mode === 'time'
            ? ''
            : importText(prescription?.reps ?? exercise.reps_or_time, language).slice(0, 80),
        prescriptionMode: ['reps', 'time'].includes(prescription?.mode) ? prescription.mode : null,
        durationSeconds: prescription?.mode === 'time' ? prescription.duration_seconds : null,
      };
    });
  };

  const days = source.days.map((day, index) => {
    if (
      !day ||
      typeof day !== 'object' ||
      Array.isArray(day) ||
      (day.exercises !== undefined && !Array.isArray(day.exercises)) ||
      (day.sections !== undefined && !Array.isArray(day.sections)) ||
      (day.unsectioned_exercises !== undefined && !Array.isArray(day.unsectioned_exercises))
    )
      throw new Error('invalid-routine-day');
    const importedDayName = importText(day.name, language);
    let sections;
    let items;
    if (Array.isArray(day.sections)) {
      if (day.sections.length > 30) throw new Error('too-many-sections');
      sections = day.sections.map((section) => {
        if (!section || typeof section !== 'object' || Array.isArray(section))
          throw new Error('invalid-routine-section');
        const type = sectionTypes.includes(section.type) ? section.type : 'custom';
        const name = type === 'custom' ? importText(section.name, language).slice(0, 60) : '';
        return makeSection(type, name, parseExercises(section.exercises || []));
      });
      items = parseExercises(
        day.unsectioned_exercises || (sections.length ? [] : day.exercises || []),
      );
    } else {
      sections = [];
      items = parseExercises(day.exercises || []);
    }
    return {
      name: (importedDayName || `${translate('session')} ${index + 1}`).slice(0, 120),
      defaultName: typeof day.default_name === 'boolean' ? day.default_name : !importedDayName,
      sections,
      items,
    };
  });

  const importedRoutineName = importText(source.name, language);
  return {
    id: crypto.randomUUID(),
    name: (importedRoutineName || translate('untitled')).slice(0, 60),
    defaultName:
      typeof source.default_name === 'boolean' ? source.default_name : !importedRoutineName,
    days: days.length ? days : [makeRoutineDay(`${translate('session')} 1`, true)],
  };
}

export function serializeRoutine(
  routine,
  { language, displayName, displaySessionName, resolveExercise },
) {
  const serializeItem = (item, section = null) => {
    const exercise = resolveExercise(item);
    const mode = item.prescriptionMode || exercise?.prescriptionMode || 'reps';
    const duration = item.durationSeconds || exercise?.defaultDurationSeconds || 30;
    return {
      name: exercise?.name || item.names || { [language]: item.name },
      exercise_id: exercise?.id || item.exerciseId || null,
      sets: Number(item.sets) || 3,
      reps_or_time: { [language]: mode === 'time' ? `${duration} seconds` : item.reps || '' },
      prescription:
        mode === 'time'
          ? { mode: 'time', duration_seconds: duration }
          : { mode: 'reps', reps: { [language]: item.reps || '' } },
      section: section
        ? { type: section.type, name: section.type === 'custom' ? section.name : '' }
        : null,
    };
  };
  return {
    format: 'gym-exercise-routine',
    version: 3,
    routine: {
      name: { [language]: displayName(routine) },
      default_name: routine.defaultName,
      days: routine.days.map((day, index) => ({
        name: { [language]: displaySessionName(day, index) },
        default_name: day.defaultName,
        sections: day.sections.map((section) => ({
          type: section.type,
          name: section.type === 'custom' ? { [language]: section.name } : null,
          exercises: section.items.map((item) => serializeItem(item, section)),
        })),
        unsectioned_exercises: day.items.map((item) => serializeItem(item)),
        exercises: [
          ...day.items.map((item) => serializeItem(item)),
          ...day.sections.flatMap((section) =>
            section.items.map((item) => serializeItem(item, section)),
          ),
        ],
      })),
    },
  };
}

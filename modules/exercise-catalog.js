const CATALOG_CACHE_KEY = 'repzena.exerciseCatalog.v3';
function validCatalog(data) {
  return (
    data?.format === 'repzena-exercise-catalog' &&
    data.version === 1 &&
    Array.isArray(data.exercises) &&
    data.exercises.length > 0 &&
    data.exercises.every(
      (exercise) =>
        exercise &&
        typeof exercise === 'object' &&
        typeof exercise.id === 'string' &&
        typeof exercise.name?.en === 'string' &&
        typeof exercise.name?.es === 'string' &&
        typeof exercise.pattern === 'string' &&
        Array.isArray(exercise.equipment) &&
        Array.isArray(exercise.primaryMuscles) &&
        Array.isArray(exercise.secondaryMuscles) &&
        Array.isArray(exercise.focus) &&
        Array.isArray(exercise.how?.en) &&
        Array.isArray(exercise.how?.es) &&
        Array.isArray(exercise.cues?.en) &&
        Array.isArray(exercise.cues?.es) &&
        (exercise.images === undefined ||
          (Array.isArray(exercise.images) &&
            exercise.images.length > 0 &&
            exercise.images.every(
              (image) =>
                image &&
                typeof image.src === 'string' &&
                /^\.\/assets\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g)$/i.test(image.src) &&
                !image.src.split('/').includes('..') &&
                typeof image.alt?.en === 'string' &&
                typeof image.alt?.es === 'string',
            ))),
    )
  );
}
export async function loadCatalog() {
  const response = await fetch('./data/exercises.json');
  if (!response.ok) throw Error(`Could not load exercise data (${response.status})`);
  const data = await response.json();
  if (!validCatalog(data)) throw Error('Exercise data is empty or invalid');
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not save an offline copy of exercise data', error);
  }
  return data.exercises;
}
export function readCachedCatalog() {
  try {
    const data = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    return validCatalog(data) ? data.exercises : null;
  } catch (error) {
    console.warn('Could not read the offline exercise data', error);
    return null;
  }
}

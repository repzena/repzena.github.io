export const PAGE_NAMES = new Set(['home', 'exercises', 'routines']);

export function pageFromHash(hash) {
  const page = String(hash || '').replace(/^#/, '');
  if (page === 'top') return 'home';
  if (page === 'library') return 'exercises';
  return PAGE_NAMES.has(page) ? page : 'home';
}

export function exerciseIdFromHash(hash) {
  const match = String(hash || '').match(/^#exercise\/(.+)$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

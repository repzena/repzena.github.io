try {
  const saved = localStorage.getItem('repzena-theme');
  const preference = ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
  const dark =
    preference === 'dark' ||
    (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
} catch {}

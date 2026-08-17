(() => {
  const rawFilter = new URLSearchParams(window.location.search).get('filter');
  if (!rawFilter) return;
  const aliases = {
    landing: 'detailpage',
    site: 'website',
    web: 'website'
  };
  const filter = aliases[rawFilter] || rawFilter;
  const button = document.querySelector(`[data-filter="${CSS.escape(filter)}"]`);
  if (!button) return;
  window.requestAnimationFrame(() => button.click());
})();

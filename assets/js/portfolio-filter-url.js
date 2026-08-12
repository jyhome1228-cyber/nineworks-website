(() => {
  const filter = new URLSearchParams(window.location.search).get('filter');
  if (!filter) return;
  const button = document.querySelector(`[data-filter="${CSS.escape(filter)}"]`);
  if (!button) return;
  window.requestAnimationFrame(() => button.click());
})();

(() => {
  const params = new URLSearchParams(window.location.search);
  const id = (params.get('work') || '').replace(/[^a-z0-9-]/gi, '');
  const projects = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : [];
  const listed = projects.find((project) => project?.id === id);
  const isDevelop = Boolean(listed?.filters?.includes('develop'));

  const loadRenderer = () => {
    if (document.querySelector('script[data-portfolio-renderer]')) return;
    const script = document.createElement('script');
    script.src = 'assets/js/portfolio-dynamic.js?v=20260812-4';
    script.dataset.portfolioRenderer = 'true';
    document.body.appendChild(script);
  };

  if (!id || !isDevelop) {
    loadRenderer();
    return;
  }

  // DEVELOP projects are actively maintained as individual case files.
  // Load the current case first, register it, then start the common renderer.
  const workScript = document.createElement('script');
  workScript.src = `assets/js/works/${encodeURIComponent(id)}.js?v=20260812-4`;
  workScript.dataset.developWork = id;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (window.NW_WORK?.id === id) {
      window.NW_WORKS = window.NW_WORKS || {};
      window.NW_WORKS[id] = window.NW_WORK;
    }
    loadRenderer();
  };

  workScript.addEventListener('load', finish, { once: true });
  workScript.addEventListener('error', finish, { once: true });
  document.body.appendChild(workScript);

  // Never leave the UI on “Loading project…” if a CDN/cache request stalls.
  window.setTimeout(finish, 3500);
})();

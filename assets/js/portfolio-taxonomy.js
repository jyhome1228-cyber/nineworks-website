(() => {
  if (!Array.isArray(window.NW_PORTFOLIO)) return;

  const editorialOnly = new Set(['must-it', 'world-cross']);

  window.NW_PORTFOLIO.forEach((project) => {
    if (!project || !project.id) return;

    if (editorialOnly.has(project.id)) {
      project.filters = ['editorial'];
      if (project.id === 'must-it') {
        project.scope = 'Editorial Campus Graphic System';
        project.subtitle = 'Premium Education Platform Editorial & Campus Graphic Design';
      }
      if (project.id === 'world-cross') {
        project.scope = 'CI Renewal Editorial System';
      }
      return;
    }

    const original = Array.isArray(project.filters) ? project.filters : [];
    const movedFromDigitalOrContent = original.includes('digital') || original.includes('content');
    const next = original.filter((filter) => filter !== 'digital' && filter !== 'content' && filter !== 'space');

    if (movedFromDigitalOrContent && !next.includes('branding')) next.unshift('branding');
    if (!next.length) next.push('branding');

    project.filters = [...new Set(next)];
  });
})();

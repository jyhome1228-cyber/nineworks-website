(() => {
  if (!Array.isArray(window.NW_PORTFOLIO)) return;

  const eventOnly = new Set([
    'kookmin-university',
    'myungwon-museum',
    'ouga-x-monggo',
    'megagen',
    'hi-scale-up'
  ]);

  const detailPage = new Set([
    'centellian-24'
  ]);

  const develop = new Set([
    'fineb',
    'tne-epc',
    'relim',
    'aesost',
    'kekomi'
  ]);

  window.NW_PORTFOLIO.forEach((project) => {
    if (!project || !project.id) return;

    if (eventOnly.has(project.id)) {
      project.filters = ['event'];
      return;
    }

    if (develop.has(project.id)) {
      project.filters = ['develop', 'branding'];
      return;
    }

    project.filters = detailPage.has(project.id)
      ? ['branding', 'detailpage']
      : ['branding'];
  });
})();
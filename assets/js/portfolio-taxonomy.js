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
    'kekomi',
    'the-petrichor'
  ]);

  const petrichor = window.NW_PORTFOLIO.find((project) => project?.id === 'the-petrichor');
  if (petrichor) Object.assign(petrichor, {
    title: 'THE PETRICHOR',
    client: 'THE PETRICHOR / 더 페트리셔',
    subtitle: 'Skincare Brand Commerce Website, Membership & Content Experience',
    scope: 'Imweb · Custom Code · Photography · Product Detail · Review · Event · Membership · Commerce',
    thumbnail: 'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/c403d1292f536.png'
  });

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
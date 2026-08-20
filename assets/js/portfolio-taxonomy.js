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

  const website = new Set([
    'fineb',
    'tne-epc',
    'relim',
    'aesost',
    'kekomi',
    'the-petrichor',
    'thomastone',
    'recelleclore'
  ]);

  const systemBuild = new Set([
    'fineb',
    'relim',
    'aesost'
  ]);

  const petrichor = window.NW_PORTFOLIO.find((project) => project?.id === 'the-petrichor');
  if (petrichor) Object.assign(petrichor, {
    title: 'THE PETRICHOR',
    client: 'THE PETRICHOR / 더 페트리셔',
    subtitle: 'Skincare Brand Website, Membership & Content Experience',
    scope: 'Imweb · Custom Code · Photography · Product Detail · Review · Event · Membership',
    thumbnail: 'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/c403d1292f536.png'
  });

  window.NW_PORTFOLIO.forEach((project) => {
    if (!project || !project.id) return;

    const incoming = Array.isArray(project.filters) ? project.filters : [];
    const filters = new Set(incoming);

    /* Commerce is not used as a portfolio category. */
    filters.delete('commerce');

    if (eventOnly.has(project.id)) {
      project.filters = ['event'];
      return;
    }

    if (incoming.includes('develop') || website.has(project.id)) {
      filters.add('develop');
      filters.add('website');
    }

    if (systemBuild.has(project.id)) filters.add('system');

    if (detailPage.has(project.id)) {
      filters.add('detailpage');
      filters.add('landing');
    }

    /* Branding remains available in the full archive, while the dedicated
       Branding Projects page uses it as its primary filter. */
    if (!filters.size) filters.add('branding');

    project.filters = [...filters];
  });
})();

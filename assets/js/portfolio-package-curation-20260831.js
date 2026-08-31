(() => {
  if (!Array.isArray(window.NW_PORTFOLIO)) window.NW_PORTFOLIO = [];

  const hiddenBeforeDoctorTips = new Set([
    'ouga',
    'hollys',
    'cocos-matcha',
    '1616-brunch-coffee',
    'seolgadang',
    'puur',
    'beauness-dailyb',
    'mayer',
    'eat',
    '1plan',
    'blondy',
    'breeze-coffee',
    'cafood',
    'dev-coffee'
  ]);

  window.NW_PORTFOLIO.forEach((project) => {
    if (!project || !hiddenBeforeDoctorTips.has(project.id)) return;
    project.filters = (Array.isArray(project.filters) ? project.filters : [])
      .filter((filter) => filter !== 'package');
  });

  const steapin = {
    id: 'steapin',
    title: '스테아핀',
    client: '스테아핀',
    subtitle: 'Health Supplement Package & Product Visual Design',
    scope: 'Package Design · Product Visual',
    filters: ['branding', 'package', 'content'],
    thumbnail: 'https://cdn.imweb.me/upload/S2025061194bb8d274d3cd/d4505e36cb0ba.jpg'
  };

  if (!window.NW_PORTFOLIO.some((project) => project?.id === steapin.id)) {
    const healthdIndex = window.NW_PORTFOLIO.findIndex((project) => project?.id === 'healthd');
    const insertAt = healthdIndex >= 0 ? healthdIndex + 1 : window.NW_PORTFOLIO.length;
    window.NW_PORTFOLIO.splice(insertAt, 0, steapin);
  }
})();

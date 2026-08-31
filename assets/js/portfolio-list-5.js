window.NW_PORTFOLIO=(window.NW_PORTFOLIO||[]).concat([
  {
    "id":"thomastone",
    "title":"THOMASTONE",
    "client":"THOMASTONE / 토마스톤",
    "subtitle":"AI Oral Healthcare Corporate Website & Dynamic News Experience",
    "scope":"Imweb · Custom Code · Responsive UI · News Collection · Dynamic Loading",
    "filters":["develop","branding"],
    "thumbnail":"https://cdn.imweb.me/upload/S20260219b829e728b3f2e/df99c31030165.png",
    "detailUrl":"portfolio-thomastone.html",
    "liveUrl":"https://thomastone.co.kr/"
  },
  {
    "id":"recelleclore",
    "title":"RECELLÉCLORE",
    "client":"RECELLÉCLORE / 리셀에클로",
    "subtitle":"Dermocosmetic Brand Commerce, Recell LAB & Review Content System",
    "scope":"Branding · Package · Imweb · Custom Code · Photography · Recell LAB · Review · Blog Collection · Commerce",
    "filters":["develop","branding"],
    "thumbnail":"https://cdn.imweb.me/upload/S20260219b829e728b3f2e/7df64ceed4164.png",
    "detailUrl":"portfolio-recelleclore.html",
    "liveUrl":"https://recelleclore.co.kr/"
  },
  {
    "id":"nineworks-crm",
    "title":"NINEWORKS CRM",
    "client":"NINEWORKS / Internal Project",
    "subtitle":"Internal Work Management & Client Operations System",
    "scope":"Service Planning · UX/UI · CRM · Calendar · Client · Request · Sales · Firebase",
    "filters":["system"],
    "thumbnail":"assets/nineworks-crm-cover.svg",
    "detailUrl":"portfolio-detail.html?work=nineworks-crm"
  }
]);

(() => {
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

  const relimBranding = {
    id: 'relim-branding',
    title: 'RE:LIM',
    client: 'RE:LIM / 리림',
    subtitle: 'Outdoor Leisure & Hospitality Brand Identity',
    scope: 'Brand Identity · Visual System · Experience Design',
    filters: ['branding', 'major'],
    thumbnail: 'https://cdn.imweb.me/upload/S2025061194bb8d274d3cd/1c2d0d8d3c1e6.png',
    detailUrl: 'portfolio-relim-branding.html'
  };

  if (document.body.classList.contains('majorportfolio-page') &&
      !window.NW_PORTFOLIO.some((project) => project?.id === relimBranding.id)) {
    window.NW_PORTFOLIO.unshift(relimBranding);
  }

  if (document.body.classList.contains('branding-project-page')) {
    const grid = document.querySelector('.project-gallery__grid');
    if (grid && !Array.from(grid.querySelectorAll('h2')).some((title) => title.textContent.trim() === 'RE:LIM')) {
      const card = document.createElement('article');
      card.className = 'project-card project-card--relim';
      card.innerHTML = '<a href="portfolio-relim-branding.html" aria-label="RE:LIM brand identity case study" style="display:block;color:inherit;text-decoration:none"><figure class="project-card__media"><img src="https://cdn.imweb.me/upload/S2025061194bb8d274d3cd/e59fe4fd3e517.jpg" alt="RE:LIM brand identity project" loading="eager"></figure><div class="project-card__meta"><span>HOSPITALITY · BRAND IDENTITY · EXPERIENCE</span></div><h2>RE:LIM</h2><p>자연 속 체류 경험을 로고, 비주얼 시스템과 공간·운영 접점으로 확장한 레저·호스피탈리티 브랜딩 프로젝트.</p></a>';
      grid.prepend(card);
    }
  }
})();

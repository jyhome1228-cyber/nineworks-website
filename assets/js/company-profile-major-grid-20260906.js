(() => {
  const portfolio = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : [];
  const vaquerIndex = portfolio.findIndex((item) => String(item?.title || '').trim().toUpperCase() === 'VAQUER');
  const major = vaquerIndex >= 0 ? portfolio.slice(0, vaquerIndex + 1) : portfolio.filter((item) => (item?.filters || []).includes('major'));
  const workMap = window.NW_WORKS || {};

  const collectImages = (item) => {
    const work = workMap[item.id] || null;
    const images = [];
    const push = (src) => {
      if (!src || typeof src !== 'string') return;
      if (!images.includes(src)) images.push(src);
    };

    push(item.thumbnail);
    push(item.image);
    push(work?.thumbnail);

    if (Array.isArray(work?.sections)) {
      work.sections.forEach((section) => {
        if (!Array.isArray(section?.images)) return;
        section.images.forEach(push);
      });
    }

    while (images.length < 4) push(item.thumbnail || work?.thumbnail || '');
    return images.slice(0, 4);
  };

  const pages = [...document.querySelectorAll('.major-page')];
  pages.forEach((page, index) => {
    const item = major[index];
    if (!item) return;

    const images = collectImages(item);
    const hero = page.querySelector('.major-media img');
    const copy = page.querySelector('.major-copy');
    if (!hero || !copy) return;

    if (images[0]) hero.src = images[0];

    const old = copy.querySelector('.major-subgrid');
    if (old) old.remove();

    const subgrid = document.createElement('div');
    subgrid.className = 'major-subgrid';
    images.slice(1, 4).forEach((src, subIndex) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = `${item.title || 'NINEWORKS project'} supporting visual ${subIndex + 1}`;
      img.src = src || images[0] || item.thumbnail || '';
      figure.appendChild(img);
      subgrid.appendChild(figure);
    });
    copy.appendChild(subgrid);

    const uniqueCount = new Set(images.filter(Boolean)).size;
    copy.classList.toggle('is-fallback', uniqueCount < 4);

    const work = workMap[item.id];
    const subtitle = copy.querySelector('.subtitle');
    if (subtitle && work?.lead) subtitle.textContent = work.lead;
    const scope = copy.querySelector('.scope');
    if (scope && work?.scope) scope.textContent = work.scope;
  });
})();
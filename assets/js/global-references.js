(() => {
  const grid = document.querySelector('[data-reference-grid]');
  const filters = document.querySelectorAll('[data-reference-filter]');
  if (!grid) return;

  const RAW_BASE = 'https://raw.githubusercontent.com/jyhome1228-cyber/wavelab/main/';
  const INDEX_FILE = 'reference.html';
  const fieldMap = {
    'reference-kimori-matcha-cat-cafe.html': 'branding',
    'reference-bloc-choc.html': 'package',
    'reference-cofario-club.html': 'package',
    'reference-aartin-lighting.html': 'identity',
    'reference-hummey-honey.html': 'package',
    'reference-mili-cottage-cheese.html': 'package',
    'reference-that-joe-pizza.html': 'branding'
  };

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const absoluteAsset = (value = '') => {
    if (!value) return '';
    if (/^(?:https?:)?\/\//i.test(value) || value.startsWith('data:')) return value;
    return `${RAW_BASE}${value.replace(/^\.\//, '')}`;
  };

  const render = (items) => {
    grid.innerHTML = items.map((item, index) => `
      <article class="reference-card" data-reference-field="${escapeHTML(item.field)}">
        <a class="reference-card__link" href="reference-detail.html?source=${encodeURIComponent(item.href)}" aria-label="${escapeHTML(item.title)} 레퍼런스 보기">
          <figure class="reference-card__media">
            <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt || item.title)}" loading="${index < 4 ? 'eager' : 'lazy'}">
            <span class="reference-card__badge">AESOST ARCHIVE</span>
          </figure>
          <div class="reference-card__meta">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <span>${escapeHTML(item.source || 'GLOBAL REFERENCE')}</span>
          </div>
          <h3>${escapeHTML(item.title)}</h3>
          <p class="reference-card__summary">${escapeHTML(item.summary)}</p>
          <span class="reference-card__status">View Reference ↗</span>
        </a>
      </article>`).join('');
  };

  const applyFilter = (filter) => {
    filters.forEach((button) => button.classList.toggle('is-active', button.dataset.referenceFilter === filter));
    grid.querySelectorAll('.reference-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.referenceField !== filter;
    });
  };

  filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.referenceFilter || 'all')));
  grid.innerHTML = '<p class="archive-loading">AESOST 해외 디자인 레퍼런스 데이터를 불러오는 중입니다.</p>';

  fetch(`${RAW_BASE}${INDEX_FILE}`, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`reference.html: ${response.status}`);
      return response.text();
    })
    .then((text) => {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const items = Array.from(doc.querySelectorAll('.reference-card')).map((card) => {
        const href = (card.getAttribute('href') || '').trim();
        const title = card.querySelector('h2')?.textContent?.trim() || '';
        const summary = card.querySelector(':scope > p')?.textContent?.trim() || '';
        const image = absoluteAsset(card.querySelector('img')?.getAttribute('src') || '');
        const alt = card.querySelector('img')?.getAttribute('alt') || title;
        const source = card.querySelector('.reference-source span')?.textContent?.trim()
          || card.querySelector('.reference-meta span')?.textContent?.trim()
          || 'GLOBAL REFERENCE';
        if (!href || !title || !/^reference-[a-z0-9-]+\.html$/i.test(href)) return null;
        return { href, title, summary, image, alt, source, field: fieldMap[href] || 'branding' };
      }).filter(Boolean);

      if (!items.length) throw new Error('No AESOST reference items found.');
      render(items);
      applyFilter('all');
    })
    .catch((error) => {
      console.error('[NINEWORKS] AESOST reference feed load failed', error);
      grid.innerHTML = '<p class="archive-error">해외 디자인 레퍼런스를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p>';
    });
})();

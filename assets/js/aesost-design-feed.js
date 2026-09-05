(() => {
  const grid = document.querySelector('[data-magazine-grid]');
  const filters = document.querySelectorAll('[data-magazine-filter]');
  if (!grid) return;

  const RAW_BASE = 'https://raw.githubusercontent.com/jyhome1228-cyber/wavelab/main/';
  const SOURCES = [
    { file: 'article.html', type: 'article', label: 'DESIGN ARTICLE' },
    { file: 'magazine.html', type: 'magazine', label: 'MAGAZINE' }
  ];

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

  const parseDate = (value = '') => {
    const normalized = value.trim().replace(/\./g, '-').replace(/-+$/, '');
    const time = Date.parse(normalized);
    return Number.isFinite(time) ? time : 0;
  };

  const fetchSource = async ({ file, type, label }) => {
    const response = await fetch(`${RAW_BASE}${file}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${file}: ${response.status}`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return Array.from(doc.querySelectorAll('.card')).map((card) => {
      const href = (card.getAttribute('href') || '').trim();
      const title = card.querySelector('h2')?.textContent?.trim() || '';
      const category = card.getAttribute('data-category') || card.querySelector('.meta span')?.textContent?.trim() || '';
      const meta = Array.from(card.querySelectorAll('.meta span')).map((node) => node.textContent.trim()).filter(Boolean);
      const date = meta.at(-1) || '';
      const sourceLabel = card.querySelector('.label')?.textContent?.trim() || label;
      const image = absoluteAsset(card.querySelector('img')?.getAttribute('src') || '');
      const alt = card.querySelector('img')?.getAttribute('alt') || title;
      if (!href || !title || !/^(?:article|magazine)-[a-z0-9-]+\.html$/i.test(href)) return null;
      return { href, title, category, date, sourceLabel, image, alt, type, label, sortTime: parseDate(date) };
    }).filter(Boolean);
  };

  const fetchMagazineFeed = async () => {
    const response = await fetch(`${RAW_BASE}magazine-feed.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`magazine-feed.json: ${response.status}`);
    const feed = await response.json();
    if (!Array.isArray(feed)) return [];
    return feed.map((item) => {
      const href = String(item?.href || '').trim();
      const title = String(item?.title || '').trim();
      if (!href || !title || !/^magazine-[a-z0-9-]+\.html$/i.test(href)) return null;
      const date = String(item?.date || '').trim();
      const publishedAt = Date.parse(String(item?.publishedAt || ''));
      return {
        href,
        title,
        category: String(item?.category || '').trim(),
        date,
        sourceLabel: String(item?.label || 'MAGAZINE').trim(),
        image: absoluteAsset(String(item?.image || '').trim()),
        alt: String(item?.alt || title).trim(),
        type: 'magazine',
        label: 'MAGAZINE',
        sortTime: Number.isFinite(publishedAt) ? publishedAt : parseDate(date)
      };
    }).filter(Boolean);
  };

  const render = (items) => {
    grid.innerHTML = items.map((item, index) => `
      <article class="magazine-card" data-feed-type="${escapeHTML(item.type)}" data-category="${escapeHTML(item.category)}">
        <a class="magazine-card__link" href="magazine-detail.html?source=${encodeURIComponent(item.href)}&origin=${encodeURIComponent(item.type)}" aria-label="${escapeHTML(item.title)} 읽기">
          <figure class="magazine-card__media">
            ${item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt)}" loading="${index < 6 ? 'eager' : 'lazy'}">` : ''}
          </figure>
          <div class="magazine-card__meta">
            <span>${escapeHTML(item.label)}</span>
            <span>${escapeHTML(item.category || 'EDITORIAL')}</span>
          </div>
          <h3>${escapeHTML(item.title)}</h3>
          <p class="magazine-card__summary">${escapeHTML(item.sourceLabel)}${item.date ? ` · ${escapeHTML(item.date)}` : ''}</p>
          <span class="magazine-card__status">Read Article ↗</span>
        </a>
      </article>`).join('');
  };

  const applyFilter = (filter) => {
    filters.forEach((button) => button.classList.toggle('is-active', button.dataset.magazineFilter === filter));
    grid.querySelectorAll('.magazine-card').forEach((card) => {
      const type = card.dataset.feedType;
      const category = card.dataset.category;
      const visible = filter === 'all'
        || filter === type
        || (filter === 'design-brand' && ['디자인', '브랜딩'].includes(category));
      card.hidden = !visible;
    });
  };

  filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.magazineFilter || 'all')));
  grid.innerHTML = '<p class="archive-loading">AESOST 디자인 아티클과 매거진 데이터를 불러오는 중입니다.</p>';

  Promise.all([...SOURCES.map(fetchSource), fetchMagazineFeed()])
    .then((groups) => {
      const merged = new Map();
      groups.flat().forEach((item) => merged.set(item.href, item));
      const items = Array.from(merged.values())
        .sort((a, b) => b.sortTime - a.sortTime || a.title.localeCompare(b.title, 'ko'));
      if (!items.length) throw new Error('No AESOST article or magazine items found.');
      render(items);
      applyFilter('all');
    })
    .catch((error) => {
      console.error('[NINEWORKS] AESOST design feed load failed', error);
      grid.innerHTML = '<p class="archive-error">디자인 아티클 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p>';
    });
})();

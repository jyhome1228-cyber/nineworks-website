(() => {
  const root = document.querySelector('[data-source-archive-root], [data-magazine-detail-root]');
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const source = (params.get('source') || '').trim();
  const RAW_BASE = 'https://raw.githubusercontent.com/jyhome1228-cyber/wavelab/main/';
  const allowed = /^(?:article|magazine|reference)-[a-z0-9-]+\.html$/i;

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const isReference = source.startsWith('reference-');
  const backHref = isReference ? 'global-references.html' : 'magazine.html';
  const backLabel = isReference ? 'Global References' : 'Design Articles';

  const showError = (message) => {
    root.className = 'source-archive-root';
    root.innerHTML = `<section class="source-archive-error container"><p class="eyebrow">ARCHIVE</p><h1>Content unavailable.</h1><p>${escapeHTML(message)}</p><a class="text-link" href="${backHref}">← Back to ${backLabel}</a></section>`;
  };

  const normalizeAsset = (value = '') => {
    if (!value || value.startsWith('#') || /^(?:https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('mailto:') || value.startsWith('tel:')) return value;
    return `${RAW_BASE}${value.replace(/^\.\//, '')}`;
  };

  const localizeInternalLink = (href = '') => {
    if (!href || href.startsWith('#') || /^(?:https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
    const file = href.split(/[?#]/)[0];
    if (!allowed.test(file)) return normalizeAsset(href);
    const target = file.startsWith('reference-') ? 'reference-detail.html' : 'magazine-detail.html';
    return `${target}?source=${encodeURIComponent(file)}`;
  };

  const cleanImportedContent = (doc) => {
    const main = doc.querySelector('main');
    if (!main) return null;

    main.querySelectorAll('script, style, .article-actions, [data-article-save], [data-article-share]').forEach((node) => node.remove());
    main.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      img.setAttribute('src', normalizeAsset(src));
      if (img.hasAttribute('srcset')) {
        const srcset = img.getAttribute('srcset').split(',').map((item) => {
          const [url, descriptor] = item.trim().split(/\s+/, 2);
          return `${normalizeAsset(url)}${descriptor ? ` ${descriptor}` : ''}`;
        }).join(', ');
        img.setAttribute('srcset', srcset);
      }
      img.setAttribute('loading', img.getAttribute('loading') || 'lazy');
    });

    main.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.setAttribute('href', localizeInternalLink(href));
      if (/^https?:\/\//i.test(link.getAttribute('href') || '')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noreferrer');
      }
    });

    main.querySelectorAll('.article-meta-card dd, .reference-meta-card dd, .reference-analysis-label, .article-eyebrow').forEach((node) => {
      node.textContent = node.textContent
        .replace(/AESOST MAGAZINE/gi, 'NINEWORKS DESIGN ARTICLES')
        .replace(/AESOST EDITORIAL/gi, 'NINEWORKS EDITORIAL')
        .replace(/WAVELAB EDITORIAL/gi, 'NINEWORKS EDITORIAL')
        .replace(/AESOST ANALYSIS/gi, 'NINEWORKS ANALYSIS');
    });

    return main;
  };

  if (!allowed.test(source)) {
    showError('올바른 아카이브 주소가 아닙니다.');
    return;
  }

  root.innerHTML = '<section class="portfolio-loading"><p>Loading archive…</p></section>';

  fetch(`${RAW_BASE}${source}`, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Source returned ${response.status}`);
      return response.text();
    })
    .then((text) => {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const imported = cleanImportedContent(doc);
      if (!imported) throw new Error('본문을 찾을 수 없습니다.');

      const sourceTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.querySelector('title')?.textContent || 'Archive';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      document.title = `${sourceTitle.replace(/\s*[—|-]\s*(?:AESOST|WAVELAB).*$/i, '')} — NINEWORKS`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta && description) meta.setAttribute('content', description);

      document.body.classList.add('source-archive-loaded');
      root.className = 'source-archive-root';
      root.innerHTML = `<div class="source-archive source-archive--${isReference ? 'reference' : 'editorial'}">
        <div class="source-archive__bar container"><a href="${backHref}">← ${backLabel}</a><span>${isReference ? 'GLOBAL REFERENCE' : source.startsWith('article-') ? 'DESIGN ARTICLE' : 'MAGAZINE'}</span></div>
        <div class="source-archive__content"></div>
        <div class="source-archive__origin container"><span>MIGRATED ARCHIVE</span><p>Originally published by AESOST. Presented within the NINEWORKS editorial system.</p></div>
      </div>`;
      root.querySelector('.source-archive__content').append(...Array.from(imported.childNodes));
    })
    .catch((error) => {
      console.error('[NINEWORKS] source archive detail load failed', error);
      showError('이전된 콘텐츠를 불러오지 못했습니다.');
    });
})();

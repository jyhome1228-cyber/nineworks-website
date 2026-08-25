(() => {
  const onboarding = document.querySelector('[data-major-onboarding]');
  const enterButton = document.querySelector('[data-major-enter]');
  const sessionKey = 'nineworks-majorportfolio-entered';

  const hideOnboarding = (instant = false) => {
    if (!onboarding) return;
    document.body.classList.remove('is-onboarding');
    if (instant) {
      onboarding.hidden = true;
      return;
    }
    onboarding.classList.add('is-hidden');
    try { sessionStorage.setItem(sessionKey, '1'); } catch (_) {}
    window.setTimeout(() => { onboarding.hidden = true; }, 460);
  };

  if (onboarding) {
    let alreadyEntered = false;
    try { alreadyEntered = sessionStorage.getItem(sessionKey) === '1'; } catch (_) {}
    if (alreadyEntered) hideOnboarding(true);
    else document.body.classList.add('is-onboarding');
    enterButton?.addEventListener('click', () => hideOnboarding(false));
  }

  const normalizeCardLinks = (card) => {
    card.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (!href || /^(?:https?:|mailto:|tel:|#|\/)/i.test(href)) return;
      anchor.setAttribute('href', `/${href.replace(/^\.?\//, '')}`);
    });
  };

  const loadMainProjects = async () => {
    const grid = document.querySelector('[data-major-project-grid]');
    const note = document.querySelector('[data-major-project-note]');
    if (!grid) return;

    try {
      const response = await fetch('/project.html', { cache: 'no-store' });
      if (!response.ok) throw new Error(`project.html ${response.status}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const cards = [...doc.querySelectorAll('.project-gallery__grid > .project-card')].slice(0, 6);
      if (!cards.length) throw new Error('No project cards found');

      const fragment = document.createDocumentFragment();
      cards.forEach((source, index) => {
        const card = source.cloneNode(true);
        normalizeCardLinks(card);
        card.querySelectorAll('img').forEach((image) => {
          image.decoding = 'async';
          image.loading = index < 2 ? 'eager' : 'lazy';
        });
        fragment.appendChild(card);
      });
      grid.replaceChildren(fragment);
      if (note) note.hidden = true;
    } catch (error) {
      console.warn('[NINEWORKS majorportfolio] main portfolio load failed', error);
      if (note) {
        note.textContent = '메인 포트폴리오를 불러오지 못했습니다. 전체 포트폴리오에서 확인해 주세요.';
        note.classList.add('is-error');
      }
    }
  };

  const parseQuotedStrings = (source) => {
    const values = [];
    const regex = /'((?:\\'|[^'])*)'/g;
    let match;
    while ((match = regex.exec(source))) values.push(match[1].replace(/\\'/g, "'"));
    return values;
  };

  const extractArray = (source, constantName) => {
    const pattern = new RegExp(`const\\s+${constantName}\\s*=\\s*\\[([\\s\\S]*?)\\];`);
    const match = source.match(pattern);
    return match ? parseQuotedStrings(match[1]) : [];
  };

  const loadClientLogos = async () => {
    const grid = document.querySelector('[data-major-client-grid]');
    if (!grid || grid.children.length) return;

    try {
      const response = await fetch('/assets/js/client-logos-20260821.js', { cache: 'no-store' });
      if (!response.ok) throw new Error(`client data ${response.status}`);
      const source = await response.text();
      const logos = extractArray(source, 'CLIENT_LOGOS');
      const names = extractArray(source, 'CLIENT_NAMES');
      if (!logos.length) throw new Error('No client logos found');

      const fragment = document.createDocumentFragment();
      logos.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'nw-logo-card';

        const image = document.createElement('img');
        const name = names[index] || '';
        image.src = src;
        image.alt = name ? `${name} 로고` : `나인웍스와 함께한 기업 로고 ${String(index + 1).padStart(2, '0')}`;
        image.loading = 'lazy';
        image.decoding = 'async';
        item.appendChild(image);

        if (name) {
          const caption = document.createElement('span');
          caption.className = 'nw-logo-card__name';
          caption.textContent = name;
          item.appendChild(caption);
          item.title = name;
        }
        fragment.appendChild(item);
      });
      grid.appendChild(fragment);
    } catch (error) {
      console.warn('[NINEWORKS majorportfolio] client data load failed', error);
      grid.innerHTML = '<p class="major-client-error">함께한 기업 데이터를 불러오지 못했습니다.</p>';
    }
  };

  const init = () => {
    loadMainProjects();
    loadClientLogos();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

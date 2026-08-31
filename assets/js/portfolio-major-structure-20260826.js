(() => {
  const grid = document.querySelector('[data-portfolio-grid]');
  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  if (!grid || !group) return;

  const caseCards = Array.from(grid.querySelectorAll('.portfolio-card:not(.portfolio-card--archive)'));
  const cutoffIndex = caseCards.findIndex((card) => {
    const title = card.querySelector('.portfolio-card__info strong')?.textContent?.trim().toUpperCase();
    return title === 'VAQUER';
  });

  if (cutoffIndex >= 0) {
    caseCards.forEach((card, index) => {
      const categories = new Set((card.dataset.category || '').split(/\s+/).filter(Boolean));
      if (index <= cutoffIndex) categories.add('major');
      else categories.delete('major');
      card.dataset.category = [...categories].join(' ');
    });
  }

  const splitPetrichor = () => {
    const webCard = Array.from(grid.querySelectorAll('.portfolio-card:not(.portfolio-card--archive)')).find((card) => {
      const title = card.querySelector('.portfolio-card__info strong')?.textContent?.trim().toUpperCase();
      return title === 'THE PETRICHOR';
    });
    if (!webCard || grid.querySelector('[data-petrichor-branding-card]')) return;

    const webCategories = new Set((webCard.dataset.category || '').split(/\s+/).filter(Boolean));
    webCategories.delete('major');
    webCategories.delete('branding');
    webCategories.delete('content');
    webCategories.add('develop');
    webCategories.add('website');
    webCard.dataset.category = [...webCategories].join(' ');

    const webLink = webCard.querySelector('.portfolio-card__link');
    if (webLink) webLink.href = 'portfolio-the-petrichor.html';

    const brandingCard = webCard.cloneNode(true);
    brandingCard.dataset.category = 'major branding content';
    brandingCard.dataset.petrichorBrandingCard = 'true';
    brandingCard.classList.remove('portfolio-card--develop');

    const brandingLink = brandingCard.querySelector('.portfolio-card__link');
    if (brandingLink) {
      brandingLink.href = 'portfolio-detail.html?work=the-petrichor';
      brandingLink.setAttribute('aria-label', 'THE PETRICHOR 브랜딩 포트폴리오 상세 보기');
    }
    const image = brandingCard.querySelector('.portfolio-card__media img');
    if (image) {
      image.src = 'https://cdn.imweb.me/upload/S202410251a294b3f442b0/1aaf826c31982.jpg';
      image.alt = 'THE PETRICHOR brand identity project';
    }
    const info = brandingCard.querySelector('.portfolio-card__info');
    if (info) info.innerHTML = '<div><strong>THE PETRICHOR</strong><span>Skincare Brand Identity & Sensory Experience</span></div><span class="portfolio-card__scope">Brand Identity · Package · Visual System</span>';
    brandingCard.querySelector('.portfolio-card__actions')?.remove();

    webCard.insertAdjacentElement('beforebegin', brandingCard);
  };

  splitPetrichor();

  const removeMajorLoadMore = () => {
    document.querySelectorAll('.portfolio-load-more').forEach((node) => node.remove());
  };

  const showAllMajor = () => {
    const activeButton = group.querySelector('[data-filter].is-active');
    if ((activeButton?.dataset.filter || '') !== 'major') return;

    const cards = Array.from(grid.querySelectorAll('.portfolio-filter-item'));
    let count = 0;
    cards.forEach((card) => {
      const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      const matches = categories.includes('major');
      card.hidden = !matches;
      if (matches) count += 1;
    });

    const countEl = document.querySelector('[data-portfolio-index-count]');
    if (countEl) countEl.textContent = `${String(count).padStart(2, '0')} WORKS`;
    removeMajorLoadMore();
  };

  removeMajorLoadMore();

  group.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    if (button.dataset.filter === 'major') {
      window.requestAnimationFrame(showAllMajor);
    } else {
      window.requestAnimationFrame(removeMajorLoadMore);
    }
  });

  window.requestAnimationFrame(() => {
    removeMajorLoadMore();
    showAllMajor();
  });
})();

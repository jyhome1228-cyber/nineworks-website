(() => {
  const aliases = {
    landing: 'detailpage',
    site: 'website',
    web: 'website'
  };

  const titleEl = document.querySelector('[data-portfolio-index-title]');
  const copyEl = document.querySelector('[data-portfolio-index-copy]');
  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  const meta = {
    website: {
      title: 'Website / Site',
      copy: '기업·브랜드 홈페이지, 플랫폼과 운영 시스템처럼 실제 사용 환경까지 구축한 웹 프로젝트를 모았습니다.'
    },
    commerce: {
      title: 'Commerce',
      copy: '브랜드 경험과 구매 흐름을 함께 설계한 커머스 구축·리뉴얼 프로젝트입니다.'
    },
    detailpage: {
      title: 'Landing / Detail Page',
      copy: '제품과 서비스의 핵심 내용을 한 화면의 흐름으로 설계한 랜딩·상세페이지 작업입니다.'
    }
  };

  group?.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = meta[button.dataset.filter];
      if (!item) return;
      if (titleEl) titleEl.textContent = item.title;
      if (copyEl) copyEl.textContent = item.copy;
    });
  });

  const rawFilter = new URLSearchParams(window.location.search).get('filter');
  if (!rawFilter) return;
  const filter = aliases[rawFilter] || rawFilter;
  const button = document.querySelector(`[data-filter="${CSS.escape(filter)}"]`);
  if (!button) return;
  window.requestAnimationFrame(() => button.click());
})();

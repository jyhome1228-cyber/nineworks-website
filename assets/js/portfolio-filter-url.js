(() => {
  const aliases = {
    all: 'major',
    landing: 'detailpage',
    detail: 'detailpage',
    site: 'website',
    web: 'website',
    platform: 'system'
  };

  const titleEl = document.querySelector('[data-portfolio-index-title]');
  const copyEl = document.querySelector('[data-portfolio-index-copy]');
  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  const meta = {
    major: {
      title: 'Major Works',
      copy: '나인웍스의 기존 주요 포트폴리오를 모아둔 대표 작업 아카이브입니다.'
    },
    website: {
      title: 'Website / Site',
      copy: '기업과 브랜드의 목적에 맞춰 정보 구조, 화면 경험, 콘텐츠와 운영 환경까지 구축한 웹사이트 프로젝트입니다.'
    },
    system: {
      title: 'System Build',
      copy: '예약, 견적, 회원, 커뮤니티, 관리자 기능처럼 실제 운영에 필요한 기능과 데이터 흐름을 구축한 프로젝트입니다.'
    },
    detailpage: {
      title: 'Detail Page',
      copy: '제품과 서비스의 핵심 내용을 구매와 이해의 흐름에 맞춰 설계한 상세페이지 작업입니다.'
    },
    editorial: {
      title: 'Editorial Design',
      copy: '브로슈어, 리플렛, 소개서와 각종 인쇄물을 정보 위계와 읽기 흐름에 맞춰 설계한 편집디자인 작업입니다.'
    },
    ir: {
      title: 'IR / PPT',
      copy: '기업과 사업의 핵심 메시지를 발표와 제안 목적에 맞춰 구조화한 IR, 회사소개서와 프레젠테이션 작업입니다.'
    },
    package: {
      title: 'Package Design',
      copy: '브랜드의 인상과 실제 제작 조건을 함께 고려해 설계한 제품 패키지와 패키지 시스템 작업입니다.'
    },
    event: {
      title: 'Event Design',
      copy: '전시, 행사, 팝업과 캠페인 현장에서 필요한 키비주얼과 온·오프라인 제작물을 설계한 프로젝트입니다.'
    }
  };

  const applyMeta = (filter) => {
    const item = meta[filter] || meta.major;
    if (titleEl) titleEl.textContent = item.title;
    if (copyEl) copyEl.textContent = item.copy;
  };

  group?.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => applyMeta(button.dataset.filter || 'major'));
  });

  const rawFilter = new URLSearchParams(window.location.search).get('filter');
  const filter = aliases[rawFilter] || rawFilter || 'major';
  const button = document.querySelector(`[data-filter="${CSS.escape(filter)}"]`);
  if (!button) {
    const majorButton = document.querySelector('[data-filter="major"]');
    if (majorButton) window.requestAnimationFrame(() => majorButton.click());
    else applyMeta('major');
    return;
  }
  window.requestAnimationFrame(() => button.click());
})();

(() => {
  const BASE = 'https://9works.kr';
  const DEFAULT_IMAGE = `${BASE}/assets/kakao-preview.png?v=20260808-1`;
  const LOGO = `${BASE}/assets/logo-nineworks.svg`;
  const path = window.location.pathname.replace(/\/+/g, '/');
  const file = path.split('/').pop() || 'index.html';
  const params = new URLSearchParams(window.location.search);

  const pageMap = {
    'index.html': {
      title: 'NINEWORKS 나인웍스 | 브랜딩·패키지·웹 디자인 스튜디오',
      description: '나인웍스는 브랜드 전략과 아이덴티티, 패키지, 웹·UX/UI, 편집·콘텐츠 디자인과 디지털 시스템 구축을 연결하는 디자인 스튜디오입니다.',
      canonical: `${BASE}/`,
      breadcrumb: [],
      pageType: 'WebPage'
    },
    'about.html': {
      title: '나인웍스 소개 | 브랜딩·디자인 스튜디오 NINEWORKS',
      description: '브랜드 아이덴티티, 패키지, 디지털, 에디토리얼 디자인을 구축해온 나인웍스의 디자인 관점과 작업 방식, 전문 영역을 소개합니다.',
      canonical: `${BASE}/about.html`,
      breadcrumb: [{ name: 'About', url: `${BASE}/about.html` }],
      pageType: 'AboutPage'
    },
    'designer.html': {
      title: '박재영 디자이너 | 브랜드 디자인·연구·교육 | NINEWORKS',
      description: '나인웍스 박재영 디자이너의 브랜드 디자인 실무, 디자인 연구, 교육, 심사·컨설팅과 주요 프로젝트 이력을 소개합니다.',
      canonical: `${BASE}/designer.html`,
      breadcrumb: [{ name: 'Designer', url: `${BASE}/designer.html` }],
      pageType: 'ProfilePage',
      person: true
    },
    'solutions.html': {
      title: '브랜딩·패키지·웹디자인 솔루션 | NINEWORKS 나인웍스',
      description: '브랜드 기획과 브랜딩, 패키지, 편집, 웹사이트, UX/UI, 상세페이지, 제품 시각화, 기업 커뮤니케이션과 오프라인 디자인까지 제공합니다.',
      canonical: `${BASE}/solutions.html`,
      breadcrumb: [{ name: 'Solutions', url: `${BASE}/solutions.html` }],
      pageType: 'CollectionPage'
    },
    'project.html': {
      title: '브랜딩·디벨롭 프로젝트 사례 | NINEWORKS 나인웍스',
      description: '스타트업, 성장 브랜드, 기업·기관의 브랜딩과 패키지, 웹사이트 및 디지털 시스템 구축 프로젝트 사례를 확인하세요.',
      canonical: `${BASE}/project.html`,
      breadcrumb: [{ name: 'Project', url: `${BASE}/project.html` }],
      pageType: 'CollectionPage'
    },
    'portfolio.html': {
      title: '브랜딩·패키지·웹개발 포트폴리오 | NINEWORKS',
      description: '브랜드 아이덴티티, 패키지, 웹·디지털 시스템, 편집, IR·PPT, 상세페이지와 이벤트 디자인까지 나인웍스의 실제 작업을 확인하세요.',
      canonical: `${BASE}/portfolio.html`,
      breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }],
      pageType: 'CollectionPage'
    },
    'magazine.html': {
      title: '브랜드 전략·브랜딩·디자인 매거진 | NINEWORKS',
      description: '브랜드 전략, 브랜드 스토리, 패키지, 공간과 리테일 경험을 디자인 관점에서 분석하고 기록하는 나인웍스 브랜드 매거진입니다.',
      canonical: `${BASE}/magazine.html`,
      breadcrumb: [{ name: 'Magazine', url: `${BASE}/magazine.html` }],
      pageType: 'CollectionPage'
    },
    'contact.html': {
      title: '브랜딩·패키지·웹 프로젝트 문의 | NINEWORKS 나인웍스',
      description: '브랜딩, 패키지, 웹사이트, UX/UI, 편집·콘텐츠 디자인과 디지털 시스템 구축 프로젝트를 나인웍스에 문의하세요.',
      canonical: `${BASE}/contact.html`,
      breadcrumb: [{ name: 'Contact', url: `${BASE}/contact.html` }],
      pageType: 'ContactPage'
    },
    'membership.html': {
      title: '월간 디자인 멤버십 | 브랜드 운영 디자인 | NINEWORKS',
      description: 'SNS 콘텐츠, 상세페이지, 편집물, 패키지와 웹 운영 디자인을 월 단위로 연결하는 나인웍스 디자인 멤버십 서비스입니다.',
      canonical: `${BASE}/membership.html`,
      breadcrumb: [{ name: 'Membership', url: `${BASE}/membership.html` }],
      pageType: 'WebPage',
      service: 'Monthly Design Membership'
    },
    'print.html': {
      title: '인쇄·패키지 제작 | 브로셔·카탈로그·단상자 | NINEWORKS',
      description: '브로셔, 카탈로그, 리플렛, 스티커 인쇄와 단상자·합지박스·슬리브·쇼핑백 패키지 양산 및 소량 샘플 제작을 상담합니다.',
      canonical: `${BASE}/print.html`,
      breadcrumb: [{ name: 'Print', url: `${BASE}/print.html` }],
      pageType: 'WebPage',
      service: 'Print & Package Production'
    },
    'print-editorial.html': {
      title: '브로셔·카탈로그·리플렛·스티커 인쇄 견적 | NINEWORKS',
      description: '브로셔, 카탈로그, 리플렛, 스티커와 라벨의 규격, 페이지, 수량, 지류, 제본과 후가공 조건을 선택해 인쇄 제작을 문의하세요.',
      canonical: `${BASE}/print-editorial.html`,
      breadcrumb: [
        { name: 'Print', url: `${BASE}/print.html` },
        { name: 'Editorial Print', url: `${BASE}/print-editorial.html` }
      ],
      pageType: 'WebPage',
      service: 'Editorial Print Production'
    },
    'package-production.html': {
      title: '단상자·합지박스·쇼핑백 패키지 제작 견적 | NINEWORKS',
      description: '단상자, 합지박스, 슬리브와 쇼핑백의 수량, 규격, 지류, 인쇄와 후가공 조건을 정리해 패키지 양산 견적을 문의하세요.',
      canonical: `${BASE}/package-production.html`,
      breadcrumb: [
        { name: 'Print', url: `${BASE}/print.html` },
        { name: 'Package Production', url: `${BASE}/package-production.html` }
      ],
      pageType: 'WebPage',
      service: 'Package Production'
    },
    'package-sample.html': {
      title: '단상자 패키지 소량 샘플 제작 | NINEWORKS',
      description: '양산 전 구조·색상·촬영·제안 확인을 위한 단상자 패키지 소량 샘플 제작 조건과 견적을 문의하세요.',
      canonical: `${BASE}/package-sample.html`,
      breadcrumb: [
        { name: 'Print', url: `${BASE}/print.html` },
        { name: 'Package Sample', url: `${BASE}/package-sample.html` }
      ],
      pageType: 'WebPage',
      service: 'Package Sample Production'
    },
    'print-partner.html': {
      title: '인쇄·제조 파트너 협력 문의 | NINEWORKS',
      description: '인쇄, 목형, 코팅, 박·형압, 톰슨·접착 등 제작 공정 파트너와의 협업을 위한 나인웍스 파트너 등록 페이지입니다.',
      canonical: `${BASE}/print-partner.html`,
      breadcrumb: [
        { name: 'Print', url: `${BASE}/print.html` },
        { name: 'Partner', url: `${BASE}/print-partner.html` }
      ],
      pageType: 'WebPage'
    },
    'develop.html': {
      title: '웹사이트 제작·웹개발·관리자 시스템 | NINEWORKS',
      description: '기업·브랜드 홈페이지, 아임웹·카페24 커스터마이징, GitHub Pages, Firebase 기반 관리자·예약·CRM·캘린더 등 웹 시스템을 기획·디자인·구축합니다.',
      canonical: `${BASE}/develop.html`,
      breadcrumb: [{ name: 'Develop', url: `${BASE}/develop.html` }],
      pageType: 'WebPage',
      service: 'Website & Digital System Development'
    },
    'client-register.html': {
      title: '클라이언트 등록·프로젝트 상담 | NINEWORKS',
      description: '나인웍스와 프로젝트를 준비하거나 진행 중인 브랜드·기업을 위한 클라이언트 등록 및 서비스 상담 페이지입니다.',
      canonical: `${BASE}/client-register.html`,
      breadcrumb: [{ name: 'Client', url: `${BASE}/client-register.html` }],
      pageType: 'WebPage'
    },
    'project-lorve.html': {
      title: 'L’ORVÉ 브랜드 아이덴티티·패키지 디자인 | NINEWORKS',
      description: '프리미엄 에스테틱 브랜드 L’ORVÉ의 브랜드 아이덴티티와 패키지 디자인을 구축한 나인웍스 프로젝트입니다.',
      canonical: `${BASE}/project-lorve.html`,
      breadcrumb: [
        { name: 'Project', url: `${BASE}/project.html` },
        { name: 'L’ORVÉ', url: `${BASE}/project-lorve.html` }
      ],
      pageType: 'CreativeWork'
    },
    'privacy.html': {
      title: '개인정보처리방침 | NINEWORKS',
      description: '나인웍스 개인정보처리방침입니다.',
      canonical: `${BASE}/privacy.html`,
      robots: 'noindex,follow',
      breadcrumb: [{ name: 'Privacy', url: `${BASE}/privacy.html` }],
      pageType: 'WebPage'
    }
  };

  let meta = pageMap[file] || null;
  let ogType = 'website';
  let image = DEFAULT_IMAGE;
  let jsonLdExtra = null;

  if (file === 'portfolio-detail.html') {
    const id = (params.get('work') || '').replace(/[^a-z0-9-]/gi, '');
    const project = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO.find((item) => item.id === id) : null;
    if (project) {
      const typeLabel = project.filters?.includes('develop')
        ? '웹개발·디지털 시스템 프로젝트'
        : project.filters?.includes('package')
          ? '브랜딩·패키지 디자인 프로젝트'
          : '브랜딩·디자인 프로젝트';
      const description = `${project.title} — ${project.subtitle || project.scope || typeLabel}. ${project.scope || ''} NINEWORKS 포트폴리오.`.replace(/\s+/g, ' ').trim();
      meta = {
        title: `${project.title} | ${typeLabel} | NINEWORKS`,
        description,
        canonical: `${BASE}/portfolio-detail.html?work=${encodeURIComponent(id)}`,
        breadcrumb: [
          { name: 'Portfolio', url: `${BASE}/portfolio.html` },
          { name: project.title, url: `${BASE}/portfolio-detail.html?work=${encodeURIComponent(id)}` }
        ],
        pageType: 'CreativeWork'
      };
      image = project.thumbnail || DEFAULT_IMAGE;
      jsonLdExtra = {
        '@type': 'CreativeWork',
        '@id': `${meta.canonical}#work`,
        name: project.title,
        description,
        url: meta.canonical,
        image,
        creator: { '@id': `${BASE}/#organization` }
      };
    } else {
      meta = {
        title: 'Portfolio | NINEWORKS',
        description: '나인웍스 디자인 및 디지털 구축 프로젝트 포트폴리오입니다.',
        canonical: `${BASE}/portfolio.html`,
        robots: 'noindex,follow',
        breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }],
        pageType: 'WebPage'
      };
    }
  }

  if (file === 'magazine-detail.html') {
    const id = (params.get('article') || '').replace(/[^a-z0-9-]/gi, '');
    const article = Array.isArray(window.NW_MAGAZINE) ? window.NW_MAGAZINE.find((item) => item.id === id) : null;
    if (article) {
      meta = {
        title: `${article.title} | NINEWORKS Magazine`,
        description: article.subtitle || `${article.title} — 나인웍스 브랜드 디자인 매거진`,
        canonical: `${BASE}/magazine-detail.html?article=${encodeURIComponent(id)}`,
        breadcrumb: [
          { name: 'Magazine', url: `${BASE}/magazine.html` },
          { name: article.title, url: `${BASE}/magazine-detail.html?article=${encodeURIComponent(id)}` }
        ],
        pageType: 'Article'
      };
      ogType = 'article';
      image = article.thumbnail || DEFAULT_IMAGE;
      jsonLdExtra = {
        '@type': 'Article',
        '@id': `${meta.canonical}#article`,
        headline: article.title,
        description: meta.description,
        url: meta.canonical,
        mainEntityOfPage: meta.canonical,
        image,
        author: { '@id': `${BASE}/#organization` },
        publisher: { '@id': `${BASE}/#organization` }
      };
    } else {
      meta = {
        title: 'Magazine | NINEWORKS',
        description: '나인웍스의 브랜드 전략과 디자인 인사이트를 기록하는 매거진입니다.',
        canonical: `${BASE}/magazine.html`,
        robots: 'noindex,follow',
        breadcrumb: [{ name: 'Magazine', url: `${BASE}/magazine.html` }],
        pageType: 'WebPage'
      };
    }
  }

  if (!meta) return;

  const setMeta = (selector, attr, value, keyAttr, keyValue) => {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(keyAttr, keyValue);
      document.head.appendChild(node);
    }
    node.setAttribute(attr, value);
  };

  const removeMeta = (selector) => document.querySelector(selector)?.remove();

  const setLink = (rel, href) => {
    let node = document.querySelector(`link[rel="${rel}"]`);
    if (!node) {
      node = document.createElement('link');
      node.rel = rel;
      document.head.appendChild(node);
    }
    node.href = href;
  };

  document.documentElement.lang = 'ko';
  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description, 'name', 'description');
  removeMeta('meta[name="keywords"]');
  setMeta('meta[name="robots"]', 'content', meta.robots || 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'name', 'robots');
  setLink('canonical', meta.canonical);

  setMeta('meta[property="og:type"]', 'content', ogType, 'property', 'og:type');
  setMeta('meta[property="og:locale"]', 'content', 'ko_KR', 'property', 'og:locale');
  setMeta('meta[property="og:site_name"]', 'content', 'NINEWORKS', 'property', 'og:site_name');
  setMeta('meta[property="og:title"]', 'content', meta.title, 'property', 'og:title');
  setMeta('meta[property="og:description"]', 'content', meta.description, 'property', 'og:description');
  setMeta('meta[property="og:url"]', 'content', meta.canonical, 'property', 'og:url');
  setMeta('meta[property="og:image"]', 'content', image, 'property', 'og:image');
  setMeta('meta[property="og:image:secure_url"]', 'content', image, 'property', 'og:image:secure_url');
  setMeta('meta[property="og:image:alt"]', 'content', file === 'index.html' ? 'NINEWORKS 나인웍스 디자인 스튜디오' : meta.title, 'property', 'og:image:alt');

  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', 'name', 'twitter:card');
  setMeta('meta[name="twitter:title"]', 'content', meta.title, 'name', 'twitter:title');
  setMeta('meta[name="twitter:description"]', 'content', meta.description, 'name', 'twitter:description');
  setMeta('meta[name="twitter:image"]', 'content', image, 'name', 'twitter:image');
  setMeta('meta[name="twitter:image:alt"]', 'content', meta.title, 'name', 'twitter:image:alt');

  const organization = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'NINEWORKS',
    alternateName: '나인웍스',
    url: `${BASE}/`,
    logo: { '@type': 'ImageObject', url: LOGO },
    image: DEFAULT_IMAGE,
    description: '브랜드 전략, 아이덴티티, 패키지, 웹·UX/UI, 편집·콘텐츠 디자인과 디지털 시스템 구축을 제공하는 디자인 스튜디오',
    foundingDate: '2017',
    email: 'info@9works.kr',
    telephone: '+82-10-5422-5650',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '원당대로 1039, 태경타워 916호',
      addressLocality: '서구',
      addressRegion: '인천광역시',
      addressCountry: 'KR'
    },
    areaServed: ['대한민국', '인천광역시', '서울특별시', '경기도'],
    knowsAbout: ['Brand Strategy', 'Brand Identity', 'Package Design', 'Editorial Design', 'Website Design', 'UX/UI Design', 'Front-end Development', 'Firebase Web Development']
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: `${BASE}/`,
    name: 'NINEWORKS',
    alternateName: '나인웍스',
    inLanguage: 'ko-KR',
    publisher: { '@id': `${BASE}/#organization` }
  };

  const webPage = {
    '@type': meta.pageType && ['AboutPage', 'ContactPage', 'CollectionPage', 'ProfilePage'].includes(meta.pageType) ? meta.pageType : 'WebPage',
    '@id': `${meta.canonical}#webpage`,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${BASE}/#website` },
    about: { '@id': `${BASE}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: image }
  };

  const graph = [organization, website, webPage];

  if (meta.person) {
    graph.push({
      '@type': 'Person',
      '@id': `${BASE}/designer.html#person`,
      name: '박재영',
      alternateName: 'Jaeyoung Park',
      jobTitle: ['Designer', 'Researcher', 'Educator'],
      worksFor: { '@id': `${BASE}/#organization` },
      url: `${BASE}/designer.html`
    });
    webPage.mainEntity = { '@id': `${BASE}/designer.html#person` };
  }

  if (meta.service) {
    const serviceId = `${meta.canonical}#service`;
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: meta.service,
      description: meta.description,
      url: meta.canonical,
      provider: { '@id': `${BASE}/#organization` },
      areaServed: { '@type': 'Country', name: '대한민국' }
    });
    webPage.mainEntity = { '@id': serviceId };
  }

  if (Array.isArray(meta.breadcrumb) && meta.breadcrumb.length) {
    const items = [{ name: 'NINEWORKS', url: `${BASE}/` }, ...meta.breadcrumb];
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${meta.canonical}#breadcrumb`,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    });
    webPage.breadcrumb = { '@id': `${meta.canonical}#breadcrumb` };
  }

  if (jsonLdExtra) {
    graph.push(jsonLdExtra);
    webPage.mainEntity = { '@id': jsonLdExtra['@id'] };
  }

  document.querySelectorAll('script[data-nineworks-seo]').forEach((node) => node.remove());
  const json = document.createElement('script');
  json.type = 'application/ld+json';
  json.dataset.nineworksSeo = 'true';
  json.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(json);
})();

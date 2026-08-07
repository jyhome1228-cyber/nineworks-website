(() => {
  const BASE = 'https://9works.kr';
  const DEFAULT_IMAGE = `${BASE}/assets/og-nineworks.svg`;
  const LOGO = `${BASE}/assets/logo-nineworks.svg`;
  const path = window.location.pathname.replace(/\/+/g, '/');
  const file = path.split('/').pop() || 'index.html';
  const params = new URLSearchParams(window.location.search);

  const pageMap = {
    'index.html': {
      title: 'NINEWORKS 나인웍스 | 브랜딩·브랜드 디자인·패키지 디자인 스튜디오',
      description: '나인웍스는 브랜드 전략과 아이덴티티, 패키지, 웹·UX/UI, 편집·콘텐츠 디자인을 설계하는 디자인 스튜디오입니다. 인천을 기반으로 서울·경기 및 전국 브랜드와 협업합니다.',
      keywords: '나인웍스, NINEWORKS, 브랜딩 회사, 브랜딩 업체, 브랜드 디자인, 브랜드 디자인 회사, 디자인 스튜디오, 패키지 디자인, 웹디자인, UX UI 디자인, 편집 디자인, 인천 디자인업체, 인천 브랜딩, 서울 브랜딩, 경기 브랜딩',
      canonical: `${BASE}/`,
      breadcrumb: []
    },
    'about.html': {
      title: '나인웍스 소개 | 브랜딩·디자인 스튜디오 NINEWORKS',
      description: '2017년부터 브랜드 아이덴티티, 패키지, 디지털, 편집 디자인을 구축해온 나인웍스의 디자인 관점과 작업 방식, 전문 영역을 소개합니다.',
      keywords: '나인웍스 소개, 디자인 스튜디오, 브랜딩 스튜디오, 브랜드 아이덴티티 회사, 브랜드 디자인 회사, 인천 디자인 스튜디오',
      canonical: `${BASE}/about.html`,
      breadcrumb: ['About']
    },
    'solutions.html': {
      title: '브랜딩·패키지·웹디자인 솔루션 | NINEWORKS 나인웍스',
      description: '브랜드 기획과 브랜딩, 패키지 디자인, 편집 디자인, 웹사이트, UX/UI, 상세페이지, 제품 시각화, 기업 커뮤니케이션, 오프라인 디자인까지 9가지 디자인 솔루션을 제공합니다.',
      keywords: '브랜딩 회사, 브랜드 기획, 브랜드 디자인, 패키지 디자인 업체, 웹디자인 업체, 홈페이지 디자인, UX UI 디자인, 상세페이지 디자인, 편집 디자인, 기업 디자인, 오프라인 디자인',
      canonical: `${BASE}/solutions.html`,
      breadcrumb: ['Solutions']
    },
    'project.html': {
      title: '브랜딩 프로젝트 사례 | 브랜드 디자인 NINEWORKS',
      description: '스타트업, 성장 브랜드, 기업과 기관의 단계별 디자인 접근과 나인웍스의 실제 브랜딩·패키지·디지털 프로젝트 사례를 확인하세요.',
      keywords: '브랜딩 프로젝트, 브랜드 디자인 사례, 브랜딩 사례, 패키지 디자인 사례, 스타트업 브랜딩, 기업 브랜딩, 브랜드 리뉴얼',
      canonical: `${BASE}/project.html`,
      breadcrumb: ['Project']
    },
    'portfolio.html': {
      title: '브랜딩·패키지 디자인 포트폴리오 | NINEWORKS',
      description: '브랜드 아이덴티티, 패키지 디자인, 웹·디지털, 편집, 콘텐츠, 공간 그래픽까지 나인웍스의 실제 디자인 포트폴리오를 확인하세요.',
      keywords: '브랜딩 포트폴리오, 브랜드 디자인 포트폴리오, 패키지 디자인 포트폴리오, 웹디자인 포트폴리오, 편집 디자인 포트폴리오, 디자인 회사 포트폴리오',
      canonical: `${BASE}/portfolio.html`,
      breadcrumb: ['Portfolio']
    },
    'magazine.html': {
      title: '브랜드 전략·브랜딩·디자인 매거진 | NINEWORKS',
      description: '브랜드 전략, 브랜드 스토리, 패키지, 공간과 리테일 경험을 디자인 관점에서 분석하고 기록하는 나인웍스의 브랜드 매거진입니다.',
      keywords: '브랜드 전략, 브랜딩 인사이트, 브랜드 스토리, 디자인 매거진, 브랜드 분석, 패키지 디자인 인사이트, 리테일 브랜딩, 공간 브랜딩',
      canonical: `${BASE}/magazine.html`,
      breadcrumb: ['Magazine']
    },
    'contact.html': {
      title: '브랜딩·디자인 프로젝트 문의 | NINEWORKS 나인웍스',
      description: '브랜딩, 브랜드 아이덴티티, 패키지, 웹사이트, UX/UI, 편집·콘텐츠 디자인 프로젝트를 나인웍스에 문의하세요.',
      keywords: '브랜딩 문의, 디자인 외주, 브랜드 디자인 견적, 패키지 디자인 견적, 웹디자인 견적, 디자인 업체 문의, 나인웍스 문의',
      canonical: `${BASE}/contact.html`,
      breadcrumb: ['Contact']
    },
    'privacy.html': {
      title: '개인정보처리방침 | NINEWORKS',
      description: '나인웍스 개인정보처리방침입니다.',
      keywords: '',
      canonical: `${BASE}/privacy.html`,
      robots: 'noindex,follow',
      breadcrumb: ['Privacy']
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
      const description = `${project.title} — ${project.subtitle || project.scope || '브랜드 디자인 프로젝트'}. ${project.scope || ''} 나인웍스 디자인 포트폴리오.`.replace(/\s+/g, ' ').trim();
      meta = {
        title: `${project.title} | 브랜딩·디자인 포트폴리오 | NINEWORKS`,
        description,
        keywords: `${project.title}, ${project.client || ''}, 브랜딩 포트폴리오, 브랜드 디자인, ${project.filters?.includes('package') ? '패키지 디자인, ' : ''}${project.filters?.includes('digital') ? '웹디자인, 디지털 디자인, ' : ''}나인웍스`,
        canonical: `${BASE}/portfolio-detail.html?work=${encodeURIComponent(id)}`,
        breadcrumb: ['Portfolio', project.title]
      };
      image = project.thumbnail || DEFAULT_IMAGE;
      jsonLdExtra = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description,
        url: meta.canonical,
        image,
        creator: { '@type': 'Organization', name: 'NINEWORKS', url: BASE }
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
        keywords: `${article.title}, 브랜드 전략, 브랜딩 인사이트, 브랜드 분석, 디자인 매거진, 나인웍스`,
        canonical: `${BASE}/magazine-detail.html?article=${encodeURIComponent(id)}`,
        breadcrumb: ['Magazine', article.title]
      };
      ogType = 'article';
      image = article.thumbnail || DEFAULT_IMAGE;
      jsonLdExtra = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: meta.description,
        url: meta.canonical,
        mainEntityOfPage: meta.canonical,
        image,
        author: { '@type': 'Organization', name: 'NINEWORKS', url: BASE },
        publisher: { '@type': 'Organization', name: 'NINEWORKS', url: BASE, logo: { '@type': 'ImageObject', url: LOGO } }
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

  const setLink = (rel, href) => {
    let node = document.querySelector(`link[rel="${rel}"]`);
    if (!node) {
      node = document.createElement('link');
      node.rel = rel;
      document.head.appendChild(node);
    }
    node.href = href;
  };

  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description, 'name', 'description');
  if (meta.keywords) setMeta('meta[name="keywords"]', 'content', meta.keywords, 'name', 'keywords');
  setMeta('meta[name="robots"]', 'content', meta.robots || 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'name', 'robots');
  setLink('canonical', meta.canonical);

  setMeta('meta[property="og:type"]', 'content', ogType, 'property', 'og:type');
  setMeta('meta[property="og:locale"]', 'content', 'ko_KR', 'property', 'og:locale');
  setMeta('meta[property="og:site_name"]', 'content', 'NINEWORKS', 'property', 'og:site_name');
  setMeta('meta[property="og:title"]', 'content', meta.title, 'property', 'og:title');
  setMeta('meta[property="og:description"]', 'content', meta.description, 'property', 'og:description');
  setMeta('meta[property="og:url"]', 'content', meta.canonical, 'property', 'og:url');
  setMeta('meta[property="og:image"]', 'content', image, 'property', 'og:image');
  setMeta('meta[property="og:image:alt"]', 'content', file === 'index.html' ? 'NINEWORKS Design Studio' : meta.title, 'property', 'og:image:alt');

  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', 'name', 'twitter:card');
  setMeta('meta[name="twitter:title"]', 'content', meta.title, 'name', 'twitter:title');
  setMeta('meta[name="twitter:description"]', 'content', meta.description, 'name', 'twitter:description');
  setMeta('meta[name="twitter:image"]', 'content', image, 'name', 'twitter:image');

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'NINEWORKS',
    alternateName: '나인웍스',
    url: BASE,
    logo: LOGO,
    description: '브랜드 전략, 아이덴티티, 패키지, 웹·UX/UI, 편집·콘텐츠 디자인을 제공하는 디자인 스튜디오',
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
    areaServed: ['인천광역시', '서울특별시', '경기도', '대한민국'],
    knowsAbout: ['Brand Strategy', 'Brand Identity', 'Package Design', 'Web Design', 'UX/UI Design', 'Editorial Design', 'Content Design']
  };

  const graph = [organization];
  if (file === 'index.html') {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: `${BASE}/`,
      name: 'NINEWORKS',
      alternateName: '나인웍스',
      publisher: { '@id': `${BASE}/#organization` },
      inLanguage: 'ko-KR'
    });
  }

  if (Array.isArray(meta.breadcrumb) && meta.breadcrumb.length) {
    const items = [{ name: 'NINEWORKS', url: `${BASE}/` }, ...meta.breadcrumb.map((name, index) => ({
      name,
      url: index === meta.breadcrumb.length - 1 ? meta.canonical : `${BASE}/${name.toLowerCase()}.html`
    }))];
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    });
  }
  if (jsonLdExtra) graph.push(jsonLdExtra);

  document.querySelectorAll('script[data-nineworks-seo]').forEach((node) => node.remove());
  const json = document.createElement('script');
  json.type = 'application/ld+json';
  json.dataset.nineworksSeo = 'true';
  json.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph.map(({ '@context': _, ...item }) => item) });
  document.head.appendChild(json);
})();

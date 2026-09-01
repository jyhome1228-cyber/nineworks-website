(() => {
  const root = document.querySelector('[data-local-branding-detail-root]');
  if (!root) return;

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const id = (new URLSearchParams(location.search).get('project') || '').replace(/[^a-z0-9-]/gi, '');
  const selected = {
    '3739f7193b9d80998702f40961c583c5': { title:'지리산 프리미엄 허니', subtitle:'Jirisan Premium Honey Gift Set', scope:'LOCAL · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/a8eced1f568c9.png' },
    '3739f7193b9d807a92cbd6c0e4298062': { title:'지리산 스틱꿀 선물세트', subtitle:'Jirisan Stick Honey Gift Package', scope:'LOCAL · GIFT', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/649b0f2ca6f60.png' },
    '3729f7193b9d80e1b43ef4d02cdd5f79': { title:'프리미엄 로컬 선물 브랜드', subtitle:'Traditional Landscape Gift Branding', scope:'BRAND · GIFT', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/3cbf371e0c31e.png' },
    '3729f7193b9d806a8371d2c219e21781': { title:'품종별 쌀 패키지', subtitle:'Local Rice Product Package System', scope:'AGRI · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/20af802ac7ade.png' },
    '3739f7193b9d80338d56c5e85b858137': { title:'로컬 김치 패키지', subtitle:'Fresh Kimchi Product Branding', scope:'FOOD · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/5cf1490aff2ce.png' },
    '3739f7193b9d8070b4a7ff4b5872b70a': { title:'냉동 굴 패키지', subtitle:'Premium Oyster Product Package', scope:'SEAFOOD · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/982bbe47f8f0a.png' },
    '3739f7193b9d8015b478e0380552302e': { title:'건멸치 선물세트', subtitle:'Dried Anchovy Premium Gift Set', scope:'SEAFOOD · GIFT', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/6ad3c2ff75132.png' },
    '3739f7193b9d80e88e5ff5185a1f6962': { title:'보리굴비 선물 패키지', subtitle:'Premium Barley Yellow Croaker Gift', scope:'SEAFOOD · GIFT', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/a55196bf4d54e.png' },
    '3739f7193b9d80ec90aecb658ac023fe': { title:'새우젓 패키지', subtitle:'Fermented Seafood Product Branding', scope:'FOOD · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/10d1cdebf0766.png' },
    '3739f7193b9d80b19605ed87160d3183': { title:'로컬 유정란 브랜드', subtitle:'Free-range Egg Brand Identity', scope:'AGRI · BRAND', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/bf31aae044b1f.png' },
    '3729f7193b9d804ca3e7c2c5ea0c1a71': { title:'대추 · 노루궁뎅이버섯 건강즙', subtitle:'Local Wellness Product Branding', scope:'WELLNESS · BRAND', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/9c171fcd5ef7f.png' },
    '3729f7193b9d8016a02deb704dc79978': { title:'홍삼 · 배 선물 브랜드', subtitle:'Red Ginseng & Pear Gift Branding', scope:'WELLNESS · GIFT', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/e6b7c5533bc1f.png' },
    '3739f7193b9d80c082b5fb4886388067': { title:'흑삼 프리미엄 선물세트', subtitle:'Black Ginseng Premium Package', scope:'WELLNESS · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/5abe5be555d79.png' },
    '3739f7193b9d804f9ccac7aeeadc42fc': { title:'호박 · 팥 티백차', subtitle:'Local Tea Product Package Design', scope:'TEA · PACKAGE', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/45e1161c81234.png' },
    '3739f7193b9d80d2a4b9fd6276080db7': { title:'지역 식재료 브랜드', subtitle:'Local Ingredients Table Branding', scope:'LOCAL FOOD · BRAND', hero:'https://cdn.imweb.me/upload/S202410251a294b3f442b0/96a243780bb95.png' },
    'cheongun-sanghoe-2025': { title:'홍성 청운상회, 로컬 팝업의 에너지를 담은 키비주얼 디자인', subtitle:'Hongseong Local Popup Festa Key Visual', scope:'LOCAL · EVENT', hero:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/4394f6661aca0.png' }
  };

  const specialCheongun = {
    title:'홍성 청운상회, 로컬 팝업의 에너지를 담은 키비주얼 디자인',
    no:37,
    paragraphs:[
      '청운대학교 로컬콘텐츠 중점대학이 충남 홍성군에서 진행한 2025 Summer Local Popup Festa ‘청운상회’의 키비주얼 프로젝트입니다.',
      '행사의 활기와 여름 팝업의 에너지를 하나의 시각 언어로 정리하고, 포스터를 중심으로 홍보물과 현장 응용물 전반에 확장될 수 있도록 그래픽 시스템을 구축했습니다.',
      '청운상회의 이름과 로컬 팝업의 성격이 한눈에 기억되도록 강한 컬러 대비, 리듬감 있는 타이포그래피와 그래픽 모티프를 중심으로 전체 인상을 설계했습니다.'
    ],
    images:[
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/4394f6661aca0.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/7670bee645312.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/722aa01413ab5.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/54302db2001de.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/f52f5a727aeef.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/36bc1c20cf270.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/ecc5729facf6c.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/cc8e87e4cb820.png',
      'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/aba5708ca84b8.png'
    ]
  };

  const sourceBase = 'https://cdn.jsdelivr.net/gh/jyhome1228-cyber/growfarmers@main/portfolio/projects/';
  const extractObject = async (url, name) => {
    const text = await fetch(url, { cache:'no-store' }).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return res.text();
    });
    const match = text.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\{[\\s\\S]*?\\});`));
    if (!match) return {};
    return Function(`"use strict";return (${match[1]})`)();
  };

  const renderNotFound = () => {
    root.innerHTML = `<section class="portfolio-not-found"><p class="eyebrow">LOCAL BRANDING</p><h1>Project not found.</h1><a class="text-link" href="local-branding.html">BACK TO LOCAL BRANDING <span>↗</span></a></section>`;
  };

  const render = ({ title, subtitle, scope, no, paragraphs, images }) => {
    const hero = images[0] || selected[id]?.hero || '';
    const gallery = images.slice(1);
    const lead = paragraphs[0] || '지역의 자원과 제품이 가진 특징을 브랜드 언어와 패키지 경험으로 연결한 로컬 브랜딩 프로젝트입니다.';
    const summary = paragraphs[1] || '실제 판매 환경에서 필요한 정보 전달과 제품의 인상, 확장 가능성을 함께 고려해 전체 시각 시스템을 구성했습니다.';
    const overviewParagraphs = paragraphs.length ? paragraphs : [lead, summary];
    const facts = [
      ['Partner','GROW FARMERS'],
      ['Scope',scope || 'LOCAL BRANDING · PACKAGE'],
      ['Category','Local Branding'],
      ['Project',`GF ${String(no || '').padStart(2,'0')}`]
    ];

    document.title = `${title} — NINEWORKS`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `${title} 로컬 브랜딩 프로젝트 — NINEWORKS × GROW FARMERS`;

    root.className = 'portfolio-split-detail';
    root.innerHTML = `<aside class="portfolio-detail-sidebar"><div class="portfolio-detail-sidebar__inner">
      <div class="portfolio-detail-sidebar__top"><p class="portfolio-detail-kicker">LOCAL BRANDING / GROW FARMERS</p><h1>${escapeHTML(title)}</h1><p class="portfolio-detail-scope">${escapeHTML(subtitle || scope || '')}</p></div>
      <div class="portfolio-detail-story"><p class="portfolio-detail-story__lead">${escapeHTML(lead)}</p><p class="portfolio-detail-story__summary">${escapeHTML(summary)}</p></div>
      <dl class="portfolio-detail-facts">${facts.map(([key,value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl>
      <nav class="portfolio-detail-index" aria-label="프로젝트 섹션"><a href="#local-overview"><span>01</span>Project Overview</a><a href="#local-visuals"><span>02</span>Visual Archive</a></nav>
      <a class="portfolio-detail-back" href="local-branding.html">← Back to Local Branding</a>
    </div></aside>
    <article class="portfolio-detail-scroll">
      ${hero ? `<figure class="portfolio-scroll-media portfolio-scroll-media--hero reveal"><img src="${escapeHTML(hero)}" alt="${escapeHTML(title)} main visual"></figure>` : ''}
      <section class="portfolio-scroll-section" id="local-overview"><header class="portfolio-scroll-section__head"><div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">01</span><span class="portfolio-scroll-section__label">PROJECT OVERVIEW</span></div><h2>지역의 제품과 이야기를 브랜드 경험으로 연결합니다.</h2></header><div class="portfolio-scroll-copy">${overviewParagraphs.map((text) => `<p>${escapeHTML(text)}</p>`).join('')}</div></section>
      <section class="portfolio-scroll-section" id="local-visuals"><header class="portfolio-scroll-section__head"><div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">02</span><span class="portfolio-scroll-section__label">VISUAL ARCHIVE</span></div><h2>Brand Identity & Package Applications</h2></header><div class="portfolio-scroll-stack">${gallery.map((src,index) => `<figure class="portfolio-scroll-media reveal"><img src="${escapeHTML(src)}" alt="${escapeHTML(title)} visual ${index + 2}" loading="lazy"></figure>`).join('')}</div></section>
      <section class="portfolio-scroll-credit"><p>Project Credit</p><dl>${facts.map(([key,value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl></section>
    </article>`;

    const revealItems = root.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }), { threshold:.05, rootMargin:'0px 0px -20px' });
      revealItems.forEach((item) => observer.observe(item));
    } else revealItems.forEach((item) => item.classList.add('is-visible'));
  };

  const run = async () => {
    if (!id) return renderNotFound();
    if (id === 'cheongun-sanghoe-2025') {
      return render({ ...specialCheongun, subtitle:selected[id].subtitle, scope:selected[id].scope });
    }

    try {
      const [metaMap, ...imageMaps] = await Promise.all([
        extractObject(`${sourceBase}detail.js`, 'M'),
        extractObject(`${sourceBase}detail-images.js`, 'A'),
        extractObject(`${sourceBase}detail-images-2.js`, 'A'),
        extractObject(`${sourceBase}detail-images-3.js`, 'A')
      ]);
      const gfMeta = metaMap[id];
      const localMeta = selected[id] || {};
      if (!gfMeta && !localMeta.title) return renderNotFound();

      const allImages = Object.assign({}, ...imageMaps);
      const images = allImages[id] || [localMeta.hero].filter(Boolean);
      let paragraphs = [];
      if (typeof window.loadGFProjectDetails === 'function' && gfMeta?.[0]) {
        try {
          const projects = await window.loadGFProjectDetails();
          const project = Array.isArray(projects) ? projects.find((item) => item?.title === gfMeta[0]) : null;
          paragraphs = (project?.blocks || []).filter((block) => block?.text && !['h2','h3'].includes(block.tag)).map((block) => block.text.trim()).filter(Boolean);
        } catch (error) {
          console.warn('Grow Farmers project copy load failed', error);
        }
      }

      render({
        title: gfMeta?.[0] || localMeta.title,
        subtitle: localMeta.subtitle || 'NINEWORKS × GROW FARMERS Local Branding Project',
        scope: localMeta.scope || 'LOCAL BRANDING · PACKAGE',
        no: gfMeta?.[1] || '',
        paragraphs,
        images
      });
    } catch (error) {
      console.error('Local branding detail load failed', error);
      const fallback = selected[id];
      if (!fallback) return renderNotFound();
      render({ title:fallback.title, subtitle:fallback.subtitle, scope:fallback.scope, no:'', paragraphs:[], images:[fallback.hero].filter(Boolean) });
    }
  };

  run();
})();

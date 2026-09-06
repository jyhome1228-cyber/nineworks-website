(() => {
  const deck = document.querySelector('[data-company-profile-deck]');
  if (!deck) return;

  const portfolio = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : [];
  const detailArchive = Array.isArray(window.NW_DETAILPAGE_ARCHIVE) ? window.NW_DETAILPAGE_ARCHIVE : [];
  const archive = Array.isArray(window.NW_PORTFOLIO_ARCHIVE) ? window.NW_PORTFOLIO_ARCHIVE : [];
  const instagramArchive = Array.isArray(window.NW_INSTAGRAM_ARCHIVE) ? window.NW_INSTAGRAM_ARCHIVE : [];

  const archiveBy = (category) => archive.filter((item) => item.category === category);
  const vaquerIndex = portfolio.findIndex((item) => String(item.title || '').trim().toUpperCase() === 'VAQUER');
  const major = vaquerIndex >= 0 ? portfolio.slice(0, vaquerIndex + 1) : portfolio.filter((item) => (item.filters || []).includes('major'));
  const majorIds = new Set(major.map((item) => item.id));
  const websites = portfolio.filter((item) => !majorIds.has(item.id) && (item.filters || []).some((filter) => ['develop', 'website', 'system'].includes(filter)));
  const packages = archiveBy('package');
  const editorials = archiveBy('editorial');
  const ir = archiveBy('ir');

  const esc = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const chunks = (items, size) => {
    const result = [];
    for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
    return result;
  };

  const page = (className, html) => {
    const section = document.createElement('section');
    section.className = `profile-page ${className || ''}`.trim();
    section.innerHTML = html;
    deck.appendChild(section);
    return section;
  };

  const shell = (content, kicker = '') => `
    <div class="page-inner">
      ${kicker ? `<p class="page-kicker">${kicker}</p>` : ''}
      ${content}
    </div>
    <span class="page-brand">NINEWORKS</span>
    <span class="page-number"></span>`;

  const intro = () => {
    page('cover', shell(`
      <div class="cover-top"><span>NINEWORKS</span><span>COMPANY PROFILE / 2026</span></div>
      <h1 class="cover-title"><span>BRAND.</span><span>DESIGN.</span><span>SYSTEM.</span></h1>
      <div class="cover-bottom"><div>Brand Strategy · Identity · Package · Digital · Content · Production</div><div>Seoul · Incheon, Korea<br>9works.kr</div></div>
    `));

    page('statement', shell(`
      <div class="statement-copy">
        <h2>브랜드의 방향을 만들고,<br>실제 작동하는 디자인으로 연결합니다.</h2>
        <p>나인웍스는 브랜드 전략과 시각 아이덴티티를 중심으로 패키지, 웹사이트, 콘텐츠, 에디토리얼과 제작까지 연결하는 디자인 스튜디오입니다.</p>
      </div>
    `, '02 / NINEWORKS'));

    page('about', shell(`
      <div class="split-head"><div><h2 class="page-title">About<br>NINEWORKS</h2></div><div><p class="page-lead">한 번의 시안보다 이후에도 반복해서 사용할 수 있는 브랜드 기준을 만듭니다.</p><p class="page-body" style="margin-top:.85cqw">브랜드가 무엇을 말해야 하는지 정리하고, 그것을 일관된 시각 언어로 만든 뒤 실제 제품·화면·문서·인쇄물에 적용합니다. 필요한 경우 웹 개발과 제작 공정까지 연결해 결과물이 실제 운영 환경에서 사용되도록 설계합니다.</p></div></div>
      <div class="info-strip">
        <div class="info-cell"><span>ESTABLISHED</span><strong>2020.02.10</strong><p>NINEWORKS</p></div>
        <div class="info-cell"><span>CORE</span><strong>Brand Design</strong><p>Strategy · Identity · System</p></div>
        <div class="info-cell"><span>EXECUTION</span><strong>Design to Build</strong><p>Digital · Print · Production</p></div>
        <div class="info-cell"><span>CONTACT</span><strong>info@9works.kr</strong><p>9works.kr</p></div>
      </div>
    `, '03 / ABOUT'));

    page('process', shell(`
      <div class="split-head"><div><h2 class="page-title">How We<br>Work</h2></div><div><p class="page-lead">진단에서 시작해 브랜드 기준을 세우고, 실행과 운영 자산까지 남깁니다.</p></div></div>
      <div class="process-grid">
        <div class="process-item"><span class="num">01</span><h3>DIAGNOSE</h3><p>시장, 고객, 제품과 기존 자료를 검토합니다.</p></div>
        <div class="process-item"><span class="num">02</span><h3>STRATEGY</h3><p>포지셔닝, 핵심 가치와 메시지를 정의합니다.</p></div>
        <div class="process-item"><span class="num">03</span><h3>SYSTEM</h3><p>로고, 타입, 컬러와 그래픽 규칙을 구축합니다.</p></div>
        <div class="process-item"><span class="num">04</span><h3>EXECUTE</h3><p>패키지, 웹, 콘텐츠와 제작물에 적용합니다.</p></div>
        <div class="process-item"><span class="num">05</span><h3>ARCHIVE</h3><p>가이드, 원본과 운영 가능한 자산을 정리합니다.</p></div>
      </div>
    `, '04 / PROCESS'));

    page('services', shell(`
      <div class="split-head"><div><h2 class="page-title">What<br>We Do</h2></div><div><p class="page-lead">브랜딩을 중심으로 제품, 디지털, 콘텐츠와 제작을 하나의 기준으로 연결합니다.</p></div></div>
      <div class="service-map">
        <div class="service-block"><b>01 / BRAND</b><div><h3>Brand Strategy & Identity</h3><p>브랜드 전략, 네이밍, 로고, 컬러, 타이포그래피와 그래픽 시스템.</p><small>STRATEGY · NAMING · IDENTITY · GUIDELINE</small></div></div>
        <div class="service-block"><b>02 / PRODUCT</b><div><h3>Package & Product</h3><p>용기, 라벨, 단상자, 세트박스와 실제 인쇄·후가공·양산.</p><small>PACKAGE · PRINT · SAMPLE · PRODUCTION</small></div></div>
        <div class="service-block"><b>03 / DIGITAL</b><div><h3>Web & System</h3><p>기업·브랜드 사이트, 쇼핑몰, 랜딩페이지, 관리자와 운영 시스템.</p><small>UX/UI · WEBSITE · COMMERCE · ADMIN · CRM</small></div></div>
        <div class="service-block"><b>04 / CONTENT</b><div><h3>Content & Editorial</h3><p>상세페이지, 소셜 콘텐츠, 회사소개서, IR, 브로셔와 캠페인.</p><small>DETAIL · SOCIAL · EDITORIAL · PRESENTATION</small></div></div>
      </div>
    `, '05 / SERVICE MAP'));

    const focus = (num, title, en, body, rows) => page('focus', shell(`
      <div class="split-head"><div><h2 class="page-title">${title}</h2><p class="page-kicker" style="margin-top:.65cqw">${en}</p></div><div><p class="page-lead">${body}</p></div></div>
      <div class="focus-layout"><div class="focus-index"><strong>${num}</strong></div><div class="focus-copy"><h3>${en}</h3><div class="focus-list">${rows.map(([a,b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div></div></div>
    `, `${num} / CORE SERVICE`));

    focus('06', 'Branding', 'Brand Strategy & Identity', '브랜드의 방향과 언어를 정의하고 이후 모든 디자인 접점이 같은 기준을 공유하도록 시각 시스템을 구축합니다.', [
      ['Strategy', 'Research · Positioning · Core Value · Message'],
      ['Verbal', 'Naming · Slogan · Brand Language'],
      ['Identity', 'Logo · Color · Typography · Graphic System'],
      ['Guideline', 'Application Rule · Master Asset · Operation Rule']
    ]);

    focus('07', 'Digital', 'Website & System', '콘텐츠 구조와 사용자 흐름을 설계하고 실제 운영 가능한 웹사이트와 커머스·관리 시스템으로 구현합니다.', [
      ['Planning', 'IA · Content Structure · User Flow'],
      ['UX/UI', 'Responsive Web · Commerce · Landing'],
      ['Build', 'HTML · CSS · JavaScript · Imweb · Cafe24'],
      ['System', 'Firebase · Admin · CRM · Form · API']
    ]);

    focus('08', 'Production', 'Package & Print Production', '그래픽 시안에서 끝내지 않고 재료, 규격, 인쇄, 후가공과 생산 조건까지 검토해 실제 결과물로 연결합니다.', [
      ['Package', 'Container · Label · Unit Box · Set Box'],
      ['Print', 'Paper · Color · Foil · Coating · Die-cut'],
      ['Proof', 'Mock-up · Sample · Color Proof'],
      ['Production', 'Vendor · Schedule · Quality · Delivery']
    ]);

    const clients = [
      ['HOLLYS','Package · Product Visual'],['GONG CHA','Package · Campaign'],['DONGKOOK PHARMACEUTICAL','Detail · Commerce'],['DELOITTE','Editorial'],['DONGWON','Package'],
      ['KOOKMIN UNIVERSITY','Identity · Editorial'],['MEGAGEN','Web · Editorial'],['CENTELLIAN 24+','Detail · Visual'],['OUGA','Brand · Package'],['RE:LIM','Brand · Digital'],
      ['RECELLÉCLORE','Brand · Commerce'],['THOMASTONE','Digital'],['TNE','Digital'],['FINE.B','Website · System'],['NINEWORKS CRM','Internal System']
    ];
    page('clients', shell(`
      <div class="split-head"><div><h2 class="page-title">Selected<br>Clients & Works</h2></div><div><p class="page-lead">기업, 제품, 로컬 브랜드와 디지털 서비스까지 서로 다른 사업 조건에 맞춰 프로젝트를 진행합니다.</p></div></div>
      <div class="client-cloud">${clients.map(([name,scope]) => `<div class="client-name"><strong>${name}</strong><span>${scope}</span></div>`).join('')}</div>
    `, '09 / SELECTED CLIENTS'));

    page('archive-overview', shell(`
      <div class="split-head"><div><h2 class="page-title">Work<br>Archive</h2></div><div><p class="page-lead">대표 프로젝트는 한 페이지씩 크게, 반복 제작 유형은 여러 프로젝트를 하나의 아카이브 그리드로 구성했습니다.</p><p class="page-body" style="margin-top:.8cqw">이후 페이지는 현재 나인웍스 포트폴리오 데이터와 연결되어 구성됩니다. 홈페이지 데이터가 정리되면 회사소개서 역시 같은 기준으로 업데이트할 수 있습니다.</p></div></div>
      <div class="archive-index">
        <div class="archive-stat"><span>MAJOR</span><strong>${major.length}</strong><p>1 project / page</p></div>
        <div class="archive-stat"><span>DETAIL PAGE</span><strong>${detailArchive.length}</strong><p>6 projects / page</p></div>
        <div class="archive-stat"><span>WEB & SYSTEM</span><strong>${websites.length}</strong><p>3 projects / page</p></div>
        <div class="archive-stat"><span>INSTAGRAM</span><strong>${instagramArchive.length}</strong><p>6 projects / page</p></div>
        <div class="archive-stat"><span>PACKAGE</span><strong>${packages.length}</strong><p>6 projects / page</p></div>
        <div class="archive-stat"><span>EDITORIAL</span><strong>${editorials.length}</strong><p>8 projects / page</p></div>
        <div class="archive-stat"><span>IR / PPT</span><strong>${ir.length}</strong><p>8 projects / page</p></div>
      </div>
    `, '10 / ARCHIVE INDEX'));
  };

  const normalizeDetailUrl = (item) => {
    if (!item.detailUrl) return `../portfolio-detail.html?work=${encodeURIComponent(item.id || '')}`;
    if (/^(https?:)?\/\//.test(item.detailUrl) || item.detailUrl.startsWith('/')) return item.detailUrl;
    return `../${item.detailUrl.replace(/^\.\//, '')}`;
  };

  const majorPages = () => {
    major.forEach((item, index) => {
      const reverse = index % 4 === 2;
      const detailUrl = normalizeDetailUrl(item);
      page(`major-page${reverse ? ' is-reverse' : ''}`, shell(`
        <div class="major-shell">
          <div class="major-copy">
            <span class="major-order">MAJOR / ${String(index + 1).padStart(2, '0')} — ${String(major.length).padStart(2, '0')}</span>
            <h2>${esc(item.title || item.client || 'Project')}</h2>
            <p class="subtitle">${esc(item.subtitle || '')}</p>
            <div class="scope">${esc(item.scope || (item.filters || []).join(' · '))}</div>
            <div class="meta">${esc(item.client || 'NINEWORKS PROJECT')} · SELECTED WORK</div>
          </div>
          <a class="major-media" href="${esc(detailUrl)}" aria-label="${esc(item.title || 'Project')} project detail">
            <img src="${esc(item.thumbnail || item.image || '')}" alt="${esc(item.title || 'NINEWORKS project')}" loading="lazy">
          </a>
        </div>
      `, `SELECTED WORK / ${esc(item.client || item.title || '')}`));
    });
  };

  const archiveCard = (item, label) => `
    <article class="archive-card">
      <figure><img src="${esc(item.thumbnail || item.image || '')}" alt="${esc(item.title || label)}" loading="lazy"></figure>
      <div class="card-copy"><strong>${esc(item.title || 'Project')}</strong><span>${esc(item.scope || item.subtitle || label)}</span></div>
    </article>`;

  const archivePages = (items, size, config) => {
    chunks(items, size).forEach((group, index, groups) => {
      const cols = config.cols || 3;
      const singleRow = group.length <= cols ? ' single-row' : '';
      page(`archive-page ${config.className || ''}`, shell(`
        <div class="archive-head"><h2>${config.title}</h2><p>${config.label} · ${String(index + 1).padStart(2,'0')} / ${String(groups.length).padStart(2,'0')}<br>${items.length} SELECTED WORKS</p></div>
        <div class="archive-grid cols-${cols}${singleRow}">${group.map((item) => archiveCard(item, config.label)).join('')}</div>
      `, config.kicker || `WORK ARCHIVE / ${config.label}`));
    });
  };

  const closing = () => page('closing', shell(`
    <h2>MAKE THE<br>NEXT SYSTEM.</h2>
    <div class="closing-meta"><div>NINEWORKS<br>Brand Strategy & Design Studio</div><div>info@9works.kr<br>9works.kr</div></div>
  `, 'END / CONTACT'));

  const numberPages = () => {
    const pages = [...deck.querySelectorAll('.profile-page')];
    pages.forEach((item, index) => {
      item.dataset.page = String(index + 1);
      const num = item.querySelector('.page-number');
      if (num) num.textContent = `${String(index + 1).padStart(3, '0')} / ${String(pages.length).padStart(3, '0')}`;
    });
    const total = document.querySelector('[data-total-pages]');
    if (total) total.textContent = String(pages.length).padStart(3, '0');
    return pages;
  };

  intro();
  majorPages();
  archivePages(detailArchive, 6, { title:'Detail Page', label:'DETAIL PAGE', cols:3, className:'detail-archive' });
  archivePages(websites, 3, { title:'Website & System', label:'DIGITAL', cols:3, className:'website-archive' });
  archivePages(instagramArchive, 6, { title:'Instagram Feed', label:'SOCIAL CONTENT', cols:3, className:'instagram-archive' });
  archivePages(packages, 6, { title:'Package Design', label:'PACKAGE', cols:3, className:'package-archive' });
  archivePages(editorials, 8, { title:'Editorial Design', label:'EDITORIAL', cols:4, className:'editorial-archive' });
  archivePages(ir, 8, { title:'IR / PPT', label:'PRESENTATION', cols:4, className:'ir-archive' });
  closing();

  const pages = numberPages();
  let current = 0;
  const currentEl = document.querySelector('[data-current-page]');

  const updateCurrent = (index) => {
    current = Math.max(0, Math.min(index, pages.length - 1));
    if (currentEl) currentEl.textContent = String(current + 1).padStart(3, '0');
  };

  const go = (index) => {
    updateCurrent(index);
    pages[current]?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  document.querySelector('[data-prev-page]')?.addEventListener('click', () => go(current - 1));
  document.querySelector('[data-next-page]')?.addEventListener('click', () => go(current + 1));
  document.querySelector('[data-print-profile]')?.addEventListener('click', () => window.print());

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); go(current + 1); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); go(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(pages.length - 1); }
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = pages.indexOf(visible.target);
    if (index >= 0) updateCurrent(index);
  }, { threshold:[.35,.55,.75] });
  pages.forEach((item) => observer.observe(item));

  updateCurrent(0);
})();
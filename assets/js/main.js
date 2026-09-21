(() => {
  if (window.__NW_MAIN_READY__) return;
  window.__NW_MAIN_READY__ = true;

  const body = document.body;
  const currentPath = window.location.pathname.toLowerCase();
  const path = currentPath.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = path === 'index.html' || currentPath === '/';
  const pageKey = isHome ? 'home' : path.replace(/\.html$/i, '');
  const isPrintingPage = /\/(?:print|print-editorial|print-partner|package-production|package-sample|production)(?:\.html)?\/?$/.test(currentPath);

  const assetPath = (value = '') => {
    try { return new URL(value, document.baseURI).pathname; }
    catch { return String(value).split('?')[0]; }
  };
  const hasAsset = (selector, attr, value) => Array.from(document.querySelectorAll(selector))
    .some((node) => assetPath(node.getAttribute(attr) || '') === assetPath(value));
  const loadStyle = (href) => {
    if (hasAsset('link[rel="stylesheet"]', 'href', href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  const loadScript = (src) => {
    if (hasAsset('script[src]', 'src', src)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  };

  window.__NW_MEMBER_AUTH__ = true;

  loadStyle('assets/css/sost-system-20260817.css?v=20260817-3');
  loadStyle('assets/css/navigation-ia-20260817.css?v=20260817-5');
  loadStyle('assets/css/site-stable-20260817.css?v=20260817-1');
  loadStyle('assets/css/mobile-ui-20260822.css?v=20260824-4');
  loadStyle('assets/css/navigation-cleanup-20260824.css?v=20260824-1');
  loadStyle('assets/css/mobile-nav-refine-20260827.css?v=20260901-3');
  loadStyle('assets/css/site-shell-sync-20260902.css?v=20260921-2');
  if (!body.classList.contains('admin-page') && !document.querySelector('link[data-nw-typography-guard]')) {
    const typographyGuard = document.createElement('link');
    typographyGuard.rel = 'stylesheet';
    typographyGuard.href = '/assets/css/typography-guard-20260820.css?v=20260824-2';
    typographyGuard.dataset.nwTypographyGuard = 'true';
    document.head.appendChild(typographyGuard);
  }
  loadStyle('assets/css/nineworks-ui-system.css?v=20260921-8');

  loadScript('assets/js/seo.js?v=20260811-3');
  loadScript('assets/js/site-firebase.js?v=20260819-1');
  if (pageKey === 'designer') loadScript('assets/js/designer-projects-v1.js?v=20260811-1');
  if (pageKey === 'project') loadScript('assets/js/project-gallery-shuffle-20260821.js?v=20260821-1');
  if (pageKey === 'project') loadScript('assets/js/project-renewal-notice-20260824.js?v=20260824-1');
  if (body.classList.contains('portfolio-detail-page')) {
    loadStyle('assets/css/portfolio-detail-refine.css?v=20260807-4');
    loadStyle('assets/css/portfolio-consistency-20260817.css?v=20260817-2');
    loadStyle('assets/css/site-stable-20260817.css?v=20260817-1');
    loadScript('assets/js/portfolio-scroll.js?v=20260807-2');
  }

  const existingLayout = document.querySelector('main > .nw-doc-layout');
  if (existingLayout) {
    const content = existingLayout.querySelector(':scope > .nw-doc-content');
    const main = existingLayout.parentElement;
    if (content && main) {
      Array.from(content.children).forEach((node) => main.insertBefore(node, existingLayout));
      existingLayout.remove();
      body.classList.remove('nw-doc-page');
    }
  }

  document.querySelectorAll('link[rel~="icon"]').forEach((icon) => icon.remove());
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = '/favicon.svg?v=20260808-2';
  document.head.appendChild(favicon);

  body.classList.add(`page-${pageKey}`);

  const shell = document.querySelector('.site-shell') || body;
  let header = document.querySelector('.site-header');
  if (!header) {
    header = document.createElement('header');
    header.className = 'site-header';
    shell.prepend(header);
  }

  let overlay = document.querySelector('[data-menu-overlay]');
  if (!overlay) {
    overlay = document.createElement('aside');
    overlay.className = 'menu-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('data-menu-overlay', '');
    header.insertAdjacentElement('afterend', overlay);
  }

  let footer = document.querySelector('.site-footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-footer container';
    shell.appendChild(footer);
  } else {
    footer.classList.add('site-footer', 'container');
  }

  header.innerHTML = `
    <div class="site-header__top">
      <div class="site-header__top-inner">
        <nav class="site-header__network" aria-label="나인웍스 네트워크">
          <a href="/">NINEWORKS</a><span aria-hidden="true">|</span><a href="https://aesost.com/" target="_blank" rel="noopener">AESOST</a>
        </nav>
        <div class="site-header__utility" aria-label="특화 서비스 바로가기">
          <a href="/support.html">정부지원사업</a>
          <a href="/majorportfolio/">B2B</a>
          <a href="/print.html">PRINTING</a>
        </div>
      </div>
    </div>
    <div class="site-header__main">
      <a class="site-logo${isPrintingPage ? ' site-logo--printing' : ''}" href="${isPrintingPage ? '/print.html' : '/'}" aria-label="${isPrintingPage ? '나인웍스 프린팅 홈' : '나인웍스 홈'}">${isPrintingPage ? 'NINEWORKS PRINTING' : 'NINEWORKS'}</a>
      <nav class="site-primary-nav" aria-label="주요 메뉴">
      <div class="site-nav-item">
        <a href="/solutions.html" data-nav-key="services">SERVICES <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown site-nav-dropdown--mega" aria-label="서비스 메뉴">
          <a href="/branding.html"><span>브랜드 디자인</span><small>전략 · 네이밍 · 아이덴티티</small></a>
          <a href="/package-design.html"><span>패키지 디자인</span><small>용기 · 라벨 · 박스 · 쇼핑백</small></a>
          <a href="/develop.html"><span>웹·디지털</span><small>홈페이지 · 쇼핑몰 · 시스템</small></a>
          <a href="/solutions.html#content"><span>콘텐츠·편집</span><small>상세페이지 · SNS · 소개서</small></a>
          <a href="/solutions.html#brand-operation"><span>브랜드 운영</span><small>월간 디자인 · 유지관리</small></a>
          <a href="/project-operation.html"><span>진행 과정</span><small>상담부터 납품까지</small></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="/portfolio.html?filter=major" data-nav-key="portfolio">PORTFOLIO <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="포트폴리오 카테고리">
          <a href="/portfolio.html?filter=major"><span>메이저 프로젝트</span><small>주요 작업</small></a>
          <a href="/project.html"><span>브랜딩 프로젝트</span><small>브랜드</small></a>
          <a href="/local-branding.html" data-local-branding-nav="true"><span>로컬 브랜딩</span><small>로컬</small></a>
          <a href="/portfolio.html?filter=website"><span>웹사이트</span><small>웹</small></a>
          <a href="/portfolio.html?filter=system"><span>시스템 구축</span><small>시스템</small></a>
          <a href="/portfolio.html?filter=detailpage"><span>상세페이지</span><small>상세</small></a>
          <a href="/portfolio.html?filter=instagram"><span>인스타그램 피드</span><small>소셜</small></a>
          <a href="/portfolio.html?filter=editorial"><span>편집 디자인</span><small>편집</small></a>
          <a href="/portfolio.html?filter=ir"><span>IR · PPT</span><small>문서</small></a>
          <a href="/portfolio.html?filter=package"><span>패키지 디자인</span><small>패키지</small></a>
          <a href="/portfolio.html?filter=event"><span>이벤트 디자인</span><small>이벤트</small></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="/about.html" data-nav-key="about">ABOUT <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="어바웃 메뉴">
          <a href="/about.html"><span>나인웍스 소개</span><small>스튜디오</small></a>
          <a href="/designer.html"><span>대표 디자이너</span><small>박재영</small></a>
          <a href="/partners.html"><span>파트너 네트워크</span><small>협업</small></a>
          <a href="/recruit.html"><span>파트너 디자이너</span><small>등록</small></a>
          <a href="/magazine.html"><span>디자인 아티클</span><small>브랜드 · 디자인</small></a>
        </div>
      </div>
      <a href="/magazine.html" data-nav-key="magazine">MAGAZINE</a>
      </nav>
      <div class="site-header__actions">
        <a class="site-header__action site-header__action--printing" href="/contact.html">프로젝트 문의 <span>↗</span></a>
      </div>
      <button class="menu-trigger" type="button" aria-label="메뉴 열기" aria-expanded="false" data-menu-trigger><span></span></button>
    </div>
  `;

  overlay.innerHTML = `
    <nav class="menu-nav" aria-label="모바일 주요 메뉴">
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">SERVICES <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/branding.html">브랜드 디자인</a>
          <a href="/package-design.html">패키지 디자인</a>
          <a href="/develop.html">웹·디지털</a>
          <a href="/solutions.html#content">콘텐츠·편집</a>
          <a href="/solutions.html#brand-operation">브랜드 운영</a>
        </div>
      </div>
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">PORTFOLIO <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/majorportfolio/">비즈니스 포트폴리오</a>
          <a href="/portfolio.html?filter=major">메이저 프로젝트</a>
          <a href="/project.html">브랜딩 프로젝트</a>
          <a href="/local-branding.html" data-local-branding-nav="true">로컬 브랜딩</a>
          <a href="/portfolio.html?filter=website">웹사이트</a>
          <a href="/portfolio.html?filter=system">시스템 구축</a>
          <a href="/portfolio.html?filter=detailpage">상세페이지</a>
          <a href="/portfolio.html?filter=instagram">인스타그램 피드</a>
          <a href="/portfolio.html?filter=editorial">편집 디자인</a>
          <a href="/portfolio.html?filter=ir">IR · PPT</a>
          <a href="/portfolio.html?filter=package">패키지 디자인</a>
          <a href="/portfolio.html?filter=event">이벤트 디자인</a>
        </div>
      </div>
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">ABOUT <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/about.html">나인웍스 소개</a>
          <a href="/designer.html">대표 디자이너</a>
          <a href="/partners.html">파트너 네트워크</a>
          <a href="/recruit.html">파트너 디자이너 등록</a>
        </div>
      </div>
      <a class="menu-nav__main" href="/magazine.html">MAGAZINE</a>
      <a class="menu-nav__main" href="/contact.html">PROJECT INQUIRY</a>
    </nav>
    <div class="menu-business-cta">
      <a class="menu-business-cta__link" href="/support.html"><span>정부지원사업</span><span>↗</span></a>
      <a class="menu-business-cta__link" href="/majorportfolio/"><span>B2B</span><span>↗</span></a>
      <a class="menu-business-cta__link menu-business-cta__link--printing" href="/print.html"><span>PRINTING</span><span>↗</span></a>
    </div>
    <div class="menu-footer">
      <p>NINEWORKS<br>Design Studio · Incheon, Korea</p>
      <div class="menu-social"><a href="https://www.behance.net/the9works">Behance</a><a href="https://www.brunch.co.kr/@jaeywriter">Brunch</a><a href="mailto:info@9works.kr">Email</a></div>
    </div>`;

  document.querySelectorAll('.sector-code').forEach((label) => label.remove());

  const navMap = {
    about: 'about', designer: 'about', performance: 'about', partners: 'about',
    branding: 'services', 'project-operation': 'services', 'package-design': 'services', process: 'services',
    project: 'portfolio', portfolio: 'portfolio', 'portfolio-detail': 'portfolio', 'local-branding': 'portfolio', 'local-branding-detail': 'portfolio',
    magazine: 'magazine', 'magazine-detail': 'magazine', 'global-references': 'magazine',
    solutions: 'services', 'signature-project': 'services', develop: 'services',
    recruit: 'about', 'design-academy': 'about', membership: 'services', 'client-register': 'services'
  };
  const activeNav = navMap[pageKey] || (pageKey.startsWith('portfolio-') ? 'portfolio' : null);
  document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((link) => {
    const active = link.dataset.navKey === activeNav;
    link.classList.toggle('is-current', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const trigger = document.querySelector('[data-menu-trigger]');
  const setMenu = (open) => {
    body.classList.toggle('is-menu-open', open);
    trigger?.setAttribute('aria-expanded', String(open));
    trigger?.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    overlay?.setAttribute('aria-hidden', String(!open));
    if (!open) {
      overlay?.querySelectorAll('[data-menu-group]').forEach((group) => {
        const button = group.querySelector('.menu-nav__toggle');
        const sub = group.querySelector('.menu-nav__sub');
        button?.setAttribute('aria-expanded', 'false');
        if (button) button.querySelector('span').textContent = '+';
        if (sub) sub.hidden = true;
      });
    }
  };

  trigger?.addEventListener('click', () => setMenu(!body.classList.contains('is-menu-open')));
  overlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  overlay?.querySelectorAll('.menu-nav__toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('[data-menu-group]');
      const sub = group?.querySelector('.menu-nav__sub');
      const open = button.getAttribute('aria-expanded') === 'true';
      overlay.querySelectorAll('[data-menu-group]').forEach((other) => {
        if (other === group) return;
        const otherButton = other.querySelector('.menu-nav__toggle');
        const otherSub = other.querySelector('.menu-nav__sub');
        otherButton?.setAttribute('aria-expanded', 'false');
        if (otherButton) otherButton.querySelector('span').textContent = '+';
        if (otherSub) otherSub.hidden = true;
      });
      button.setAttribute('aria-expanded', String(!open));
      button.querySelector('span').textContent = open ? '+' : '−';
      if (sub) sub.hidden = open;
    });
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) setMenu(false); }, { passive: true });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.08, rootMargin: '0px 0px -20px' });
    reveals.forEach((item) => observer.observe(item));
  } else reveals.forEach((item) => item.classList.add('is-visible'));

  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const targetSelector = group.dataset.filterTarget;
    group.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'major';
      group.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
      document.querySelectorAll(targetSelector).forEach((item) => {
        const categories = (item.dataset.category || '').split(' ');
        item.hidden = !categories.includes(filter);
      });
    }));
  });

  document.querySelectorAll('[data-service-tab]').forEach((tab) => tab.addEventListener('click', () => {
    const target = tab.dataset.serviceTab;
    document.querySelectorAll('[data-service-tab]').forEach((item) => item.classList.toggle('is-active', item === tab));
    document.querySelectorAll('[data-service-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.servicePanel === target));
  }));

  document.querySelectorAll('[data-language-scope]').forEach((scope) => {
    const buttons = scope.querySelectorAll('[data-language-button]');
    const copies = scope.querySelectorAll('[data-language-copy]');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const language = button.dataset.languageButton;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      copies.forEach((copy) => { copy.hidden = copy.dataset.languageCopy !== language; });
    }));
  });

  footer.innerHTML = `
    <div class="site-footer__head">
      <a class="site-footer__brand" href="/">NINEWORKS</a>
      <nav class="site-footer__links" aria-label="푸터 메뉴">
        <a href="/about.html">About</a>
        <a href="/process.html">Process</a>
        <a href="/portfolio.html?filter=major">Portfolio</a>
        <a href="/magazine.html">Design Articles</a>
        <a href="/global-references.html">Global References</a>
        <a href="/solutions.html">Solutions</a>
        <a href="/recruit.html">Designer</a>
        <a href="/contact.html">Contact</a>
        <a href="/majorportfolio/">Business Portfolio</a>
        <a href="/privacy.html">Privacy</a>
      </nav>
    </div>
    <div class="site-footer__legal">
      <p><strong>상호/대표자명</strong> · 나인웍스 / 박재영 &nbsp;&nbsp; <strong>사업자등록번호</strong> · 728-35-00866</p>
      <p><strong>주소</strong> · 인천광역시 서구 원당대로 1039, 태경타워 916호 <span class="site-footer__phone"><strong>전화</strong> · <a href="tel:01054225650">010-5422-5650</a></span></p>
      <p>NINEWORKS Office, Room 916, 1039 Wondang-daero, Seo-gu, Incheon, Republic of Korea</p>
      <p><strong>이메일</strong> · <a href="mailto:info@9works.kr">info@9works.kr</a></p>
    </div>
    <div class="site-footer__bottom"><span>© ${new Date().getFullYear()} NINEWORKS · Design Studio. All rights reserved.</span><div class="site-footer__social"><a href="https://www.behance.net/the9works">Behance</a></div></div>`;

  const mailForm = document.querySelector('[data-mail-form]');
  mailForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(mailForm);
    const projectTypes = data.getAll('projectType');
    if (mailForm.classList.contains('inquiry-form') && projectTypes.length === 0) {
      window.alert('필요한 작업 유형을 한 개 이상 선택해 주세요.');
      return;
    }
    const name = data.get('name') || '';
    const company = data.get('company') || '';
    const projectName = data.get('projectName') || '';
    const bodyText = [
      '[CONTACT]', `회사/브랜드: ${company}`, `담당자: ${name}`, `이메일: ${data.get('email') || ''}`, `연락처: ${data.get('phone') || ''}`, '',
      '[PROJECT]', `프로젝트명: ${projectName}`, `작업 유형: ${projectTypes.join(', ')}`, `요청사항: ${data.get('requirements') || ''}`, `현재 상황: ${data.get('message') || ''}`, `진행 상태: ${data.get('status') || ''}`, `참고 링크: ${data.get('reference') || ''}`, '',
      '[BUDGET & SCHEDULE]', `예상 예산: ${data.get('budget') || ''}`, `시작 희망일: ${data.get('startDate') || ''}`, `목표 완료일: ${data.get('endDate') || ''}`, `개인정보 동의: ${data.get('privacy') || ''}`
    ].join('\n');
    window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(`[NINEWORKS 프로젝트 문의] ${projectName || company || name}`)}&body=${encodeURIComponent(bodyText)}`;
  });
})();

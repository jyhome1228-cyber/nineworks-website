(() => {
  const body = document.body;
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = path === 'index.html' || window.location.pathname.endsWith('/');
  const pageKey = isHome ? 'home' : path.replace(/\.html$/i, '');

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

  /* One controlled final cascade. Do not inject the old auto local-sidebar system. */
  loadStyle('assets/css/sost-system-20260817.css?v=20260817-3');
  loadStyle('assets/css/navigation-ia-20260817.css?v=20260817-5');
  loadStyle('assets/css/site-stable-20260817.css?v=20260817-1');
  loadScript('assets/js/seo.js?v=20260811-3');
  loadScript('assets/js/site-firebase.js?v=20260819-1');
  if (pageKey === 'designer') loadScript('assets/js/designer-projects-v1.js?v=20260811-1');
  if (body.classList.contains('portfolio-detail-page')) {
    loadStyle('assets/css/portfolio-detail-refine.css?v=20260807-4');
    loadStyle('assets/css/portfolio-consistency-20260817.css?v=20260817-2');
    loadStyle('assets/css/site-stable-20260817.css?v=20260817-1');
    loadScript('assets/js/portfolio-scroll.js?v=20260807-2');
  }

  /* Remove document-shell wrappers if an older cached local-nav script created them. */
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
  favicon.href = 'favicon.svg?v=20260808-2';
  document.head.appendChild(favicon);

  body.classList.add(`page-${pageKey}`);

  const header = document.querySelector('.site-header');
  const overlay = document.querySelector('[data-menu-overlay]');

  if (header) {
    header.innerHTML = `
      <a class="site-logo" href="/" aria-label="나인웍스 홈">NINEWORKS</a>
      <nav class="site-primary-nav" aria-label="주요 메뉴">
        <a href="about.html" data-nav-key="about">ABOUT</a>
        <a href="branding.html" data-nav-key="branding">BRANDING</a>
        <a href="project.html" data-nav-key="project">PROJECTS</a>
        <div class="site-nav-item">
          <a href="portfolio.html" data-nav-key="portfolio">PORTFOLIO <span class="site-nav-caret">▾</span></a>
          <div class="site-nav-dropdown" aria-label="포트폴리오 카테고리">
            <a href="portfolio.html"><span>ALL PORTFOLIO</span><small>ALL</small></a>
            <a href="portfolio.html?filter=website"><span>WEBSITE / SITE</span><small>WEB</small></a>
            <a href="portfolio.html?filter=commerce"><span>COMMERCE</span><small>SHOP</small></a>
            <a href="portfolio.html?filter=landing"><span>LANDING / DETAIL PAGE</span><small>PAGE</small></a>
            <a href="portfolio.html?filter=package"><span>PACKAGE</span><small>PKG</small></a>
            <a href="portfolio.html?filter=editorial"><span>EDITORIAL</span><small>EDIT</small></a>
            <a href="portfolio.html?filter=ir"><span>IR / PPT</span><small>DECK</small></a>
            <a href="portfolio.html?filter=event"><span>EVENT</span><small>EVENT</small></a>
          </div>
        </div>
        <a href="magazine.html" data-nav-key="magazine">MAGAZINE</a>
        <div class="site-nav-item">
          <a href="solutions.html" data-nav-key="solutions">SOLUTIONS <span class="site-nav-caret">▾</span></a>
          <div class="site-nav-dropdown" aria-label="솔루션 메뉴">
            <a href="solutions.html"><span>SERVICE OVERVIEW</span><small>ALL</small></a>
            <a href="develop.html"><span>사이트 제작 · 시스템</span><small>WEB</small></a>
            <a href="print-editorial.html"><span>프린트 디자인</span><small>PRINT</small></a>
            <a href="package-production.html"><span>인쇄 · 패키지 제작</span><small>PRODUCTION</small></a>
            <a href="package-sample.html"><span>패키지 샘플</span><small>SAMPLE</small></a>
          </div>
        </div>
        <a href="contact.html" data-nav-key="contact">CONTACT</a>
      </nav>
      <a class="site-header__action" href="contact.html">START A PROJECT <span>↗</span></a>
      <button class="menu-trigger" type="button" aria-label="메뉴 열기" aria-expanded="false" data-menu-trigger><span></span></button>`;
  }

  if (overlay) {
    overlay.innerHTML = `
      <nav class="menu-nav" aria-label="모바일 주요 메뉴">
        <a class="menu-nav__main" href="about.html">ABOUT</a>
        <a class="menu-nav__main" href="branding.html">BRANDING</a>
        <a class="menu-nav__main" href="project.html">PROJECTS</a>
        <div class="menu-nav__group">
          <a class="menu-nav__main" href="portfolio.html">PORTFOLIO</a>
          <div class="menu-nav__sub">
            <a href="portfolio.html?filter=website">Website / Site</a>
            <a href="portfolio.html?filter=commerce">Commerce</a>
            <a href="portfolio.html?filter=landing">Landing / Detail Page</a>
            <a href="portfolio.html?filter=package">Package</a>
            <a href="portfolio.html?filter=editorial">Editorial / IR</a>
          </div>
        </div>
        <a class="menu-nav__main" href="magazine.html">MAGAZINE</a>
        <div class="menu-nav__group">
          <a class="menu-nav__main" href="solutions.html">SOLUTIONS</a>
          <div class="menu-nav__sub">
            <a href="develop.html">사이트 제작 · 시스템</a>
            <a href="print-editorial.html">프린트 디자인</a>
            <a href="package-production.html">인쇄 · 패키지 제작</a>
            <a href="package-sample.html">패키지 샘플</a>
          </div>
        </div>
        <a class="menu-nav__main" href="contact.html">CONTACT</a>
      </nav>
      <div class="menu-footer">
        <p>NINEWORKS<br>Design Studio · Incheon, Korea</p>
        <div class="menu-social"><a href="https://www.behance.net/the9works">Behance</a><a href="https://www.brunch.co.kr/@jaeywriter">Brunch</a><a href="mailto:info@9works.kr">Email</a></div>
      </div>`;
  }

  const navMap = {
    about: 'about', branding: 'branding', project: 'project',
    portfolio: 'portfolio', 'portfolio-detail': 'portfolio',
    magazine: 'magazine', 'magazine-detail': 'magazine',
    solutions: 'solutions', develop: 'solutions', print: 'solutions',
    'print-editorial': 'solutions', 'print-partner': 'solutions',
    'package-production': 'solutions', 'package-sample': 'solutions',
    membership: 'solutions', 'client-register': 'solutions', contact: 'contact'
  };
  const activeNav = navMap[pageKey];
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
    overlay?.setAttribute('aria-hidden', String(!open));
  };
  trigger?.addEventListener('click', () => setMenu(!body.classList.contains('is-menu-open')));
  overlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

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
      const filter = button.dataset.filter || 'all';
      group.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
      document.querySelectorAll(targetSelector).forEach((item) => {
        const categories = (item.dataset.category || '').split(' ');
        item.hidden = filter !== 'all' && !categories.includes(filter);
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

  document.querySelectorAll('.site-footer').forEach((footer) => {
    footer.innerHTML = `
      <div class="site-footer__head">
        <a class="site-footer__brand" href="/">NINEWORKS</a>
        <nav class="site-footer__links" aria-label="푸터 메뉴"><a href="about.html">About</a><a href="branding.html">Branding</a><a href="project.html">Projects</a><a href="portfolio.html">Portfolio</a><a href="magazine.html">Magazine</a><a href="solutions.html">Solutions</a><a href="contact.html">Contact</a><a href="privacy.html">Privacy</a></nav>
      </div>
      <div class="site-footer__legal">
        <p><strong>상호/대표자명</strong> · 나인웍스 / 박재영 &nbsp;&nbsp; <strong>사업자등록번호</strong> · 728-35-00866</p>
        <p><strong>주소</strong> · 인천광역시 서구 원당대로 1039, 태경타워 916호 &nbsp;&nbsp; <strong>전화</strong> · 010-5422-5650</p>
        <p>NINEWORKS Office, Room 916, 1039 Wondang-daero, Seo-gu, Incheon, Republic of Korea</p>
        <p><strong>이메일</strong> · <a href="mailto:info@9works.kr">info@9works.kr</a></p>
      </div>
      <div class="site-footer__bottom"><span>© ${new Date().getFullYear()} NINEWORKS · Design Studio. All rights reserved.</span><div class="site-footer__social"><a href="#">Instagram</a><a href="https://www.behance.net/the9works">Behance</a></div></div>`;
  });

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
(() => {
  if (window.__NW_MAIN_READY__) return;
  window.__NW_MAIN_READY__ = true;

  const body = document.body;
  body.setAttribute('data-nw-navigation', '20261008');
  const currentPath = window.location.pathname.toLowerCase();
  const path = currentPath.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = path === 'index.html' || currentPath === '/';
  const pageKey = isHome ? 'home' : path.replace(/\.html$/i, '');
  const isPrintingPage = /\/(?:print(?:-editorial|-partner)?|printing-[^/]+|package-(?:production|sample)|production)(?:\.html)?\/?$/.test(currentPath);

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
  loadStyle('assets/css/nineworks-ui-system.css?v=20260922-14');
  loadStyle('assets/css/header-integrity-20260922.css?v=20260922-1');
  loadStyle('assets/css/mobile-final-20261008.css?v=20261008-2');

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
          <a href="/printing-dashboard.html">PRINTING</a>
        </div>
      </div>
    </div>
    <div class="site-header__main">
      <a class="site-logo${isPrintingPage ? ' site-logo--printing' : ''}" href="${isPrintingPage ? '/printing-dashboard.html' : '/'}" aria-label="${isPrintingPage ? '나인웍스 프린팅 홈' : '나인웍스 홈'}"><img class="site-logo__image" src="${isPrintingPage ? '/assets/nineworks-printing-logo.svg?v=20260929-1' : '/assets/nineworks-wordmark-20260922.svg?v=20260922-2'}" alt="${isPrintingPage ? 'NINEWORKS PRINTING' : 'NINEWORKS'}"></a>
      <nav class="site-primary-nav" aria-label="주요 메뉴">
        <div class="site-nav-item">
          <a href="/about.html" data-nav-key="about">ABOUT <span class="site-nav-caret">▾</span></a>
          <div class="site-nav-dropdown" aria-label="어바웃 메뉴">
            <a href="/about.html"><span>나인웍스 소개</span><small>STUDIO</small></a>
            <a href="/performance.html"><span>기업 현황</span><small>COMPANY STATUS</small></a>
            <a href="/designer.html"><span>대표 디자이너</span><small>DIRECTOR</small></a>
            <a href="/partners.html"><span>파트너 네트워크</span><small>PARTNERS</small></a>
            <a href="/design-team.html"><span>디자인 팀</span><small>TEAM</small></a>
          </div>
        </div>
        <span class="site-nav-separator" aria-hidden="true">·</span>
        <div class="site-nav-item">
          <a href="/branding.html" data-nav-key="process">PROCESS <span class="site-nav-caret">▾</span></a>
          <div class="site-nav-dropdown" aria-label="프로세스 메뉴">
            <a href="/branding.html"><span>브랜딩 프로세스</span><small>BRANDING PROCESS</small></a>
            <a href="/package-design.html"><span>패키지 프로세스</span><small>PACKAGE PROCESS</small></a>
            <a href="/develop.html#develop-process"><span>웹 개발 프로세스</span><small>WEB DEVELOPMENT</small></a>
          </div>
        </div>
        <span class="site-nav-separator" aria-hidden="true">·</span>
        <div class="site-nav-item">
          <a href="/portfolio.html?filter=major" data-nav-key="portfolio">PORTFOLIO <span class="site-nav-caret">▾</span></a>
          <div class="site-nav-dropdown" aria-label="포트폴리오 카테고리">
            <a href="/portfolio.html?filter=major"><span>대표 프로젝트</span><small>FEATURED</small></a>
            <a href="/project.html"><span>브랜딩 프로젝트</span><small>BRANDING</small></a>
            <a href="/local-branding.html" data-local-branding-nav="true"><span>로컬 브랜딩</span><small>LOCAL</small></a>
            <a href="/portfolio.html?filter=website"><span>웹사이트</span><small>WEBSITE</small></a>
            <a href="/portfolio.html?filter=system"><span>시스템 구축</span><small>SYSTEM</small></a>
            <a href="/portfolio.html?filter=detailpage"><span>상세페이지</span><small>DETAIL PAGE</small></a>
            <a href="/portfolio.html?filter=instagram"><span>인스타그램 피드</span><small>SOCIAL</small></a>
            <a href="/portfolio.html?filter=editorial"><span>편집 디자인</span><small>EDITORIAL</small></a>
            <a href="/portfolio.html?filter=ir"><span>IR · PPT</span><small>PRESENTATION</small></a>
            <a href="/portfolio.html?filter=package"><span>패키지 디자인</span><small>PACKAGE</small></a>
            <a href="/portfolio.html?filter=event"><span>이벤트 디자인</span><small>EVENT</small></a>
          </div>
        </div>
        <span class="site-nav-separator" aria-hidden="true">·</span>
        <a href="/solutions.html" data-nav-key="services">SERVICES</a>
        <span class="site-nav-separator" aria-hidden="true">·</span>
        <div class="site-nav-item">
          <a href="#" data-nav-key="solutions" data-dropdown-trigger aria-haspopup="true">SOLUTIONS <span class="site-nav-caret">▾</span></a>
          <div class="site-nav-dropdown" aria-label="솔루션 메뉴">
            <a href="/develop.html"><span>웹사이트 / 관리페이지 제작</span><small>WEBSITE · ADMIN</small></a>
            <a href="/crm.html"><span>기업 전용 관리 CRM 제작</span><small>BUSINESS CRM</small></a>
            <a href="/print.html"><span>인쇄 / 패키지 제작</span><small>PRINTING</small></a>
            <a href="/oneplan-solution.html"><span>인플루언서 원플랜 솔루션</span><small>ONE PLAN</small></a>
            <a href="/ai-model.html"><span>AI 모델 스튜디오</span><small>AI MODEL STUDIO</small></a>
          </div>
        </div>
        <span class="site-nav-separator" aria-hidden="true">·</span>
        <a href="/magazine.html" data-nav-key="magazine">MAGAZINE</a>
      </nav>
      <div class="site-header__actions">
        <a class="site-header__action site-header__action--printing" href="/contact.html">프로젝트 문의 <span>↗</span></a>
      </div>
      <button class="menu-trigger" type="button" aria-label="메뉴 열기" aria-expanded="false" data-menu-trigger>
        <svg class="menu-trigger__icon menu-trigger__icon--menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg class="menu-trigger__icon menu-trigger__icon--close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  `;

  // Derive both menu levels from the desktop navigation so labels, order and
  // destinations cannot drift between desktop and mobile.
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'menu-nav';
  mobileNav.setAttribute('aria-label', '모바일 주요 메뉴');
  header.querySelectorAll('.site-primary-nav > .site-nav-item, .site-primary-nav > a').forEach((item, index) => {
    const primary = item.matches('a') ? item : item.querySelector(':scope > a');
    const dropdown = item.querySelector('.site-nav-dropdown');
    const label = primary.childNodes[0].textContent.trim();
    if (!dropdown) {
      const link = document.createElement('a');
      link.className = 'menu-nav__main';
      link.href = primary.getAttribute('href');
      link.textContent = label;
      mobileNav.appendChild(link);
      return;
    }
    const group = document.createElement('div');
    group.className = 'menu-nav__group';
    group.setAttribute('data-menu-group', '');
    const button = document.createElement('button');
    button.className = 'menu-nav__toggle';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `${label} <span aria-hidden="true">+</span>`;
    const sub = document.createElement('div');
    sub.className = 'menu-nav__sub';
    sub.id = `nw-mobile-sub-${index}`;
    sub.hidden = true;
    button.setAttribute('aria-controls', sub.id);
    dropdown.querySelectorAll('a').forEach((source) => {
      const link = document.createElement('a');
      link.href = source.getAttribute('href');
      link.textContent = source.querySelector('span')?.textContent || source.textContent;
      sub.appendChild(link);
    });
    group.append(button, sub);
    mobileNav.appendChild(group);
  });
  const inquiry = document.createElement('a');
  inquiry.className = 'menu-nav__main';
  inquiry.href = '/contact.html';
  inquiry.textContent = '프로젝트 문의';
  mobileNav.appendChild(inquiry);
  overlay.replaceChildren(mobileNav);
  const utility = document.createElement('div');
  utility.className = 'menu-business-cta';
  header.querySelectorAll('.site-header__utility > a').forEach((source) => {
    const link = source.cloneNode(true);
    link.className = 'menu-business-cta__link';
    utility.appendChild(link);
  });
  overlay.appendChild(utility);
  overlay.inert = true;

  if (isPrintingPage) {
    document.querySelectorAll('.printing-brand').forEach((brand) => {
      brand.innerHTML = '<img class="printing-brand__logo" src="/assets/nineworks-printing-logo.svg?v=20260929-1" alt="NINEWORKS PRINTING">';
      brand.setAttribute('aria-label', '나인웍스 프린팅 홈');
    });
  }

  if (isPrintingPage && !sessionStorage.getItem('nw-printing-update-notice-seen')) {
    const notice = document.createElement('div');
    notice.className = 'printing-update-notice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-modal', 'true');
    notice.setAttribute('aria-labelledby', 'printingUpdateNoticeTitle');
    notice.innerHTML = `
      <div class="printing-update-notice__panel">
        <span class="printing-update-notice__eyebrow">NINEWORKS PRINTING</span>
        <h2 id="printingUpdateNoticeTitle">현재 프린팅 페이지를 업데이트하고 있습니다.</h2>
        <p>패키지 샘플·양산과 상담 기능은 정상적으로 이용할 수 있습니다. 프린팅 세트 일부 구성은 현재 준비 중이며, 순차적으로 업데이트될 예정입니다.</p>
        <div class="printing-update-notice__status">현재 이용 가능 · 일부 프린팅 세트 준비 중</div>
        <div class="printing-update-notice__actions">
          <button class="printing-update-notice__close" type="button">확인하고 계속하기</button>
        </div>
      </div>
    `;
    const closeNotice = () => {
      sessionStorage.setItem('nw-printing-update-notice-seen', '1');
      notice.remove();
    };
    notice.querySelector('.printing-update-notice__close')?.addEventListener('click', closeNotice);
    notice.addEventListener('click', (event) => {
      if (event.target === notice) closeNotice();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.contains(notice)) closeNotice();
    }, { once: true });
    body.appendChild(notice);
  }

  document.querySelectorAll('.sector-code').forEach((label) => label.remove());

  const navMap = {
    about: 'about', designer: 'about', 'design-team': 'about', performance: 'about', partners: 'about',
    process: 'process', 'project-operation': 'process',
    project: 'portfolio', portfolio: 'portfolio', 'portfolio-detail': 'portfolio', 'local-branding': 'portfolio', 'local-branding-detail': 'portfolio',
    solutions: 'solutions', develop: 'solutions', crm: 'solutions', support: 'solutions', print: 'solutions', 'printing-dashboard': 'solutions', 'oneplan-solution': 'solutions', 'print-editorial': 'solutions', 'print-partner': 'solutions', 'package-production': 'solutions', 'package-sample': 'solutions', production: 'solutions',
    branding: 'process', 'package-design': 'process', 'signature-project': 'services', membership: 'services', 'client-register': 'services',
    magazine: 'magazine', 'magazine-detail': 'magazine', 'global-references': 'magazine',
    'design-academy': 'about'
  };
  let activeNav = navMap[pageKey] || (pageKey.startsWith('portfolio-') ? 'portfolio' : null);
  if (pageKey === 'develop' && window.location.hash === '#develop-process') activeNav = 'process';
  if (body.classList.contains('about-page')) activeNav = 'about';
  else if (body.classList.contains('process-overview-page')) activeNav = 'process';
  else if (body.classList.contains('solutions-page')) activeNav = 'solutions';
  else if (body.classList.contains('portfolio-detail-page')) activeNav = 'portfolio';
  document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((link) => {
    const active = link.dataset.navKey === activeNav;
    link.classList.toggle('is-current', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-dropdown-trigger]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  const trigger = document.querySelector('[data-menu-trigger]');
  const setMenu = (open) => {
    body.classList.toggle('is-menu-open', open);
    trigger?.setAttribute('aria-expanded', String(open));
    trigger?.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    overlay?.setAttribute('aria-hidden', String(!open));
    if (overlay) overlay.inert = !open;
    if (!open && overlay?.contains(document.activeElement)) trigger?.focus();

    overlay?.querySelectorAll('[data-menu-group]').forEach((group) => {
      const button = group.querySelector('.menu-nav__toggle');
      const sub = group.querySelector('.menu-nav__sub');
      button?.setAttribute('aria-expanded', 'false');
      if (button) button.querySelector('span').textContent = '+';
      if (sub) sub.hidden = true;
    });

    if (open && overlay) {
      overlay.scrollTop = 0;
      requestAnimationFrame(() => { overlay.scrollTop = 0; });
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
  window.addEventListener('resize', () => { if (window.innerWidth > 980) setMenu(false); }, { passive: true });

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
      <a class="site-footer__brand${isPrintingPage ? ' site-footer__brand--printing' : ''}" href="${isPrintingPage ? '/printing-dashboard.html' : '/'}" aria-label="${isPrintingPage ? '나인웍스 프린팅 홈' : '나인웍스 홈'}"><img src="${isPrintingPage ? '/assets/nineworks-printing-logo.svg?v=20260929-1' : '/assets/nineworks-wordmark-20260922.svg?v=20260922-2'}" alt="${isPrintingPage ? 'NINEWORKS PRINTING' : 'NINEWORKS'}"></a>
      <nav class="site-footer__links" aria-label="푸터 메뉴">
        <a href="/about.html">About</a>
        <a href="/branding.html">Process</a>
        <a href="/portfolio.html?filter=major">Portfolio</a>
        <a href="/magazine.html">Design Articles</a>
        <a href="/global-references.html">Global References</a>
        <a href="/solutions.html">Solutions</a>
        <a href="/design-team.html">Design Team</a>
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

  if (isPrintingPage && pageKey !== 'printing-dashboard') {
    loadStyle('assets/css/printing-contact-cta.css?v=20260922-1');
    body.classList.add('has-printing-contact-cta');
    if (!document.querySelector('.printing-contact-cta')) {
      const printingContact = document.createElement('a');
      printingContact.className = 'printing-contact-cta';
      printingContact.href = 'tel:01047587049';
      printingContact.setAttribute('aria-label', '인쇄 담당자에게 전화 문의하기. 월요일부터 금요일 오전 10시부터 오후 7시까지 친절 상담');
      printingContact.innerHTML = `
        <span class="printing-contact-cta__copy">
          <strong>인쇄 담당자에게 문의하기</strong>
          <small>월–금 10:00–19:00 · 친절 상담</small>
        </span>
        <span class="printing-contact-cta__action">전화하기 <b>↗</b></span>
      `;
      body.appendChild(printingContact);
    }
  }

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

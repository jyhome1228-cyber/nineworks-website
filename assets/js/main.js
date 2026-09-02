(() => {
  if (window.__NW_MAIN_READY__) return;
  window.__NW_MAIN_READY__ = true;

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

  window.__NW_MEMBER_AUTH__ = true;

  loadStyle('assets/css/sost-system-20260817.css?v=20260817-3');
  loadStyle('assets/css/navigation-ia-20260817.css?v=20260817-5');
  loadStyle('assets/css/site-stable-20260817.css?v=20260817-1');
  loadStyle('assets/css/mobile-ui-20260822.css?v=20260824-4');
  loadStyle('assets/css/navigation-cleanup-20260824.css?v=20260824-1');
  loadStyle('assets/css/mobile-nav-refine-20260827.css?v=20260901-3');
  loadStyle('assets/css/site-shell-sync-20260902.css?v=20260902-1');

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
    <a class="site-logo" href="/" aria-label="나인웍스 홈">NINEWORKS</a>
    <nav class="site-primary-nav" aria-label="주요 메뉴">
      <div class="site-nav-item">
        <a href="/about.html" data-nav-key="about">ABOUT <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="어바웃 메뉴">
          <a href="/about.html"><span>나인웍스</span><small>회사소개</small></a>
          <a href="/designer.html"><span>대표 디자이너</span><small>박재영</small></a>
          <a href="/performance.html"><span>재무정보</span><small>사업정보</small></a>
          <a href="/partners.html"><span>협력사</span><small>파트너 네트워크</small></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="/process.html" data-nav-key="process">PROCESS <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="프로세스 메뉴">
          <a href="/project-operation.html" style="margin-bottom:8px!important;padding-bottom:13px!important;border-bottom:1px solid #aaa9a3!important"><span>프로젝트 프로세스</span><small>진행 절차</small></a>
          <a href="/branding.html"><span>브랜딩</span><small>브랜드</small></a>
          <a href="/package-design.html"><span>패키지 디자인</span><small>패키지</small></a>
          <a href="/solutions.html#brand-operation"><span>브랜드 운영</span><small>파트너십</small></a>
          <a href="/develop.html"><span>웹 &amp; 커머스</span><small>디지털</small></a>
          <a href="/solutions.html"><span>콘텐츠 디자인</span><small>콘텐츠</small></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="/portfolio.html?filter=major" data-nav-key="portfolio">PORTFOLIO <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="포트폴리오 카테고리">
          <a href="/majorportfolio/"><span>비즈니스 포트폴리오</span><small>기업용</small></a>
          <a href="/portfolio.html?filter=major"><span>메이저 프로젝트</span><small>주요 작업</small></a>
          <a href="/project.html"><span>브랜딩 프로젝트</span><small>브랜드</small></a>
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
      <a href="/magazine.html" data-nav-key="magazine">MAGAZINE</a>
      <div class="site-nav-item">
        <a href="/solutions.html" data-nav-key="solutions">SOLUTIONS <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="솔루션 메뉴">
          <a href="/solutions.html"><span>서비스 전체보기</span><small>안내</small></a>
          <a href="/signature-project.html"><span>시그니처 프로젝트</span><small>주요 구성</small></a>
          <a href="/develop.html"><span>사이트 제작 · 시스템</span><small>웹</small></a>
          <a href="/print-editorial.html"><span>프린트 디자인</span><small>인쇄</small></a>
          <a href="/package-production.html"><span>인쇄 · 패키지 제작</span><small>제작</small></a>
          <a href="/package-sample.html"><span>패키지 샘플 제작</span><small>샘플</small></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="/recruit.html" data-nav-key="designer-network">DESIGNER <span class="site-nav-caret">▾</span></a>
        <div class="site-nav-dropdown" aria-label="디자이너 메뉴">
          <a href="/recruit.html"><span>파트너 디자이너</span><small>프로젝트 협업 등록</small></a>
          <a href="/design-academy.html"><span>디자인 아카데미 등록</span><small>교육 프로그램 등록</small></a>
        </div>
      </div>
      <a href="/contact.html" data-nav-key="contact">CONTACT</a>
    </nav>
    <a class="site-header__action" href="/majorportfolio/">BUSINESS PORTFOLIO <span>↗</span></a>
    <button class="menu-trigger" type="button" aria-label="메뉴 열기" aria-expanded="false" data-menu-trigger><span></span></button>`;

  overlay.innerHTML = `
    <nav class="menu-nav" aria-label="모바일 주요 메뉴">
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">ABOUT <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/about.html">나인웍스</a>
          <a href="/designer.html">대표 디자이너 · 박재영</a>
          <a href="/performance.html">재무정보</a>
          <a href="/partners.html">협력사</a>
        </div>
      </div>
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">PROCESS <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/project-operation.html" style="margin-bottom:8px!important;padding-bottom:12px!important;border-bottom:1px solid rgba(255,255,255,.28)!important">프로젝트 프로세스</a>
          <a href="/branding.html">브랜딩</a>
          <a href="/package-design.html">패키지 디자인</a>
          <a href="/solutions.html#brand-operation">브랜드 운영</a>
          <a href="/develop.html">웹 &amp; 커머스</a>
          <a href="/solutions.html">콘텐츠 디자인</a>
        </div>
      </div>
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">PORTFOLIO <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/majorportfolio/">비즈니스 포트폴리오</a>
          <a href="/portfolio.html?filter=major">메이저 프로젝트</a>
          <a href="/project.html">브랜딩 프로젝트</a>
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
      <a class="menu-nav__main" href="/magazine.html">MAGAZINE</a>
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">SOLUTIONS <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/solutions.html">서비스 전체보기</a>
          <a href="/signature-project.html">시그니처 프로젝트</a>
          <a href="/develop.html">사이트 제작 · 시스템</a>
          <a href="/print-editorial.html">프린트 디자인</a>
          <a href="/package-production.html">인쇄 · 패키지 제작</a>
          <a href="/package-sample.html">패키지 샘플 제작</a>
        </div>
      </div>
      <div class="menu-nav__group" data-menu-group>
        <button class="menu-nav__toggle" type="button" aria-expanded="false">DESIGNER <span>+</span></button>
        <div class="menu-nav__sub" hidden>
          <a href="/recruit.html">파트너 디자이너</a>
          <a href="/design-academy.html">디자인 아카데미 등록</a>
        </div>
      </div>
      <a class="menu-nav__main" href="/contact.html">CONTACT</a>
    </nav>
    <div class="menu-business-cta">
      <a class="menu-business-cta__link" href="/majorportfolio/"><span>BUSINESS PORTFOLIO</span><span>↗</span></a>
    </div>
    <div class="menu-footer">
      <p>NINEWORKS<br>Design Studio · Incheon, Korea</p>
      <div class="menu-social"><a href="https://www.behance.net/the9works">Behance</a><a href="https://www.brunch.co.kr/@jaeywriter">Brunch</a><a href="mailto:info@9works.kr">Email</a></div>
    </div>`;

  const navMap = {
    about: 'about', designer: 'about', performance: 'about', partners: 'about',
    branding: 'process', 'project-operation': 'process', 'package-design': 'process', process: 'process',
    project: 'portfolio', portfolio: 'portfolio', 'portfolio-detail': 'portfolio',
    magazine: 'magazine', 'magazine-detail': 'magazine',
    solutions: 'solutions', 'signature-project': 'solutions', develop: 'solutions', print: 'solutions',
    'print-editorial': 'solutions', 'print-partner': 'solutions', 'package-production': 'solutions', 'package-sample': 'solutions',
    recruit: 'designer-network', 'design-academy': 'designer-network',
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
        <a href="/magazine.html">Magazine</a>
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
    <div class="site-footer__bottom"><span>© ${new Date().getFullYear()} NINEWORKS · Design Studio. All rights reserved.</span><div class="site-footer__social"><a href="#">Instagram</a><a href="https://www.behance.net/the9works">Behance</a></div></div>`;

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
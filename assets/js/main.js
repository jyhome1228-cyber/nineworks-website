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
    script.defer = true;
    document.head.appendChild(script);
  };

  loadStyle('assets/css/clarity-20260814.css?v=20260814-2');
  loadScript('assets/js/seo.js?v=20260811-3');
  if (pageKey === 'designer') loadScript('assets/js/designer-projects-v1.js?v=20260811-1');
  if (body.classList.contains('portfolio-detail-page')) {
    loadStyle('assets/css/portfolio-detail-refine.css?v=20260807-4');
    loadScript('assets/js/portfolio-scroll.js?v=20260807-2');
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
  const isServicePage = /^(solutions|develop|print|print-editorial|print-partner|package-production|package-sample|membership|client-register)$/.test(pageKey);

  if (header) {
    header.innerHTML = `
      <a class="site-logo" href="/" aria-label="나인웍스 홈">NINEWORKS</a>
      <nav class="site-primary-nav" aria-label="주요 메뉴">
        <a href="about.html" data-nav-key="about">ABOUT</a>
        <a href="portfolio.html" data-nav-key="work">WORK</a>
        <a href="magazine.html" data-nav-key="magazine">MAGAZINE</a>
        <a href="contact.html" data-nav-key="contact">CONTACT</a>
      </nav>
      <div class="site-header__actions">
        <div class="site-service-menu" data-service-menu>
          <button class="site-service-button${isServicePage ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="site-service-dropdown" data-service-toggle>
            <span>SERVICES</span><span class="site-service-button__mark">＋</span>
          </button>
          <div class="site-service-dropdown" id="site-service-dropdown" aria-hidden="true" data-service-dropdown>
            <a href="solutions.html#branding"><span>01</span><strong>BRANDING</strong><small>Strategy · Identity · Package</small></a>
            <a href="develop.html"><span>02</span><strong>DEVELOP</strong><small>Website · Commerce · System</small></a>
            <a href="print.html"><span>03</span><strong>PRINT</strong><small>Package · Editorial · Production</small></a>
            <a href="membership.html"><span>04</span><strong>MEMBERSHIP</strong><small>Ongoing design support</small></a>
          </div>
        </div>
        <a class="site-header__action" href="contact.html">START A PROJECT <span>↗</span></a>
      </div>
      <button class="menu-trigger" type="button" aria-label="메뉴 열기" aria-expanded="false" data-menu-trigger><span></span></button>`;
  }

  if (overlay) {
    overlay.innerHTML = `
      <nav class="menu-nav" aria-label="모바일 주요 메뉴">
        <a href="about.html">ABOUT</a>
        <a href="portfolio.html">WORK</a>
        <a href="solutions.html">SERVICES</a>
        <a href="magazine.html">MAGAZINE</a>
        <a href="contact.html">CONTACT</a>
      </nav>
      <div class="menu-service-links" aria-label="서비스 바로가기">
        <a href="solutions.html#branding">BRANDING <span>↗</span></a>
        <a href="develop.html">DEVELOP <span>↗</span></a>
        <a href="print.html">PRINT <span>↗</span></a>
        <a href="membership.html">MEMBERSHIP <span>↗</span></a>
      </div>
      <div class="menu-footer"><p>NINEWORKS<br>Design Studio · Incheon, Korea</p><a href="mailto:info@9works.kr">info@9works.kr</a></div>`;
  }

  const navMap = {
    about: 'about', designer: 'about',
    portfolio: 'work', 'portfolio-detail': 'work',
    magazine: 'magazine', 'magazine-detail': 'magazine',
    contact: 'contact'
  };
  const activeNav = navMap[pageKey];
  document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((link) => {
    const active = link.dataset.navKey === activeNav;
    link.classList.toggle('is-current', active);
    if (active) link.setAttribute('aria-current', 'page');
  });

  const trigger = document.querySelector('[data-menu-trigger]');
  const serviceToggle = document.querySelector('[data-service-toggle]');
  const serviceMenu = document.querySelector('[data-service-menu]');
  const serviceDropdown = document.querySelector('[data-service-dropdown]');

  const setMenu = (open) => {
    body.classList.toggle('is-menu-open', open);
    trigger?.setAttribute('aria-expanded', String(open));
    overlay?.setAttribute('aria-hidden', String(!open));
  };
  const setService = (open) => {
    serviceMenu?.classList.toggle('is-open', open);
    serviceToggle?.setAttribute('aria-expanded', String(open));
    serviceDropdown?.setAttribute('aria-hidden', String(!open));
  };

  trigger?.addEventListener('click', () => setMenu(!body.classList.contains('is-menu-open')));
  overlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  serviceToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    setService(!serviceMenu?.classList.contains('is-open'));
  });
  serviceDropdown?.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', () => setService(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { setMenu(false); setService(false); }
  });

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
        <nav class="site-footer__links" aria-label="푸터 메뉴"><a href="about.html">About</a><a href="portfolio.html">Work</a><a href="solutions.html">Services</a><a href="magazine.html">Magazine</a><a href="contact.html">Contact</a><a href="privacy.html">Privacy</a></nav>
      </div>
      <div class="site-footer__legal">
        <p>나인웍스 · 728-35-00866 · 인천광역시 서구 원당대로 1039, 태경타워 916호</p>
        <p><a href="mailto:info@9works.kr">info@9works.kr</a> · 010-5422-5650</p>
      </div>
      <div class="site-footer__bottom"><span>© ${new Date().getFullYear()} NINEWORKS. All rights reserved.</span><div class="site-footer__social"><a href="https://www.behance.net/the9works">Behance</a></div></div>`;
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
      '[PROJECT]', `프로젝트명: ${projectName}`, `작업 유형: ${projectTypes.join(', ')}`, `요청사항: ${data.get('requirements') || ''}`, `현재 상황: ${data.get('message') || ''}`, `참고 링크: ${data.get('reference') || ''}`, '',
      '[BUDGET & SCHEDULE]', `예상 예산: ${data.get('budget') || ''}`, `목표 완료일: ${data.get('endDate') || ''}`
    ].join('\n');
    window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(`[NINEWORKS 프로젝트 문의] ${projectName || company || name}`)}&body=${encodeURIComponent(bodyText)}`;
  });
})();
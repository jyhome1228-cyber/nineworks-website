(() => {
  const loadStylesheet = (href) => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.appendChild(stylesheet);
  };

  const loadScript = (src) => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  };

  loadScript('assets/js/seo.js?v=20260808-1');
  loadScript('assets/js/typography.js?v=20260808-1');

  document.querySelectorAll('link[rel~="icon"]').forEach((icon) => icon.remove());
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = 'favicon.svg?v=20260808-2';
  document.head.appendChild(favicon);

  loadStylesheet('assets/css/refine.css?v=20260808-2');
  loadStylesheet('assets/css/alignment.css?v=20260808-1');

  if (document.querySelector('.project-detail')) loadStylesheet('assets/css/project-detail.css?v=20260804-2');
  if (document.body.classList.contains('contact-page')) loadStylesheet('assets/css/contact.css?v=20260807-4');

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-trigger]');
  const menu = document.querySelector('[data-menu-overlay]');
  const isPortfolioDetail = body.classList.contains('portfolio-detail-page');
  const pathname = window.location.pathname;
  const fileName = pathname.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = pathname.endsWith('/') || pathname.endsWith('/index.html') || pathname.endsWith('/nineworks-website');
  const pageSlug = isHome ? 'home' : fileName.replace(/\.html$/i, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  body.classList.add(`page-${pageSlug}`);

  if (isPortfolioDetail) {
    loadStylesheet('assets/css/portfolio-detail-refine.css?v=20260807-4');
    loadScript('assets/js/portfolio-scroll.js?v=20260807-2');
  }

  if (isHome) {
    loadStylesheet('assets/css/home-portfolio.css?v=20260808-4');
    loadStylesheet('assets/css/home-editorial-hero.css?v=20260810-3');
    loadScript('assets/js/home-portfolio.js?v=20260810-5');
  }

  loadStylesheet('assets/css/readability-v3.css?v=20260810-1');
  loadStylesheet('assets/css/fullwidth-v1.css?v=20260810-2');

  document.querySelectorAll('a[href="research.html"]').forEach((link) => {
    link.href = 'solutions.html';
    const text = link.textContent.trim();
    if (/research/i.test(text)) link.textContent = text.replace(/research/ig, 'Solutions');
  });

  document.querySelectorAll('.menu-nav').forEach((nav) => {
    nav.querySelectorAll('a[href="research.html"]').forEach((link) => link.remove());
    if (!nav.querySelector('a[href="solutions.html"]')) {
      const solutionsLink = document.createElement('a');
      solutionsLink.href = 'solutions.html';
      solutionsLink.textContent = 'Solutions';
      const contactLink = nav.querySelector('a[href="contact.html"]');
      nav.insertBefore(solutionsLink, contactLink || null);
    }
  });

  const markCurrentNavigation = () => {
    const current = isHome ? 'index.html' : fileName;
    document.querySelectorAll('.menu-nav a, .site-footer__links a').forEach((link) => {
      const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      const isCurrent = href === current || (pageSlug === 'portfolio-detail' && href === 'portfolio.html') || (pageSlug === 'magazine-detail' && href === 'magazine.html');
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  markCurrentNavigation();

  document.querySelectorAll('a[href="mailto:contact@9works.kr"]').forEach((link) => {
    link.href = 'mailto:info@9works.kr';
    if (link.textContent.trim() === 'contact@9works.kr') link.textContent = 'info@9works.kr';
  });

  const menuOffice = document.querySelector('.menu-footer > p');
  if (menuOffice) menuOffice.innerHTML = 'NINEWORKS<br>Design Studio · Incheon, Korea';

  const setMenu = (open) => {
    body.classList.toggle('is-menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));
    if (isPortfolioDetail && open) {
      header?.classList.remove('is-hidden');
      body.classList.remove('is-detail-header-hidden');
    }
  };
  menuButton?.addEventListener('click', () => setMenu(!body.classList.contains('is-menu-open')));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter]');
    const targetSelector = group.dataset.filterTarget;
    const items = document.querySelectorAll(targetSelector);
    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      items.forEach((item) => {
        const categories = (item.dataset.category || '').split(' ');
        item.hidden = filter !== 'all' && !categories.includes(filter);
      });
    }));
  });

  const serviceTabs = document.querySelectorAll('[data-service-tab]');
  const servicePanels = document.querySelectorAll('[data-service-panel]');
  serviceTabs.forEach((tab) => tab.addEventListener('click', () => {
    const target = tab.dataset.serviceTab;
    serviceTabs.forEach((item) => item.classList.toggle('is-active', item === tab));
    servicePanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.servicePanel === target));
  }));

  document.querySelectorAll('[data-language-scope]').forEach((scope) => {
    const buttons = scope.querySelectorAll('[data-language-button]');
    const copies = scope.querySelectorAll('[data-language-copy]');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const language = button.dataset.languageButton;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      copies.forEach((copy) => {
        const active = copy.dataset.languageCopy === language;
        copy.classList.toggle('is-active', active);
        copy.hidden = !active;
      });
    }));
  });

  document.querySelectorAll('.site-footer').forEach((footer) => {
    footer.innerHTML = `
      <div class="site-footer__head">
        <a class="site-footer__brand" href="index.html">NINEWORKS</a>
        <nav class="site-footer__links" aria-label="푸터 메뉴"><a href="about.html">About</a><a href="project.html">Project</a><a href="portfolio.html">Portfolio</a><a href="magazine.html">Magazine</a><a href="solutions.html">Solutions</a><a href="contact.html">Contact</a><a href="privacy.html">Privacy</a></nav>
      </div>
      <div class="site-footer__legal">
        <p><strong>상호/대표자명</strong> · 나인웍스 / 박재영 &nbsp;&nbsp; <strong>사업자등록번호</strong> · 728-35-00866</p>
        <p><strong>주소</strong> · 인천광역시 서구 원당대로 1039, 태경타워 916호 &nbsp;&nbsp; <strong>전화</strong> · 010-5422-5650</p>
        <p>NINEWORKS Office, Room 916, 1039 Wondang-daero, Seo-gu, Incheon, Republic of Korea</p>
        <p><strong>이메일</strong> · <a href="mailto:info@9works.kr">info@9works.kr</a></p>
      </div>
      <div class="site-footer__bottom"><span>© <span data-current-year></span> NINEWORKS · Design Studio. All rights reserved.</span><div class="site-footer__social"><a href="#">Instagram</a><a href="#">Behance</a></div></div>`;
  });
  markCurrentNavigation();
  document.querySelectorAll('[data-current-year]').forEach((item) => { item.textContent = new Date().getFullYear(); });

  const mailForm = document.querySelector('[data-mail-form]');
  mailForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(mailForm);
    const name = data.get('name') || '';
    const company = data.get('company') || '';
    const email = data.get('email') || '';
    const phone = data.get('phone') || '';
    const projectName = data.get('projectName') || '';
    const projectTypes = data.getAll('projectType');
    const services = data.getAll('service');
    const requirements = data.get('requirements') || '';
    const message = data.get('message') || '';
    const reference = data.get('reference') || '';
    const budget = data.get('budget') || '';
    const status = data.get('status') || '';
    const startDate = data.get('startDate') || '';
    const endDate = data.get('endDate') || '';
    if (mailForm.classList.contains('inquiry-form') && projectTypes.length === 0) {
      window.alert('필요한 작업 유형을 한 개 이상 선택해 주세요.');
      mailForm.querySelector('input[name="projectType"]')?.focus();
      return;
    }
    const subject = `[NINEWORKS 프로젝트 문의] ${projectName || company || name}`;
    const bodyText = [
      '[CONTACT INFORMATION]',`담당자: ${name}`,`회사/브랜드: ${company}`,`이메일: ${email}`,`연락처: ${phone}`,'',
      '[PROJECT SCOPE]',`프로젝트명: ${projectName}`,`작업 유형: ${projectTypes.join(', ')}`,
      services.length ? `포함 희망 항목: ${services.join(', ')}` : '',
      `요청사항 / 필요한 결과물: ${requirements}`,`프로젝트 배경 / 현재 상황: ${message}`,`참고 링크: ${reference}`,'',
      '[BUDGET & SCHEDULE]',`예상 예산: ${budget}`,`현재 진행 상태: ${status}`,`작업 시작 희망일: ${startDate}`,`목표 작업 완료일: ${endDate}`
    ].filter(Boolean).join('\n');
    window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  });
})();

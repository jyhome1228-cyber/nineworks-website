(() => {
  const loadStylesheet = (href) => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.appendChild(stylesheet);
  };

  loadStylesheet('assets/css/refine.css?v=20260807-1');
  loadStylesheet('assets/css/alignment.css?v=20260807-1');

  if (document.querySelector('.project-detail')) {
    loadStylesheet('assets/css/project-detail.css?v=20260804-2');
  }

  if (document.body.classList.contains('contact-page')) {
    loadStylesheet('assets/css/contact.css?v=20260804-1');
  }

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-trigger]');
  const menu = document.querySelector('[data-menu-overlay]');
  const isPortfolioDetail = body.classList.contains('portfolio-detail-page');

  document.querySelectorAll('.menu-nav').forEach((nav) => {
    if (!nav.querySelector('a[href="research.html"]')) {
      const researchLink = document.createElement('a');
      researchLink.href = 'research.html';
      researchLink.textContent = 'Research';
      const contactLink = nav.querySelector('a[href="contact.html"]');
      nav.insertBefore(researchLink, contactLink || null);
    }
  });

  document.querySelectorAll('a[href="mailto:contact@9works.kr"]').forEach((link) => {
    link.href = 'mailto:info@9works.kr';
    if (link.textContent.trim() === 'contact@9works.kr') link.textContent = 'info@9works.kr';
  });

  const menuOffice = document.querySelector('.menu-footer > p');
  if (menuOffice) menuOffice.innerHTML = 'NINEWORKS<br>Design Studio · Incheon, Korea';

  const syncDetailHeader = () => {
    if (!isPortfolioDetail || !header) return;
    const shouldHide = window.scrollY > 40 && !body.classList.contains('is-menu-open');
    header.classList.toggle('is-hidden', shouldHide);
    body.classList.toggle('is-detail-header-hidden', shouldHide);
  };

  const setMenu = (open) => {
    body.classList.toggle('is-menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));

    if (isPortfolioDetail) {
      if (open) {
        header?.classList.remove('is-hidden');
        body.classList.remove('is-detail-header-hidden');
      } else {
        syncDetailHeader();
      }
    }
  };

  menuButton?.addEventListener('click', () => {
    setMenu(!body.classList.contains('is-menu-open'));
  });

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 10);
    syncDetailHeader();
  };

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
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter]');
    const targetSelector = group.dataset.filterTarget;
    const items = document.querySelectorAll(targetSelector);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        buttons.forEach((item) => item.classList.toggle('is-active', item === button));
        items.forEach((item) => {
          const categories = (item.dataset.category || '').split(' ');
          item.hidden = filter !== 'all' && !categories.includes(filter);
        });
      });
    });
  });

  const serviceTabs = document.querySelectorAll('[data-service-tab]');
  const servicePanels = document.querySelectorAll('[data-service-panel]');

  serviceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.serviceTab;
      serviceTabs.forEach((item) => item.classList.toggle('is-active', item === tab));
      servicePanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.servicePanel === target));
    });
  });

  document.querySelectorAll('[data-language-scope]').forEach((scope) => {
    const buttons = scope.querySelectorAll('[data-language-button]');
    const copies = scope.querySelectorAll('[data-language-copy]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const language = button.dataset.languageButton;

        buttons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-pressed', String(isActive));
        });

        copies.forEach((copy) => {
          const isActive = copy.dataset.languageCopy === language;
          copy.classList.toggle('is-active', isActive);
          copy.hidden = !isActive;
        });
      });
    });
  });

  document.querySelectorAll('.site-footer').forEach((footer) => {
    footer.innerHTML = `
      <div class="site-footer__head">
        <a class="site-footer__brand" href="index.html">NINEWORKS</a>
        <nav class="site-footer__links" aria-label="푸터 메뉴">
          <a href="about.html">About</a>
          <a href="project.html">Project</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="magazine.html">Magazine</a>
          <a href="research.html">Research</a>
          <a href="contact.html">Contact</a>
          <a href="privacy.html">Privacy</a>
        </nav>
      </div>
      <div class="site-footer__legal">
        <p><strong>상호/대표자명</strong> · 나인웍스 / 박재영 &nbsp;&nbsp; <strong>사업자등록번호</strong> · 728-35-00866</p>
        <p><strong>주소</strong> · 인천광역시 서구 원당대로 1039, 태경타워 915호 &nbsp;&nbsp; <strong>전화</strong> · 032-208-5650 / 010-5422-5650</p>
        <p>NINEWORKS Office, Room 915, 1039, Wondang-daero, Seo-gu, Incheon, Republic of Korea</p>
        <p><strong>이메일</strong> · <a href="mailto:info@9works.kr">info@9works.kr</a></p>
      </div>
      <div class="site-footer__bottom">
        <span>© <span data-current-year></span> NINEWORKS · Design Studio. All rights reserved.</span>
        <div class="site-footer__social"><a href="#">Instagram</a><a href="#">Behance</a></div>
      </div>`;
  });

  document.querySelectorAll('[data-current-year]').forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

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
    const budget = data.get('budget') || '';
    const startDate = data.get('startDate') || data.get('schedule') || '';
    const endDate = data.get('endDate') || '';
    const message = data.get('message') || '';

    if (mailForm.classList.contains('inquiry-form') && projectTypes.length === 0) {
      window.alert('필요한 프로젝트 유형을 한 개 이상 선택해 주세요.');
      mailForm.querySelector('input[name="projectType"]')?.focus();
      return;
    }

    const subject = `[NINEWORKS 프로젝트 문의] ${projectName || company || name}`;
    const bodyText = [
      `담당자: ${name}`,
      `회사/브랜드: ${company}`,
      `이메일: ${email}`,
      `연락처: ${phone}`,
      `프로젝트명: ${projectName}`,
      `프로젝트 유형: ${projectTypes.length ? projectTypes.join(', ') : data.get('projectType') || ''}`,
      `포함 희망 항목: ${services.join(', ')}`,
      `예상 예산: ${budget}`,
      `시작 희망일: ${startDate}`,
      `종료 희망일: ${endDate}`,
      '',
      '프로젝트 내용',
      message
    ].join('\n');

    window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  });
})();

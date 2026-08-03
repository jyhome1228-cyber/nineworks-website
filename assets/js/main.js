(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-trigger]');
  const menu = document.querySelector('[data-menu-overlay]');

  const setMenu = (open) => {
    body.classList.toggle('is-menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));
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
    const projectType = data.get('projectType') || '';
    const budget = data.get('budget') || '';
    const schedule = data.get('schedule') || '';
    const message = data.get('message') || '';

    const subject = `[NINEWORKS 프로젝트 문의] ${company || name}`;
    const bodyText = [
      `담당자: ${name}`,
      `회사/브랜드: ${company}`,
      `이메일: ${email}`,
      `연락처: ${phone}`,
      `프로젝트 유형: ${projectType}`,
      `예상 예산: ${budget}`,
      `희망 일정: ${schedule}`,
      '',
      '프로젝트 내용',
      message
    ].join('\n');

    window.location.href = `mailto:contact@9works.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  });
})();

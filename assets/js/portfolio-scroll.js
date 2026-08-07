(() => {
  const body = document.body;
  if (!body.classList.contains('portfolio-detail-page')) return;

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-trigger]');
  let lastY = Math.max(0, window.scrollY);
  let lastDirection = 'down';
  let ticking = false;

  const setHeaderHidden = (hidden) => {
    if (!header) return;
    if (body.classList.contains('is-menu-open')) hidden = false;
    header.classList.toggle('is-hidden', hidden);
    body.classList.toggle('is-detail-header-hidden', hidden);
  };

  const updateChapterState = () => {
    const sections = [...document.querySelectorAll('.portfolio-scroll-section[id]')];
    const links = [...document.querySelectorAll('.portfolio-detail-index a[href^="#"]')];
    if (!sections.length || !links.length) return;

    const trigger = body.classList.contains('is-detail-header-hidden') ? 86 : 86 + (header?.offsetHeight || 0);
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= trigger) currentId = section.id;
    });

    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const syncOnScroll = () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - lastY;

    if (body.classList.contains('is-menu-open') || currentY <= 18) {
      setHeaderHidden(false);
    } else if (delta > 2) {
      lastDirection = 'down';
      setHeaderHidden(true);
    } else if (delta < -2) {
      lastDirection = 'up';
      setHeaderHidden(false);
    } else if (lastDirection === 'down' && currentY > 50) {
      setHeaderHidden(true);
    }

    lastY = currentY;
    updateChapterState();
    ticking = false;
  };

  const requestSync = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(syncOnScroll);
  };

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync, { passive: true });

  menuButton?.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      if (body.classList.contains('is-menu-open')) setHeaderHidden(false);
      else if (lastDirection === 'down' && window.scrollY > 50) setHeaderHidden(true);
      else setHeaderHidden(false);
    });
  });

  const observer = new MutationObserver(() => {
    if (document.querySelector('.portfolio-detail-index') && document.querySelector('.portfolio-scroll-section')) {
      updateChapterState();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setHeaderHidden(window.scrollY > 50);
  updateChapterState();
})();

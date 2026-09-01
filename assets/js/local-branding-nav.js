(() => {
  const insertLocalBrandingLinks = () => {
    const desktopMenu = document.querySelector('.site-nav-dropdown[aria-label="포트폴리오 카테고리"]');
    if (desktopMenu && !desktopMenu.querySelector('[data-local-branding-nav]')) {
      const brandingLink = Array.from(desktopMenu.querySelectorAll('a')).find((a) => a.textContent.includes('브랜딩 프로젝트'));
      const link = document.createElement('a');
      link.href = 'local-branding.html';
      link.dataset.localBrandingNav = 'true';
      link.innerHTML = '<span>로컬 브랜딩</span><small>로컬</small>';
      if (brandingLink) brandingLink.insertAdjacentElement('afterend', link);
      else desktopMenu.appendChild(link);
    }

    const portfolioToggle = Array.from(document.querySelectorAll('.menu-nav__toggle')).find((button) => button.textContent.includes('PORTFOLIO'));
    const mobileMenu = portfolioToggle?.closest('[data-menu-group]')?.querySelector('.menu-nav__sub');
    if (mobileMenu && !mobileMenu.querySelector('[data-local-branding-nav]')) {
      const brandingLink = Array.from(mobileMenu.querySelectorAll('a')).find((a) => a.textContent.includes('브랜딩 프로젝트'));
      const link = document.createElement('a');
      link.href = 'local-branding.html';
      link.dataset.localBrandingNav = 'true';
      link.textContent = '로컬 브랜딩';
      if (brandingLink) brandingLink.insertAdjacentElement('afterend', link);
      else mobileMenu.appendChild(link);
    }

    const gfPrefix = 'https://jyhome1228-cyber.github.io/growfarmers/portfolio/projects/';
    document.querySelectorAll('.local-branding-page .portfolio-card__link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith(gfPrefix)) return;
      const id = href.slice(gfPrefix.length).split('/').filter(Boolean)[0];
      if (id) link.href = `local-branding-detail.html?project=${encodeURIComponent(id)}`;
    });

    const path = window.location.pathname.split('/').filter(Boolean).pop() || '';
    if (path === 'local-branding.html' || path === 'local-branding-detail.html') {
      const portfolioNav = document.querySelector('.site-primary-nav [data-nav-key="portfolio"]');
      document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((link) => {
        link.classList.toggle('is-current', link === portfolioNav);
        if (link === portfolioNav) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }
  };

  insertLocalBrandingLinks();
  requestAnimationFrame(insertLocalBrandingLinks);
  window.addEventListener('DOMContentLoaded', insertLocalBrandingLinks, { once: true });
})();

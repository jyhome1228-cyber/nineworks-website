(() => {
  if (window.__NW_SITE_FIREBASE_WRAPPER__) return;
  window.__NW_SITE_FIREBASE_WRAPPER__ = true;

  const patchSolutionsMenu = () => {
    let desktopReady = false;
    let mobileReady = false;

    const desktopMenu = document.querySelector('.site-nav-dropdown[aria-label="솔루션 메뉴"]');
    if (desktopMenu) {
      desktopReady = true;

      Array.from(desktopMenu.querySelectorAll('a')).forEach((link) => {
        if (link.textContent.includes('서비스 전체보기')) link.remove();
      });

      if (!desktopMenu.querySelector('a[href="/ai-model.html"]')) {
        const link = document.createElement('a');
        link.href = '/ai-model.html';
        link.innerHTML = '<span>AI 모델 스튜디오</span><small>AI MODEL</small>';
        const signature = desktopMenu.querySelector('a[href="/signature-project.html"]');
        if (signature) signature.insertAdjacentElement('afterend', link);
        else desktopMenu.prepend(link);
      }
    }

    const mobileGroup = Array.from(document.querySelectorAll('.menu-nav__group[data-menu-group]')).find((group) => {
      const toggle = group.querySelector('.menu-nav__toggle');
      return toggle && toggle.textContent.trim().startsWith('SOLUTIONS');
    });
    const mobileMenu = mobileGroup?.querySelector('.menu-nav__sub');
    if (mobileMenu) {
      mobileReady = true;

      Array.from(mobileMenu.querySelectorAll('a')).forEach((link) => {
        if (link.textContent.includes('서비스 전체보기')) link.remove();
      });

      if (!mobileMenu.querySelector('a[href="/ai-model.html"]')) {
        const link = document.createElement('a');
        link.href = '/ai-model.html';
        link.textContent = 'AI 모델 스튜디오';
        const signature = mobileMenu.querySelector('a[href="/signature-project.html"]');
        if (signature) signature.insertAdjacentElement('afterend', link);
        else mobileMenu.prepend(link);
      }
    }

    if (/\/ai-model\.html$|\/ai-model\/?$/i.test(location.pathname)) {
      const solutionsLink = document.querySelector('.site-primary-nav [data-nav-key="solutions"]');
      if (solutionsLink) {
        document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((navLink) => {
          const active = navLink === solutionsLink;
          navLink.classList.toggle('is-current', active);
          if (active) navLink.setAttribute('aria-current', 'page');
          else navLink.removeAttribute('aria-current');
        });
      }
    }

    return desktopReady && mobileReady;
  };

  if (!patchSolutionsMenu()) {
    const observer = new MutationObserver(() => {
      if (patchSolutionsMenu()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 10000);
  }

  if (!document.querySelector('script[data-nw-site-firebase-core]')) {
    const core = document.createElement('script');
    core.src = '/assets/js/site-firebase-core-20260904.js?v=20260904-1';
    core.async = false;
    core.dataset.nwSiteFirebaseCore = 'true';
    document.head.appendChild(core);
  }
})();

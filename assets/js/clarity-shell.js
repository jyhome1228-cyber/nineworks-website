(() => {
  if (window.__NW_MAIN_BOOTSTRAPPED__) return;
  window.__NW_MAIN_BOOTSTRAPPED__ = true;
  const current = Array.from(document.scripts).some((script) => /assets\/js\/main\.js(?:\?|$)/.test(script.src || ''));
  if (!current) {
    const script = document.createElement('script');
    script.src = 'assets/js/main.js?v=20260817-4';
    script.defer = false;
    document.body.appendChild(script);
  }
  if (!Array.from(document.scripts).some((script) => /assets\/js\/seed-local-nav-20260817\.js(?:\?|$)/.test(script.src || ''))) {
    const localNav = document.createElement('script');
    localNav.src = 'assets/js/seed-local-nav-20260817.js?v=20260817-1';
    localNav.defer = false;
    document.body.appendChild(localNav);
  }
})();

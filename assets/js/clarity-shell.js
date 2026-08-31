(() => {
  const freshStyle = document.createElement('link');
  freshStyle.rel = 'stylesheet';
  freshStyle.href = 'assets/css/clarity-20260814.css?v=20260817-6';
  document.head.appendChild(freshStyle);

  if (window.__NW_MAIN_BOOTSTRAPPED__) return;
  window.__NW_MAIN_BOOTSTRAPPED__ = true;
  const current = Array.from(document.scripts).some((script) => /assets\/js\/main\.js(?:\?|$)/.test(script.src || ''));
  if (!current) {
    const script = document.createElement('script');
    script.src = 'assets/js/main.js?v=20260901-4';
    script.defer = false;
    document.body.appendChild(script);
  }
  if (!Array.from(document.scripts).some((script) => /assets\/js\/seed-local-nav-20260817\.js(?:\?|$)/.test(script.src || ''))) {
    const localNav = document.createElement('script');
    localNav.src = 'assets/js/seed-local-nav-20260817.js?v=20260817-3';
    localNav.defer = false;
    document.body.appendChild(localNav);
  }
})();
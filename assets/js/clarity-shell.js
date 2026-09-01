(() => {
  const freshStyle = document.createElement('link');
  freshStyle.rel = 'stylesheet';
  freshStyle.href = 'assets/css/clarity-20260814.css?v=20260817-6';
  document.head.appendChild(freshStyle);

  const hasScript = (pattern) => Array.from(document.scripts).some((script) => pattern.test(script.src || ''));

  // Load the current SEO layer explicitly so About and other clarity-shell pages
  // receive the same keyword architecture, canonical, OG and JSON-LD as the main site.
  if (!hasScript(/assets\/js\/seo\.js(?:\?|$)/)) {
    const seo = document.createElement('script');
    seo.src = 'assets/js/seo.js?v=20260901-2';
    seo.async = false;
    document.head.appendChild(seo);
  }

  if (window.__NW_MAIN_BOOTSTRAPPED__) return;
  window.__NW_MAIN_BOOTSTRAPPED__ = true;
  if (!hasScript(/assets\/js\/main\.js(?:\?|$)/)) {
    const script = document.createElement('script');
    script.src = 'assets/js/main.js?v=20260901-4';
    script.defer = false;
    document.body.appendChild(script);
  }
  if (!hasScript(/assets\/js\/seed-local-nav-20260817\.js(?:\?|$)/)) {
    const localNav = document.createElement('script');
    localNav.src = 'assets/js/seed-local-nav-20260817.js?v=20260817-3';
    localNav.defer = false;
    document.body.appendChild(localNav);
  }
})();
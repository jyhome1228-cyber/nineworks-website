(() => {
  if (window.__NW_MAIN_BOOTSTRAPPED__) return;
  window.__NW_MAIN_BOOTSTRAPPED__ = true;
  const current = Array.from(document.scripts).some((script) => /assets\/js\/main\.js(?:\?|$)/.test(script.src || ''));
  if (current) return;
  const script = document.createElement('script');
  script.src = 'assets/js/main.js?v=20260814-4';
  script.defer = false;
  document.body.appendChild(script);
})();

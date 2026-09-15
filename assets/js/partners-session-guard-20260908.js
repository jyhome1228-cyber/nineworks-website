(() => {
  const STORAGE_KEY = 'nw_partner_workspace_email';
  const SHIN_EMAIL = 's.nninyong@gmail.com';

  const loadContractOverrides = () => {
    if (document.querySelector('script[data-partner-contract-overrides]')) return;
    const script = document.createElement('script');
    script.src = '/assets/js/partners-contract-overrides-20260915-v2.js?v=20260915-2';
    script.defer = true;
    script.dataset.partnerContractOverrides = 'true';
    document.head.appendChild(script);
  };

  const clearSavedLogin = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[NINEWORKS PARTNERS] session storage cleanup skipped', error);
    }
  };

  const resetLoginField = () => {
    const input = document.querySelector('[data-partner-login-form] input[name="email"]');
    if (input) input.value = '';
  };

  // Load internal partner-only contract UI before the login form is submitted.
  loadContractOverrides();

  // Every fresh document load must begin from the login screen.
  clearSavedLogin();

  document.addEventListener('DOMContentLoaded', () => {
    clearSavedLogin();
    resetLoginField();
  });

  // The existing workspace script writes the email after a successful login.
  // Remove that persisted value immediately after the current submit cycle so
  // it can never be reused for automatic login on another visit or tab.
  document.addEventListener('submit', (event) => {
    if (!event.target?.matches?.('[data-partner-login-form]')) return;
    const email = String(event.target.querySelector('input[name="email"]')?.value || '').trim().toLowerCase();
    if (email === SHIN_EMAIL) {
      try { localStorage.setItem(`nw_partner_payment_type_${SHIN_EMAIL}`, 'freelancer'); }
      catch (error) { console.warn('[NINEWORKS PARTNERS] payment type lock skipped', error); }
    }
    window.setTimeout(clearSavedLogin, 0);
  }, true);

  // Clear again whenever the document is left.
  window.addEventListener('pagehide', clearSavedLogin);

  // Browsers may restore the whole authenticated DOM from the back-forward cache.
  // Force a real reload in that case; the fresh load is then reset to login above.
  window.addEventListener('pageshow', (event) => {
    clearSavedLogin();
    if (event.persisted) {
      window.location.reload();
      return;
    }
    resetLoginField();
  });
})();

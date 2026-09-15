(() => {
  const STORAGE_KEY = 'nw_partner_workspace_email';
  const SHIN_EMAIL = 's.nninyong@gmail.com';

  const loadContractOverrides = () => {
    if (document.querySelector('script[data-partner-contract-overrides]')) return;
    const script = document.createElement('script');
    script.src = '/assets/js/partners-contract-overrides-20260915-v2.js?v=20260915-3';
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

  loadContractOverrides();
  clearSavedLogin();

  document.addEventListener('DOMContentLoaded', () => {
    clearSavedLogin();
    resetLoginField();
  });

  document.addEventListener('submit', (event) => {
    if (!event.target?.matches?.('[data-partner-login-form]')) return;
    const email = String(event.target.querySelector('input[name="email"]')?.value || '').trim().toLowerCase();
    if (email === SHIN_EMAIL) {
      try { localStorage.setItem(`nw_partner_payment_type_${SHIN_EMAIL}`, 'freelancer'); }
      catch (error) { console.warn('[NINEWORKS PARTNERS] payment type lock skipped', error); }
    }
    window.setTimeout(clearSavedLogin, 0);
  }, true);

  window.addEventListener('pagehide', clearSavedLogin);

  window.addEventListener('pageshow', (event) => {
    clearSavedLogin();
    if (event.persisted) {
      window.location.reload();
      return;
    }
    resetLoginField();
  });
})();

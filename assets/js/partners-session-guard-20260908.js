(() => {
  const STORAGE_KEY = 'nw_partner_workspace_email';

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

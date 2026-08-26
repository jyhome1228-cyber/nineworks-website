(() => {
  const labels = {
    dashboard: 'Dashboard', inquiry: 'Inquiries', clients: 'Clients', recruits: 'Recruits',
    members: 'Members', partners: 'Partners', visitors: 'Visitors',
    'portfolio-views': 'Portfolio Views', trash: 'Trash'
  };

  const route = (key, updateHash = true) => {
    const panel = document.querySelector(`[data-admin-panel="${key}"]`);
    if (!panel) return false;

    document.querySelectorAll('[data-admin-tab]').forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.adminTab === key);
    });
    document.querySelectorAll('[data-admin-panel]').forEach((node) => {
      node.classList.toggle('is-active', node.dataset.adminPanel === key);
    });

    const title = document.querySelector('[data-admin-title]');
    if (title) title.textContent = labels[key] || key;
    if (updateHash && location.hash !== `#${key}` && history.replaceState) {
      history.replaceState(null, '', `#${key}`);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.dispatchEvent(new CustomEvent('nw-admin-panel', { detail: { panel: key } }));
    return true;
  };

  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-admin-tab]');
    if (!tab) return;
    const nav = tab.closest('.admin-nav');
    if (!nav) return;

    const key = tab.dataset.adminTab;
    if (!key) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    route(key, true);
  }, true);

  window.addEventListener('hashchange', () => {
    const key = location.hash.replace(/^#/, '');
    if (key) route(key, false);
  });

  window.NINEWORKS_ADMIN_ROUTE = route;

  const boot = () => {
    const key = location.hash.replace(/^#/, '') || 'dashboard';
    if (!route(key, false)) route('dashboard', false);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

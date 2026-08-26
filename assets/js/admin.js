(() => {
  const fallbackLabels = {
    dashboard: 'Dashboard',
    inquiry: 'Inquiries',
    clients: 'Clients',
    recruits: 'Recruits',
    members: 'Members',
    partners: 'Partners',
    visitors: 'Visitors',
    'portfolio-views': 'Portfolio Views',
    trash: 'Trash'
  };

  let openPanel = () => {};
  let navigationBooted = false;

  const getPanelTitle = (key) => {
    if (fallbackLabels[key]) return fallbackLabels[key];
    const tab = document.querySelector(`[data-admin-tab="${CSS.escape(key)}"]`);
    if (!tab) return key || 'Dashboard';
    return (tab.textContent || key).replace(/^\s*\d+\s*/, '').trim() || key;
  };

  const hasPanel = (key) => Boolean(document.querySelector(`[data-admin-panel="${CSS.escape(key)}"]`));

  const setupNavigation = () => {
    const title = document.querySelector('[data-admin-title]');
    const date = document.querySelector('[data-admin-date]');
    const nav = document.querySelector('.admin-nav');

    openPanel = (key, options = {}) => {
      const requested = String(key || '').trim();
      const next = hasPanel(requested) ? requested : 'dashboard';
      const tabs = Array.from(document.querySelectorAll('[data-admin-tab]'));
      const panels = Array.from(document.querySelectorAll('[data-admin-panel]'));

      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.adminTab === next));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.adminPanel === next));

      if (title) title.textContent = getPanelTitle(next);
      if (options.updateHash !== false && history.replaceState) {
        history.replaceState(null, '', `#${next}`);
      }
      if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'auto' });
      window.dispatchEvent(new CustomEvent('nw-admin-panel', { detail: { panel: next } }));
    };

    if (nav && nav.dataset.delegatedNavBound !== 'true') {
      nav.dataset.delegatedNavBound = 'true';
      nav.addEventListener('click', (event) => {
        const tab = event.target.closest('[data-admin-tab]');
        if (!tab || !nav.contains(tab)) return;
        event.preventDefault();
        openPanel(tab.dataset.adminTab);
      });
    }

    const inquiryJump = document.querySelector('[data-jump-inquiries]');
    if (inquiryJump && inquiryJump.dataset.adminJumpBound !== 'true') {
      inquiryJump.dataset.adminJumpBound = 'true';
      inquiryJump.addEventListener('click', () => openPanel('inquiry'));
    }

    if (!navigationBooted) {
      navigationBooted = true;
      const initial = location.hash.replace('#', '');
      openPanel(hasPanel(initial) ? initial : 'dashboard', { updateHash: true, scroll: false });

      window.addEventListener('hashchange', () => {
        const key = location.hash.replace('#', '');
        if (hasPanel(key)) openPanel(key, { updateHash: false });
      });
    } else {
      const current = location.hash.replace('#', '');
      if (hasPanel(current)) openPanel(current, { updateHash: false, scroll: false });
    }

    if (date) {
      date.textContent = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
      }).format(new Date());
    }

    window.NINEWORKS_ADMIN_OPEN_PANEL = openPanel;
  };

  // Core navigation starts immediately and uses event delegation, so modules injected later remain clickable.
  setupNavigation();

  import('./admin-clients-20260826.js?v=20260826-2').then(() => {
    setupNavigation();
    return import('./admin-client-phyto-20260826.js?v=20260826-3');
  }).then(setupNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Clients workspace load failed', error);
  });

  import('./admin-firebase.js?v=20260825-trash-sync1').catch((error) => {
    console.error('[NINEWORKS Admin] Firebase bootstrap load failed', error);
    const status = document.querySelector('.admin-status');
    if (status) status.innerHTML = '<i></i> FIREBASE LOAD ERROR';
  });

  import('./admin-partner-assignment-lite.js?v=20260824-6').then(setupNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Partner assignment load failed', error);
  });

  import('./admin-partner-submissions-20260824.js?v=20260824-3').then(setupNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Partner submissions load failed', error);
  });

  import('./admin-recruit-partner-final-20260824.js?v=20260825-trash-sync1').then(setupNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Recruit / approved inquiry sync load failed', error);
  });

  import('./admin-inquiry-crm-20260825.js?v=20260825-1').catch((error) => {
    console.error('[NINEWORKS Admin] Inquiry CRM load failed', error);
  });

  import('./admin-trash-ui-fix-20260825.js?v=20260825-1').then(setupNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Trash UI polish load failed', error);
  });
})();

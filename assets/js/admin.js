(() => {
  const panelLabels = {
    dashboard: 'Dashboard',
    inquiry: 'Inquiries',
    clients: 'Clients',
    recruits: 'Recruits',
    members: 'Members',
    partners: 'Partners',
    proposals: 'Proposals',
    visitors: 'Visitors',
    'portfolio-views': 'Portfolio Views',
    trash: 'Trash'
  };

  const DEFAULT_PANEL = 'dashboard';
  const knownPanels = new Set(Object.keys(panelLabels));
  let navigationBooted = false;
  let pendingPanel = '';
  let panelObserver = null;

  const normalizeKey = (value) => String(value || '').replace(/^#/, '').trim();
  const safeKey = (value) => {
    const key = normalizeKey(value);
    return knownPanels.has(key) ? key : DEFAULT_PANEL;
  };
  const escapeSelector = (value) => window.CSS?.escape
    ? CSS.escape(value)
    : String(value).replace(/["\\]/g, '\\$&');
  const panelNode = (key) => document.querySelector(`[data-admin-panel="${escapeSelector(key)}"]`);
  const hasPanel = (key) => Boolean(panelNode(key));

  const getPanelTitle = (key) => {
    if (panelLabels[key]) return panelLabels[key];
    const tab = document.querySelector(`[data-admin-tab="${escapeSelector(key)}"]`);
    if (!tab) return key || panelLabels[DEFAULT_PANEL];
    return (tab.textContent || key).replace(/^\s*\d+\s*/, '').trim() || key;
  };

  const syncDate = () => {
    const date = document.querySelector('[data-admin-date]');
    if (!date) return;
    date.textContent = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
    }).format(new Date());
  };

  const renderPanel = (key, options = {}) => {
    const requested = safeKey(key);
    if (!hasPanel(requested)) {
      if (options.deferIfMissing !== false) pendingPanel = requested;
      return false;
    }

    document.querySelectorAll('[data-admin-tab]').forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.adminTab === requested);
    });
    document.querySelectorAll('[data-admin-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.adminPanel === requested);
    });

    const title = document.querySelector('[data-admin-title]');
    if (title) title.textContent = getPanelTitle(requested);

    if (options.updateHash !== false && location.hash !== `#${requested}` && history.replaceState) {
      history.replaceState(null, '', `#${requested}`);
    }
    if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'auto' });

    if (pendingPanel === requested) pendingPanel = '';
    window.dispatchEvent(new CustomEvent('nw-admin-panel', { detail: { panel: requested } }));
    return true;
  };

  const showDashboardWithoutChangingURL = () => {
    if (hasPanel(DEFAULT_PANEL)) {
      renderPanel(DEFAULT_PANEL, { updateHash: false, scroll: false, deferIfMissing: false });
    }
  };

  const requestPanel = (key, options = {}) => {
    const requested = safeKey(key);
    if (renderPanel(requested, options)) return true;

    pendingPanel = requested;
    if (options.updateHash !== false && location.hash !== `#${requested}` && history.replaceState) {
      history.replaceState(null, '', `#${requested}`);
    }

    // Async modules inject some panels after first paint. Keep the requested hash intact
    // and show Dashboard only as a temporary visual fallback until that panel exists.
    showDashboardWithoutChangingURL();
    return false;
  };

  const resolvePendingPanel = () => {
    const requested = pendingPanel || safeKey(location.hash);
    if (!requested || !hasPanel(requested)) return false;
    pendingPanel = '';
    return renderPanel(requested, { updateHash: false, scroll: false, deferIfMissing: false });
  };

  const bindNavigation = () => {
    const nav = document.querySelector('.admin-nav');
    if (nav && nav.dataset.delegatedNavBound !== 'true') {
      nav.dataset.delegatedNavBound = 'true';
      nav.addEventListener('click', (event) => {
        const tab = event.target.closest('[data-admin-tab]');
        if (!tab || !nav.contains(tab)) return;
        event.preventDefault();
        requestPanel(tab.dataset.adminTab);
      });
    }

    const inquiryJump = document.querySelector('[data-jump-inquiries]');
    if (inquiryJump && inquiryJump.dataset.adminJumpBound !== 'true') {
      inquiryJump.dataset.adminJumpBound = 'true';
      inquiryJump.addEventListener('click', () => requestPanel('inquiry'));
    }

    window.NINEWORKS_ADMIN_OPEN_PANEL = requestPanel;
    window.NINEWORKS_ADMIN_ROUTE = (key, updateHash = true) => requestPanel(key, { updateHash });
  };

  const bootNavigation = () => {
    bindNavigation();
    syncDate();

    const initialRaw = normalizeKey(location.hash);
    const initial = safeKey(initialRaw || DEFAULT_PANEL);
    if (initialRaw && !knownPanels.has(initialRaw) && history.replaceState) {
      history.replaceState(null, '', `#${DEFAULT_PANEL}`);
    }

    if (!renderPanel(initial, { updateHash: false, scroll: false })) {
      pendingPanel = initial;
      showDashboardWithoutChangingURL();
    }

    if (!navigationBooted) {
      navigationBooted = true;
      window.addEventListener('hashchange', () => {
        const requested = safeKey(location.hash || DEFAULT_PANEL);
        if (!renderPanel(requested, { updateHash: false })) {
          pendingPanel = requested;
          showDashboardWithoutChangingURL();
        }
      });
    }
  };

  const refreshNavigation = () => {
    bindNavigation();
    syncDate();
    resolvePendingPanel();
  };

  const observeDynamicPanels = () => {
    const main = document.querySelector('.admin-main');
    if (!main || panelObserver) return;
    panelObserver = new MutationObserver(() => refreshNavigation());
    panelObserver.observe(main, { childList: true });
  };

  // Navigation must never wait for Firebase or feature modules.
  bootNavigation();
  observeDynamicPanels();

  import('./admin-clients-20260826.js?v=20260826-routerfix1').then(() => {
    refreshNavigation();
    return import('./admin-client-phyto-20260826.js?v=20260826-routerfix1');
  }).then(refreshNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Clients workspace load failed', error);
  });

  import('./admin-proposals-20260902.js?v=20260902-1').then(refreshNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Proposals workspace load failed', error);
  });

  import('./admin-firebase.js?v=20260826-routerfix1').catch((error) => {
    console.error('[NINEWORKS Admin] Firebase bootstrap load failed', error);
    const status = document.querySelector('.admin-status');
    if (status) status.innerHTML = '<i></i> FIREBASE LOAD ERROR';
  });

  import('./admin-partner-assignment-lite.js?v=20260826-routerfix1').then(refreshNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Partner assignment load failed', error);
  });

  import('./admin-partner-submissions-20260824.js?v=20260826-routerfix1').then(refreshNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Partner submissions load failed', error);
  });

  import('./admin-recruit-partner-final-20260824.js?v=20260826-routerfix1').then(refreshNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Recruit / approved inquiry sync load failed', error);
  });

  import('./admin-inquiry-crm-20260825.js?v=20260826-routerfix1').catch((error) => {
    console.error('[NINEWORKS Admin] Inquiry CRM load failed', error);
  });

  import('./admin-trash-ui-fix-20260825.js?v=20260826-routerfix1').then(refreshNavigation).catch((error) => {
    console.error('[NINEWORKS Admin] Trash UI polish load failed', error);
  });
})();

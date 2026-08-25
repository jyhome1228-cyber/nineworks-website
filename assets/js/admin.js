(() => {
  const tabs = Array.from(document.querySelectorAll('[data-admin-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-admin-panel]'));
  const title = document.querySelector('[data-admin-title]');
  const date = document.querySelector('[data-admin-date]');

  const labels = {
    dashboard: 'Dashboard',
    inquiry: 'Inquiries',
    members: 'Members',
    visitors: 'Visitors'
  };

  const openPanel = (key) => {
    const next = labels[key] ? key : 'dashboard';
    tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.adminTab === next));
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.adminPanel === next));
    if (title) title.textContent = labels[next];
    if (history.replaceState) history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.dispatchEvent(new CustomEvent('nw-admin-panel', { detail: { panel: next } }));
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => openPanel(tab.dataset.adminTab));
  });

  document.querySelector('[data-jump-inquiries]')?.addEventListener('click', () => openPanel('inquiry'));

  const initial = location.hash.replace('#', '');
  openPanel(labels[initial] ? initial : 'dashboard');

  if (date) {
    date.textContent = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
    }).format(new Date());
  }

  import('./admin-firebase.js?v=20260824-hotfix1').catch((error) => {
    console.error('[NINEWORKS Admin] Firebase bootstrap load failed', error);
    const status = document.querySelector('.admin-status');
    if (status) status.innerHTML = '<i></i> FIREBASE LOAD ERROR';
  });

  import('./admin-partner-assignment-lite.js?v=20260824-6').catch((error) => {
    console.error('[NINEWORKS Admin] Partner assignment load failed', error);
  });

  import('./admin-partner-submissions-20260824.js?v=20260824-3').catch((error) => {
    console.error('[NINEWORKS Admin] Partner submissions load failed', error);
  });

  import('./admin-recruit-partner-final-20260824.js?v=20260824-1').catch((error) => {
    console.error('[NINEWORKS Admin] Recruit / approved inquiry sync load failed', error);
  });

  import('./admin-inquiry-crm-20260825.js?v=20260825-1').catch((error) => {
    console.error('[NINEWORKS Admin] Inquiry CRM load failed', error);
  });
})();

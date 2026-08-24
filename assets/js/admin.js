(() => {
  const title = document.querySelector('[data-admin-title]');
  const date = document.querySelector('[data-admin-date]');

  const labels = {
    dashboard: 'Dashboard',
    inquiry: 'Inquiries',
    members: 'Members',
    partners: 'Partners',
    visitors: 'Visitors'
  };

  const openPanel = (key) => {
    const next = labels[key] ? key : 'dashboard';
    document.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.adminTab === next));
    document.querySelectorAll('[data-admin-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.adminPanel === next));
    if (title) title.textContent = labels[next];
    if (history.replaceState) history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.dispatchEvent(new CustomEvent('nw-admin-panel', { detail: { panel: next } }));
  };

  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-admin-tab]');
    if (tab) {
      openPanel(tab.dataset.adminTab);
      return;
    }
    if (event.target.closest('[data-jump-inquiries]')) openPanel('inquiry');
  });

  const initial = location.hash.replace('#', '');
  openPanel(labels[initial] ? initial : 'dashboard');

  if (date) {
    date.textContent = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
    }).format(new Date());
  }

  import('./admin-firebase.js?v=20260824-1').catch((error) => {
    console.error('[NINEWORKS Admin] Firebase bootstrap load failed', error);
    const status = document.querySelector('.admin-status');
    if (status) status.innerHTML = '<i></i> FIREBASE LOAD ERROR';
  });
  import('./admin-partners-20260824.js?v=20260824-2').catch((error) => {
    console.error('[NINEWORKS Admin] Partners bootstrap load failed', error);
  });
})();

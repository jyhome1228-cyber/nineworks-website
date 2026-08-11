(() => {
  const tabs = Array.from(document.querySelectorAll('[data-admin-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-admin-panel]'));
  const title = document.querySelector('[data-admin-title]');
  const date = document.querySelector('[data-admin-date]');

  const labels = {
    dashboard: 'Dashboard',
    portfolio: 'Portfolio',
    project: 'Project',
    magazine: 'Magazine',
    inquiry: 'Inquiry',
    client: 'Client',
    settings: 'Settings'
  };

  const openPanel = (key) => {
    tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.adminTab === key));
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.adminPanel === key));
    if (title) title.textContent = labels[key] || 'Admin';
    if (history.replaceState) history.replaceState(null, '', `#${key}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => openPanel(tab.dataset.adminTab)));

  const initial = location.hash.replace('#', '');
  if (labels[initial]) openPanel(initial);

  if (date) {
    const now = new Date();
    date.textContent = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
    }).format(now);
  }

  import('./admin-firebase.js?v=20260811-1').catch((error) => {
    console.error('[NINEWORKS Admin] Firebase bootstrap load failed', error);
    const status = document.querySelector('.admin-status');
    if (status) status.innerHTML = '<i></i> FIREBASE LOAD ERROR';
  });
})();

(() => {
  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
  const STORAGE_KEY = 'nw_partner_workspace_email';
  const PARTNERS = {
    'seodw100@naver.com': { name: '서동원', workspaceId: 'seodw100%40naver.com' },
    's.nninyong@gmail.com': { name: '신민용', workspaceId: 's.nninyong%40gmail.com' },
    'daytuio0329@naver.com': { name: '박상혁', workspaceId: 'daytuio0329%40naver.com' }
  };

  let unsubscribe = null;
  let firebasePromise = null;
  let activeEmail = '';

  const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');

  const getFirebase = () => {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import('/assets/js/firebase-client.js'),
        import(FIRESTORE_SDK)
      ]).then(([client, firestore]) => {
        if (!client.db) throw new Error('Firebase unavailable');
        return { db: client.db, ...firestore };
      });
    }
    return firebasePromise;
  };

  const ensurePanel = () => {
    const page = document.querySelector('[data-partner-page="projects"]');
    if (!page) return null;
    let panel = page.querySelector('[data-approved-inquiry-panel]');
    if (panel) return panel;
    panel = document.createElement('section');
    panel.className = 'partner-panel partner-approved-inquiries';
    panel.dataset.approvedInquiryPanel = 'true';
    panel.innerHTML = `
      <div class="partner-panel__head">
        <div><span>ASSIGNED INQUIRIES</span><strong>배정 문의 내용</strong></div>
        <small>본인에게 배정된 문의만 표시됩니다.</small>
      </div>
      <div class="partner-approved-inquiry-list" data-approved-inquiry-list>
        <div class="partner-empty"><strong>배정된 문의 내용이 없습니다.</strong>어드민에서 프로젝트가 배정되면 이곳에서 확인할 수 있습니다.</div>
      </div>`;
    page.appendChild(panel);
    return panel;
  };

  const render = (workspace = {}) => {
    const panel = ensurePanel();
    const box = panel?.querySelector('[data-approved-inquiry-list]');
    if (!box) return;
    const items = Array.isArray(workspace.approvedInquiryDetails) ? workspace.approvedInquiryDetails : [];
    if (!items.length) {
      box.innerHTML = '<div class="partner-empty"><strong>배정된 문의 내용이 없습니다.</strong>어드민에서 프로젝트가 배정되면 이곳에서 확인할 수 있습니다.</div>';
      return;
    }
    box.innerHTML = items.map((item, index) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      return `<article class="partner-approved-inquiry-card">
        <div class="partner-approved-inquiry-card__head">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(item.company || '')}${item.projectType ? ` · ${escapeHTML(item.projectType)}` : ''}</p></div>
          <em>${escapeHTML(String(item.status || 'new').toUpperCase())}</em>
        </div>
        <div class="partner-approved-inquiry-card__body"><pre>${escapeHTML(item.inquiryText || '등록된 문의 상세 내용이 없습니다.')}</pre></div>
      </article>`;
    }).join('');
  };

  const subscribe = async (email) => {
    const normalized = normalizeEmail(email);
    const partner = PARTNERS[normalized];
    if (!partner || normalized === activeEmail) return;
    activeEmail = normalized;
    unsubscribe?.();
    unsubscribe = null;
    try {
      const ctx = await getFirebase();
      unsubscribe = ctx.onSnapshot(
        ctx.doc(ctx.db, 'partnerWorkspaces', partner.workspaceId),
        (snapshot) => render(snapshot.exists() ? (snapshot.data() || {}) : {}),
        (error) => {
          console.warn('[NINEWORKS PARTNERS] approved inquiry listener skipped', error);
          render({});
        }
      );
    } catch (error) {
      console.warn('[NINEWORKS PARTNERS] approved inquiry connection skipped', error);
    }
  };

  const startFromStorage = () => {
    const email = normalizeEmail(localStorage.getItem(STORAGE_KEY) || '');
    if (PARTNERS[email]) subscribe(email);
  };

  document.querySelector('[data-partner-login-form]')?.addEventListener('submit', () => {
    window.setTimeout(startFromStorage, 180);
  });
  document.querySelectorAll('[data-partner-signout]').forEach((button) => button.addEventListener('click', () => {
    unsubscribe?.();
    unsubscribe = null;
    activeEmail = '';
  }));

  ensurePanel();
  startFromStorage();
})();

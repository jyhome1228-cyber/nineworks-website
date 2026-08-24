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

  const installRefinementStyle = () => {
    if (document.querySelector('style[data-partner-final-refine]')) return;
    const style = document.createElement('style');
    style.dataset.partnerFinalRefine = 'true';
    style.textContent = `
      .partner-stat small strong{display:inline!important;margin:0!important;font:inherit!important;line-height:inherit!important;letter-spacing:inherit!important;color:#777!important;font-weight:400!important}
      .partner-profile-panel{margin-bottom:16px;border:1px solid var(--p-line);background:var(--p-panel)}
      .partner-profile-panel__head{padding:17px 18px;border-bottom:1px solid var(--p-line)}
      .partner-profile-panel__head span{display:block;margin-bottom:4px;color:var(--p-muted);font-size:11px;letter-spacing:.08em}
      .partner-profile-panel__head strong{font-size:15px;font-weight:500}
      .partner-profile-grid{display:grid;grid-template-columns:1fr 1fr}
      .partner-profile-grid>div{padding:17px 18px;min-width:0}
      .partner-profile-grid>div+div{border-left:1px solid var(--p-line)}
      .partner-profile-grid span{display:block;margin-bottom:7px;color:var(--p-muted);font-size:10px}
      .partner-profile-grid strong{display:block;font-size:13px;font-weight:500;overflow-wrap:anywhere}
      .partner-guide-preparing{margin-bottom:18px;padding:18px;border:1px solid var(--p-line);background:#fafaf8}
      .partner-guide-preparing span{display:block;margin-bottom:5px;color:var(--p-muted);font-size:10px;letter-spacing:.08em}
      .partner-guide-preparing strong{display:block;font-size:16px;font-weight:500}
      .partner-guide-preparing p{margin:7px 0 0;color:#777;font-size:12px;line-height:1.65}
      @media(max-width:640px){.partner-profile-grid{grid-template-columns:1fr}.partner-profile-grid>div+div{border-left:0;border-top:1px solid var(--p-line)}}
    `;
    document.head.appendChild(style);
  };

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

  const ensureProfilePanel = (email) => {
    const page = document.querySelector('[data-partner-page="account"]');
    const partner = PARTNERS[email];
    if (!page || !partner) return;
    let panel = page.querySelector('[data-partner-profile-panel]');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'partner-profile-panel';
      panel.dataset.partnerProfilePanel = 'true';
      const firstPanel = page.querySelector('.partner-panel');
      if (firstPanel) page.insertBefore(panel, firstPanel);
      else page.appendChild(panel);
    }
    panel.innerHTML = `
      <div class="partner-profile-panel__head"><span>MY INFORMATION</span><strong>내정보</strong></div>
      <div class="partner-profile-grid">
        <div><span>아이디</span><strong>${escapeHTML(email)}</strong></div>
        <div><span>이름</span><strong>${escapeHTML(partner.name)}</strong></div>
      </div>`;
  };

  const ensureGuidePreparing = () => {
    const page = document.querySelector('[data-partner-page="guide"]');
    if (!page || page.querySelector('[data-guide-preparing]')) return;
    const notice = document.createElement('div');
    notice.className = 'partner-guide-preparing';
    notice.dataset.guidePreparing = 'true';
    notice.innerHTML = '<span>GUIDE STATUS</span><strong>협업 가이드는 현재 준비 중입니다.</strong><p>세부 작업 기준과 전달 방식은 정리되는 대로 이 페이지에 업데이트합니다.</p>';
    const head = page.querySelector('.partner-page-head');
    if (head?.nextSibling) page.insertBefore(notice, head.nextSibling);
    else page.appendChild(notice);
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
    if (!partner) return;
    ensureProfilePanel(normalized);
    ensureGuidePreparing();
    if (normalized === activeEmail) return;
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

  installRefinementStyle();
  ensurePanel();
  ensureGuidePreparing();
  startFromStorage();
})();

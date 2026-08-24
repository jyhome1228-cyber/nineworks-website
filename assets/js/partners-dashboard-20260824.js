(() => {
  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
  const loginView = document.querySelector('[data-partner-login]');
  const appView = document.querySelector('[data-partner-app]');
  const deniedView = document.querySelector('[data-partner-denied]');
  const loginForm = document.querySelector('[data-partner-login-form]');
  const loginNote = document.querySelector('[data-partner-login-note]');
  const STORAGE_KEY = 'nw_partner_workspace_email';

  const FALLBACK_PARTNERS = {
    'seodw100@naver.com': '서동원',
    's.nninyong@gmail.com': '신민용'
  };

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/assets/css/partners-email-login-20260824.css?v=20260824-2';
  document.head.appendChild(style);

  const loginTitle = loginView?.querySelector('.partner-login-card h2');
  const loginCopy = loginView?.querySelector('.partner-login-card > p');
  const passwordField = loginForm?.querySelector('input[name="password"]')?.closest('.partner-field');
  const passwordInput = loginForm?.querySelector('input[name="password"]');
  const submitLabel = loginForm?.querySelector('button[type="submit"] span:first-child');
  const extraLinks = loginView?.querySelector('.partner-login-links');

  if (loginTitle) loginTitle.textContent = 'Partner Login';
  if (loginCopy) loginCopy.textContent = '나인웍스와 협업 중인 이메일을 입력해 주세요.';
  if (passwordField) passwordField.hidden = true;
  if (passwordInput) passwordInput.required = false;
  if (submitLabel) submitLabel.textContent = 'ENTER WORKSPACE';
  if (extraLinks) extraLinks.hidden = true;

  const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
  const partnerKey = (email = '') => encodeURIComponent(normalizeEmail(email));
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  let firebasePromise = null;
  const getFirebase = () => {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import('./firebase-client.js'),
        import(FIRESTORE_SDK)
      ]).then(([client, firestore]) => {
        if (!client.db) throw new Error('Firebase unavailable');
        return { db: client.db, ...firestore };
      });
    }
    return firebasePromise;
  };

  const setView = (name) => {
    if (loginView) loginView.hidden = name !== 'login';
    if (appView) appView.hidden = name !== 'app';
    if (deniedView) deniedView.hidden = true;
  };

  const setNote = (message, state = '') => {
    if (!loginNote) return;
    loginNote.textContent = message;
    loginNote.classList.toggle('is-error', state === 'error');
    loginNote.classList.toggle('is-success', state === 'success');
  };

  const setBusy = (busy) => {
    const button = loginForm?.querySelector('button[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    const label = button.querySelector('span:first-child');
    if (label) label.textContent = busy ? 'CHECKING' : 'ENTER WORKSPACE';
  };

  const initials = (name = '') => {
    const value = String(name || '').trim();
    if (!value) return 'NW';
    if (/^[A-Za-z\s]+$/.test(value)) return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return value.slice(0, 2);
  };

  const fillProfile = (email, name) => {
    const displayName = name || FALLBACK_PARTNERS[email] || 'Nineworks Partner';
    document.querySelectorAll('[data-partner-name]').forEach((node) => { node.textContent = displayName; });
    document.querySelectorAll('[data-partner-role]').forEach((node) => { node.textContent = 'PARTNER'; });
    document.querySelectorAll('[data-partner-email]').forEach((node) => { node.textContent = email || '—'; });
    document.querySelectorAll('[data-partner-initials]').forEach((node) => { node.textContent = initials(displayName); });
  };

  const statusLabel = (status = 'new') => {
    if (status === 'done') return 'DONE';
    if (status === 'open') return 'OPEN';
    return 'NEW';
  };

  const renderWorkspace = (workspace = {}) => {
    const assignments = Array.isArray(workspace.assignments) ? workspace.assignments : [];
    const stats = document.querySelectorAll('.partner-stat strong');
    if (stats[0]) stats[0].textContent = String(assignments.filter((item) => item.status !== 'done').length);
    if (stats[1]) stats[1].textContent = String(assignments.filter((item) => item.status === 'new').length);
    if (stats[2]) stats[2].textContent = String(assignments.filter((item) => item.status === 'open').length);
    if (stats[3]) stats[3].textContent = '0';

    const list = document.querySelector('#projects .project-list');
    if (!list) return;
    if (!assignments.length) {
      list.innerHTML = '<div class="project-row"><span class="project-row__num">—</span><strong>아직 배정된 프로젝트가 없습니다.</strong><span>프로젝트가 연결되면 이곳에 표시됩니다.</span><span class="project-status">STANDBY</span><span class="project-open">—</span></div>';
      return;
    }

    list.innerHTML = assignments.map((item, index) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      const meta = [item.company, item.service || item.projectType].filter(Boolean).join(' · ');
      return `<div class="project-row" data-workspace-project="${escapeHTML(item.id || '')}">
        <span class="project-row__num">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(meta || 'NINEWORKS COLLABORATION')}</span>
        <span class="project-status${item.status === 'open' ? ' is-active' : ''}">${statusLabel(item.status)}</span>
        <span class="project-open">VIEW</span>
      </div>
      ${item.summary ? `<div class="partner-project-brief"><strong>PROJECT BRIEF</strong><p>${escapeHTML(item.summary)}</p></div>` : ''}`;
    }).join('');
  };

  const loadPartner = async (email) => {
    const normalized = normalizeEmail(email);
    if (!isEmail(normalized)) throw new Error('invalid-email');
    let name = FALLBACK_PARTNERS[normalized] || '';
    let status = name ? 'active' : '';
    let workspace = { assignments: [] };

    try {
      const ctx = await getFirebase();
      const partnerSnap = await ctx.getDoc(ctx.doc(ctx.db, 'partners', partnerKey(normalized)));
      if (partnerSnap.exists()) {
        const data = partnerSnap.data();
        name = data.name || name;
        status = data.status || 'active';
      }
      if (!name || status === 'inactive') throw new Error('not-allowed');
      const workspaceSnap = await ctx.getDoc(ctx.doc(ctx.db, 'partnerWorkspaces', partnerKey(normalized)));
      if (workspaceSnap.exists()) workspace = workspaceSnap.data() || workspace;
    } catch (error) {
      if (!name) throw error;
      console.warn('[NINEWORKS PARTNERS] Firebase workspace read skipped', error);
    }

    if (!name || status === 'inactive') throw new Error('not-allowed');
    return { email: normalized, name, workspace };
  };

  const enterWorkspace = async (email) => {
    const normalized = normalizeEmail(email);
    if (!isEmail(normalized)) {
      setNote('이메일 형식을 확인해 주세요.', 'error');
      loginForm?.querySelector('input[name="email"]')?.focus();
      return false;
    }
    setBusy(true);
    setNote('파트너 정보를 확인하고 있습니다.');
    try {
      const result = await loadPartner(normalized);
      localStorage.setItem(STORAGE_KEY, normalized);
      fillProfile(result.email, result.name);
      renderWorkspace(result.workspace);
      setNote('워크스페이스로 이동합니다.', 'success');
      setView('app');
      window.scrollTo(0, 0);
      return true;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      setNote('등록된 나인웍스 파트너 이메일을 확인해 주세요.', 'error');
      return false;
    } finally {
      setBusy(false);
    }
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    enterWorkspace(String(new FormData(loginForm).get('email') || ''));
  });

  document.querySelectorAll('[data-partner-signout]').forEach((button) => button.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    loginForm?.reset();
    setNote('');
    setView('login');
    window.scrollTo(0, 0);
  }));

  const briefStyle = document.createElement('style');
  briefStyle.textContent = '.partner-project-brief{padding:14px 18px 18px 76px;border-bottom:1px solid var(--p-line);background:#fafaf8}.partner-project-brief strong{display:block;margin-bottom:6px;font-size:8px;letter-spacing:.08em;color:#888}.partner-project-brief p{margin:0;max-width:760px;color:#666;font-size:10px;line-height:1.65;white-space:pre-wrap}@media(max-width:760px){.partner-project-brief{padding:12px 13px 16px 43px}}';
  document.head.appendChild(briefStyle);

  const savedEmail = localStorage.getItem(STORAGE_KEY) || '';
  setView('login');
  if (savedEmail && isEmail(savedEmail)) enterWorkspace(savedEmail);
})();

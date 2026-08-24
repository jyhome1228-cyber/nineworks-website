(() => {
  const loginView = document.querySelector('[data-partner-login]');
  const appView = document.querySelector('[data-partner-app]');
  const deniedView = document.querySelector('[data-partner-denied]');
  const loginForm = document.querySelector('[data-partner-login-form]');
  const loginNote = document.querySelector('[data-partner-login-note]');
  const STORAGE_KEY = 'nw_partner_workspace_email';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/assets/css/partners-email-login-20260824.css?v=20260824-1';
  document.head.appendChild(style);

  const loginTitle = loginView?.querySelector('.partner-login-card h2');
  const loginCopy = loginView?.querySelector('.partner-login-card > p');
  const passwordField = loginForm?.querySelector('input[name="password"]')?.closest('.partner-field');
  const submitLabel = loginForm?.querySelector('button[type="submit"] span:first-child');

  if (loginTitle) loginTitle.textContent = 'Partner Login';
  if (loginCopy) loginCopy.textContent = '나인웍스와 협업 중인 이메일을 입력해 주세요.';
  if (passwordField) passwordField.hidden = true;
  const passwordInput = loginForm?.querySelector('input[name="password"]');
  if (passwordInput) passwordInput.required = false;
  if (submitLabel) submitLabel.textContent = 'ENTER WORKSPACE';

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
    if (label) label.textContent = busy ? 'ENTERING' : 'ENTER WORKSPACE';
  };

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const displayNameFromEmail = (email) => {
    const local = String(email || '').split('@')[0] || 'Partner';
    return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const initials = (name = '') => {
    const value = String(name || '').trim();
    if (!value) return 'NW';
    if (/^[A-Za-z\s]+$/.test(value)) return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return value.slice(0, 2);
  };

  const fillProfile = (email) => {
    const name = displayNameFromEmail(email);
    document.querySelectorAll('[data-partner-name]').forEach((node) => { node.textContent = name; });
    document.querySelectorAll('[data-partner-role]').forEach((node) => { node.textContent = 'PARTNER'; });
    document.querySelectorAll('[data-partner-email]').forEach((node) => { node.textContent = email || '—'; });
    document.querySelectorAll('[data-partner-initials]').forEach((node) => { node.textContent = initials(name); });
  };

  const enterWorkspace = (email) => {
    const normalized = String(email || '').trim().toLowerCase();
    if (!isEmail(normalized)) {
      setNote('이메일 형식을 확인해 주세요.', 'error');
      loginForm?.querySelector('input[name="email"]')?.focus();
      return false;
    }
    localStorage.setItem(STORAGE_KEY, normalized);
    fillProfile(normalized);
    setNote('워크스페이스로 이동합니다.', 'success');
    setView('app');
    window.scrollTo(0, 0);
    return true;
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    const email = String(new FormData(loginForm).get('email') || '').trim();
    setBusy(true);
    window.setTimeout(() => {
      enterWorkspace(email);
      setBusy(false);
    }, 180);
  });

  document.querySelectorAll('[data-partner-signout]').forEach((button) => button.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    loginForm?.reset();
    setNote('');
    setView('login');
    window.scrollTo(0, 0);
  }));

  const savedEmail = localStorage.getItem(STORAGE_KEY) || '';
  if (savedEmail && isEmail(savedEmail)) {
    fillProfile(savedEmail);
    setView('app');
  } else {
    setView('login');
  }
})();

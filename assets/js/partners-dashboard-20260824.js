(() => {
  const AUTH_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

  const loginView = document.querySelector('[data-partner-login]');
  const appView = document.querySelector('[data-partner-app]');
  const deniedView = document.querySelector('[data-partner-denied]');
  const loginForm = document.querySelector('[data-partner-login-form]');
  const loginNote = document.querySelector('[data-partner-login-note]');
  const deniedTitle = document.querySelector('[data-denied-title]');
  const deniedCopy = document.querySelector('[data-denied-copy]');

  const setView = (name) => {
    if (loginView) loginView.hidden = name !== 'login';
    if (appView) appView.hidden = name !== 'app';
    if (deniedView) deniedView.hidden = name !== 'denied';
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
    button.querySelector('span:first-child').textContent = busy ? 'CHECKING ACCESS' : 'ENTER WORKSPACE';
  };

  const humanError = (error) => {
    const code = String(error?.code || '');
    const map = {
      'auth/invalid-email': '이메일 형식을 확인해 주세요.',
      'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'auth/user-not-found': '등록된 계정을 찾을 수 없습니다.',
      'auth/wrong-password': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'auth/too-many-requests': '로그인 시도가 많습니다. 잠시 후 다시 시도해 주세요.',
      'auth/network-request-failed': '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
    };
    return map[code] || '로그인 중 오류가 발생했습니다.';
  };

  const initials = (name = '') => {
    const value = String(name || '').trim();
    if (!value) return 'NW';
    if (/^[A-Za-z\s]+$/.test(value)) return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return value.slice(0, 2);
  };

  const fillProfile = (user, profile = {}) => {
    const name = profile.name || user.displayName || 'Nineworks Partner';
    const role = profile.role === 'creator' ? 'CREATOR' : 'PARTNER';
    document.querySelectorAll('[data-partner-name]').forEach((node) => { node.textContent = name; });
    document.querySelectorAll('[data-partner-role]').forEach((node) => { node.textContent = role; });
    document.querySelectorAll('[data-partner-email]').forEach((node) => { node.textContent = user.email || '—'; });
    document.querySelectorAll('[data-partner-initials]').forEach((node) => { node.textContent = initials(name); });
  };

  const accessFor = (profile = {}) => {
    const role = String(profile.role || '');
    const status = String(profile.status || '');
    if (role === 'creator' && ['active', 'approved'].includes(status || 'active')) return 'allowed';
    if (role === 'partner' && status === 'approved') return 'allowed';
    if (role === 'partner' && status === 'pending') return 'pending';
    return 'denied';
  };

  const boot = async () => {
    try {
      const [client, authSdk, firestore] = await Promise.all([
        import('./firebase-client.js'),
        import(AUTH_SDK),
        import(FIRESTORE_SDK)
      ]);
      if (!client.auth || !client.db) throw new Error('Firebase unavailable');

      const ctx = { auth: client.auth, db: client.db, ...authSdk, ...firestore };

      loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!loginForm.reportValidity()) return;
        const data = new FormData(loginForm);
        setBusy(true);
        setNote('파트너 계정을 확인하고 있습니다.');
        try {
          await ctx.signInWithEmailAndPassword(
            ctx.auth,
            String(data.get('email') || '').trim(),
            String(data.get('password') || '')
          );
          setNote('로그인되었습니다.', 'success');
        } catch (error) {
          setBusy(false);
          setNote(humanError(error), 'error');
        }
      });

      document.querySelector('[data-reset-password]')?.addEventListener('click', async () => {
        const email = String(loginForm?.querySelector('input[name="email"]')?.value || '').trim();
        if (!email) {
          setNote('비밀번호 재설정 이메일을 먼저 입력해 주세요.', 'error');
          return;
        }
        try {
          await ctx.sendPasswordResetEmail(ctx.auth, email);
          setNote('비밀번호 재설정 메일을 보냈습니다.', 'success');
        } catch (error) {
          setNote(humanError(error), 'error');
        }
      });

      document.querySelectorAll('[data-partner-signout]').forEach((button) => button.addEventListener('click', async () => {
        await ctx.signOut(ctx.auth);
        location.reload();
      }));

      ctx.onAuthStateChanged(ctx.auth, async (user) => {
        setBusy(false);
        if (!user) {
          setView('login');
          return;
        }

        let profile = null;
        try {
          const snap = await ctx.getDoc(ctx.doc(ctx.db, 'members', user.uid));
          if (snap.exists()) profile = snap.data();
        } catch (error) {
          console.warn('[NINEWORKS PARTNERS] profile read failed', error);
        }

        const access = accessFor(profile || {});
        if (access === 'allowed') {
          fillProfile(user, profile || {});
          setView('app');
          return;
        }

        if (deniedTitle && deniedCopy) {
          if (access === 'pending') {
            deniedTitle.textContent = 'Partner approval in progress.';
            deniedCopy.textContent = '파트너 등록 요청이 접수되어 있습니다. 나인웍스 승인 후 워크스페이스 접근 권한이 활성화됩니다.';
          } else {
            deniedTitle.textContent = 'Partner access required.';
            deniedCopy.textContent = '이 페이지는 나인웍스가 승인한 파트너 디자이너와 협업자 전용 공간입니다. 접근이 필요하다면 담당자에게 권한을 요청해 주세요.';
          }
        }
        setView('denied');
      });
    } catch (error) {
      console.error('[NINEWORKS PARTNERS] initialization failed', error);
      setView('login');
      setNote('워크스페이스 연결을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.', 'error');
    }
  };

  setView('login');
  boot();
})();

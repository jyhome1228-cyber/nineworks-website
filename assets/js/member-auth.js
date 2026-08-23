(() => {
  if (window.__NW_MEMBER_AUTH__) return;
  window.__NW_MEMBER_AUTH__ = true;

  const AUTH_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
  let contextPromise = null;

  const addMembersStyle = () => {
    if (document.querySelector('link[data-nw-members-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/members-20260823.css?v=20260823-1';
    link.dataset.nwMembersStyle = 'true';
    document.head.appendChild(link);
  };
  addMembersStyle();

  const getContext = () => {
    if (!contextPromise) {
      contextPromise = Promise.all([
        import('./firebase-client.js'),
        import(AUTH_SDK),
        import(FIRESTORE_SDK)
      ]).then(([client, authSdk, firestore]) => {
        if (!client.firebaseConfigReady || !client.auth || !client.db) throw new Error('Firebase configuration is not ready.');
        return { auth: client.auth, db: client.db, ...authSdk, ...firestore };
      });
    }
    return contextPromise;
  };

  const roleLabels = { client: 'CLIENT', creator: 'CREATOR', partner: 'PARTNER' };
  const statusLabels = { active: 'ACTIVE MEMBER', pending: 'PARTNER REVIEW', approved: 'APPROVED PARTNER' };
  const safeReturn = () => {
    const value = new URLSearchParams(location.search).get('return') || '';
    if (!value || /^https?:/i.test(value) || value.startsWith('//')) return 'my.html';
    return value;
  };

  const humanError = (error) => {
    const code = String(error?.code || '');
    const map = {
      'auth/email-already-in-use': '이미 가입된 이메일입니다. LOGIN을 이용해 주세요.',
      'auth/invalid-email': '이메일 형식을 확인해 주세요.',
      'auth/weak-password': '비밀번호는 6자 이상으로 설정해 주세요.',
      'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'auth/user-not-found': '가입된 계정을 찾을 수 없습니다.',
      'auth/wrong-password': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'auth/too-many-requests': '로그인 시도가 많습니다. 잠시 후 다시 시도해 주세요.',
      'auth/operation-not-allowed': 'Firebase Authentication에서 이메일/비밀번호 로그인을 먼저 활성화해 주세요.',
      'auth/network-request-failed': '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
    };
    return map[code] || '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  };

  const ensureNavigation = () => {
    const desktopNav = document.querySelector('.site-primary-nav');
    if (desktopNav && !desktopNav.querySelector('[data-nav-key="resources"]')) {
      const link = document.createElement('a');
      link.href = 'resources.html';
      link.dataset.navKey = 'resources';
      link.textContent = 'RESOURCES';
      const magazine = desktopNav.querySelector('[data-nav-key="magazine"]');
      if (magazine) magazine.insertAdjacentElement('afterend', link); else desktopNav.appendChild(link);
    }

    const mobileNav = document.querySelector('.menu-nav');
    if (mobileNav && !mobileNav.querySelector('[data-member-mobile-resources]')) {
      const resources = document.createElement('a');
      resources.className = 'menu-nav__main';
      resources.href = 'resources.html';
      resources.textContent = 'RESOURCES';
      resources.dataset.memberMobileResources = 'true';
      const magazine = Array.from(mobileNav.querySelectorAll('a')).find((item) => item.textContent.trim() === 'MAGAZINE');
      if (magazine) magazine.insertAdjacentElement('afterend', resources); else mobileNav.appendChild(resources);
    }

    const headerAction = document.querySelector('.site-header__action');
    if (headerAction) headerAction.dataset.memberAction = 'true';

    document.querySelectorAll('.site-footer__links').forEach((footerNav) => {
      if (!footerNav.querySelector('[data-member-footer-resources]')) {
        const resources = document.createElement('a');
        resources.href = 'resources.html';
        resources.textContent = 'Resources';
        resources.dataset.memberFooterResources = 'true';
        const privacy = footerNav.querySelector('a[href="privacy.html"]');
        if (privacy) footerNav.insertBefore(resources, privacy); else footerNav.appendChild(resources);
      }
    });

    if (document.body.classList.contains('resources-page')) {
      document.querySelectorAll('[data-nav-key="resources"]').forEach((link) => {
        link.classList.add('is-current');
        link.setAttribute('aria-current', 'page');
      });
    }
  };

  const syncMemberAction = (user) => {
    ensureNavigation();
    const action = document.querySelector('.site-header__action');
    if (!action) return;
    action.dataset.memberAction = 'true';
    action.href = user ? 'my.html' : 'join.html';
    action.innerHTML = user ? 'MY NINEWORKS <span>↗</span>' : 'JOIN NINEWORKS <span>↗</span>';
  };

  const setNote = (element, message, state = '') => {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', state === 'error');
    element.classList.toggle('is-success', state === 'success');
  };

  const setBusy = (form, busy) => {
    const button = form?.querySelector('button[type="submit"]');
    if (!button) return;
    if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
    button.disabled = busy;
    button.innerHTML = busy ? '<span>PROCESSING</span><span>…</span>' : button.dataset.originalHtml;
  };

  const setupJoin = (ctx, user) => {
    const panel = document.querySelector('[data-auth-panel]');
    if (!panel || panel.dataset.memberBound === 'true') return;
    panel.dataset.memberBound = 'true';

    if (user) {
      panel.innerHTML = `<div class="member-signed-in"><p class="eyebrow">SIGNED IN</p><h2>Welcome back.</h2><p>이미 Nineworks Members 계정으로 로그인되어 있습니다.</p><div class="member-lock__actions"><a class="member-button member-button--inline" href="my.html"><span>MY NINEWORKS</span><span>↗</span></a></div></div>`;
      return;
    }

    const tabs = panel.querySelectorAll('[data-auth-tab]');
    const views = panel.querySelectorAll('[data-auth-view]');
    const selectTab = (name) => {
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.authTab === name));
      views.forEach((view) => { view.hidden = view.dataset.authView !== name; });
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab.dataset.authTab)));
    if (new URLSearchParams(location.search).get('mode') === 'login') selectTab('login');

    const signupForm = panel.querySelector('[data-signup-form]');
    const creatorFields = panel.querySelector('[data-creator-fields]');
    const partnerFields = panel.querySelector('[data-partner-fields]');
    const updateRoleFields = () => {
      const role = signupForm?.querySelector('input[name="role"]:checked')?.value || 'client';
      if (creatorFields) creatorFields.hidden = role !== 'creator';
      if (partnerFields) partnerFields.hidden = role !== 'partner';
    };
    signupForm?.querySelectorAll('input[name="role"]').forEach((input) => input.addEventListener('change', updateRoleFields));
    updateRoleFields();

    signupForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!signupForm.reportValidity()) return;
      const note = signupForm.querySelector('[data-signup-note]');
      const data = new FormData(signupForm);
      const password = String(data.get('password') || '');
      const passwordConfirm = String(data.get('passwordConfirm') || '');
      if (password !== passwordConfirm) {
        setNote(note, '비밀번호 확인이 일치하지 않습니다.', 'error');
        return;
      }
      const role = String(data.get('role') || 'client');
      const email = String(data.get('email') || '').trim();
      const name = String(data.get('name') || '').trim();
      setBusy(signupForm, true);
      setNote(note, '계정을 만들고 있습니다.');
      try {
        const credential = await ctx.createUserWithEmailAndPassword(ctx.auth, email, password);
        await ctx.updateProfile(credential.user, { displayName: name });
        const now = ctx.serverTimestamp();
        await ctx.setDoc(ctx.doc(ctx.db, 'members', credential.user.uid), {
          uid: credential.user.uid,
          email: credential.user.email || email,
          name,
          role,
          creatorType: role === 'creator' ? String(data.get('creatorType') || 'other') : '',
          organization: String(data.get('organization') || '').trim(),
          phone: String(data.get('phone') || '').trim(),
          website: role === 'partner' ? String(data.get('website') || '').trim() : '',
          partnerCategory: role === 'partner' ? String(data.get('partnerCategory') || 'other') : '',
          status: role === 'partner' ? 'pending' : 'active',
          createdAt: now,
          updatedAt: now
        });
        setNote(note, '가입이 완료되었습니다.', 'success');
        location.href = safeReturn();
      } catch (error) {
        console.error('[NINEWORKS Members] signup failed', error);
        setBusy(signupForm, false);
        setNote(note, humanError(error), 'error');
      }
    });

    const loginForm = panel.querySelector('[data-login-form]');
    loginForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!loginForm.reportValidity()) return;
      const note = loginForm.querySelector('[data-login-note]');
      const data = new FormData(loginForm);
      setBusy(loginForm, true);
      setNote(note, '로그인 중입니다.');
      try {
        await ctx.signInWithEmailAndPassword(ctx.auth, String(data.get('email') || '').trim(), String(data.get('password') || ''));
        setNote(note, '로그인되었습니다.', 'success');
        location.href = safeReturn();
      } catch (error) {
        console.error('[NINEWORKS Members] login failed', error);
        setBusy(loginForm, false);
        setNote(note, humanError(error), 'error');
      }
    });

    panel.querySelector('[data-reset-password]')?.addEventListener('click', async () => {
      const emailInput = panel.querySelector('[data-login-form] input[name="email"]');
      const note = panel.querySelector('[data-login-note]');
      const email = String(emailInput?.value || '').trim();
      if (!email) {
        setNote(note, '비밀번호를 재설정할 이메일을 먼저 입력해 주세요.', 'error');
        emailInput?.focus();
        return;
      }
      try {
        await ctx.sendPasswordResetEmail(ctx.auth, email);
        setNote(note, '비밀번호 재설정 메일을 보냈습니다.', 'success');
      } catch (error) {
        setNote(note, humanError(error), 'error');
      }
    });
  };

  const setupResources = (user) => {
    const locked = document.querySelector('[data-resources-locked]');
    const content = document.querySelector('[data-resources-content]');
    if (!locked || !content) return;
    locked.hidden = Boolean(user);
    content.hidden = !user;
  };

  const setupMy = async (ctx, user) => {
    const locked = document.querySelector('[data-my-locked]');
    const authenticated = document.querySelector('[data-my-authenticated]');
    if (!locked || !authenticated) return;
    locked.hidden = Boolean(user);
    authenticated.hidden = !user;
    if (!user) return;

    let profile = null;
    try {
      const snap = await ctx.getDoc(ctx.doc(ctx.db, 'members', user.uid));
      if (snap.exists()) profile = snap.data();
    } catch (error) {
      console.warn('[NINEWORKS Members] profile read skipped', error);
    }
    const name = profile?.name || user.displayName || 'Nineworks Member';
    const role = profile?.role || 'member';
    const status = profile?.status || 'active';
    const setText = (selector, value) => {
      const node = authenticated.querySelector(selector);
      if (node) node.textContent = value;
    };
    setText('[data-member-name]', name);
    setText('[data-member-email]', user.email || '—');
    setText('[data-member-role]', roleLabels[role] || role.toUpperCase());
    setText('[data-member-status]', statusLabels[status] || status.toUpperCase());
    setText('[data-member-organization]', profile?.organization || '—');
    const partnerMessage = authenticated.querySelector('[data-partner-message]');
    if (partnerMessage) partnerMessage.hidden = !(role === 'partner' && status === 'pending');

    const logout = authenticated.querySelector('[data-sign-out]');
    if (logout && logout.dataset.bound !== 'true') {
      logout.dataset.bound = 'true';
      logout.addEventListener('click', async () => {
        await ctx.signOut(ctx.auth);
        location.href = 'join.html?mode=login';
      });
    }
  };

  const boot = async () => {
    ensureNavigation();
    try {
      const ctx = await getContext();
      ctx.onAuthStateChanged(ctx.auth, (user) => {
        syncMemberAction(user);
        if (document.body.classList.contains('join-page')) setupJoin(ctx, user);
        if (document.body.classList.contains('resources-page')) setupResources(user);
        if (document.body.classList.contains('my-page')) setupMy(ctx, user);
      });
    } catch (error) {
      console.error('[NINEWORKS Members] initialization failed', error);
      syncMemberAction(null);
      document.querySelectorAll('[data-signup-note],[data-login-note]').forEach((note) => setNote(note, '멤버십 연결을 확인해 주세요.', 'error'));
    }
  };

  boot();
})();
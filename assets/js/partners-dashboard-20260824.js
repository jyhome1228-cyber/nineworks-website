(() => {
  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
  const loginView = document.querySelector('[data-partner-login]');
  const appView = document.querySelector('[data-partner-app]');
  const loginForm = document.querySelector('[data-partner-login-form]');
  const loginNote = document.querySelector('[data-partner-login-note]');
  const STORAGE_KEY = 'nw_partner_workspace_email';

  const PARTNERS = {
    'seodw100@naver.com': { name: '서동원', role: 'DESIGN PARTNER', workspaceId: 'seodw100%40naver.com' },
    's.nninyong@gmail.com': { name: '신민용', role: 'DESIGN PARTNER', workspaceId: 's.nninyong%40gmail.com' }
  };

  let firebasePromise = null;
  let unsubscribeWorkspace = null;

  const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  const money = (value = 0) => `${Math.round(Number(value || 0)).toLocaleString('ko-KR')}원`;
  const normalizeStage = (value = '') => value === 'active' ? 'active' : 'preliminary';
  const normalizeAmount = (value = 0) => Math.max(0, Number(value || 0));
  const safeUrl = (value = '') => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
      const url = new URL(raw);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
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

  const setView = (name) => {
    if (loginView) loginView.hidden = name !== 'login';
    if (appView) appView.hidden = name !== 'app';
  };

  const setNote = (message = '', state = '') => {
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

  const initials = (name = '') => {
    const value = String(name || '').trim();
    if (!value) return 'NW';
    if (/^[A-Za-z\s]+$/.test(value)) return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return value.slice(0, 2);
  };

  const greetingCopy = (name) => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `안녕하세요 ${name}님,<br><span class="greeting-sub">좋은 아침 보내고 계신가요?</span>`;
    if (hour >= 12 && hour < 18) return `안녕하세요 ${name}님,<br><span class="greeting-sub">좋은 오후 보내고 계신가요?</span>`;
    if (hour >= 18 && hour < 24) return `안녕하세요 ${name}님,<br><span class="greeting-sub">좋은 저녁이에요. 오늘도 좋은 작업 이어가세요.</span>`;
    return `안녕하세요 ${name}님,<br><span class="greeting-sub">늦은 시간까지 함께해 주셔서 감사합니다.</span>`;
  };

  const fillProfile = (email, partner) => {
    document.querySelectorAll('[data-partner-name]').forEach((node) => { node.textContent = partner.name; });
    document.querySelectorAll('[data-partner-role]').forEach((node) => { node.textContent = partner.role || 'DESIGN PARTNER'; });
    document.querySelectorAll('[data-partner-email]').forEach((node) => { node.textContent = email; });
    document.querySelectorAll('[data-partner-initials]').forEach((node) => { node.textContent = initials(partner.name); });
    const title = document.querySelector('[data-partner-dashboard-title]');
    if (title) title.textContent = `${partner.name} · Partner Dashboard`;
    const welcome = document.querySelector('[data-partner-welcome]');
    if (welcome) welcome.textContent = `${partner.name}님, 반갑습니다.`;
    const greeting = document.querySelector('[data-partner-greeting]');
    if (greeting) greeting.innerHTML = greetingCopy(escapeHTML(partner.name));
  };

  const statusLabel = (status = 'new') => {
    if (status === 'done') return 'DONE';
    if (status === 'open') return 'OPEN';
    return 'NEW';
  };

  const stageLabel = (stage) => normalizeStage(stage) === 'active' ? '진행' : '예비';

  const normalizeProjects = (workspace = {}) => {
    const assignments = Array.isArray(workspace.assignments) ? workspace.assignments : [];
    return assignments.map((item) => ({
      id: String(item.id || ''),
      company: String(item.company || ''),
      projectName: String(item.projectName || ''),
      type: String(item.projectType || item.service || ''),
      status: ['new', 'open', 'done'].includes(item.status) ? item.status : 'new',
      summary: String(item.summary || ''),
      feeAmount: normalizeAmount(item.feeAmount),
      projectStage: normalizeStage(item.projectStage),
      proposalUrl: safeUrl(item.proposalUrl)
    }));
  };

  const renderStats = (projects) => {
    const preliminaryFee = projects.filter((item) => item.projectStage === 'preliminary').reduce((sum, item) => sum + item.feeAmount, 0);
    const activeFee = projects.filter((item) => item.projectStage === 'active' && item.status !== 'done').reduce((sum, item) => sum + item.feeAmount, 0);
    const values = {
      projects: projects.filter((item) => item.status !== 'done').length,
      preliminaryFee: money(preliminaryFee),
      activeFee: money(activeFee),
      proposals: projects.filter((item) => item.proposalUrl).length
    };
    Object.entries(values).forEach(([key, value]) => {
      const node = document.querySelector(`[data-partner-stat="${key}"]`);
      if (node) node.textContent = String(value);
    });
  };

  const renderProjects = (projects) => {
    const list = document.querySelector('[data-partner-project-list]');
    if (!list) return;
    if (!projects.length) {
      list.innerHTML = '<div class="project-row"><span class="project-row__num">—</span><strong>현재 연결된 프로젝트가 없습니다.</strong><span>어드민에서 프로젝트가 지정되면 이곳에서 확인할 수 있습니다.</span><span class="project-status">STANDBY</span><span class="project-open">—</span></div>';
      return;
    }

    list.innerHTML = projects.map((item, index) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      const meta = [item.company, item.type].filter(Boolean).join(' · ') || 'NINEWORKS COLLABORATION';
      const proposal = item.proposalUrl
        ? `<a href="${escapeHTML(item.proposalUrl)}" target="_blank" rel="noopener">VIEW PROPOSAL ↗</a>`
        : '<span>제안서 링크 준비 중</span>';
      return `<div class="project-row">
        <span class="project-row__num">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(meta)}</span>
        <span class="project-status${item.projectStage === 'active' ? ' is-active' : ''}">${stageLabel(item.projectStage)}</span>
        <span class="project-open">${item.proposalUrl ? `<a href="${escapeHTML(item.proposalUrl)}" target="_blank" rel="noopener">PROPOSAL ↗</a>` : '—'}</span>
      </div>
      <div class="partner-project-brief">
        <strong>PROJECT BRIEF · ${statusLabel(item.status)} · ${item.feeAmount ? money(item.feeAmount) : '금액 미정'}</strong>
        <p>${escapeHTML(item.summary || '프로젝트 상세 내용은 나인웍스에서 정리 후 업데이트합니다.')}</p>
        <div class="partner-project-actions">${proposal}</div>
      </div>`;
    }).join('');
  };

  const renderAccount = (projects) => {
    const preliminary = projects.filter((item) => item.projectStage === 'preliminary').reduce((sum, item) => sum + item.feeAmount, 0);
    const activeProjects = projects.filter((item) => item.projectStage === 'active' && item.status !== 'done');
    const active = activeProjects.reduce((sum, item) => sum + item.feeAmount, 0);
    const advance = active * 0.5;
    const withholding = active * 0.033;
    const finalNet = Math.max(0, active * 0.5 - withholding);

    const summary = { preliminary, active, advance, finalNet };
    Object.entries(summary).forEach(([key, value]) => {
      const node = document.querySelector(`[data-account-summary="${key}"]`);
      if (node) node.textContent = money(value);
    });

    const list = document.querySelector('[data-partner-account-list]');
    if (!list) return;
    const paidProjects = projects.filter((item) => item.feeAmount > 0);
    if (!paidProjects.length) {
      list.innerHTML = '<div class="partner-empty"><strong>정산 예정 프로젝트가 없습니다.</strong>어드민에서 파트너 지정과 금액을 설정하면 이곳에 표시됩니다.</div>';
      return;
    }

    list.innerHTML = paidProjects.map((item) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      const isActive = item.projectStage === 'active';
      const advanceAmount = isActive ? item.feeAmount * 0.5 : 0;
      const finalGross = isActive ? item.feeAmount * 0.5 : 0;
      const withholdingAmount = isActive ? item.feeAmount * 0.033 : 0;
      const finalNetAmount = isActive ? Math.max(0, finalGross - withholdingAmount) : 0;
      return `<article class="partner-account-row">
        <div class="partner-account-row__head"><div><span>${escapeHTML(item.company || 'NINEWORKS')}</span><strong>${escapeHTML(title)}</strong></div><em class="${isActive ? 'is-active' : ''}">${isActive ? '진행 · 예치금액' : '예비 · 예비금액'}</em></div>
        <div class="partner-account-row__amount">
          <div><span>${isActive ? '예치금액' : '예비금액'}</span><strong>${money(item.feeAmount)}</strong></div>
          <div><span>선금 50%</span><strong>${isActive ? money(advanceAmount) : '진행 전'}</strong></div>
          <div><span>잔금 50%</span><strong>${isActive ? money(finalGross) : '진행 전'}</strong></div>
          <div><span>잔금 실수령</span><strong>${isActive ? money(finalNetAmount) : '진행 전'}</strong></div>
        </div>
        ${isActive ? `<div class="partner-account-note">원천징수 3.3% ${money(withholdingAmount)}는 총 지정 금액 기준으로 계산해 잔금에서 차감합니다.</div>` : ''}
      </article>`;
    }).join('');
  };

  const renderSchedule = (projects) => {
    const box = document.querySelector('[data-partner-schedule]');
    if (!box) return;
    const activeProjects = projects.filter((item) => item.projectStage === 'active' && item.status !== 'done');
    if (!activeProjects.length) {
      box.innerHTML = '<strong>등록된 일정이 없습니다.</strong>프로젝트가 진행 단계로 전환되면 주요 일정과 전달 항목을 이곳에서 확인할 수 있습니다.';
      return;
    }
    box.innerHTML = activeProjects.map((item) => `<div class="partner-schedule-row"><time>IN PROGRESS</time><strong>${escapeHTML(item.projectName || item.company || 'NINEWORKS PROJECT')}</strong><span>${escapeHTML(item.company || item.type || '')}</span></div>`).join('');
  };

  const renderWorkspace = (email, partner, workspace = {}) => {
    const projects = normalizeProjects(workspace);
    fillProfile(email, partner);
    renderStats(projects);
    renderProjects(projects);
    renderAccount(projects);
    renderSchedule(projects);
  };

  const subscribeWorkspace = async (email, partner) => {
    unsubscribeWorkspace?.();
    unsubscribeWorkspace = null;
    try {
      const ctx = await getFirebase();
      unsubscribeWorkspace = ctx.onSnapshot(
        ctx.doc(ctx.db, 'partnerWorkspaces', partner.workspaceId),
        (snapshot) => renderWorkspace(email, partner, snapshot.exists() ? (snapshot.data() || {}) : {}),
        (error) => {
          console.warn('[NINEWORKS PARTNERS] workspace listener skipped', error);
          renderWorkspace(email, partner, {});
        }
      );
    } catch (error) {
      console.warn('[NINEWORKS PARTNERS] Firebase connection skipped', error);
      renderWorkspace(email, partner, {});
    }
  };

  const enterWorkspace = (rawEmail) => {
    const email = normalizeEmail(rawEmail);
    if (!isEmail(email)) {
      setNote('이메일 형식을 확인해 주세요.', 'error');
      loginForm?.querySelector('input[name="email"]')?.focus();
      return false;
    }
    const partner = PARTNERS[email];
    if (!partner) {
      localStorage.removeItem(STORAGE_KEY);
      setNote('등록된 나인웍스 파트너 이메일이 아닙니다.', 'error');
      return false;
    }

    localStorage.setItem(STORAGE_KEY, email);
    setView('app');
    setNote('');
    renderWorkspace(email, partner, {});
    window.scrollTo(0, 0);
    subscribeWorkspace(email, partner);
    return true;
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    setBusy(true);
    const email = String(new FormData(loginForm).get('email') || '');
    const success = enterWorkspace(email);
    setBusy(false);
    if (!success) return;
  });

  document.querySelectorAll('[data-partner-signout]').forEach((button) => {
    button.addEventListener('click', () => {
      unsubscribeWorkspace?.();
      unsubscribeWorkspace = null;
      localStorage.removeItem(STORAGE_KEY);
      loginForm?.reset();
      setNote('');
      setView('login');
      window.scrollTo(0, 0);
    });
  });

  document.querySelectorAll('.partner-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.partner-nav a').forEach((item) => item.classList.toggle('is-active', item === link));
    });
  });

  const extraStyle = document.createElement('style');
  extraStyle.textContent = `
    .partner-project-brief{padding:14px 18px 18px 76px;border-bottom:1px solid var(--p-line);background:#fafaf8}
    .partner-project-brief strong{display:block;margin-bottom:6px;font-size:8px;letter-spacing:.08em;color:#888}
    .partner-project-brief p{margin:0;max-width:760px;color:#666;font-size:10px;line-height:1.65;white-space:pre-wrap}
    .partner-schedule-row{display:grid;grid-template-columns:110px minmax(160px,1fr) minmax(120px,.8fr);gap:16px;padding:13px 0;border-bottom:1px solid var(--p-line);align-items:center}
    .partner-schedule-row:last-child{border-bottom:0}.partner-schedule-row time{font-size:9px;color:#888}.partner-schedule-row strong{font-size:11px;font-weight:500}.partner-schedule-row span{font-size:9px;color:#777}
    @media(max-width:760px){.partner-project-brief{padding:12px 13px 16px 43px}.partner-schedule-row{grid-template-columns:1fr;gap:5px}}
  `;
  document.head.appendChild(extraStyle);

  setView('login');
  const savedEmail = normalizeEmail(localStorage.getItem(STORAGE_KEY) || '');
  if (savedEmail && PARTNERS[savedEmail]) enterWorkspace(savedEmail);
})();

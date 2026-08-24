(() => {
  const loginView = document.querySelector('[data-partner-login]');
  const appView = document.querySelector('[data-partner-app]');
  const loginForm = document.querySelector('[data-partner-login-form]');
  const loginNote = document.querySelector('[data-partner-login-note]');
  const STORAGE_KEY = 'nw_partner_workspace_email';

  const PARTNERS = {
    'seodw100@naver.com': {
      name: '서동원',
      role: 'DESIGN PARTNER',
      projects: [],
      schedule: []
    },
    's.nninyong@gmail.com': {
      name: '신민용',
      role: 'DESIGN PARTNER',
      projects: [],
      schedule: []
    }
  };

  const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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
    if (label) label.textContent = busy ? 'CHECKING' : 'ENTER WORKSPACE';
  };

  const initials = (name = '') => {
    const value = String(name || '').trim();
    if (!value) return 'NW';
    if (/^[A-Za-z\s]+$/.test(value)) {
      return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    }
    return value.slice(0, 2);
  };

  const statusLabel = (status = 'new') => {
    if (status === 'done') return 'DONE';
    if (status === 'open') return 'OPEN';
    if (status === 'hold') return 'HOLD';
    return 'NEW';
  };

  const fillProfile = (email, partner) => {
    document.querySelectorAll('[data-partner-name]').forEach((node) => { node.textContent = partner.name; });
    document.querySelectorAll('[data-partner-role]').forEach((node) => { node.textContent = partner.role || 'DESIGN PARTNER'; });
    document.querySelectorAll('[data-partner-email]').forEach((node) => { node.textContent = email; });
    document.querySelectorAll('[data-partner-initials]').forEach((node) => { node.textContent = initials(partner.name); });
  };

  const renderStats = (partner) => {
    const projects = Array.isArray(partner.projects) ? partner.projects : [];
    const schedule = Array.isArray(partner.schedule) ? partner.schedule : [];
    const values = {
      projects: projects.filter((item) => item.status !== 'done').length,
      tasks: schedule.length,
      feedback: projects.filter((item) => item.status === 'open').length,
      files: projects.reduce((sum, item) => sum + Number(item.files || 0), 0)
    };
    Object.entries(values).forEach(([key, value]) => {
      const node = document.querySelector(`[data-partner-stat="${key}"]`);
      if (node) node.textContent = String(value);
    });
  };

  const renderProjects = (partner) => {
    const list = document.querySelector('[data-partner-project-list]');
    if (!list) return;
    const projects = Array.isArray(partner.projects) ? partner.projects : [];

    if (!projects.length) {
      list.innerHTML = '<div class="project-row"><span class="project-row__num">—</span><strong>현재 연결된 프로젝트가 없습니다.</strong><span>프로젝트가 지정되면 이곳에서 확인할 수 있습니다.</span><span class="project-status">STANDBY</span><span class="project-open">—</span></div>';
      return;
    }

    list.innerHTML = projects.map((item, index) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      const meta = [item.company, item.type].filter(Boolean).join(' · ') || 'NINEWORKS COLLABORATION';
      return `<div class="project-row">
        <span class="project-row__num">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(meta)}</span>
        <span class="project-status${item.status === 'open' ? ' is-active' : ''}">${statusLabel(item.status)}</span>
        <span class="project-open">VIEW</span>
      </div>${item.summary ? `<div class="partner-project-brief"><strong>PROJECT BRIEF</strong><p>${escapeHTML(item.summary)}</p></div>` : ''}`;
    }).join('');
  };

  const renderSchedule = (partner) => {
    const box = document.querySelector('[data-partner-schedule]');
    if (!box) return;
    const schedule = Array.isArray(partner.schedule) ? partner.schedule : [];

    if (!schedule.length) {
      box.innerHTML = '<strong>등록된 일정이 없습니다.</strong>킥오프, 시안 전달, 피드백, 최종 전달 일정은 프로젝트가 시작되면 이곳에 정리됩니다.';
      return;
    }

    box.innerHTML = schedule.map((item) => `<div class="partner-schedule-row"><time>${escapeHTML(item.date || '')}</time><strong>${escapeHTML(item.title || '')}</strong><span>${escapeHTML(item.project || '')}</span></div>`).join('');
  };

  const renderWorkspace = (email, partner) => {
    fillProfile(email, partner);
    renderStats(partner);
    renderProjects(partner);
    renderSchedule(partner);
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
    renderWorkspace(email, partner);
    setView('app');
    setNote('');
    window.scrollTo(0, 0);
    return true;
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    setBusy(true);
    const email = String(new FormData(loginForm).get('email') || '');
    window.setTimeout(() => {
      enterWorkspace(email);
      setBusy(false);
    }, 120);
  });

  document.querySelectorAll('[data-partner-signout]').forEach((button) => {
    button.addEventListener('click', () => {
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
    .partner-schedule-row:last-child{border-bottom:0}
    .partner-schedule-row time{font-size:9px;color:#888}.partner-schedule-row strong{font-size:11px;font-weight:500}.partner-schedule-row span{font-size:9px;color:#777}
    @media(max-width:760px){.partner-project-brief{padding:12px 13px 16px 43px}.partner-schedule-row{grid-template-columns:1fr;gap:5px}}
  `;
  document.head.appendChild(extraStyle);

  setView('login');
  const savedEmail = normalizeEmail(localStorage.getItem(STORAGE_KEY) || '');
  if (savedEmail && PARTNERS[savedEmail]) enterWorkspace(savedEmail);
})();

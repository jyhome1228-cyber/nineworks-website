(() => {
  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
  const loginView = document.querySelector('[data-partner-login]');
  const appView = document.querySelector('[data-partner-app]');
  const loginForm = document.querySelector('[data-partner-login-form]');
  const loginNote = document.querySelector('[data-partner-login-note]');
  const bankForm = document.querySelector('[data-partner-bank-form]');
  const bankNote = document.querySelector('[data-partner-bank-note]');
  const STORAGE_KEY = 'nw_partner_workspace_email';

  const PARTNERS = {
    'seodw100@naver.com': { name: '서동원', role: 'DESIGN PARTNER', workspaceId: 'seodw100%40naver.com' },
    's.nninyong@gmail.com': { name: '신민용', role: 'DESIGN PARTNER', workspaceId: 's.nninyong%40gmail.com' },
    'daytuio0329@naver.com': { name: '박상혁', role: 'DESIGN PARTNER', workspaceId: 'daytuio0329%40naver.com' }
  };

  const PAGE_KEYS = new Set(['dashboard', 'projects', 'schedule', 'proposals', 'account', 'guide']);
  let firebasePromise = null;
  let unsubscribeWorkspace = null;
  let currentEmail = '';
  let currentPartner = null;
  let currentProjects = [];
  let currentPaymentType = 'freelancer';

  const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  const money = (value = 0) => `${Math.round(Number(value || 0)).toLocaleString('ko-KR')}원`;
  const normalizeStage = (value = '') => value === 'active' ? 'active' : 'preliminary';
  const normalizeAmount = (value = 0) => Math.max(0, Number(value || 0));
  const normalizePaymentType = (value = '') => value === 'business' ? 'business' : 'freelancer';
  const paymentTypeStorageKey = (email = '') => `nw_partner_payment_type_${normalizeEmail(email)}`;
  const cleanSummary = (value = '') => String(value || '')
    .replace(/[■◼▪●]/g, '·')
    .replace(/\s+/g, ' ')
    .trim();
  const safeUrl = (value = '') => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
      const url = new URL(raw);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };

  const settlementFor = (value = 0, paymentType = currentPaymentType) => {
    const base = normalizeAmount(value);
    const type = normalizePaymentType(paymentType);
    if (type === 'business') {
      const vat = Math.round(base * 0.1);
      const total = base + vat;
      const supplyAdvance = Math.round(base * 0.5);
      const supplyBalance = base - supplyAdvance;
      const advanceVat = Math.round(supplyAdvance * 0.1);
      const balanceVat = vat - advanceVat;
      return {
        type,
        base,
        total,
        advance: supplyAdvance + advanceVat,
        balance: supplyBalance + balanceVat,
        vat,
        withholding: 0
      };
    }
    const withholding = Math.round(base * 0.033);
    const total = Math.max(0, base - withholding);
    const advance = Math.round(total * 0.5);
    return {
      type,
      base,
      total,
      advance,
      balance: total - advance,
      vat: 0,
      withholding
    };
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
    const showLogin = name === 'login';
    if (loginView) {
      loginView.hidden = !showLogin;
      if (showLogin) loginView.style.removeProperty('display');
      else loginView.style.setProperty('display', 'none', 'important');
    }
    if (appView) appView.hidden = showLogin;
  };

  const setNote = (node, message = '', state = '') => {
    if (!node) return;
    node.textContent = message;
    node.classList.toggle('is-error', state === 'error');
    node.classList.toggle('is-success', state === 'success');
  };

  const setBusy = (busy) => {
    const button = loginForm?.querySelector('button[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    const label = button.querySelector('span:first-child');
    if (label) label.textContent = busy ? 'ENTERING' : 'ENTER WORKSPACE';
  };

  const greetingCopy = (name) => {
    const hour = new Date().getHours();
    let message = '좋은 밤이에요. 오늘도 좋은 작업 이어가세요.';
    if (hour >= 5 && hour < 12) message = '좋은 아침이에요. 오늘도 좋은 작업 이어가세요.';
    else if (hour >= 12 && hour < 18) message = '좋은 오후예요. 오늘도 좋은 작업 이어가세요.';
    else if (hour >= 18 && hour < 24) message = '좋은 저녁이에요. 오늘도 좋은 작업 이어가세요.';
    return `안녕하세요 ${name}님,<br><span class="greeting-sub">${message}</span>`;
  };

  const openPartnerPage = (rawKey = 'dashboard', updateHash = true) => {
    const key = PAGE_KEYS.has(rawKey) ? rawKey : 'dashboard';
    document.querySelectorAll('[data-partner-page]').forEach((page) => {
      page.classList.toggle('is-active', page.dataset.partnerPage === key);
    });
    document.querySelectorAll('[data-partner-page-link]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.partnerPageLink === key);
    });
    if (updateHash && history.replaceState) {
      const next = key === 'dashboard' ? location.pathname : `${location.pathname}#${key}`;
      history.replaceState(null, '', next);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const bindPageNavigation = () => {
    document.querySelectorAll('[data-partner-page-link]').forEach((button) => {
      button.addEventListener('click', () => openPartnerPage(button.dataset.partnerPageLink || 'dashboard'));
    });
    document.querySelector('[data-partner-myinfo]')?.addEventListener('click', () => openPartnerPage('account'));
  };

  const fillProfile = (email, partner) => {
    const greeting = document.querySelector('[data-partner-greeting]');
    if (greeting) greeting.innerHTML = greetingCopy(escapeHTML(partner.name));
  };

  const statusLabel = (status = 'new') => status === 'done' ? 'DONE' : status === 'open' ? 'OPEN' : 'NEW';
  const stageLabel = (stage) => normalizeStage(stage) === 'active' ? '진행' : '예비';

  const updatePaymentTypeUI = () => {
    bankForm?.querySelectorAll('input[name="paymentType"]').forEach((input) => {
      input.checked = input.value === currentPaymentType;
    });
    const copy = document.querySelector('[data-payment-type-copy]');
    const guide = document.querySelector('[data-payment-guide]');
    const policy = document.querySelector('[data-account-policy]');
    const advanceNote = document.querySelector('[data-account-advance-note]');
    const balanceNote = document.querySelector('[data-account-balance-note]');
    if (currentPaymentType === 'business') {
      if (copy) copy.textContent = '사업자는 공급가액에 부가세 10%를 더해 지급합니다.';
      if (guide) guide.innerHTML = '<strong>사업자</strong> · 공급가액 기준 선금 50%와 잔금 50% 각각에 VAT 10%를 더해 지급합니다. 세금계산서는 전체 프로젝트 금액 기준으로 1회 발행해 주세요.';
      if (policy) policy.innerHTML = '<strong>정산 안내</strong> · 예비 단계 금액은 아직 지급 확정 금액이 아닙니다. 진행 단계로 전환되면 공급가액에 VAT 10%를 더한 금액이 본 정산금액으로 합산되며, 선금·잔금 각각 공급가액 50% + VAT 10% 기준으로 표시합니다. 세금계산서는 전체 프로젝트 금액 기준 1회 발행합니다.';
      if (advanceNote) advanceNote.textContent = '공급가액 50% + VAT 10%';
      if (balanceNote) balanceNote.textContent = '공급가액 50% + VAT 10%';
    } else {
      if (copy) copy.textContent = '프리랜서는 지정 금액에서 3.3% 원천징수 후 지급됩니다.';
      if (guide) guide.innerHTML = '<strong>프리랜서</strong> · 지정 금액에서 3.3%를 차감한 뒤 예상 지급액을 선금 50% / 잔금 50%로 나누어 안내합니다.';
      if (policy) policy.innerHTML = '<strong>정산 안내</strong> · 예비 단계 금액은 아직 지급 확정 금액이 아닙니다. 진행 단계로 전환되면 지정 금액에서 원천징수 3.3%를 차감한 금액이 본 정산금액으로 합산되고, 선금 50% / 잔금 50%로 나누어 표시합니다.';
      if (advanceNote) advanceNote.textContent = '3.3% 차감 후 50%';
      if (balanceNote) balanceNote.textContent = '3.3% 차감 후 50%';
    }
  };

  const setPaymentType = (value, persist = true) => {
    currentPaymentType = normalizePaymentType(value);
    if (persist && currentEmail) localStorage.setItem(paymentTypeStorageKey(currentEmail), currentPaymentType);
    updatePaymentTypeUI();
    renderStats(currentProjects);
    renderAccount(currentProjects);
  };

  const normalizeProjects = (workspace = {}) => {
    const assignments = Array.isArray(workspace.assignments) ? workspace.assignments : [];
    return assignments.map((item) => ({
      id: String(item.id || ''),
      company: String(item.company || ''),
      projectName: String(item.projectName || ''),
      type: String(item.projectType || item.service || ''),
      status: ['new', 'open', 'done'].includes(item.status) ? item.status : 'new',
      summary: cleanSummary(item.summary || ''),
      feeAmount: normalizeAmount(item.feeAmount),
      projectStage: normalizeStage(item.projectStage),
      proposalUrl: safeUrl(item.proposalUrl)
    }));
  };

  const renderStats = (projects) => {
    const preliminaryBase = projects
      .filter((item) => item.projectStage === 'preliminary')
      .reduce((sum, item) => sum + item.feeAmount, 0);
    const activeSettlement = projects
      .filter((item) => item.projectStage === 'active' && item.status !== 'done')
      .reduce((sum, item) => sum + settlementFor(item.feeAmount).total, 0);
    const values = {
      projects: projects.filter((item) => item.projectStage === 'active' && item.status !== 'done').length,
      preliminaryFee: money(preliminaryBase),
      activeFee: money(activeSettlement),
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
      const proposalLink = item.proposalUrl
        ? `<a href="${escapeHTML(item.proposalUrl)}" target="_blank" rel="noopener">PROPOSAL ↗</a>`
        : '—';
      return `<div class="project-row">
        <span class="project-row__num">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(meta)}</span>
        <span class="project-status${item.projectStage === 'active' ? ' is-active' : ''}">${stageLabel(item.projectStage)}</span>
        <span class="project-open">${proposalLink}</span>
      </div>
      <div class="partner-project-brief">
        <strong>PROJECT BRIEF · ${statusLabel(item.status)} · 지정금액 ${item.feeAmount ? money(item.feeAmount) : '미정'}</strong>
        <p>${escapeHTML(item.summary || '프로젝트 상세 내용은 나인웍스에서 정리 후 업데이트합니다.')}</p>
        ${item.proposalUrl ? `<div class="partner-project-actions"><a href="${escapeHTML(item.proposalUrl)}" target="_blank" rel="noopener">VIEW PROPOSAL ↗</a></div>` : ''}
      </div>`;
    }).join('');
  };

  const renderProposals = (projects) => {
    const list = document.querySelector('[data-partner-proposal-list]');
    if (!list) return;
    const proposals = projects.filter((item) => item.proposalUrl);
    if (!proposals.length) {
      list.innerHTML = '<div class="partner-empty"><strong>연결된 제안서가 없습니다.</strong>어드민에서 제안서 링크가 등록되면 이곳에 표시됩니다.</div>';
      return;
    }
    list.innerHTML = proposals.map((item, index) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      return `<article class="partner-proposal-card">
        <div class="partner-proposal-row">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHTML(title)}</strong>
          <small>${escapeHTML(item.company || item.type || 'NINEWORKS')}</small>
          <em>${stageLabel(item.projectStage)}</em>
          <a href="${escapeHTML(item.proposalUrl)}" target="_blank" rel="noopener">OPEN PROPOSAL ↗</a>
        </div>
        <div class="partner-feedback-box">
          <p>제안서를 확인한 뒤 <strong>더 보강하거나 추가하면 좋을 내용</strong>, 수정 의견이나 참고 아이디어가 있다면 적어주세요.</p>
          <form class="partner-feedback-form" data-proposal-feedback-form data-inquiry-id="${escapeHTML(item.id)}">
            <textarea name="message" maxlength="3000" placeholder="제안서를 보고 더 보강하거나 추가할 내용을 적어주세요." required></textarea>
            <button type="submit">의견 보내기</button>
            <p class="partner-feedback-note" data-proposal-feedback-note></p>
          </form>
        </div>
      </article>`;
    }).join('');
  };

  const renderAccount = (projects) => {
    const preliminaryBase = projects
      .filter((item) => item.projectStage === 'preliminary')
      .reduce((sum, item) => sum + item.feeAmount, 0);
    const activeProjects = projects.filter((item) => item.projectStage === 'active' && item.status !== 'done');
    const activeSettlements = activeProjects.map((item) => settlementFor(item.feeAmount));
    const active = activeSettlements.reduce((sum, item) => sum + item.total, 0);
    const advance = activeSettlements.reduce((sum, item) => sum + item.advance, 0);
    const balance = activeSettlements.reduce((sum, item) => sum + item.balance, 0);
    const summary = { preliminary: preliminaryBase, active, advance, finalNet: balance };
    Object.entries(summary).forEach(([key, value]) => {
      const node = document.querySelector(`[data-account-summary="${key}"]`);
      if (node) node.textContent = money(value);
    });

    const list = document.querySelector('[data-partner-account-list]');
    if (!list) return;
    const feeProjects = projects.filter((item) => item.feeAmount > 0);
    if (!feeProjects.length) {
      list.innerHTML = '<div class="partner-empty"><strong>정산 예정 프로젝트가 없습니다.</strong>어드민에서 파트너 지정과 금액을 설정하면 이곳에 표시됩니다.</div>';
      return;
    }

    list.innerHTML = feeProjects.map((item) => {
      const title = item.projectName || item.company || 'NINEWORKS PROJECT';
      const isActive = item.projectStage === 'active';
      if (!isActive) {
        return `<article class="partner-account-row is-preliminary">
          <div class="partner-account-row__head"><div><span>${escapeHTML(item.company || 'NINEWORKS')}</span><strong>${escapeHTML(title)}</strong></div><em>예비 · 지급 전</em></div>
          <div class="partner-account-row__amount">
            <div><span>예비 지정금액</span><strong>${money(item.feeAmount)}</strong></div>
            <div><span>본 정산금액</span><strong>0원</strong></div>
            <div><span>선금 50%</span><strong>진행 전</strong></div>
            <div><span>잔금 50%</span><strong>진행 전</strong></div>
          </div>
          <div class="partner-account-note"><strong>예비 단계</strong> · 이 금액은 프로젝트 배정을 위한 참고용 지정금액이며 아직 실수령액이나 지급 확정 금액이 아닙니다. 프로젝트가 진행으로 전환되면 본 정산금액으로 이동해 합산됩니다.</div>
        </article>`;
      }

      const settlement = settlementFor(item.feeAmount);
      if (currentPaymentType === 'business') {
        return `<article class="partner-account-row">
          <div class="partner-account-row__head"><div><span>${escapeHTML(item.company || 'NINEWORKS')}</span><strong>${escapeHTML(title)}</strong></div><em class="is-active is-business">진행 · 사업자</em></div>
          <div class="partner-account-row__amount">
            <div><span>본 정산금액 · VAT 포함</span><strong>${money(settlement.total)}</strong></div>
            <div><span>선금 50% + VAT</span><strong>${money(settlement.advance)}</strong></div>
            <div><span>잔금 50% + VAT</span><strong>${money(settlement.balance)}</strong></div>
            <div><span>부가세 10%</span><strong>${money(settlement.vat)}</strong></div>
          </div>
          <div class="partner-account-note">공급가액 ${money(settlement.base)}에 VAT 10% ${money(settlement.vat)}를 더해 지급합니다. 선금과 잔금은 각각 공급가액 50%에 해당 VAT를 더한 금액이며, <strong>세금계산서는 전체 프로젝트 금액 기준으로 1회 발행</strong>해 주세요.</div>
        </article>`;
      }

      return `<article class="partner-account-row">
        <div class="partner-account-row__head"><div><span>${escapeHTML(item.company || 'NINEWORKS')}</span><strong>${escapeHTML(title)}</strong></div><em class="is-active is-freelancer">진행 · 프리랜서</em></div>
        <div class="partner-account-row__amount">
          <div><span>본 정산금액</span><strong>${money(settlement.total)}</strong></div>
          <div><span>선금 50%</span><strong>${money(settlement.advance)}</strong></div>
          <div><span>잔금 50%</span><strong>${money(settlement.balance)}</strong></div>
          <div><span>원천징수 3.3%</span><strong>${money(settlement.withholding)}</strong></div>
        </div>
        <div class="partner-account-note">지정 금액 ${money(settlement.base)}에서 원천징수 3.3% ${money(settlement.withholding)}를 차감한 ${money(settlement.total)}을 본 정산금액으로 합산하고 선금 50% / 잔금 50%로 나누어 표시합니다.</div>
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
    currentEmail = email;
    currentPartner = partner;
    const storedType = localStorage.getItem(paymentTypeStorageKey(email));
    if (!storedType && workspace.paymentType) currentPaymentType = normalizePaymentType(workspace.paymentType);
    currentProjects = normalizeProjects(workspace);
    fillProfile(email, partner);
    updatePaymentTypeUI();
    renderStats(currentProjects);
    renderProjects(currentProjects);
    renderProposals(currentProjects);
    renderAccount(currentProjects);
    renderSchedule(currentProjects);
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
      setNote(loginNote, '이메일 형식을 확인해 주세요.', 'error');
      loginForm?.querySelector('input[name="email"]')?.focus();
      return false;
    }
    const partner = PARTNERS[email];
    if (!partner) {
      localStorage.removeItem(STORAGE_KEY);
      setNote(loginNote, '등록된 나인웍스 파트너 이메일이 아닙니다.', 'error');
      return false;
    }
    localStorage.setItem(STORAGE_KEY, email);
    currentEmail = email;
    currentPaymentType = normalizePaymentType(localStorage.getItem(paymentTypeStorageKey(email)) || 'freelancer');
    setView('app');
    setNote(loginNote, '');
    renderWorkspace(email, partner, {});
    const hashKey = location.hash.replace('#', '');
    openPartnerPage(PAGE_KEYS.has(hashKey) ? hashKey : 'dashboard', false);
    window.scrollTo(0, 0);
    subscribeWorkspace(email, partner);
    return true;
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    setBusy(true);
    enterWorkspace(String(new FormData(loginForm).get('email') || ''));
    setBusy(false);
  });

  bankForm?.addEventListener('change', (event) => {
    const input = event.target.closest('input[name="paymentType"]');
    if (!input) return;
    setPaymentType(input.value, true);
  });

  bankForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!bankForm.reportValidity() || !currentPartner || !currentEmail) return;
    const data = new FormData(bankForm);
    const accountHolder = String(data.get('accountHolder') || '').trim().slice(0, 60);
    const bank = String(data.get('bank') || '').trim().slice(0, 60);
    const accountNumber = String(data.get('accountNumber') || '').trim().slice(0, 80);
    const paymentType = normalizePaymentType(data.get('paymentType'));
    currentPaymentType = paymentType;
    localStorage.setItem(paymentTypeStorageKey(currentEmail), paymentType);
    updatePaymentTypeUI();
    renderStats(currentProjects);
    renderAccount(currentProjects);
    const button = bankForm.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    setNote(bankNote, '지급유형과 계좌정보를 등록하고 있습니다.');
    try {
      const ctx = await getFirebase();
      await ctx.addDoc(ctx.collection(ctx.db, 'partnerAccountSubmissions'), {
        partnerEmail: currentEmail,
        partnerName: currentPartner.name,
        paymentType,
        accountHolder,
        bank,
        accountNumber,
        source: 'PARTNER_WORKSPACE',
        createdAt: ctx.serverTimestamp()
      });
      setNote(bankNote, '지급유형과 계좌정보가 등록되었습니다. 나인웍스 관리자에서 확인할 수 있습니다.', 'success');
    } catch (error) {
      console.error('[NINEWORKS PARTNERS] bank submission failed', error);
      setNote(bankNote, '등록에 실패했습니다. Firestore 규칙 적용 후 다시 시도해 주세요.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  });

  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-proposal-feedback-form]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity() || !currentPartner || !currentEmail) return;
    const inquiryId = String(form.dataset.inquiryId || '');
    const project = currentProjects.find((item) => item.id === inquiryId);
    if (!project) return;
    const message = String(new FormData(form).get('message') || '').trim().slice(0, 3000);
    const note = form.querySelector('[data-proposal-feedback-note]');
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    setNote(note, '의견을 전달하고 있습니다.');
    try {
      const ctx = await getFirebase();
      await ctx.addDoc(ctx.collection(ctx.db, 'partnerProposalFeedback'), {
        partnerEmail: currentEmail,
        partnerName: currentPartner.name,
        inquiryId,
        projectName: project.projectName || '',
        company: project.company || '',
        proposalUrl: project.proposalUrl || '',
        message,
        source: 'PARTNER_WORKSPACE',
        createdAt: ctx.serverTimestamp()
      });
      form.reset();
      setNote(note, '의견이 전달되었습니다. 나인웍스 관리자에서 확인할 수 있습니다.', 'success');
    } catch (error) {
      console.error('[NINEWORKS PARTNERS] feedback submission failed', error);
      setNote(note, '의견 저장에 실패했습니다. Firestore 규칙 적용 후 다시 시도해 주세요.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  });

  document.querySelectorAll('[data-partner-signout]').forEach((button) => {
    button.addEventListener('click', () => {
      unsubscribeWorkspace?.();
      unsubscribeWorkspace = null;
      currentEmail = '';
      currentPartner = null;
      currentProjects = [];
      currentPaymentType = 'freelancer';
      localStorage.removeItem(STORAGE_KEY);
      loginForm?.reset();
      setNote(loginNote, '');
      setView('login');
      window.scrollTo(0, 0);
    });
  });

  bindPageNavigation();
  setView('login');
  const savedEmail = normalizeEmail(localStorage.getItem(STORAGE_KEY) || '');
  if (savedEmail && PARTNERS[savedEmail]) enterWorkspace(savedEmail);
})();
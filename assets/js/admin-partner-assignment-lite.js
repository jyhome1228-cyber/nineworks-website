import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const PARTNERS = [
  { name: '서동원', email: 'seodw100@naver.com' },
  { name: '신민용', email: 's.nninyong@gmail.com' }
];

let inquiryCache = [];
let unsubscribeInquiries = null;
let started = false;
let syncTimer = null;
const lastWorkspacePayload = new Map();

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
const workspaceKey = (email = '') => encodeURIComponent(normalizeEmail(email));
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#039;');
const normalizeStage = (value = '') => value === 'active' ? 'active' : 'preliminary';
const normalizeAmount = (value) => {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return 0;
  return Math.min(10000000, Math.max(0, Math.round(number / 500000) * 500000));
};
const normalizeUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
};
const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
const partnerForEmail = (email = '') => PARTNERS.find((item) => item.email === normalizeEmail(email));

const loadStyle = () => {
  if (document.querySelector('link[data-admin-partner-lite-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-partner-assignment-lite.css?v=20260824-3';
  link.dataset.adminPartnerLiteStyle = 'true';
  document.head.appendChild(link);
};

const injectPartnerPanel = () => {
  const nav = document.querySelector('.admin-nav');
  if (nav && !nav.querySelector('[data-admin-tab="partners"]')) {
    const visitors = nav.querySelector('[data-admin-tab="visitors"]');
    if (visitors) visitors.innerHTML = '<span>05</span>Visitors';
    const button = document.createElement('button');
    button.className = 'admin-nav__item';
    button.type = 'button';
    button.dataset.adminTab = 'partners';
    button.innerHTML = '<span>04</span>Partners';
    if (visitors) nav.insertBefore(button, visitors);
    else nav.appendChild(button);
  }

  if (!document.querySelector('[data-admin-panel="partners"]')) {
    const panel = document.createElement('section');
    panel.className = 'admin-panel';
    panel.dataset.adminPanel = 'partners';
    panel.innerHTML = `
      <div class="admin-section-head">
        <div><span class="admin-label">Partner Management</span><h2>Partners</h2><p>파트너별 배정 프로젝트와 예비·진행 금액을 확인합니다. 실제 지정은 Inquiries에서 처리합니다.</p></div>
      </div>
      <div class="admin-partner-lite-list" data-admin-partner-lite-list></div>`;
    const visitorsPanel = document.querySelector('[data-admin-panel="visitors"]');
    if (visitorsPanel?.parentElement) visitorsPanel.parentElement.insertBefore(panel, visitorsPanel);
    else document.querySelector('.admin-main')?.appendChild(panel);
  }
};

const openPartners = () => {
  document.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.adminTab === 'partners'));
  document.querySelectorAll('[data-admin-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.adminPanel === 'partners'));
  const title = document.querySelector('[data-admin-title]');
  if (title) title.textContent = 'Partners';
  if (history.replaceState) history.replaceState(null, '', '#partners');
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const bindNavigation = () => {
  document.addEventListener('click', (event) => {
    const partnerTab = event.target.closest('[data-admin-tab="partners"]');
    if (partnerTab) {
      openPartners();
      return;
    }
    const otherTab = event.target.closest('[data-admin-tab]');
    if (otherTab && otherTab.dataset.adminTab !== 'partners') {
      document.querySelector('[data-admin-tab="partners"]')?.classList.remove('is-active');
      document.querySelector('[data-admin-panel="partners"]')?.classList.remove('is-active');
    }
  });
  if (location.hash === '#partners') window.setTimeout(openPartners, 0);
};

const assignmentsFor = (email) => inquiryCache.filter((item) => normalizeEmail(item.assignedPartnerEmail) === email);

const renderPartnerPanel = () => {
  const box = document.querySelector('[data-admin-partner-lite-list]');
  if (!box) return;
  box.innerHTML = PARTNERS.map((partner) => {
    const items = assignmentsFor(partner.email);
    const activeItems = items.filter((item) => normalizeStage(item.partnerProjectStage) === 'active' && item.status !== 'done');
    const preliminaryAmount = items
      .filter((item) => normalizeStage(item.partnerProjectStage) === 'preliminary')
      .reduce((sum, item) => sum + normalizeAmount(item.partnerFeeAmount), 0);
    const activeAmount = activeItems.reduce((sum, item) => sum + normalizeAmount(item.partnerFeeAmount), 0);
    return `<article class="admin-partner-lite-card">
      <div><span>DESIGN PARTNER</span><strong>${escapeHTML(partner.name)}</strong><p>${escapeHTML(partner.email)}</p></div>
      <div class="admin-partner-lite-card__stats">
        <div><small>ASSIGNED</small><b>${items.length}</b></div>
        <div><small>ACTIVE</small><b>${activeItems.length}</b></div>
      </div>
      <div class="admin-partner-lite-card__money"><span>예비금액 <b>${money(preliminaryAmount)}</b></span><span>진행금액 <b>${money(activeAmount)}</b></span></div>
      <a href="parters/" target="_blank" rel="noopener">WORKSPACE ↗</a>
    </article>`;
  }).join('');
};

const partnerOptions = (selected = '') => {
  const current = normalizeEmail(selected);
  return [
    '<option value="">파트너 지정 안함</option>',
    ...PARTNERS.map((partner) => `<option value="${partner.email}"${partner.email === current ? ' selected' : ''}>${escapeHTML(partner.name)} · ${partner.email}</option>`)
  ].join('');
};

const amountOptions = (selected = 0) => {
  const current = normalizeAmount(selected);
  const options = ['<option value="0">금액 미정</option>'];
  for (let amount = 500000; amount <= 10000000; amount += 500000) {
    options.push(`<option value="${amount}"${amount === current ? ' selected' : ''}>${money(amount)}</option>`);
  }
  return options.join('');
};

const inquiryById = (id) => inquiryCache.find((item) => item.id === id);

const decorateInquiryRows = () => {
  document.querySelectorAll('[data-inquiry-list] .admin-inquiry-row').forEach((row) => {
    const statusSelect = row.querySelector('[data-inquiry-status]');
    if (!statusSelect) return;
    const id = statusSelect.dataset.inquiryStatus;
    const item = inquiryById(id);
    if (!item) return;

    const signature = [
      id,
      normalizeEmail(item.assignedPartnerEmail),
      normalizeAmount(item.partnerFeeAmount),
      normalizeStage(item.partnerProjectStage),
      String(item.partnerProposalUrl || '')
    ].join('|');

    let holder = row.querySelector('.admin-partner-lite-assign');
    if (!holder) {
      holder = document.createElement('div');
      holder.className = 'admin-partner-lite-assign';
      row.appendChild(holder);
    }
    if (holder.dataset.signature === signature) return;
    holder.dataset.signature = signature;

    const savedProposal = normalizeUrl(item.partnerProposalUrl);
    holder.innerHTML = `
      <div><label>PARTNER</label><select data-partner-lite-assign="${escapeHTML(id)}" class="${item.assignedPartnerEmail ? 'is-assigned' : ''}">${partnerOptions(item.assignedPartnerEmail)}</select></div>
      <div><label>지정 금액</label><select data-partner-fee="${escapeHTML(id)}">${amountOptions(item.partnerFeeAmount)}</select></div>
      <div><label>프로젝트 단계</label><select data-partner-stage="${escapeHTML(id)}"><option value="preliminary"${normalizeStage(item.partnerProjectStage) === 'preliminary' ? ' selected' : ''}>예비</option><option value="active"${normalizeStage(item.partnerProjectStage) === 'active' ? ' selected' : ''}>진행</option></select></div>
      <div class="admin-partner-lite-proposal">
        <label>제안서 링크</label>
        <div class="admin-partner-lite-proposal__control">
          <input type="url" data-partner-proposal="${escapeHTML(id)}" placeholder="https://9works.kr/rpbio/" value="${escapeHTML(item.partnerProposalUrl || '')}">
          <button type="button" data-partner-proposal-save="${escapeHTML(id)}">SAVE</button>
          ${savedProposal ? `<a href="${escapeHTML(savedProposal)}" target="_blank" rel="noopener">OPEN ↗</a>` : ''}
        </div>
        <small>나인웍스 제안서 URL이나 외부 http/https 링크를 입력할 수 있습니다.</small>
      </div>`;
  });
};

const scheduleDecorate = () => {
  window.setTimeout(decorateInquiryRows, 20);
  window.setTimeout(decorateInquiryRows, 140);
};

const sanitizedAssignments = (partnerEmail) => inquiryCache
  .filter((item) => normalizeEmail(item.assignedPartnerEmail) === partnerEmail)
  .map((item) => ({
    id: item.id,
    company: String(item.company || '').slice(0, 200),
    projectName: String(item.projectName || '').slice(0, 200),
    service: String(item.service || '').slice(0, 160),
    projectType: String(item.projectType || '').slice(0, 500),
    status: ['new', 'open', 'done'].includes(item.status) ? item.status : 'new',
    summary: String(item.message || item.details || '').slice(0, 1800),
    feeAmount: normalizeAmount(item.partnerFeeAmount),
    projectStage: normalizeStage(item.partnerProjectStage),
    proposalUrl: normalizeUrl(item.partnerProposalUrl),
    assignedAt: item.partnerAssignedAt || null
  }));

const syncPartnerWorkspaces = async () => {
  for (const partner of PARTNERS) {
    const assignments = sanitizedAssignments(partner.email);
    const signature = JSON.stringify(assignments.map((item) => ({ ...item, assignedAt: null })));
    if (lastWorkspacePayload.get(partner.email) === signature) continue;
    try {
      await setDoc(doc(db, 'partnerWorkspaces', workspaceKey(partner.email)), {
        name: partner.name,
        email: partner.email,
        assignments,
        projectCount: assignments.length,
        updatedAt: serverTimestamp()
      }, { merge: true });
      lastWorkspacePayload.set(partner.email, signature);
    } catch (error) {
      console.warn('[NINEWORKS Admin] partner workspace sync skipped', error);
    }
  }
};

const queueWorkspaceSync = () => {
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(syncPartnerWorkspaces, 180);
};

const updateInquiryField = async (inquiryId, patch, errorMessage) => {
  try {
    await updateDoc(doc(db, 'inquiries', inquiryId), { ...patch, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('[NINEWORKS Admin] partner field update failed', error);
    window.alert(errorMessage);
    throw error;
  }
};

const saveProposal = async (inquiryId, input) => {
  if (!db || !input) return;
  const raw = String(input.value || '').trim();
  const normalized = normalizeUrl(raw);
  if (raw && !normalized) {
    window.alert('제안서 링크는 http:// 또는 https:// 주소로 입력해 주세요.');
    input.focus();
    return;
  }

  const button = input.closest('.admin-partner-lite-proposal')?.querySelector('[data-partner-proposal-save]');
  input.disabled = true;
  if (button) {
    button.disabled = true;
    button.textContent = 'SAVING';
  }
  try {
    await updateInquiryField(inquiryId, {
      partnerProposalUrl: normalized || deleteField()
    }, '제안서 링크 저장에 실패했습니다.');
  } finally {
    input.disabled = false;
    if (button) {
      button.disabled = false;
      button.textContent = 'SAVE';
    }
  }
};

const bindAssignmentControls = () => {
  document.addEventListener('change', async (event) => {
    const partnerSelect = event.target.closest('[data-partner-lite-assign]');
    if (partnerSelect && db) {
      const inquiryId = partnerSelect.dataset.partnerLiteAssign;
      const partner = partnerForEmail(partnerSelect.value);
      partnerSelect.disabled = true;
      try {
        if (!partner) {
          await updateInquiryField(inquiryId, {
            assignedPartnerEmail: deleteField(),
            assignedPartnerName: deleteField(),
            partnerAssignedAt: deleteField()
          }, '파트너 지정 해제에 실패했습니다.');
        } else {
          await updateInquiryField(inquiryId, {
            assignedPartnerEmail: partner.email,
            assignedPartnerName: partner.name,
            partnerAssignedAt: serverTimestamp(),
            partnerProjectStage: normalizeStage(inquiryById(inquiryId)?.partnerProjectStage)
          }, '파트너 지정에 실패했습니다.');
        }
      } finally { partnerSelect.disabled = false; }
      return;
    }

    const feeSelect = event.target.closest('[data-partner-fee]');
    if (feeSelect && db) {
      feeSelect.disabled = true;
      try {
        await updateInquiryField(feeSelect.dataset.partnerFee, {
          partnerFeeAmount: normalizeAmount(feeSelect.value)
        }, '지정 금액 저장에 실패했습니다.');
      } finally { feeSelect.disabled = false; }
      return;
    }

    const stageSelect = event.target.closest('[data-partner-stage]');
    if (stageSelect && db) {
      stageSelect.disabled = true;
      try {
        await updateInquiryField(stageSelect.dataset.partnerStage, {
          partnerProjectStage: normalizeStage(stageSelect.value)
        }, '프로젝트 단계 저장에 실패했습니다.');
      } finally { stageSelect.disabled = false; }
    }
  });

  document.addEventListener('click', async (event) => {
    const saveButton = event.target.closest('[data-partner-proposal-save]');
    if (saveButton) {
      const inquiryId = saveButton.dataset.partnerProposalSave;
      const input = document.querySelector(`[data-partner-proposal="${CSS.escape(inquiryId)}"]`);
      await saveProposal(inquiryId, input);
      return;
    }

    if (event.target.closest('[data-inquiry-service-filter], [data-inquiry-status-filter], [data-status-summary], [data-dashboard-service], [data-admin-tab="inquiry"]')) scheduleDecorate();
  });

  document.addEventListener('keydown', async (event) => {
    const input = event.target.closest('[data-partner-proposal]');
    if (!input || event.key !== 'Enter') return;
    event.preventDefault();
    await saveProposal(input.dataset.partnerProposal, input);
  });

  document.querySelector('[data-inquiry-search]')?.addEventListener('input', scheduleDecorate);
  window.addEventListener('nw-admin-panel', (event) => {
    if (event.detail?.panel === 'inquiry') scheduleDecorate();
  });
};

const start = () => {
  if (started) return;
  started = true;
  injectPartnerPanel();
  renderPartnerPanel();
  bindNavigation();
  bindAssignmentControls();

  unsubscribeInquiries?.();
  unsubscribeInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    inquiryCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderPartnerPanel();
    scheduleDecorate();
    queueWorkspaceSync();
  }, (error) => console.error('[NINEWORKS Admin] partner inquiry stream failed', error));
};

loadStyle();
injectPartnerPanel();
if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (normalizeEmail(user?.email) === ADMIN_EMAIL) start();
  });
}

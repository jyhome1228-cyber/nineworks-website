import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';
import { auth, db, storage, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const STAGE_LABELS = {
  prospect: ['PROSPECT', '예비'],
  client: ['CLIENT', '기존'],
  ended: ['ENDED', '종료']
};
const CATEGORY_LABELS = {
  contract: '계약서',
  proposal: '제안서',
  report: '보고서',
  deliverable: '산출물',
  reference: '참고자료',
  other: '기타'
};
const MAX_FILE_SIZE = 50 * 1024 * 1024;

let clients = [];
let activeStage = 'all';
let searchTerm = '';
let selectedClientId = '';
let unsubscribeClients = null;
let unsubscribeFiles = null;
let clientFiles = [];
let uploadTask = null;

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const safeText = (value = '') => String(value || '').trim();
const normalizeStage = (value) => ['prospect', 'client', 'ended'].includes(value) ? value : 'client';
const clientName = (item) => item.company || item.companyName || item.brand || item.clientName || item.name || '이름 없음';
const projectName = (item) => item.projectName || item.project || item.service || '프로젝트 미입력';
const portalURL = (item) => item?.portalKey ? `${location.origin}/client/?key=${encodeURIComponent(item.portalKey)}` : '';

const asDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateTime = (value) => {
  const date = asDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};

const formatBytes = (bytes = 0) => {
  const value = Number(bytes || 0);
  if (!value) return '0 MB';
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / 1024 / 1024).toFixed(value >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
  return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const generatePortalKey = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const getClient = (id) => clients.find((item) => item.id === id) || null;

const injectStylesheet = () => {
  if (document.querySelector('link[data-admin-clients-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-clients-20260826.css?v=20260826-1';
  link.dataset.adminClientsStyle = 'true';
  document.head.appendChild(link);
};

const ensureUI = () => {
  injectStylesheet();
  const nav = document.querySelector('.admin-nav');
  const main = document.querySelector('.admin-main');
  if (!nav || !main) return;

  const memberButton = nav.querySelector('[data-admin-tab="members"]');
  const visitorsButton = nav.querySelector('[data-admin-tab="visitors"]');
  if (memberButton?.querySelector('span')) memberButton.querySelector('span').textContent = '04';
  if (visitorsButton?.querySelector('span')) visitorsButton.querySelector('span').textContent = '05';

  if (!nav.querySelector('[data-admin-tab="clients"]')) {
    const button = document.createElement('button');
    button.className = 'admin-nav__item';
    button.type = 'button';
    button.dataset.adminTab = 'clients';
    button.innerHTML = '<span>03</span>Clients';
    nav.insertBefore(button, memberButton || visitorsButton || null);
  }

  if (!document.querySelector('[data-admin-panel="clients"]')) {
    const section = document.createElement('section');
    section.className = 'admin-panel admin-clients-panel';
    section.dataset.adminPanel = 'clients';
    section.innerHTML = `
      <div class="admin-section-head admin-clients-head">
        <div>
          <span class="admin-label">Client Management</span>
          <h2>Clients</h2>
          <p>계약 전 예비 클라이언트부터 기존 클라이언트의 계약, 자료, 전용 대시보드까지 한곳에서 관리합니다.</p>
        </div>
        <button type="button" class="admin-client-primary" data-client-add>+ CLIENT ADD</button>
      </div>
      <div class="admin-client-stat-grid">
        <button type="button" class="admin-client-stat is-active" data-client-summary="all"><span>TOTAL</span><strong data-client-stat="all">0</strong><p>전체 클라이언트</p></button>
        <button type="button" class="admin-client-stat" data-client-summary="prospect"><span>PROSPECT</span><strong data-client-stat="prospect">0</strong><p>계약 전 예비</p></button>
        <button type="button" class="admin-client-stat" data-client-summary="client"><span>CLIENT</span><strong data-client-stat="client">0</strong><p>계약 · 진행 클라이언트</p></button>
        <button type="button" class="admin-client-stat" data-client-summary="ending"><span>ENDING SOON</span><strong data-client-stat="ending">0</strong><p>30일 이내 계약 종료</p></button>
      </div>
      <div class="admin-filter-panel admin-client-filter-panel">
        <div class="admin-filter-row"><span class="admin-filter-label">STATUS</span><div class="admin-filter-buttons"><button class="is-active" type="button" data-client-stage="all">전체</button><button type="button" data-client-stage="prospect">예비</button><button type="button" data-client-stage="client">기존</button><button type="button" data-client-stage="ended">종료</button></div></div>
        <div class="admin-search-row"><input type="search" placeholder="회사명, 프로젝트, 담당자, 이메일 검색" data-client-search><span data-client-total>0 CLIENTS</span></div>
      </div>
      <div class="admin-client-list" data-client-list><div class="admin-empty-live">클라이언트 데이터를 불러오는 중입니다.</div></div>
      <div class="admin-client-modal" data-client-modal hidden>
        <div class="admin-client-modal__backdrop" data-client-close></div>
        <section class="admin-client-modal__dialog" role="dialog" aria-modal="true" aria-label="클라이언트 관리">
          <header class="admin-client-modal__head"><div><span class="admin-label">Client Workspace</span><h3 data-client-modal-title>Client</h3></div><button type="button" data-client-close aria-label="닫기">CLOSE ×</button></header>
          <div class="admin-client-tabs" role="tablist"><button type="button" class="is-active" data-client-modal-tab="overview">Overview</button><button type="button" data-client-modal-tab="contract">Contract</button><button type="button" data-client-modal-tab="documents">Documents</button><button type="button" data-client-modal-tab="portal">Portal</button></div>
          <div class="admin-client-modal__body">
            <form data-client-form>
              <input type="hidden" name="clientId">
              <section class="admin-client-tabpane is-active" data-client-pane="overview">
                <div class="admin-client-form-grid">
                  <label><span>STATUS</span><select name="clientStage"><option value="prospect">예비 / 계약 전</option><option value="client">기존 / 계약 · 진행</option><option value="ended">종료 / 보관</option></select></label>
                  <label><span>COMPANY *</span><input name="company" required placeholder="회사 / 브랜드명"></label>
                  <label><span>PROJECT</span><input name="projectName" placeholder="프로젝트명"></label>
                  <label><span>CONTACT</span><input name="contactName" placeholder="담당자명"></label>
                  <label><span>EMAIL</span><input name="email" type="email" placeholder="client@company.com"></label>
                  <label><span>PHONE</span><input name="phone" placeholder="010-0000-0000"></label>
                </div>
                <label class="admin-client-field"><span>PROJECT SCOPE</span><textarea name="scope" rows="5" placeholder="진행 범위와 주요 업무를 정리합니다."></textarea></label>
                <label class="admin-client-field admin-client-private"><span>INTERNAL MEMO <b>PRIVATE</b></span><textarea name="internalMemo" rows="5" placeholder="클라이언트에게 공개되지 않는 내부 메모"></textarea></label>
              </section>
              <section class="admin-client-tabpane" data-client-pane="contract">
                <div class="admin-client-form-grid">
                  <label><span>CONTRACT TYPE</span><input name="contractType" placeholder="프로젝트 / 월간 파트너십"></label>
                  <label><span>CONTRACT STATUS</span><select name="contractStatus"><option value="draft">초안</option><option value="sent">전달</option><option value="signed">계약완료</option><option value="active">진행중</option><option value="ended">종료</option></select></label>
                  <label><span>START DATE</span><input name="contractStart" type="date"></label>
                  <label><span>END DATE</span><input name="contractEnd" type="date"></label>
                  <label><span>AMOUNT</span><input name="contractAmount" placeholder="월 1,800,000원 / 5,000,000원"></label>
                  <label><span>PAYMENT</span><input name="paymentTerms" placeholder="VAT 별도 · 매월 16일"></label>
                </div>
                <p class="admin-client-help">계약서 원본 파일은 Documents에서 <b>계약서</b> 유형으로 업로드하면 전용 대시보드에도 연결할 수 있습니다.</p>
              </section>
              <section class="admin-client-tabpane" data-client-pane="documents">
                <div class="admin-client-upload">
                  <div class="admin-client-upload__head"><div><span class="admin-label">Upload</span><h4>파일 추가</h4></div><span>MAX 50 MB / FILE</span></div>
                  <div class="admin-client-upload__grid">
                    <label><span>TYPE</span><select data-client-upload-category><option value="contract">계약서</option><option value="proposal">제안서</option><option value="report">보고서</option><option value="deliverable">산출물</option><option value="reference">참고자료</option><option value="other">기타</option></select></label>
                    <label><span>TITLE</span><input data-client-upload-title placeholder="2026.08 Monthly Report"></label>
                    <label class="admin-client-file-picker"><span>FILE</span><input type="file" data-client-upload-file><em data-client-file-name>파일 선택</em></label>
                    <label class="admin-client-toggle"><input type="checkbox" data-client-upload-visible checked><span>CLIENT PORTAL 공개</span></label>
                    <button type="button" data-client-upload>UPLOAD FILE</button>
                  </div>
                  <div class="admin-client-progress" data-client-upload-progress hidden><i></i><span>0%</span></div>
                </div>
                <div class="admin-client-file-list" data-client-files><div class="admin-client-file-empty">저장된 파일이 없습니다.</div></div>
              </section>
              <section class="admin-client-tabpane" data-client-pane="portal">
                <div class="admin-client-portal-switch"><div><span class="admin-label">Client Portal</span><h4>전용 대시보드 공개</h4><p>공개를 켜면 아래 비밀 링크에서 계약 정보와 공개 파일을 확인할 수 있습니다.</p></div><label><input type="checkbox" name="portalEnabled"><span>PORTAL ON</span></label></div>
                <label class="admin-client-field"><span>DASHBOARD MESSAGE</span><textarea name="portalMessage" rows="4" placeholder="현재 프로젝트 진행 상황이나 안내할 내용을 입력합니다."></textarea></label>
                <div class="admin-client-portal-link"><span>INDIVIDUAL LINK</span><input type="text" readonly data-client-portal-link placeholder="저장 후 링크가 생성됩니다."><div><button type="button" data-client-copy-link>COPY LINK</button><a href="#" target="_blank" rel="noopener" data-client-open-link>OPEN ↗</a></div></div>
                <div class="admin-client-portal-note"><b>공개 범위</b><p>회사명, 프로젝트명, 계약 정보, 프로젝트 범위, Dashboard Message와 Documents에서 공개한 파일만 표시됩니다. 담당자 연락처와 내부 메모는 공개되지 않습니다.</p></div>
              </section>
              <footer class="admin-client-modal__footer"><span data-client-save-status></span><button type="submit">SAVE CLIENT</button></footer>
            </form>
          </div>
        </section>
      </div>`;
    const membersPanel = document.querySelector('[data-admin-panel="members"]');
    main.insertBefore(section, membersPanel || null);
  }
};

ensureUI();

const listNode = () => document.querySelector('[data-client-list]');
const modal = () => document.querySelector('[data-client-modal]');
const form = () => document.querySelector('[data-client-form]');

const endingSoon = (item) => {
  if (normalizeStage(item.clientStage) !== 'client' || !item.contractEnd) return false;
  const end = new Date(`${item.contractEnd}T23:59:59`);
  if (Number.isNaN(end.getTime())) return false;
  const diff = end.getTime() - Date.now();
  return diff >= 0 && diff <= 30 * 86400000;
};

const filteredClients = () => clients.filter((item) => {
  const stage = normalizeStage(item.clientStage);
  if (activeStage === 'ending' && !endingSoon(item)) return false;
  if (!['all', 'ending'].includes(activeStage) && stage !== activeStage) return false;
  if (!searchTerm) return true;
  const haystack = [clientName(item), projectName(item), item.contactName, item.email, item.phone, item.scope].join(' ').toLowerCase();
  return haystack.includes(searchTerm);
});

const renderStats = () => {
  const counts = {
    all: clients.length,
    prospect: clients.filter((item) => normalizeStage(item.clientStage) === 'prospect').length,
    client: clients.filter((item) => normalizeStage(item.clientStage) === 'client').length,
    ending: clients.filter(endingSoon).length
  };
  Object.entries(counts).forEach(([key, value]) => {
    const node = document.querySelector(`[data-client-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });
  document.querySelectorAll('[data-client-summary]').forEach((button) => button.classList.toggle('is-active', button.dataset.clientSummary === activeStage));
};

const clientRowHTML = (item) => {
  const stage = normalizeStage(item.clientStage);
  const [eng, kor] = STAGE_LABELS[stage];
  const portal = Boolean(item.portalEnabled && item.portalKey);
  const contractRange = item.contractStart || item.contractEnd ? `${item.contractStart || '-'} — ${item.contractEnd || '-'}` : '계약일 미입력';
  return `<article class="admin-client-row" data-client-id="${escapeHTML(item.id)}"><button type="button" class="admin-client-row__main" data-client-open="${escapeHTML(item.id)}"><div class="admin-client-row__name"><span class="admin-client-badge admin-client-badge--${stage}">${eng} / ${kor}</span><strong>${escapeHTML(clientName(item))}</strong><p>${escapeHTML(projectName(item))}</p></div><div class="admin-client-row__contract"><span>CONTRACT</span><strong>${escapeHTML(contractRange)}</strong><p>${escapeHTML(item.contractType || '계약 형태 미입력')}</p></div><div class="admin-client-row__contact"><span>CONTACT</span><strong>${escapeHTML(item.contactName || '-')}</strong><p>${escapeHTML(item.email || item.phone || '-')}</p></div><div class="admin-client-row__storage"><span>FILES / STORAGE</span><strong>${Number(item.documentCount || 0)} FILES</strong><p>${formatBytes(item.storageBytes || 0)}</p></div><div class="admin-client-row__portal"><span class="${portal ? 'is-on' : ''}">${portal ? 'PORTAL ON' : 'PORTAL OFF'}</span><i>MANAGE →</i></div></button></article>`;
};

const renderClients = () => {
  renderStats();
  document.querySelectorAll('[data-client-stage]').forEach((button) => button.classList.toggle('is-active', button.dataset.clientStage === activeStage));
  const items = filteredClients();
  const total = document.querySelector('[data-client-total]');
  if (total) total.textContent = `${items.length} CLIENTS`;
  const list = listNode();
  if (!list) return;
  list.innerHTML = items.length ? items.map(clientRowHTML).join('') : '<div class="admin-empty-live">조건에 맞는 클라이언트가 없습니다.</div>';
};

const setActiveModalTab = (key = 'overview') => {
  document.querySelectorAll('[data-client-modal-tab]').forEach((button) => button.classList.toggle('is-active', button.dataset.clientModalTab === key));
  document.querySelectorAll('[data-client-pane]').forEach((pane) => pane.classList.toggle('is-active', pane.dataset.clientPane === key));
};

const fillForm = (item = null) => {
  const node = form();
  if (!node) return;
  const data = item || {};
  const values = {
    clientId: data.id || '', clientStage: normalizeStage(data.clientStage || (item ? 'client' : 'prospect')),
    company: clientName(data) === '이름 없음' ? '' : clientName(data), projectName: data.projectName || '', contactName: data.contactName || '', email: data.email || '', phone: data.phone || '', scope: data.scope || '', internalMemo: data.internalMemo || '', contractType: data.contractType || '', contractStatus: data.contractStatus || 'draft', contractStart: data.contractStart || '', contractEnd: data.contractEnd || '', contractAmount: data.contractAmount || '', paymentTerms: data.paymentTerms || '', portalMessage: data.portalMessage || ''
  };
  Object.entries(values).forEach(([name, value]) => { const field = node.elements.namedItem(name); if (field) field.value = value; });
  node.elements.namedItem('portalEnabled').checked = Boolean(data.portalEnabled);
  const linkInput = document.querySelector('[data-client-portal-link]');
  const openLink = document.querySelector('[data-client-open-link]');
  const link = portalURL(data);
  if (linkInput) linkInput.value = link;
  if (openLink) { openLink.href = link || '#'; openLink.toggleAttribute('aria-disabled', !link); }
  const title = document.querySelector('[data-client-modal-title]');
  if (title) title.textContent = item ? clientName(item) : 'New Client';
  const saveStatus = document.querySelector('[data-client-save-status]');
  if (saveStatus) saveStatus.textContent = '';
  setActiveModalTab('overview');
};

const stopFileStream = () => {
  if (unsubscribeFiles) unsubscribeFiles();
  unsubscribeFiles = null;
  clientFiles = [];
};

function startFileStream(clientId) {
  stopFileStream();
  if (!db || !clientId) return;
  const filesQuery = query(collection(db, 'clients', clientId, 'files'), orderBy('createdAt', 'desc'));
  unsubscribeFiles = onSnapshot(filesQuery, (snapshot) => {
    clientFiles = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderFiles();
  }, (error) => {
    console.warn('[NINEWORKS Clients] file stream failed', error);
    clientFiles = [];
    renderFiles('파일 목록을 불러오지 못했습니다.');
  });
}

const openModal = (id = '') => {
  selectedClientId = id;
  fillForm(id ? getClient(id) : null);
  const node = modal();
  if (node) node.hidden = false;
  document.body.classList.add('admin-client-modal-open');
  if (id) startFileStream(id); else stopFileStream();
  renderFiles();
};

const closeModal = () => {
  if (uploadTask) return;
  const node = modal();
  if (node) node.hidden = true;
  document.body.classList.remove('admin-client-modal-open');
  selectedClientId = '';
  stopFileStream();
};

const clientPrivatePayload = (node, existing = {}) => ({
  company: safeText(node.elements.namedItem('company').value),
  projectName: safeText(node.elements.namedItem('projectName').value),
  contactName: safeText(node.elements.namedItem('contactName').value),
  email: safeText(node.elements.namedItem('email').value),
  phone: safeText(node.elements.namedItem('phone').value),
  clientStage: normalizeStage(node.elements.namedItem('clientStage').value),
  scope: safeText(node.elements.namedItem('scope').value),
  internalMemo: safeText(node.elements.namedItem('internalMemo').value),
  contractType: safeText(node.elements.namedItem('contractType').value),
  contractStatus: safeText(node.elements.namedItem('contractStatus').value) || 'draft',
  contractStart: safeText(node.elements.namedItem('contractStart').value),
  contractEnd: safeText(node.elements.namedItem('contractEnd').value),
  contractAmount: safeText(node.elements.namedItem('contractAmount').value),
  paymentTerms: safeText(node.elements.namedItem('paymentTerms').value),
  portalEnabled: node.elements.namedItem('portalEnabled').checked,
  portalMessage: safeText(node.elements.namedItem('portalMessage').value),
  portalKey: existing.portalKey || generatePortalKey(),
  updatedAt: serverTimestamp()
});

const portalPayload = (clientId, data) => ({
  clientId, company: data.company, projectName: data.projectName, clientStage: data.clientStage, scope: data.scope,
  contractType: data.contractType, contractStatus: data.contractStatus, contractStart: data.contractStart, contractEnd: data.contractEnd,
  contractAmount: data.contractAmount, paymentTerms: data.paymentTerms, portalMessage: data.portalMessage,
  enabled: Boolean(data.portalEnabled), updatedAt: serverTimestamp()
});

const syncVisibleFileMetadata = async (clientId, portalKey) => {
  if (!portalKey) return;
  await Promise.all(clientFiles.map(async (file) => {
    const publicRef = doc(db, 'clientPortals', portalKey, 'files', file.id);
    if (file.visible) {
      await setDoc(publicRef, { clientId, title: file.title || file.originalName || 'Document', category: file.category || 'other', originalName: file.originalName || '', size: Number(file.size || 0), contentType: file.contentType || '', storagePath: file.storagePath || '', createdAt: file.createdAt || serverTimestamp() }, { merge: true });
    } else await deleteDoc(publicRef).catch(() => {});
  }));
};

const saveClient = async (event) => {
  event.preventDefault();
  if (!db) return;
  const node = event.currentTarget;
  const status = document.querySelector('[data-client-save-status]');
  const submit = node.querySelector('button[type="submit"]');
  const id = safeText(node.elements.namedItem('clientId').value);
  const existing = id ? getClient(id) || {} : {};
  const payload = clientPrivatePayload(node, existing);
  if (!payload.company) return;
  try {
    submit.disabled = true;
    if (status) status.textContent = '저장 중...';
    let clientId = id;
    if (clientId) await updateDoc(doc(db, 'clients', clientId), payload);
    else {
      const created = await addDoc(collection(db, 'clients'), { ...payload, documentCount: 0, storageBytes: 0, createdAt: serverTimestamp() });
      clientId = created.id;
      node.elements.namedItem('clientId').value = clientId;
      selectedClientId = clientId;
      startFileStream(clientId);
    }
    await setDoc(doc(db, 'clientPortals', payload.portalKey), portalPayload(clientId, payload), { merge: true });
    await syncVisibleFileMetadata(clientId, payload.portalKey);
    const link = `${location.origin}/client/?key=${encodeURIComponent(payload.portalKey)}`;
    const linkInput = document.querySelector('[data-client-portal-link]');
    const openLink = document.querySelector('[data-client-open-link]');
    if (linkInput) linkInput.value = link;
    if (openLink) { openLink.href = link; openLink.removeAttribute('aria-disabled'); }
    if (status) status.textContent = '저장되었습니다.';
  } catch (error) {
    console.error('[NINEWORKS Clients] save failed', error);
    if (status) status.textContent = '저장하지 못했습니다. Firebase Rules를 확인해 주세요.';
  } finally { submit.disabled = false; }
};

const fileRowHTML = (file) => `<article class="admin-client-file-row" data-client-file-id="${escapeHTML(file.id)}"><div class="admin-client-file-row__type"><span>${escapeHTML(CATEGORY_LABELS[file.category] || '기타')}</span><small>${file.visible ? 'PORTAL ON' : 'PRIVATE'}</small></div><div class="admin-client-file-row__name"><strong>${escapeHTML(file.title || file.originalName || 'Document')}</strong><p>${escapeHTML(file.originalName || '-')} · ${formatBytes(file.size || 0)} · ${escapeHTML(formatDateTime(file.createdAt))}</p></div><div class="admin-client-file-row__actions"><button type="button" data-client-file-open="${escapeHTML(file.id)}">OPEN ↗</button><button type="button" data-client-file-visibility="${escapeHTML(file.id)}">${file.visible ? 'HIDE' : 'PUBLISH'}</button><button type="button" class="is-danger" data-client-file-delete="${escapeHTML(file.id)}">DELETE</button></div></article>`;

function renderFiles(message = '') {
  const node = document.querySelector('[data-client-files]');
  if (!node) return;
  if (message) { node.innerHTML = `<div class="admin-client-file-empty">${escapeHTML(message)}</div>`; return; }
  node.innerHTML = clientFiles.length ? clientFiles.map(fileRowHTML).join('') : '<div class="admin-client-file-empty">저장된 파일이 없습니다.</div>';
}

const setProgress = (percent = 0, visible = true) => {
  const progress = document.querySelector('[data-client-upload-progress]');
  if (!progress) return;
  progress.hidden = !visible;
  progress.style.setProperty('--client-upload-progress', `${Math.max(0, Math.min(100, percent))}%`);
  const text = progress.querySelector('span');
  if (text) text.textContent = `${Math.round(percent)}%`;
};

const uploadClientFile = async () => {
  if (!db || !storage || uploadTask) return;
  const clientId = selectedClientId || safeText(form()?.elements.namedItem('clientId')?.value);
  if (!clientId) { alert('먼저 클라이언트 기본 정보를 저장해 주세요.'); return; }
  const client = getClient(clientId) || {};
  let portalKey = client.portalKey;
  if (!portalKey) {
    const currentPayload = clientPrivatePayload(form(), client);
    portalKey = currentPayload.portalKey;
    await updateDoc(doc(db, 'clients', clientId), { portalKey, updatedAt: serverTimestamp() });
    await setDoc(doc(db, 'clientPortals', portalKey), portalPayload(clientId, currentPayload), { merge: true });
    client.portalKey = portalKey;
  }
  const fileInput = document.querySelector('[data-client-upload-file]');
  const titleInput = document.querySelector('[data-client-upload-title]');
  const categoryInput = document.querySelector('[data-client-upload-category]');
  const visibleInput = document.querySelector('[data-client-upload-visible]');
  const uploadButton = document.querySelector('[data-client-upload]');
  const file = fileInput?.files?.[0];
  if (!file) { alert('업로드할 파일을 선택해 주세요.'); return; }
  if (file.size > MAX_FILE_SIZE) { alert('한 파일은 50MB 이하로 업로드해 주세요.'); return; }
  const fileDoc = doc(collection(db, 'clients', clientId, 'files'));
  const fileId = fileDoc.id;
  const safeName = file.name.replace(/[^0-9A-Za-z가-힣._-]+/g, '_').slice(-120) || 'document';
  const path = `client-portals/${portalKey}/${clientId}/${fileId}/${safeName}`;
  const ref = storageRef(storage, path);
  const title = safeText(titleInput?.value) || file.name;
  const category = safeText(categoryInput?.value) || 'other';
  const visible = Boolean(visibleInput?.checked);
  try {
    uploadButton.disabled = true;
    setProgress(0, true);
    uploadTask = uploadBytesResumable(ref, file, { contentType: file.type || 'application/octet-stream' });
    await new Promise((resolve, reject) => uploadTask.on('state_changed', (snapshot) => setProgress(snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes * 100 : 0, true), reject, resolve));
    const metadata = { title, category, originalName: file.name, size: file.size, contentType: file.type || 'application/octet-stream', storagePath: path, visible, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    await setDoc(fileDoc, metadata);
    if (visible) await setDoc(doc(db, 'clientPortals', portalKey, 'files', fileId), { clientId, title, category, originalName: file.name, size: file.size, contentType: metadata.contentType, storagePath: path, createdAt: serverTimestamp() });
    await updateDoc(doc(db, 'clients', clientId), { documentCount: increment(1), storageBytes: increment(file.size), updatedAt: serverTimestamp() });
    if (fileInput) fileInput.value = '';
    if (titleInput) titleInput.value = '';
    const fileName = document.querySelector('[data-client-file-name]');
    if (fileName) fileName.textContent = '파일 선택';
    setProgress(100, true);
    setTimeout(() => setProgress(0, false), 500);
  } catch (error) {
    console.error('[NINEWORKS Clients] upload failed', error);
    setProgress(0, false);
    alert('파일 업로드에 실패했습니다. Storage Rules 또는 요금제 설정을 확인해 주세요.');
  } finally { uploadTask = null; uploadButton.disabled = false; }
};

const openClientFile = async (fileId) => {
  const file = clientFiles.find((item) => item.id === fileId);
  if (!file?.storagePath || !storage) return;
  try { const url = await getDownloadURL(storageRef(storage, file.storagePath)); window.open(url, '_blank', 'noopener'); }
  catch (error) { console.error('[NINEWORKS Clients] open file failed', error); alert('파일을 열 수 없습니다. Storage Rules를 확인해 주세요.'); }
};

const toggleFileVisibility = async (fileId) => {
  const clientId = selectedClientId;
  const client = getClient(clientId);
  const file = clientFiles.find((item) => item.id === fileId);
  if (!clientId || !client || !file || !client.portalKey) return;
  const next = !file.visible;
  try {
    await updateDoc(doc(db, 'clients', clientId, 'files', fileId), { visible: next, updatedAt: serverTimestamp() });
    const publicRef = doc(db, 'clientPortals', client.portalKey, 'files', fileId);
    if (next) await setDoc(publicRef, { clientId, title: file.title || file.originalName || 'Document', category: file.category || 'other', originalName: file.originalName || '', size: Number(file.size || 0), contentType: file.contentType || '', storagePath: file.storagePath || '', createdAt: file.createdAt || serverTimestamp() }, { merge: true });
    else await deleteDoc(publicRef).catch(() => {});
  } catch (error) { console.error('[NINEWORKS Clients] visibility update failed', error); alert('공개 상태를 변경하지 못했습니다.'); }
};

const deleteClientFile = async (fileId) => {
  const clientId = selectedClientId;
  const client = getClient(clientId);
  const file = clientFiles.find((item) => item.id === fileId);
  if (!clientId || !client || !file) return;
  if (!confirm(`“${file.title || file.originalName || '파일'}”을 삭제할까요?`)) return;
  try {
    if (file.storagePath) await deleteObject(storageRef(storage, file.storagePath)).catch(() => {});
    await deleteDoc(doc(db, 'clients', clientId, 'files', fileId));
    if (client.portalKey) await deleteDoc(doc(db, 'clientPortals', client.portalKey, 'files', fileId)).catch(() => {});
    await updateDoc(doc(db, 'clients', clientId), { documentCount: increment(-1), storageBytes: increment(-Number(file.size || 0)), updatedAt: serverTimestamp() });
  } catch (error) { console.error('[NINEWORKS Clients] delete file failed', error); alert('파일을 삭제하지 못했습니다.'); }
};

const startClients = () => {
  if (unsubscribeClients || !db) return;
  unsubscribeClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
    clients = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a, b) => (asDate(b.updatedAt || b.createdAt)?.getTime() || 0) - (asDate(a.updatedAt || a.createdAt)?.getTime() || 0));
    renderClients();
    if (selectedClientId) {
      const selected = getClient(selectedClientId);
      if (selected) {
        const link = portalURL(selected);
        const linkInput = document.querySelector('[data-client-portal-link]');
        const openLink = document.querySelector('[data-client-open-link]');
        if (linkInput && link) linkInput.value = link;
        if (openLink && link) { openLink.href = link; openLink.removeAttribute('aria-disabled'); }
      }
    }
  }, (error) => {
    console.error('[NINEWORKS Clients] stream failed', error);
    const list = listNode();
    if (list) list.innerHTML = '<div class="admin-empty-live">클라이언트 데이터를 불러오지 못했습니다. Firebase Rules 배포 상태를 확인해 주세요.</div>';
  });
};

const stopClients = () => {
  if (unsubscribeClients) unsubscribeClients();
  unsubscribeClients = null;
  stopFileStream();
  clients = [];
  renderClients();
};

const bindUI = () => {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a, [data-client-close]');
    if (!target) return;
    if (target.matches('[data-client-add]')) openModal('');
    if (target.matches('[data-client-open]')) openModal(target.dataset.clientOpen);
    if (target.matches('[data-client-close]')) closeModal();
    if (target.matches('[data-client-modal-tab]')) setActiveModalTab(target.dataset.clientModalTab);
    if (target.matches('[data-client-stage]')) { activeStage = target.dataset.clientStage; renderClients(); }
    if (target.matches('[data-client-summary]')) { activeStage = target.dataset.clientSummary; renderClients(); }
    if (target.matches('[data-client-upload]')) uploadClientFile();
    if (target.matches('[data-client-file-open]')) openClientFile(target.dataset.clientFileOpen);
    if (target.matches('[data-client-file-visibility]')) toggleFileVisibility(target.dataset.clientFileVisibility);
    if (target.matches('[data-client-file-delete]')) deleteClientFile(target.dataset.clientFileDelete);
    if (target.matches('[data-client-copy-link]')) {
      const input = document.querySelector('[data-client-portal-link]');
      if (input?.value) navigator.clipboard.writeText(input.value).then(() => { target.textContent = 'COPIED'; setTimeout(() => { target.textContent = 'COPY LINK'; }, 1000); });
    }
  });
  document.querySelector('[data-client-search]')?.addEventListener('input', (event) => { searchTerm = String(event.currentTarget.value || '').trim().toLowerCase(); renderClients(); });
  document.querySelector('[data-client-form]')?.addEventListener('submit', saveClient);
  document.querySelector('[data-client-upload-file]')?.addEventListener('change', (event) => { const text = document.querySelector('[data-client-file-name]'); if (text) text.textContent = event.currentTarget.files?.[0]?.name || '파일 선택'; });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal()?.hidden) closeModal(); });
};

bindUI();

if (!firebaseConfigReady || firebaseInitError || !auth || !db) {
  const list = listNode();
  if (list) list.innerHTML = '<div class="admin-empty-live">Firebase 설정을 확인해 주세요.</div>';
} else {
  onAuthStateChanged(auth, (user) => {
    const email = String(user?.email || '').toLowerCase();
    if (user && email === ADMIN_EMAIL) startClients(); else stopClients();
  });
}

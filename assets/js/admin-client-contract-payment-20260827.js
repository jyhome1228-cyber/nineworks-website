import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const CONSENT_SERVICE = 'CLIENT CONTRACT CONSENT';
const PAYMENT_LABELS = {
  deposit_waiting: '선금 입금대기중',
  deposit_confirmed: '선금입금확인',
  balance_confirmed: '잔금입금확인'
};

let clients = new Map();
let consents = new Map();
let unsubscribeClients = null;
let unsubscribeInquiries = null;
let observer = null;
let phytoDefaultEnsured = false;

const loadStyle = () => {
  if (document.querySelector('link[data-admin-client-contract-payment]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-clients-refine-20260827.css?v=20260827-1';
  link.dataset.adminClientContractPayment = 'true';
  document.head.appendChild(link);
};

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
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};

const consentClientId = (data = {}) => {
  const match = String(data.details || '').match(/(?:^|\n)clientId:\s*([^\n]+)/i);
  if (match?.[1]) return match[1].trim();
  if (/파이토레볼루션|PhytoRevolution|고스란/i.test(String(data.company || ''))) return 'phyto';
  return '';
};

const paymentStatus = (client = {}) => PAYMENT_LABELS[client.paymentStatus] ? client.paymentStatus : 'deposit_waiting';

const ensureTableHead = () => {
  const filter = document.querySelector('.admin-client-filter-panel');
  if (!filter || document.querySelector('.admin-client-table-head')) return;
  const head = document.createElement('div');
  head.className = 'admin-client-table-head';
  head.innerHTML = '<span>CLIENT / PROJECT</span><span>CONTRACT</span><span>CONTACT</span><span>FILES / STORAGE</span><span>STATUS</span>';
  filter.insertAdjacentElement('afterend', head);
};

const decorateRows = () => {
  document.querySelectorAll('.admin-client-row[data-client-id]').forEach((row) => {
    const id = row.dataset.clientId || '';
    const client = clients.get(id) || {};
    const agreed = consents.get(id);
    const name = row.querySelector('.admin-client-row__name');
    if (!name) return;

    let statusLine = name.querySelector('.admin-client-row__statusline');
    if (!statusLine) {
      statusLine = document.createElement('div');
      statusLine.className = 'admin-client-row__statusline';
      name.appendChild(statusLine);
    }

    statusLine.innerHTML = `
      <span class="admin-client-state-chip ${agreed ? 'is-complete' : 'is-waiting'}">${agreed ? '계약 동의완료' : '계약 동의대기'}</span>
      <span class="admin-client-state-chip is-payment">${PAYMENT_LABELS[paymentStatus(client)]}</span>`;
  });
};

const ensureContractPanel = () => {
  const pane = document.querySelector('[data-client-pane="contract"]');
  if (!pane || pane.querySelector('[data-client-contract-live]')) return;
  const block = document.createElement('section');
  block.className = 'admin-client-contract-live';
  block.dataset.clientContractLive = 'true';
  block.innerHTML = `
    <div class="admin-client-contract-live__item">
      <span>CLIENT CONSENT</span>
      <strong data-client-consent-state>동의 대기</strong>
      <p data-client-consent-meta>아직 클라이언트의 계약 확인 기록이 없습니다.</p>
    </div>
    <label class="admin-client-contract-live__item admin-client-payment-control">
      <span>PAYMENT STATUS</span>
      <select data-client-payment-status>
        <option value="deposit_waiting">선금 입금대기중</option>
        <option value="deposit_confirmed">선금입금확인</option>
        <option value="balance_confirmed">잔금입금확인</option>
      </select>
      <p>변경 시 고객 전용 대시보드에도 동일하게 표시됩니다.</p>
    </label>`;
  pane.prepend(block);
};

const syncContractPanel = () => {
  ensureContractPanel();
  const id = String(document.querySelector('[data-client-form] input[name="clientId"]')?.value || '').trim();
  const state = document.querySelector('[data-client-consent-state]');
  const meta = document.querySelector('[data-client-consent-meta]');
  const select = document.querySelector('[data-client-payment-status]');
  if (!id || !state || !meta || !select) return;

  const consent = consents.get(id);
  state.textContent = consent ? '동의 완료' : '동의 대기';
  state.classList.toggle('is-complete', Boolean(consent));
  meta.textContent = consent
    ? `${formatDateTime(consent.createdAt)} · 웹 계약서에서 동의 기록됨`
    : '아직 클라이언트의 계약 확인 기록이 없습니다.';

  const client = clients.get(id) || {};
  const value = paymentStatus(client);
  if (select.value !== value) select.value = value;
  select.dataset.clientId = id;
};

const syncUI = () => {
  loadStyle();
  ensureTableHead();
  decorateRows();
  syncContractPanel();
};

const ensurePhytoPaymentDefault = async () => {
  if (phytoDefaultEnsured || !db) return;
  const phyto = clients.get('phyto');
  if (!phyto) return;
  phytoDefaultEnsured = true;
  try {
    if (!PAYMENT_LABELS[phyto.paymentStatus]) {
      await updateDoc(doc(db, 'clients', 'phyto'), { paymentStatus: 'deposit_waiting', updatedAt: serverTimestamp() });
    }
    await setDoc(doc(db, 'clientPortals', 'phyto'), {
      clientId: 'phyto', enabled: true,
      paymentStatus: PAYMENT_LABELS[phyto.paymentStatus] ? phyto.paymentStatus : 'deposit_waiting',
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('[NINEWORKS Admin] phyto payment default sync failed', error);
  }
};

const savePaymentStatus = async (select) => {
  const id = select.dataset.clientId || String(document.querySelector('[data-client-form] input[name="clientId"]')?.value || '').trim();
  const value = select.value;
  if (!id || !PAYMENT_LABELS[value] || !db) return;
  select.disabled = true;
  try {
    await updateDoc(doc(db, 'clients', id), { paymentStatus: value, updatedAt: serverTimestamp() });
    const client = clients.get(id) || {};
    if (id === 'phyto') {
      await setDoc(doc(db, 'clientPortals', 'phyto'), { clientId: 'phyto', enabled: true, paymentStatus: value, updatedAt: serverTimestamp() }, { merge: true });
    } else if (client.portalKey && client.portalEnabled) {
      await setDoc(doc(db, 'clientPortals', client.portalKey), { enabled: true, paymentStatus: value, updatedAt: serverTimestamp() }, { merge: true });
    }
  } catch (error) {
    console.error('[NINEWORKS Admin] payment status update failed', error);
    alert('결제 상태를 저장하지 못했습니다.');
  } finally {
    select.disabled = false;
  }
};

const startStreams = () => {
  if (!db) return;
  unsubscribeClients?.();
  unsubscribeInquiries?.();

  unsubscribeClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
    clients = new Map(snapshot.docs.map((item) => [item.id, { id: item.id, ...item.data() }]));
    ensurePhytoPaymentDefault();
    syncUI();
  }, (error) => console.warn('[NINEWORKS Admin] client status stream failed', error));

  unsubscribeInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    const next = new Map();
    snapshot.docs.forEach((item) => {
      const data = { id: item.id, ...item.data() };
      if (String(data.service || '').trim().toUpperCase() !== CONSENT_SERVICE) return;
      const id = consentClientId(data);
      if (!id) return;
      const previous = next.get(id);
      const currentTime = asDate(data.createdAt)?.getTime() || 0;
      const previousTime = asDate(previous?.createdAt)?.getTime() || 0;
      if (!previous || currentTime >= previousTime) next.set(id, data);
    });
    consents = next;
    syncUI();
  }, (error) => console.warn('[NINEWORKS Admin] contract consent stream failed', error));
};

const start = () => {
  loadStyle();
  observer = new MutationObserver(() => requestAnimationFrame(syncUI));
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', () => setTimeout(syncUI, 0), true);
  document.addEventListener('change', (event) => {
    const select = event.target.closest?.('[data-client-payment-status]');
    if (select) savePaymentStatus(select);
  }, true);
  window.addEventListener('nw-admin-panel', syncUI);

  onAuthStateChanged(auth, (user) => {
    if (String(user?.email || '').toLowerCase() === ADMIN_EMAIL) startStreams();
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

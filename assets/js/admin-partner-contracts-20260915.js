import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const CONTRACT = Object.freeze({
  id: 'internal-rpbio-shinminyong-20260915',
  partnerEmail: 's.nninyong@gmail.com',
  partnerName: '신민용',
  company: '알피바이오',
  clientKey: 'rpbio',
  projectName: '알피바이오 프로젝트',
  projectType: '프로젝트 전반 어시스트',
  service: '프로젝트 전반 어시스트',
  summary: '알피바이오 프로젝트 전반 어시스트',
  status: 'open',
  projectStage: 'active',
  feeAmount: 5000000,
  paymentType: 'freelancer',
  withholdingRate: 0.033,
  withholdingAmount: 165000,
  advanceAmount: 2500000,
  balanceGrossAmount: 2500000,
  balanceNetAmount: 2335000,
  totalNetAmount: 4835000,
  withholdingTiming: 'balance',
  balanceCondition: '알피바이오 프로젝트 잔금 입금 시',
  scope: '프로젝트 전반 어시스트',
  contractStatus: 'active',
  effectiveDate: '2026-09-15',
  internalOnly: true,
  clientVisible: false,
  linkedClient: 'rpbio',
  source: 'INTERNAL_PARTNER_CONTRACT'
});

const workspaceId = encodeURIComponent(CONTRACT.partnerEmail.toLowerCase());
let workspaceUnsub = null;
let contractUnsub = null;
let lastRenderedContract = CONTRACT;

const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');

const workspaceAssignment = (contract = CONTRACT) => ({
  id: contract.id,
  company: contract.company,
  projectName: contract.projectName,
  service: contract.service,
  projectType: contract.projectType,
  status: contract.status,
  summary: contract.summary,
  feeAmount: contract.feeAmount,
  projectStage: contract.projectStage,
  proposalUrl: '',
  paymentType: contract.paymentType,
  withholdingRate: contract.withholdingRate,
  withholdingAmount: contract.withholdingAmount,
  advanceAmount: contract.advanceAmount,
  balanceGrossAmount: contract.balanceGrossAmount,
  balanceNetAmount: contract.balanceNetAmount,
  totalNetAmount: contract.totalNetAmount,
  withholdingTiming: contract.withholdingTiming,
  balanceCondition: contract.balanceCondition,
  scope: contract.scope,
  internalOnly: true,
  clientVisible: false,
  linkedClient: contract.linkedClient,
  source: contract.source
});

const sameAssignment = (a = {}, b = {}) => [
  'id', 'company', 'projectName', 'service', 'projectType', 'status', 'summary',
  'feeAmount', 'projectStage', 'paymentType', 'withholdingRate', 'withholdingAmount',
  'advanceAmount', 'balanceGrossAmount', 'balanceNetAmount', 'totalNetAmount',
  'withholdingTiming', 'balanceCondition', 'scope', 'internalOnly', 'clientVisible',
  'linkedClient', 'source'
].every((key) => String(a?.[key] ?? '') === String(b?.[key] ?? ''));

const syncContractRecord = async () => {
  await setDoc(doc(db, 'partnerContracts', CONTRACT.id), {
    ...CONTRACT,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

const syncWorkspaceContract = () => {
  workspaceUnsub?.();
  workspaceUnsub = onSnapshot(doc(db, 'partnerWorkspaces', workspaceId), async (snapshot) => {
    const data = snapshot.exists() ? (snapshot.data() || {}) : {};
    const assignments = Array.isArray(data.assignments) ? data.assignments : [];
    const wanted = workspaceAssignment(lastRenderedContract || CONTRACT);
    const existingIndex = assignments.findIndex((item) => String(item?.id || '') === CONTRACT.id);
    const existing = existingIndex >= 0 ? assignments[existingIndex] : null;
    if (existing && sameAssignment(existing, wanted)) return;

    const next = assignments.filter((item) => String(item?.id || '') !== CONTRACT.id);
    next.push(wanted);
    try {
      await setDoc(doc(db, 'partnerWorkspaces', workspaceId), {
        name: CONTRACT.partnerName,
        email: CONTRACT.partnerEmail,
        assignments: next,
        projectCount: next.length,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.warn('[NINEWORKS Admin] internal partner workspace sync skipped', error);
    }
  }, (error) => console.warn('[NINEWORKS Admin] internal workspace stream skipped', error));
};

const injectStyle = () => {
  if (document.querySelector('style[data-partner-contract-admin-style]')) return;
  const style = document.createElement('style');
  style.dataset.partnerContractAdminStyle = 'true';
  style.textContent = `
    .nw-contracts-admin{grid-column:1/-1;margin-top:18px;padding-top:18px;border-top:1px solid var(--line,#ddd)}
    .nw-contracts-admin__head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:12px}
    .nw-contracts-admin__head span{display:block;color:#8a8a8a;font-size:9px;letter-spacing:.08em;text-transform:uppercase}
    .nw-contracts-admin__head strong{display:block;margin-top:5px;font-size:16px;font-weight:500;letter-spacing:-.025em}
    .nw-contracts-admin__badge{padding:5px 8px;border:1px solid #cfd8cf;background:#f4f8f4;color:#426247;font-size:8px;letter-spacing:.04em;white-space:nowrap}
    .nw-contracts-admin__grid{display:grid;grid-template-columns:1.25fr repeat(5,minmax(92px,.72fr));border:1px solid var(--line,#ddd);background:#fff}
    .nw-contracts-admin__cell{min-width:0;padding:12px;border-right:1px solid var(--line,#ddd)}
    .nw-contracts-admin__cell:last-child{border-right:0}.nw-contracts-admin__cell span{display:block;color:#929292;font-size:8px;letter-spacing:.04em}
    .nw-contracts-admin__cell b{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.45;word-break:keep-all}
    .nw-contracts-admin__note{margin-top:10px;padding:11px 12px;background:#f6f6f3;color:#666;font-size:9px;line-height:1.65}
    .nw-contracts-admin__note strong{color:#111;font-weight:600}
    @media(max-width:1100px){.nw-contracts-admin__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.nw-contracts-admin__cell{border-bottom:1px solid var(--line,#ddd)}}
    @media(max-width:720px){.nw-contracts-admin__grid{grid-template-columns:1fr}.nw-contracts-admin__cell{border-right:0}}
  `;
  document.head.appendChild(style);
};

const renderContractPanel = (contract = CONTRACT) => {
  injectStyle();
  const partnersPanel = document.querySelector('[data-admin-panel="partners"]');
  if (!partnersPanel) return false;
  let box = partnersPanel.querySelector('[data-internal-partner-contracts]');
  if (!box) {
    box = document.createElement('section');
    box.className = 'nw-contracts-admin';
    box.dataset.internalPartnerContracts = 'true';
    const list = partnersPanel.querySelector('[data-admin-partner-lite-list]');
    if (list) list.insertAdjacentElement('afterend', box);
    else partnersPanel.appendChild(box);
  }
  const signature = [contract.partnerName, contract.company, contract.scope, contract.feeAmount, contract.advanceAmount, contract.withholdingAmount, contract.balanceNetAmount, contract.totalNetAmount, contract.balanceCondition].join('|');
  if (box.dataset.contractSignature === signature) return true;
  box.dataset.contractSignature = signature;
  box.innerHTML = `
    <div class="nw-contracts-admin__head">
      <div><span>Freelancer Contract · Internal Only</span><strong>프리랜서 계약 / 프로젝트 연동</strong></div>
      <em class="nw-contracts-admin__badge">CLIENT HIDDEN</em>
    </div>
    <div class="nw-contracts-admin__grid">
      <div class="nw-contracts-admin__cell"><span>PARTNER / PROJECT</span><b>${escapeHTML(contract.partnerName)} · ${escapeHTML(contract.company)}<br>${escapeHTML(contract.scope)}</b></div>
      <div class="nw-contracts-admin__cell"><span>계약금액</span><b>${money(contract.feeAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>선금</span><b>${money(contract.advanceAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>원천징수 3.3%</span><b>${money(contract.withholdingAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>잔금 실지급</span><b>${money(contract.balanceNetAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>총 실지급</span><b>${money(contract.totalNetAmount)}</b></div>
    </div>
    <div class="nw-contracts-admin__note"><strong>지급 조건</strong> · 선금 ${money(contract.advanceAmount)} 지급. 잔금은 ${escapeHTML(contract.balanceCondition)} 전체 계약금액 기준 원천징수 3.3%(${money(contract.withholdingAmount)})를 잔금에서 공제한 ${money(contract.balanceNetAmount)} 지급. · <strong>클라이언트 비노출</strong> · 이 계약 데이터는 partnerContracts / partnerWorkspaces 내부 경로에만 연결하며 알피바이오 클라이언트 대시보드에는 전달하지 않습니다.</div>`;
  return true;
};

const keepPanelMounted = () => {
  const mount = () => renderContractPanel(lastRenderedContract || CONTRACT);
  mount();
  const observer = new MutationObserver(() => {
    const mounted = document.querySelector('[data-admin-panel="partners"] [data-internal-partner-contracts]');
    if (!mounted) mount();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('nw-admin-panel', (event) => {
    if (event.detail?.panel === 'partners') mount();
  });
};

const start = async () => {
  try { await syncContractRecord(); }
  catch (error) { console.warn('[NINEWORKS Admin] partner contract seed skipped', error); }

  contractUnsub?.();
  contractUnsub = onSnapshot(doc(db, 'partnerContracts', CONTRACT.id), (snapshot) => {
    lastRenderedContract = snapshot.exists() ? { ...CONTRACT, ...(snapshot.data() || {}) } : CONTRACT;
    renderContractPanel(lastRenderedContract);
  }, () => renderContractPanel(CONTRACT));

  syncWorkspaceContract();
  keepPanelMounted();
};

if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (String(user?.email || '').trim().toLowerCase() === ADMIN_EMAIL) start();
  });
}

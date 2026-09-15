import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const CONTRACT = Object.freeze({
  legacyId: 'internal-rpbio-shinminyong-20260915',
  partnerEmail: 's.nninyong@gmail.com',
  partnerName: '신민용',
  company: '알피바이오',
  projectName: '건강기능식품 신규 브랜드 런칭',
  scope: '프로젝트 전반 어시스트',
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
  effectiveDate: '2026-09-15',
  contractStatus: 'active',
  internalOnly: true,
  clientVisible: false,
  linkedClient: 'rpbio',
  source: 'INTERNAL_PARTNER_CONTRACT'
});

const workspaceId = encodeURIComponent(CONTRACT.partnerEmail.toLowerCase());
let workspaceUnsub = null;
let syncing = false;
const inquirySyncDone = new Set();

const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');

const isRpBioAssignment = (item = {}) => {
  const company = String(item.company || '').trim();
  const title = String(item.projectName || '').trim();
  return item.id !== CONTRACT.legacyId
    && (company.includes(CONTRACT.company) || title.includes('건강기능식품 신규 브랜드 런칭'));
};

const enrichAssignment = (item = {}) => ({
  ...item,
  company: item.company || CONTRACT.company,
  projectName: item.projectName || CONTRACT.projectName,
  projectStage: 'active',
  status: item.status === 'done' ? 'open' : (item.status || 'open'),
  feeAmount: CONTRACT.feeAmount,
  paymentType: CONTRACT.paymentType,
  withholdingRate: CONTRACT.withholdingRate,
  withholdingAmount: CONTRACT.withholdingAmount,
  advanceAmount: CONTRACT.advanceAmount,
  balanceGrossAmount: CONTRACT.balanceGrossAmount,
  balanceNetAmount: CONTRACT.balanceNetAmount,
  totalNetAmount: CONTRACT.totalNetAmount,
  withholdingTiming: CONTRACT.withholdingTiming,
  balanceCondition: CONTRACT.balanceCondition,
  scope: CONTRACT.scope,
  effectiveDate: CONTRACT.effectiveDate,
  contractStatus: CONTRACT.contractStatus,
  internalOnly: true,
  clientVisible: false,
  linkedClient: CONTRACT.linkedClient,
  contractSource: CONTRACT.source
});

const relevantSignature = (item = {}) => JSON.stringify({
  id: item.id || '',
  company: item.company || '',
  projectName: item.projectName || '',
  projectStage: item.projectStage || '',
  status: item.status || '',
  feeAmount: Number(item.feeAmount || 0),
  paymentType: item.paymentType || '',
  withholdingRate: Number(item.withholdingRate || 0),
  withholdingAmount: Number(item.withholdingAmount || 0),
  advanceAmount: Number(item.advanceAmount || 0),
  balanceGrossAmount: Number(item.balanceGrossAmount || 0),
  balanceNetAmount: Number(item.balanceNetAmount || 0),
  totalNetAmount: Number(item.totalNetAmount || 0),
  withholdingTiming: item.withholdingTiming || '',
  balanceCondition: item.balanceCondition || '',
  scope: item.scope || '',
  effectiveDate: item.effectiveDate || '',
  contractStatus: item.contractStatus || '',
  internalOnly: item.internalOnly === true,
  clientVisible: item.clientVisible === false,
  linkedClient: item.linkedClient || '',
  contractSource: item.contractSource || ''
});

const syncInquiryState = async (assignment = {}) => {
  const id = String(assignment.id || '').trim();
  if (!id || id === CONTRACT.legacyId || inquirySyncDone.has(id)) return;
  inquirySyncDone.add(id);
  try {
    await updateDoc(doc(db, 'inquiries', id), {
      partnerProjectStage: 'active',
      partnerFeeAmount: CONTRACT.feeAmount,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    inquirySyncDone.delete(id);
    console.warn('[NINEWORKS Admin] RP Bio inquiry stage sync skipped', error);
  }
};

const syncWorkspaceContract = () => {
  workspaceUnsub?.();
  workspaceUnsub = onSnapshot(doc(db, 'partnerWorkspaces', workspaceId), async (snapshot) => {
    if (syncing) return;
    const data = snapshot.exists() ? (snapshot.data() || {}) : {};
    const assignments = Array.isArray(data.assignments) ? data.assignments : [];

    const withoutLegacy = assignments.filter((item) => String(item?.id || '') !== CONTRACT.legacyId);
    const baseIndex = withoutLegacy.findIndex(isRpBioAssignment);
    if (baseIndex < 0) return;

    const original = withoutLegacy[baseIndex] || {};
    const enriched = enrichAssignment(original);
    const next = withoutLegacy.map((item, index) => index === baseIndex ? enriched : item);

    const duplicateRemoved = withoutLegacy.length !== assignments.length;
    const needsEnrichment = relevantSignature(original) !== relevantSignature(enriched);
    if (!duplicateRemoved && !needsEnrichment) {
      syncInquiryState(enriched);
      return;
    }

    syncing = true;
    try {
      await setDoc(doc(db, 'partnerWorkspaces', workspaceId), {
        name: CONTRACT.partnerName,
        email: CONTRACT.partnerEmail,
        assignments: next,
        projectCount: next.length,
        updatedAt: serverTimestamp()
      }, { merge: true });
      await syncInquiryState(enriched);
    } catch (error) {
      console.warn('[NINEWORKS Admin] RP Bio partner contract merge skipped', error);
    } finally {
      syncing = false;
    }
  }, (error) => console.warn('[NINEWORKS Admin] RP Bio partner workspace stream skipped', error));
};

const injectStyle = () => {
  if (document.querySelector('style[data-partner-contract-admin-style]')) return;
  const style = document.createElement('style');
  style.dataset.partnerContractAdminStyle = 'true';
  style.textContent = `
    .nw-contracts-admin{grid-column:1/-1;margin-top:18px;padding-top:18px;border-top:1px solid var(--line,#ddd)}
    .nw-contracts-admin__head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:12px}.nw-contracts-admin__head span{display:block;color:#8a8a8a;font-size:9px;letter-spacing:.08em;text-transform:uppercase}.nw-contracts-admin__head strong{display:block;margin-top:5px;font-size:16px;font-weight:500;letter-spacing:-.025em}.nw-contracts-admin__badge{padding:5px 8px;border:1px solid #cfd8cf;background:#f4f8f4;color:#426247;font-size:8px;letter-spacing:.04em;white-space:nowrap}
    .nw-contracts-admin__grid{display:grid;grid-template-columns:1.35fr repeat(5,minmax(92px,.72fr));border:1px solid var(--line,#ddd);background:#fff}.nw-contracts-admin__cell{min-width:0;padding:12px;border-right:1px solid var(--line,#ddd)}.nw-contracts-admin__cell:last-child{border-right:0}.nw-contracts-admin__cell span{display:block;color:#929292;font-size:8px;letter-spacing:.04em}.nw-contracts-admin__cell b{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.45;word-break:keep-all}.nw-contracts-admin__note{margin-top:10px;padding:11px 12px;background:#f6f6f3;color:#666;font-size:9px;line-height:1.65}.nw-contracts-admin__note strong{color:#111;font-weight:600}
    @media(max-width:1100px){.nw-contracts-admin__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.nw-contracts-admin__cell{border-bottom:1px solid var(--line,#ddd)}}@media(max-width:720px){.nw-contracts-admin__grid{grid-template-columns:1fr}.nw-contracts-admin__cell{border-right:0}}
  `;
  document.head.appendChild(style);
};

const renderContractPanel = () => {
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
  box.innerHTML = `
    <div class="nw-contracts-admin__head">
      <div><span>Freelancer Contract · Internal Only</span><strong>프리랜서 계약 / 프로젝트 연동</strong></div>
      <em class="nw-contracts-admin__badge">CLIENT HIDDEN</em>
    </div>
    <div class="nw-contracts-admin__grid">
      <div class="nw-contracts-admin__cell"><span>PARTNER / PROJECT</span><b>${escapeHTML(CONTRACT.partnerName)} · ${escapeHTML(CONTRACT.projectName)}<br>${escapeHTML(CONTRACT.scope)}</b></div>
      <div class="nw-contracts-admin__cell"><span>계약금액</span><b>${money(CONTRACT.feeAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>선금</span><b>${money(CONTRACT.advanceAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>원천징수 3.3%</span><b>${money(CONTRACT.withholdingAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>잔금 실지급</span><b>${money(CONTRACT.balanceNetAmount)}</b></div>
      <div class="nw-contracts-admin__cell"><span>총 실지급</span><b>${money(CONTRACT.totalNetAmount)}</b></div>
    </div>
    <div class="nw-contracts-admin__note"><strong>프로젝트 통합</strong> · 기존 「건강기능식품 신규 브랜드 런칭」 배정 건을 알피바이오 프리랜서 계약 건으로 사용하며 별도의 중복 프로젝트를 만들지 않습니다. · <strong>지급 조건</strong> · 선금 ${money(CONTRACT.advanceAmount)} 지급 / ${escapeHTML(CONTRACT.balanceCondition)} 원천징수 ${money(CONTRACT.withholdingAmount)}를 잔금에서 공제 후 ${money(CONTRACT.balanceNetAmount)} 지급. · <strong>클라이언트 비노출</strong> · 신민용 파트너 워크스페이스와 관리자 Partners 영역에만 표시합니다.</div>`;
  return true;
};

const keepPanelMounted = () => {
  renderContractPanel();
  const observer = new MutationObserver(() => {
    if (!document.querySelector('[data-admin-panel="partners"] [data-internal-partner-contracts]')) renderContractPanel();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('nw-admin-panel', (event) => {
    if (event.detail?.panel === 'partners') renderContractPanel();
  });
};

const start = () => {
  syncWorkspaceContract();
  keepPanelMounted();
};

if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (String(user?.email || '').trim().toLowerCase() === ADMIN_EMAIL) start();
  });
}

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const CONTRACTS = [
  {
    id: 'internal-rpbio-shinminyong-20260915', partnerEmail: 's.nninyong@gmail.com', partnerName: '신민용',
    company: '알피바이오', projectName: '건강기능식품 신규 브랜드 런칭', scope: '프로젝트 전반 어시스트',
    feeAmount: 5000000, advanceAmount: 2500000, withholdingAmount: 165000, balanceGrossAmount: 2500000,
    balanceNetAmount: 2335000, totalNetAmount: 4835000, balanceCondition: '알피바이오 프로젝트 잔금 입금 시',
    linkedClient: 'rpbio', syntheticIfMissing: false
  },
  {
    id: 'internal-phyto-odahe-20260915', partnerEmail: 'daac-oh@naver.com', partnerName: '오다혜',
    company: 'PHYTO REVOLUTION', projectName: 'PHYTO REVOLUTION', scope: '프로젝트 전반 어시스트',
    feeAmount: 1000000, advanceAmount: 500000, withholdingAmount: 33000, balanceGrossAmount: 500000,
    balanceNetAmount: 467000, totalNetAmount: 967000, balanceCondition: 'PHYTO REVOLUTION 프로젝트 잔금 입금 시',
    linkedClient: 'phyto', syntheticIfMissing: true
  }
];

const unsubs = [];
const syncing = new Set();
let observer = null;
const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
const workspaceKey = (email = '') => encodeURIComponent(String(email || '').trim().toLowerCase());

const matchesContract = (item = {}, contract) => {
  const company = String(item.company || '').toLowerCase();
  const title = String(item.projectName || '').toLowerCase();
  if (contract.linkedClient === 'rpbio') return company.includes('알피바이오') || title.includes('건강기능식품 신규 브랜드 런칭');
  return company.includes('phyto') || title.includes('phyto') || title.includes('파이토');
};

const enrich = (item = {}, c) => ({
  ...item,
  id: item.id || c.id,
  company: c.company,
  projectName: c.projectName,
  service: '프로젝트 전반 어시스트',
  projectType: '프로젝트 전반 어시스트',
  status: 'open',
  summary: `${c.projectName} 프로젝트 전반 어시스트`,
  projectStage: 'active',
  feeAmount: c.feeAmount,
  proposalUrl: item.proposalUrl || '',
  paymentType: 'freelancer',
  withholdingRate: 0.033,
  withholdingAmount: c.withholdingAmount,
  advanceAmount: c.advanceAmount,
  balanceGrossAmount: c.balanceGrossAmount,
  balanceNetAmount: c.balanceNetAmount,
  totalNetAmount: c.totalNetAmount,
  withholdingTiming: 'balance',
  balanceCondition: c.balanceCondition,
  scope: c.scope,
  effectiveDate: '2026-09-15',
  contractStatus: 'active',
  internalOnly: true,
  clientVisible: false,
  linkedClient: c.linkedClient,
  contractSource: 'INTERNAL_PARTNER_CONTRACT'
});

const signatureOf = (items = []) => JSON.stringify(items.map((item) => ({
  id: item.id || '', company: item.company || '', projectName: item.projectName || '', status: item.status || '',
  projectStage: item.projectStage || '', feeAmount: Number(item.feeAmount || 0), advanceAmount: Number(item.advanceAmount || 0),
  withholdingAmount: Number(item.withholdingAmount || 0), balanceNetAmount: Number(item.balanceNetAmount || 0),
  internalOnly: item.internalOnly === true, clientVisible: item.clientVisible === false
})));

const syncContract = (c) => {
  const key = workspaceKey(c.partnerEmail);
  const unsub = onSnapshot(doc(db, 'partnerWorkspaces', key), async (snapshot) => {
    if (syncing.has(key)) return;
    const data = snapshot.exists() ? (snapshot.data() || {}) : {};
    let assignments = Array.isArray(data.assignments) ? data.assignments.slice() : [];
    const before = signatureOf(assignments);

    if (c.linkedClient === 'rpbio') assignments = assignments.filter((item) => String(item?.id || '') !== c.id);
    const index = assignments.findIndex((item) => matchesContract(item, c));
    if (index >= 0) assignments[index] = enrich(assignments[index], c);
    else if (c.syntheticIfMissing) assignments.push(enrich({ id: c.id }, c));
    else return;

    const after = signatureOf(assignments);
    if (before === after && data.name === c.partnerName && data.email === c.partnerEmail) return;

    syncing.add(key);
    try {
      await setDoc(doc(db, 'partnerWorkspaces', key), {
        name: c.partnerName,
        email: c.partnerEmail,
        assignments,
        projectCount: assignments.length,
        paymentType: 'freelancer',
        updatedAt: serverTimestamp()
      }, { merge: true });

      const real = assignments.find((item) => matchesContract(item, c) && String(item.id || '') !== c.id);
      if (real?.id) {
        try {
          await updateDoc(doc(db, 'inquiries', real.id), {
            assignedPartnerEmail: c.partnerEmail,
            assignedPartnerName: c.partnerName,
            partnerProjectStage: 'active',
            partnerFeeAmount: c.feeAmount,
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.warn('[NINEWORKS Admin] contract inquiry sync skipped', error);
        }
      }
    } catch (error) {
      console.warn('[NINEWORKS Admin] partner contract workspace sync skipped', error);
    } finally {
      syncing.delete(key);
    }
  }, (error) => console.warn('[NINEWORKS Admin] partner contract listener skipped', error));
  unsubs.push(unsub);
};

const seedPartner = async (c) => {
  try {
    await setDoc(doc(db, 'partners', workspaceKey(c.partnerEmail)), {
      name: c.partnerName,
      email: c.partnerEmail,
      status: 'active',
      category: 'DESIGNER PARTNER',
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('[NINEWORKS Admin] partner seed skipped', error);
  }
};

const injectStyle = () => {
  if (document.querySelector('style[data-partner-contract-admin-style]')) return;
  const style = document.createElement('style');
  style.dataset.partnerContractAdminStyle = 'true';
  style.textContent = `
    .nw-contracts-admin{grid-column:1/-1;margin-top:18px;padding-top:18px;border-top:1px solid var(--line,#ddd)}.nw-contracts-admin__head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:12px}.nw-contracts-admin__head span{display:block;color:#888;font-size:9px;letter-spacing:.08em}.nw-contracts-admin__head strong{display:block;margin-top:5px;font-size:16px;font-weight:500}.nw-contracts-admin__badge{padding:5px 8px;border:1px solid #cfd8cf;background:#f4f8f4;color:#426247;font-size:8px}.nw-contract-row{display:grid;grid-template-columns:1.4fr repeat(5,minmax(90px,.7fr));border:1px solid var(--line,#ddd);border-bottom:0;background:#fff}.nw-contract-row:last-of-type{border-bottom:1px solid var(--line,#ddd)}.nw-contract-cell{padding:12px;border-right:1px solid var(--line,#ddd)}.nw-contract-cell:last-child{border-right:0}.nw-contract-cell span{display:block;color:#999;font-size:8px}.nw-contract-cell b{display:block;margin-top:7px;font-size:11px;font-weight:500;line-height:1.45}.nw-contract-note{margin-top:10px;padding:11px 12px;background:#f6f6f3;color:#666;font-size:9px;line-height:1.65}.admin-partner-lite-card[data-extra-partner="odahe"]{border-color:#cfd8cf;background:#fafcf9}@media(max-width:1100px){.nw-contract-row{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:720px){.nw-contract-row{grid-template-columns:1fr}.nw-contract-cell{border-right:0}}
  `;
  document.head.appendChild(style);
};

const ensureOdaCard = () => {
  const list = document.querySelector('[data-admin-partner-lite-list]');
  if (!list || list.querySelector('[data-extra-partner="odahe"]') || String(list.textContent || '').includes('daac-oh@naver.com')) return;
  const c = CONTRACTS[1];
  const card = document.createElement('article');
  card.className = 'admin-partner-lite-card';
  card.dataset.extraPartner = 'odahe';
  card.innerHTML = `<div><span>DESIGN PARTNER</span><strong>${escapeHTML(c.partnerName)}</strong><p>${escapeHTML(c.partnerEmail)}</p></div><div class="admin-partner-lite-card__stats"><div><small>ASSIGNED</small><b>1</b></div><div><small>ACTIVE</small><b>1</b></div></div><div class="admin-partner-lite-card__money"><span>예비금액 <b>0원</b></span><span>진행금액 <b>${money(c.feeAmount)}</b></span></div><a href="parters/" target="_blank" rel="noopener">WORKSPACE ↗</a>`;
  list.appendChild(card);
};

const contractPanelHTML = () => `<div class="nw-contracts-admin__head"><div><span>FREELANCER CONTRACT · INTERNAL ONLY</span><strong>프리랜서 계약 / 프로젝트 연동</strong></div><em class="nw-contracts-admin__badge">CLIENT HIDDEN</em></div>` + CONTRACTS.map((c) => `
    <div class="nw-contract-row"><div class="nw-contract-cell"><span>PARTNER / PROJECT</span><b>${escapeHTML(c.partnerName)} · ${escapeHTML(c.projectName)}<br>${escapeHTML(c.scope)}</b></div><div class="nw-contract-cell"><span>계약금액</span><b>${money(c.feeAmount)}</b></div><div class="nw-contract-cell"><span>선금</span><b>${money(c.advanceAmount)}</b></div><div class="nw-contract-cell"><span>원천징수 3.3%</span><b>${money(c.withholdingAmount)}</b></div><div class="nw-contract-cell"><span>잔금 실지급</span><b>${money(c.balanceNetAmount)}</b></div><div class="nw-contract-cell"><span>총 실지급</span><b>${money(c.totalNetAmount)}</b></div></div>`).join('') + `<div class="nw-contract-note"><strong>클라이언트 비노출</strong> · 위 계약정보는 각 파트너 워크스페이스와 관리자 Partners 영역에서만 확인하며 알피바이오·PHYTO REVOLUTION 클라이언트 화면에는 전달하지 않습니다.</div>`;

const renderContractPanel = () => {
  injectStyle();
  const panel = document.querySelector('[data-admin-panel="partners"]');
  if (!panel) return;
  ensureOdaCard();
  let box = panel.querySelector('[data-internal-partner-contracts]');
  if (!box) {
    box = document.createElement('section');
    box.className = 'nw-contracts-admin';
    box.dataset.internalPartnerContracts = 'true';
    const list = panel.querySelector('[data-admin-partner-lite-list]');
    list ? list.insertAdjacentElement('afterend', box) : panel.appendChild(box);
  }
  const html = contractPanelHTML();
  if (box.dataset.renderedHtml !== html) {
    box.innerHTML = html;
    box.dataset.renderedHtml = html;
  }
};

const keepMounted = () => {
  renderContractPanel();
  if (observer) return;
  observer = new MutationObserver(() => {
    window.requestAnimationFrame(() => {
      renderContractPanel();
      ensureOdaCard();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

const start = async () => {
  for (const c of CONTRACTS) {
    await seedPartner(c);
    syncContract(c);
  }
  keepMounted();
};

if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (String(user?.email || '').trim().toLowerCase() === ADMIN_EMAIL) start();
  });
}

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const PHYTO_ID = 'phyto';
const PHYTO_URL = '/client/phyto/';
let listObserver = null;

function injectPolishCSS() {
  if (!document.querySelector('link[data-admin-clients-polish]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/admin-clients-polish-20260826.css?v=20260826-2';
    link.dataset.adminClientsPolish = 'true';
    document.head.appendChild(link);
  }

  if (!document.querySelector('style[data-phyto-admin-fix]')) {
    const style = document.createElement('style');
    style.dataset.phytoAdminFix = 'true';
    style.textContent = `
      .admin-client-row__portal{align-items:flex-end!important;justify-content:center!important;gap:7px!important}
      .admin-client-row__portal .nw-phyto-linked{display:inline-flex;align-items:center;justify-content:center;min-width:78px;height:28px;padding:0 9px;border:1px solid #111;background:#111;color:#fff!important;font-size:8px!important;font-weight:500;line-height:1;letter-spacing:.035em;white-space:nowrap;text-decoration:none}
      .admin-client-row__portal .nw-phyto-linked:hover{background:#fff;color:#111!important}
      .admin-client-row__portal span.is-on{display:inline-flex!important;align-items:center;height:22px;padding:0 6px!important;border:1px solid #111!important;background:transparent!important;color:#111!important;font-size:7px!important;white-space:nowrap}
      @media(max-width:760px){.admin-client-row__portal{align-items:flex-end!important}.admin-client-row__portal .nw-phyto-linked{min-width:72px}}
    `;
    document.head.appendChild(style);
  }
}

async function ensurePhytoClient(user) {
  if (!user || String(user.email || '').toLowerCase() !== ADMIN_EMAIL || !db) return;
  const ref = doc(db, 'clients', PHYTO_ID);
  const snap = await getDoc(ref);
  const base = {
    company: '파이토레볼루션 (PhytoRevolution)',
    companyName: '파이토레볼루션 (PhytoRevolution)',
    brand: '고스란',
    projectName: '고스란 기능성 식물유래 바디케어 제품',
    project: '고스란 기능성 식물유래 바디케어 제품',
    scope: '기능성 식물유래 바디케어 브랜드 개발 및 디자인 프로젝트',
    clientStage: 'client',
    contractType: '정부지원사업',
    contractStatus: 'active',
    contractStart: '2026-08-27',
    contractEnd: '2026-10-27',
    maintenanceStart: '2026-10-28',
    maintenanceEnd: '2026-12-27',
    projectType: '정부지원사업',
    portalEnabled: true,
    portalUrl: PHYTO_URL,
    portalMessage: '계약, 견적, 진행 현황과 주요 프로젝트 정보를 전용 대시보드에서 확인할 수 있습니다.',
    updatedAt: serverTimestamp()
  };
  if (!snap.exists()) base.createdAt = serverTimestamp();
  await setDoc(ref, base, { merge: true });
}

function attachDirectPortalLinks() {
  const list = document.querySelector('[data-client-list]');
  if (!list) return;
  list.querySelectorAll('.admin-client-row').forEach((row) => {
    const text = row.textContent || '';
    if (!/파이토레볼루션|PhytoRevolution|고스란/i.test(text)) return;
    const portal = row.querySelector('.admin-client-row__portal');
    if (!portal) return;

    const status = portal.querySelector('span');
    if (status) {
      status.textContent = 'PORTAL ON';
      status.classList.add('is-on');
    }

    let link = portal.querySelector('.nw-phyto-linked');
    if (!link) {
      link = document.createElement('a');
      link.className = 'nw-phyto-linked';
      link.href = PHYTO_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = '대시보드 ↗';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(PHYTO_URL, '_blank', 'noopener');
      });
      portal.appendChild(link);
    }
  });
}

function observeClientList() {
  const list = document.querySelector('[data-client-list]');
  if (!list) return;
  if (listObserver) listObserver.disconnect();
  listObserver = new MutationObserver(() => attachDirectPortalLinks());
  listObserver.observe(list, { childList: true });
  attachDirectPortalLinks();
}

injectPolishCSS();
onAuthStateChanged(auth, (user) => {
  ensurePhytoClient(user)
    .then(() => window.setTimeout(attachDirectPortalLinks, 100))
    .catch((error) => console.error('[NINEWORKS Admin] Phyto client seed failed', error));
});

window.setTimeout(observeClientList, 0);
window.setTimeout(observeClientList, 500);
window.addEventListener('nw-admin-panel', (event) => {
  if (event.detail?.panel === 'clients') {
    observeClientList();
  }
});

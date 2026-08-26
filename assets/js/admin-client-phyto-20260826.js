import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const PHYTO_ID = 'phyto';
const PHYTO_URL = '/client/phyto/';

function injectPolishCSS() {
  if (document.querySelector('link[data-admin-clients-polish]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-clients-polish-20260826.css?v=20260826-2';
  link.dataset.adminClientsPolish = 'true';
  document.head.appendChild(link);
}

async function ensurePhytoClient(user) {
  if (!user || String(user.email || '').toLowerCase() !== ADMIN_EMAIL) return;
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
  const rows = document.querySelectorAll('.admin-client-row');
  rows.forEach((row) => {
    const text = row.textContent || '';
    if (!/파이토레볼루션|PhytoRevolution|고스란/i.test(text)) return;
    const portal = row.querySelector('.admin-client-row__portal');
    if (!portal || portal.querySelector('.nw-phyto-linked')) return;
    const link = document.createElement('a');
    link.className = 'nw-phyto-linked';
    link.href = PHYTO_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'DASHBOARD ↗';
    link.addEventListener('click', (event) => event.stopPropagation());
    portal.appendChild(link);
  });
}

injectPolishCSS();
onAuthStateChanged(auth, (user) => {
  ensurePhytoClient(user).catch((error) => console.error('[NINEWORKS Admin] Phyto client seed failed', error));
});

const observer = new MutationObserver(attachDirectPortalLinks);
observer.observe(document.documentElement, { childList: true, subtree: true });
attachDirectPortalLinks();
window.addEventListener('nw-admin-panel', attachDirectPortalLinks);

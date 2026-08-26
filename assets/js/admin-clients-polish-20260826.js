import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const STATIC_CLIENT_PATH = '/client/phyto/';

const ensureTableHead = () => {
  const list = document.querySelector('[data-client-list]');
  if (!list || document.querySelector('.admin-client-table-head')) return;
  const head = document.createElement('div');
  head.className = 'admin-client-table-head';
  head.innerHTML = '<span>CLIENT / PROJECT</span><span>CONTRACT</span><span>CONTACT</span><span>FILES</span><span>PORTAL</span>';
  list.parentNode.insertBefore(head, list);
};

const setStaticPortalLink = () => {
  const form = document.querySelector('[data-client-form]');
  const clientId = form?.elements?.namedItem('clientId')?.value || '';
  const company = form?.elements?.namedItem('company')?.value || '';
  if (clientId !== 'phyto' && !String(company).includes('파이토') && !String(company).toLowerCase().includes('phyto')) return;
  const url = `${location.origin}${STATIC_CLIENT_PATH}`;
  const input = document.querySelector('[data-client-portal-link]');
  const open = document.querySelector('[data-client-open-link]');
  if (input) input.value = url;
  if (open) { open.href = url; open.removeAttribute('aria-disabled'); }
};

const observeClientUI = () => {
  const observer = new MutationObserver(() => {
    ensureTableHead();
    setStaticPortalLink();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  document.addEventListener('click', () => setTimeout(setStaticPortalLink, 0));
  ensureTableHead();
};

const ensurePhytoClient = async () => {
  if (!db) return;
  const snapshot = await getDocs(collection(db, 'clients'));
  const existing = snapshot.docs.find((snap) => {
    const data = snap.data() || {};
    const text = `${data.company || ''} ${data.companyName || ''} ${data.brand || ''}`.toLowerCase();
    return text.includes('파이토레볼루션') || text.includes('phytorevolution');
  });
  const targetRef = doc(db, 'clients', existing?.id || 'phyto');
  const base = {
    company: '파이토레볼루션 (PhytoRevolution)',
    projectName: '고스란 · 기능성 식물유래 바디케어',
    clientStage: 'client',
    scope: '브랜드 고스란의 기능성 식물유래 바디케어 프로젝트',
    contractType: '정부지원사업',
    contractStatus: 'active',
    contractStart: '2026-08-27',
    contractEnd: '2026-10-27',
    maintenanceStart: '2026-10-28',
    maintenanceEnd: '2026-12-27',
    portalEnabled: true,
    portalUrl: STATIC_CLIENT_PATH,
    staticDashboardPath: STATIC_CLIENT_PATH,
    portalMessage: '계약, 견적, 진행 현황과 주요 프로젝트 정보를 전용 대시보드에서 확인할 수 있습니다.',
    updatedAt: serverTimestamp()
  };
  if (!existing) Object.assign(base, { documentCount: 0, storageBytes: 0, createdAt: serverTimestamp() });
  await setDoc(targetRef, base, { merge: true });
};

observeClientUI();

if (firebaseConfigReady && !firebaseInitError && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (String(user?.email || '').toLowerCase() !== ADMIN_EMAIL) return;
    ensurePhytoClient().catch((error) => console.error('[NINEWORKS Clients] phyto client sync failed', error));
  });
}

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
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const partnerForEmail = (email = '') => PARTNERS.find((item) => item.email === normalizeEmail(email));

const loadStyle = () => {
  if (document.querySelector('link[data-admin-partner-lite-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-partner-assignment-lite.css?v=20260824-1';
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
        <div><span class="admin-label">Partner Management</span><h2>Partners</h2><p>나인웍스 파트너 디자이너와 현재 배정된 문의·프로젝트를 확인합니다.</p></div>
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
      document.querySelector('[data-admin-panel="partners"]')?.classList.remove('is-active');
    }
  });
  if (location.hash === '#partners') window.setTimeout(openPartners, 0);
};

const assignedCount = (email) => inquiryCache.filter((item) => normalizeEmail(item.assignedPartnerEmail) === email).length;

const renderPartnerPanel = () => {
  const box = document.querySelector('[data-admin-partner-lite-list]');
  if (!box) return;
  box.innerHTML = PARTNERS.map((partner) => {
    const count = assignedCount(partner.email);
    const active = inquiryCache.filter((item) => normalizeEmail(item.assignedPartnerEmail) === partner.email && item.status !== 'done').length;
    return `<article class="admin-partner-lite-card">
      <div><span>DESIGN PARTNER</span><strong>${escapeHTML(partner.name)}</strong><p>${escapeHTML(partner.email)}</p></div>
      <div class="admin-partner-lite-card__stats"><div><small>ASSIGNED</small><b>${count}</b></div><div><small>ACTIVE</small><b>${active}</b></div></div>
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

const inquiryById = (id) => inquiryCache.find((item) => item.id === id);

const decorateInquiryRows = () => {
  document.querySelectorAll('[data-inquiry-list] .admin-inquiry-row').forEach((row) => {
    const statusSelect = row.querySelector('[data-inquiry-status]');
    if (!statusSelect) return;
    const id = statusSelect.dataset.inquiryStatus;
    const item = inquiryById(id);
    if (!item) return;
    const signature = `${id}|${normalizeEmail(item.assignedPartnerEmail)}`;
    let holder = row.querySelector('.admin-partner-lite-assign');
    if (!holder) {
      holder = document.createElement('div');
      holder.className = 'admin-partner-lite-assign';
      row.querySelector('.admin-inquiry-row__top')?.appendChild(holder);
    }
    if (holder.dataset.signature === signature) return;
    holder.dataset.signature = signature;
    holder.innerHTML = `<label>PARTNER</label><select data-partner-lite-assign="${escapeHTML(id)}" class="${item.assignedPartnerEmail ? 'is-assigned' : ''}">${partnerOptions(item.assignedPartnerEmail)}</select>`;
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
    summary: String(item.message || '').slice(0, 1800)
  }));

const syncPartnerWorkspaces = async () => {
  for (const partner of PARTNERS) {
    const assignments = sanitizedAssignments(partner.email);
    const signature = JSON.stringify(assignments);
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

const bindAssignmentControls = () => {
  document.addEventListener('change', async (event) => {
    const select = event.target.closest('[data-partner-lite-assign]');
    if (!select || !db) return;
    const inquiryId = select.dataset.partnerLiteAssign;
    const partner = partnerForEmail(select.value);
    select.disabled = true;
    try {
      if (!partner) {
        await updateDoc(doc(db, 'inquiries', inquiryId), {
          assignedPartnerEmail: deleteField(),
          assignedPartnerName: deleteField(),
          partnerAssignedAt: deleteField(),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'inquiries', inquiryId), {
          assignedPartnerEmail: partner.email,
          assignedPartnerName: partner.name,
          partnerAssignedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('[NINEWORKS Admin] partner assignment failed', error);
      window.alert('파트너 지정에 실패했습니다.');
    } finally {
      select.disabled = false;
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-inquiry-service-filter], [data-inquiry-status-filter], [data-status-summary], [data-dashboard-service], [data-admin-tab="inquiry"]')) scheduleDecorate();
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

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, deleteField, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const DEFAULT_PARTNERS = [
  { name: '서동원', email: 'seodw100@naver.com', status: 'active', category: 'DESIGNER PARTNER' },
  { name: '신민용', email: 's.nninyong@gmail.com', status: 'active', category: 'DESIGNER PARTNER' }
];

let partners = [];
let inquiries = [];
let partnerUnsub = null;
let inquiryUnsub = null;
let observer = null;
let syncing = false;

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
const partnerKey = (email = '') => encodeURIComponent(normalizeEmail(email));
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const loadStyle = () => {
  if (document.querySelector('link[data-admin-partners-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-partners-20260824.css?v=20260824-1';
  link.dataset.adminPartnersStyle = 'true';
  document.head.appendChild(link);
};

const injectAdminUI = () => {
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
        <div><span class="admin-label">Partner Management</span><h2>Partners</h2><p>나인웍스와 협업하는 파트너 디자이너를 등록하고, 문의·프로젝트별 담당 파트너를 연결합니다.</p></div>
      </div>
      <div class="admin-partner-toolbar">
        <form class="admin-partner-form" data-partner-create-form>
          <input type="text" name="name" placeholder="파트너 이름" required>
          <input type="email" name="email" placeholder="partner@email.com" required>
          <button type="submit">ADD PARTNER</button>
        </form>
        <div class="admin-partner-toolbar__meta"><span data-partner-total>0 PARTNERS</span></div>
      </div>
      <div class="admin-partner-list" data-admin-partner-list><div class="admin-partner-empty">파트너 정보를 불러오는 중입니다.</div></div>`;
    const visitorsPanel = document.querySelector('[data-admin-panel="visitors"]');
    if (visitorsPanel?.parentElement) visitorsPanel.parentElement.insertBefore(panel, visitorsPanel);
    else document.querySelector('.admin-main')?.appendChild(panel);
  }
};

const seedPartners = async () => {
  for (const item of DEFAULT_PARTNERS) {
    const ref = doc(db, 'partners', partnerKey(item.email));
    await setDoc(ref, {
      name: item.name,
      email: normalizeEmail(item.email),
      status: item.status,
      category: item.category,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
};

const assignedCount = (email) => inquiries.filter((item) => normalizeEmail(item.assignedPartnerEmail) === normalizeEmail(email)).length;

const renderPartners = () => {
  const box = document.querySelector('[data-admin-partner-list]');
  const total = document.querySelector('[data-partner-total]');
  if (total) total.textContent = `${partners.length} PARTNERS`;
  if (!box) return;
  if (!partners.length) {
    box.innerHTML = '<div class="admin-partner-empty">등록된 파트너가 없습니다.</div>';
    return;
  }
  box.innerHTML = partners.map((partner) => {
    const count = assignedCount(partner.email);
    return `<div class="admin-partner-row" data-partner-row="${escapeHTML(partner.email)}">
      <strong>${escapeHTML(partner.name || '이름 미등록')}</strong>
      <span>${escapeHTML(partner.email)}</span>
      <small>${count} ASSIGNED</small>
      <select class="admin-partner-status" data-partner-status="${escapeHTML(partner.email)}">
        <option value="active"${partner.status === 'active' ? ' selected' : ''}>ACTIVE</option>
        <option value="inactive"${partner.status === 'inactive' ? ' selected' : ''}>INACTIVE</option>
      </select>
      <span class="admin-partner-workspace"><a href="parters/" target="_blank" rel="noopener">WORKSPACE ↗</a></span>
    </div>`;
  }).join('');
};

const partnerOptions = (selected = '') => {
  const active = partners.filter((item) => item.status !== 'inactive');
  return ['<option value="">파트너 지정 안함</option>', ...active.map((item) => {
    const email = normalizeEmail(item.email);
    return `<option value="${escapeHTML(email)}"${email === normalizeEmail(selected) ? ' selected' : ''}>${escapeHTML(item.name)} · ${escapeHTML(email)}</option>`;
  })].join('');
};

const inquiryById = (id) => inquiries.find((item) => item.id === id);

const decorateInquiryRows = () => {
  document.querySelectorAll('[data-inquiry-list] .admin-inquiry-row').forEach((row) => {
    const statusSelect = row.querySelector('[data-inquiry-status]');
    if (!statusSelect) return;
    const id = statusSelect.dataset.inquiryStatus;
    const item = inquiryById(id);
    if (!item) return;
    let holder = row.querySelector('.admin-partner-assignment');
    if (!holder) {
      holder = document.createElement('div');
      holder.className = 'admin-partner-assignment';
      row.querySelector('.admin-inquiry-row__top')?.appendChild(holder);
    }
    holder.innerHTML = `<label>PARTNER</label><select data-partner-assign="${escapeHTML(id)}" class="${item.assignedPartnerEmail ? 'is-assigned' : ''}">${partnerOptions(item.assignedPartnerEmail)}</select>`;
  });
};

const sanitizedAssignment = (item) => ({
  id: item.id,
  company: String(item.company || '').slice(0, 200),
  projectName: String(item.projectName || '').slice(0, 200),
  service: String(item.service || '').slice(0, 160),
  projectType: String(item.projectType || '').slice(0, 500),
  status: String(item.status || 'new').slice(0, 40),
  summary: String(item.message || item.details || '').slice(0, 1200),
  source: String(item.source || '').slice(0, 300)
});

const syncPartnerWorkspaces = async () => {
  if (syncing || !partners.length) return;
  syncing = true;
  try {
    for (const partner of partners) {
      const email = normalizeEmail(partner.email);
      const items = inquiries
        .filter((item) => normalizeEmail(item.assignedPartnerEmail) === email)
        .map(sanitizedAssignment);
      await setDoc(doc(db, 'partnerWorkspaces', partnerKey(email)), {
        email,
        name: partner.name || '',
        status: partner.status || 'active',
        assignments: items,
        projectCount: items.length,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('[NINEWORKS Admin Partners] workspace sync failed', error);
  } finally {
    syncing = false;
  }
};

const bindUI = () => {
  document.querySelector('[data-partner-create-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = normalizeEmail(fd.get('email'));
    if (!name || !email) return;
    try {
      await setDoc(doc(db, 'partners', partnerKey(email)), {
        name, email, status: 'active', category: 'DESIGNER PARTNER', updatedAt: serverTimestamp()
      }, { merge: true });
      form.reset();
    } catch (error) {
      console.error('[NINEWORKS Admin Partners] add failed', error);
      window.alert('파트너 등록에 실패했습니다.');
    }
  });

  document.addEventListener('change', async (event) => {
    const status = event.target.closest('[data-partner-status]');
    if (status) {
      status.disabled = true;
      try {
        await updateDoc(doc(db, 'partners', partnerKey(status.dataset.partnerStatus)), {
          status: status.value === 'inactive' ? 'inactive' : 'active', updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('[NINEWORKS Admin Partners] status failed', error);
        window.alert('파트너 상태 변경에 실패했습니다.');
      } finally { status.disabled = false; }
      return;
    }

    const select = event.target.closest('[data-partner-assign]');
    if (!select) return;
    const id = select.dataset.partnerAssign;
    const email = normalizeEmail(select.value);
    const partner = partners.find((item) => normalizeEmail(item.email) === email);
    select.disabled = true;
    try {
      if (!email || !partner) {
        await updateDoc(doc(db, 'inquiries', id), {
          assignedPartnerEmail: deleteField(), assignedPartnerName: deleteField(), partnerAssignedAt: deleteField(), updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'inquiries', id), {
          assignedPartnerEmail: email,
          assignedPartnerName: partner.name || '',
          partnerAssignedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('[NINEWORKS Admin Partners] assignment failed', error);
      window.alert('파트너 지정에 실패했습니다.');
    } finally { select.disabled = false; }
  });
};

const start = async () => {
  loadStyle();
  injectAdminUI();
  bindUI();
  try { await seedPartners(); }
  catch (error) { console.error('[NINEWORKS Admin Partners] seed failed', error); }

  partnerUnsub?.(); inquiryUnsub?.(); observer?.disconnect();
  partnerUnsub = onSnapshot(collection(db, 'partners'), (snapshot) => {
    partners = snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    renderPartners();
    decorateInquiryRows();
    syncPartnerWorkspaces();
  });
  inquiryUnsub = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    inquiries = snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
    renderPartners();
    decorateInquiryRows();
    syncPartnerWorkspaces();
  });
  const list = document.querySelector('[data-inquiry-list]');
  if (list) {
    observer = new MutationObserver(() => decorateInquiryRows());
    observer.observe(list, { childList: true, subtree: true });
  }
};

loadStyle();
injectAdminUI();
if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (normalizeEmail(user?.email) === ADMIN_EMAIL) start();
  });
}

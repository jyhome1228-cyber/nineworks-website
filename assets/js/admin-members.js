import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const ROLE_LABELS = { client: 'CLIENT', creator: 'CREATOR', partner: 'PARTNER' };
const STATUS_LABELS = { active: 'ACTIVE', pending: 'PENDING', approved: 'APPROVED', blocked: 'BLOCKED' };

let memberCache = [];
let clientCache = [];
let activeRole = 'all';
let activeStatus = 'all';
let searchTerm = '';
let unsubscribeMembers = null;
let unsubscribeClients = null;

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const normalizeRole = (role) => ['client', 'creator', 'partner'].includes(role) ? role : 'creator';
const normalizeStatus = (status, role = 'creator') => {
  if (['active', 'pending', 'approved', 'blocked'].includes(status)) return status;
  return role === 'partner' ? 'pending' : 'active';
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
    timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};

const memberSort = (a, b) => {
  const aTime = asDate(a.createdAt)?.getTime() || 0;
  const bTime = asDate(b.createdAt)?.getTime() || 0;
  return bTime - aTime;
};

const clientLabel = (client) => {
  const company = client.company || client.companyName || client.brand || client.clientName || client.name || '이름 없음';
  const contact = client.contactName || client.manager || client.ownerName || '';
  return contact ? `${company} · ${contact}` : company;
};

const safeWebsite = (value = '') => {
  const raw = String(value || '').trim();
  if (!/^https?:\/\//i.test(raw)) return '';
  return raw;
};

const statusOptions = (member) => {
  const role = normalizeRole(member.role);
  const current = normalizeStatus(member.status, role);
  const allowed = role === 'partner'
    ? [['pending', 'PENDING / 승인 대기'], ['approved', 'APPROVED / 승인'], ['blocked', 'BLOCKED / 차단']]
    : [['active', 'ACTIVE / 정상'], ['blocked', 'BLOCKED / 차단']];
  if (!allowed.some(([value]) => value === current)) allowed.unshift([current, STATUS_LABELS[current] || current.toUpperCase()]);
  return allowed.map(([value, label]) => `<option value="${value}"${current === value ? ' selected' : ''}>${label}</option>`).join('');
};

const clientOptions = (selectedId = '') => {
  const rows = clientCache
    .slice()
    .sort((a, b) => clientLabel(a).localeCompare(clientLabel(b), 'ko'))
    .map((client) => `<option value="${escapeHTML(client.id)}"${client.id === selectedId ? ' selected' : ''}>${escapeHTML(clientLabel(client))}</option>`);
  return [`<option value=""${selectedId ? '' : ' selected'}>미연결</option>`, ...rows].join('');
};

const memberSubline = (member) => {
  const role = normalizeRole(member.role);
  if (role === 'creator') return member.creatorType ? String(member.creatorType).toUpperCase() : 'CREATOR';
  if (role === 'partner') return member.partnerCategory ? String(member.partnerCategory).toUpperCase() : 'PARTNER';
  return member.clientId ? 'CRM CONNECTED' : 'CRM NOT CONNECTED';
};

const memberDetailHTML = (member) => {
  const role = normalizeRole(member.role);
  const website = safeWebsite(member.website);
  const base = `
    <div class="admin-member-detail-grid">
      <div><span>MEMBER ID</span><strong>${escapeHTML(member.id)}</strong></div>
      <div><span>PHONE</span><strong>${escapeHTML(member.phone || '-')}</strong></div>
      <div><span>ORGANIZATION</span><strong>${escapeHTML(member.organization || '-')}</strong></div>
      <div><span>JOINED</span><strong>${escapeHTML(formatDateTime(member.createdAt))}</strong></div>
    </div>`;

  if (role === 'client') {
    return `${base}
      <div class="admin-member-client-link">
        <div><span class="admin-label">CRM Client Link</span><strong>내부 클라이언트 연결</strong><p>향후 MY NINEWORKS에 프로젝트와 일정 정보를 노출할 때 사용할 연결값입니다.</p></div>
        <label><span>CLIENT</span><select data-member-client-link="${escapeHTML(member.id)}">${clientOptions(member.clientId || '')}</select></label>
      </div>`;
  }

  if (role === 'partner') {
    return `${base}
      <div class="admin-member-extra"><span>PARTNER CATEGORY</span><strong>${escapeHTML(member.partnerCategory || '-')}</strong>${website ? `<a href="${escapeHTML(website)}" target="_blank" rel="noopener">WEBSITE / PORTFOLIO ↗</a>` : '<em>등록된 웹사이트 없음</em>'}</div>`;
  }

  return `${base}<div class="admin-member-extra"><span>CREATOR TYPE</span><strong>${escapeHTML(member.creatorType || '-')}</strong><em>Student / Designer / Planner / Developer / Other</em></div>`;
};

const memberRowHTML = (member) => {
  const role = normalizeRole(member.role);
  const status = normalizeStatus(member.status, role);
  const organization = member.organization || '소속 미입력';
  return `<article class="admin-member-row" data-member-id="${escapeHTML(member.id)}">
    <div class="admin-member-row__top">
      <div class="admin-member-row__identity"><strong>${escapeHTML(member.name || '이름 미입력')}</strong><span>${escapeHTML(member.email || '-')}</span></div>
      <div class="admin-member-row__role"><span class="admin-member-badge admin-member-badge--${role}">${ROLE_LABELS[role]}</span><small>${escapeHTML(memberSubline(member))}</small></div>
      <div class="admin-member-row__org"><strong>${escapeHTML(organization)}</strong><span>${escapeHTML(member.phone || '-')}</span></div>
      <div class="admin-member-row__date"><span>JOINED</span><strong>${escapeHTML(formatDateTime(member.createdAt))}</strong></div>
      <select class="admin-member-status admin-member-status--${status}" data-member-status="${escapeHTML(member.id)}" aria-label="회원 상태">${statusOptions(member)}</select>
    </div>
    <details><summary>회원 상세 및 연결 관리</summary>${memberDetailHTML(member)}</details>
  </article>`;
};

const counts = () => memberCache.reduce((result, member) => {
  const role = normalizeRole(member.role);
  const status = normalizeStatus(member.status, role);
  result.total += 1;
  result[role] += 1;
  if (status === 'pending') result.pending += 1;
  return result;
}, { total: 0, client: 0, creator: 0, partner: 0, pending: 0 });

const filteredMembers = () => memberCache.filter((member) => {
  const role = normalizeRole(member.role);
  const status = normalizeStatus(member.status, role);
  if (activeRole !== 'all' && role !== activeRole) return false;
  if (activeStatus !== 'all' && status !== activeStatus) return false;
  if (!searchTerm) return true;
  const haystack = [
    member.name, member.email, member.organization, member.phone, member.creatorType,
    member.partnerCategory, member.website, member.role, member.status, member.clientId
  ].join(' ').toLowerCase();
  return haystack.includes(searchTerm);
});

const syncFilterButtons = () => {
  document.querySelectorAll('[data-member-role-filter]').forEach((button) => button.classList.toggle('is-active', button.dataset.memberRoleFilter === activeRole));
  document.querySelectorAll('[data-member-status-filter]').forEach((button) => button.classList.toggle('is-active', button.dataset.memberStatusFilter === activeStatus));
};

const renderMembers = () => {
  const summary = counts();
  Object.entries(summary).forEach(([key, value]) => {
    const node = document.querySelector(`[data-member-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });

  syncFilterButtons();
  const items = filteredMembers();
  const total = document.querySelector('[data-member-filter-total]');
  const list = document.querySelector('[data-member-list]');
  if (total) total.textContent = `${items.length} MEMBERS`;
  if (!list) return;
  list.innerHTML = items.length
    ? items.map(memberRowHTML).join('')
    : '<div class="admin-empty-live">조건에 맞는 회원이 없습니다.</div>';
};

const renderLoadError = (message) => {
  const list = document.querySelector('[data-member-list]');
  if (list) list.innerHTML = `<div class="admin-empty-live">${escapeHTML(message)}</div>`;
};

const stopStreams = () => {
  if (unsubscribeMembers) unsubscribeMembers();
  if (unsubscribeClients) unsubscribeClients();
  unsubscribeMembers = null;
  unsubscribeClients = null;
  memberCache = [];
  clientCache = [];
  renderMembers();
};

const startStreams = () => {
  if (unsubscribeMembers || !db) return;
  unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
    memberCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort(memberSort);
    renderMembers();
  }, (error) => {
    console.error('[NINEWORKS Admin Members] member stream failed', error);
    renderLoadError('회원 데이터를 불러오지 못했습니다. Firebase Rules 배포 상태를 확인해 주세요.');
  });

  unsubscribeClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
    clientCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderMembers();
  }, (error) => {
    console.warn('[NINEWORKS Admin Members] client stream skipped', error);
    clientCache = [];
    renderMembers();
  });
};

const setMemberStatus = async (memberId, status, select) => {
  if (!db || !memberId) return;
  select.disabled = true;
  try {
    await updateDoc(doc(db, 'members', memberId), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('[NINEWORKS Admin Members] status update failed', error);
    window.alert('회원 상태 변경에 실패했습니다. Firebase Rules를 확인해 주세요.');
  } finally {
    select.disabled = false;
  }
};

const setClientLink = async (memberId, clientId, select) => {
  if (!db || !memberId) return;
  select.disabled = true;
  try {
    const patch = clientId
      ? { clientId, clientLinkedAt: serverTimestamp(), updatedAt: serverTimestamp() }
      : { clientId: deleteField(), clientLinkedAt: deleteField(), updatedAt: serverTimestamp() };
    await updateDoc(doc(db, 'members', memberId), patch);
  } catch (error) {
    console.error('[NINEWORKS Admin Members] client link update failed', error);
    window.alert('클라이언트 연결 변경에 실패했습니다.');
  } finally {
    select.disabled = false;
  }
};

const bindControls = () => {
  document.addEventListener('click', (event) => {
    const roleButton = event.target.closest('[data-member-role-filter]');
    if (roleButton) {
      activeRole = roleButton.dataset.memberRoleFilter || 'all';
      renderMembers();
      return;
    }

    const statusButton = event.target.closest('[data-member-status-filter]');
    if (statusButton) {
      activeStatus = statusButton.dataset.memberStatusFilter || 'all';
      renderMembers();
      return;
    }

    const summaryButton = event.target.closest('[data-member-summary]');
    if (summaryButton) {
      const value = summaryButton.dataset.memberSummary || 'all';
      if (value === 'pending') {
        activeRole = 'partner';
        activeStatus = 'pending';
      } else {
        activeRole = ['client', 'creator', 'partner'].includes(value) ? value : 'all';
        activeStatus = 'all';
      }
      document.querySelector('[data-admin-tab="members"]')?.click();
      renderMembers();
    }
  });

  document.querySelector('[data-member-search]')?.addEventListener('input', (event) => {
    searchTerm = String(event.target.value || '').trim().toLowerCase();
    renderMembers();
  });

  document.addEventListener('change', (event) => {
    const statusSelect = event.target.closest('[data-member-status]');
    if (statusSelect) {
      setMemberStatus(statusSelect.dataset.memberStatus, statusSelect.value, statusSelect);
      return;
    }
    const clientSelect = event.target.closest('[data-member-client-link]');
    if (clientSelect) setClientLink(clientSelect.dataset.memberClientLink, clientSelect.value, clientSelect);
  });
};

bindControls();

if (!firebaseConfigReady || firebaseInitError || !auth || !db) {
  renderLoadError('Firebase 연결 설정을 확인해 주세요.');
} else {
  onAuthStateChanged(auth, (user) => {
    const isAdmin = String(user?.email || '').toLowerCase() === ADMIN_EMAIL;
    if (isAdmin) startStreams();
    else stopStreams();
  });
}

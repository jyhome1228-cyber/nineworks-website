import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const REPO_API = 'https://api.github.com/repos/jyhome1228-cyber/nineworks-website/contents/proposal';
const COLLECTION = 'proposalRegistry';
const FALLBACK_REPO_ITEMS = [
  { id: 'iskey', slug: 'iskey', title: 'ISKEY', source: 'repo' },
  { id: 'migung365', slug: 'migung365', title: '미궁365', source: 'repo' },
  { id: 'rpbio', slug: 'rpbio', title: 'RPBIO', source: 'repo' },
  { id: 'welcare', slug: 'welcare', title: 'WELCARE', source: 'repo' }
];
const TITLE_OVERRIDES = {
  iskey: 'ISKEY',
  migung365: '미궁365',
  rpbio: 'RPBIO',
  welcare: 'WELCARE'
};
const STATUS_LABELS = {
  ready: 'READY / 준비',
  sent: 'SENT / 전달',
  review: 'REVIEW / 검토중',
  won: 'WON / 수주',
  closed: 'CLOSED / 종료',
  archived: 'ARCHIVED / 보관'
};

let repoItems = [...FALLBACK_REPO_ITEMS];
let metadataItems = [];
let activeStatus = 'all';
let searchTerm = '';
let unsubscribeRegistry = null;
let isAdmin = false;
let repoMessage = 'GitHub 목록 확인 중';

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const safeText = (value = '') => String(value || '').trim();
const normalizeStatus = (value) => Object.prototype.hasOwnProperty.call(STATUS_LABELS, value) ? value : 'ready';
const slugTitle = (slug = '') => TITLE_OVERRIDES[slug] || String(slug || '')
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, (char) => char.toUpperCase());
const repoURL = (slug) => `${location.origin}/proposal/${encodeURIComponent(slug)}/`;
const safeURL = (value = '') => {
  const raw = safeText(value);
  if (!raw) return '';
  try {
    const url = new URL(raw, location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return url.href;
  } catch (_) {
    return '';
  }
};

const injectStylesheet = () => {
  if (document.querySelector('link[data-admin-proposals-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-proposals-20260902.css?v=20260902-1';
  link.dataset.adminProposalsStyle = 'true';
  document.head.appendChild(link);
};

const renumberNav = () => {
  document.querySelectorAll('.admin-nav .admin-nav__item').forEach((button, index) => {
    const number = button.querySelector('span');
    if (number) number.textContent = String(index + 1).padStart(2, '0');
  });
};

const ensureUI = () => {
  injectStylesheet();
  const nav = document.querySelector('.admin-nav');
  const main = document.querySelector('.admin-main');
  if (!nav || !main) return;

  if (!nav.querySelector('[data-admin-tab="proposals"]')) {
    const button = document.createElement('button');
    button.className = 'admin-nav__item';
    button.type = 'button';
    button.dataset.adminTab = 'proposals';
    button.innerHTML = '<span>00</span>Proposals';
    const visitorsButton = nav.querySelector('[data-admin-tab="visitors"]');
    nav.insertBefore(button, visitorsButton || null);
  }

  if (!document.querySelector('[data-admin-panel="proposals"]')) {
    const section = document.createElement('section');
    section.className = 'admin-panel admin-proposal-panel';
    section.dataset.adminPanel = 'proposals';
    section.innerHTML = `
      <div class="admin-section-head admin-proposal-head">
        <div>
          <span class="admin-label">Proposal Management</span>
          <h2>Proposals</h2>
          <p><code>/proposal/</code> 아래 제안서를 자동으로 불러오고, 전달 상태와 내부 관리 정보를 기록합니다.</p>
        </div>
        <button type="button" class="admin-proposal-primary" data-proposal-add>+ REGISTER LINK</button>
      </div>

      <div class="admin-proposal-stat-grid">
        <button type="button" class="admin-proposal-stat is-active" data-proposal-summary="all"><span>TOTAL</span><strong data-proposal-stat="all">0</strong><p>전체 제안서</p></button>
        <button type="button" class="admin-proposal-stat" data-proposal-summary="sent"><span>SENT</span><strong data-proposal-stat="sent">0</strong><p>전달 완료</p></button>
        <button type="button" class="admin-proposal-stat" data-proposal-summary="review"><span>REVIEW</span><strong data-proposal-stat="review">0</strong><p>검토 진행</p></button>
        <button type="button" class="admin-proposal-stat" data-proposal-summary="won"><span>WON</span><strong data-proposal-stat="won">0</strong><p>수주 확정</p></button>
      </div>

      <div class="admin-filter-panel admin-proposal-filter-panel">
        <div class="admin-filter-row">
          <span class="admin-filter-label">STATUS</span>
          <div class="admin-filter-buttons">
            <button class="is-active" type="button" data-proposal-status-filter="all">전체</button>
            <button type="button" data-proposal-status-filter="ready">준비</button>
            <button type="button" data-proposal-status-filter="sent">전달</button>
            <button type="button" data-proposal-status-filter="review">검토중</button>
            <button type="button" data-proposal-status-filter="won">수주</button>
            <button type="button" data-proposal-status-filter="closed">종료</button>
            <button type="button" data-proposal-status-filter="archived">보관</button>
          </div>
        </div>
        <div class="admin-search-row"><input type="search" placeholder="제안서명, 클라이언트, 담당, 경로 검색" data-proposal-search><span data-proposal-total>0 ITEMS</span></div>
      </div>

      <div class="admin-proposal-syncbar"><span data-proposal-repo-status>GitHub 목록 확인 중</span><span data-proposal-db-status>FIREBASE AUTH CHECK</span></div>
      <div class="admin-proposal-list" data-proposal-list><div class="admin-empty-live">제안서 목록을 불러오는 중입니다.</div></div>

      <div class="admin-proposal-modal" data-proposal-modal hidden>
        <div class="admin-proposal-modal__backdrop" data-proposal-close></div>
        <form class="admin-proposal-modal__dialog" data-proposal-form>
          <header><div><span class="admin-label">Manual Register</span><h3>제안서 링크 등록</h3></div><button type="button" data-proposal-close>CLOSE ×</button></header>
          <p>GitHub <code>/proposal/</code> 외부의 제안서나 별도 링크를 관리 목록에 추가할 때 사용합니다.</p>
          <label><span>TITLE *</span><input name="title" required placeholder="제안서명"></label>
          <label><span>CLIENT</span><input name="client" placeholder="회사 / 브랜드명"></label>
          <label><span>URL *</span><input name="url" required placeholder="https://..."></label>
          <label><span>OWNER</span><input name="owner" placeholder="담당자"></label>
          <div class="admin-proposal-modal__actions"><button type="button" data-proposal-close>취소</button><button type="submit">등록하기</button></div>
        </form>
      </div>`;

    const visitorsPanel = main.querySelector('[data-admin-panel="visitors"]');
    main.insertBefore(section, visitorsPanel || null);
  }

  renumberNav();
  if (nav.dataset.proposalRenumberBound !== 'true') {
    nav.dataset.proposalRenumberBound = 'true';
    new MutationObserver(renumberNav).observe(nav, { childList: true, subtree: true });
  }
};

const mergedItems = () => {
  const metadataMap = new Map(metadataItems.map((item) => [item.id, item]));
  const rows = repoItems.map((repoItem) => {
    const meta = metadataMap.get(repoItem.id) || {};
    return {
      ...repoItem,
      ...meta,
      id: repoItem.id,
      slug: repoItem.slug,
      source: 'repo',
      title: safeText(meta.title) || repoItem.title,
      url: safeURL(meta.url) || repoURL(repoItem.slug),
      status: normalizeStatus(meta.status)
    };
  });

  metadataItems.forEach((item) => {
    if (rows.some((row) => row.id === item.id)) return;
    if (item.deleted === true) return;
    rows.push({
      ...item,
      source: item.source || 'manual',
      title: safeText(item.title) || '제안서',
      url: safeURL(item.url),
      status: normalizeStatus(item.status)
    });
  });

  return rows.sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ko'));
};

const filteredItems = () => mergedItems().filter((item) => {
  const status = normalizeStatus(item.status);
  if (activeStatus !== 'all' && status !== activeStatus) return false;
  if (!searchTerm) return true;
  const haystack = [item.title, item.client, item.owner, item.slug, item.url, item.memo, status].join(' ').toLowerCase();
  return haystack.includes(searchTerm);
});

const statusOptions = (current) => Object.entries(STATUS_LABELS)
  .map(([value, label]) => `<option value="${value}"${current === value ? ' selected' : ''}>${escapeHTML(label)}</option>`)
  .join('');

const itemRowHTML = (item) => {
  const status = normalizeStatus(item.status);
  const url = safeURL(item.url);
  const sourceLabel = item.source === 'repo' ? 'GITHUB / REPO' : 'MANUAL LINK';
  const pathLabel = item.source === 'repo' ? `/proposal/${item.slug}/` : (url || '-');
  const disabled = isAdmin ? '' : ' disabled';
  return `<article class="admin-proposal-row" data-proposal-id="${escapeHTML(item.id)}">
    <div class="admin-proposal-row__head">
      <div class="admin-proposal-row__identity">
        <span>${escapeHTML(sourceLabel)}</span>
        <strong>${escapeHTML(item.title || '제안서')}</strong>
        <code>${escapeHTML(pathLabel)}</code>
      </div>
      <div class="admin-proposal-row__actions">
        ${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">OPEN ↗</a><button type="button" data-proposal-copy="${escapeHTML(url)}">COPY LINK</button>` : ''}
        ${item.source !== 'repo' ? `<button type="button" class="is-danger" data-proposal-delete="${escapeHTML(item.id)}"${disabled}>DELETE</button>` : ''}
      </div>
    </div>
    <div class="admin-proposal-fields">
      <label><span>STATUS</span><select data-proposal-field="status"${disabled}>${statusOptions(status)}</select></label>
      <label><span>CLIENT</span><input data-proposal-field="client" value="${escapeHTML(item.client || '')}" placeholder="회사 / 브랜드"${disabled}></label>
      <label><span>OWNER</span><input data-proposal-field="owner" value="${escapeHTML(item.owner || '')}" placeholder="담당자"${disabled}></label>
      <label><span>SENT DATE</span><input type="date" data-proposal-field="sentDate" value="${escapeHTML(item.sentDate || '')}"${disabled}></label>
    </div>
    <label class="admin-proposal-memo"><span>INTERNAL MEMO <b>PRIVATE</b></span><textarea rows="3" data-proposal-field="memo" placeholder="견적 피드백, 회신 상황, 후속 연락 메모"${disabled}>${escapeHTML(item.memo || '')}</textarea></label>
  </article>`;
};

const render = () => {
  const all = mergedItems();
  const counts = all.reduce((result, item) => {
    result.all += 1;
    const status = normalizeStatus(item.status);
    if (Object.prototype.hasOwnProperty.call(result, status)) result[status] += 1;
    return result;
  }, { all: 0, sent: 0, review: 0, won: 0 });

  Object.entries(counts).forEach(([key, value]) => {
    const node = document.querySelector(`[data-proposal-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });

  document.querySelectorAll('[data-proposal-summary]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.proposalSummary === activeStatus || (button.dataset.proposalSummary === 'all' && activeStatus === 'all'));
  });
  document.querySelectorAll('[data-proposal-status-filter]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.proposalStatusFilter === activeStatus);
  });

  const rows = filteredItems();
  const total = document.querySelector('[data-proposal-total]');
  if (total) total.textContent = `${rows.length} ITEMS`;
  const repoStatus = document.querySelector('[data-proposal-repo-status]');
  if (repoStatus) repoStatus.textContent = repoMessage;
  const dbStatus = document.querySelector('[data-proposal-db-status]');
  if (dbStatus) dbStatus.textContent = isAdmin ? 'FIREBASE / SYNC ON' : 'FIREBASE / READ ONLY';

  const list = document.querySelector('[data-proposal-list]');
  if (!list) return;
  list.innerHTML = rows.length ? rows.map(itemRowHTML).join('') : '<div class="admin-empty-live">조건에 맞는 제안서가 없습니다.</div>';
};

const loadRepoItems = async () => {
  try {
    const response = await fetch(REPO_API, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const payload = await response.json();
    const dirs = Array.isArray(payload) ? payload.filter((item) => item?.type === 'dir' && item?.name) : [];
    if (dirs.length) {
      repoItems = dirs.map((item) => ({
        id: item.name,
        slug: item.name,
        title: slugTitle(item.name),
        source: 'repo'
      }));
      repoMessage = `GITHUB / ${dirs.length} PROPOSALS DETECTED`;
    } else {
      repoMessage = `GITHUB / FALLBACK ${repoItems.length} ITEMS`;
    }
  } catch (error) {
    console.warn('[NINEWORKS Admin Proposals] repository sync failed', error);
    repoMessage = `GITHUB / FALLBACK ${repoItems.length} ITEMS`;
  }
  render();
};

const savePatch = async (id, patch) => {
  if (!db || !isAdmin || !id) return false;
  try {
    await setDoc(doc(db, COLLECTION, id), {
      ...patch,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('[NINEWORKS Admin Proposals] save failed', error);
    window.alert('제안서 관리 정보 저장에 실패했습니다. Firebase Rules를 확인해 주세요.');
    return false;
  }
};

const startRegistry = () => {
  if (!db || unsubscribeRegistry) return;
  unsubscribeRegistry = onSnapshot(collection(db, COLLECTION), (snapshot) => {
    metadataItems = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    render();
  }, (error) => {
    console.error('[NINEWORKS Admin Proposals] registry stream failed', error);
    metadataItems = [];
    render();
  });
};

const stopRegistry = () => {
  if (unsubscribeRegistry) unsubscribeRegistry();
  unsubscribeRegistry = null;
  metadataItems = [];
  render();
};

const openModal = () => {
  const modal = document.querySelector('[data-proposal-modal]');
  if (!modal) return;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('is-open'));
  modal.querySelector('input[name="title"]')?.focus();
};

const closeModal = () => {
  const modal = document.querySelector('[data-proposal-modal]');
  if (!modal) return;
  modal.classList.remove('is-open');
  window.setTimeout(() => { modal.hidden = true; }, 160);
};

const bindControls = () => {
  if (document.body.dataset.adminProposalBound === 'true') return;
  document.body.dataset.adminProposalBound = 'true';

  document.addEventListener('click', async (event) => {
    const summary = event.target.closest('[data-proposal-summary]');
    if (summary) {
      activeStatus = summary.dataset.proposalSummary || 'all';
      render();
      return;
    }

    const filter = event.target.closest('[data-proposal-status-filter]');
    if (filter) {
      activeStatus = filter.dataset.proposalStatusFilter || 'all';
      render();
      return;
    }

    if (event.target.closest('[data-proposal-add]')) {
      if (!isAdmin) return window.alert('관리자 로그인 후 등록할 수 있습니다.');
      openModal();
      return;
    }

    if (event.target.closest('[data-proposal-close]')) {
      closeModal();
      return;
    }

    const copy = event.target.closest('[data-proposal-copy]');
    if (copy) {
      const url = copy.dataset.proposalCopy || '';
      try {
        await navigator.clipboard.writeText(url);
        const original = copy.textContent;
        copy.textContent = 'COPIED';
        window.setTimeout(() => { copy.textContent = original; }, 1200);
      } catch (_) {
        window.prompt('링크를 복사하세요.', url);
      }
      return;
    }

    const remove = event.target.closest('[data-proposal-delete]');
    if (remove && isAdmin && db) {
      const id = remove.dataset.proposalDelete;
      if (!window.confirm('이 수동 등록 링크를 관리 목록에서 삭제할까요?')) return;
      try {
        await deleteDoc(doc(db, COLLECTION, id));
      } catch (error) {
        console.error('[NINEWORKS Admin Proposals] delete failed', error);
        window.alert('삭제에 실패했습니다.');
      }
    }
  });

  document.addEventListener('change', (event) => {
    const field = event.target.closest('[data-proposal-field]');
    if (!field) return;
    const row = field.closest('[data-proposal-id]');
    if (!row) return;
    savePatch(row.dataset.proposalId, { [field.dataset.proposalField]: field.value });
  });

  document.addEventListener('focusout', (event) => {
    const field = event.target.closest('textarea[data-proposal-field="memo"], input[data-proposal-field="client"], input[data-proposal-field="owner"]');
    if (!field) return;
    const row = field.closest('[data-proposal-id]');
    if (!row) return;
    savePatch(row.dataset.proposalId, { [field.dataset.proposalField]: field.value });
  });

  document.querySelector('[data-proposal-search]')?.addEventListener('input', (event) => {
    searchTerm = String(event.target.value || '').trim().toLowerCase();
    render();
  });

  document.querySelector('[data-proposal-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isAdmin || !db) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const url = safeURL(data.get('url'));
    if (!url) return window.alert('정상적인 http(s) 링크를 입력해 주세요.');
    const id = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const saved = await savePatch(id, {
      source: 'manual',
      title: safeText(data.get('title')) || '제안서',
      client: safeText(data.get('client')),
      owner: safeText(data.get('owner')),
      url,
      status: 'ready',
      createdAt: serverTimestamp()
    });
    if (saved) {
      form.reset();
      closeModal();
    }
  });
};

ensureUI();
bindControls();
loadRepoItems();
render();

if (!firebaseConfigReady || firebaseInitError || !auth || !db) {
  isAdmin = false;
  repoMessage += ' · FIREBASE CONFIG CHECK';
  render();
} else {
  onAuthStateChanged(auth, (user) => {
    isAdmin = String(user?.email || '').toLowerCase() === ADMIN_EMAIL;
    if (isAdmin) startRegistry();
    else stopRegistry();
    render();
  });
}

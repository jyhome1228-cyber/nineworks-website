import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {
  firebaseConfigReady,
  firebaseInitError,
  auth,
  db
} from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const topStatus = document.querySelector('.admin-status');
const topbarMeta = document.querySelector('.admin-topbar__meta');
const settingRows = Array.from(document.querySelectorAll('.admin-setting-list > div'));
let inquiryCache = [];
let visitorCache = [];
let unsubscribers = [];

const findSetting = (name) => settingRows.find((row) => row.querySelector('span')?.textContent.trim() === name);
const setSetting = (name, status, detail) => {
  const row = findSetting(name);
  if (!row) return;
  const strong = row.querySelector('strong');
  const paragraph = row.querySelector('p');
  if (strong) strong.textContent = status;
  if (paragraph && detail) paragraph.textContent = detail;
};
const setTopStatus = (label, online = false) => {
  if (!topStatus) return;
  topStatus.innerHTML = `<i></i> ${label}`;
  topStatus.dataset.online = online ? 'true' : 'false';
};
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const normalizeStatus = (status) => ['new', 'open', 'done'].includes(status) ? status : 'new';

const koreaDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const recentDateKeys = (days = 7) => {
  const result = [];
  const now = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    result.push(koreaDateKey(new Date(now.getTime() - offset * 86400000)));
  }
  return result;
};
const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};

const injectStyles = () => {
  if (document.getElementById('admin-firebase-live-style')) return;
  const style = document.createElement('style');
  style.id = 'admin-firebase-live-style';
  style.textContent = `
    .firebase-admin-gate{position:fixed;z-index:9999;inset:0;display:grid;place-items:center;padding:24px;background:#f2f2f0;color:#111}
    .firebase-admin-gate[hidden]{display:none}.firebase-admin-gate__box{width:min(100%,460px);border-top:1px solid #111;padding-top:22px}
    .firebase-admin-gate__eyebrow{display:block;margin-bottom:28px;color:#777;font-size:10px;letter-spacing:.08em}.firebase-admin-gate h2{margin:0 0 12px;font-size:32px;font-weight:500;letter-spacing:-.05em}
    .firebase-admin-gate p{margin:0 0 28px;color:#666;font-size:13px;line-height:1.7}.firebase-admin-gate label{display:block;margin-top:18px;color:#777;font-size:11px}
    .firebase-admin-gate input{width:100%;height:52px;border:0;border-bottom:1px solid #aaa;background:transparent;outline:0;font:inherit}.firebase-admin-gate input:focus{border-bottom-color:#111}
    .firebase-admin-gate button{display:flex;width:100%;min-height:58px;align-items:center;justify-content:space-between;margin-top:28px;padding:0 18px;border:0;background:#111;color:#fff;font:inherit;cursor:pointer}
    .firebase-admin-gate__error{min-height:20px;margin-top:14px!important;color:#a23333!important;font-size:11px!important}.admin-firebase-signout{min-height:32px;padding:0 10px;border:1px solid rgba(17,17,17,.2);background:transparent;color:#555;font-size:10px;cursor:pointer}
    .admin-status[data-online="true"] i{background:#1d8f52!important}.admin-live-block{margin-top:30px;border-top:1px solid #111}.admin-live-block__head{display:flex;align-items:end;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid #d7d7d2}
    .admin-live-block__head h3{margin:0;font-size:20px;font-weight:500}.admin-live-block__head span{color:#888;font-size:10px;letter-spacing:.07em}.admin-inquiry-list{border-left:1px solid #d7d7d2;border-right:1px solid #d7d7d2}
    .admin-inquiry-row{padding:18px;border-bottom:1px solid #d7d7d2;background:rgba(255,255,255,.28)}.admin-inquiry-row__top{display:grid;grid-template-columns:minmax(170px,1.4fr) minmax(130px,.9fr) minmax(160px,1fr) 120px;gap:18px;align-items:center}
    .admin-inquiry-row__name strong{display:block;font-size:14px}.admin-inquiry-row__name span,.admin-inquiry-row__service span{display:block;margin-top:4px;color:#777;font-size:11px;line-height:1.5}.admin-inquiry-row__service strong{font-size:11px;font-weight:500}
    .admin-inquiry-row__contact{font-size:11px;line-height:1.65;color:#555;overflow-wrap:anywhere}.admin-inquiry-status{width:100%;height:36px;padding:0 9px;border:1px solid #ccc;background:#fff;font-size:11px}
    .admin-inquiry-row details{margin-top:14px;padding-top:12px;border-top:1px solid #e1e1dd}.admin-inquiry-row summary{cursor:pointer;color:#666;font-size:11px}.admin-inquiry-row pre{margin:14px 0 0;padding:14px;background:#fff;border:1px solid #e3e3df;white-space:pre-wrap;overflow-wrap:anywhere;color:#444;font:11px/1.7 Arial,'Noto Sans KR',sans-serif}
    .admin-empty-live{padding:48px 18px;text-align:center;color:#888;font-size:12px;border-bottom:1px solid #d7d7d2}.admin-traffic-card{margin-top:24px;padding:22px;border:1px solid #d7d7d2;background:rgba(255,255,255,.28)}
    .admin-traffic-card__head{display:flex;justify-content:space-between;align-items:end;gap:20px;padding-bottom:16px;border-bottom:1px solid #111}.admin-traffic-card__head h3{margin:0;font-size:18px;font-weight:500}.admin-traffic-card__head span{color:#888;font-size:10px}
    .admin-traffic-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-left:1px solid #d7d7d2;margin-top:18px}.admin-traffic-day{min-height:92px;padding:13px;border-top:1px solid #d7d7d2;border-right:1px solid #d7d7d2;border-bottom:1px solid #d7d7d2}.admin-traffic-day span{display:block;color:#888;font-size:9px}.admin-traffic-day strong{display:block;margin-top:20px;font-size:22px;font-weight:500}
    @media(max-width:980px){.admin-inquiry-row__top{grid-template-columns:1fr 1fr}.admin-traffic-days{grid-template-columns:repeat(4,1fr)}}@media(max-width:620px){.admin-inquiry-row__top{grid-template-columns:1fr}.admin-traffic-days{grid-template-columns:repeat(2,1fr)}}`;
  document.head.appendChild(style);
};

const ensureGate = () => {
  let gate = document.querySelector('.firebase-admin-gate');
  if (gate) return gate;
  injectStyles();
  gate = document.createElement('div');
  gate.className = 'firebase-admin-gate';
  gate.innerHTML = `<form class="firebase-admin-gate__box" data-firebase-login>
    <span class="firebase-admin-gate__eyebrow">NINEWORKS / ADMIN ACCESS</span><h2>Administrator Login</h2>
    <p>Firebase Authentication에 등록된 나인웍스 관리자 계정으로 로그인합니다.</p>
    <label>EMAIL</label><input type="email" name="email" autocomplete="username" value="${ADMIN_EMAIL}" required>
    <label>PASSWORD</label><input type="password" name="password" autocomplete="current-password" required>
    <button type="submit"><span>LOGIN</span><span>↗</span></button><p class="firebase-admin-gate__error" data-firebase-login-error></p></form>`;
  document.body.appendChild(gate);
  return gate;
};
const hideGate = () => { const gate = document.querySelector('.firebase-admin-gate'); if (gate) gate.hidden = true; };
const showGateMessage = (message = '') => {
  const gate = ensureGate(); gate.hidden = false;
  const error = gate.querySelector('[data-firebase-login-error]'); if (error) error.textContent = message;
};
const ensureSignOut = () => {
  if (!topbarMeta || topbarMeta.querySelector('.admin-firebase-signout')) return;
  const button = document.createElement('button');
  button.className = 'admin-firebase-signout'; button.type = 'button'; button.textContent = 'LOGOUT';
  button.addEventListener('click', () => signOut(auth)); topbarMeta.appendChild(button);
};
const cleanup = () => {
  unsubscribers.forEach((fn) => { try { fn(); } catch {} });
  unsubscribers = []; inquiryCache = []; visitorCache = [];
};

const renderInquirySummary = () => {
  const panel = document.querySelector('[data-admin-panel="inquiry"]');
  if (!panel) return;
  const counts = inquiryCache.reduce((acc, item) => { acc[normalizeStatus(item.status)] += 1; return acc; }, { new: 0, open: 0, done: 0 });
  const cards = Array.from(panel.querySelectorAll('.admin-placeholder-grid article'));
  const rows = [['NEW','신규 문의',counts.new,'확인 전 문의'],['OPEN','상담 진행',counts.open,'견적·미팅 진행 중'],['DONE','완료 / 보관',counts.done,'계약 또는 종료된 문의']];
  cards.slice(0, 3).forEach((card, i) => {
    const [code, title, count, desc] = rows[i];
    card.innerHTML = `<span>${code}</span><strong>${count}건 · ${title}</strong><p>${desc}</p>`;
  });
};
const ensureInquiryList = () => {
  const panel = document.querySelector('[data-admin-panel="inquiry"]'); if (!panel) return null;
  let block = panel.querySelector('[data-admin-inquiry-live]'); if (block) return block;
  block = document.createElement('div'); block.className = 'admin-live-block'; block.dataset.adminInquiryLive = 'true';
  block.innerHTML = `<div class="admin-live-block__head"><div><span>Firestore / inquiries</span><h3>전체 문의 접수</h3></div><span data-inquiry-total>0 ITEMS</span></div><div class="admin-inquiry-list" data-inquiry-list></div>`;
  block.addEventListener('change', async (event) => {
    const select = event.target.closest('[data-inquiry-status]'); if (!select) return;
    select.disabled = true;
    try { await updateDoc(doc(db, 'inquiries', select.dataset.inquiryStatus), { status: normalizeStatus(select.value), updatedAt: serverTimestamp() }); }
    catch (error) { console.error(error); window.alert('문의 상태 변경에 실패했습니다.'); }
    finally { select.disabled = false; }
  });
  panel.appendChild(block); return block;
};
const renderInquiryList = () => {
  renderInquirySummary();
  const block = ensureInquiryList(); if (!block) return;
  const list = block.querySelector('[data-inquiry-list]'); const total = block.querySelector('[data-inquiry-total]');
  if (total) total.textContent = `${inquiryCache.length} ITEMS`;
  if (!inquiryCache.length) { if (list) list.innerHTML = '<div class="admin-empty-live">아직 접수된 문의가 없습니다.</div>'; return; }
  if (list) list.innerHTML = inquiryCache.map((item) => `<article class="admin-inquiry-row"><div class="admin-inquiry-row__top">
    <div class="admin-inquiry-row__name"><strong>${escapeHTML(item.company || item.projectName || '회사명 미입력')}</strong><span>${escapeHTML(item.contactName || '담당자 미입력')} · ${escapeHTML(formatDateTime(item.createdAt))}</span></div>
    <div class="admin-inquiry-row__service"><strong>${escapeHTML(item.service || 'GENERAL')}</strong><span>${escapeHTML(item.source || '-')}</span></div>
    <div class="admin-inquiry-row__contact">${escapeHTML(item.email || '-')}<br>${escapeHTML(item.phone || '-')}</div>
    <select class="admin-inquiry-status" data-inquiry-status="${escapeHTML(item.id)}"><option value="new"${normalizeStatus(item.status)==='new'?' selected':''}>NEW / 신규</option><option value="open"${normalizeStatus(item.status)==='open'?' selected':''}>OPEN / 진행</option><option value="done"${normalizeStatus(item.status)==='done'?' selected':''}>DONE / 완료</option></select>
    </div><details><summary>문의 상세 내용 보기</summary><pre>${escapeHTML(item.details || item.message || '상세 내용 없음')}</pre></details></article>`).join('');
};

const ensureTrafficCard = () => {
  const dashboard = document.querySelector('[data-admin-panel="dashboard"]'); const grid = dashboard?.querySelector('.admin-stat-grid'); if (!dashboard || !grid) return null;
  let card = dashboard.querySelector('[data-admin-traffic]'); if (card) return card;
  card = document.createElement('article'); card.className = 'admin-traffic-card'; card.dataset.adminTraffic = 'true';
  card.innerHTML = `<div class="admin-traffic-card__head"><h3>Daily Visitors</h3><span>UNIQUE BROWSER / KST</span></div><div class="admin-traffic-days" data-traffic-days></div>`;
  grid.insertAdjacentElement('afterend', card); return card;
};
const renderDashboard = () => {
  const stats = Array.from(document.querySelectorAll('[data-admin-panel="dashboard"] .admin-stat-grid .admin-stat'));
  const today = koreaDateKey(); const keys = recentDateKeys(7);
  const daily = visitorCache.reduce((acc, item) => { acc[item.date] = (acc[item.date] || 0) + 1; return acc; }, {});
  const data = [
    ['Today Visitors', daily[today] || 0, '오늘 방문한 고유 브라우저'],
    ['7 Days Visitors', keys.reduce((sum, key) => sum + (daily[key] || 0), 0), '최근 7일 방문자 합계'],
    ['New Inquiries', inquiryCache.filter((item) => normalizeStatus(item.status) === 'new').length, '아직 확인하지 않은 문의'],
    ['Total Inquiries', inquiryCache.length, '전체 누적 문의']
  ];
  stats.slice(0, 4).forEach((card, i) => { const [label, value, desc] = data[i]; card.innerHTML = `<span>${label}</span><strong>${value}</strong><p>${desc}</p>`; });
  const days = ensureTrafficCard()?.querySelector('[data-traffic-days]');
  if (days) days.innerHTML = keys.map((key) => `<div class="admin-traffic-day"><span>${key.slice(5).replace('-','.')}</span><strong>${daily[key] || 0}</strong></div>`).join('');
};

const startAdminData = () => {
  cleanup(); ensureInquiryList(); ensureTrafficCard();
  unsubscribers.push(onSnapshot(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')), (snapshot) => {
    inquiryCache = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })); renderInquiryList(); renderDashboard();
  }, (error) => {
    console.error('[NINEWORKS Admin] inquiries read failed', error);
    const list = ensureInquiryList()?.querySelector('[data-inquiry-list]'); if (list) list.innerHTML = '<div class="admin-empty-live">문의 데이터를 불러오지 못했습니다. Firestore Rules를 게시했는지 확인해 주세요.</div>';
  }));
  const startDate = recentDateKeys(7)[0];
  unsubscribers.push(onSnapshot(query(collection(db, 'dailyVisitors'), where('date', '>=', startDate), orderBy('date', 'desc')), (snapshot) => {
    visitorCache = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })); renderDashboard();
  }, (error) => console.error('[NINEWORKS Admin] visitors read failed', error)));
};

injectStyles();
if (!firebaseConfigReady) {
  setTopStatus('FIREBASE CONFIG REQUIRED');
  showGateMessage('Firebase Web App 설정값이 필요합니다.');
} else if (firebaseInitError || !auth || !db) {
  setTopStatus('FIREBASE ERROR');
  showGateMessage('Firebase 초기화에 실패했습니다.');
} else {
  setSetting('Authentication', 'CONNECTED', `${ADMIN_EMAIL} 관리자 인증`);
  setSetting('Firestore', 'CONNECTED', '문의 · 클라이언트 · 방문자 DB 연결');
  setTopStatus('AUTH CHECK');
  const gate = ensureGate();
  const form = gate.querySelector('[data-firebase-login]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorBox = form.querySelector('[data-firebase-login-error]'); const button = form.querySelector('button[type="submit"]');
    const fd = new FormData(form); const email = String(fd.get('email') || '').trim().toLowerCase(); const password = String(fd.get('password') || '');
    if (email !== ADMIN_EMAIL) { if (errorBox) errorBox.textContent = '등록된 관리자 이메일로 로그인해 주세요.'; return; }
    if (errorBox) errorBox.textContent = ''; if (button) button.disabled = true;
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (error) { console.error(error); if (errorBox) errorBox.textContent = '로그인 정보를 확인해 주세요.'; }
    finally { if (button) button.disabled = false; }
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) { cleanup(); setTopStatus('LOGIN REQUIRED'); showGateMessage(''); return; }
    if (String(user.email || '').toLowerCase() !== ADMIN_EMAIL) {
      cleanup(); setTopStatus('ACCESS DENIED'); await signOut(auth); showGateMessage('허용되지 않은 관리자 계정입니다.'); return;
    }
    hideGate(); ensureSignOut(); setTopStatus('ADMIN ONLINE', true);
    setSetting('Authentication', 'ADMIN ONLINE', user.email || ADMIN_EMAIL);
    startAdminData();
  });
}

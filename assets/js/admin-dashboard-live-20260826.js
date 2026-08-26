import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const ALERT_PREF_KEY = 'nineworks_admin_live_alert_enabled';
const VIEW_SERVICE = 'PORTFOLIO VIEW';

let unsubscribe = null;
let initialized = false;
let inquiryCache = [];
let audioContext = null;
let audioUnlocked = false;
let alertEnabled = localStorage.getItem(ALERT_PREF_KEY) !== 'false';

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#039;');

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
const normalizeStatus = (value = '') => ['new', 'open', 'done'].includes(value) ? value : 'new';
const isTrashed = (item) => Boolean(item?.trashedAt);
const isMemberSignup = (item) => {
  const source = String(item?.source || '').toLowerCase();
  return source.includes('join.html') || source.includes('register.html');
};
const isRecruit = (item) => {
  const service = String(item?.service || '').toUpperCase();
  const source = String(item?.source || '').toLowerCase();
  return service.includes('RECRUIT') || source.includes('/recruit');
};
const isPortfolioView = (item) => String(item?.service || '').trim().toUpperCase() === VIEW_SERVICE;
const shouldAlert = (item) => !isTrashed(item) && !isMemberSignup(item) && !isPortfolioView(item);

const asDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const timestampMs = (value) => asDate(value)?.getTime() || 0;
const formatDateTime = (value) => {
  const date = asDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};
const koreaDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const detailsValue = (details = '', keys = []) => {
  const lines = String(details || '').split(/\r?\n/);
  for (const line of lines) {
    const index = line.indexOf(':');
    if (index < 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    if (keys.some((candidate) => key === candidate.toLowerCase())) return line.slice(index + 1).trim();
  }
  return '';
};

const loadStyle = () => {
  if (document.querySelector('link[data-admin-dashboard-live-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-dashboard-live-20260826.css?v=20260826-1';
  link.dataset.adminDashboardLiveStyle = 'true';
  document.head.appendChild(link);
};

const injectDashboardUI = () => {
  const dashboard = document.querySelector('[data-admin-panel="dashboard"]');
  if (!dashboard || dashboard.querySelector('[data-dashboard-live-activity]')) return;

  const wrap = document.createElement('div');
  wrap.className = 'admin-dashboard-live-grid';
  wrap.dataset.dashboardLiveActivity = 'true';
  wrap.innerHTML = `
    <section class="admin-block">
      <div class="admin-block__head">
        <div><span class="admin-label">Recruit Activity</span><h3>최근 리크루잇 지원</h3></div>
        <button type="button" data-dashboard-open-recruits>전체 지원 보기 ↗</button>
      </div>
      <div class="admin-dashboard-live-summary"><strong data-dashboard-recruit-total>0</strong><span data-dashboard-recruit-meta>신규 0건 · 전체 지원</span></div>
      <div class="admin-dashboard-live-list" data-dashboard-recruit-list><div class="admin-dashboard-live-empty">지원 데이터를 불러오는 중입니다.</div></div>
    </section>
    <section class="admin-block">
      <div class="admin-block__head">
        <div><span class="admin-label">Major Portfolio Access</span><h3>최근 포트폴리오 열람자</h3></div>
        <button type="button" data-dashboard-open-portfolio>전체 열람 기록 보기 ↗</button>
      </div>
      <div class="admin-dashboard-live-summary"><strong data-dashboard-portfolio-total>0</strong><span data-dashboard-portfolio-meta>오늘 0건 · 전체 열람</span></div>
      <div class="admin-dashboard-live-list" data-dashboard-portfolio-list><div class="admin-dashboard-live-empty">열람 기록을 불러오는 중입니다.</div></div>
    </section>`;

  dashboard.appendChild(wrap);

  wrap.querySelector('[data-dashboard-open-recruits]')?.addEventListener('click', () => {
    const target = document.querySelector('[data-admin-tab="recruits"]');
    if (target) target.click();
  });
  wrap.querySelector('[data-dashboard-open-portfolio]')?.addEventListener('click', () => {
    const target = document.querySelector('[data-portfolio-view-tab]');
    if (target) target.click();
  });
};

const injectAlertToggle = () => {
  const meta = document.querySelector('.admin-topbar__meta');
  if (!meta || meta.querySelector('[data-admin-live-alert-toggle]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'admin-alert-toggle';
  button.dataset.adminLiveAlertToggle = 'true';
  button.addEventListener('click', handleAlertToggle);
  const signout = meta.querySelector('.admin-firebase-signout');
  if (signout) meta.insertBefore(button, signout);
  else meta.appendChild(button);
  updateAlertButton();
};

const notificationPermission = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

const updateAlertButton = () => {
  const button = document.querySelector('[data-admin-live-alert-toggle]');
  if (!button) return;
  const permission = notificationPermission();
  button.dataset.enabled = alertEnabled ? 'true' : 'false';
  button.dataset.ready = audioUnlocked && permission === 'granted' ? 'true' : 'partial';

  if (!alertEnabled) {
    button.textContent = '알림 꺼짐';
  } else if (audioUnlocked && permission === 'granted') {
    button.textContent = '알림 켜짐';
  } else if (audioUnlocked && (permission === 'denied' || permission === 'unsupported')) {
    button.textContent = '알림음 켜짐';
  } else {
    button.textContent = '알림 켜기';
  }
};

const unlockAudio = async (force = false) => {
  if (!alertEnabled && !force) return false;
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') await audioContext.resume();
    audioUnlocked = audioContext.state === 'running';
    updateAlertButton();
    return audioUnlocked;
  } catch (error) {
    console.warn('[NINEWORKS Admin] alert audio unlock failed', error);
    audioUnlocked = false;
    updateAlertButton();
    return false;
  }
};

const scheduleTone = (ctx, startAt, frequency, duration, volume = 0.065) => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
};

const playTripleDingDong = async () => {
  if (!alertEnabled) return false;
  const ready = audioUnlocked || await unlockAudio();
  if (!ready || !audioContext) return false;
  const base = audioContext.currentTime + 0.04;
  for (let index = 0; index < 3; index += 1) {
    const at = base + index * 0.72;
    scheduleTone(audioContext, at, 880, 0.22, 0.07);
    scheduleTone(audioContext, at + 0.24, 659.25, 0.30, 0.075);
  }
  return true;
};

const showToast = (title, detail = '', state = 'ok') => {
  let toast = document.querySelector('[data-admin-live-toast]');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'admin-live-toast';
    toast.dataset.adminLiveToast = 'true';
    document.body.appendChild(toast);
  }
  toast.dataset.state = state;
  toast.innerHTML = `<strong>${escapeHTML(title)}</strong><span>${escapeHTML(detail)}</span>`;
  toast.classList.add('is-visible');
  window.clearTimeout(toast._hideTimer);
  toast._hideTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 6000);
};

const alertLabel = (item) => {
  if (isRecruit(item)) return '리크루잇 지원';
  const service = String(item?.service || '').trim();
  return service || '프로젝트 문의';
};

const openAlertTarget = (item) => {
  window.focus();
  if (isRecruit(item)) {
    document.querySelector('[data-admin-tab="recruits"]')?.click();
  } else {
    document.querySelector('[data-admin-tab="inquiry"]')?.click();
  }
};

const showBrowserNotification = (items) => {
  if (!alertEnabled || notificationPermission() !== 'granted' || !items.length) return;
  const newest = items[items.length - 1];
  const label = alertLabel(newest);
  const name = newest.company || newest.projectName || newest.contactName || '새 접수';
  const title = items.length > 1 ? `NINEWORKS · 새 접수 ${items.length}건` : `NINEWORKS · 새 ${label}`;
  const body = items.length > 1 ? `${label} 포함 새 접수가 도착했습니다.` : `${name}${newest.contactName && newest.contactName !== name ? ` · ${newest.contactName}` : ''}`;
  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.png?v=20260825-2',
      tag: 'nineworks-admin-live',
      renotify: true
    });
    notification.onclick = () => {
      notification.close();
      openAlertTarget(newest);
    };
  } catch (error) {
    console.warn('[NINEWORKS Admin] browser notification failed', error);
  }
};

async function handleAlertToggle() {
  const permission = notificationPermission();
  const needsSetup = !audioUnlocked || permission === 'default';

  if (!alertEnabled) {
    alertEnabled = true;
    localStorage.setItem(ALERT_PREF_KEY, 'true');
  } else if (!needsSetup) {
    alertEnabled = false;
    localStorage.setItem(ALERT_PREF_KEY, 'false');
    updateAlertButton();
    showToast('실시간 알림을 껐습니다.', '다시 켜면 새 문의 알림음과 브라우저 알림을 받을 수 있습니다.');
    return;
  }

  await unlockAudio(true);
  if ('Notification' in window && Notification.permission === 'default') {
    try { await Notification.requestPermission(); } catch (error) { console.warn('[NINEWORKS Admin] notification permission failed', error); }
  }
  updateAlertButton();

  const nextPermission = notificationPermission();
  if (audioUnlocked && nextPermission === 'granted') {
    await playTripleDingDong();
    showToast('실시간 알림이 켜졌습니다.', '새 문의가 들어오면 딩동 3회와 Chrome 알림으로 안내합니다.');
  } else if (audioUnlocked) {
    await playTripleDingDong();
    showToast('알림음이 켜졌습니다.', 'Chrome 알림 권한은 차단되어 있어 소리로만 안내합니다.', 'warning');
  } else {
    showToast('알림 활성화가 필요합니다.', 'Chrome 화면을 한 번 클릭한 뒤 상단의 알림 켜기를 다시 눌러주세요.', 'warning');
  }
}

const renderDashboardActivity = () => {
  injectDashboardUI();
  const active = inquiryCache.filter((item) => !isTrashed(item));
  const recruits = active
    .filter(isRecruit)
    .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
  const views = active
    .filter(isPortfolioView)
    .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));

  const recruitTotal = document.querySelector('[data-dashboard-recruit-total]');
  const recruitMeta = document.querySelector('[data-dashboard-recruit-meta]');
  const recruitList = document.querySelector('[data-dashboard-recruit-list]');
  const newRecruitCount = recruits.filter((item) => normalizeStatus(item.status) === 'new').length;
  if (recruitTotal) recruitTotal.textContent = String(recruits.length);
  if (recruitMeta) recruitMeta.textContent = `신규 ${newRecruitCount}건 · 전체 지원`;
  if (recruitList) {
    const rows = recruits.slice(0, 4);
    recruitList.innerHTML = rows.length ? rows.map((item) => {
      const role = detailsValue(item.details, ['currentRole', '현재 상태']) || '지원자';
      return `<button type="button" class="admin-dashboard-live-row" data-dashboard-recruit-row>
        <span><strong>${escapeHTML(item.contactName || '이름 미입력')}</strong><small>${escapeHTML(item.email || '-')}</small></span>
        <span><strong>${escapeHTML(role)}</strong><small>${escapeHTML(normalizeStatus(item.status).toUpperCase())}</small></span>
        <time>${escapeHTML(formatDateTime(item.createdAt))}</time>
      </button>`;
    }).join('') : '<div class="admin-dashboard-live-empty">아직 접수된 리크루잇 지원이 없습니다.</div>';
    recruitList.querySelectorAll('[data-dashboard-recruit-row]').forEach((row) => row.addEventListener('click', () => document.querySelector('[data-admin-tab="recruits"]')?.click()));
  }

  const today = koreaDateKey();
  const todayViews = views.filter((item) => {
    const date = asDate(item.createdAt);
    return date && koreaDateKey(date) === today;
  }).length;
  const portfolioTotal = document.querySelector('[data-dashboard-portfolio-total]');
  const portfolioMeta = document.querySelector('[data-dashboard-portfolio-meta]');
  const portfolioList = document.querySelector('[data-dashboard-portfolio-list]');
  if (portfolioTotal) portfolioTotal.textContent = String(views.length);
  if (portfolioMeta) portfolioMeta.textContent = `오늘 ${todayViews}건 · 전체 열람`;
  if (portfolioList) {
    const rows = views.slice(0, 4);
    portfolioList.innerHTML = rows.length ? rows.map((item) => `
      <button type="button" class="admin-dashboard-live-row" data-dashboard-portfolio-row>
        <span><strong>${escapeHTML(item.contactName || '이름 미입력')}</strong><small>MAJOR PORTFOLIO VIEWER</small></span>
        <span><strong>${escapeHTML(item.company || '소속 미입력')}</strong><small>ORGANIZATION</small></span>
        <time>${escapeHTML(formatDateTime(item.createdAt))}</time>
      </button>`).join('') : '<div class="admin-dashboard-live-empty">아직 메이저 포트폴리오 열람 기록이 없습니다.</div>';
    portfolioList.querySelectorAll('[data-dashboard-portfolio-row]').forEach((row) => row.addEventListener('click', () => document.querySelector('[data-portfolio-view-tab]')?.click()));
  }
};

const flashTitle = (items) => {
  if (!items.length) return;
  const original = document.title.replace(/^🔔\s*/, '');
  document.title = `🔔 새 접수 ${items.length}건 · ${original}`;
  window.setTimeout(() => {
    if (document.title.startsWith('🔔')) document.title = original;
  }, 15000);
};

const handleAddedItems = async (items) => {
  const alertItems = items.filter(shouldAlert);
  if (!alertItems.length || !alertEnabled) return;
  const newest = alertItems[alertItems.length - 1];
  const soundPlayed = await playTripleDingDong();
  showBrowserNotification(alertItems);
  flashTitle(alertItems);

  const title = alertItems.length > 1 ? `새 접수 ${alertItems.length}건이 들어왔습니다.` : `새 ${alertLabel(newest)}가 들어왔습니다.`;
  const detail = `${newest.company || newest.projectName || newest.contactName || '새 접수'} · ${formatDateTime(newest.createdAt)}`;
  showToast(title, soundPlayed ? `${detail} · 알림음 3회 재생` : `${detail} · 상단 ‘알림 켜기’를 눌러 소리를 활성화하세요.`, soundPlayed ? 'ok' : 'warning');
};

const startStream = () => {
  if (unsubscribe || !db) return;
  initialized = false;
  unsubscribe = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    inquiryCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderDashboardActivity();

    if (!initialized) {
      initialized = true;
      return;
    }
    const added = snapshot.docChanges()
      .filter((change) => change.type === 'added')
      .map((change) => ({ id: change.doc.id, ...change.doc.data() }));
    if (added.length) handleAddedItems(added);
  }, (error) => {
    console.error('[NINEWORKS Admin] dashboard live stream failed', error);
    const recruitList = document.querySelector('[data-dashboard-recruit-list]');
    const portfolioList = document.querySelector('[data-dashboard-portfolio-list]');
    if (recruitList) recruitList.innerHTML = '<div class="admin-dashboard-live-empty">지원 데이터를 불러오지 못했습니다.</div>';
    if (portfolioList) portfolioList.innerHTML = '<div class="admin-dashboard-live-empty">열람 기록을 불러오지 못했습니다.</div>';
  });
};

const stopStream = () => {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  initialized = false;
  inquiryCache = [];
};

const init = () => {
  loadStyle();
  injectDashboardUI();
  injectAlertToggle();

  document.addEventListener('pointerdown', () => {
    if (alertEnabled && !audioUnlocked) unlockAudio();
  }, { passive: true });

  if (!firebaseConfigReady || firebaseInitError || !auth || !db) return;
  onAuthStateChanged(auth, (user) => {
    const isAdmin = normalizeEmail(user?.email) === ADMIN_EMAIL;
    if (isAdmin) {
      injectAlertToggle();
      startStream();
    } else {
      stopStream();
    }
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();

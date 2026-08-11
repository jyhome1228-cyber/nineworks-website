import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {
  firebaseConfigReady,
  firebaseInitError,
  auth,
  db,
  storage
} from './firebase-client.js';

const topStatus = document.querySelector('.admin-status');
const topbarMeta = document.querySelector('.admin-topbar__meta');

const settingRows = Array.from(document.querySelectorAll('.admin-setting-list > div'));
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

const injectGateStyles = () => {
  if (document.getElementById('admin-firebase-gate-style')) return;
  const style = document.createElement('style');
  style.id = 'admin-firebase-gate-style';
  style.textContent = `
    .firebase-admin-gate{position:fixed;z-index:9999;inset:0;display:grid;place-items:center;padding:24px;background:#f2f2f0;color:#111}
    .firebase-admin-gate[hidden]{display:none}
    .firebase-admin-gate__box{width:min(100%,460px);border-top:1px solid #111;padding-top:22px}
    .firebase-admin-gate__eyebrow{display:block;margin-bottom:28px;color:#777;font-size:10px;letter-spacing:.08em;text-transform:uppercase}
    .firebase-admin-gate h2{margin:0 0 12px;font-size:32px;font-weight:500;letter-spacing:-.05em}
    .firebase-admin-gate p{margin:0 0 28px;color:#666;font-size:13px;line-height:1.7}
    .firebase-admin-gate label{display:block;margin-top:18px;color:#777;font-size:11px}
    .firebase-admin-gate input{width:100%;height:52px;border:0;border-bottom:1px solid #aaa;border-radius:0;background:transparent;outline:0;font:inherit}
    .firebase-admin-gate input:focus{border-bottom-color:#111}
    .firebase-admin-gate button{display:flex;width:100%;min-height:58px;align-items:center;justify-content:space-between;margin-top:28px;padding:0 18px;border:0;background:#111;color:#fff;font:inherit;cursor:pointer}
    .firebase-admin-gate__error{min-height:20px;margin-top:14px!important;color:#a23333!important;font-size:11px!important}
    .admin-firebase-signout{min-height:32px;padding:0 10px;border:1px solid rgba(17,17,17,.2);background:transparent;color:#555;font-size:10px;letter-spacing:.04em;cursor:pointer}
    .admin-status[data-online="true"] i{background:#1d8f52!important}
  `;
  document.head.appendChild(style);
};

const ensureGate = () => {
  let gate = document.querySelector('.firebase-admin-gate');
  if (gate) return gate;
  injectGateStyles();
  gate = document.createElement('div');
  gate.className = 'firebase-admin-gate';
  gate.innerHTML = `
    <form class="firebase-admin-gate__box" data-firebase-login>
      <span class="firebase-admin-gate__eyebrow">NINEWORKS / ADMIN ACCESS</span>
      <h2>Administrator Login</h2>
      <p>Firebase Authentication에 등록된 관리자 계정으로 로그인합니다.</p>
      <label>EMAIL</label>
      <input type="email" name="email" autocomplete="username" required>
      <label>PASSWORD</label>
      <input type="password" name="password" autocomplete="current-password" required>
      <button type="submit"><span>LOGIN</span><span>↗</span></button>
      <p class="firebase-admin-gate__error" data-firebase-login-error></p>
    </form>`;
  document.body.appendChild(gate);
  return gate;
};

const hideGate = () => {
  const gate = document.querySelector('.firebase-admin-gate');
  if (gate) gate.hidden = true;
};

const showGateMessage = (message) => {
  const gate = ensureGate();
  gate.hidden = false;
  const error = gate.querySelector('[data-firebase-login-error]');
  if (error) error.textContent = message || '';
};

const ensureSignOut = () => {
  if (!topbarMeta || topbarMeta.querySelector('.admin-firebase-signout')) return;
  const button = document.createElement('button');
  button.className = 'admin-firebase-signout';
  button.type = 'button';
  button.textContent = 'LOGOUT';
  button.addEventListener('click', () => signOut(auth));
  topbarMeta.appendChild(button);
};

const markConfigRequired = () => {
  setTopStatus('FIREBASE CONFIG REQUIRED');
  setSetting('Authentication', 'CONFIG REQUIRED', 'Firebase Web App 설정값 입력 대기');
  setSetting('Firestore', 'CONFIG REQUIRED', '프로젝트 연결 후 콘텐츠 DB 활성화');
  setSetting('Storage', 'CONFIG REQUIRED', 'Blaze 요금제 및 버킷 생성 후 활성화');
};

const markInitError = () => {
  setTopStatus('FIREBASE ERROR');
  setSetting('Authentication', 'ERROR', 'Firebase 초기화 오류 확인 필요');
  setSetting('Firestore', 'ERROR', 'Firebase 초기화 오류 확인 필요');
  setSetting('Storage', 'ERROR', 'Firebase 초기화 오류 확인 필요');
};

if (!firebaseConfigReady) {
  markConfigRequired();
} else if (firebaseInitError || !auth || !db || !storage) {
  markInitError();
} else {
  setSetting('Authentication', 'CONNECTED', '이메일/비밀번호 관리자 인증 준비 완료');
  setSetting('Firestore', 'CONNECTED', '콘텐츠 · 문의 · 클라이언트 DB 연결 준비 완료');
  setSetting('Storage', 'CONNECTED', '포트폴리오 · 프로젝트 이미지 저장소 연결 준비 완료');
  setTopStatus('AUTH CHECK');

  const gate = ensureGate();
  const form = gate.querySelector('[data-firebase-login]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorBox = form.querySelector('[data-firebase-login-error]');
    const submit = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    if (errorBox) errorBox.textContent = '';
    if (submit) submit.disabled = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('[NINEWORKS Admin] login failed', error);
      if (errorBox) errorBox.textContent = '로그인 정보를 확인해 주세요.';
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setTopStatus('LOGIN REQUIRED');
      showGateMessage('');
      return;
    }

    setTopStatus('VERIFYING ADMIN');
    try {
      const adminSnapshot = await getDoc(doc(db, 'admins', user.uid));
      if (!adminSnapshot.exists()) {
        setTopStatus('ACCESS DENIED');
        showGateMessage('이 계정은 admins 컬렉션에 관리자 권한이 등록되지 않았습니다.');
        return;
      }

      hideGate();
      ensureSignOut();
      setTopStatus('ADMIN ONLINE', true);
      setSetting('Authentication', 'ADMIN ONLINE', user.email || 'Authenticated administrator');
    } catch (error) {
      console.error('[NINEWORKS Admin] admin verification failed', error);
      setTopStatus('RULES CHECK');
      showGateMessage('관리자 권한 문서 또는 Firestore Security Rules 설정을 확인해 주세요.');
    }
  });
}

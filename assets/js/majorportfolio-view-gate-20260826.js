import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const SESSION_KEY = 'nineworks-majorportfolio-view-access-v3';
const PROFILE_KEY = 'nineworks-majorportfolio-view-profile-v3';
const VIEW_SERVICE = 'PORTFOLIO VIEW';
const VIEW_SOURCE = 'majorportfolio/register.html';

const gate = document.querySelector('[data-major-view-gate]');
const form = gate?.querySelector('[data-major-view-form]');
const errorBox = gate?.querySelector('[data-major-view-error]');
const welcome = document.querySelector('[data-major-welcome]');
const welcomeName = welcome?.querySelector('[data-major-welcome-name]');
const welcomeOrg = welcome?.querySelector('[data-major-welcome-org]');
const welcomeCopy = welcome?.querySelector('.major-welcome__copy');

const setError = (message = '') => {
  if (errorBox) errorBox.textContent = message;
};

const safeSessionGet = (key) => {
  try { return sessionStorage.getItem(key); }
  catch (_) { return null; }
};

const safeSessionSet = (key, value) => {
  try { sessionStorage.setItem(key, value); }
  catch (_) {}
};

const sessionGranted = () => safeSessionGet(SESSION_KEY) === '1';

const readProfile = () => {
  try {
    const raw = safeSessionGet(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const name = String(parsed?.name || '').trim();
    const organization = String(parsed?.organization || '').trim();
    return name && organization ? { name, organization } : null;
  } catch (_) {
    return null;
  }
};

const grantSession = (profile) => {
  safeSessionSet(SESSION_KEY, '1');
  safeSessionSet(PROFILE_KEY, JSON.stringify(profile));
};

const hideGate = (instant = false) => {
  if (!gate) return;
  document.body.classList.remove('is-onboarding');
  if (instant) {
    gate.hidden = true;
    gate.classList.remove('is-hidden');
    return;
  }
  gate.classList.add('is-hidden');
  window.setTimeout(() => { gate.hidden = true; }, 460);
};

const showGate = () => {
  if (!gate) return;
  if (welcome) welcome.hidden = true;
  gate.hidden = false;
  gate.classList.remove('is-hidden');
  document.body.classList.add('is-onboarding');
};

const placeWelcomeInMain = () => {
  if (!welcome) return;
  const main = document.querySelector('.major-shell main');
  const hero = main?.querySelector('.major-hero');
  if (main && hero && welcome.parentElement !== main) main.insertBefore(welcome, hero);
};

const showWelcome = (profile) => {
  if (!welcome || !profile) return;
  placeWelcomeInMain();
  if (welcomeName) welcomeName.textContent = `${profile.name} 담당자`;
  if (welcomeOrg) welcomeOrg.textContent = profile.organization;
  if (welcomeCopy) welcomeCopy.textContent = '필요한 프로젝트의 상세 자료나 별도 포트폴리오가 있다면 언제든 편하게 문의해 주세요.';
  welcome.hidden = false;
  welcome.classList.remove('is-hidden');
  document.body.classList.remove('is-onboarding');
};

const normalize = (value = '') => String(value || '').trim().replace(/\s+/g, ' ');

const init = () => {
  if (!gate || !form) return;

  const savedProfile = readProfile();
  if (sessionGranted() && savedProfile) {
    hideGate(true);
    showWelcome(savedProfile);
    return;
  }

  showGate();
  const nameInput = form.elements.namedItem('name');
  if (nameInput instanceof HTMLElement) window.setTimeout(() => nameInput.focus(), 120);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setError('');

    const data = new FormData(form);
    const name = normalize(data.get('name'));
    const organization = normalize(data.get('organization'));
    const privacyConsent = data.get('privacyConsent') === 'on';

    if (!name) {
      setError('성함을 입력해 주세요.');
      form.elements.namedItem('name')?.focus();
      return;
    }
    if (!organization) {
      setError('소속을 입력해 주세요.');
      form.elements.namedItem('organization')?.focus();
      return;
    }
    if (!privacyConsent) {
      setError('포트폴리오 열람을 위해 개인정보 수집·이용 동의가 필요합니다.');
      form.elements.namedItem('privacyConsent')?.focus();
      return;
    }
    if (!firebaseConfigReady || firebaseInitError || !db) {
      setError('접속 기록 저장 연결을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    gate.dataset.saving = 'true';

    try {
      await addDoc(collection(db, 'inquiries'), {
        status: 'new',
        source: VIEW_SOURCE,
        service: VIEW_SERVICE,
        company: organization.slice(0, 120),
        contactName: name.slice(0, 60),
        email: '',
        phone: '',
        projectName: 'Major Portfolio',
        projectType: 'Portfolio Viewer Access',
        message: '메이저 포트폴리오 열람',
        details: '개인정보 수집·이용 동의: 동의\n수집 항목: 성함, 소속\n이용 목적: 메이저 포트폴리오 열람자 확인 및 접근 이력 관리',
        pageTitle: document.title,
        createdAt: serverTimestamp()
      });

      const profile = { name: name.slice(0, 60), organization: organization.slice(0, 120) };
      grantSession(profile);
      hideGate(true);
      showWelcome(profile);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (error) {
      console.error('[NINEWORKS majorportfolio] access log save failed', error);
      setError('접속 기록 저장에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.');
    } finally {
      delete gate.dataset.saving;
      if (button) button.disabled = false;
    }
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();

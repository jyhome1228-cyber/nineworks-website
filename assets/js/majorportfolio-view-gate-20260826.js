import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const LOGGED_KEY = 'nineworks-majorportfolio-view-log-sent-v5';
const VIEW_SERVICE = 'PORTFOLIO VIEW';
const VIEW_SOURCE = 'majorportfolio/register.html';

const normalize = (value = '') => String(value || '').trim().replace(/\s+/g, ' ');
const safeGet = (key) => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };

const saveAccessLog = async (profile) => {
  if (safeGet(LOGGED_KEY) === '1') return;
  const name = normalize(profile?.name);
  const organization = normalize(profile?.organization);
  if (!name || !organization) return;
  if (!firebaseConfigReady || firebaseInitError || !db) {
    console.warn('[NINEWORKS majorportfolio] Firebase unavailable; access remains allowed.');
    return;
  }

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
    safeSet(LOGGED_KEY, '1');
  } catch (error) {
    console.warn('[NINEWORKS majorportfolio] access log save failed', error);
  }
};

window.addEventListener('nineworks-majorportfolio-access', (event) => {
  saveAccessLog(event.detail);
});

if (window.NW_MAJORPORTFOLIO_ACCESS_PENDING) {
  saveAccessLog(window.NW_MAJORPORTFOLIO_ACCESS_PENDING);
}

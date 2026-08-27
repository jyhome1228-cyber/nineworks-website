import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db } from './firebase-client.js';

const CONSENT_KEY = 'nw:phyto:contract-consent:v1';
const CONSENT_SERVICE = 'CLIENT CONTRACT CONSENT';
const PAYMENT_LABELS = {
  deposit_waiting: '선금 입금대기중',
  deposit_confirmed: '선금입금확인',
  balance_confirmed: '잔금입금확인'
};

const PAYMENT_COPY = {
  deposit_waiting: '계약 확정 및 프로젝트 착수를 위한 선금 입금을 기다리고 있습니다.',
  deposit_confirmed: '선금 입금이 확인되었습니다. 프로젝트 진행 단계에 맞춰 업무를 이어갑니다.',
  balance_confirmed: '잔금 입금까지 확인되어 프로젝트 정산이 완료되었습니다.'
};

let unsubscribePayment = null;

const loadStyle = () => {
  if (document.querySelector('link[data-phyto-contract-payment]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../../assets/css/phyto-contract-payment-20260827.css?v=20260827-1';
  link.dataset.phytoContractPayment = 'true';
  document.head.appendChild(link);
};

const savedConsent = () => {
  try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; }
  catch (_) { return false; }
};

const saveConsentLocal = () => {
  try { localStorage.setItem(CONSENT_KEY, 'accepted'); }
  catch (_) {}
};

const setConsentComplete = (button, result) => {
  if (!button) return;
  button.textContent = '계약 내용 동의 완료';
  button.classList.add('is-complete');
  button.setAttribute('aria-disabled', 'true');
  if (result) result.textContent = '동의 내용이 나인웍스 어드민에 기록되었습니다. 확인 후 정식 계약서를 이메일로 전달드립니다.';
};

const setupConsent = () => {
  const button = document.querySelector('.confirm-cta');
  if (!button) return;
  let result = document.querySelector('[data-contract-consent-result]');
  if (!result) {
    result = document.createElement('p');
    result.className = 'nw-contract-consent-result';
    result.dataset.contractConsentResult = 'true';
    button.closest('.confirm-actions')?.insertAdjacentElement('afterend', result);
  }

  if (savedConsent()) {
    setConsentComplete(button, result);
    return;
  }

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    if (button.classList.contains('is-complete') || button.dataset.saving === 'true') return;
    button.dataset.saving = 'true';
    const original = button.textContent;
    button.textContent = '동의 처리 중...';
    if (result) result.textContent = '';

    try {
      if (!db) throw new Error('Firebase not ready');
      await addDoc(collection(db, 'inquiries'), {
        status: 'new',
        source: 'client/phyto/contract.html',
        service: CONSENT_SERVICE,
        company: '파이토레볼루션',
        contactName: '',
        email: '',
        phone: '',
        projectName: '고스란 브랜드 아이덴티티 · 기본형 가이드라인 · 패키지 디자인 프로젝트',
        projectType: '계약 동의',
        message: '파이토레볼루션 클라이언트가 웹 계약서 내용을 확인하고 동의했습니다.',
        details: 'clientId: phyto\ncontractVersion: 2026-08-27-v1\nsource: WEB CONTRACT REVIEW',
        pageTitle: document.title,
        createdAt: serverTimestamp()
      });
      saveConsentLocal();
      setConsentComplete(button, result);
    } catch (error) {
      console.error('[NINEWORKS Client] contract consent save failed', error);
      button.textContent = original;
      if (result) result.textContent = '동의 기록을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
      delete button.dataset.saving;
    }
  });
};

const removePaymentPanel = () => {
  document.querySelector('[data-phyto-payment-panel]')?.remove();
};

const renderPaymentPanel = (status) => {
  const side = document.querySelector('.side-stack');
  if (!side || !PAYMENT_LABELS[status]) {
    removePaymentPanel();
    return;
  }

  let panel = side.querySelector('[data-phyto-payment-panel]');
  if (!panel) {
    panel = document.createElement('section');
    panel.className = 'panel nw-phyto-payment-panel';
    panel.dataset.phytoPaymentPanel = 'true';
    const notice = side.querySelector('.notice');
    if (notice) side.insertBefore(panel, notice);
    else side.appendChild(panel);
  }

  const keys = Object.keys(PAYMENT_LABELS);
  panel.innerHTML = `
    <div class="panel-head"><h2>PAYMENT STATUS</h2><span>07</span></div>
    <div class="nw-phyto-payment-status">
      <span class="nw-phyto-payment-kicker">CURRENT PAYMENT</span>
      <strong>${PAYMENT_LABELS[status]}</strong>
      <p>${PAYMENT_COPY[status]}</p>
      <div class="nw-phyto-payment-steps">
        ${keys.map((key, index) => `<span class="${key === status ? 'is-active' : ''} ${keys.indexOf(status) > index ? 'is-done' : ''}"><i>${String(index + 1).padStart(2, '0')}</i>${PAYMENT_LABELS[key]}</span>`).join('')}
      </div>
    </div>`;
};

const subscribePaymentStatus = () => {
  if (!document.querySelector('.side-stack') || !db) return;
  removePaymentPanel();
  unsubscribePayment?.();
  unsubscribePayment = onSnapshot(doc(db, 'clientPortals', 'phyto'), (snapshot) => {
    if (!snapshot.exists()) {
      removePaymentPanel();
      return;
    }
    const data = snapshot.data() || {};
    if (data.enabled !== true || data.paymentStatusVisible !== true || !PAYMENT_LABELS[data.paymentStatus]) {
      removePaymentPanel();
      return;
    }
    renderPaymentPanel(data.paymentStatus);
  }, (error) => {
    console.warn('[NINEWORKS Client] payment status stream failed', error);
    removePaymentPanel();
  });
};

const start = () => {
  loadStyle();
  setupConsent();
  subscribePaymentStatus();
  window.addEventListener('pagehide', () => unsubscribePayment?.(), { once: true });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

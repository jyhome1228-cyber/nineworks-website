import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { auth } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const ACCESS_KEY = 'nw:phyto:client-access:v1';
const ACCESS_TTL = 12 * 60 * 60 * 1000;
const EXPECTED_HASH = '3a42fb039c65ccac7a3b50fddb88e8b6e5aa333f119fb4727f89c207b5ada496';

function readGrant() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCESS_KEY) || 'null');
    return parsed && Number(parsed.expiresAt) > Date.now();
  } catch (_) {
    return false;
  }
}

function saveGrant() {
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify({ expiresAt: Date.now() + ACCESS_TTL }));
  } catch (_) {}
}

function unlock() {
  document.body.classList.remove('nw-phyto-locked');
  const gate = document.querySelector('.nw-phyto-gate');
  if (gate) gate.remove();
}

function gateMarkup() {
  return `
    <div class="nw-phyto-gate" role="dialog" aria-modal="true" aria-label="파이토레볼루션 프로젝트 접속">
      <div class="nw-phyto-gate__card">
        <div class="nw-phyto-gate__brand">
          <img src="/assets/logo-nineworks.svg" alt="NINEWORKS">
          <span>PRIVATE CLIENT PORTAL</span>
        </div>
        <p class="nw-phyto-gate__kicker">PHYTOREVOLUTION · GOSRAN</p>
        <h1 class="nw-phyto-gate__title">프로젝트 전용 페이지</h1>
        <p class="nw-phyto-gate__desc">파이토레볼루션 대표님께 공유드리는 전용 프로젝트 공간입니다. 계약, 견적, 진행 현황과 정산 관련 문서를 한곳에서 확인하실 수 있습니다.</p>
        <div class="nw-phyto-gate__onboarding">
          <div class="nw-phyto-gate__step"><b>01</b><span>현재 계약 및 프로젝트 세팅 단계의 자료를 확인합니다.</span></div>
          <div class="nw-phyto-gate__step"><b>02</b><span>계약서 초안과 견적 내용을 확인한 뒤 계약 확인을 전달합니다.</span></div>
          <div class="nw-phyto-gate__step"><b>03</b><span>프로젝트 진행에 따라 일정과 상태가 이 페이지에 업데이트됩니다.</span></div>
        </div>
        <form class="nw-phyto-gate__form" data-phyto-gate-form>
          <input class="nw-phyto-gate__input" data-phyto-gate-input type="password" autocomplete="current-password" placeholder="프로젝트 비밀번호" aria-label="프로젝트 비밀번호" required>
          <button class="nw-phyto-gate__button" type="submit">프로젝트 입장</button>
        </form>
        <div class="nw-phyto-gate__error" data-phyto-gate-error aria-live="polite"></div>
        <div class="nw-phyto-gate__meta"><span>인증 상태는 이 브라우저에서 12시간 유지됩니다.</span><span>문의 · info@9works.kr</span></div>
      </div>
    </div>`;
}

function checkingMarkup() {
  return `
    <div class="nw-phyto-gate" role="status" aria-live="polite">
      <div class="nw-phyto-gate__card">
        <div class="nw-phyto-gate__brand"><img src="/assets/logo-nineworks.svg" alt="NINEWORKS"><span>PRIVATE CLIENT PORTAL</span></div>
        <div class="nw-phyto-gate__checking">접근 권한을 확인하고 있습니다.</div>
      </div>
    </div>`;
}

async function hashText(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function renderForm() {
  const existing = document.querySelector('.nw-phyto-gate');
  if (existing) existing.outerHTML = gateMarkup();
  else document.body.insertAdjacentHTML('beforeend', gateMarkup());
  const form = document.querySelector('[data-phyto-gate-form]');
  const input = document.querySelector('[data-phyto-gate-input]');
  const error = document.querySelector('[data-phyto-gate-error]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = String(input?.value || '').trim();
    if (!value) return;
    try {
      const digest = await hashText(value);
      if (digest === EXPECTED_HASH) {
        saveGrant();
        unlock();
        return;
      }
    } catch (_) {}
    if (error) error.textContent = '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.';
    if (input) {
      input.value = '';
      input.focus();
    }
  });
  window.setTimeout(() => input?.focus(), 50);
}

function init() {
  if (!document.body.classList.contains('nw-phyto-locked')) return;
  if (readGrant()) {
    unlock();
    return;
  }

  document.body.insertAdjacentHTML('beforeend', checkingMarkup());
  if (!auth) {
    renderForm();
    return;
  }

  const currentEmail = String(auth.currentUser?.email || '').toLowerCase();
  if (currentEmail === ADMIN_EMAIL) {
    unlock();
    return;
  }

  let resolved = false;
  const fallback = window.setTimeout(() => {
    if (!resolved) renderForm();
  }, 1200);

  const stop = onAuthStateChanged(auth, (user) => {
    if (resolved) return;
    resolved = true;
    window.clearTimeout(fallback);
    stop();
    const email = String(user?.email || '').toLowerCase();
    if (email === ADMIN_EMAIL) unlock();
    else renderForm();
  }, () => {
    if (resolved) return;
    resolved = true;
    window.clearTimeout(fallback);
    renderForm();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();

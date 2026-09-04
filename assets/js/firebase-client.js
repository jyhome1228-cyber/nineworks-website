import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';
import { firebaseConfig, firebaseConfigReady } from './firebase-config.js';

const patchSolutionsMenu = () => {
  let desktopReady = false;
  let mobileReady = false;

  const desktopMenu = document.querySelector('.site-nav-dropdown[aria-label="솔루션 메뉴"]');
  if (desktopMenu) {
    desktopReady = true;
    const overview = Array.from(desktopMenu.querySelectorAll('a')).find((link) => link.textContent.includes('서비스 전체보기'));
    overview?.remove();

    if (!desktopMenu.querySelector('a[href="/ai-model.html"]')) {
      const aiLink = document.createElement('a');
      aiLink.href = '/ai-model.html';
      aiLink.innerHTML = '<span>AI 모델 스튜디오</span><small>AI MODEL</small>';
      const signature = desktopMenu.querySelector('a[href="/signature-project.html"]');
      if (signature?.nextSibling) signature.parentNode.insertBefore(aiLink, signature.nextSibling);
      else desktopMenu.appendChild(aiLink);
    }
  }

  const mobileGroup = Array.from(document.querySelectorAll('.menu-nav__group[data-menu-group]')).find((group) => {
    const button = group.querySelector('.menu-nav__toggle');
    return button && button.textContent.trim().startsWith('SOLUTIONS');
  });
  const mobileMenu = mobileGroup?.querySelector('.menu-nav__sub');
  if (mobileMenu) {
    mobileReady = true;
    const overview = Array.from(mobileMenu.querySelectorAll('a')).find((link) => link.textContent.includes('서비스 전체보기'));
    overview?.remove();

    if (!mobileMenu.querySelector('a[href="/ai-model.html"]')) {
      const aiLink = document.createElement('a');
      aiLink.href = '/ai-model.html';
      aiLink.textContent = 'AI 모델 스튜디오';
      const signature = mobileMenu.querySelector('a[href="/signature-project.html"]');
      if (signature?.nextSibling) signature.parentNode.insertBefore(aiLink, signature.nextSibling);
      else mobileMenu.appendChild(aiLink);
    }
  }

  if (/\/ai-model\.html$|\/ai-model\/?$/i.test(location.pathname)) {
    const solutionsLink = document.querySelector('.site-primary-nav [data-nav-key="solutions"]');
    if (solutionsLink) {
      document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((link) => {
        const active = link === solutionsLink;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }
  }

  return desktopReady && mobileReady;
};

if (!patchSolutionsMenu() && document.documentElement) {
  const menuObserver = new MutationObserver(() => {
    if (patchSolutionsMenu()) menuObserver.disconnect();
  });
  menuObserver.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => menuObserver.disconnect(), 8000);
}

let app = null;
let auth = null;
let db = null;
let storage = null;
let firebaseInitError = null;

if (firebaseConfigReady) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    firebaseInitError = error;
    console.error('[NINEWORKS Firebase] initialization failed', error);
  }
}

export {
  firebaseConfig,
  firebaseConfigReady,
  firebaseInitError,
  app,
  auth,
  db,
  storage
};

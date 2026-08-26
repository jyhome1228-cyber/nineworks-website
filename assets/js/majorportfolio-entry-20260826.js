(() => {
  const SESSION_KEY = 'nineworks-majorportfolio-view-access-v6';
  const PROFILE_KEY = 'nineworks-majorportfolio-view-profile-v6';

  const gate = document.querySelector('[data-major-view-gate]');
  const form = gate?.querySelector('[data-major-view-form]');
  const errorBox = gate?.querySelector('[data-major-view-error]');
  const welcome = document.querySelector('[data-major-welcome]');
  const welcomeName = welcome?.querySelector('[data-major-welcome-name]');
  const welcomeOrg = welcome?.querySelector('[data-major-welcome-org]');
  const welcomeCopy = welcome?.querySelector('.major-welcome__copy');

  const normalize = (value = '') => String(value || '').trim().replace(/\s+/g, ' ');
  const safeGet = (key) => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };

  const readProfile = () => {
    try {
      const raw = safeGet(PROFILE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const name = normalize(parsed?.name);
      const organization = normalize(parsed?.organization);
      return name && organization ? { name, organization } : null;
    } catch (_) { return null; }
  };
  const setError = (message = '') => { if (errorBox) errorBox.textContent = message; };

  const placeWelcome = (profile) => {
    if (!welcome || !profile) return;
    const main = document.querySelector('.major-shell main');
    const search = main?.querySelector('[data-major-search]');
    const hero = main?.querySelector('.major-hero');
    const reference = search || hero;
    if (main && reference && welcome.parentElement !== main) main.insertBefore(welcome, reference);
    else if (main && reference && welcome.nextElementSibling !== reference) main.insertBefore(welcome, reference);
    if (welcomeName) welcomeName.textContent = `${profile.organization} ${profile.name} 담당자`;
    if (welcomeOrg) welcomeOrg.textContent = profile.organization;
    if (welcomeCopy) welcomeCopy.textContent = '필요한 프로젝트의 상세 자료나 별도 포트폴리오가 있다면 언제든 편하게 문의해 주세요.';
    welcome.hidden = false;
    welcome.style.display = '';
    welcome.classList.remove('is-hidden');
  };

  const hideGate = () => {
    if (!gate) return;
    gate.hidden = true;
    gate.style.display = 'none';
    gate.classList.remove('is-hidden');
    document.body.classList.remove('is-onboarding');
    document.body.style.overflow = '';
  };
  const showGate = () => {
    if (!gate) return;
    gate.hidden = false;
    gate.style.display = '';
    gate.classList.remove('is-hidden');
    document.body.classList.add('is-onboarding');
  };
  const enter = (profile, shouldLog = false) => {
    safeSet(SESSION_KEY, '1');
    safeSet(PROFILE_KEY, JSON.stringify(profile));
    hideGate();
    placeWelcome(profile);
    window.scrollTo(0, 0);
    if (shouldLog) {
      window.NW_MAJORPORTFOLIO_ACCESS_PENDING = profile;
      window.dispatchEvent(new CustomEvent('nineworks-majorportfolio-access', { detail: profile }));
    }
  };
  const getValidProfile = () => {
    const data = new FormData(form);
    const name = normalize(data.get('name'));
    const organization = normalize(data.get('organization'));
    const privacyConsent = data.get('privacyConsent') === 'on';
    if (!name) { setError('성함을 입력해 주세요.'); form.elements.namedItem('name')?.focus(); return null; }
    if (!organization) { setError('소속을 입력해 주세요.'); form.elements.namedItem('organization')?.focus(); return null; }
    if (!privacyConsent) { setError('포트폴리오 열람을 위해 개인정보 수집·이용 동의가 필요합니다.'); form.elements.namedItem('privacyConsent')?.focus(); return null; }
    return { name:name.slice(0,60), organization:organization.slice(0,120) };
  };
  const handleEnter = (event) => { event?.preventDefault(); setError(''); const profile=getValidProfile(); if(profile) enter(profile,true); };
  const init = () => {
    if (!gate || !form) return;
    const saved = readProfile();
    if (safeGet(SESSION_KEY) === '1' && saved) { enter(saved,false); return; }
    showGate();
    form.addEventListener('submit', handleEnter);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true }); else init();
})();

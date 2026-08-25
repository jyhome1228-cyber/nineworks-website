(() => {
  if (window.__NW_SITE_FIREBASE_INIT__) return;
  window.__NW_SITE_FIREBASE_INIT__ = true;

  const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
  let firebasePromise = null;

  const installTypographyGuard = () => {
    if (document.body?.classList.contains('admin-page')) return;
    if (document.querySelector('link[data-nw-typography-guard]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/typography-guard-20260820.css?v=20260824-2';
    link.dataset.nwTypographyGuard = 'true';
    document.head.appendChild(link);
  };
  installTypographyGuard();

  const installMemberSystem = () => {
    if (document.body?.classList.contains('admin-page')) return;
    if (document.querySelector('script[data-nw-member-auth]')) return;
    const script = document.createElement('script');
    script.src = '/assets/js/member-auth.js?v=20260823-1';
    script.dataset.nwMemberAuth = 'true';
    script.defer = true;
    document.head.appendChild(script);
  };
  installMemberSystem();

  const getFirebase = () => {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import('./firebase-client.js'),
        import(FIRESTORE_SDK)
      ]).then(([client, firestore]) => {
        if (!client.firebaseConfigReady || !client.db) throw new Error('Firebase configuration is not ready.');
        return { db: client.db, ...firestore };
      });
    }
    return firebasePromise;
  };

  const koreaDateKey = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date).reduce((acc, part) => { if (part.type !== 'literal') acc[part.type] = part.value; return acc; }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  };

  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch { /* storage disabled */ } }
  };

  const ensureVisitorId = () => {
    const key = 'nw_visitor_id';
    let value = safeStorage.get(key);
    if (value) return value;
    value = (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : `nw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    safeStorage.set(key, value);
    return value;
  };

  const trackDailyVisitor = async () => {
    if (document.body?.classList.contains('admin-page')) return;
    const date = koreaDateKey();
    const marker = `nw_visited_${date}`;
    if (safeStorage.get(marker) === '1') return;
    try {
      const { db, doc, setDoc, serverTimestamp } = await getFirebase();
      const visitorId = ensureVisitorId();
      const referrer = document.referrer ? new URL(document.referrer).hostname.slice(0, 180) : '';
      const id = `${date}_${visitorId}`;
      await setDoc(doc(db, 'dailyVisitors', id), { date, visitorId, firstPath: `${location.pathname}${location.search}`.slice(0, 500), referrer, createdAt: serverTimestamp() });
      safeStorage.set(marker, '1');
    } catch (error) { console.warn('[NINEWORKS] visitor tracking skipped', error); }
  };

  const labelMap = {
    company: '회사 / 브랜드', name: '담당자명', email: '이메일', phone: '연락처', projectName: '프로젝트명', projectType: '작업 유형', requirements: '요청사항', status: '진행 상태', startDate: '시작 희망일', endDate: '목표 완료일', needs: '필요 업무', volume: '월 예상 요청량', channels: '주요 운영 채널', brandStatus: '현재 브랜드 상태', startMonth: '시작 희망 시점', productType: '제작 품목', printType: '인쇄 품목', packageType: '패키지 종류', sampleGoal: '샘플 제작 목적', quantity: '수량', size: '규격', customSize: '직접 입력 규격', material: '소재 / 지류', color: '인쇄 / 색상', sides: '인쇄 면', pages: '페이지 / 접지', binding: '제본 / 가공', finishing: '후가공', designStatus: '디자인 파일 상태', dielineStatus: '칼선 / 도면 상태', proof: '교정 / 샘플', deliveryDate: '희망 납기', deliveryLocation: '배송 지역', digitalType: '프로젝트 유형', buildStatus: '신규 / 리뉴얼', currentUrl: '현재 사이트 / 서비스 URL', functions: '필요 기능', platform: '현재 또는 희망 플랫폼', integrations: '연동 필요 항목', budget: '예상 예산', reference: '자료 / 레퍼런스 링크', message: '추가 요청사항', partnerCategory: '파트너 공정', location: '공장 / 사업장 지역', equipment: '주요 설비 / 전문 공정', minOrder: '주요 최소수량 / 적정수량', leadTime: '평균 제작 소요기간', website: '홈페이지 / 포트폴리오', capacity: '월 생산 가능량 / 특징', clientRegistered: '나인웍스 등록 클라이언트 확인', clientStatus: '클라이언트 상태', companyType: '회사 / 사업 유형', businessNumber: '사업자등록번호', address: '주소', serviceInterest: '주요 이용 서비스', projectHistory: '기존 프로젝트 / 협업 이력'
  };

  const getValues = (fd, names) => { for (const name of names) { const values = fd.getAll(name).map((value) => String(value || '').trim()).filter(Boolean); if (values.length) return values; } return []; };
  const firstValue = (fd, names) => getValues(fd, names)[0] || '';
  const buildDetails = (fd) => {
    const grouped = new Map();
    for (const [key, raw] of fd.entries()) { if (['privacy', '개인정보동의'].includes(key)) continue; const value = String(raw || '').trim(); if (!value) continue; if (!grouped.has(key)) grouped.set(key, []); grouped.get(key).push(value); }
    const lines = [];
    grouped.forEach((values, key) => lines.push(`${labelMap[key] || key}: ${values.join(', ')}`));
    return lines.join('\n').slice(0, 15000);
  };

  const detectService = (form) => { if (form.dataset.sectorLabel) return form.dataset.sectorLabel.slice(0, 160); if (form.classList.contains('contact-panel')) return 'CONTACT'; if (form.matches('[data-mail-form]')) return 'PROJECT'; return 'GENERAL'; };
  const saveInquiry = async (form) => {
    const fd = new FormData(form);
    const { db, collection, addDoc, serverTimestamp } = await getFirebase();
    const service = detectService(form);
    const pagePath = `${location.pathname}${location.search}`.slice(0, 500);
    const company = firstValue(fd, ['company', '회사명']);
    const contactName = firstValue(fd, ['name', '담당자명']);
    const email = firstValue(fd, ['email', '이메일']);
    const phone = firstValue(fd, ['phone', '연락처']);
    const projectName = firstValue(fd, ['projectName', '프로젝트명']);
    const projectTypes = getValues(fd, ['projectType', '작업유형', 'needs', 'serviceInterest']);
    const message = firstValue(fd, ['requirements', '프로젝트내용', 'message', '현재상황']);
    return addDoc(collection(db, 'inquiries'), { status: 'new', source: pagePath, service, company: company.slice(0, 200), contactName: contactName.slice(0, 120), email: email.slice(0, 240), phone: phone.slice(0, 80), projectName: projectName.slice(0, 200), projectType: projectTypes.join(', ').slice(0, 500), message: message.slice(0, 3000), details: buildDetails(fd), pageTitle: String(document.title || '').slice(0, 240), createdAt: serverTimestamp() });
  };

  const setFormState = (form, mode, message = '') => {
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    const note = form.querySelector('.contact-note, .intake-note, [data-form-note]');
    if (button) { if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML; button.disabled = mode === 'loading'; if (mode === 'loading') button.innerHTML = '<span>접수 중...</span><span>↗</span>'; else if (mode === 'success') button.innerHTML = '<span>접수 완료</span><span>✓</span>'; else button.innerHTML = button.dataset.originalHtml; }
    if (note && message) note.textContent = message;
  };

  const isPartnerDesignerForm = (form) => {
    if (!(form instanceof HTMLFormElement)) return false;
    return form.classList.contains('recruit-form') || /PARTNER DESIGNER/i.test(form.dataset.sectorLabel || '') || /recruit\.html$|\/recruit\/?$/i.test(location.pathname);
  };

  const ensureRegistrationModal = () => {
    let modal = document.querySelector('[data-registration-success-modal]');
    if (modal) return modal;

    if (!document.querySelector('style[data-registration-success-style]')) {
      const style = document.createElement('style');
      style.dataset.registrationSuccessStyle = 'true';
      style.textContent = `
        .nw-registration-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(20,20,20,.42);backdrop-filter:blur(4px)}
        .nw-registration-modal.is-open{display:flex}
        .nw-registration-modal__panel{width:min(560px,100%);background:#fff;border:1px solid #d7d7d1;padding:34px;box-shadow:0 24px 80px rgba(0,0,0,.16)}
        .nw-registration-modal__eyebrow{margin:0 0 42px;font-size:10px;font-weight:600;letter-spacing:.08em;color:#777}
        .nw-registration-modal__panel h2{margin:0;font-size:clamp(26px,3vw,38px);font-weight:500;line-height:1.18;letter-spacing:-.045em}
        .nw-registration-modal__copy{margin:18px 0 0;color:#555;font-size:14px;line-height:1.8}
        .nw-registration-modal__sub{margin:24px 0 0;padding-top:18px;border-top:1px solid #e2e2dd;color:#7a7a76;font-size:11.5px;line-height:1.7}
        .nw-registration-modal__button{width:100%;margin-top:30px;padding:15px 18px;border:1px solid #111;background:#111;color:#fff;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
        .nw-registration-modal__button:hover{opacity:.86}
        @media(max-width:680px){.nw-registration-modal{padding:16px}.nw-registration-modal__panel{padding:26px 22px}.nw-registration-modal__eyebrow{margin-bottom:30px}}
      `;
      document.head.appendChild(style);
    }

    modal = document.createElement('div');
    modal.className = 'nw-registration-modal';
    modal.setAttribute('data-registration-success-modal', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'nw-registration-success-title');
    modal.innerHTML = `
      <div class="nw-registration-modal__panel">
        <p class="nw-registration-modal__eyebrow">NINEWORKS / REGISTRATION COMPLETE</p>
        <h2 id="nw-registration-success-title">접수가 완료되었습니다.</h2>
        <p class="nw-registration-modal__copy">작성해주신 내용을 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
        <p class="nw-registration-modal__sub">나인웍스 파트너 디자이너 등록 여부 및 프로젝트 관련 안내는 입력해주신 연락처 또는 이메일을 통해 전달드립니다.</p>
        <button class="nw-registration-modal__button" type="button" data-registration-success-close>확인</button>
      </div>`;
    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.removeProperty('overflow');
    };
    modal.querySelector('[data-registration-success-close]')?.addEventListener('click', close);
    modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) close(); });
    return modal;
  };

  const showRegistrationModal = () => {
    const modal = ensureRegistrationModal();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => modal.querySelector('[data-registration-success-close]')?.focus(), 0);
  };

  const isInquiryForm = (form) => form instanceof HTMLFormElement && form.matches('.contact-panel, [data-sector-form], [data-quote-form], [data-mail-form]');

  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!isInquiryForm(form)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;
    if (form.classList.contains('inquiry-form')) { const fd = new FormData(form); if (fd.getAll('projectType').length === 0) { window.alert('필요한 작업 유형을 한 개 이상 선택해 주세요.'); return; } }
    const partnerDesignerForm = isPartnerDesignerForm(form);
    setFormState(form, 'loading', partnerDesignerForm ? '등록 신청을 안전하게 접수하고 있습니다.' : '문의 내용을 안전하게 접수하고 있습니다.');
    try {
      await saveInquiry(form);
      form.reset();
      form.dispatchEvent(new Event('change', { bubbles: true }));
      if (partnerDesignerForm) {
        setFormState(form, 'success', '등록 신청이 정상적으로 접수되었습니다. 확인 후 빠른 시일 내에 연락드리겠습니다.');
        showRegistrationModal();
      } else {
        setFormState(form, 'success', '문의가 접수되었습니다. 확인 후 영업일 기준 2–3일 이내 연락드리겠습니다.');
      }
      window.setTimeout(() => setFormState(form, 'idle'), 3500);
    } catch (error) {
      console.error('[NINEWORKS] inquiry submission failed', error);
      setFormState(form, 'error', '접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 info@9works.kr로 보내주세요.');
      window.alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, true);

  trackDailyVisitor();
})();
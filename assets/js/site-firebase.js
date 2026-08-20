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
    link.href = '/assets/css/typography-guard-20260820.css?v=20260820-1';
    link.dataset.nwTypographyGuard = 'true';
    document.head.appendChild(link);
  };
  installTypographyGuard();

  const getFirebase = () => {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import('./firebase-client.js'),
        import(FIRESTORE_SDK)
      ]).then(([client, firestore]) => {
        if (!client.firebaseConfigReady || !client.db) {
          throw new Error('Firebase configuration is not ready.');
        }
        return { db: client.db, ...firestore };
      });
    }
    return firebasePromise;
  };

  const koreaDateKey = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date).reduce((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  };

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); }
      catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); }
      catch { /* storage disabled */ }
    }
  };

  const ensureVisitorId = () => {
    const key = 'nw_visitor_id';
    let value = safeStorage.get(key);
    if (value) return value;
    value = (window.crypto && typeof window.crypto.randomUUID === 'function')
      ? window.crypto.randomUUID()
      : `nw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
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
      await setDoc(doc(db, 'dailyVisitors', id), {
        date,
        visitorId,
        firstPath: `${location.pathname}${location.search}`.slice(0, 500),
        referrer,
        createdAt: serverTimestamp()
      });
      safeStorage.set(marker, '1');
    } catch (error) {
      console.warn('[NINEWORKS] visitor tracking skipped', error);
    }
  };

  const labelMap = {
    company: '회사 / 브랜드', name: '담당자명', email: '이메일', phone: '연락처',
    projectName: '프로젝트명', projectType: '작업 유형', requirements: '요청사항', status: '진행 상태',
    startDate: '시작 희망일', endDate: '목표 완료일', needs: '필요 업무', volume: '월 예상 요청량',
    channels: '주요 운영 채널', brandStatus: '현재 브랜드 상태', startMonth: '시작 희망 시점',
    productType: '제작 품목', printType: '인쇄 품목', packageType: '패키지 종류', sampleGoal: '샘플 제작 목적',
    quantity: '수량', size: '규격', customSize: '직접 입력 규격', material: '소재 / 지류', color: '인쇄 / 색상',
    sides: '인쇄 면', pages: '페이지 / 접지', binding: '제본 / 가공', finishing: '후가공',
    designStatus: '디자인 파일 상태', dielineStatus: '칼선 / 도면 상태', proof: '교정 / 샘플',
    deliveryDate: '희망 납기', deliveryLocation: '배송 지역', digitalType: '프로젝트 유형', buildStatus: '신규 / 리뉴얼',
    currentUrl: '현재 사이트 / 서비스 URL', functions: '필요 기능', platform: '현재 또는 희망 플랫폼',
    integrations: '연동 필요 항목', budget: '예상 예산', reference: '자료 / 레퍼런스 링크', message: '추가 요청사항',
    partnerCategory: '파트너 공정', location: '공장 / 사업장 지역', equipment: '주요 설비 / 전문 공정',
    minOrder: '주요 최소수량 / 적정수량', leadTime: '평균 제작 소요기간', website: '홈페이지 / 포트폴리오',
    capacity: '월 생산 가능량 / 특징', clientRegistered: '나인웍스 등록 클라이언트 확인', clientStatus: '클라이언트 상태',
    companyType: '회사 / 사업 유형', businessNumber: '사업자등록번호', address: '주소', serviceInterest: '주요 이용 서비스',
    projectHistory: '기존 프로젝트 / 협업 이력'
  };

  const getValues = (fd, names) => {
    for (const name of names) {
      const values = fd.getAll(name).map((value) => String(value || '').trim()).filter(Boolean);
      if (values.length) return values;
    }
    return [];
  };

  const firstValue = (fd, names) => getValues(fd, names)[0] || '';

  const buildDetails = (fd) => {
    const grouped = new Map();
    for (const [key, raw] of fd.entries()) {
      if (['privacy', '개인정보동의'].includes(key)) continue;
      const value = String(raw || '').trim();
      if (!value) continue;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(value);
    }
    const lines = [];
    grouped.forEach((values, key) => {
      lines.push(`${labelMap[key] || key}: ${values.join(', ')}`);
    });
    return lines.join('\n').slice(0, 15000);
  };

  const detectService = (form) => {
    if (form.dataset.sectorLabel) return form.dataset.sectorLabel.slice(0, 160);
    if (form.classList.contains('contact-panel')) return 'CONTACT';
    if (form.matches('[data-mail-form]')) return 'PROJECT';
    return 'GENERAL';
  };

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

    return addDoc(collection(db, 'inquiries'), {
      status: 'new',
      source: pagePath,
      service,
      company: company.slice(0, 200),
      contactName: contactName.slice(0, 120),
      email: email.slice(0, 240),
      phone: phone.slice(0, 80),
      projectName: projectName.slice(0, 200),
      projectType: projectTypes.join(', ').slice(0, 500),
      message: message.slice(0, 3000),
      details: buildDetails(fd),
      pageTitle: String(document.title || '').slice(0, 240),
      createdAt: serverTimestamp()
    });
  };

  const showInquirySuccessPopup = () => {
    const existing = document.querySelector('[data-inquiry-success-popup]');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.dataset.inquirySuccessPopup = 'true';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'inquiry-success-title');
    popup.innerHTML = `
      <style>
        [data-inquiry-success-popup]{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.48)}
        [data-inquiry-success-popup] .inquiry-success-card{width:min(100%,440px);padding:34px;background:#fff;color:#111;box-shadow:0 24px 80px rgba(0,0,0,.22)}
        [data-inquiry-success-popup] .inquiry-success-label{margin:0 0 18px;font-size:11px;font-weight:600;letter-spacing:.1em}
        [data-inquiry-success-popup] h2{margin:0;font-size:28px;font-weight:500;line-height:1.25;letter-spacing:-.04em}
        [data-inquiry-success-popup] p{margin:16px 0 0;color:#555;font-size:14px;line-height:1.75;word-break:keep-all}
        [data-inquiry-success-popup] .inquiry-success-phone{display:inline-block;margin-top:8px;color:#111;font-size:20px;font-weight:600;text-decoration:none}
        [data-inquiry-success-popup] .inquiry-success-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:28px}
        [data-inquiry-success-popup] .inquiry-success-actions button,
        [data-inquiry-success-popup] .inquiry-success-actions a{display:flex;min-height:50px;align-items:center;justify-content:center;border:1px solid #111;background:#fff;color:#111;font-size:13px;text-decoration:none;cursor:pointer}
        [data-inquiry-success-popup] .inquiry-success-actions a{background:#111;color:#fff}
        @media(max-width:520px){[data-inquiry-success-popup] .inquiry-success-card{padding:28px 22px}[data-inquiry-success-popup] .inquiry-success-actions{grid-template-columns:1fr}}
      </style>
      <div class="inquiry-success-card">
        <p class="inquiry-success-label">INQUIRY COMPLETE</p>
        <h2 id="inquiry-success-title">문의가 접수되었습니다.</h2>
        <p>담당자에게 문자로 남겨주시면 더욱 빠르게 회신받으실 수 있습니다.</p>
        <a class="inquiry-success-phone" href="sms:01054225650">010-5422-5650</a>
        <div class="inquiry-success-actions">
          <button type="button" data-popup-close>확인</button>
          <a href="sms:01054225650">문자 보내기</a>
        </div>
      </div>`;

    const close = () => {
      document.removeEventListener('keydown', onKeydown);
      popup.remove();
    };
    const onKeydown = (event) => {
      if (event.key === 'Escape') close();
    };
    popup.querySelector('[data-popup-close]').addEventListener('click', close);
    popup.addEventListener('click', (event) => {
      if (event.target === popup) close();
    });
    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(popup);
    popup.querySelector('[data-popup-close]').focus();
  };

  const setFormState = (form, mode, message = '') => {
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    const note = form.querySelector('.contact-note, .intake-note, [data-form-note]');

    if (button) {
      if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
      button.disabled = mode === 'loading';
      if (mode === 'loading') button.innerHTML = '<span>접수 중...</span><span>↗</span>';
      else if (mode === 'success') button.innerHTML = '<span>접수 완료</span><span>✓</span>';
      else button.innerHTML = button.dataset.originalHtml;
    }
    if (note && message) note.textContent = message;
  };

  const isInquiryForm = (form) => form instanceof HTMLFormElement && form.matches(
    '.contact-panel, [data-sector-form], [data-quote-form], [data-mail-form]'
  );

  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!isInquiryForm(form)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;

    if (form.classList.contains('inquiry-form')) {
      const fd = new FormData(form);
      if (fd.getAll('projectType').length === 0) {
        window.alert('필요한 작업 유형을 한 개 이상 선택해 주세요.');
        return;
      }
    }

    setFormState(form, 'loading', '문의 내용을 안전하게 접수하고 있습니다.');
    try {
      await saveInquiry(form);
      form.reset();
      form.dispatchEvent(new Event('change', { bubbles: true }));
      setFormState(form, 'success', '문의가 접수되었습니다. 담당자에게 문자로 남겨주시면 더욱 빠르게 회신받으실 수 있습니다.');
      showInquirySuccessPopup();
      window.setTimeout(() => setFormState(form, 'idle'), 3500);
    } catch (error) {
      console.error('[NINEWORKS] inquiry submission failed', error);
      setFormState(form, 'error', '접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 info@9works.kr로 보내주세요.');
      window.alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, true);

  trackDailyVisitor();
})();

(() => {
  if (window.__NW_SERVICE_SECTORS_INIT__) return;
  window.__NW_SERVICE_SECTORS_INIT__ = true;

  const sectorLinks = [
    { href:'membership.html', label:'Membership' },
    { href:'print.html', label:'Print' },
    { href:'develop.html', label:'Develop' },
    { href:'client-register.html', label:'Client' }
  ];
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const isPrintPath = path === 'print.html' || path.startsWith('print-') || path.startsWith('package-') || path === 'production.html';
  const isDevelopPath = path === 'develop.html' || path === 'digital-build.html';
  const isClientPath = path === 'client-register.html';
  const printRequestPaths = new Set(['print-business-card.html','print-editorial.html','package-production.html','package-sample.html']);
  const isSectorCurrent = (item) => path === item.href || (item.href === 'print.html' && isPrintPath) || (item.href === 'develop.html' && isDevelopPath) || (item.href === 'client-register.html' && isClientPath);

  const ensureHeaderLinks = () => {
    document.querySelectorAll('.site-header').forEach((header) => {
      if (header.querySelector('.site-service-nav')) return;
      const nav = document.createElement('nav');
      nav.className = 'site-service-nav';
      nav.setAttribute('aria-label', '서비스 바로가기');
      nav.innerHTML = sectorLinks.map((item) => `<a href="${item.href}"${isSectorCurrent(item) ? ' class="is-current" aria-current="page"' : ''}>${item.label}</a>`).join('');
      const trigger = header.querySelector('[data-menu-trigger]');
      header.insertBefore(nav, trigger || null);
    });
  };

  const ensureMenuLinks = () => {
    document.querySelectorAll('[data-menu-overlay]').forEach((overlay) => {
      if (overlay.querySelector('.menu-sector-links')) return;
      const block = document.createElement('div');
      block.className = 'menu-sector-links';
      block.innerHTML = `<span class="menu-sector-links__label">Services</span>${sectorLinks.map((item) => `<a href="${item.href}"${isSectorCurrent(item) ? ' class="is-current" aria-current="page"' : ''}><span>${item.label}</span><span>↗</span></a>`).join('')}`;
      const footer = overlay.querySelector('.menu-footer');
      if (footer) footer.insertAdjacentElement('beforebegin', block);
      else overlay.appendChild(block);
    });
  };

  const labelMap = {
    company:'회사 / 브랜드', name:'담당자명', email:'이메일', phone:'연락처',
    needs:'필요 업무', volume:'월 예상 요청량', channels:'주요 운영 채널', brandStatus:'현재 브랜드 상태', startMonth:'시작 희망 시점',
    productType:'제작 품목', printType:'인쇄 품목', packageType:'패키지 종류', sampleGoal:'샘플 제작 목적',
    quantity:'수량', size:'규격', customSize:'직접 입력 규격', material:'소재 / 지류', color:'인쇄 / 색상', sides:'인쇄 면', pages:'페이지 / 접지', binding:'제본 / 가공', finishing:'후가공',
    designStatus:'디자인 파일 상태', dielineStatus:'칼선 / 도면 상태', proof:'교정 / 샘플', deliveryDate:'희망 납기', deliveryLocation:'배송 지역',
    digitalType:'프로젝트 유형', buildStatus:'신규 / 리뉴얼', currentUrl:'현재 사이트 / 서비스 URL', functions:'필요 기능', platform:'현재 또는 희망 플랫폼', integrations:'연동 필요 항목',
    budget:'예상 예산', reference:'자료 / 레퍼런스 링크', message:'추가 요청사항',
    partnerCategory:'파트너 공정', location:'공장 / 사업장 지역', equipment:'주요 설비 / 전문 공정', minOrder:'주요 최소수량 / 적정수량', leadTime:'평균 제작 소요기간', website:'홈페이지 / 포트폴리오', capacity:'월 생산 가능량 / 특징',
    clientRegistered:'나인웍스 등록 클라이언트 확인', clientStatus:'클라이언트 상태', companyType:'회사 / 사업 유형', businessNumber:'사업자등록번호', address:'주소', serviceInterest:'주요 이용 서비스', projectHistory:'기존 프로젝트 / 협업 이력'
  };

  const readValues = (form, name) => Array.from(form.querySelectorAll(`[name="${CSS.escape(name)}"]`))
    .filter((el) => (el.type === 'checkbox' || el.type === 'radio') ? el.checked : String(el.value || '').trim())
    .map((el) => String(el.value || '').trim()).filter(Boolean);

  const enhancePrintMaterials = () => {
    if (!printRequestPaths.has(path)) return;
    document.querySelectorAll('form[data-quote-form]').forEach((form) => {
      form.querySelectorAll('input[name="reference"]').forEach((input) => {
        input.type = 'text';
        input.removeAttribute('pattern');
        input.placeholder = 'Drive / Dropbox / Notion / Figma 링크 또는 파일명';
      });
      if (form.querySelector('.material-transfer')) return;
      const messageField = form.querySelector('textarea[name="message"]')?.closest('.quote-field');
      const referenceField = form.querySelector('input[name="reference"]')?.closest('.quote-field');
      const subject = path === 'print-business-card.html' ? '[NINEWORKS] 명함 인쇄 자료 전달' : '[NINEWORKS PRINT] 제작 자료 전달';
      const mailHref = `mailto:info@9works.kr?subject=${encodeURIComponent(subject)}`;
      const panel = document.createElement('div');
      panel.className = 'material-transfer quote-field--wide';
      panel.innerHTML = `
        <span class="material-transfer__label">FILES / 자료 전달</span>
        <div class="material-transfer__copy">
          <strong>인쇄용 파일·칼선·이미지 등 자료가 있으신가요?</strong>
          <p>자료가 있으실 경우 <a href="mailto:info@9works.kr">info@9works.kr</a>로 보내주세요. 10MB 이하 파일은 아래 버튼을 눌러 메일 작성창에서 바로 첨부할 수 있습니다.</p>
        </div>
        <a class="material-transfer__button" href="${mailHref}">10MB 이하 파일 첨부 메일 열기 <span>↗</span></a>`;
      if (referenceField) referenceField.insertAdjacentElement('afterend', panel);
      else if (messageField) messageField.insertAdjacentElement('beforebegin', panel);
    });
  };

  const bindQuoteBuilder = (form) => {
    if (!form.matches('[data-quote-form]') || form.dataset.quoteBound === 'true') return;
    form.dataset.quoteBound = 'true';
    const list = form.querySelector('[data-quote-summary]');
    const update = () => {
      if (!list) return;
      const rows = [];
      form.querySelectorAll('[data-summary-field]').forEach((field) => {
        const name = field.dataset.summaryField;
        const values = readValues(form, name);
        if (values.length) rows.push({ label: field.dataset.summaryLabel || labelMap[name] || name, value: values.join(' · ') });
      });
      list.innerHTML = rows.length
        ? rows.map((row) => `<div class="quote-summary__row"><span>${row.label}</span><strong>${row.value}</strong></div>`).join('')
        : '<p class="quote-summary__empty">왼쪽에서 옵션을 선택하면<br>여기에 요청 조건이 정리됩니다.</p>';
    };
    form.addEventListener('change', update);
    form.addEventListener('input', update);
    update();
  };

  const bindForm = (form) => {
    if (form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    bindQuoteBuilder(form);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const grouped = new Map();
      for (const [key, value] of fd.entries()) {
        if (key === 'privacy') continue;
        if (!grouped.has(key)) grouped.set(key, []);
        if (String(value).trim()) grouped.get(key).push(String(value).trim());
      }
      const sector = form.dataset.sectorLabel || 'SERVICE';
      const company = fd.get('company') || '';
      const name = fd.get('name') || '';
      const isBusinessCard = sector.includes('BUSINESS CARD');
      const isClientRegistration = sector.includes('CLIENT REGISTRATION');
      const heading = isBusinessCard ? `[NINEWORKS BUSINESS CARD PRINT REQUEST]` : isClientRegistration ? `[NINEWORKS CLIENT REGISTRATION]` : `[NINEWORKS ${sector} INQUIRY]`;
      const lines = [heading, ''];
      grouped.forEach((values, key) => lines.push(`${labelMap[key] || key}: ${values.join(', ')}`));
      if (isBusinessCard) lines.push('', '※ 명함 인쇄 요청은 나인웍스 등록 클라이언트 전용 무상 지원 서비스이며 개별 주문은 받지 않습니다.', '※ 인쇄 파일이 있는 경우 info@9works.kr로 별도 전달해 주세요.');
      else if (isClientRegistration) lines.push('', '※ 클라이언트 등록은 내부 확인 후 안내되며 등록 즉시 모든 전용 서비스 이용이 확정되는 것은 아닙니다.');
      else if (sector.includes('PARTNER')) lines.push('', '※ 파트너 등록은 검토 후 프로젝트 조건에 맞을 경우 개별 연락드립니다.');
      else if (sector.includes('PRINT') || sector.includes('PACKAGE')) lines.push('', '※ 인쇄용 파일·칼선·이미지 등 자료는 info@9works.kr로 별도 전달해 주세요.');
      else lines.push('', '※ 기획서·피그마·레퍼런스는 자료 링크 또는 info@9works.kr로 공유해 주세요.');
      const defaultLabel = isBusinessCard ? '명함 인쇄 요청' : isClientRegistration ? '클라이언트 등록' : '견적 문의';
      const subject = isBusinessCard ? `[NINEWORKS 명함 인쇄 요청] ${company || name || ''}` : isClientRegistration ? `[NINEWORKS 클라이언트 등록] ${company || name || ''}` : `[NINEWORKS ${sector}] ${company || name || defaultLabel}`;
      window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  };

  const init = () => {
    ensureHeaderLinks();
    ensureMenuLinks();
    enhancePrintMaterials();
    document.querySelectorAll('[data-sector-form], [data-quote-form]').forEach(bindForm);
  };
  init();
  window.addEventListener('load', init, { once:true });
  setTimeout(init, 400);
})();

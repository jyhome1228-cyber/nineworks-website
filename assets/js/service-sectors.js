(() => {
  if (window.__NW_SERVICE_SECTORS_INIT__) return;
  window.__NW_SERVICE_SECTORS_INIT__ = true;

  const sectorLinks = [
    { href:'membership.html', label:'Membership' },
    { href:'print.html', label:'Print' },
    { href:'develop.html', label:'Develop' }
  ];
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const isPrintPath = path === 'print.html' || path.startsWith('print-') || path.startsWith('package-') || path === 'production.html';
  const isDevelopPath = path === 'develop.html' || path === 'digital-build.html';
  const isSectorCurrent = (item) => path === item.href || (item.href === 'print.html' && isPrintPath) || (item.href === 'develop.html' && isDevelopPath);

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
    partnerCategory:'파트너 공정', location:'공장 / 사업장 지역', equipment:'주요 설비 / 전문 공정', minOrder:'주요 최소수량 / 적정수량', leadTime:'평균 제작 소요기간', website:'홈페이지 / 포트폴리오', capacity:'월 생산 가능량 / 특징'
  };

  const readValues = (form, name) => Array.from(form.querySelectorAll(`[name="${CSS.escape(name)}"]`))
    .filter((el) => (el.type === 'checkbox' || el.type === 'radio') ? el.checked : String(el.value || '').trim())
    .map((el) => String(el.value || '').trim()).filter(Boolean);

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
        : '<p class="quote-summary__empty">왼쪽에서 옵션을 선택하면<br>여기에 견적 조건이 정리됩니다.</p>';
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
      const lines = [`[NINEWORKS ${sector} INQUIRY]`, ''];
      grouped.forEach((values, key) => lines.push(`${labelMap[key] || key}: ${values.join(', ')}`));
      if (sector.includes('PARTNER')) lines.push('', '※ 파트너 등록은 검토 후 프로젝트 조건에 맞을 경우 개별 연락드립니다.');
      else if (sector.includes('PRINT') || sector.includes('PACKAGE')) lines.push('', '※ 인쇄용 파일·칼선·레퍼런스는 자료 링크를 통해 공유해 주세요.');
      else lines.push('', '※ 기획서·피그마·레퍼런스는 자료 링크를 통해 공유해 주세요.');
      const subject = `[NINEWORKS ${sector}] ${company || name || '견적 문의'}`;
      window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  };

  const init = () => {
    ensureHeaderLinks();
    ensureMenuLinks();
    document.querySelectorAll('[data-sector-form], [data-quote-form]').forEach(bindForm);
  };
  init();
  window.addEventListener('load', init, { once:true });
  setTimeout(init, 400);
})();

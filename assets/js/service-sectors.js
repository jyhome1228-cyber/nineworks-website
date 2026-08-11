(() => {
  const sectorLinks = [
    { href:'membership.html', label:'Membership' },
    { href:'production.html', label:'Production' },
    { href:'digital-build.html', label:'Digital Build' }
  ];
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';

  const ensureHeaderLinks = () => {
    document.querySelectorAll('.site-header').forEach((header) => {
      if (header.querySelector('.site-service-nav')) return;
      const nav = document.createElement('nav');
      nav.className = 'site-service-nav';
      nav.setAttribute('aria-label', '서비스 바로가기');
      nav.innerHTML = sectorLinks.map((item) => `<a href="${item.href}"${path === item.href ? ' class="is-current" aria-current="page"' : ''}>${item.label}</a>`).join('');
      const trigger = header.querySelector('[data-menu-trigger]');
      header.insertBefore(nav, trigger || null);
    });
  };

  const ensureMenuLinks = () => {
    document.querySelectorAll('[data-menu-overlay]').forEach((overlay) => {
      if (overlay.querySelector('.menu-sector-links')) return;
      const block = document.createElement('div');
      block.className = 'menu-sector-links';
      block.innerHTML = `<span class="menu-sector-links__label">Services</span>${sectorLinks.map((item) => `<a href="${item.href}"><span>${item.label}</span><span>↗</span></a>`).join('')}`;
      const footer = overlay.querySelector('.menu-footer');
      if (footer) footer.insertAdjacentElement('beforebegin', block);
      else overlay.appendChild(block);
    });
  };

  const labelMap = {
    company:'회사 / 브랜드', name:'담당자명', email:'이메일', phone:'연락처', needs:'필요 업무', volume:'월 예상 요청량', channels:'주요 운영 채널', brandStatus:'현재 브랜드 상태', startMonth:'시작 희망 시점', productionType:'제작 유형', itemName:'제품 / 인쇄물명', quantity:'수량', size:'규격', material:'소재 / 지류', finishing:'후가공', designStatus:'디자인 파일 상태', deliveryDate:'희망 납기', deliveryLocation:'배송 지역', digitalType:'프로젝트 유형', buildStatus:'신규 / 리뉴얼', currentUrl:'현재 사이트 / 서비스 URL', pages:'예상 페이지 / 화면 수', functions:'필요 기능', platform:'현재 또는 희망 플랫폼', integrations:'연동 필요 항목', budget:'예상 예산', reference:'자료 / 레퍼런스 링크', message:'추가 요청사항'
  };

  const bindForm = (form) => {
    if (form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
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
      lines.push('', '※ 첨부파일은 자료 링크를 통해 공유해 주세요.');
      const subject = `[NINEWORKS ${sector}] ${company || name || '문의'}`;
      window.location.href = `mailto:info@9works.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  };

  const init = () => {
    ensureHeaderLinks();
    ensureMenuLinks();
    document.querySelectorAll('[data-sector-form]').forEach(bindForm);
  };
  init();
  window.addEventListener('load', init, { once:true });
  setTimeout(init, 400);
})();

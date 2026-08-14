(() => {
  const details = {
    branding: {
      when: '신규 브랜드 런칭 · 리브랜딩 · 브랜드 기준이 불분명한 경우',
      scope: 'Research · Positioning · Naming · Identity · Guideline'
    },
    develop: {
      when: '홈페이지 구축·리뉴얼 · 플랫폼·커머스 · 관리자·데이터 기능이 필요한 경우',
      scope: 'Planning · IA · UX/UI · Front-end · Admin · Data · Deployment'
    },
    print: {
      when: '신제품 패키지 · 샘플 제작 · 양산 · 회사소개서·카탈로그 인쇄가 필요한 경우',
      scope: 'Structure · Paper · Printing · Finishing · Sample · Production'
    }
  };

  Object.entries(details).forEach(([id, info]) => {
    const card = document.getElementById(id);
    if (!card || card.querySelector('.services-card__when')) return;
    const block = document.createElement('div');
    block.className = 'services-card__when';
    block.innerHTML = `<b>WHEN IT HELPS</b><span>${info.when}</span>`;
    const list = card.querySelector('ul');
    card.insertBefore(block, list || card.querySelector('a'));
    if (list && !list.dataset.restoredScope) {
      const item = document.createElement('li');
      item.textContent = info.scope;
      list.prepend(item);
      list.dataset.restoredScope = 'true';
    }
  });

  const scopeMap = {
    'Editorial Design': 'Information Architecture · Company Profile · IR · Catalog · Report',
    'Art Direction': 'Photography · Key Visual · Product Visualization · Campaign',
    'Commerce Content': 'Detail Page · Event · Banner · Campaign · Product Setup',
    'Communication': 'Presentation · Data Visualization · Template · Internal Guide',
    'Spatial Graphic': 'Signage · Wayfinding · Pop-up · Exhibition · Retail Graphic',
    'Brand Renewal': 'Brand Audit · Asset Review · Design Governance · Launch System'
  };

  document.querySelectorAll('.support-card').forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim();
    if (!scopeMap[title] || card.querySelector('.support-card__scope')) return;
    const scope = document.createElement('small');
    scope.className = 'support-card__scope';
    scope.textContent = scopeMap[title];
    card.appendChild(scope);
  });

  const grid = document.querySelector('.services-support-grid');
  if (grid && !grid.querySelector('[data-restored-digital]')) {
    const digital = document.createElement('article');
    digital.className = 'support-card';
    digital.dataset.restoredDigital = 'true';
    digital.innerHTML = '<span>05 / DIGITAL EXPERIENCE</span><h3>UX/UI & Interaction</h3><p>사용자가 정보를 찾고 선택하고 행동하는 순서를 기준으로 반응형 화면과 인터랙션을 설계합니다.</p><small class="support-card__scope">User Flow · Wireframe · Responsive UI · Interaction</small>';
    const second = grid.children[1];
    grid.insertBefore(digital, second || null);
  }
})();

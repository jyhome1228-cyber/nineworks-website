(() => {
  const findSection = () => Array.from(document.querySelectorAll('.designer-page .designer-section')).find((section) => {
    const eyebrow = section.querySelector('.eyebrow');
    return eyebrow && eyebrow.textContent.includes('Selected Design Projects');
  });

  const findWritingSection = () => Array.from(document.querySelectorAll('.designer-page .designer-section')).find((section) => {
    const eyebrow = section.querySelector('.eyebrow');
    const text = eyebrow?.textContent || '';
    return text.includes('Writing & Essay') || text.includes('저서·논문·에세이');
  });

  const makeRow = ({ tag, title, role, detail, key }) => {
    const row = document.createElement('div');
    row.className = 'designer-record';
    row.dataset.designerFeaturedProject = key;
    row.innerHTML = `
      <span class="designer-record__year">${tag}</span>
      <strong class="designer-record__title">${title}</strong>
      <div class="designer-record__copy"><b>${role}</b><small>${detail}</small></div>`;
    return row;
  };

  const makePublicationRow = () => {
    const row = document.createElement('div');
    row.className = 'designer-record';
    row.dataset.designerPublication = 'local-startup-guidebook-02';
    row.innerHTML = `
      <span class="designer-record__year">2025</span>
      <strong class="designer-record__title">LOCAL STARTUP GUIDEBOOK 02 / 로컬창업가이드북 02</strong>
      <div class="designer-record__copy"><b>Co-author / 공저</b><small>《로컬비즈니스디자인, 지역창업의 새로운 모델》 · 박두경 · 박재영</small></div>`;
    return row;
  };

  const applyPublication = () => {
    const section = findWritingSection();
    const list = section?.querySelector('.designer-records');
    if (!section || !list) return;

    const eyebrow = section.querySelector('.eyebrow');
    const description = section.querySelector('.designer-section__head > .copy');
    if (eyebrow) eyebrow.textContent = 'Publication & Writing / 저서·논문·에세이';
    if (description) description.textContent = '저서와 논문, 에세이를 통해 브랜드와 창업 과정의 고민과 통찰을 언어로 정리하고, 시각적 판단과 실무 경험을 지식으로 확장합니다.';

    const alreadyExists = Array.from(list.querySelectorAll('.designer-record')).some((row) => {
      const text = row.textContent.replace(/\s+/g, ' ');
      return row.dataset.designerPublication === 'local-startup-guidebook-02'
        || /LOCAL STARTUP GUIDEBOOK 02|로컬창업가이드북 02/i.test(text);
    });

    if (!alreadyExists) list.prepend(makePublicationRow());
  };

  const apply = () => {
    const section = findSection();
    const list = section?.querySelector('.designer-records');
    if (!list) return;

    const duplicateMatchers = [
      /KIDS TEN.*Yonsei|Yonsei Health.*KIDS TEN|키즈텐.*연세생활건강/i,
      /Kookmin University|국민대학교/i,
      /Dongwon Industries|동원산업/i,
      /VISANG|비상/i
    ];

    list.querySelectorAll('.designer-record').forEach((row) => {
      if (row.dataset.designerFeaturedProject) return;
      const text = row.textContent.replace(/\s+/g, ' ');
      if (duplicateMatchers.some((matcher) => matcher.test(text))) row.remove();
    });

    const items = [
      {
        tag: 'BRAND',
        key: 'yonsei-health',
        title: 'Yonsei Health / 연세생활건강',
        role: 'Brand Identity & Packaging / 키즈텐·헬씨드 브랜딩·패키징',
        detail: 'KIDS TEN과 HEALTHD의 브랜드 방향과 시각 아이덴티티를 정리하고, 제품 라인업에 맞춘 패키지 시스템과 확장 가능한 브랜드 경험을 설계.'
      },
      {
        tag: 'INSTITUTION',
        key: 'kookmin-university',
        title: 'Kookmin University / 국민대학교',
        role: 'Event & Exhibition Branding / 교내외 행사·전시 기획·브랜딩',
        detail: '교내외 행사 비주얼과 운영 그래픽을 기획하고, 명원박물관 전시 「먹으로 남긴 기억」의 전시 아이덴티티·에디토리얼·공간 그래픽을 통합 설계.'
      },
      {
        tag: 'B2B',
        key: 'dongwon-industries',
        title: 'Dongwon Industries / 동원산업',
        role: 'B2B Brand Planning & Website / 신규 B2B 브랜드 기획·브랜딩·웹사이트 제작',
        detail: '신규 B2B 브랜드의 방향과 시각 체계를 정리하고, 기업 고객이 핵심 사업과 서비스를 이해할 수 있도록 브랜드 아이덴티티와 웹사이트 정보 구조·화면을 함께 설계.'
      },
      {
        tag: 'EDITORIAL',
        key: 'visang',
        title: 'VISANG / 비상',
        role: 'Editorial & Educational Materials / 에디토리얼·교육자료 디자인',
        detail: '교육 프로그램과 학습 정보를 명확하게 전달할 수 있도록 안내서와 교육 자료의 정보 위계, 레이아웃, 키비주얼과 편집 시스템을 디자인.'
      }
    ];

    items.slice().reverse().forEach((item) => {
      if (!list.querySelector(`[data-designer-featured-project="${item.key}"]`)) {
        list.prepend(makeRow(item));
      }
    });
  };

  const applyAll = () => {
    apply();
    applyPublication();
  };

  applyAll();
  window.addEventListener('load', applyAll, { once: true });
  setTimeout(applyAll, 250);
  setTimeout(applyAll, 900);
})();

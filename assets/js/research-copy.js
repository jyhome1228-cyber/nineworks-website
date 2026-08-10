(() => {
  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  const refinePracticeIndex = () => {
    const groups = document.querySelectorAll('.home-practice-group');
    if (!groups.length) return;

    const researchFields = [
      { lead:'Brand Strategy', terms:['Market Research','Competitor Mapping','Positioning','Brand Architecture','Verbal Framework'] },
      { lead:'Identity Systems', terms:['Visual Research','Semiotic Study','Logotype','Typography System','Color System'] },
      { lead:'Packaging', terms:['Material Study','Structural Research','Print Test','Label System','Production Spec'] },
      { lead:'Editorial', terms:['Information Architecture','Content Mapping','Grid Study','Publication System','Print Direction'] },
      { lead:'Digital Experience', terms:['User Flow Study','Content Architecture','Wireframe','Prototype','Responsive System'] },
      { lead:'Art Direction', terms:['Image Research','Visual Narrative','Key Visual','Photography Direction','Motion Study'] },
      { lead:'Spatial Graphic', terms:['Context Research','Wayfinding Study','Signage','Exhibition','Retail Experience'] },
      { lead:'Communication Design', terms:['Information Design','Presentation System','Data Visual','Template System','Internal Guide'] },
      { lead:'Brand Renewal', terms:['Brand Audit','Asset Review','Design Governance','Launch System','Design Operation'] }
    ];

    groups.forEach((group, index) => {
      const data = researchFields[index];
      if (!data) return;
      const lead = group.querySelector('.home-practice-word--lead');
      if (lead) lead.textContent = data.lead;
      const words = Array.from(group.querySelectorAll('.home-practice-word:not(.home-practice-word--lead)'));
      words.forEach((word, wordIndex) => {
        if (data.terms[wordIndex]) word.textContent = data.terms[wordIndex];
      });
    });
  };

  const applyCopy = () => {
    const body = document.body;

    if (body.classList.contains('page-home')) {
      setText('.hero__descriptor', '브랜드를 디자인하기 전에 먼저 관찰하고 조사합니다. 시장과 제품, 경쟁 환경과 사용 경험을 읽고 시각적 가설을 세운 뒤, 발견한 기준을 아이덴티티·패키지·디지털·에디토리얼 시스템으로 확장합니다.');
      setText('.about-preview__body .lead', '나인웍스는 관찰과 리서치를 통해 브랜드의 문제를 정의하고, 발견한 근거를 선명한 시각 기준으로 번역하는 디자인 스튜디오입니다.');
      setText('.about-preview__body .copy', '시장과 제품, 고객의 행동과 기존 브랜드 자산을 함께 검토합니다. 결과물 하나를 만드는 데서 멈추지 않고, 여러 접점에서 반복해 사용할 수 있는 타이포그래피·이미지·레이아웃·그래픽의 규칙을 구축합니다.');
      setText('section:has(.service-tabs) .split-copy__right', '각 디자인 업무는 조사와 분석에서 시작합니다. 브랜드가 놓인 맥락을 이해한 뒤 필요한 시각 언어를 정의하고, 제품·화면·인쇄·콘텐츠·공간까지 하나의 시스템으로 연결합니다.');
      refinePracticeIndex();
      const magazineSection = Array.from(document.querySelectorAll('.section')).find((section) => section.querySelector('.magazine-list'));
      if (magazineSection) {
        const copy = magazineSection.querySelector('.split-copy__right');
        if (copy) copy.textContent = '프로젝트 밖에서도 브랜드, 소비 경험, 리테일, 패키지와 시각 문화의 변화를 관찰합니다. 기록한 사례와 질문은 다시 실제 디자인의 판단 기준으로 돌아옵니다.';
      }
    }

    if (body.classList.contains('about-page')) {
      setText('.page-hero__copy', '나인웍스는 디자인을 장식보다 탐구의 과정으로 봅니다. 브랜드의 배경과 시장, 제품과 사용자 경험을 조사하고 그 안에서 발견한 단서를 아이덴티티, 패키지, 화면, 콘텐츠와 공간을 연결하는 시각 시스템으로 만듭니다.');
      setText('.about-origin__body .lead', '2017년부터 다양한 브랜드와 제품을 다루며, 무엇을 만드는가보다 왜 그렇게 보여야 하는가를 먼저 질문해왔습니다.');
      setText('.section .split-copy__right', '좋은 디자인은 취향에서만 나오지 않습니다. 관찰한 사실과 브랜드의 맥락을 바탕으로 가설을 세우고, 시각 실험을 통해 가장 명확한 기준을 찾아갑니다.');
      const approach = Array.from(document.querySelectorAll('.section')).find((section) => section.textContent.includes('Understand') && section.textContent.includes('Expand'));
      if (approach) {
        const intro = approach.querySelector('.split-copy__right');
        if (intro) intro.textContent = '관찰과 자료 검토로 문제를 이해하고, 핵심 가설과 시각 기준을 정의합니다. 이후 디자인을 실제 결과물로 검증하고, 검증된 규칙을 브랜드의 여러 접점으로 확장합니다.';
        const rows = approach.querySelectorAll('.capability-row__copy');
        const texts = [
          '시장, 고객, 제품, 경쟁 브랜드와 기존 자료를 관찰·수집하고 프로젝트가 실제로 해결해야 할 질문을 정리합니다.',
          '조사에서 발견한 패턴을 바탕으로 브랜드가 가져야 할 인상, 메시지와 시각적 가설을 명확하게 설정합니다.',
          '타이포그래피, 컬러, 이미지, 그래픽과 레이아웃을 반복적으로 비교하고 실험하며 가설을 실제 시각 언어로 검증합니다.',
          '검증된 디자인 원칙을 패키지, 디지털, 콘텐츠, 인쇄와 공간에 적용해 일관된 브랜드 시스템으로 축적합니다.'
        ];
        rows.forEach((row, i) => { if (texts[i]) row.textContent = texts[i]; });
      }
    }

    if (body.classList.contains('solutions-page')) {
      setText('.solutions-hero__copy .lead', '결과물을 정하기 전에 브랜드가 놓인 시장과 제품, 사용 맥락을 먼저 조사합니다. 디자인이 해결해야 할 질문을 선명하게 만드는 것이 모든 프로젝트의 출발점입니다.');
      const heroCopies = document.querySelectorAll('.solutions-hero__copy .copy');
      if (heroCopies[0]) heroCopies[0].textContent = '리서치에서 발견한 근거를 바탕으로 시각적 가설을 세우고, 아이덴티티부터 패키지·웹·UX/UI·에디토리얼·콘텐츠·공간까지 필요한 접점에서 검증합니다. 서로 다른 결과물도 하나의 연구 과정과 디자인 기준 안에서 연결합니다.';
      setText('.solutions-intro .lead', 'Nine fields는 서로 다른 제작 항목의 목록이 아니라, 하나의 브랜드를 관찰하고 정의하고 실험하고 확장하기 위한 9개의 디자인 연구 영역입니다.');
      const introCopies = document.querySelectorAll('.solutions-intro .copy');
      if (introCopies[0]) introCopies[0].textContent = '프로젝트마다 필요한 깊이는 다릅니다. 기존 자료와 경쟁 환경을 검토하는 짧은 진단부터 네이밍, 시각 아이덴티티, 제작 사양과 운영 시스템까지 단계별로 범위를 설계합니다.';
    }
  };

  applyCopy();
  window.addEventListener('load', applyCopy, { once:true });
  setTimeout(applyCopy, 250);
  setTimeout(applyCopy, 900);
})();

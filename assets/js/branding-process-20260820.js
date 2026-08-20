(() => {
  const root = document.querySelector('[data-brand-process]');
  if (!root) return;

  const styleHref = 'assets/css/branding-process-info-20260820.css?v=20260820-1';
  if (!document.querySelector(`link[href*="branding-process-info-20260820.css"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = styleHref;
    document.head.appendChild(link);
  }

  const info = {
    '01': {
      title: '브랜드와 사업의 출발점을 함께 확인합니다.',
      doing: [
        ['사업과 제품 구조 파악', '어떤 사업을 하고 무엇을 판매하는지 제품·서비스 구조를 정리합니다.'],
        ['기존 브랜드 자료 검토', '로고, 패키지, 웹사이트, 소개서 등 현재 사용 중인 자료를 확인합니다.'],
        ['고객·시장·경쟁 리서치', '주요 고객과 시장 환경, 직접·간접 경쟁 브랜드를 비교합니다.'],
        ['프로젝트 목표 인터뷰', '이번 브랜딩을 통해 실제로 해결해야 할 목표와 범위를 맞춥니다.']
      ],
      output: [
        ['Discovery Note', '인터뷰와 기초 자료를 정리한 프로젝트 시작 문서'],
        ['Market / Competitor Map', '시장과 경쟁 브랜드의 위치 및 특징 비교'],
        ['Brand Asset Inventory', '현재 보유한 브랜드 자산과 부족한 항목 정리'],
        ['Project Brief', '프로젝트 목표·범위·우선순위를 정리한 기준 문서']
      ]
    },
    '02': {
      title: '보이는 현상보다 먼저, 해결해야 할 문제를 찾습니다.',
      doing: [
        ['브랜드 접점 점검', '패키지, 콘텐츠, 웹, 오프라인 등 고객이 브랜드를 만나는 지점을 확인합니다.'],
        ['메시지 일관성 확인', '브랜드가 말하는 내용과 실제로 보이는 인상이 같은 방향인지 점검합니다.'],
        ['경쟁력과 차별점 진단', '경쟁 브랜드와 비교해 약한 지점과 기회가 되는 지점을 구분합니다.'],
        ['개선 우선순위 설정', '모든 문제를 한 번에 바꾸기보다 먼저 해결할 핵심 문제를 정합니다.']
      ],
      output: [
        ['Brand Diagnosis', '현재 브랜드 상태를 요약한 진단 결과'],
        ['Issue Map', '브랜드 문제를 항목별로 분류한 문제 지도'],
        ['Priority List', '먼저 해결해야 할 과제를 순서대로 정리'],
        ['Opportunity Area', '브랜드가 차별화될 수 있는 기회 영역 정의']
      ]
    },
    '03': {
      title: '앞으로 모든 판단의 기준이 될 브랜드 방향을 정합니다.',
      doing: [
        ['핵심 고객 정의', '누구에게 가장 먼저 선택받아야 하는 브랜드인지 정합니다.'],
        ['포지셔닝 설정', '시장 안에서 어떤 위치와 역할을 가져야 하는지 명확히 합니다.'],
        ['브랜드 가치 정리', '브랜드가 지켜야 할 가치와 태도, 존재 이유를 정리합니다.'],
        ['핵심 메시지 구조화', '고객에게 무엇을 어떤 순서와 언어로 전달할지 기준을 만듭니다.']
      ],
      output: [
        ['Brand Direction', '브랜드가 나아갈 방향과 핵심 원칙'],
        ['Positioning Statement', '시장 안에서 브랜드의 위치를 설명하는 문장'],
        ['Audience Definition', '핵심 고객과 고객 니즈 정의'],
        ['Core Message', '브랜드를 설명하는 핵심 메시지 체계']
      ]
    },
    '04': {
      title: '전략을 사람들이 쉽게 기억할 수 있는 하나의 아이디어로 바꿉니다.',
      doing: [
        ['핵심 키워드 도출', '브랜드의 성격과 방향을 설명하는 핵심 단어를 정리합니다.'],
        ['콘셉트 방향 개발', '여러 가능성 중 브랜드가 가져야 할 중심 아이디어를 발전시킵니다.'],
        ['스토리와 언어 설정', '브랜드 스토리, 문장, 슬로건 등 필요한 언어 요소를 만듭니다.'],
        ['무드와 표현 기준 정리', '이미지와 디자인이 어떤 분위기를 가져야 하는지 정리합니다.']
      ],
      output: [
        ['Brand Concept', '브랜드 전체를 관통하는 하나의 핵심 콘셉트'],
        ['Keyword Set', '콘셉트를 설명하는 핵심 키워드 체계'],
        ['Naming / Slogan Direction', '필요 시 네이밍과 슬로건 방향 및 후보'],
        ['Mood / Verbal Direction', '시각 무드와 브랜드 언어의 표현 기준']
      ]
    },
    '05': {
      title: '정해진 방향을 어디서 봐도 알아볼 수 있는 시각 언어로 만듭니다.',
      doing: [
        ['로고·심볼 개발', '브랜드의 성격과 확장성을 고려해 핵심 인식 요소를 설계합니다.'],
        ['컬러·타이포그래피 설정', '반복해서 사용할 수 있는 컬러와 서체 체계를 정합니다.'],
        ['그래픽 시스템 개발', '패턴, 레이아웃, 아이콘, 이미지 사용 방식 등 시각 문법을 만듭니다.'],
        ['주요 사용 장면 검증', '실제 패키지·웹·인쇄물 등에 적용해 아이덴티티가 잘 작동하는지 확인합니다.']
      ],
      output: [
        ['Logo / Symbol Suite', '기본형·응용형 로고 및 심볼 데이터'],
        ['Color / Type System', '브랜드 컬러와 타이포그래피 사용 기준'],
        ['Graphic Assets', '패턴·아이콘·레이아웃 등 확장 가능한 시각 자산'],
        ['Key Visual', '브랜드의 대표적인 시각 표현 예시']
      ]
    },
    '06': {
      title: '만들어진 아이덴티티를 고객이 실제로 만나는 곳에 적용합니다.',
      doing: [
        ['필요 접점 선정', '브랜드에 꼭 필요한 패키지, 인쇄물, 웹, 콘텐츠, 공간 등을 정합니다.'],
        ['실제 디자인 적용', '각 접점의 기능과 환경에 맞춰 브랜드 디자인을 확장합니다.'],
        ['목업·프로토타입 검토', '실제 사용 상황을 미리 확인하며 크기, 정보 위계, 사용성을 조정합니다.'],
        ['제작 조건 반영', '인쇄, 생산, 개발 등 현실적인 제작 조건을 디자인에 반영합니다.']
      ],
      output: [
        ['Package / Editorial Design', '제품 패키지와 인쇄·편집 디자인'],
        ['Web / Digital Key Screens', '웹사이트·상세페이지·디지털 주요 화면'],
        ['Content / Signage Assets', 'SNS 콘텐츠, 캠페인, 공간·사이니지 적용물'],
        ['Mockup / Production Spec', '최종 검토용 목업과 제작 사양']
      ]
    },
    '07': {
      title: '디자인을 회사가 실제로 반복해서 쓸 수 있는 자료와 시스템으로 정리합니다.',
      doing: [
        ['마스터 파일 정리', '최종 로고, 그래픽, 이미지, 인쇄 데이터를 용도별로 정리합니다.'],
        ['템플릿 구축', 'PPT, SNS, 문서 등 반복 제작이 필요한 자료를 템플릿으로 만듭니다.'],
        ['브랜드 가이드 작성', '누가 사용해도 같은 브랜드가 보이도록 사용 규칙을 정리합니다.'],
        ['파일 인계 구조 설계', '내부 구성원과 협력사가 쉽게 찾고 사용할 수 있도록 폴더와 버전을 정리합니다.']
      ],
      output: [
        ['Master Asset Pack', '로고·심볼·컬러·서체·그래픽 최종 파일 묶음'],
        ['Brand Guideline', '브랜드 자산의 올바른 사용 방법과 규칙'],
        ['PPT / SNS / Document Template', '실제 운영에 바로 사용할 수 있는 템플릿'],
        ['Production Files', '패키지·인쇄·사이니지 등 제작용 최종 데이터']
      ]
    },
    '08': {
      title: '브랜드가 커질 때도 처음 만든 기준이 흔들리지 않도록 확장합니다.',
      doing: [
        ['신규 제품·서비스 확장', '새로운 라인업이 기존 브랜드와 자연스럽게 연결되도록 구조를 만듭니다.'],
        ['캠페인·콘텐츠 확장', '시즌, 프로모션, 캠페인에서도 브랜드의 인상을 유지하도록 확장합니다.'],
        ['채널 확장', '웹, 커머스, SNS, 오프라인 공간 등 새로운 채널에 맞게 체계를 확장합니다.'],
        ['브랜드 구조 조정', '브랜드와 제품이 많아질 경우 이름, 등급, 관계를 쉽게 이해할 수 있게 정리합니다.']
      ],
      output: [
        ['Extension Framework', '신규 제품·서비스 확장을 위한 브랜드 적용 원칙'],
        ['Campaign / Content Kit', '캠페인과 콘텐츠 운영에 필요한 디자인 자산'],
        ['New Product System', '신규 제품군의 패키지·정보 구조·시각 시스템'],
        ['Digital / Channel System', '웹·커머스·SNS 등 채널 확장 기준']
      ]
    },
    '09': {
      title: '브랜드가 실제 시장에서 오래 작동하도록 점검하고 관리합니다.',
      doing: [
        ['브랜드 사용 상태 점검', '실제 운영 과정에서 디자인과 메시지가 기준대로 유지되는지 확인합니다.'],
        ['신규 요청 반영', '새로운 제작물과 운영 이슈가 생길 때 기존 시스템 안에서 해결합니다.'],
        ['사용자 반응 확인', '고객 반응과 시장 변화를 보며 필요한 개선 지점을 찾아냅니다.'],
        ['업데이트·리뉴얼 판단', '언제 유지하고 언제 보완하거나 리뉴얼해야 하는지 시점을 판단합니다.']
      ],
      output: [
        ['Operation Guide', '브랜드 운영 시 지속적으로 참고할 관리 기준'],
        ['Asset Update / Version Log', '수정된 브랜드 자산과 버전 관리 기록'],
        ['Maintenance Items', '추가 제작·수정·보완이 필요한 항목 정리'],
        ['Review / Renewal Plan', '다음 점검과 리뉴얼을 위한 개선 계획']
      ]
    }
  };

  const makeList = (items, className = '') => `
    <ul class="process-info-list ${className}">
      ${items.map((item, index) => `
        <li>
          <span class="process-info-list__index">${String(index + 1).padStart(2, '0')}</span>
          <span class="process-info-list__body"><strong>${item[0]}</strong><small>${item[1]}</small></span>
        </li>`).join('')}
    </ul>`;

  root.querySelectorAll('[data-process-step]').forEach((step) => {
    const data = info[step.dataset.processStep];
    const visual = step.querySelector('.brand-step__visual');
    if (!data || !visual) return;
    visual.removeAttribute('aria-hidden');
    visual.className = 'brand-step__visual process-info-visual';
    visual.innerHTML = `
      <div class="process-info-panel">
        <div class="process-info-panel__head">
          <small>STEP ${step.dataset.processStep} / PROCESS DETAILS</small>
          <strong>${data.title}</strong>
        </div>
        <div class="process-info-panel__grid">
          <section class="process-info-column">
            <div class="process-info-column__label"><span>진행 내용</span><span>WHAT WE DO</span></div>
            ${makeList(data.doing)}
          </section>
          <section class="process-info-column process-info-output">
            <div class="process-info-column__label"><span>주요 산출물</span><span>WHAT YOU GET</span></div>
            ${makeList(data.output)}
          </section>
        </div>
      </div>`;
  });

  const timeline = root.querySelector('[data-process-timeline]');
  const steps = Array.from(root.querySelectorAll('[data-process-step]'));
  const navLinks = Array.from(document.querySelectorAll('[data-process-nav]'));
  const indexLinks = Array.from(document.querySelectorAll('[data-process-index-link]'));

  const setActive = (id) => {
    steps.forEach((step) => step.classList.toggle('is-active', step.id === id));
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  };

  const scrollToTarget = (event) => {
    const link = event.currentTarget;
    const selector = link.getAttribute('href');
    if (!selector || !selector.startsWith('#')) return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', selector);
  };

  [...navLinks, ...indexLinks].forEach((link) => link.addEventListener('click', scrollToTarget));

  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-28% 0px -52% 0px', threshold: [0.05, 0.18, 0.35, 0.55] });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-seen');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    steps.forEach((step) => {
      activeObserver.observe(step);
      revealObserver.observe(step);
    });
  } else {
    steps.forEach((step) => step.classList.add('is-seen'));
    if (steps[0]) setActive(steps[0].id);
  }

  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportMarker = window.innerHeight * 0.42;
    const total = Math.max(1, rect.height);
    const travelled = Math.min(total, Math.max(0, viewportMarker - rect.top));
    const percent = Math.min(100, Math.max(0, (travelled / total) * 100));
    timeline.style.setProperty('--process-progress', `${percent}%`);
  };

  const requestProgress = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });

  const hashTarget = location.hash && document.querySelector(location.hash);
  if (hashTarget?.matches('[data-process-step]')) {
    setTimeout(() => hashTarget.scrollIntoView({ block: 'start' }), 80);
  }
})();

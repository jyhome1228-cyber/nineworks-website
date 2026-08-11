(() => {
  const workId = new URLSearchParams(window.location.search).get('work') || '';

  const replaceSectionCopy = (section, title, paragraphs) => {
    if (!section) return;
    const heading = section.querySelector('.portfolio-scroll-section__head h2');
    if (heading) heading.textContent = title;
    const copy = section.querySelector('.portfolio-scroll-copy');
    if (copy && Array.isArray(paragraphs)) copy.innerHTML = paragraphs.map((text) => `<p>${text}</p>`).join('');
  };

  const createBlock = (pairs = []) => {
    const block = document.createElement('section');
    block.className = 'dev-inline-block';
    pairs.forEach(([heading, content]) => {
      if (heading) block.appendChild(heading);
      if (content) block.appendChild(content);
    });
    return block;
  };

  const rewriteDevHeading = (heading, label, title, copy) => {
    if (!heading) return;
    const labelEl = heading.querySelector('span');
    const titleEl = heading.querySelector('h3');
    const copyEl = heading.querySelector('p');
    if (labelEl) labelEl.textContent = label;
    if (titleEl) titleEl.textContent = title;
    if (copyEl && copy) copyEl.textContent = copy;
  };

  const finebCopy = (sections, system, pairs) => {
    replaceSectionCopy(sections[0], '제작사의 상담 방식부터 먼저 구조화했습니다.', [
      '파인비 프로젝트는 화면 디자인보다 먼저 실제 제작 상담이 어떤 순서로 이루어지는지 정리하는 데서 시작했습니다. 고객이 제작품목을 탐색하고, 공정을 이해하고, 가이드를 확인한 뒤 샘플 또는 견적 요청으로 이동하는 흐름을 기준으로 메뉴와 콘텐츠 구조를 설계했습니다.',
      '동시에 내부 운영에서는 어떤 정보가 견적에 필요하고 접수 이후 어떤 상태로 관리되는지를 정의했습니다. 브랜드 메시지, 정보 구조, 견적 변수, 관리자 업무를 각각 따로 보지 않고 하나의 서비스 기획 안에서 연결한 것이 프로젝트의 출발점입니다.'
    ]);
    replaceSectionCopy(sections[1], '정보 구조와 화면 경험을 하나의 기준으로 정리했습니다.', [
      '패키지 제작은 전문 용어와 선택 조건이 많기 때문에 시각적 인상보다 정보의 위계가 먼저 작동해야 했습니다. 큰 제목, 명확한 섹션 구분, 정돈된 그리드와 반복되는 인터페이스 규칙을 사용해 제작품목과 공정 정보를 빠르게 비교할 수 있도록 설계했습니다.',
      '회사소개·제작품목·제작과정·포트폴리오·주문제작가이드·샘플제작·FAQ·제작문의·견적내기까지 같은 디자인 시스템으로 연결하고, 데스크톱과 모바일에서도 정보 순서와 전환 흐름이 유지되도록 반응형 구조를 구축했습니다.'
    ]);
    replaceSectionCopy(sections[2], '견적 조건을 단계형 입력과 데이터 구조로 바꿨습니다.', [
      '인쇄 견적에 필요한 박스 형태, 수량, 완성 사이즈, 종이와 평량, 인쇄 방식, 색상, 인쇄면, 코팅과 후가공을 실제 상담 순서에 맞춰 단계형 인터페이스로 재구성했습니다. 사용자가 한 번에 많은 정보를 마주하지 않도록 단계마다 필요한 선택만 보여주고 필수 조건을 검증하도록 설계했습니다.',
      '선택값은 JavaScript 상태 객체에 유지되고 마지막 단계에서 제작 사양과 담당자 정보를 하나의 payload로 구성합니다. 접수 데이터는 Firestore의 견적 컬렉션으로 저장되어 프론트 화면의 입력이 곧바로 내부 운영 데이터로 이어지도록 했습니다.'
    ]);
    replaceSectionCopy(sections[3], '접수 이후의 상담 업무까지 관리자 화면으로 연결했습니다.', [
      '고객이 요청을 제출한 뒤의 업무도 시스템 범위에 포함했습니다. 견적문의·샘플문의·제작문의를 Firestore 중앙 저장소에서 불러오고, 회사명·담당자·연락처 검색과 상세 확인, 상태 변경이 가능하도록 관리자 화면을 구성했습니다.',
      '업무 상태는 신규·확인중·진행중·견적완료·완료·보류로 나누고 포트폴리오 CMS, 휴지통 복원, 방문자 집계까지 운영 기능을 확장했습니다. 홈페이지가 보여주는 화면에 머무르지 않고 실제 상담과 후속 업무를 관리하는 도구로 작동하도록 설계했습니다.'
    ]);
    replaceSectionCopy(sections[4], 'GitHub와 Firebase를 분리해 배포와 운영 구조까지 완성했습니다.', [
      '프론트엔드는 HTML5, CSS3, Vanilla JavaScript와 ES Modules를 중심으로 구성하고, 데이터 계층은 Firebase Firestore와 Storage로 분리했습니다. 소스는 GitHub main 브랜치에서 버전 관리하며 커스텀 도메인 finebpkg.com을 연결해 운영할 수 있도록 구축했습니다.',
      '견적·샘플·문의·포트폴리오·방문자 데이터는 클라우드 저장소를 기준으로 관리하고, 요청 저장 실패 상황을 고려한 LocalStorage 임시 백업도 함께 두었습니다. 기획, 디자인, 코드, 데이터, 배포가 분리되지 않고 하나의 운영 가능한 시스템으로 이어지는 것이 FINE.B DEVELOP 프로젝트의 핵심입니다.'
    ]);
    const introTitle = system.querySelector('.dev-case-system__title');
    if (introTitle) introTitle.textContent = '기획부터 운영까지, 하나의 디지털 제작 시스템으로.';
    const headingData = [
      ['A / PLANNING FRAMEWORK','요구사항과 사용자 흐름을 먼저 정의했습니다.','화면을 만들기 전에 고객의 질문 순서와 내부 상담 절차를 기준으로 프로젝트 요구사항을 구조화했습니다.'],
      ['B / SYSTEM ARCHITECTURE','웹사이트에서 관리자까지 하나의 흐름으로 연결했습니다.','브랜드 콘텐츠, 견적 로직, 클라우드 데이터와 관리자 화면이 각자의 역할을 유지하면서 하나의 서비스 흐름으로 이어지도록 설계했습니다.'],
      ['C / DEVELOPMENT STACK','운영에 필요한 기술만 가볍게 구성했습니다.','별도의 무거운 프레임워크 없이 정적 프론트엔드와 Firebase 모듈을 직접 연결해 수정과 운영이 쉬운 구조로 구축했습니다.'],
      ['D / INFORMATION ARCHITECTURE','메뉴 구조는 고객 행동과 내부 운영을 기준으로 정리했습니다.','사용자용 콘텐츠 메뉴, 견적 전환 메뉴, 내부 운영 도구를 목적별로 분리해 각 기능의 역할이 명확하게 보이도록 구성했습니다.'],
      ['E / DATA FLOW','견적 입력값은 운영 가능한 데이터로 이어집니다.','사용자 선택값을 상태 객체와 검증 로직을 거쳐 Firestore 문서로 저장하고, 관리자 화면에서 다시 업무 상태로 관리하도록 연결했습니다.'],
      ['F / CODE STRUCTURE','화면, 데이터, 관리 기능을 역할별 코드로 분리했습니다.','핵심 기능을 상태 관리, 공개 요청 저장, 관리자 조회, 포트폴리오 업로드 단위로 나눠 유지보수 가능한 구조로 정리했습니다.'],
      ['G / DEPLOYMENT & OPERATION','배포 이후의 수정과 운영까지 고려했습니다.','Git 버전 관리, 정적 프론트엔드, Firebase 데이터 계층과 커스텀 도메인을 분리해 운영 환경을 구성했습니다.']
    ];
    headingData.forEach((data, index) => rewriteDevHeading(pairs[index]?.[0], ...data));
  };

  const tneCopy = (system, pairs) => {
    const introTitle = system.querySelector('.dev-case-system__title');
    if (introTitle) introTitle.textContent = '빌더의 운영성과 커스텀 개발을 하나의 기업 웹 경험으로.';
    const headingData = [
      ['A / PLANNING FRAMEWORK','사업 구조와 정보 탐색 흐름을 먼저 정의했습니다.','태양광 EPC의 사업 단계와 시공 이력이 사용자에게 어떤 순서로 이해되어야 하는지 기준을 세우고 화면 구조를 설계했습니다.'],
      ['B / INTERACTION ARCHITECTURE','페이지마다 사업 내용을 인터랙션으로 구현했습니다.','정적인 기업 정보 대신 스크롤과 선택 동작에 따라 사업 과정과 핵심 정보가 단계적으로 드러나도록 구성했습니다.'],
      ['C / CUSTOM CODE LAYER','아임웹 위에 필요한 기능만 코드로 확장했습니다.','빌더의 CMS와 운영 환경은 유지하고 HTML·CSS·JavaScript를 이용해 페이지별 커스텀 UI와 인터랙션을 추가했습니다.'],
      ['D / INFORMATION ARCHITECTURE','사업 과정과 시공 이력을 하나의 정보 체계로 정리했습니다.','사업 과정, 전국 현황, 프로젝트 아카이브와 문의 흐름을 목적별로 구분하면서 서로 자연스럽게 이어지도록 구성했습니다.'],
      ['E / MAP & DATA FLOW','지도 선택이 실제 프로젝트 데이터로 이어지도록 연결했습니다.','지역 선택 이벤트를 위치 정보와 시공 사례에 연결해 전국 사업 현황을 단순 이미지가 아닌 탐색 가능한 데이터 경험으로 구현했습니다.'],
      ['F / COMPONENT STRUCTURE','페이지별 기능을 독립적인 코드 모듈로 관리했습니다.','커스텀 섹션, 지도 인터랙션, 프로젝트 아카이브와 반응형 UI를 역할별로 분리해 수정과 확장이 쉬운 구조로 정리했습니다.'],
      ['G / DEPLOYMENT & OPERATION','아임웹 운영 환경 안에서 지속 수정 가능한 구조로 완성했습니다.','콘텐츠는 빌더에서 관리하고 핵심 인터랙션은 커스텀 코드로 유지해 운영 편의성과 개발 표현력을 동시에 확보했습니다.']
    ];
    headingData.forEach((data, index) => rewriteDevHeading(pairs[index]?.[0], ...data));
  };

  const relimCopy = (system, pairs) => {
    const introTitle = system.querySelector('.dev-case-system__title');
    if (introTitle) introTitle.textContent = '고객 질문 데이터부터 예약과 운영까지, 하나의 서비스 시스템으로.';
    const headingData = [
      ['A / SERVICE PLANNING','고객이 예약 전에 무엇을 궁금해하는지부터 정의했습니다.','공간 소개보다 먼저 이용시간, 요금, 숙박, 준비물, 예약과 환불처럼 실제 고객이 반복해서 묻는 정보를 기준으로 서비스 구조를 설계했습니다.'],
      ['B / SYSTEM ARCHITECTURE','브랜드 사이트와 고객지원·커뮤니티를 하나의 흐름으로 연결했습니다.','정적 공간 콘텐츠, FAQ 검색, Firebase 회원·리뷰·문의와 관리자 기능이 각자의 역할을 유지하면서 자연스럽게 이어지도록 구성했습니다.'],
      ['C / DEVELOPMENT STACK','정적 프론트엔드와 필요한 클라우드 기능만 분리했습니다.','HTML·CSS·Vanilla JavaScript를 중심으로 화면을 구축하고 회원과 운영 데이터가 필요한 영역만 Firebase Auth와 Firestore로 연결했습니다.'],
      ['D / INFORMATION ARCHITECTURE','공간 안내와 예약 지원, 커뮤니티를 목적별로 분리했습니다.','소개·시설·갤러리·이용안내·예약·위치와 FAQ, 리뷰, 문의, 관리자 기능을 사용 목적에 따라 정리했습니다.'],
      ['E / CUSTOMER KNOWLEDGE FLOW','약 2,000건의 DM을 검색 가능한 FAQ 데이터로 바꿨습니다.','실제 인스타그램 DM JSON에서 반복 질문과 유사 표현을 분류해 FAQ 데이터로 만들고 검색으로 해결되지 않는 질문은 회원 문의와 관리자 답변으로 연결했습니다.'],
      ['F / CODE & DATA STRUCTURE','FAQ, 리뷰, 문의와 관리자 기능을 역할별 코드로 나눴습니다.','검색 데이터, 실시간 리뷰, 비공개 문의와 관리자 답변, 방문자 집계를 독립된 모듈로 구성해 유지보수 가능한 구조로 정리했습니다.'],
      ['G / DEPLOYMENT & SEARCH','배포 이후 예약 전환과 검색 노출까지 함께 고려했습니다.','GitHub Pages와 커스텀 도메인, 캠핏 예약, 네이버 지도, GA4와 Google·Naver SEO 설정을 연결해 실제 운영 환경까지 완성했습니다.']
    ];
    headingData.forEach((data, index) => rewriteDevHeading(pairs[index]?.[0], ...data));
  };

  const aesostCopy = (system, pairs) => {
    const introTitle = system.querySelector('.dev-case-system__title');
    if (introTitle) introTitle.textContent = '회원의 활동과 콘텐츠가 쌓이는 커뮤니티 플랫폼으로.';
    const headingData = [
      ['A / PLATFORM PLANNING','방문자와 회원의 역할을 먼저 나눴습니다.','비회원의 콘텐츠 탐색과 회원의 게시글 작성·관리 흐름을 구분하고 가입 이후 반복되는 활동 구조를 기준으로 플랫폼을 설계했습니다.'],
      ['B / COMMUNITY ARCHITECTURE','탐색·작성·개인 페이지가 하나의 커뮤니티 경험으로 이어집니다.','커뮤니티 피드와 게시글 상세, 작성자 페이지가 단절되지 않고 서로 새로운 탐색 경로가 되도록 정보 구조를 연결했습니다.'],
      ['C / MEMBER SYSTEM','가입부터 글쓰기와 마이페이지까지 회원 흐름을 구성했습니다.','회원 상태에 따라 작성 기능과 관리 기능이 활성화되고 본인이 만든 콘텐츠와 프로필 정보를 다시 관리할 수 있도록 설계했습니다.'],
      ['D / INFORMATION ARCHITECTURE','커뮤니티와 개인 프로필, 매거진의 역할을 분리했습니다.','사용자 생성 콘텐츠와 회원 스펙 정보, 편집형 매거진을 서로 다른 콘텐츠 타입으로 정의해 탐색 목적이 명확하게 보이도록 구성했습니다.'],
      ['E / PUBLISHING FLOW','회원의 활동이 플랫폼 콘텐츠로 축적되는 구조를 만들었습니다.','가입 이후 작성한 게시물이 피드와 상세 페이지에 노출되고 다시 마이페이지와 개인 프로필 관리로 이어지는 반복 흐름을 설계했습니다.'],
      ['F / PROFILE & CONTENT STRUCTURE','개인 스펙 페이지와 매거진을 별도 콘텐츠 시스템으로 정리했습니다.','회원마다 다른 프로필·스펙을 같은 정보 위계로 보여주고 매거진은 읽기 중심의 콘텐츠 경험으로 분리해 플랫폼 안에서 연결했습니다.'],
      ['G / DEPLOYMENT & OPERATION','회원과 콘텐츠가 늘어나도 확장 가능한 운영 구조로 구성했습니다.','회원·게시글·스펙·매거진의 기능 범위를 분리해 콘텐츠 증가와 사용자 활동 확장에도 대응할 수 있는 플랫폼 구조로 정리했습니다.']
    ];
    headingData.forEach((data, index) => rewriteDevHeading(pairs[index]?.[0], ...data));
  };

  const mixDevelopCase = () => {
    if (!document.body.classList.contains('portfolio-develop-mode')) return false;
    const system = document.querySelector('.dev-case-system');
    const sections = Array.from(document.querySelectorAll('.portfolio-scroll-section'));
    if (!system || sections.length < 5) return false;
    if (system.dataset.mixed === 'true') return true;
    system.dataset.mixed = 'true';

    const headings = Array.from(system.querySelectorAll('.dev-case-heading'));
    const pairs = headings.map((heading) => [heading, heading.nextElementSibling]);
    if (pairs.length < 7) return true;

    if (workId === 'fineb') finebCopy(sections, system, pairs);
    else if (workId === 'tne-epc') tneCopy(system, pairs);
    else if (workId === 'relim') relimCopy(system, pairs);
    else if (workId === 'aesost') aesostCopy(system, pairs);

    sections[0].insertAdjacentElement('afterend', system);
    system.insertAdjacentElement('afterend', createBlock([pairs[0]]));
    sections[1].insertAdjacentElement('afterend', createBlock([pairs[1], pairs[2]]));
    sections[2].insertAdjacentElement('afterend', createBlock([pairs[3], pairs[4]]));
    sections[3].insertAdjacentElement('afterend', createBlock([pairs[5]]));
    sections[4].insertAdjacentElement('afterend', createBlock([pairs[6]]));
    return true;
  };

  if (mixDevelopCase()) return;
  const observer = new MutationObserver(() => { if (mixDevelopCase()) observer.disconnect(); });
  observer.observe(document.documentElement, { childList:true, subtree:true });
  window.setTimeout(() => observer.disconnect(), 5000);
})();
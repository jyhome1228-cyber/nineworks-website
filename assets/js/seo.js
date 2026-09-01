(() => {
  const BASE = 'https://9works.kr';
  const DEFAULT_IMAGE = `${BASE}/assets/kakao-preview.png?v=20260825-2`;
  const LOGO = `${BASE}/assets/logo-nineworks.svg`;
  const path = window.location.pathname.replace(/\/+/g, '/');
  const file = path.split('/').pop() || 'index.html';
  const params = new URLSearchParams(window.location.search);
  const absoluteUrl = (value = '') => {
    if (!value) return DEFAULT_IMAGE;
    try { return new URL(value, `${BASE}/`).href; }
    catch { return DEFAULT_IMAGE; }
  };

  // GitHub Pages cannot issue a server-side 301 for /index.html. Keep the root URL as the single public home URL.
  if ((window.location.hostname === '9works.kr' || window.location.hostname === 'www.9works.kr') && /\/index\.html$/i.test(path)) {
    window.location.replace(`${BASE}/${window.location.search}${window.location.hash}`);
    return;
  }

  const pageMap = {
    'index.html': {
      title: 'NINEWORKS 나인웍스 | 브랜드 전략·아이덴티티 디자인 스튜디오',
      description: '나인웍스는 브랜드 전략과 아이덴티티를 중심으로 패키지, 웹사이트, 콘텐츠와 실제 제작까지 하나의 브랜드 경험으로 연결하는 디자인 스튜디오입니다.',
      canonical: `${BASE}/`, breadcrumb: [], pageType: 'WebPage'
    },
    'about.html': {
      title: '나인웍스 소개 | 브랜드 전략·디자인 스튜디오 NINEWORKS',
      description: '2020년 설립 이후 브랜드 전략, 아이덴티티, 패키지, 디지털 시스템과 제작을 연결해온 나인웍스의 관점과 작업 방식을 소개합니다.',
      canonical: `${BASE}/about.html`, breadcrumb: [{ name: 'About', url: `${BASE}/about.html` }], pageType: 'AboutPage'
    },
    'designer.html': {
      title: '박재영 디자이너 | 브랜드 디자인·연구·교육 | NINEWORKS',
      description: '나인웍스 박재영 디자이너의 브랜드 디자인 실무, 디자인 연구, 교육, 심사·컨설팅과 주요 프로젝트 이력을 소개합니다.',
      canonical: `${BASE}/designer.html`, breadcrumb: [{ name: 'Designer', url: `${BASE}/designer.html` }], pageType: 'ProfilePage', person: true
    },
    'performance.html': {
      title: '나인웍스 사업·실적 정보 | NINEWORKS',
      description: '나인웍스의 설립 이후 사업 현황, 연간 성장, 프로젝트 실적과 운영 데이터를 정리한 회사 정보 페이지입니다.',
      canonical: `${BASE}/performance.html`, breadcrumb: [{ name: 'Performance', url: `${BASE}/performance.html` }], pageType: 'WebPage'
    },
    'partners.html': {
      title: '나인웍스 파트너 네트워크 | NINEWORKS',
      description: '디자인, 콘텐츠, 인쇄·제작과 프로젝트 실행을 함께하는 나인웍스의 파트너 네트워크와 협업 구조를 소개합니다.',
      canonical: `${BASE}/partners.html`, breadcrumb: [{ name: 'Partners', url: `${BASE}/partners.html` }], pageType: 'WebPage'
    },
    'process.html': {
      title: '브랜드 프로젝트 프로세스 | NINEWORKS 나인웍스',
      description: '진단과 전략에서 아이덴티티, 시스템, 실행과 아카이브까지 나인웍스가 브랜드 프로젝트를 운영하는 전체 프로세스를 소개합니다.',
      canonical: `${BASE}/process.html`, breadcrumb: [{ name: 'Process', url: `${BASE}/process.html` }], pageType: 'WebPage', service: 'Brand Design Process'
    },
    'project-operation.html': {
      title: '프로젝트 운영 방식 | 계약·일정·산출물 | NINEWORKS',
      description: '계약 이후 일정, 커뮤니케이션, 디자인 검토, 산출물 전달과 운영까지 나인웍스 프로젝트의 실제 진행 방식을 안내합니다.',
      canonical: `${BASE}/project-operation.html`, breadcrumb: [{ name: 'Process', url: `${BASE}/process.html` }, { name: 'Project Operation', url: `${BASE}/project-operation.html` }], pageType: 'WebPage'
    },
    'branding.html': {
      title: '브랜딩 프로세스 | 브랜드 전략·아이덴티티 | NINEWORKS',
      description: '사업과 고객을 이해하고 브랜드 전략, 언어, 아이덴티티, 시각 시스템과 실제 적용까지 연결하는 나인웍스의 브랜딩 프로세스입니다.',
      canonical: `${BASE}/branding.html`, breadcrumb: [{ name: 'Process', url: `${BASE}/process.html` }, { name: 'Branding', url: `${BASE}/branding.html` }], pageType: 'WebPage', service: 'Brand Strategy & Identity Design'
    },
    'package-design.html': {
      title: '패키지 디자인 | 브랜드 패키지·제품 시각화 | NINEWORKS',
      description: '브랜드 전략을 제품 패키지로 확장해 구조, 그래픽, 라벨, 제품 시각화와 양산 적용까지 연결하는 나인웍스 패키지 디자인 서비스입니다.',
      canonical: `${BASE}/package-design.html`, breadcrumb: [{ name: 'Process', url: `${BASE}/process.html` }, { name: 'Package Design', url: `${BASE}/package-design.html` }], pageType: 'WebPage', service: 'Package Design'
    },
    'solutions.html': {
      title: '브랜딩·패키지·웹디자인 솔루션 | NINEWORKS 나인웍스',
      description: '브랜드 전략과 아이덴티티, 패키지, 웹사이트·시스템, 상세페이지, 편집·콘텐츠, 인쇄·제작까지 나인웍스의 디자인 솔루션을 확인하세요.',
      canonical: `${BASE}/solutions.html`, breadcrumb: [{ name: 'Solutions', url: `${BASE}/solutions.html` }], pageType: 'CollectionPage'
    },
    'signature-project.html': {
      title: '시그니처 브랜드 프로젝트 | 전략부터 실행까지 | NINEWORKS',
      description: '브랜드 진단과 전략, 아이덴티티, 패키지·웹·콘텐츠와 운영 접점까지 하나의 시스템으로 구축하는 나인웍스 시그니처 프로젝트입니다.',
      canonical: `${BASE}/signature-project.html`, breadcrumb: [{ name: 'Solutions', url: `${BASE}/solutions.html` }, { name: 'Signature Project', url: `${BASE}/signature-project.html` }], pageType: 'WebPage', service: 'Integrated Brand Design Project'
    },
    'develop.html': {
      title: '웹사이트 제작·웹개발·관리자 시스템 | NINEWORKS',
      description: '기업·브랜드 홈페이지, 카페24·아임웹 커스터마이징, GitHub Pages와 Firebase 기반 관리자·예약·CRM 등 디지털 시스템을 기획·디자인·구축합니다.',
      canonical: `${BASE}/develop.html`, breadcrumb: [{ name: 'Solutions', url: `${BASE}/solutions.html` }, { name: 'Develop', url: `${BASE}/develop.html` }], pageType: 'WebPage', service: 'Website & Digital System Development'
    },
    'local-branding.html': {
      title: '로컬 브랜딩 | 지역·공간·상권 브랜드 디자인 | NINEWORKS',
      description: '지역성과 장소의 맥락을 브랜드 언어, 아이덴티티, 콘텐츠와 실제 공간 경험으로 연결하는 나인웍스 로컬 브랜딩 프로젝트입니다.',
      canonical: `${BASE}/local-branding.html`, breadcrumb: [{ name: 'Solutions', url: `${BASE}/solutions.html` }, { name: 'Local Branding', url: `${BASE}/local-branding.html` }], pageType: 'WebPage', service: 'Local Branding'
    },
    'project.html': {
      title: '브랜딩 프로젝트 사례 | 브랜드 아이덴티티 | NINEWORKS',
      description: 'F&B, 뷰티, 웰니스, 라이프스타일과 기업·기관까지 나인웍스가 진행한 브랜드 전략과 아이덴티티 프로젝트 사례를 확인하세요.',
      canonical: `${BASE}/project.html`, breadcrumb: [{ name: 'Projects', url: `${BASE}/project.html` }], pageType: 'CollectionPage'
    },
    'portfolio.html': {
      title: '브랜딩·패키지·웹 포트폴리오 | NINEWORKS 나인웍스',
      description: '브랜드 아이덴티티, 패키지, 웹사이트·시스템, 상세페이지, 편집, IR·PPT와 콘텐츠까지 나인웍스의 프로젝트 포트폴리오를 확인하세요.',
      canonical: `${BASE}/portfolio.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }], pageType: 'CollectionPage'
    },
    'magazine.html': {
      title: '브랜드 전략·브랜딩·디자인 매거진 | NINEWORKS',
      description: '브랜드 전략, 아이덴티티, 패키지, 공간과 리테일 경험을 디자인 관점에서 분석하고 기록하는 나인웍스 브랜드 매거진입니다.',
      canonical: `${BASE}/magazine.html`, breadcrumb: [{ name: 'Magazine', url: `${BASE}/magazine.html` }], pageType: 'CollectionPage'
    },
    'contact.html': {
      title: '브랜딩·패키지·웹 프로젝트 문의 | NINEWORKS 나인웍스',
      description: '브랜딩, 패키지, 웹사이트·시스템, 편집·콘텐츠와 인쇄·제작 프로젝트를 나인웍스에 문의하세요.',
      canonical: `${BASE}/contact.html`, breadcrumb: [{ name: 'Contact', url: `${BASE}/contact.html` }], pageType: 'ContactPage'
    },
    'membership.html': {
      title: '월간 디자인 멤버십 | 브랜드 운영 디자인 | NINEWORKS',
      description: 'SNS 콘텐츠, 상세페이지, 편집물, 패키지와 웹 운영 디자인을 월 단위로 연결하는 나인웍스 디자인 멤버십 서비스입니다.',
      canonical: `${BASE}/membership.html`, breadcrumb: [{ name: 'Membership', url: `${BASE}/membership.html` }], pageType: 'WebPage', service: 'Monthly Design Membership'
    },
    'print.html': {
      title: '인쇄·패키지 제작 | 브로셔·카탈로그·단상자 | NINEWORKS',
      description: '브로셔, 카탈로그, 리플렛과 스티커 인쇄부터 단상자, 합지박스, 슬리브와 쇼핑백 제작까지 디자인과 생산을 연결합니다.',
      canonical: `${BASE}/print.html`, breadcrumb: [{ name: 'Print', url: `${BASE}/print.html` }], pageType: 'WebPage', service: 'Print & Package Production'
    },
    'print-editorial.html': {
      title: '브로셔·카탈로그·리플렛 인쇄 제작 | NINEWORKS',
      description: '브로셔, 카탈로그, 리플렛, 스티커와 라벨의 규격, 지류, 제본과 후가공 조건을 정리해 디자인부터 인쇄 제작까지 진행합니다.',
      canonical: `${BASE}/print-editorial.html`, breadcrumb: [{ name: 'Print', url: `${BASE}/print.html` }, { name: 'Editorial Print', url: `${BASE}/print-editorial.html` }], pageType: 'WebPage', service: 'Editorial Print Production'
    },
    'package-production.html': {
      title: '단상자·합지박스·쇼핑백 패키지 제작 | NINEWORKS',
      description: '단상자, 합지박스, 슬리브와 쇼핑백의 구조, 지류, 인쇄와 후가공을 정리해 패키지 디자인에서 실제 양산까지 연결합니다.',
      canonical: `${BASE}/package-production.html`, breadcrumb: [{ name: 'Print', url: `${BASE}/print.html` }, { name: 'Package Production', url: `${BASE}/package-production.html` }], pageType: 'WebPage', service: 'Package Production'
    },
    'package-sample.html': {
      title: '패키지 소량 샘플 제작 | 단상자 목업 | NINEWORKS',
      description: '양산 전 구조, 인쇄 색상, 촬영과 제안 검토를 위한 단상자 패키지 소량 샘플과 목업 제작을 안내합니다.',
      canonical: `${BASE}/package-sample.html`, breadcrumb: [{ name: 'Print', url: `${BASE}/print.html` }, { name: 'Package Sample', url: `${BASE}/package-sample.html` }], pageType: 'WebPage', service: 'Package Sample Production'
    },
    'recruit.html': {
      title: '파트너 디자이너 등록 | NINEWORKS',
      description: '브랜드 프로젝트를 함께할 프리랜서·파트너 디자이너를 위한 나인웍스 디자이너 네트워크 등록 안내입니다.',
      canonical: `${BASE}/recruit.html`, breadcrumb: [{ name: 'Designer Network', url: `${BASE}/recruit.html` }], pageType: 'WebPage'
    },
    'design-academy.html': {
      title: '디자인 아카데미·교육 프로그램 | NINEWORKS',
      description: '브랜드 디자인 실무와 프로젝트 문서화, 디자인 시스템을 중심으로 운영하는 나인웍스 교육·아카데미 프로그램 안내입니다.',
      canonical: `${BASE}/design-academy.html`, breadcrumb: [{ name: 'Design Academy', url: `${BASE}/design-academy.html` }], pageType: 'WebPage'
    },
    'project-lorve.html': {
      title: 'L’ORVÉ 브랜드 아이덴티티·패키지 디자인 | NINEWORKS',
      description: '프리미엄 에스테틱 브랜드 L’ORVÉ의 브랜드 아이덴티티와 패키지 디자인을 구축한 나인웍스 프로젝트입니다.',
      canonical: `${BASE}/project-lorve.html`, breadcrumb: [{ name: 'Projects', url: `${BASE}/project.html` }, { name: 'L’ORVÉ', url: `${BASE}/project-lorve.html` }], pageType: 'WebPage', creative: true
    },
    'portfolio-fineb.html': { title: 'FINE.B 웹사이트·온라인 견적 시스템 | NINEWORKS', description: '인쇄기업 FINE.B의 웹사이트, 온라인 견적 시스템과 관리자 경험을 기획·디자인·구축한 나인웍스 프로젝트입니다.', canonical: `${BASE}/portfolio-fineb.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'FINE.B', url: `${BASE}/portfolio-fineb.html` }], pageType: 'WebPage', creative: true },
    'portfolio-tne-epc.html': { title: 'TNE 태양광 EPC 기업 웹사이트 | NINEWORKS', description: '태양광 EPC 기업 TNE의 기업 웹사이트와 프로젝트 아카이브를 구축한 나인웍스 디지털 프로젝트입니다.', canonical: `${BASE}/portfolio-tne-epc.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'TNE', url: `${BASE}/portfolio-tne-epc.html` }], pageType: 'WebPage', creative: true },
    'portfolio-relim.html': { title: 'RE:LIM 웹사이트·운영 시스템 구축 | NINEWORKS', description: '아웃도어 레저 브랜드 RE:LIM의 웹사이트, FAQ, 커뮤니티와 운영 관리자 시스템을 구축한 나인웍스 프로젝트입니다.', canonical: `${BASE}/portfolio-relim.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'RE:LIM', url: `${BASE}/portfolio-relim.html` }], pageType: 'WebPage', creative: true },
    'portfolio-aesost.html': { title: 'AESOST 커뮤니티 플랫폼 구축 | NINEWORKS', description: '회원 콘텐츠, 게시물 발행, 마이페이지와 커뮤니티 기능을 갖춘 AESOST 플랫폼을 구축한 나인웍스 프로젝트입니다.', canonical: `${BASE}/portfolio-aesost.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'AESOST', url: `${BASE}/portfolio-aesost.html` }], pageType: 'WebPage', creative: true },
    'portfolio-kekomi.html': { title: 'KEKOMI 카페24 쇼핑몰 리뉴얼 | NINEWORKS', description: 'KEKOMI의 카페24 커머스 UI, 상품 상세, 이벤트와 콘텐츠 경험을 리뉴얼한 나인웍스 웹 프로젝트입니다.', canonical: `${BASE}/portfolio-kekomi.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'KEKOMI', url: `${BASE}/portfolio-kekomi.html` }], pageType: 'WebPage', creative: true },
    'portfolio-thomastone.html': { title: 'THOMASTONE 기업 웹사이트 구축 | NINEWORKS', description: 'AI 구강 헬스케어 기업 THOMASTONE의 반응형 기업 웹사이트와 뉴스 콘텐츠 경험을 구축한 나인웍스 프로젝트입니다.', canonical: `${BASE}/portfolio-thomastone.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'THOMASTONE', url: `${BASE}/portfolio-thomastone.html` }], pageType: 'WebPage', creative: true },
    'portfolio-recelleclore.html': { title: 'RECELLÉCLORE 브랜드·커머스 웹 구축 | NINEWORKS', description: '더모코스메틱 브랜드 RECELLÉCLORE의 브랜딩, 패키지, 커머스 웹사이트와 콘텐츠 시스템을 연결한 나인웍스 프로젝트입니다.', canonical: `${BASE}/portfolio-recelleclore.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'RECELLÉCLORE', url: `${BASE}/portfolio-recelleclore.html` }], pageType: 'WebPage', creative: true },
    'portfolio-relim-branding.html': { title: 'RE:LIM 브랜드 아이덴티티 | NINEWORKS', description: '자연 속 체류 경험을 로고, 비주얼 시스템과 공간·운영 접점으로 확장한 RE:LIM 브랜딩 프로젝트입니다.', canonical: `${BASE}/portfolio-relim-branding.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'RE:LIM Branding', url: `${BASE}/portfolio-relim-branding.html` }], pageType: 'WebPage', creative: true },
    'portfolio-aesost-branding.html': { title: 'AESOST 브랜드 아이덴티티 | NINEWORKS', description: 'AESOST의 브랜드 언어와 시각 아이덴티티, 디지털 접점을 하나의 시스템으로 정리한 나인웍스 브랜딩 프로젝트입니다.', canonical: `${BASE}/portfolio-aesost-branding.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'AESOST Branding', url: `${BASE}/portfolio-aesost-branding.html` }], pageType: 'WebPage', creative: true },
    'portfolio-tythonic-industries.html': { title: 'TYTHONIC INDUSTRIES 게임 브랜드 리브랜딩 | NINEWORKS', description: '게임 세계관과 산업적 이미지를 기반으로 브랜드 아이덴티티와 응용 시스템을 전개한 나인웍스 콘셉트 프로젝트입니다.', canonical: `${BASE}/portfolio-tythonic-industries.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'TYTHONIC INDUSTRIES', url: `${BASE}/portfolio-tythonic-industries.html` }], pageType: 'WebPage', creative: true },
    'portfolio-west-bromwich-albion.html': { title: 'West Bromwich Albion 리브랜딩 콘셉트 | NINEWORKS', description: 'West Bromwich Albion의 상징과 헤리티지를 현대적인 축구 브랜드 시스템으로 재해석한 나인웍스 리브랜딩 콘셉트 프로젝트입니다.', canonical: `${BASE}/portfolio-west-bromwich-albion.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'West Bromwich Albion', url: `${BASE}/portfolio-west-bromwich-albion.html` }], pageType: 'WebPage', creative: true },
    'portfolio-coventry-city.html': { title: 'Coventry City FC 리브랜딩 제안 | NINEWORKS', description: 'Coventry City FC의 헤리티지와 클럽 아이덴티티를 현대적으로 확장한 나인웍스 축구 브랜딩 제안 프로젝트입니다.', canonical: `${BASE}/portfolio-coventry-city.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'Coventry City FC', url: `${BASE}/portfolio-coventry-city.html` }], pageType: 'WebPage', creative: true },
    'portfolio-taepyung.html': { title: '태평제지 브랜드·웹 리뉴얼 | NINEWORKS', description: '화장지 제조기업 태평제지의 브랜드 이미지, 웹사이트와 기업 커뮤니케이션을 정리한 나인웍스 리뉴얼 프로젝트입니다.', canonical: `${BASE}/portfolio-taepyung.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: '태평제지', url: `${BASE}/portfolio-taepyung.html` }], pageType: 'WebPage', creative: true },
    'portfolio-laff.html': { title: 'LAFF 브랜드 아이덴티티 | NINEWORKS', description: 'LAFF의 브랜드 콘셉트와 시각 아이덴티티, 응용 디자인을 전개한 나인웍스 브랜딩 프로젝트입니다.', canonical: `${BASE}/portfolio-laff.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'LAFF', url: `${BASE}/portfolio-laff.html` }], pageType: 'WebPage', creative: true },
    'portfolio-the-petrichor.html': { title: 'THE PETRICHOR 브랜드 아이덴티티 | NINEWORKS', description: 'THE PETRICHOR의 브랜드 콘셉트, 아이덴티티와 제품·패키지 경험을 전개한 나인웍스 브랜딩 프로젝트입니다.', canonical: `${BASE}/portfolio-the-petrichor.html`, breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: 'THE PETRICHOR', url: `${BASE}/portfolio-the-petrichor.html` }], pageType: 'WebPage', creative: true },
    'portfolio-wooje.html': { title: 'WOOJE STAY 브랜드 아이덴티티 | NINEWORKS', description: 'WOOJE STAY 브랜드 아이덴티티 프로젝트입니다.', canonical: `${BASE}/portfolio-detail.html?work=wooje-stay`, robots: 'noindex,follow', breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }], pageType: 'WebPage' },
    'client-register.html': { title: 'Client Registration | NINEWORKS', description: '나인웍스 클라이언트 등록 페이지입니다.', canonical: `${BASE}/client-register.html`, robots: 'noindex,follow', breadcrumb: [], pageType: 'WebPage' },
    'print-partner.html': { title: 'Print Partner | NINEWORKS', description: '나인웍스 인쇄·제조 파트너 등록 페이지입니다.', canonical: `${BASE}/print-partner.html`, robots: 'noindex,follow', breadcrumb: [], pageType: 'WebPage' },
    'resources.html': { title: 'Resources | NINEWORKS', description: '나인웍스 멤버 전용 리소스 페이지입니다.', canonical: `${BASE}/resources.html`, robots: 'noindex,follow', breadcrumb: [], pageType: 'WebPage' },
    'company-profile.html': { title: 'Company Profile | NINEWORKS', description: '나인웍스 회사소개 자료입니다.', canonical: `${BASE}/company-profile.html`, robots: 'noindex,follow', breadcrumb: [], pageType: 'WebPage' },
    'privacy.html': { title: '개인정보처리방침 | NINEWORKS', description: '나인웍스 개인정보처리방침입니다.', canonical: `${BASE}/privacy.html`, robots: 'noindex,follow', breadcrumb: [], pageType: 'WebPage' }
  };

  const privatePrefixes = ['/admin', '/client/', '/proposal/', '/majorportfolio/', '/rpbio/', '/welcare/', '/parters/'];
  const privateFiles = new Set(['admin.html', 'my.html', 'join.html', 'register.html', 'email-refusal.html', 'magazine-detail.html']);
  const isPrivateRoute = privatePrefixes.some((prefix) => path.startsWith(prefix)) || privateFiles.has(file);

  let meta = pageMap[file] || null;
  let ogType = 'website';
  let image = DEFAULT_IMAGE;
  let jsonLdExtra = null;

  if (isPrivateRoute && !meta) {
    meta = {
      title: 'NINEWORKS',
      description: 'NINEWORKS private or operational page.',
      canonical: `${BASE}${path}`,
      robots: 'noindex,nofollow,noarchive',
      breadcrumb: [],
      pageType: 'WebPage'
    };
  }

  if (file === 'portfolio-detail.html') {
    const id = (params.get('work') || '').replace(/[^a-z0-9-]/gi, '');
    const project = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO.find((item) => item.id === id) : null;
    if (project) {
      const filters = Array.isArray(project.filters) ? project.filters : [];
      const typeLabel = filters.includes('system') || filters.includes('develop')
        ? '웹사이트·디지털 시스템 프로젝트'
        : filters.includes('package')
          ? '브랜딩·패키지 디자인 프로젝트'
          : filters.includes('editorial')
            ? '브랜딩·편집 디자인 프로젝트'
            : filters.includes('event')
              ? '브랜딩·이벤트 디자인 프로젝트'
              : '브랜드 아이덴티티 프로젝트';
      const description = `${project.title} — ${project.subtitle || project.scope || typeLabel}. ${project.scope || ''} 나인웍스 포트폴리오.`.replace(/\s+/g, ' ').trim();
      meta = {
        title: `${project.title} | ${typeLabel} | NINEWORKS`,
        description,
        canonical: `${BASE}/portfolio-detail.html?work=${encodeURIComponent(id)}`,
        breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }, { name: project.title, url: `${BASE}/portfolio-detail.html?work=${encodeURIComponent(id)}` }],
        pageType: 'WebPage'
      };
      image = absoluteUrl(project.thumbnail);
      jsonLdExtra = {
        '@type': 'CreativeWork',
        '@id': `${meta.canonical}#work`,
        name: project.title,
        description,
        url: meta.canonical,
        image,
        creator: { '@id': `${BASE}/#organization` }
      };
    } else {
      meta = {
        title: 'Portfolio | NINEWORKS',
        description: '나인웍스 디자인 및 디지털 구축 프로젝트 포트폴리오입니다.',
        canonical: `${BASE}/portfolio.html`,
        robots: 'noindex,follow',
        breadcrumb: [{ name: 'Portfolio', url: `${BASE}/portfolio.html` }],
        pageType: 'WebPage'
      };
    }
  }

  if (file === 'magazine-detail.html') {
    meta = {
      title: 'Members Magazine | NINEWORKS',
      description: '나인웍스 멤버 전용 매거진 콘텐츠입니다.',
      canonical: `${BASE}/magazine.html`,
      robots: 'noindex,follow,noarchive',
      breadcrumb: [{ name: 'Magazine', url: `${BASE}/magazine.html` }],
      pageType: 'WebPage'
    };
  }

  if (!meta) return;

  if (meta.creative && !jsonLdExtra) {
    jsonLdExtra = {
      '@type': 'CreativeWork',
      '@id': `${meta.canonical}#work`,
      name: meta.title.replace(/\s*\|\s*NINEWORKS.*$/i, ''),
      description: meta.description,
      url: meta.canonical,
      image: DEFAULT_IMAGE,
      creator: { '@id': `${BASE}/#organization` }
    };
  }

  const setMeta = (selector, attr, value, keyAttr, keyValue) => {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(keyAttr, keyValue);
      document.head.appendChild(node);
    }
    node.setAttribute(attr, value);
  };
  const removeMeta = (selector) => document.querySelector(selector)?.remove();
  const setLink = (rel, href) => {
    let node = document.querySelector(`link[rel="${rel}"]`);
    if (!node) {
      node = document.createElement('link');
      node.rel = rel;
      document.head.appendChild(node);
    }
    node.href = href;
  };

  image = absoluteUrl(image);
  document.documentElement.lang = 'ko';
  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description, 'name', 'description');
  setMeta('meta[name="author"]', 'content', 'NINEWORKS', 'name', 'author');
  removeMeta('meta[name="keywords"]');
  setMeta('meta[name="robots"]', 'content', meta.robots || 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'name', 'robots');
  setLink('canonical', meta.canonical);

  setMeta('meta[property="og:type"]', 'content', ogType, 'property', 'og:type');
  setMeta('meta[property="og:locale"]', 'content', 'ko_KR', 'property', 'og:locale');
  setMeta('meta[property="og:site_name"]', 'content', 'NINEWORKS', 'property', 'og:site_name');
  setMeta('meta[property="og:title"]', 'content', meta.title, 'property', 'og:title');
  setMeta('meta[property="og:description"]', 'content', meta.description, 'property', 'og:description');
  setMeta('meta[property="og:url"]', 'content', meta.canonical, 'property', 'og:url');
  setMeta('meta[property="og:image"]', 'content', image, 'property', 'og:image');
  setMeta('meta[property="og:image:secure_url"]', 'content', image, 'property', 'og:image:secure_url');
  setMeta('meta[property="og:image:alt"]', 'content', file === 'index.html' ? 'NINEWORKS 나인웍스 디자인 스튜디오' : meta.title, 'property', 'og:image:alt');
  setMeta('meta[property="og:image:type"]', 'content', image.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/png', 'property', 'og:image:type');
  setMeta('meta[property="og:image:width"]', 'content', '1200', 'property', 'og:image:width');
  setMeta('meta[property="og:image:height"]', 'content', '630', 'property', 'og:image:height');

  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', 'name', 'twitter:card');
  setMeta('meta[name="twitter:title"]', 'content', meta.title, 'name', 'twitter:title');
  setMeta('meta[name="twitter:description"]', 'content', meta.description, 'name', 'twitter:description');
  setMeta('meta[name="twitter:image"]', 'content', image, 'name', 'twitter:image');
  setMeta('meta[name="twitter:image:alt"]', 'content', meta.title, 'name', 'twitter:image:alt');

  const organization = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'NINEWORKS',
    alternateName: '나인웍스',
    url: `${BASE}/`,
    logo: { '@type': 'ImageObject', url: LOGO },
    image: DEFAULT_IMAGE,
    description: '브랜드 전략과 아이덴티티를 중심으로 패키지, 웹사이트, 콘텐츠와 실제 제작까지 연결하는 디자인 스튜디오',
    foundingDate: '2020-02-10',
    founder: { '@id': `${BASE}/designer.html#person` },
    email: 'info@9works.kr',
    telephone: '+82-10-5422-5650',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '원당대로 1039, 태경타워 916호',
      addressLocality: '서구',
      addressRegion: '인천광역시',
      addressCountry: 'KR'
    },
    areaServed: { '@type': 'Country', name: '대한민국' },
    sameAs: ['https://www.behance.net/the9works', 'https://www.brunch.co.kr/@jaeywriter'],
    knowsAbout: ['Brand Strategy', 'Brand Identity', 'Package Design', 'Editorial Design', 'Website Design', 'UX/UI Design', 'Front-end Development', 'Firebase Web Development']
  };

  const person = {
    '@type': 'Person',
    '@id': `${BASE}/designer.html#person`,
    name: '박재영',
    alternateName: 'Jaeyoung Park',
    jobTitle: ['Designer', 'Researcher', 'Educator'],
    worksFor: { '@id': `${BASE}/#organization` },
    url: `${BASE}/designer.html`
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: `${BASE}/`,
    name: 'NINEWORKS',
    alternateName: '나인웍스',
    inLanguage: 'ko-KR',
    publisher: { '@id': `${BASE}/#organization` }
  };

  const allowedPageTypes = ['AboutPage', 'ContactPage', 'CollectionPage', 'ProfilePage'];
  const webPage = {
    '@type': allowedPageTypes.includes(meta.pageType) ? meta.pageType : 'WebPage',
    '@id': `${meta.canonical}#webpage`,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${BASE}/#website` },
    about: { '@id': `${BASE}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: image }
  };

  const graph = [organization, person, website, webPage];

  if (meta.person) webPage.mainEntity = { '@id': `${BASE}/designer.html#person` };

  if (meta.service) {
    const serviceId = `${meta.canonical}#service`;
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: meta.service,
      description: meta.description,
      url: meta.canonical,
      provider: { '@id': `${BASE}/#organization` },
      areaServed: { '@type': 'Country', name: '대한민국' }
    });
    webPage.mainEntity = { '@id': serviceId };
  }

  if (Array.isArray(meta.breadcrumb) && meta.breadcrumb.length) {
    const items = [{ name: 'NINEWORKS', url: `${BASE}/` }, ...meta.breadcrumb];
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${meta.canonical}#breadcrumb`,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem', position: index + 1, name: item.name, item: item.url
      }))
    });
    webPage.breadcrumb = { '@id': `${meta.canonical}#breadcrumb` };
  }

  if (jsonLdExtra) {
    graph.push(jsonLdExtra);
    webPage.mainEntity = { '@id': jsonLdExtra['@id'] };
  }

  document.querySelectorAll('script[data-nineworks-seo]').forEach((node) => node.remove());
  const json = document.createElement('script');
  json.type = 'application/ld+json';
  json.dataset.nineworksSeo = 'true';
  json.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(json);
})();

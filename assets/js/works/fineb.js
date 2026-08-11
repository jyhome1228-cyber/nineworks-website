window.NW_WORK={
  id:'fineb',
  title:'FINE.B',
  subtitle:'Printing Company Website & Online Quote System',
  lead:'웹사이트를 디자인하는 데서 끝내지 않고, 인쇄 제작 상담이 실제 데이터와 운영 업무로 이어지는 디지털 시스템을 설계했습니다.',
  summary:'FINE.B 프로젝트는 패키지·인쇄 제작사의 전문성을 온라인에서 설명하는 브랜드 웹사이트와, 복잡한 제작 사양을 단계별로 수집하는 견적 시스템, 접수 데이터를 관리하는 관리자 환경을 하나의 서비스 구조로 구축한 DEVELOP 프로젝트입니다. NINEWORKS는 요구사항 정의와 메뉴 구조, UX/UI, 반응형 프론트엔드, JavaScript 견적 로직, Firebase 데이터 구조, 관리자 워크플로우, GitHub 기반 배포 구조까지 기획·디자인·구축 전반을 통합했습니다.',
  client:'FINE.B / 파인비',
  scope:'Planning · IA · UX/UI · HTML/CSS/JavaScript · Quote Logic · Firebase · Admin · Deployment',
  category:'Develop · Digital System · Branding',
  role:'Service Planning · Design Direction · UX/UI · Front-end · Data Structure · Admin System / NINEWORKS',
  year:'2026',
  liveUrl:'https://finebpkg.com/',
  thumbnail:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/545e2714325da.png',
  develop:{
    version:'FINE.B / BUILD 2026',
    title:'From information architecture to a working production system.',
    stats:[
      {label:'PROJECT TYPE',value:'B2B WEBSITE + WEB APP',copy:'제작사 홈페이지와 업무형 견적 시스템을 하나의 프로젝트로 구축'},
      {label:'FRONT-END',value:'HTML5 · CSS3 · VANILLA JS',copy:'프레임워크 의존도를 낮춘 멀티페이지 정적 프론트엔드와 상태 기반 인터랙션'},
      {label:'DATA LAYER',value:'FIREBASE FIRESTORE · STORAGE',copy:'견적·샘플·문의·포트폴리오·방문자 데이터를 중앙 저장소로 연결'},
      {label:'DELIVERY',value:'GITHUB · MAIN · FINEBPKG.COM',copy:'Git 기반 버전 관리와 커스텀 도메인 운영을 고려한 배포 구조'}
    ],
    planningCopy:'인쇄업의 전문 용어를 그대로 화면에 옮기지 않고 고객의 질문 순서와 내부 상담 절차를 기준으로 요구사항을 재구성했습니다.',
    planning:[
      {no:'01 / REQUIREMENT',title:'Requirement Definition',copy:'회사소개용 사이트가 아니라 실제 견적 전환과 제작 상담을 만드는 업무 도구로 프로젝트 목표를 정의했습니다.'},
      {no:'02 / USER FLOW',title:'Customer Journey',copy:'제작품목 탐색 → 공정 이해 → 가이드 확인 → 샘플 또는 견적 요청으로 이어지는 고객 흐름을 설계했습니다.'},
      {no:'03 / QUOTE LOGIC',title:'Specification Model',copy:'박스 구조, 수량, W/D/H, 종이, 평량, 인쇄, 코팅, 후가공처럼 견적에 필요한 변수를 데이터 항목으로 구조화했습니다.'},
      {no:'04 / OPERATION',title:'Admin Workflow',copy:'견적이 접수된 이후 신규·확인중·진행중·견적완료·완료·보류로 이어지는 내부 처리 단계를 정의했습니다.'},
      {no:'05 / CONTENT IA',title:'Information Architecture',copy:'제작품목과 제작공정, 주문제작 가이드, 포트폴리오와 FAQ를 서로 중복되지 않는 정보 계층으로 재정리했습니다.'},
      {no:'06 / SCALE',title:'Operating Extension',copy:'포트폴리오 CMS, 방문자 집계, 문의 검색과 휴지통처럼 실제 운영 과정에서 필요한 기능까지 확장할 수 있도록 설계했습니다.'}
    ],
    architectureCopy:'브랜드 콘텐츠, 견적 입력, 클라우드 데이터와 관리자 화면을 각각 분리하면서도 하나의 서비스 흐름으로 연결했습니다.',
    architecture:[
      {no:'01 / PUBLIC',title:'Customer Website',copy:'브랜드·제작품목·공정·가이드·포트폴리오를 제공하는 반응형 멀티페이지 웹'},
      {no:'02 / LOGIC',title:'Quote Engine',copy:'JavaScript state와 validation을 이용해 제작 사양을 단계형 UI로 수집하고 요약'},
      {no:'03 / CLOUD',title:'Firebase Data',copy:'quotes · samples · inquiries · portfolio · visits 컬렉션 및 Storage 이미지 연결'},
      {no:'04 / OPS',title:'Admin Console',copy:'문의 상태 관리, 검색, 상세보기, 포트폴리오 관리, 방문자 통계를 위한 운영 화면'}
    ],
    stackCopy:'현재 운영 코드 기준으로 프론트엔드와 Firebase 모듈을 직접 연결하는 구조이며, 별도의 무거운 프레임워크 없이 서비스 기능을 구성했습니다.',
    stack:[
      {no:'01 / MARKUP',title:'HTML5',copy:'Semantic multi-page structure · SEO metadata · form structure'},
      {no:'02 / INTERFACE',title:'CSS3',copy:'Responsive Grid/Flex · desktop/mobile layout · admin UI system'},
      {no:'03 / APPLICATION',title:'Vanilla JavaScript',copy:'DOM rendering · state management · validation · step navigation'},
      {no:'04 / MODULE',title:'ES Modules',copy:'dynamic import · Firebase client separation · admin module composition'},
      {no:'05 / BACKEND',title:'Firebase JS SDK 12.17.1',copy:'Firestore document data · Storage asset upload · serverTimestamp'},
      {no:'06 / VERSION',title:'GitHub',copy:'Public repository · main branch · source/version management'},
      {no:'07 / DATABASE',title:'Cloud Firestore',copy:'quotes · samples · inquiries · portfolio · visits collections'},
      {no:'08 / ASSET',title:'Firebase Storage',copy:'관리자 포트폴리오 이미지 업로드와 URL 반환'},
      {no:'09 / DOMAIN',title:'finebpkg.com',copy:'CNAME 기반 custom domain mapping'}
    ],
    sitemapCopy:'사용자용 콘텐츠 메뉴와 전환 메뉴, 내부 운영 도구를 분리해 각각의 목적이 선명하게 보이도록 구성했습니다.',
    sitemap:[
      {no:'01 / COMPANY & CONTENT',title:'Public Information',items:['HOME / 메인','ABOUT / 회사소개','PRODUCTION / 제작품목','PROCESS / 제작과정','WORKS / 포트폴리오','GUIDE / 주문제작가이드','FAQ / 자주묻는질문']},
      {no:'02 / CONVERSION',title:'Request Flow',items:['SAMPLE / 샘플제작','INQUIRY / 제작문의','QUOTE / 견적내기','5 STEP PRODUCTION SPEC','CONTACT DATA + PRIVACY']},
      {no:'03 / OPERATION',title:'Admin System',items:['ADMIN / 문의관리','QUOTE · SAMPLE · INQUIRY','STATUS WORKFLOW','SEARCH / FILTER','TRASH / RESTORE','PORTFOLIO CMS','VISITOR STATS']}
    ],
    dataFlowCopy:'사용자 입력을 단순 이메일로 끝내지 않고 Firestore 문서로 저장한 뒤 관리자 화면에서 다시 업무 상태로 관리하는 흐름을 구성했습니다.',
    dataFlow:[
      {no:'01',title:'User Selection',copy:'박스·수량·사이즈 선택'},
      {no:'02',title:'JS State',copy:'선택값을 state 객체에 유지'},
      {no:'03',title:'Validation',copy:'필수 사양 단계별 검증'},
      {no:'04',title:'Payload',copy:'spec + contact 데이터 구성'},
      {no:'05',title:'Firestore',copy:'신규 상태로 중앙 저장'},
      {no:'06',title:'Admin Workflow',copy:'검색·상태변경·운영 처리'}
    ],
    codeMapCopy:'코드 자체를 보여주기보다 어떤 로직 단위로 시스템을 나누었는지 드러나도록 핵심 함수와 상태 구조를 정리했습니다.',
    codeMap:[
      {label:'QUOTE STATE',file:'quote-app.js',code:'const state = { step, product, qty, w, d, h, paper, gsm, printMethod, printColor, printSide, coating, finishes, insert };',copy:'견적 화면에서 선택한 제작 조건을 하나의 상태 객체로 유지합니다.'},
      {label:'PUBLIC REQUEST',file:'firebase-client.js',code:"savePublicRequest('quote', payload) → Firestore / quotes / document",copy:'고객 요청을 신규 상태의 Firestore 문서로 저장하고 serverTimestamp를 함께 기록합니다.'},
      {label:'ADMIN READ',file:'admin.js',code:'fetchAdminRequests(type) → renderStats() → renderList() → renderDetail()',copy:'견적·샘플·제작문의 데이터를 불러와 통계, 목록, 상세 화면으로 나눠 렌더링합니다.'},
      {label:'PORTFOLIO CMS',file:'firebase-client.js',code:'uploadPortfolioImage(projectId, file) → Firebase Storage → getDownloadURL()',copy:'관리자에서 추가한 포트폴리오 이미지를 Storage에 올리고 공개 URL을 프로젝트 데이터와 연결합니다.'}
    ],
    deploymentCopy:'코드와 데이터가 한곳에 얽히지 않도록 정적 프론트엔드, Git 버전 관리, Firebase 데이터 계층을 분리했습니다.',
    deployment:[
      {label:'Repository',value:'jyhome1228-cyber/fineb_pkg'},
      {label:'Branch',value:'main'},
      {label:'Frontend',value:'Static HTML / CSS / JavaScript'},
      {label:'Cloud',value:'Firebase Firestore + Firebase Storage'},
      {label:'Domain',value:'finebpkg.com / CNAME'},
      {label:'Data Model',value:'quotes · samples · inquiries · portfolio · visits'},
      {label:'Fallback',value:'LocalStorage temporary request backup'},
      {label:'Operation',value:'Admin status workflow · portfolio CMS · visitor dashboard'}
    ]
  },
  sections:[
    {
      label:'Project Strategy',
      title:'A printing company, rebuilt as a digital production partner.',
      paragraphs:[
        '파인비의 웹사이트는 단순한 회사소개 페이지가 아니라 실제 제작 상담이 시작되는 디지털 접점으로 설계했습니다. 고객이 가장 먼저 궁금해하는 제작 품목, 공정, 종이와 후가공, 샘플 제작, 견적 요청을 중심으로 정보 구조를 다시 정리하고 각 페이지가 자연스럽게 다음 행동으로 이어지도록 구성했습니다.',
        '브랜드 메시지는 ‘패키지 제작 파트너’라는 역할에 집중했습니다. 인쇄소가 가진 기술과 설비를 나열하는 방식보다 구조 상담부터 인쇄, 후가공, 양산과 납품까지 함께 해결하는 제작 파트너의 이미지를 만드는 데 초점을 맞췄습니다.'
      ],
      images:[]
    },
    {
      label:'Website & UX Design',
      title:'제작 정보는 읽기 쉽게, 브랜드는 전문적으로.',
      paragraphs:[
        '패키지 제작은 정보량이 많고 전문 용어가 많기 때문에 화면의 인상보다 정보의 위계가 먼저 작동해야 했습니다. 큰 제목과 명확한 섹션 구분, 얇은 라인과 정돈된 그리드를 중심으로 제작 품목과 공정 정보를 빠르게 비교할 수 있는 인터페이스를 설계했습니다.',
        '데스크톱과 모바일에서 동일한 흐름이 유지되도록 반응형 구조를 구축하고, 회사소개·제작품목·제작과정·포트폴리오·주문제작가이드·샘플제작·FAQ·제작문의·견적내기까지 하나의 디자인 시스템으로 연결했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/56dc949a0f945.png']
    },
    {
      label:'Quote System',
      title:'복잡한 제작 사양을 단계형 견적 흐름으로.',
      paragraphs:[
        '인쇄 견적은 박스 형태, 수량, 완성 사이즈, 종이와 평량, 인쇄 방식, 색상, 인쇄면, 코팅과 후가공 등 여러 조건이 동시에 필요합니다. 이를 한 화면에 모두 노출하지 않고 실제 상담 순서에 맞춰 단계별로 선택하게 하는 견적 시스템을 기획했습니다.',
        '사용자는 박스 구조와 수량·사이즈를 정한 뒤 종이, 인쇄, 후가공을 순서대로 선택하고 마지막 단계에서 담당자 정보를 입력합니다. 선택한 제작 사양은 화면 옆 요약 영역에 계속 누적되어 요청 전에 전체 조건을 다시 확인할 수 있도록 했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/2801bd70f0f58.png']
    },
    {
      label:'Admin & Operation',
      title:'문의가 들어온 뒤의 운영까지 하나의 시스템으로.',
      paragraphs:[
        '프론트 화면에서 끝나지 않고 실제 운영자가 견적문의, 샘플문의, 제작문의를 관리할 수 있는 관리자 구조까지 구축했습니다. 접수된 데이터는 Firestore 중앙 저장소를 기준으로 관리하며 기기나 브라우저가 달라져도 동일한 요청 데이터를 확인할 수 있도록 설계했습니다.',
        '신규·확인중·진행중·견적완료·완료·보류의 상태 흐름, 회사명·담당자·연락처 검색, 요청 상세 확인, 사이트 방문자 TODAY·WEEKLY·MONTHLY 집계와 포트폴리오 관리 기능을 연결해 홈페이지가 실제 영업과 운영 도구로 작동하도록 확장했습니다.'
      ],
      images:[]
    },
    {
      label:'Build & Delivery',
      title:'기획·디자인·개발·배포까지 하나의 프로젝트로.',
      paragraphs:[
        '프로젝트는 요구사항과 브랜드 메시지, 콘텐츠 구조를 정의하는 단계에서 시작해 UX/UI 디자인, HTML·CSS·JavaScript 기반 반응형 프론트엔드, 견적 로직, Firebase 연동, 관리자 화면과 운영 기능을 하나의 흐름으로 진행했습니다.',
        '디자인과 개발을 분리하지 않고 실제 제작사의 상담 방식과 운영 프로세스를 기준으로 화면과 기능을 함께 설계한 것이 핵심입니다. 결과적으로 파인비의 전문성을 보여주는 홈페이지와 고객의 문의를 구체적인 제작 사양으로 전환하는 견적 시스템, 그리고 이를 내부에서 관리하는 운영 환경을 하나의 디지털 시스템으로 구축했습니다.'
      ],
      images:[]
    }
  ]
};

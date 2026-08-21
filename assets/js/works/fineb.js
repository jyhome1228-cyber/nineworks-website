window.NW_WORK={
  id:'fineb',
  title:'FINE.B',
  subtitle:'B2B Packaging Platform & Production Workflow System',
  lead:'웹사이트를 디자인하는 데서 끝내지 않고, 복잡한 인쇄·패키지 제작 상담을 구조화해 실제 견적 데이터와 운영 업무로 연결되는 디지털 생산 시스템을 설계했습니다.',
  summary:'FINE.B 프로젝트는 패키지·인쇄 제작사의 전문성을 온라인에서 설명하는 브랜드 웹사이트와, 복잡한 제작 사양을 단계별로 수집하는 견적 시스템, 소량 샘플 제작 흐름, 접수 데이터를 관리하는 관리자 환경을 하나의 서비스 구조로 구축한 DEVELOP 프로젝트입니다. NINEWORKS는 요구사항 정의와 메뉴 구조, UX/UI, 반응형 프론트엔드, JavaScript 견적 로직, Firebase 데이터 구조, 관리자 워크플로우, 검색 구조와 GitHub 기반 배포까지 기획·디자인·구축 전반을 통합했습니다.',
  client:'FINE.B / 파인비',
  scope:'Planning · IA · UX/UI · HTML/CSS/JavaScript · Quote Logic · Sample Flow · Firebase · Admin · SEO · Deployment',
  category:'Develop · B2B Production System · Branding',
  role:'Service Planning · Design Direction · UX/UI · Front-end · Data Structure · Admin System / NINEWORKS',
  year:'2026',
  liveUrl:'https://finebpkg.com/',
  thumbnail:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/545e2714325da.png',
  develop:{
    version:'FINE.B / BUILD 2026',
    title:'From production knowledge to a working digital system.',
    stats:[
      {label:'PROJECT TYPE',value:'B2B WEBSITE + WEB APP',copy:'제작사 홈페이지와 업무형 견적·샘플 시스템을 하나의 프로젝트로 구축'},
      {label:'CONVERSION',value:'QUOTE · SAMPLE · INQUIRY',copy:'양산·소량 샘플·특수 제작을 서로 다른 상담 흐름으로 분리'},
      {label:'DATA LAYER',value:'FIREBASE FIRESTORE · STORAGE',copy:'견적·샘플·문의·포트폴리오·방문자 데이터를 중앙 저장소로 연결'},
      {label:'DELIVERY',value:'GITHUB · MAIN · FINEBPKG.COM',copy:'Git 기반 버전 관리와 커스텀 도메인 운영을 고려한 배포 구조'}
    ],
    planningCopy:'인쇄업의 전문 용어를 그대로 화면에 옮기지 않고 고객의 질문 순서와 내부 상담 절차, 실제 제작 가능 조건을 기준으로 요구사항을 재구성했습니다.',
    planning:[
      {no:'01 / REQUIREMENT',title:'Requirement Definition',copy:'회사소개용 사이트가 아니라 실제 견적 전환과 제작 상담을 만드는 업무 도구로 프로젝트 목표를 정의했습니다.'},
      {no:'02 / USER FLOW',title:'Three-way Customer Journey',copy:'제작품목·가이드를 확인한 뒤 양산 견적, 소량 샘플, 별도 제작문의 중 상황에 맞는 경로로 분기하도록 고객 흐름을 설계했습니다.'},
      {no:'03 / QUOTE LOGIC',title:'Specification Model',copy:'박스 구조, 수량, W/D/H, 종이, 평량, 인쇄, 코팅, 후가공처럼 견적에 필요한 변수를 데이터 항목으로 구조화했습니다.'},
      {no:'04 / PRODUCTION RULE',title:'Production Rule Mapping',copy:'종이와 평량의 연결, 샘플 가능 수량, 제작 제한처럼 실제 생산 규칙을 화면의 선택 조건과 validation으로 변환했습니다.'},
      {no:'05 / OPERATION',title:'Admin Workflow',copy:'견적이 접수된 이후 신규·확인중·진행중·견적완료·완료·보류로 이어지는 내부 처리 단계를 정의했습니다.'},
      {no:'06 / CONTENT IA',title:'Information Architecture',copy:'제작품목과 제작공정, 주문제작 가이드, 포트폴리오와 FAQ를 서로 중복되지 않는 정보 계층으로 재정리했습니다.'}
    ],
    architectureCopy:'브랜드 콘텐츠, 제작 목적별 전환, 견적 로직, 클라우드 데이터와 관리자 화면을 각각 분리하면서도 하나의 서비스 흐름으로 연결했습니다.',
    architecture:[
      {no:'01 / PUBLIC',title:'Customer Website',copy:'브랜드·제작품목·공정·가이드·포트폴리오를 제공하는 반응형 멀티페이지 웹'},
      {no:'02 / ROUTER',title:'Conversion Router',copy:'고객의 목적을 양산 견적 · 소량 샘플 · 제작문의 세 경로로 분기'},
      {no:'03 / LOGIC',title:'Specification Engine',copy:'JavaScript state와 validation을 이용해 제작 사양을 단계형 UI로 수집하고 요약'},
      {no:'04 / CLOUD',title:'Firebase Data',copy:'quotes · samples · inquiries · portfolio · visits 컬렉션 및 Storage 이미지 연결'},
      {no:'05 / OPS',title:'Admin Console',copy:'문의 상태 관리, 검색, 상세보기, 포트폴리오 관리, 방문자 통계를 위한 운영 화면'}
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
    sitemapCopy:'사용자용 콘텐츠 메뉴와 전환 메뉴, 내부 운영 도구를 분리하고 검색 유입 이후의 다음 행동까지 연결했습니다.',
    sitemap:[
      {no:'01 / COMPANY & CONTENT',title:'Public Information',items:['HOME / 메인','ABOUT / 회사소개','PRODUCTION / 제작품목','PROCESS / 제작과정','WORKS / 포트폴리오','GUIDE / 주문제작가이드','FAQ / 자주묻는질문']},
      {no:'02 / CONVERSION',title:'Three Request Flows',items:['QUOTE / 양산 견적','SAMPLE / 소량 샘플','INQUIRY / 특수 제작문의','5 STEP PRODUCTION SPEC','CONTACT DATA + PRIVACY']},
      {no:'03 / SEARCH',title:'Search Architecture',items:['패키지 제작','박스 인쇄','샘플 인쇄','소량 인쇄','졸업작품 인쇄','PRODUCTION / GUIDE → REQUEST FLOW']},
      {no:'04 / OPERATION',title:'Admin System',items:['ADMIN / 문의관리','QUOTE · SAMPLE · INQUIRY','STATUS WORKFLOW','SEARCH / FILTER','TRASH / RESTORE','PORTFOLIO CMS','VISITOR STATS']}
    ],
    dataFlowCopy:'사용자 입력을 단순 이메일로 끝내지 않고 제작 목적과 사양을 구조화한 Firestore 문서로 저장한 뒤 관리자 화면에서 다시 실제 업무 상태로 관리하는 흐름을 구성했습니다.',
    dataFlow:[
      {no:'01',title:'Intent Routing',copy:'양산 · 샘플 · 제작문의 목적 분기'},
      {no:'02',title:'User Selection',copy:'박스·수량·사이즈·소재·인쇄·후가공 선택'},
      {no:'03',title:'JS State',copy:'선택값을 state 객체에 유지'},
      {no:'04',title:'Validation',copy:'필수 사양과 제작 규칙 단계별 검증'},
      {no:'05',title:'Payload',copy:'spec + contact 데이터 구성'},
      {no:'06',title:'Firestore',copy:'유형별 컬렉션에 신규 상태로 중앙 저장'},
      {no:'07',title:'Admin Workflow',copy:'검색·상태변경·운영 처리'}
    ],
    codeMapCopy:'코드 자체를 보여주기보다 어떤 로직 단위로 시스템을 나누었는지 드러나도록 핵심 함수와 상태 구조를 정리했습니다.',
    codeMap:[
      {label:'QUOTE STATE',file:'quote-app.js',code:'const state = { step, product, qty, w, d, h, paper, gsm, printMethod, printColor, printSide, coating, finishes, insert };',copy:'견적 화면에서 선택한 제작 조건을 하나의 상태 객체로 유지합니다.'},
      {label:'PAPER RULE',file:'quote-app.js',code:'paper selected → available gsm filter → summary update',copy:'선택한 종이에 맞는 평량만 활성화해 실제 제작 규칙과 입력 UI를 연결합니다.'},
      {label:'PUBLIC REQUEST',file:'firebase-client.js',code:"savePublicRequest(type, payload) → Firestore / collection / document",copy:'견적·샘플·제작문의를 각각의 유형과 제작 사양을 가진 Firestore 문서로 저장합니다.'},
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
      label:'The Challenge',
      title:'Complex production specifications, unclear online inquiries.',
      paragraphs:[
        '패키지 제작 문의는 제품명과 수량만으로 견적을 산출하기 어렵습니다. 박스 구조, 완성 사이즈, 종이, 평량, 인쇄 방식, 색상, 인쇄면, 코팅과 후가공처럼 여러 제작 조건이 함께 확인되어야 하지만 기존의 일반 문의폼에서는 이 정보가 누락되거나 상담 과정에서 다시 확인해야 하는 일이 반복됩니다.',
        '그래서 파인비에서는 단순히 문의를 받는 화면이 아니라 고객의 제작 조건을 실제 상담 순서에 맞춰 구조화하고, 사용자가 잘 모르는 항목은 가이드와 제작품목 콘텐츠에서 먼저 이해한 뒤 적합한 요청 방식으로 이동할 수 있는 디지털 상담 구조가 필요했습니다.'
      ],
      images:[]
    },
    {
      label:'Service Architecture',
      title:'One website, three production journeys.',
      paragraphs:[
        '모든 고객을 하나의 문의폼으로 보내지 않았습니다. 실제 제작 목적에 따라 양산을 준비하는 고객은 QUOTE, 결과물을 먼저 확인하려는 고객은 SAMPLE, 싸바리·특수구조·복합 패키지처럼 표준 흐름으로 정의하기 어려운 프로젝트는 INQUIRY로 분기했습니다.',
        'PRODUCTION과 GUIDE는 단순 정보 페이지가 아니라 세 가지 전환 경로 앞에 놓인 판단 도구로 설계했습니다. 사용자가 제작 방식과 용어를 이해한 뒤 자신의 상황에 맞는 경로를 선택하도록 만들어 문의의 양보다 상담에 필요한 정보의 질을 높이는 데 초점을 맞췄습니다.'
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
      title:'복잡한 제작 사양을 5단계 견적 흐름으로.',
      paragraphs:[
        '인쇄 견적은 박스 형태, 수량, 완성 사이즈, 종이와 평량, 인쇄 방식, 색상, 인쇄면, 코팅과 후가공 등 여러 조건이 동시에 필요합니다. 이를 한 화면에 모두 노출하지 않고 BOX TYPE → PAPER → PRINT → FINISHING → REQUEST의 5단계로 나눠 실제 상담 순서와 같은 흐름으로 선택하게 했습니다.',
        '사용자가 선택한 제작 사양은 화면 옆 요약 영역에 계속 누적되어 요청 전에 전체 조건을 다시 확인할 수 있습니다. 사이트가 임의의 확정 가격을 계산하는 대신 충분한 제작 조건을 구조화해 담당자가 실제 생산 가능 여부와 최종 견적을 검토할 수 있도록 설계했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/2801bd70f0f58.png']
    },
    {
      label:'Production Logic',
      title:'실제 제작 규칙을 인터페이스의 선택 조건으로.',
      paragraphs:[
        '견적 UI의 핵심은 입력칸의 수가 아니라 실제 제작 조건과 화면 로직이 연결되는 데 있습니다. 종이를 선택하면 해당 지종에서 사용할 수 있는 평량만 보여주고, 수량과 W/D/H는 숫자 기준으로 검증하며, 인쇄와 후가공은 제작 사양 데이터로 누적되도록 구성했습니다.',
        '소량 제작에서 허용되는 수량이나 일반 샘플 프로세스로 처리하기 어려운 구조처럼 생산 현장에서 발생하는 제한도 화면 규칙으로 반영했습니다. 복잡한 제작을 무리하게 자동 가격화하기보다 표준화할 수 있는 정보는 시스템으로 정리하고, 예외가 필요한 항목은 상담으로 넘기는 구조를 선택했습니다.'
      ],
      images:[]
    },
    {
      label:'Sample System',
      title:'From one-off samples to mass production.',
      paragraphs:[
        '양산 전에 실제 구조와 출력 결과를 확인하려는 디자이너와 브랜드를 위해 견적 시스템과 별도로 소량 샘플 제작 흐름을 구성했습니다. 종이박스·골판지박스·쇼핑백 등 샘플 제작에 적합한 범위를 먼저 선택하고 1·2·3·5·10·20개처럼 실제 운영 가능한 수량을 선택하도록 제한했습니다.',
        '양산 견적과 동일한 종이·평량 데이터를 공유하면서도 샘플에 맞는 인쇄 방식과 후가공 범위만 보여주도록 구성해 두 시스템의 기준은 공유하고 목적은 분리했습니다. 표준 샘플 흐름으로 처리하기 어려운 싸바리나 특수 제작은 별도 제작문의로 자연스럽게 전환됩니다.'
      ],
      images:[]
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
      label:'Search Architecture',
      title:'Search intent, content and conversion in one flow.',
      paragraphs:[
        '검색을 단순 유입 채널로 보지 않고 패키지 제작, 박스 인쇄, 샘플 인쇄, 소량 인쇄, 졸업작품 인쇄처럼 사용자가 실제로 찾는 목적과 사이트 콘텐츠를 연결했습니다. 제작품목과 가이드는 검색 키워드를 나열하는 페이지가 아니라 해당 제작을 고민하는 고객에게 필요한 구조·소재·공정 정보를 설명하는 랜딩 역할을 합니다.',
        '검색으로 들어온 사용자가 정보를 읽고 끝나는 것이 아니라 PRODUCTION 또는 GUIDE에서 제작 조건을 이해한 뒤 QUOTE, SAMPLE, INQUIRY 중 적합한 요청 경로로 이동하도록 정보 구조와 전환 구조를 함께 설계했습니다.'
      ],
      images:[]
    },
    {
      label:'Build & Delivery',
      title:'기획·디자인·개발·배포까지 하나의 프로젝트로.',
      paragraphs:[
        '프로젝트는 요구사항과 브랜드 메시지, 콘텐츠 구조를 정의하는 단계에서 시작해 UX/UI 디자인, HTML·CSS·JavaScript 기반 반응형 프론트엔드, 견적·샘플 로직, Firebase 연동, 관리자 화면과 운영 기능을 하나의 흐름으로 진행했습니다.',
        '디자인과 개발을 분리하지 않고 실제 제작사의 상담 방식과 생산 규칙을 기준으로 화면과 기능을 함께 설계한 것이 핵심입니다. 결과적으로 파인비의 전문성을 보여주는 홈페이지와 고객의 문의를 구체적인 제작 사양으로 전환하는 시스템, 그리고 이를 내부에서 관리하는 운영 환경을 하나의 디지털 생산 시스템으로 구축했습니다.'
      ],
      images:[]
    }
  ]
};
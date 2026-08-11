window.NW_WORK={
  id:'relim',
  title:'RE:LIM',
  subtitle:'Outdoor Leisure Website, FAQ Knowledge System & Admin Platform',
  lead:'공간을 소개하는 홈페이지를 넘어, 실제 고객 문의 데이터와 예약·리뷰·Q&A·관리자 운영까지 연결하는 디지털 서비스 구조를 구축했습니다.',
  summary:'RE:LIM 프로젝트는 용인 프라이빗 아웃도어 공간의 브랜드 웹사이트를 GitHub 기반의 커스텀 코드로 재구축하고, 고객이 예약 전에 필요한 정보를 스스로 찾을 수 있는 FAQ 검색 시스템과 회원·리뷰·문의·관리자 운영 기능을 함께 설계한 DEVELOP 프로젝트입니다. 기존 인스타그램 DM JSON 약 2,000건을 분석해 반복 질문과 표현을 카테고리·검색 키워드·답변 구조로 정리했으며, Firebase Auth와 Firestore를 이용해 회원, 리뷰, 문의와 관리자 답변, 방문자 통계를 실제 운영 데이터로 연결했습니다. 캠핏 예약, 네이버 지도·검색 노출, Google Analytics와 기본 SEO까지 함께 정리해 브랜드 소개와 고객 응대, 예약 전환, 운영 관리가 하나의 웹 환경 안에서 이어지도록 구축했습니다.',
  client:'RE:LIM / 리림',
  scope:'Service Planning · IA · UX/UI · GitHub Pages · HTML/CSS/JavaScript · FAQ Data · Firebase Auth/Firestore · Community · Admin · SEO',
  category:'Develop · Digital System · Branding',
  role:'Planning · UX/UI · Front-end · Knowledge Architecture · Firebase Integration · Admin System · SEO / NINEWORKS',
  year:'2026',
  liveUrl:'https://re-lim.com/',
  thumbnail:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/fb1c70c96e690.png',
  develop:{
    version:'RE:LIM / BUILD 2026',
    title:'From customer questions to a working digital service system.',
    stats:[
      {label:'PROJECT TYPE',value:'BRAND WEBSITE + COMMUNITY',copy:'공간 안내, 예약 전환, FAQ, 리뷰와 문의 기능을 하나의 사용자 경험으로 구축'},
      {label:'KNOWLEDGE BASE',value:'~2,000 INSTAGRAM DMs',copy:'실제 고객 DM JSON에서 반복 질문과 유사 표현을 추출해 검색형 FAQ 데이터로 구조화'},
      {label:'DATA LAYER',value:'FIREBASE AUTH · FIRESTORE',copy:'회원, 리뷰, 문의, 관리자 답변과 방문자 통계를 실시간 운영 데이터로 연결'},
      {label:'DELIVERY',value:'GITHUB PAGES · RE-LIM.COM',copy:'Git 기반 소스 관리, 커스텀 도메인, GA4와 검색엔진 노출을 고려한 배포 구조'}
    ],
    planningCopy:'공간의 이미지와 감성만 보여주는 사이트보다 고객이 방문 전에 실제로 궁금해하는 정보와 예약 흐름을 먼저 구조화했습니다.',
    planning:[
      {no:'01 / REQUIREMENT',title:'Service Requirement',copy:'브랜드 소개, 이용 정보, 예약 전환과 고객 응대를 각각 분리하지 않고 하나의 서비스 흐름으로 정의했습니다.'},
      {no:'02 / USER FLOW',title:'Reservation Journey',copy:'공간 이해 → 이용 안내 → FAQ 검색 → 예약 확인 → 리뷰·문의로 이어지는 고객 행동 흐름을 설계했습니다.'},
      {no:'03 / DM ANALYSIS',title:'Customer Question Audit',copy:'인스타그램 DM JSON 약 2,000건에서 반복 질문, 표현 차이와 실제 문의 언어를 분석해 FAQ 구조의 기준으로 활용했습니다.'},
      {no:'04 / CONTENT IA',title:'Information Architecture',copy:'공간 소개, 시설, 갤러리, 이용 안내, 예약, 위치, FAQ를 중복 없이 목적별 정보 계층으로 재정리했습니다.'},
      {no:'05 / COMMUNITY',title:'Member & Community Flow',copy:'로그인 후 리뷰 작성과 문의 등록, 내 글 확인, 관리자 답변까지 이어지는 커뮤니티 흐름을 설계했습니다.'},
      {no:'06 / OPERATION',title:'Admin & Search Operation',copy:'방문자·회원·문의·리뷰를 관리자에서 확인하고 검색 노출과 운영 데이터를 지속 관리할 수 있도록 범위를 확장했습니다.'}
    ],
    architectureCopy:'정적 브랜드 콘텐츠와 검색형 FAQ, Firebase 기반 커뮤니티, 외부 예약 서비스를 서로 분리하면서도 사용자의 이동 흐름 안에서는 하나의 서비스처럼 연결했습니다.',
    architecture:[
      {no:'01 / PUBLIC',title:'Brand Website',copy:'공간 소개, 시설, 갤러리, 이용 안내, 예약·위치 정보가 연결되는 반응형 멀티페이지 웹'},
      {no:'02 / KNOWLEDGE',title:'FAQ Search System',copy:'카테고리, 질문·답변, 유사 표현 키워드를 이용한 고객 셀프서비스 검색 UI'},
      {no:'03 / COMMUNITY',title:'Firebase Community',copy:'Auth 기반 회원과 Firestore 리뷰·문의·답변 데이터를 실시간으로 연결'},
      {no:'04 / OPS',title:'Admin Dashboard',copy:'방문자, 가입자, 문의, 답변대기, 리뷰를 한 화면에서 확인하는 운영 관리자 환경'}
    ],
    stackCopy:'프론트엔드는 별도 프레임워크 없이 HTML·CSS·Vanilla JavaScript로 구성하고, 계정과 커뮤니티 데이터만 Firebase 모듈로 분리해 운영성과 수정 편의성을 확보했습니다.',
    stack:[
      {no:'01 / HOSTING',title:'GitHub Pages',copy:'Static deployment · source/version management · custom domain'},
      {no:'02 / MARKUP',title:'HTML5',copy:'Semantic multi-page structure · accessible navigation · SEO content'},
      {no:'03 / INTERFACE',title:'CSS3',copy:'Responsive layout · gallery · community · admin design system'},
      {no:'04 / APPLICATION',title:'Vanilla JavaScript',copy:'FAQ search · UI states · gallery · modal · page interaction'},
      {no:'05 / AUTH',title:'Firebase Authentication',copy:'회원 로그인 · 사용자 상태 · 관리자 접근 제어'},
      {no:'06 / DATABASE',title:'Cloud Firestore',copy:'users · reviews · questions · trafficDays · trafficSummary'},
      {no:'07 / REALTIME',title:'Firestore onSnapshot',copy:'리뷰·문의·회원·관리자 데이터를 실시간 화면에 반영'},
      {no:'08 / ANALYTICS',title:'Google Analytics 4',copy:'GA4 page analytics와 자체 방문자 집계 병행'},
      {no:'09 / SEO',title:'Google · Naver SEO',copy:'canonical · OG · JSON-LD · sitemap · robots · Naver verification'}
    ],
    sitemapCopy:'브랜드 소개 메뉴와 예약 전환 정보, 커뮤니티·운영 기능을 목적별로 분리해 고객과 관리자가 필요한 정보에 빠르게 접근하도록 구성했습니다.',
    sitemap:[
      {no:'01 / BRAND & GUIDE',title:'Public Information',items:['HOME / 메인','ABOUT / 리림 소개','SPACE / 공간 안내','GALLERY / 갤러리','GUIDE / 이용 안내','LOCATION / 오시는 길']},
      {no:'02 / CONVERSION & SUPPORT',title:'Reservation Support',items:['RESERVATION / 예약 안내','CAMFIT / 외부 예약 연동','FAQ / 검색형 도움말','NAVER MAP / 위치 연결','INSTAGRAM DM / 빠른 문의']},
      {no:'03 / COMMUNITY & OPS',title:'Community System',items:['LOGIN / 회원','REVIEWS / 사진·별점 리뷰','INQUIRY / 비공개 문의','MYPAGE / 내 글','ADMIN / 문의·회원·리뷰','TRAFFIC / 방문자 통계']}
    ],
    dataFlowCopy:'고객 문의 데이터를 단순히 게시판에 쌓는 방식이 아니라 과거 DM 분석부터 FAQ 셀프서비스, 필요 시 회원 문의와 관리자 답변으로 이어지는 고객지원 흐름으로 설계했습니다.',
    dataFlow:[
      {no:'01',title:'DM JSON',copy:'약 2,000건 고객 대화'},
      {no:'02',title:'Topic Analysis',copy:'반복 질문·표현 분류'},
      {no:'03',title:'FAQ Dataset',copy:'카테고리·키워드 구조화'},
      {no:'04',title:'Search UI',copy:'질문·답변·유사어 검색'},
      {no:'05',title:'Inquiry',copy:'추가 문의 Firestore 저장'},
      {no:'06',title:'Admin Reply',copy:'관리자 확인·답변 연결'}
    ],
    codeMapCopy:'콘텐츠, 고객지원, 커뮤니티와 관리자 기능을 역할별 코드로 나누고 정적 화면과 클라우드 데이터가 필요한 지점만 연결했습니다.',
    codeMap:[
      {label:'FAQ DATA',file:'faq-data.js',code:'categories + questions + answers + keyword aliases → searchable FAQ UI',copy:'DM 분석 결과를 질문·답변뿐 아니라 고객이 실제 사용하는 유사 표현까지 포함한 검색 데이터로 정리했습니다.'},
      {label:'REVIEW COMMUNITY',file:'reviews.js',code:'Firebase Auth → Firestore reviews → realtime grid / create / edit / delete',copy:'로그인 사용자가 사진과 별점 리뷰를 작성하고 본인 글을 수정·삭제할 수 있도록 구성했습니다.'},
      {label:'PRIVATE INQUIRY',file:'questions.js / admin.js',code:'question metadata + private body → admin reply → status update',copy:'문의 제목과 상태는 게시판에서 확인하고 본문과 관리자 답변은 작성자와 관리자만 접근하도록 분리했습니다.'},
      {label:'TRAFFIC DASHBOARD',file:'admin-traffic.js',code:'trafficDays + trafficSummary → TODAY / LAST 7 DAYS / TOTAL',copy:'브라우저 중복 방문을 제외한 방문자 집계를 관리자 대시보드에서 일·주·누적 기준으로 확인하도록 연결했습니다.'}
    ],
    deploymentCopy:'사이트 운영 도메인과 GitHub 소스, Firebase 데이터, 외부 예약 채널과 검색엔진 설정을 역할별로 분리해 향후 콘텐츠 수정과 기능 확장이 가능한 구조로 배포했습니다.',
    deployment:[
      {label:'Repository',value:'jyhome1228-cyber/relim_site'},
      {label:'Branch',value:'main'},
      {label:'Frontend',value:'Static HTML / CSS / Vanilla JavaScript'},
      {label:'Hosting',value:'GitHub Pages'},
      {label:'Cloud',value:'Firebase Authentication + Cloud Firestore'},
      {label:'Analytics',value:'Google Analytics 4 + custom visitor counters'},
      {label:'Reservation',value:'CAMFIT external booking integration'},
      {label:'Domain',value:'re-lim.com / CNAME'},
      {label:'Search',value:'Google · Naver · canonical · OG · JSON-LD · sitemap · robots'}
    ]
  },
  sections:[
    {
      label:'Project Strategy',
      title:'브랜드 사이트를 고객지원과 예약 전환의 시작점으로.',
      paragraphs:[
        '리림은 수영장, 수로, 개별 쉘터와 바비큐를 오전·오후 타임제로 이용하는 공간이기 때문에 일반적인 숙박형 공간 사이트와 다른 정보 구조가 필요했습니다. 공간의 분위기를 보여주는 브랜드 경험과 함께 이용시간, 인원, 준비물, 숙박 옵션과 예약 조건을 방문 전에 빠르게 이해하도록 전체 페이지를 재구성했습니다.',
        '홈페이지를 단순 안내 채널로 끝내지 않고 예약 안내, FAQ, 리뷰, 문의와 관리자 운영까지 연결해 고객이 정보를 찾고 예약하고 질문하고 경험을 남기는 전체 흐름을 하나의 디지털 서비스로 설계했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/f0df2f7752a21.png']
    },
    {
      label:'Website & UX Design',
      title:'공간의 분위기와 실제 이용 정보를 같은 화면 언어로 정리했습니다.',
      paragraphs:[
        '메인, 리림 소개, 공간 안내, 갤러리, 이용 안내, 예약 안내, 오시는 길과 FAQ를 각각 독립된 페이지로 구성하고 데스크톱과 모바일에서 동일한 정보 우선순위가 유지되도록 반응형 화면을 구축했습니다.',
        '이미지 중심의 공간 브랜드 경험과 실제 예약에 필요한 텍스트 정보가 충돌하지 않도록 큰 이미지, 짧은 핵심 문장, 명확한 CTA와 반복되는 섹션 규칙을 사용했습니다. 캠핏 예약과 네이버 지도 같은 외부 서비스도 사이트 흐름 안에서 자연스럽게 이어지도록 연결했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/e6cff8048711b.png','https://cdn.imweb.me/upload/S20260219b829e728b3f2e/1e5e60f6ef019.png']
    },
    {
      label:'FAQ & Customer Knowledge',
      title:'약 2,000건의 실제 DM을 검색 가능한 고객지원 데이터로 바꿨습니다.',
      paragraphs:[
        '기존 인스타그램 DM JSON 약 2,000건을 분석해 예약, 운영시간, 요금·인원, 숙박, 음식, 수영장·시설, 준비물, 변경·환불, 위치처럼 반복되는 질문을 분류했습니다. 질문 문장만 정리한 것이 아니라 고객이 실제로 사용하는 “숙박만”, “아기 무료”, “당일 예약” 같은 유사 표현을 검색 키워드로 함께 설계했습니다.',
        'FAQ는 카테고리 탐색과 실시간 검색을 함께 제공하고 질문·답변·유사 키워드를 동시에 검색합니다. 검색으로 해결되지 않는 질문은 회원 문의로 이어지게 해 반복 문의는 셀프서비스로 줄이고 실제 상담이 필요한 내용은 관리자 업무로 연결했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/f815616ee40cf.png','https://cdn.imweb.me/upload/S20260219b829e728b3f2e/ddd149298626c.png']
    },
    {
      label:'Community & Admin',
      title:'리뷰와 문의가 실제 운영 데이터로 이어지도록 구축했습니다.',
      paragraphs:[
        'Firebase Authentication과 Firestore를 연결해 로그인 회원이 사진·별점 리뷰를 등록하고, 비공개 문의를 남기며 본인이 작성한 글을 확인할 수 있도록 구성했습니다. 문의 본문은 작성자와 관리자만 열람하고 관리자 답변과 처리 상태가 다시 사용자 화면에 반영되도록 데이터 구조를 분리했습니다.',
        '관리자 화면에서는 방문자 TODAY·LAST 7 DAYS·TOTAL, 가입자, 전체 문의와 답변대기, 리뷰를 한 번에 확인합니다. 문의 상세 열람과 답변 저장까지 관리자 대시보드 안에서 처리할 수 있도록 만들어 사이트 운영과 고객 응대를 하나의 업무 화면으로 연결했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/8368e077d2c73.png','https://cdn.imweb.me/upload/S20260219b829e728b3f2e/00eacdd896da4.png']
    },
    {
      label:'Build, Reservation & SEO',
      title:'GitHub 배포부터 예약 연동과 검색 노출까지 운영 환경을 완성했습니다.',
      paragraphs:[
        '프론트엔드는 GitHub Pages 기반 HTML·CSS·Vanilla JavaScript로 구축하고, 커뮤니티와 관리자 데이터만 Firebase Auth·Firestore로 연결했습니다. 예약은 캠핏으로 연동하고 위치는 네이버 지도와 연결해 사이트가 정보 제공 이후 실제 행동으로 이어지도록 구성했습니다.',
        'Google Analytics 4와 자체 방문자 집계를 함께 적용하고 페이지별 title, description, canonical, Open Graph, JSON-LD, sitemap, robots와 네이버 사이트 인증을 정리했습니다. 디자인과 기능 개발뿐 아니라 배포 후 검색 노출과 운영까지 하나의 구축 범위로 다룬 프로젝트입니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/fb1c70c96e690.png']
    }
  ]
};
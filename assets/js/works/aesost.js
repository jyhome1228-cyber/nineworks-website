window.NW_WORK={
  id:'aesost',
  title:'AESOST',
  subtitle:'Community Platform, Member Publishing & Personal Spec Profiles',
  lead:'가입자가 콘텐츠를 읽는 데서 끝나지 않고 직접 게시글을 작성하고, 마이페이지와 개인 스펙 페이지를 관리하며, 매거진 콘텐츠까지 탐색할 수 있는 커뮤니티 플랫폼형 웹사이트를 구축했습니다.',
  summary:'AESOST 프로젝트는 일반 기업 홈페이지가 아니라 회원의 활동과 콘텐츠가 서비스의 중심이 되는 커뮤니티 플랫폼 구축 사례입니다. 가입·로그인 이후 사용자가 게시글을 작성하고 자신의 콘텐츠를 마이페이지에서 관리하며, 개인별 상세 페이지에서는 프로필과 스펙 정보를 체계적으로 보여줄 수 있도록 사용자 흐름과 정보 구조를 설계했습니다. 커뮤니티 게시물과 개인 페이지, 매거진 콘텐츠를 서로 분리하면서도 하나의 탐색 경험 안에서 연결해 회원 활동, 정보 축적, 콘텐츠 소비가 반복되는 플랫폼 구조로 구현했습니다.',
  client:'AESOST / 에이소스트',
  scope:'Platform Planning · IA · UX/UI · Community · Member Flow · Post Publishing · My Page · Personal Spec Profile · Magazine',
  category:'Develop · Community Platform · Member System',
  role:'Planning · Information Architecture · UX/UI · Community System Design · Front-end / NINEWORKS',
  year:'2026',
  liveUrl:'https://aesost.com/index.html',
  thumbnail:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/28a06e82e7fbb.png',
  develop:{
    version:'AESOST / BUILD 2026',
    title:'From browsing content to building a member-driven community platform.',
    stats:[
      {label:'PROJECT TYPE',value:'COMMUNITY WEB PLATFORM',copy:'콘텐츠 열람 중심의 사이트가 아니라 회원 활동과 정보 축적이 반복되는 플랫폼으로 설계'},
      {label:'MEMBER FLOW',value:'JOIN · WRITE · MY PAGE',copy:'가입 이후 게시글 작성, 본인 콘텐츠 관리와 개인 페이지로 이어지는 회원 경험 구축'},
      {label:'PROFILE SYSTEM',value:'PERSONAL SPEC PAGES',copy:'회원별 프로필과 스펙 정보를 독립된 상세 페이지에서 구조적으로 관리·표현'},
      {label:'CONTENT SYSTEM',value:'COMMUNITY · MAGAZINE',copy:'회원 게시물과 편집형 매거진을 서로 다른 콘텐츠 경험으로 구성하면서 하나의 탐색 구조로 연결'}
    ],
    planningCopy:'화면을 먼저 나누기보다 비회원의 탐색, 회원 가입, 게시글 작성, 마이페이지 관리와 개인 스펙 페이지 확인까지 전체 사용자 여정을 먼저 정의했습니다.',
    planning:[
      {no:'01 / PLATFORM',title:'Community Definition',copy:'브랜드 소개보다 사용자 활동과 콘텐츠가 지속적으로 쌓이는 커뮤니티 플랫폼을 프로젝트의 중심으로 정의했습니다.'},
      {no:'02 / USER FLOW',title:'Member Journey',copy:'탐색 → 가입 → 게시글 작성 → 마이페이지 관리 → 개인 페이지 확인으로 이어지는 회원 흐름을 설계했습니다.'},
      {no:'03 / CONTENT',title:'Content Model',copy:'회원 게시글, 사용자 프로필, 스펙 정보와 매거진을 서로 다른 콘텐츠 타입으로 구분했습니다.'},
      {no:'04 / PROFILE',title:'Spec Profile Model',copy:'개인별 상세 페이지에서 소개와 스펙 정보를 일정한 구조로 보여주고 수정 가능한 정보 체계로 정리했습니다.'},
      {no:'05 / EDITORIAL',title:'Magazine Structure',copy:'커뮤니티 게시물과 별도로 읽는 경험에 집중한 매거진 영역을 구성해 플랫폼 콘텐츠의 깊이를 확장했습니다.'},
      {no:'06 / RETENTION',title:'My Page Operation',copy:'사용자가 자신이 작성한 글과 프로필 정보를 다시 확인하고 수정할 수 있도록 재방문 동선을 설계했습니다.'}
    ],
    architectureCopy:'공개 콘텐츠 탐색, 회원 계정, 게시물 작성, 개인 프로필과 매거진을 기능별로 분리하면서도 사용자의 이동에서는 하나의 서비스처럼 이어지도록 구성했습니다.',
    architecture:[
      {no:'01 / DISCOVER',title:'Public Discovery',copy:'메인·커뮤니티·매거진에서 비회원도 콘텐츠와 플랫폼 성격을 탐색'},
      {no:'02 / MEMBER',title:'Member Account',copy:'가입과 로그인 이후 작성·관리 기능에 접근하는 회원 상태'},
      {no:'03 / PUBLISH',title:'Publishing Layer',copy:'회원 게시글 작성과 상세 보기, 본인 콘텐츠 관리 흐름'},
      {no:'04 / PROFILE',title:'Profile & Magazine',copy:'개인 스펙 페이지와 편집형 매거진 콘텐츠를 독립 경험으로 연결'}
    ],
    stackCopy:'특정 기술 이름을 앞세우기보다 회원 상태, 게시물 생명주기, 프로필 데이터와 매거진 콘텐츠가 안정적으로 연결되도록 기능 단위의 웹 구조를 설계했습니다.',
    stack:[
      {no:'01 / FRONTEND',title:'Responsive Web UI',copy:'Desktop · tablet · mobile에서 동일한 콘텐츠 위계와 회원 동선 유지'},
      {no:'02 / ACCOUNT',title:'Member Authentication',copy:'가입 · 로그인 · 회원 상태에 따른 기능 접근 구조'},
      {no:'03 / PUBLISHING',title:'Post CRUD',copy:'회원 게시글 작성 · 상세 보기 · 수정 · 관리 흐름'},
      {no:'04 / MY PAGE',title:'Member Dashboard',copy:'내 게시글과 프로필 정보를 한곳에서 확인·관리'},
      {no:'05 / PROFILE',title:'Spec Data Model',copy:'개인별 소개 · 이력 · 스펙 정보를 일관된 구조로 표현'},
      {no:'06 / MAGAZINE',title:'Editorial Content',copy:'커뮤니티와 구분된 읽기 중심의 매거진 아티클 경험'},
      {no:'07 / ROUTING',title:'Content Routing',copy:'피드 → 게시글 → 회원 페이지 → 관련 콘텐츠로 이어지는 이동 구조'},
      {no:'08 / MEDIA',title:'Content Media',copy:'이미지와 텍스트를 게시물·프로필·매거진 목적에 맞게 배치'},
      {no:'09 / DOMAIN',title:'aesost.com',copy:'Production domain · live community platform'}
    ],
    sitemapCopy:'방문자용 탐색 메뉴, 회원 활동 기능, 개인 프로필과 편집형 콘텐츠를 목적별로 분리해 커뮤니티의 성장과 사용 편의성을 함께 고려했습니다.',
    sitemap:[
      {no:'01 / DISCOVERY',title:'Public Content',items:['HOME / 메인','COMMUNITY / 게시글 탐색','MAGAZINE / 매거진','MEMBER PROFILE / 사용자 페이지']},
      {no:'02 / MEMBER',title:'Member Actions',items:['JOIN / 회원가입','LOGIN / 로그인','WRITE / 게시글 작성','MY PAGE / 내 콘텐츠 관리','EDIT PROFILE / 프로필·스펙 수정']},
      {no:'03 / DETAIL',title:'Content Detail',items:['POST DETAIL / 게시글 상세','PERSONAL SPEC / 개인 스펙 페이지','MAGAZINE ARTICLE / 아티클','MY POSTS / 작성글 관리','PROFILE NAVIGATION / 회원 간 탐색']}
    ],
    dataFlowCopy:'회원이 가입한 뒤 한 번의 활동으로 끝나지 않고 콘텐츠를 만들고, 자신의 기록을 관리하고, 개인 페이지를 갱신하면서 다시 커뮤니티 탐색으로 돌아오는 반복 구조를 설계했습니다.',
    dataFlow:[
      {no:'01',title:'Join',copy:'회원 가입·로그인'},
      {no:'02',title:'Member Profile',copy:'프로필 기본 정보 생성'},
      {no:'03',title:'Write Post',copy:'커뮤니티 콘텐츠 작성'},
      {no:'04',title:'Community Feed',copy:'게시글 노출·상세 탐색'},
      {no:'05',title:'My Page',copy:'내 글·정보 관리'},
      {no:'06',title:'Spec Profile',copy:'개인 페이지 갱신·공개'}
    ],
    codeMapCopy:'화면 단위가 아니라 회원 상태, 콘텐츠 작성, 마이페이지와 개인 프로필처럼 실제 사용자 행동을 기준으로 기능 모듈을 분리해 확장 가능한 플랫폼 구조로 정리했습니다.',
    codeMap:[
      {label:'MEMBER FLOW',file:'Account Module',code:'join / login → member state → gated publishing actions',copy:'로그인 상태에 따라 게시글 작성과 마이페이지 기능이 자연스럽게 활성화되도록 회원 흐름을 구성했습니다.'},
      {label:'POST PUBLISHING',file:'Community Module',code:'create post → feed → detail → edit / manage',copy:'사용자 작성 콘텐츠가 커뮤니티 목록과 상세 페이지, 본인 관리 화면으로 이어지는 생명주기를 설계했습니다.'},
      {label:'MY PAGE',file:'Member Dashboard',code:'my posts + profile data + management actions',copy:'회원이 본인의 활동과 정보를 한 화면에서 다시 확인하고 관리할 수 있도록 구성했습니다.'},
      {label:'PROFILE & MAGAZINE',file:'Content Modules',code:'personal spec profile + editorial magazine → connected discovery',copy:'개인 스펙 페이지와 매거진을 커뮤니티와 구분하면서도 플랫폼 내부 탐색으로 자연스럽게 연결했습니다.'}
    ],
    deploymentCopy:'회원·게시물·프로필·매거진의 기능 범위를 분리해 향후 콘텐츠 증가와 회원 활동 확장에도 대응할 수 있도록 운영 구조를 구성하고 실제 도메인에서 서비스하도록 연결했습니다.',
    deployment:[
      {label:'Live Domain',value:'aesost.com'},
      {label:'Platform',value:'Member-driven Community Web Platform'},
      {label:'Frontend',value:'Responsive Community Interface'},
      {label:'Account',value:'Member Join · Login · Session Flow'},
      {label:'Publishing',value:'Member Posts · Detail · Edit · Management'},
      {label:'Profile',value:'Personal Spec Pages · Member Information'},
      {label:'Content',value:'Community Posts · Magazine Articles'},
      {label:'Operation',value:'My Page · Profile Update · Content Lifecycle'}
    ]
  },
  sections:[
    {
      label:'Platform Strategy',
      title:'읽는 사이트가 아니라 회원이 활동하는 플랫폼으로.',
      paragraphs:[
        'AESOST는 콘텐츠를 보여주는 일반적인 웹사이트보다 가입자의 활동이 서비스의 중심이 되는 커뮤니티 플랫폼으로 기획했습니다. 방문자는 커뮤니티와 매거진을 탐색하고, 회원은 직접 게시글을 작성하며 자신의 활동을 지속적으로 축적할 수 있도록 사용자 역할을 나눴습니다.',
        '페이지 수를 늘리는 방식보다 회원 상태와 콘텐츠의 관계를 먼저 정의해 공개 탐색, 회원 작성, 본인 관리, 개인 페이지와 매거진이 서로 자연스럽게 연결되는 정보 구조를 설계했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/bc4d13adca9b5.png']
    },
    {
      label:'Community Experience',
      title:'게시글 탐색과 작성이 하나의 커뮤니티 흐름으로 이어집니다.',
      paragraphs:[
        '커뮤니티에서는 여러 사용자의 콘텐츠를 목록에서 탐색하고 개별 게시글로 이동해 내용을 읽을 수 있도록 정보 밀도와 카드·상세 구조를 정리했습니다. 비회원의 탐색 경험과 회원의 작성 기능이 충돌하지 않도록 기능 접근 단계를 분리했습니다.',
        '회원이 콘텐츠를 생산하면 게시글이 플랫폼 안의 새로운 탐색 지점이 되고, 작성자 개인 페이지와 다른 콘텐츠로 이어질 수 있도록 단순 게시판보다 확장 가능한 커뮤니티 경험을 목표로 구성했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/fd6a018ec9291.png']
    },
    {
      label:'Member Publishing',
      title:'가입부터 글쓰기와 마이페이지 관리까지 회원 흐름을 연결했습니다.',
      paragraphs:[
        '회원가입과 로그인 이후 게시글 작성, 본인이 작성한 콘텐츠 확인과 수정·관리까지 하나의 계정 경험으로 이어지도록 구성했습니다. 서비스 안에서 사용자가 지금 어떤 상태인지, 다음에 할 수 있는 행동이 무엇인지 명확하게 보이도록 화면 흐름을 설계했습니다.',
        '마이페이지는 단순 계정 설정 화면이 아니라 회원의 콘텐츠 활동과 프로필 관리가 모이는 운영 화면으로 정의해 재방문과 지속적인 콘텐츠 생산을 지원하도록 했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/bd46e36842281.png']
    },
    {
      label:'Personal Spec Profile',
      title:'회원마다 독립된 스펙 페이지를 만들고 관리할 수 있도록 했습니다.',
      paragraphs:[
        '각 가입자가 자신의 정보와 스펙을 정리할 수 있는 개별 상세 페이지를 구성했습니다. 공통된 정보 위계를 사용해 사용자마다 내용은 달라도 같은 플랫폼 안에서 일관되게 읽히도록 했습니다.',
        '프로필과 스펙 정보는 마이페이지의 관리 흐름과 연결해 단순 소개 페이지가 아니라 회원이 지속적으로 갱신할 수 있는 개인 정보 자산으로 작동하도록 설계했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/956e10e7f6b57.png']
    },
    {
      label:'Magazine & Content System',
      title:'커뮤니티의 빠른 흐름과 매거진의 읽는 경험을 분리했습니다.',
      paragraphs:[
        '회원 게시물은 활동성과 탐색 속도를 중심으로 구성하고, 매거진은 한 편의 콘텐츠를 집중해서 읽을 수 있도록 별도의 콘텐츠 위계를 적용했습니다. 같은 플랫폼 안에서도 콘텐츠 목적에 따라 다른 읽기 경험을 제공하도록 설계했습니다.',
        '커뮤니티, 개인 스펙 페이지와 매거진이 각각 독립적으로 존재하면서도 내부 링크와 탐색 흐름으로 연결되어 사용자가 한 콘텐츠에서 다른 회원과 아티클로 자연스럽게 이동할 수 있는 구조를 만들었습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/a0c49409d74b4.png']
    }
  ]
};

(() => {
  if (document.getElementById('aesost-system-type-scale')) return;
  const style = document.createElement('style');
  style.id = 'aesost-system-type-scale';
  style.textContent = `
    .nw-system-intro .nw-section-label { font-size: 11px; }
    .nw-system-intro .nw-build-version { font-size: 11px; }
    .nw-system-intro h2 { font-size: clamp(28px, 2.8vw, 42px); line-height: 1.18; }
    .nw-stat-card .nw-card-index { font-size: 10px; }
    .nw-stat-card > strong { font-size: clamp(17px, 1.35vw, 21px); line-height: 1.32; }
    .nw-stat-card > p { font-size: 12.5px; line-height: 1.65; }
  `;
  document.head.appendChild(style);
})();

window.NW_WORK={
  id:'aesost',
  title:'AESOST',
  subtitle:'Member-driven Community, Identity & Editorial Platform',
  lead:'콘텐츠를 읽는 데서 끝나지 않고, 회원이 직접 기록을 만들고 자신의 프로필과 활동을 축적하며 다시 다른 사람과 콘텐츠를 탐색하는 순환형 커뮤니티 플랫폼을 설계했습니다.',
  summary:'AESOST 프로젝트는 일반 기업 홈페이지가 아니라 회원의 활동과 콘텐츠가 서비스의 중심이 되는 커뮤니티 플랫폼 구축 사례입니다. 공개 탐색, 회원가입과 로그인, 게시글 작성, 마이페이지 관리, 개인 스펙 프로필과 편집형 매거진을 하나의 서비스 안에서 역할별로 분리하고 다시 연결했습니다. 사용자가 콘텐츠를 소비하는 방문자에서 직접 기록을 만들고 자신의 정보를 갱신하는 참여자로 전환되며, 그 활동이 다시 플랫폼의 새로운 탐색 지점이 되는 반복 구조를 중심으로 정보 구조와 UX를 설계했습니다.',
  client:'AESOST / 에이소스트',
  scope:'Platform Planning · IA · UX/UI · Community · Member Flow · Post Publishing · My Page · Personal Spec Profile · Editorial Content',
  category:'Develop · Community Platform · Member System',
  role:'Planning · Information Architecture · UX/UI · Community System Design · Front-end / NINEWORKS',
  year:'2026',
  liveUrl:'https://aesost.com/index.html',
  thumbnail:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/28a06e82e7fbb.png',
  develop:{
    version:'AESOST / BUILD 2026',
    title:'From content browsing to a self-reinforcing member platform.',
    stats:[
      {label:'PROJECT TYPE',value:'COMMUNITY WEB PLATFORM',copy:'콘텐츠 열람 중심이 아니라 회원 활동과 정보 축적이 반복되는 플랫폼으로 설계'},
      {label:'PLATFORM LOOP',value:'DISCOVER · PUBLISH · RETURN',copy:'탐색에서 가입과 작성, 관리와 재탐색으로 이어지는 반복 사용자 흐름 구축'},
      {label:'MEMBER IDENTITY',value:'PERSONAL SPEC PROFILE',copy:'회원별 프로필과 스펙 정보를 지속적으로 갱신하는 개인 정보 자산으로 설계'},
      {label:'CONTENT MODEL',value:'COMMUNITY · EDITORIAL',copy:'빠른 회원 콘텐츠와 읽기 중심의 편집 콘텐츠를 분리하면서 내부 탐색으로 연결'}
    ],
    planningCopy:'화면을 먼저 나누기보다 비회원의 탐색, 회원 가입, 콘텐츠 생산, 본인 활동 관리, 개인 프로필 갱신과 다시 탐색으로 돌아오는 전체 플랫폼 루프를 먼저 정의했습니다.',
    planning:[
      {no:'01 / PLATFORM',title:'Community Definition',copy:'브랜드 소개보다 사용자 활동과 콘텐츠가 지속적으로 쌓이는 커뮤니티 플랫폼을 프로젝트의 중심으로 정의했습니다.'},
      {no:'02 / LOOP',title:'Member Lifecycle',copy:'탐색 → 가입 → 작성 → 프로필·마이페이지 관리 → 재탐색으로 이어지는 반복 회원 여정을 설계했습니다.'},
      {no:'03 / CONTENT',title:'Dual Content Model',copy:'회원 게시글과 편집형 매거진을 목적과 읽기 속도가 다른 콘텐츠 타입으로 분리했습니다.'},
      {no:'04 / IDENTITY',title:'Personal Identity Model',copy:'개인별 상세 페이지의 소개와 스펙 정보를 일정한 구조로 보여주고 지속적으로 수정 가능한 회원 자산으로 정의했습니다.'},
      {no:'05 / PUBLISHING',title:'Publishing Lifecycle',copy:'글 작성 이후 피드, 상세, 작성자 페이지와 본인 관리 화면으로 이어지는 콘텐츠 생명주기를 설계했습니다.'},
      {no:'06 / RETENTION',title:'Retention Structure',copy:'마이페이지와 개인 프로필을 통해 회원이 자신의 기록을 다시 관리하고 커뮤니티 탐색으로 돌아오도록 재방문 동선을 구성했습니다.'}
    ],
    architectureCopy:'공개 콘텐츠 탐색, 회원 계정, 콘텐츠 생산, 개인 정체성과 편집 콘텐츠를 기능별로 분리하면서 사용자의 행동에서는 하나의 순환 구조로 이어지도록 구성했습니다.',
    architecture:[
      {no:'01 / DISCOVER',title:'Public Discovery',copy:'메인·커뮤니티·매거진에서 비회원도 콘텐츠와 플랫폼 성격을 탐색'},
      {no:'02 / MEMBER',title:'Member Account',copy:'가입과 로그인 이후 작성·관리 기능에 접근하는 회원 상태'},
      {no:'03 / PUBLISH',title:'Publishing Layer',copy:'회원 게시글 작성과 상세 보기, 작성자 연결과 본인 콘텐츠 관리 흐름'},
      {no:'04 / IDENTITY',title:'Personal Identity',copy:'회원의 소개·이력·스펙을 개인 페이지에 축적하고 마이페이지에서 갱신'},
      {no:'05 / REDISCOVER',title:'Content Re-discovery',copy:'회원·게시글·매거진 사이를 다시 탐색하며 플랫폼 활동이 반복되는 구조'}
    ],
    stackCopy:'특정 기술 이름을 앞세우기보다 회원 상태, 게시물 생명주기, 프로필 데이터와 편집 콘텐츠가 안정적으로 연결되도록 기능 단위의 웹 구조를 설계했습니다.',
    stack:[
      {no:'01 / FRONTEND',title:'Responsive Web UI',copy:'Desktop · tablet · mobile에서 동일한 콘텐츠 위계와 회원 동선 유지'},
      {no:'02 / ACCOUNT',title:'Member Authentication',copy:'가입 · 로그인 · 회원 상태에 따른 기능 접근 구조'},
      {no:'03 / PUBLISHING',title:'Post CRUD',copy:'회원 게시글 작성 · 상세 보기 · 수정 · 관리 흐름'},
      {no:'04 / MY PAGE',title:'Member Dashboard',copy:'내 게시글과 프로필 정보를 한곳에서 확인·관리'},
      {no:'05 / PROFILE',title:'Spec Data Model',copy:'개인별 소개 · 이력 · 스펙 정보를 일관된 구조로 표현'},
      {no:'06 / EDITORIAL',title:'Editorial Content',copy:'커뮤니티와 구분된 읽기 중심의 매거진 아티클 경험'},
      {no:'07 / ROUTING',title:'Content Routing',copy:'피드 → 게시글 → 회원 페이지 → 관련 콘텐츠로 이어지는 이동 구조'},
      {no:'08 / MEDIA',title:'Content Media',copy:'이미지와 텍스트를 게시물·프로필·매거진 목적에 맞게 배치'},
      {no:'09 / DOMAIN',title:'aesost.com',copy:'Production domain · live community platform'}
    ],
    sitemapCopy:'방문자용 탐색, 회원 활동, 개인 정체성과 편집형 콘텐츠를 목적별로 분리해 콘텐츠가 늘어날수록 플랫폼 탐색 지점도 함께 늘어나는 구조로 정리했습니다.',
    sitemap:[
      {no:'01 / DISCOVERY',title:'Public Discovery',items:['HOME / 메인','COMMUNITY / 게시글 탐색','MAGAZINE / 편집 콘텐츠','MEMBER PROFILE / 회원 페이지']},
      {no:'02 / ACTIVITY',title:'Member Activity',items:['JOIN / 회원가입','LOGIN / 로그인','WRITE / 게시글 작성','POST DETAIL / 게시글 상세','MY POSTS / 작성글 관리']},
      {no:'03 / IDENTITY',title:'Personal Identity',items:['MY PAGE / 내 활동 관리','EDIT PROFILE / 프로필 수정','PERSONAL SPEC / 개인 스펙 페이지','PROFILE NAVIGATION / 회원 간 탐색']},
      {no:'04 / CONTENT',title:'Editorial System',items:['MAGAZINE / 아카이브','ARTICLE / 아티클 상세','COMMUNITY ↔ PROFILE ↔ MAGAZINE / 내부 탐색']}
    ],
    dataFlowCopy:'회원이 가입한 뒤 한 번의 활동으로 끝나지 않고 콘텐츠를 만들고, 자신의 기록과 정체성을 관리하고, 다시 다른 회원과 콘텐츠를 탐색하는 순환 구조를 설계했습니다.',
    dataFlow:[
      {no:'01',title:'Discover',copy:'커뮤니티·매거진 탐색'},
      {no:'02',title:'Join',copy:'회원 가입·로그인'},
      {no:'03',title:'Publish',copy:'회원 콘텐츠 작성'},
      {no:'04',title:'Community Feed',copy:'게시글 노출·상세 탐색'},
      {no:'05',title:'Identity',copy:'개인 프로필·스펙 축적'},
      {no:'06',title:'My Page',copy:'내 글·정보 관리'},
      {no:'07',title:'Re-discover',copy:'회원·콘텐츠 재탐색'}
    ],
    codeMapCopy:'화면 단위가 아니라 회원 상태, 콘텐츠 작성, 마이페이지와 개인 프로필처럼 실제 사용자 행동을 기준으로 기능 모듈을 분리해 확장 가능한 플랫폼 구조로 정리했습니다.',
    codeMap:[
      {label:'MEMBER FLOW',file:'Account Module',code:'discover → join / login → member state → gated actions',copy:'비회원 탐색에서 회원 활동으로 자연스럽게 전환되도록 계정 상태와 기능 접근을 연결했습니다.'},
      {label:'POST PUBLISHING',file:'Community Module',code:'create post → feed → detail → author profile → edit / manage',copy:'사용자 작성 콘텐츠가 피드와 상세, 작성자 개인 페이지, 본인 관리 화면으로 이어지는 생명주기를 설계했습니다.'},
      {label:'MEMBER IDENTITY',file:'Profile Module',code:'profile data + spec data → public profile ↔ my page update',copy:'공개 개인 페이지와 본인 관리 화면을 연결해 회원 정보가 지속적으로 갱신되는 구조를 만들었습니다.'},
      {label:'CONTENT ROUTING',file:'Content Modules',code:'community ↔ member profile ↔ editorial article → re-discovery',copy:'서로 성격이 다른 콘텐츠가 플랫폼 안에서 다시 탐색으로 이어지도록 내부 이동 구조를 설계했습니다.'}
    ],
    deploymentCopy:'회원·게시물·프로필·편집 콘텐츠의 기능 범위를 분리해 향후 콘텐츠 증가와 회원 활동 확장에도 대응할 수 있도록 운영 구조를 구성하고 실제 도메인에서 서비스하도록 연결했습니다.',
    deployment:[
      {label:'Live Domain',value:'aesost.com'},
      {label:'Platform',value:'Member-driven Community Web Platform'},
      {label:'Frontend',value:'Responsive Community Interface'},
      {label:'Account',value:'Member Join · Login · Session Flow'},
      {label:'Publishing',value:'Member Posts · Detail · Edit · Management'},
      {label:'Identity',value:'Personal Spec Profiles · Member Information'},
      {label:'Content',value:'Community Posts · Editorial Articles'},
      {label:'Operation',value:'My Page · Profile Update · Content Lifecycle · Re-discovery'}
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
      label:'The Challenge',
      title:'Content exists. Community begins when identity and activity connect.',
      paragraphs:[
        '콘텐츠를 많이 배치하는 것만으로는 커뮤니티가 만들어지지 않습니다. 게시글이 일회성으로 소비되고 회원의 활동과 개인 정보가 서로 분리되면 사용자는 다시 돌아올 이유가 줄어들고, 플랫폼에 쌓이는 정보도 서로 연결되지 않습니다.',
        'AESOST는 게시판, 회원정보, 마이페이지와 매거진을 각각 독립 기능으로 두기보다 회원의 정체성과 콘텐츠 활동이 지속적으로 연결되는 구조가 필요했습니다. 그래서 방문자가 탐색에서 참여자로 전환되고, 참여가 다시 새로운 콘텐츠와 탐색 지점을 만드는 순환을 플랫폼의 핵심 문제로 정의했습니다.'
      ],
      images:[]
    },
    {
      label:'Platform Architecture',
      title:'Discover, publish, build identity, and return.',
      paragraphs:[
        '플랫폼의 핵심 흐름은 DISCOVER → JOIN → PUBLISH → IDENTITY → MANAGE → RE-DISCOVER로 설계했습니다. 비회원은 커뮤니티와 매거진을 자유롭게 탐색하고, 회원이 되면 게시글을 작성하며 자신의 개인 페이지와 스펙 정보를 축적합니다.',
        '작성한 콘텐츠와 개인 프로필은 서로 새로운 탐색 지점이 됩니다. 마이페이지에서 자신의 활동을 관리한 사용자는 다시 다른 회원, 게시물과 아티클을 탐색하게 되고 이 반복이 플랫폼의 콘텐츠와 관계를 함께 성장시키도록 구조화했습니다.'
      ],
      images:[]
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
      label:'Member Lifecycle',
      title:'가입에서 작성, 관리와 재탐색까지 회원 생명주기를 연결했습니다.',
      paragraphs:[
        '회원가입과 로그인은 별도의 인증 단계가 아니라 플랫폼 참여가 시작되는 전환 지점으로 정의했습니다. 로그인 이후 게시글 작성, 작성자 정보 연결, 본인이 만든 콘텐츠의 확인과 수정, 프로필 갱신까지 하나의 회원 상태 안에서 이어지도록 구성했습니다.',
        '마이페이지는 단순 설정 페이지가 아니라 회원이 자신의 콘텐츠와 프로필 자산을 관리하는 운영 화면으로 설계했습니다. 사용자가 자신이 쌓은 기록을 다시 확인하고 갱신할 수 있어야 재방문과 지속적인 활동이 자연스럽게 이어진다고 보았습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/bd46e36842281.png']
    },
    {
      label:'Personal Identity System',
      title:'프로필을 회원정보가 아닌 지속적으로 쌓이는 개인 자산으로.',
      paragraphs:[
        '각 가입자가 자신의 소개와 스펙을 정리할 수 있는 독립된 상세 페이지를 구성하고, 공통된 정보 위계를 사용해 사용자마다 내용은 달라도 같은 플랫폼 안에서 일관되게 읽히도록 했습니다.',
        '개인 스펙 페이지는 가입 시 한 번 작성하고 끝나는 프로필이 아니라 마이페이지에서 계속 갱신할 수 있는 회원의 정보 자산으로 정의했습니다. 작성한 게시글과 개인 페이지가 연결되면서 콘텐츠 뒤에 누가 있는지 확인하고 다른 회원을 탐색할 수 있는 정체성 레이어로 작동합니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/956e10e7f6b57.png']
    },
    {
      label:'Content Dual System',
      title:'커뮤니티의 속도와 매거진의 깊이를 서로 다른 콘텐츠 경험으로.',
      paragraphs:[
        '회원 게시물은 활동성과 빠른 탐색을 중심으로 구성하고, 매거진은 한 편의 콘텐츠를 집중해서 읽을 수 있도록 별도의 콘텐츠 위계를 적용했습니다. 같은 플랫폼 안에서도 콘텐츠를 만드는 주체와 소비 방식에 따라 다른 인터페이스와 읽기 리듬을 제공했습니다.',
        '두 콘텐츠 시스템을 완전히 분리하지는 않았습니다. 커뮤니티 게시물, 회원 프로필과 편집형 아티클이 내부 링크와 탐색 흐름으로 연결되어 한 콘텐츠를 본 사용자가 다른 사람과 주제로 계속 이동할 수 있도록 구성했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/a0c49409d74b4.png']
    },
    {
      label:'Platform Operation',
      title:'회원과 콘텐츠가 늘어날수록 탐색 지점도 함께 확장됩니다.',
      paragraphs:[
        'AESOST의 구조는 특정 페이지 수에 맞춰 고정하기보다 회원, 게시글, 개인 프로필과 편집 콘텐츠가 각각 독립된 데이터 단위로 확장될 수 있도록 설계했습니다. 새로운 회원과 콘텐츠가 추가되면 별도의 페이지 개편 없이 플랫폼 안의 새로운 탐색 지점이 자연스럽게 늘어납니다.',
        '결과적으로 공개 탐색, 회원 참여, 개인 정보 축적, 콘텐츠 관리와 재탐색을 하나의 서비스 흐름으로 연결해 단순 콘텐츠 사이트가 아니라 사용자 활동이 플랫폼의 자산으로 남는 구조를 구축했습니다.'
      ],
      images:[]
    }
  ]
};

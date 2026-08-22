(() => {
  if (document.getElementById('tne-system-type-scale')) return;
  const style = document.createElement('style');
  style.id = 'tne-system-type-scale';
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
  id:'tne-epc',
  title:'TNE',
  subtitle:'Solar EPC Corporate Website & Interactive Business Archive',
  lead:'아임웹을 단순한 페이지 빌더로 사용하지 않고, 기업의 태양광 EPC 사업과 시공 데이터를 인터랙션으로 이해할 수 있는 맞춤형 기업 웹사이트로 확장했습니다.',
  summary:'TNE 프로젝트는 태양광 발전소 EPC 기업의 사업 구조와 시공 이력을 디지털 환경에서 체계적으로 보여주기 위해 진행한 기업 웹사이트 구축 프로젝트입니다. 아임웹을 운영 기반으로 사용하면서 페이지별 핵심 콘텐츠는 HTML·CSS·JavaScript 기반의 커스텀 코드로 구현했습니다. 사업 과정, 전국 현황, 시공 사례와 위치 데이터를 서로 연결하고, 지도에서 지역을 선택하면 관련 정보와 프로젝트가 이어지는 인터랙션을 설계해 단순 회사소개를 넘어 실제 사업 데이터를 탐색할 수 있는 웹 경험으로 구축했습니다.',
  client:'TNE / 티엔이',
  scope:'Service Planning · IA · UX/UI · Imweb · HTML/CSS/JavaScript · Interaction · Map Data · Project Archive',
  category:'Develop · Corporate Website · Interactive Data',
  role:'Planning · Information Architecture · UX/UI · Custom Publishing · Interaction Development / NINEWORKS',
  year:'2026',
  liveUrl:'https://tneepc.com/',
  thumbnail:'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/d2f4c1d09a04e.png',
  develop:{
    version:'TNE / BUILD 2026',
    title:'From corporate information to an interactive EPC business system.',
    stats:[
      {label:'PLATFORM',value:'IMWEB + CUSTOM CODE',copy:'빌더의 운영 편의성은 유지하면서 주요 화면과 인터랙션은 코드로 확장'},
      {label:'FRONT-END',value:'HTML · CSS · JAVASCRIPT',copy:'페이지별 정보 구조, 스크롤 인터랙션, 지도 및 데이터 연결 기능 구현'},
      {label:'DATA EXPERIENCE',value:'MAP · PROJECT ARCHIVE',copy:'전국 사업 위치와 시공 사례를 탐색 가능한 정보 구조로 체계화'},
      {label:'DELIVERY',value:'IMWEB PUBLISH · TNEEPC.COM',copy:'아임웹 운영 환경과 커스텀 도메인 안에서 지속 수정 가능한 구조로 구축'}
    ],
    planningCopy:'기업이 가진 사업 설명과 시공 실적을 단순 나열하지 않고, 사용자가 사업 흐름과 실제 수행 경험을 빠르게 이해하도록 정보 구조를 다시 설계했습니다.',
    planning:[
      {no:'01 / REQUIREMENT',title:'Business Requirement',copy:'기업 소개보다 EPC 사업 구조와 실제 수행 역량이 먼저 보이도록 프로젝트 목표를 정의했습니다.'},
      {no:'02 / USER FLOW',title:'Information Journey',copy:'사업 이해 → 사업 과정 → 전국 현황 → 시공 사례 → 문의로 이어지는 정보 탐색 흐름을 설계했습니다.'},
      {no:'03 / CONTENT MODEL',title:'Business Content Model',copy:'사업 과정, 지역, 프로젝트명, 발전 용량과 시공 사례를 서로 연결 가능한 콘텐츠 단위로 정리했습니다.'},
      {no:'04 / INTERACTION',title:'Interaction Planning',copy:'정적인 기업 정보 대신 스크롤과 선택 동작에 따라 사업 내용을 단계적으로 이해하도록 인터랙션을 설계했습니다.'},
      {no:'05 / MAP DATA',title:'Map Information',copy:'전국 사업 위치를 지도 기반으로 탐색하고 선택한 위치의 정보를 확인할 수 있는 구조를 기획했습니다.'},
      {no:'06 / OPERATION',title:'Builder Operation',copy:'콘텐츠 수정은 아임웹에서 유지하면서 코드 기능은 별도 레이어로 관리할 수 있도록 운영 구조를 분리했습니다.'}
    ],
    architectureCopy:'아임웹이 제공하는 기본 페이지 구조 위에 커스텀 인터랙션과 데이터 표현 계층을 얹어, 운영성과 표현력을 동시에 확보했습니다.',
    architecture:[
      {no:'01 / BUILDER',title:'Imweb Base',copy:'도메인·페이지·콘텐츠 운영을 위한 기본 CMS 및 퍼블리싱 환경'},
      {no:'02 / UI',title:'Custom Interface',copy:'기업 사업 콘텐츠에 맞춘 섹션 구조와 반응형 화면 컴포넌트'},
      {no:'03 / INTERACTION',title:'JavaScript Layer',copy:'스크롤 반응, 클릭 전환, 지도 선택과 상세 데이터 표시 로직'},
      {no:'04 / CONTENT',title:'Business Archive',copy:'사업 과정·전국 현황·시공 사례를 연결하는 구조화된 콘텐츠 체계'}
    ],
    stackCopy:'플랫폼 전체를 새로 개발하기보다 아임웹의 운영 환경을 기반으로 필요한 기능만 커스텀 코드로 확장해 유지관리성과 구축 효율을 함께 확보했습니다.',
    stack:[
      {no:'01 / PLATFORM',title:'Imweb',copy:'Page builder · CMS · publishing environment'},
      {no:'02 / MARKUP',title:'HTML5',copy:'Custom section markup · semantic content blocks'},
      {no:'03 / STYLE',title:'CSS3',copy:'Responsive layout · grid · interaction states'},
      {no:'04 / SCRIPT',title:'JavaScript',copy:'Click interaction · scroll states · data-linked UI'},
      {no:'05 / MAP',title:'Interactive Map UI',copy:'지역 선택 · 위치 정보 · 프로젝트 데이터 연계'},
      {no:'06 / CONTENT',title:'Project Data Model',copy:'사업 위치 · 프로젝트명 · 발전 용량 · 수행 이력 구조화'},
      {no:'07 / RESPONSIVE',title:'Responsive Web',copy:'Desktop · tablet · mobile content hierarchy'},
      {no:'08 / DOMAIN',title:'tneepc.com',copy:'Production domain · live corporate website'},
      {no:'09 / OPERATION',title:'Builder + Code',copy:'CMS content update와 custom code 기능을 분리 운영'}
    ],
    sitemapCopy:'기업 정보를 회사소개 중심으로 나누기보다 사업을 이해하고 실제 수행 이력까지 확인하는 사용자 흐름에 맞춰 핵심 콘텐츠를 구성했습니다.',
    sitemap:[
      {no:'01 / CORPORATE',title:'Corporate Information',items:['HOME / 메인','BUSINESS MESSAGE / 기업 메시지','CONTACT / 오시는길·문의']},
      {no:'02 / EPC BUSINESS',title:'Business Experience',items:['BUSINESS PROCESS / 사업 과정','01 사업검토 → 06 유지관리','NATIONWIDE STATUS / 전국 현황']},
      {no:'03 / PROJECT DATA',title:'Project Archive',items:['PROJECTS / 사업현황','CONSTRUCTION CASES / 시공 사례','LOCATION DATA / 지역 정보','CAPACITY DATA / 발전 용량','MAP → PROJECT DETAIL LINK']}
    ],
    dataFlowCopy:'지도와 시공 이력을 각각 분리된 콘텐츠로 보여주지 않고 사용자의 선택을 기준으로 위치와 프로젝트 정보를 연결해 탐색할 수 있도록 구성했습니다.',
    dataFlow:[
      {no:'01',title:'Region Select',copy:'지도 위치 선택'},
      {no:'02',title:'Interaction Event',copy:'클릭 이벤트 감지'},
      {no:'03',title:'Location Data',copy:'지역 정보 매칭'},
      {no:'04',title:'Project Match',copy:'관련 시공 사례 연결'},
      {no:'05',title:'Detail Display',copy:'프로젝트 정보 표시'},
      {no:'06',title:'Archive Explore',copy:'사업 이력 추가 탐색'}
    ],
    codeMapCopy:'아임웹 기본 위젯에 모든 기능을 의존하지 않고 페이지 목적에 따라 커스텀 마크업, 스타일, 인터랙션 로직을 역할별로 분리해 적용했습니다.',
    codeMap:[
      {label:'PAGE MODULE',file:'Imweb Custom Code',code:'section markup → responsive layout → interaction state',copy:'페이지별 사업 콘텐츠를 독립적인 커스텀 섹션으로 구성합니다.'},
      {label:'MAP INTERACTION',file:'JavaScript',code:'location click → data match → project detail render',copy:'지도 위치 선택과 관련 프로젝트 정보 노출을 하나의 인터랙션 흐름으로 연결합니다.'},
      {label:'PROJECT ARCHIVE',file:'Content Data',code:'region + project + capacity + history → searchable visual archive',copy:'사업 이력을 지역과 프로젝트 단위로 체계화해 화면에서 재사용할 수 있게 정리합니다.'},
      {label:'RESPONSIVE UI',file:'CSS',code:'desktop / tablet / mobile → shared hierarchy + adaptive layout',copy:'디바이스가 달라져도 사업 정보의 우선순위가 유지되도록 레이아웃을 조정합니다.'}
    ],
    deploymentCopy:'아임웹의 콘텐츠 운영 기능과 커스텀 코드 영역을 분리해, 사이트 운영자가 콘텐츠를 수정하면서도 핵심 인터랙션은 안정적으로 유지할 수 있는 구조로 구축했습니다.',
    deployment:[
      {label:'Platform',value:'Imweb Website Builder'},
      {label:'Frontend',value:'Custom HTML / CSS / JavaScript'},
      {label:'Interaction',value:'Scroll · Click · Map · Data-linked UI'},
      {label:'Content',value:'Business Process · Nationwide Status · Project Archive'},
      {label:'Data Model',value:'Location · Project · Capacity · Construction History'},
      {label:'Domain',value:'tneepc.com'},
      {label:'Publishing',value:'Imweb production publishing'},
      {label:'Operation',value:'Builder content management + custom code maintenance'}
    ]
  },
  sections:[
    {
      label:'Project Strategy',
      title:'기업 소개보다 사업의 구조와 수행 경험이 먼저 보이도록 설계했습니다.',
      paragraphs:[
        'TNE는 태양광 발전소의 사업검토부터 엔지니어링, 인허가, 설치공사, 준공과 유지관리까지 EPC 전 과정을 수행합니다. 웹사이트 역시 기업 소개를 나열하는 방식보다 사용자가 사업 구조를 단계적으로 이해하고 실제 수행 경험까지 이어서 확인할 수 있는 정보 구조가 필요했습니다.',
        '아임웹을 운영 기반으로 사용하되 핵심 페이지의 정보 표현은 커스텀 코드로 다시 설계했습니다. 빌더가 가진 관리 편의성은 유지하면서, 기업의 사업 특성을 충분히 보여줄 수 있는 인터랙션과 데이터형 콘텐츠를 결합하는 것이 프로젝트의 핵심 방향이었습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/1a71291f04db2.png']
    },
    {
      label:'Website & Interaction Design',
      title:'페이지마다 사업 내용을 움직이는 정보 경험으로 구현했습니다.',
      paragraphs:[
        '태양광 EPC 사업은 공정과 전문 용어가 많기 때문에 한 화면에 정보를 과도하게 배치하기보다 사용자의 스크롤과 선택에 따라 내용을 순차적으로 이해하도록 구성했습니다. 각 페이지의 핵심 메시지와 사업 단계에 맞춰 커스텀 섹션, 전환 효과와 반응형 인터랙션을 적용했습니다.',
        '아임웹의 기본 위젯만 사용하는 방식에서 벗어나 HTML·CSS·JavaScript를 페이지별로 적용하고, 디바이스가 달라져도 정보의 우선순위와 인터랙션 흐름이 유지되도록 화면 구조를 세밀하게 조정했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/b09088b134b21.png','https://cdn.imweb.me/upload/S20260219b829e728b3f2e/b6ddcaf977ad8.png']
    },
    {
      label:'Interactive Map & Data',
      title:'전국 사업 위치와 프로젝트 정보를 하나의 탐색 흐름으로 연결했습니다.',
      paragraphs:[
        '전국 현황은 단순한 이미지 지도가 아니라 사용자가 위치를 선택하고 관련 데이터를 확인할 수 있는 인터랙티브 정보 화면으로 설계했습니다. 지도에서 선택한 지역과 프로젝트 데이터를 연결해 위치 정보가 실제 수행 이력으로 이어지도록 구성했습니다.',
        '지역, 프로젝트명, 발전 용량과 수행 이력을 구조화해 지도와 사업 아카이브에서 반복적으로 활용할 수 있도록 정리했습니다. 이를 통해 기업이 어디에서 어떤 규모의 프로젝트를 수행했는지 시각적으로 빠르게 이해할 수 있습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/2db392944c78a.png']
    },
    {
      label:'Project Archive',
      title:'누적된 사업 이력을 검색 가능한 기업 자산으로 체계화했습니다.',
      paragraphs:[
        '시공 사례는 단순 포트폴리오 이미지가 아니라 프로젝트명과 발전 용량, 지역 정보를 기준으로 기업의 수행 경험을 보여주는 데이터형 아카이브로 정리했습니다. 실제 사이트에는 다양한 태양광 발전소와 기업 사업소의 시공 사례가 누적되어 있어, 이를 일관된 규칙으로 보여주는 구조가 중요했습니다.',
        '프로젝트 카드와 상세 정보, 지도 데이터가 서로 분리되지 않도록 동일한 정보 체계를 사용해 확장성을 확보했습니다. 신규 사업 이력이 추가되어도 기존 화면 구조를 유지하면서 지속적으로 축적할 수 있도록 설계했습니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/d1256f4dcb494.png']
    },
    {
      label:'Build & Operation',
      title:'빌더와 코드를 분리해 운영 가능한 기업 웹 환경으로 완성했습니다.',
      paragraphs:[
        '플랫폼 자체는 아임웹을 사용해 기본 콘텐츠와 페이지 운영의 편의성을 확보하고, 차별화가 필요한 영역은 커스텀 HTML·CSS·JavaScript로 구현했습니다. 사이트 전체를 별도 프레임워크로 재구축하지 않아도 기업이 운영하기 쉬우면서 개발된 인터랙션을 유지할 수 있는 하이브리드 구조입니다.',
        '최종적으로 기업 메시지, EPC 사업 과정, 전국 사업 현황, 시공 사례와 문의 흐름을 하나의 디지털 경험으로 연결했습니다. 디자인과 퍼블리싱, 인터랙션 개발, 데이터 구조화가 함께 작동하도록 구축한 것이 TNE DEVELOP 프로젝트의 특징입니다.'
      ],
      images:['https://cdn.imweb.me/upload/S20260219b829e728b3f2e/a3ef928290928.png']
    }
  ]
};

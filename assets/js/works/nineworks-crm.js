window.NW_WORK={
  id:'nineworks-crm',
  title:'NINEWORKS CRM',
  subtitle:'Internal Work Management & Client Operations System',
  lead:'프로젝트 일정, 클라이언트 요청, 영업 진행상황과 개인 업무를 하나의 흐름에서 관리하기 위해 나인웍스 내부 운영 시스템을 기획하고 구축했습니다.',
  summary:'분산되어 있던 일정·요청·클라이언트·업무 데이터를 하나의 웹 기반 CRM으로 연결한 내부 시스템 프로젝트입니다. 메인 캘린더를 중심으로 개인 워크스페이스, 클라이언트 관리, 요청사항, 영업 파이프라인을 구성하고 Firebase 기반 데이터 구조와 운영 흐름을 설계했습니다. 실제 운영 시스템의 URL과 내부 데이터는 보안상 공개하지 않으며, 포트폴리오에서는 기능 구조와 일부 UI 화면만 선별해 소개합니다.',
  client:'NINEWORKS / Internal Project',
  scope:'Service Planning · UX/UI · CRM · Calendar · Client Management · Request Management · Sales Pipeline · Firebase',
  category:'Develop · Business System · CRM',
  role:'Planning · UX/UI · Front-end Development · Firebase System Design / NINEWORKS',
  year:'2026',
  thumbnail:'assets/nineworks-crm-cover.svg',
  develop:{
    version:'NINEWORKS CRM / BUILD 2026',
    title:'An internal operating system that connects client requests, schedules and team work.',
    stats:[
      {label:'CORE',value:'CALENDAR + CRM',copy:'프로젝트 일정과 고객 관계 정보를 하나의 운영 흐름으로 연결'},
      {label:'WORKSPACE',value:'PERSONAL DASHBOARD',copy:'개인별 오늘 일정, 할 일, 목표 일정과 배정 요청을 한 화면에서 관리'},
      {label:'OPERATIONS',value:'CLIENT · REQUEST · SALES',copy:'클라이언트 관리와 요청 접수, 영업 파이프라인을 통합'},
      {label:'DATA',value:'FIREBASE',copy:'운영 데이터를 웹 환경에서 저장하고 실시간으로 반영할 수 있는 구조'}
    ],
    planningCopy:'메뉴를 늘리는 대신 실제 업무가 발생하는 순서를 기준으로 기능을 묶었습니다. 요청이 들어오고 담당자가 정해지고 일정으로 전환된 뒤 완료되는 과정을 한 시스템 안에서 추적할 수 있도록 설계했습니다.',
    planning:[
      {no:'01 / PROBLEM',title:'Scattered Operation',copy:'메신저, 메모, 일정표에 흩어진 요청과 프로젝트 정보를 하나의 운영 환경으로 통합했습니다.'},
      {no:'02 / CORE',title:'Calendar First',copy:'업무의 중심을 캘린더로 두고 클라이언트·담당자·업무 분류가 일정 데이터와 연결되도록 구성했습니다.'},
      {no:'03 / PERSONAL',title:'My Workspace',copy:'개인별 목표 일정, 해야 할 일, 배정 요청과 완료 내역을 별도 워크스페이스에서 확인하도록 했습니다.'},
      {no:'04 / CLIENT',title:'Client Record',copy:'클라이언트별 진행 업무와 요청, 담당자 정보를 누적해 다시 찾기 쉬운 형태로 정리했습니다.'},
      {no:'05 / SALES',title:'Sales Pipeline',copy:'신규 문의부터 제안, 다음 연락, 계약 전환까지 예비 클라이언트의 상태를 추적할 수 있게 했습니다.'},
      {no:'06 / SECURITY',title:'Controlled Exposure',copy:'실제 운영 URL과 내부 데이터는 외부에 노출하지 않고 포트폴리오에서는 구조와 선별 UI만 공개합니다.'}
    ],
    architectureCopy:'사용자의 메뉴 이동보다 업무 데이터가 어떻게 연결되는지를 우선했습니다. 클라이언트와 요청이 일정과 담당자에 연결되고, 완료된 업무는 다시 클라이언트 기록과 개인 업무 이력으로 남는 구조입니다.',
    architecture:[
      {no:'01 / INPUT',title:'Client / Inquiry',copy:'기존 클라이언트와 신규 문의 정보를 운영 데이터의 시작점으로 등록'},
      {no:'02 / REQUEST',title:'Request Queue',copy:'전화·메신저·이메일 등으로 들어온 요청을 업무 단위로 정리'},
      {no:'03 / ASSIGN',title:'Owner & Category',copy:'담당자와 업무 분류를 지정해 책임과 우선순위를 명확하게 설정'},
      {no:'04 / SCHEDULE',title:'Calendar',copy:'요청과 업무를 일정으로 전환해 시작일과 완료 목표를 관리'},
      {no:'05 / WORK',title:'Workspace',copy:'개인별 해야 할 일과 배정된 요청을 실행 단위로 확인'},
      {no:'06 / RECORD',title:'Client History',copy:'완료 결과와 진행 이력을 클라이언트 단위로 다시 축적'}
    ],
    stackCopy:'가벼운 웹 기반 내부 도구로 운영할 수 있도록 프론트엔드와 Firebase를 중심으로 구성하고, 필요한 기능을 단계적으로 추가할 수 있는 구조로 설계했습니다.',
    stack:[
      {no:'01 / FRONTEND',title:'HTML / CSS / JavaScript',copy:'Dashboard UI · interaction · responsive layout'},
      {no:'02 / DATABASE',title:'Cloud Firestore',copy:'Client · schedule · request · sales records'},
      {no:'03 / AUTH',title:'Firebase Authentication',copy:'내부 사용자 로그인과 접근 제어를 위한 인증 구조'},
      {no:'04 / HOSTING',title:'Firebase Hosting',copy:'웹 기반 내부 시스템 배포와 운영 환경'},
      {no:'05 / CALENDAR',title:'Schedule UI',copy:'일정 조회 · 필터 · 등록 · 업무 연결'},
      {no:'06 / WORKFLOW',title:'CRM Workflow',copy:'Request → Assign → Schedule → Work → Complete'},
      {no:'07 / RESPONSIVE',title:'Responsive Web',copy:'Desktop 중심 운영 · 보조 화면 대응'},
      {no:'08 / OPERATION',title:'Internal Tool',copy:'실제 프로젝트 운영에 맞춰 지속 개선하는 업무 시스템'}
    ],
    sitemapCopy:'기능을 업무 역할에 따라 분리하되 서로 단절되지 않도록 공통 데이터를 중심으로 연결했습니다.',
    sitemap:[
      {no:'01 / OPERATE',title:'Daily Operation',items:['CALENDAR / 통합 일정','MY WORKSPACE / 개인 업무','GOAL SCHEDULE / 목표 일정','TO DO / 해야 할 일']},
      {no:'02 / CLIENT',title:'Client Management',items:['CLIENT LIST / 클라이언트','REQUEST / 요청사항','ASSIGNEE / 담당자','WORK HISTORY / 진행·완료 업무']},
      {no:'03 / SALES',title:'Sales & Pipeline',items:['LEAD / 신규 문의','NEXT CONTACT / 다음 연락','PROPOSAL / 제안 진행','CONTRACT / 계약 전환']}
    ],
    dataFlowCopy:'요청을 별도 메모로 남기는 대신 실제 일정과 담당 업무로 이어지도록 데이터 흐름을 설계했습니다.',
    dataFlow:[
      {no:'01',title:'Receive',copy:'클라이언트 요청 접수'},
      {no:'02',title:'Classify',copy:'업무 유형과 우선순위 분류'},
      {no:'03',title:'Assign',copy:'담당자 지정'},
      {no:'04',title:'Schedule',copy:'캘린더 일정으로 전환'},
      {no:'05',title:'Execute',copy:'개인 워크스페이스에서 진행'},
      {no:'06',title:'Archive',copy:'완료 내역과 클라이언트 이력 저장'}
    ],
    codeMapCopy:'하나의 거대한 화면 대신 일정, 클라이언트, 요청, 영업과 개인 업무를 독립 모듈처럼 구성하고 공통 데이터로 연결했습니다.',
    codeMap:[
      {label:'CALENDAR',file:'Schedule Module',code:'client + owner + category + date → calendar item',copy:'일정 데이터를 필터하고 업무 진행 기준으로 활용합니다.'},
      {label:'REQUEST',file:'Request Module',code:'incoming request → classify → assign → schedule',copy:'접수된 요청이 실제 업무로 전환되는 과정을 관리합니다.'},
      {label:'CLIENT',file:'CRM Module',code:'client → active work → request → history',copy:'클라이언트별 현재 업무와 누적 이력을 연결합니다.'},
      {label:'WORKSPACE',file:'Personal Module',code:'assigned work + todo + target date → personal dashboard',copy:'담당자별 업무 우선순위와 실행 항목을 한 화면으로 정리합니다.'}
    ],
    deploymentCopy:'운영 시스템은 내부 업무용으로 분리해 관리하고 포트폴리오에는 직접 접속 링크를 제공하지 않습니다. 공개 범위는 기능 구조와 데이터가 제거된 선별 화면으로 제한합니다.',
    deployment:[
      {label:'Type',value:'Internal Business Management System'},
      {label:'Frontend',value:'HTML / CSS / JavaScript'},
      {label:'Backend / DB',value:'Firebase · Cloud Firestore'},
      {label:'Authentication',value:'Internal user authentication'},
      {label:'Modules',value:'Calendar · Workspace · Client · Request · Sales'},
      {label:'Access',value:'Private operation / No public system link'},
      {label:'Portfolio',value:'Selected UI only · sensitive data excluded'},
      {label:'Operation',value:'Continuously improved with real workflow feedback'}
    ]
  },
  sections:[
    {
      label:'Integrated Calendar',
      title:'클라이언트와 담당자, 업무 분류를 일정 안에서 함께 관리합니다.',
      paragraphs:[
        '프로젝트 운영의 중심 화면은 통합 캘린더입니다. 단순히 날짜만 기록하는 캘린더가 아니라 클라이언트, 담당자, 업무 분류와 연결해 현재 어떤 일이 누구에게 배정되어 있는지 빠르게 확인할 수 있도록 구성했습니다.',
        '포트폴리오 최종본에서는 실제 운영 데이터가 제거된 캘린더 화면 한 컷만 선별해 공개하며, 내부 시스템으로 연결되는 링크는 제공하지 않습니다.'
      ],
      images:['assets/nineworks-crm-calendar.svg']
    },
    {
      label:'My Workspace',
      title:'각 담당자가 자신의 일정과 해야 할 일을 한 화면에서 확인하도록 구성했습니다.',
      paragraphs:[
        '마이 워크스페이스는 오늘 일정, 진행 중 업무, 목표 일정, 해야 할 일과 배정된 요청을 개인 기준으로 모아 보여주는 영역입니다. 전체 회사 데이터를 보는 CRM 화면과 개인이 실제로 실행해야 하는 업무 화면을 분리해 정보 밀도를 조절했습니다.',
        '업무를 다시 여러 메뉴에서 찾지 않도록 지금 해야 하는 일을 우선적으로 보여주는 구조에 초점을 맞췄습니다.'
      ],
      images:['assets/nineworks-crm-workspace.svg']
    },
    {
      label:'Client & Sales CRM',
      title:'요청 접수부터 일정 전환, 영업 진행과 계약 전환까지 하나의 흐름으로 연결했습니다.',
      paragraphs:[
        '클라이언트 관리에서는 진행 중 업무와 요청사항, 담당자, 완료 이력을 함께 확인할 수 있도록 했고 영업 영역에서는 신규 문의, 제안, 다음 연락과 계약 전환 상태를 별도로 추적할 수 있게 했습니다.',
        '이를 통해 기존 클라이언트의 운영 업무와 신규 영업 데이터를 같은 시스템 안에서 관리하되 서로 다른 목적에 맞는 화면으로 분리했습니다.'
      ],
      images:['assets/nineworks-crm-flow.svg']
    },
    {
      label:'Private Operation',
      title:'내부 시스템은 공개하지 않고, 포트폴리오에는 필요한 만큼만 보여줍니다.',
      paragraphs:[
        '이 프로젝트는 실제 업무 데이터가 저장되는 내부 운영 시스템이기 때문에 포트폴리오 상세페이지에서 라이브 사이트 버튼이나 관리자 페이지 링크를 제공하지 않습니다.',
        '최종 공개 화면 역시 클라이언트명, 연락처, 일정 상세, 내부 메모 등 민감하거나 운영상 필요한 정보는 제거한 뒤 기능을 이해할 수 있는 범위만 선별해 사용합니다.'
      ],
      images:[]
    }
  ]
};
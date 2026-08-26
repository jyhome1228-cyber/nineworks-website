(() => {
  const browser = document.querySelector('[data-major-browser]');
  if (!browser) return;

  const grid = browser.querySelector('[data-major-browser-grid]');
  const titleEl = browser.querySelector('[data-major-browser-title]');
  const copyEl = browser.querySelector('[data-major-browser-copy]');
  const countEl = browser.querySelector('[data-major-browser-count]');
  const filtersBox = browser.querySelector('[data-major-browser-filters]');
  const moreBox = browser.querySelector('[data-major-browser-more]');
  const PAGE_SIZE = 12;
  let activeFilter = 'all';
  let visibleLimit = PAGE_SIZE;

  const categoryMeta = {
    all:['All Works','나인웍스의 주요 프로젝트와 유형별 제작 아카이브를 한 곳에서 확인할 수 있습니다.'],
    major:['Major Works','나인웍스의 기존 주요 포트폴리오를 모아둔 대표 작업 아카이브입니다.'],
    branding:['Branding Projects','브랜드 전략과 아이덴티티, 패키지와 확장 시스템을 포함한 브랜딩 프로젝트입니다.'],
    website:['Website / Site','기업과 브랜드의 목적에 맞춰 정보 구조, 화면 경험, 콘텐츠와 운영 환경까지 구축한 웹사이트 프로젝트입니다.'],
    system:['System Build','회원관리, 예약, CRM, 관리자 페이지 등 실제 운영 기능과 데이터 흐름을 설계·구축한 시스템 프로젝트입니다.'],
    detailpage:['Detail Page','상세페이지 전용 부속 페이지에서 전체 작업을 확인할 수 있습니다.'],
    editorial:['Editorial Design','브로셔, 카탈로그, 리플렛, 회사소개서, 전시 인쇄물과 교육 자료 등 편집 디자인 작업입니다.'],
    ir:['IR / PPT','사업계획, 투자제안, 서비스 소개와 발표를 위한 IR·PPT·프레젠테이션 디자인 아카이브입니다.'],
    package:['Package Design','패키지 전용 부속 페이지에서 전체 작업을 확인할 수 있습니다.'],
    event:['Event Design','행사, 전시, 팝업과 데모데이 등 오프라인 브랜드 경험을 위한 이벤트 비주얼 프로젝트입니다.']
  };
  const labels = {all:'ALL',major:'MAJOR',branding:'BRANDING',website:'WEBSITE',system:'SYSTEM',detailpage:'DETAIL PAGE',editorial:'EDITORIAL',ir:'IR / PPT',package:'PACKAGE',event:'EVENT'};
  const escapeHTML = (value='') => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');

  const uniqueCases=[]; const seen=new Set();
  (Array.isArray(window.NW_PORTFOLIO)?window.NW_PORTFOLIO:[]).forEach((project)=>{
    if(!project)return; const key=`${project.client||''}|${project.title||''}`.toLowerCase(); if(seen.has(key))return; seen.add(key);
    uniqueCases.push({...project,archive:false,filters:[...new Set(['major',...(Array.isArray(project.filters)?project.filters:[])])]});
  });
  const sourceOrder=(item)=>{const explicit=Number(item?.order??item?.sourceOrder??item?.index);if(Number.isFinite(explicit)&&explicit>0)return explicit;const match=String(item?.id||'').match(/(\d+)(?!.*\d)/);return match?Number(match[1]):0;};
  const packagePriority=(item)=>{const text=`${item?.title||''} ${item?.subtitle||''}`.toLowerCase();if(/hollys|할리스/.test(text))return 300;if(/yonsei|연세|kids\s?ten|키즈텐|healthd|헬씨드/.test(text))return 200;if(/gong\s?cha|공차/.test(text))return 100;return 0;};
  const visualArchives=(Array.isArray(window.NW_PORTFOLIO_ARCHIVE)?window.NW_PORTFOLIO_ARCHIVE:[]).map((item,index)=>({...item,__index:index})).sort((a,b)=>{const ap=(a.filters||[]).includes('package'),bp=(b.filters||[]).includes('package');if(ap&&bp){const p=packagePriority(b)-packagePriority(a);if(p)return p;const o=sourceOrder(b)-sourceOrder(a);if(o)return o;}return a.__index-b.__index;}).map(({__index,...item})=>({...item,archive:true}));
  const detailArchives=(Array.isArray(window.NW_DETAILPAGE_ARCHIVE)?window.NW_DETAILPAGE_ARCHIVE:[]).slice().sort((a,b)=>sourceOrder(b)-sourceOrder(a)).map((item)=>({...item,archive:true,filters:[...new Set(['detailpage',...(item.filters||[])])]}));
  const allArchives=[...visualArchives,...detailArchives]; const allWorks=[...uniqueCases,...allArchives];

  const detailMap={fineb:'/portfolio-fineb.html','tne-epc':'/portfolio-tne-epc.html',relim:'/portfolio-relim.html',aesost:'/portfolio-aesost.html',kekomi:'/portfolio-kekomi.html','the-petrichor':'/portfolio-the-petrichor.html',thomastone:'/portfolio-thomastone.html',recelleclore:'/portfolio-recelleclore.html','nineworks-crm':'/portfolio-detail.html?work=nineworks-crm'};
  const caseHref=(project)=>{if(detailMap[project.id])return detailMap[project.id];const explicit=String(project.detailUrl||'').trim();if(explicit)return /^https?:\/\//i.test(explicit)||explicit.startsWith('/')?explicit:`/${explicit}`;return `/portfolio-detail.html?work=${encodeURIComponent(project.id||'')}`;};
  const thumb=(item)=>item.thumbnail||item.image||(Array.isArray(item.images)?item.images[0]:'')||'';
  const categoryLabel=(item)=>{const filters=Array.isArray(item.filters)?item.filters:[];return labels[filters.find((key)=>['website','system','detailpage','editorial','ir','package','event','branding'].includes(key))]||'PROJECT';};

  const cardMarkup=(item)=>{
    const title=escapeHTML(item.title||'Project'),subtitle=escapeHTML(item.subtitle||item.scope||''),image=escapeHTML(thumb(item)),label=escapeHTML(categoryLabel(item));
    if(item.archive){
      const filters=item.filters||[];
      if(filters.includes('package')) return `<article class="major-browser-card major-browser-card--archive"><a class="major-browser-card__link" href="./package.html?work=${encodeURIComponent(item.id||'')}"><div class="major-browser-card__media"><img src="${image}" alt="${title}" loading="lazy"></div><div class="major-browser-card__info"><div><strong>${title}</strong><p>${subtitle}</p></div><span>${label}</span></div></a></article>`;
      if(filters.includes('detailpage')) return `<article class="major-browser-card major-browser-card--archive"><a class="major-browser-card__link" href="./detailpage.html?work=${encodeURIComponent(item.id||'')}"><div class="major-browser-card__media"><img src="${image}" alt="${title}" loading="lazy"></div><div class="major-browser-card__info"><div><strong>${title}</strong><p>${subtitle}</p></div><span>${label}</span></div></a></article>`;
      return `<article class="major-browser-card major-browser-card--archive"><a class="major-browser-card__link" href="#quick-view" data-major-archive-id="${escapeHTML(item.id)}"><div class="major-browser-card__media"><img src="${image}" alt="${title}" loading="lazy"></div><div class="major-browser-card__info"><div><strong>${title}</strong><p>${subtitle}</p></div><span>${label}</span></div></a></article>`;
    }
    return `<article class="major-browser-card"><a class="major-browser-card__link" href="${escapeHTML(caseHref(item))}"><div class="major-browser-card__media"><img src="${image}" alt="${title}" loading="lazy"></div><div class="major-browser-card__info"><div><strong>${title}</strong><p>${subtitle}</p></div><span>${label}</span></div></a></article>`;
  };
  const matchingWorks=()=>activeFilter==='all'?allWorks:allWorks.filter((item)=>(item.filters||[]).includes(activeFilter));
  const render=(reset=true)=>{
    if(reset)visibleLimit=PAGE_SIZE; const items=matchingWorks(),visible=items.slice(0,visibleLimit),meta=categoryMeta[activeFilter]||categoryMeta.all;
    if(titleEl)titleEl.textContent=meta[0]; if(copyEl)copyEl.textContent=meta[1]; if(countEl)countEl.textContent=`${String(items.length).padStart(2,'0')} WORKS`;
    if(grid)grid.innerHTML=visible.length?visible.map(cardMarkup).join(''):'<div class="major-browser__empty">이 카테고리에 등록된 작업이 없습니다.</div>';
    filtersBox?.querySelectorAll('[data-major-browser-filter]').forEach((button)=>button.classList.toggle('is-active',button.dataset.majorBrowserFilter===activeFilter));
    document.querySelectorAll('.major-portfolio-nav__types [data-major-browser-filter]').forEach((link)=>link.classList.toggle('is-active',link.dataset.majorBrowserFilter===activeFilter));
    if(moreBox){const remaining=Math.max(0,items.length-visibleLimit);moreBox.hidden=remaining===0;const button=moreBox.querySelector('button');if(button)button.textContent=remaining>0?`MORE WORKS · ${Math.min(PAGE_SIZE,remaining)}개 더보기`:'MORE WORKS';}
  };

  if(filtersBox){filtersBox.innerHTML=Object.keys(labels).map((key)=>key==='package'?`<a href="./package.html">${labels[key]} ↗</a>`:key==='detailpage'?`<a href="./detailpage.html">${labels[key]} ↗</a>`:`<button type="button" data-major-browser-filter="${key}">${labels[key]}</button>`).join('');}
  const openFilter=(filter)=>{if(filter==='package'){location.href='./package.html';return;}if(filter==='detailpage'){location.href='./detailpage.html';return;}activeFilter=categoryMeta[filter]?filter:'all';render(true);browser.scrollIntoView({behavior:'smooth',block:'start'});};

  const quickView=document.createElement('div');quickView.className='major-browser-modal';quickView.setAttribute('aria-hidden','true');quickView.innerHTML=`<div class="major-browser-modal__head"><div><span>NINEWORKS / PORTFOLIO ARCHIVE</span><h2 data-major-quick-title></h2></div><button class="major-browser-modal__close" type="button" data-major-quick-close>×</button></div><div class="major-browser-modal__stage" data-major-quick-stage></div><div class="major-browser-modal__foot"><span data-major-quick-category>VISUAL ARCHIVE</span><span data-major-quick-count>01 IMAGE</span></div>`;document.body.appendChild(quickView);
  const closeQuickView=()=>{quickView.classList.remove('is-open');quickView.setAttribute('aria-hidden','true');document.body.classList.remove('is-major-browser-modal-open');};
  function openQuickView(item){if(!item)return;const images=Array.isArray(item.images)&&item.images.length?item.images:[item.image||item.thumbnail].filter(Boolean);quickView.querySelector('[data-major-quick-title]').textContent=item.title||'Project';quickView.querySelector('[data-major-quick-category]').textContent=categoryLabel(item);quickView.querySelector('[data-major-quick-count]').textContent=`${String(images.length).padStart(2,'0')} IMAGE${images.length>1?'S':''}`;quickView.querySelector('[data-major-quick-stage]').innerHTML=images.map((src,index)=>`<figure><img src="${escapeHTML(src)}" alt="${escapeHTML(item.title||'Project')} ${index+1}" loading="${index===0?'eager':'lazy'}"></figure>`).join('');quickView.classList.add('is-open');quickView.setAttribute('aria-hidden','false');document.body.classList.add('is-major-browser-modal-open');quickView.querySelector('[data-major-quick-stage]').scrollTop=0;}
  window.NW_MAJORPORTFOLIO_OPEN_ARCHIVE=openQuickView;
  quickView.querySelector('[data-major-quick-close]')?.addEventListener('click',closeQuickView);quickView.addEventListener('click',(event)=>{if(event.target===quickView)closeQuickView();});

  const inquiry=document.createElement('div');inquiry.className='major-inquiry-modal';inquiry.setAttribute('aria-hidden','true');inquiry.innerHTML=`<div class="major-inquiry-modal__dialog" role="dialog" aria-modal="true"><button class="major-inquiry-modal__close" type="button" data-major-inquiry-close>×</button><p class="eyebrow">NINEWORKS / PROJECT INQUIRY</p><h2>프로젝트 문의</h2><p class="major-inquiry-modal__intro">프로젝트 관련 문의나 필요한 포트폴리오 자료가 있다면 아래 방법으로 편하게 연락해 주세요.</p><div class="major-inquiry-modal__options"><a class="major-inquiry-option" href="sms:01054225650"><span>MESSAGE</span><div><strong>010-5422-5650</strong><p>빠른 확인이 필요하시면 문자로 문의해 주세요.</p></div><b>→</b></a><a class="major-inquiry-option" href="mailto:info@9works.kr?subject=NINEWORKS%20프로젝트%20문의"><span>EMAIL</span><div><strong>info@9works.kr</strong><p>프로젝트 내용과 필요한 자료를 메일로 보내주세요.</p></div><b>→</b></a></div><p class="major-inquiry-modal__note">문의 내용을 확인한 뒤 가능한 범위와 진행 방법을 안내드립니다.</p></div>`;document.body.appendChild(inquiry);
  const openInquiry=()=>{inquiry.classList.add('is-open');inquiry.setAttribute('aria-hidden','false');document.body.classList.add('is-major-inquiry-open');};const closeInquiry=()=>{inquiry.classList.remove('is-open');inquiry.setAttribute('aria-hidden','true');document.body.classList.remove('is-major-inquiry-open');};inquiry.querySelector('[data-major-inquiry-close]')?.addEventListener('click',closeInquiry);inquiry.addEventListener('click',(event)=>{if(event.target===inquiry)closeInquiry();});

  document.addEventListener('click',(event)=>{const filterTrigger=event.target.closest('[data-major-browser-filter]');if(filterTrigger){event.preventDefault();openFilter(filterTrigger.dataset.majorBrowserFilter||'all');return;}const archiveTrigger=event.target.closest('[data-major-archive-id]');if(archiveTrigger){event.preventDefault();openQuickView(allArchives.find((work)=>String(work.id)===String(archiveTrigger.dataset.majorArchiveId)));return;}const inquiryTrigger=event.target.closest('[data-major-inquiry-open]');if(inquiryTrigger){event.preventDefault();openInquiry();}});
  moreBox?.querySelector('button')?.addEventListener('click',()=>{visibleLimit+=PAGE_SIZE;render(false);});
  document.addEventListener('keydown',(event)=>{if(event.key!=='Escape')return;if(inquiry.classList.contains('is-open'))closeInquiry();if(quickView.classList.contains('is-open'))closeQuickView();});

  const urlFilter=new URLSearchParams(location.search).get('filter');
  if(urlFilter&&categoryMeta[urlFilter]&&!['package','detailpage'].includes(urlFilter)) activeFilter=urlFilter;
  render(true);
  if(urlFilter&&location.hash==='#portfolio-browser') window.setTimeout(()=>browser.scrollIntoView({behavior:'auto',block:'start'}),60);
})();

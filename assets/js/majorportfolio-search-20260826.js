(() => {
  const main = document.querySelector('.major-shell main');
  const hero = main?.querySelector('.major-hero');
  if (!main || !hero) return;

  const dedicatedPages = {
    website:'./website.html', system:'./system.html', detailpage:'./detailpage.html', editorial:'./editorial.html', ir:'./ir.html', package:'./package.html', event:'./event.html'
  };
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-major-browser-filter]');
    if (!trigger) return;
    const page = dedicatedPages[trigger.dataset.majorBrowserFilter || ''];
    if (!page) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href = page;
  }, true);

  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const normalize = (value = '') => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');

  const search = document.createElement('section');
  search.className = 'major-search';
  search.dataset.majorSearch = 'true';
  search.innerHTML = `<div class="container"><div class="major-search__inner"><p class="eyebrow">SEARCH / RELATED PORTFOLIO</p><h2>관련 포트폴리오를 검색해 보세요.</h2><p class="major-search__lead">업종, 브랜드, 작업 유형이나 필요한 결과물을 입력하면 현재 포트폴리오 데이터에서 관련 작업을 찾아 보여드립니다.</p><form class="major-search__box" data-major-search-form><input type="search" data-major-search-input placeholder="예: 카페, 뷰티, 할리스, 패키지, 웹사이트, 브로셔" autocomplete="off"><button type="submit">SEARCH</button></form><div class="major-search__keywords" data-major-search-keywords></div><div class="major-search__related" data-major-search-related></div><div class="major-search__results" data-major-search-results hidden><div class="major-search__status"><strong data-major-search-title>Search Result</strong><span data-major-search-count>00 WORKS</span></div><div class="major-search__grid" data-major-search-grid></div></div></div></div>`;
  main.insertBefore(search, hero);

  const input=search.querySelector('[data-major-search-input]'),form=search.querySelector('[data-major-search-form]'),keywordsBox=search.querySelector('[data-major-search-keywords]'),relatedBox=search.querySelector('[data-major-search-related]'),results=search.querySelector('[data-major-search-results]'),grid=search.querySelector('[data-major-search-grid]'),count=search.querySelector('[data-major-search-count]'),resultTitle=search.querySelector('[data-major-search-title]');

  const keywordGroups={'카페':['coffee','cafe','café','bakery','커피','베이커리','브런치','말차'],'식품':['food','snack','protein','coffee','milk','bread','ginseng','tea','yogurt','식품','홍삼','음료','젤리'],'뷰티':['beauty','skincare','cosmetic','ampoule','toner','cream','shower','body','뷰티','화장품','스킨','앰플','토너'],'건강':['health','protein','ginseng','supplement','vitamin','건강','홍삼','영양','비타민'],'반려동물':['pet','dog','puppy','반려','강아지','펫'],'패키지':['package','패키지','박스','용기','라벨'],'웹사이트':['website','site','develop','digital','web','웹사이트','사이트','홈페이지'],'시스템':['system','crm','admin','reservation','member','firebase','시스템','관리자','예약','회원'],'상세페이지':['detailpage','detail page','commerce','상세페이지','상세'],'브로셔':['editorial','brochure','catalog','leaflet','리플렛','브로셔','카탈로그','소개서'],'IR / PPT':['ir','ppt','presentation','proposal','제안서','발표','투자'],'행사':['event','exhibition','popup','demo day','행사','전시','팝업','데모데이']};
  const suggested=['카페','식품','뷰티','패키지','웹사이트','시스템','브로셔','행사'];
  keywordsBox.innerHTML=suggested.map((key)=>`<button type="button" data-major-search-keyword="${escapeHTML(key)}">${escapeHTML(key)}</button>`).join('');

  const cases=[];const seen=new Set();(Array.isArray(window.NW_PORTFOLIO)?window.NW_PORTFOLIO:[]).forEach((project)=>{const key=`${project?.client||''}|${project?.title||''}`.toLowerCase();if(!project||seen.has(key))return;seen.add(key);cases.push({...project,archive:false});});
  const visual=(Array.isArray(window.NW_PORTFOLIO_ARCHIVE)?window.NW_PORTFOLIO_ARCHIVE:[]).map((item)=>({...item,archive:true}));
  const detail=(Array.isArray(window.NW_DETAILPAGE_ARCHIVE)?window.NW_DETAILPAGE_ARCHIVE:[]).map((item)=>({...item,archive:true,filters:[...new Set(['detailpage',...(item.filters||[])])]}));
  const allWorks=[...cases,...visual,...detail];

  const detailMap={fineb:'/portfolio-fineb.html','tne-epc':'/portfolio-tne-epc.html',relim:'/portfolio-relim.html',aesost:'/portfolio-aesost.html',kekomi:'/portfolio-kekomi.html','the-petrichor':'/portfolio-the-petrichor.html',thomastone:'/portfolio-thomastone.html',recelleclore:'/portfolio-recelleclore.html'};
  const caseHref=(item)=>{if((item.filters||[]).includes('system'))return './system.html';if(detailMap[item.id])return detailMap[item.id];const explicit=String(item.detailUrl||'').trim();if(explicit)return /^https?:\/\//i.test(explicit)||explicit.startsWith('/')?explicit:`/${explicit}`;return `/portfolio-detail.html?work=${encodeURIComponent(item.id||'')}`;};
  const thumb=(item)=>item.thumbnail||item.image||(Array.isArray(item.images)?item.images[0]:'')||'';
  const primaryFilter=(item)=>(item.filters||[]).find((key)=>['package','detailpage','website','system','editorial','ir','event','branding'].includes(key))||'project';
  const labelFor=(item)=>({package:'PACKAGE',detailpage:'DETAIL PAGE',website:'WEBSITE',system:'SYSTEM',editorial:'EDITORIAL',ir:'IR / PPT',event:'EVENT',branding:'BRANDING'})[primaryFilter(item)]||'PROJECT';
  const textFor=(item)=>normalize([item.title,item.client,item.subtitle,item.scope,item.category,(item.filters||[]).join(' ')].filter(Boolean).join(' '));
  const tokensForQuery=(query)=>{const q=normalize(query);const tokens=new Set(q.split(' ').filter(Boolean));Object.entries(keywordGroups).forEach(([label,aliases])=>{if(q.includes(normalize(label))||aliases.some((alias)=>q.includes(normalize(alias)))){tokens.add(normalize(label));aliases.forEach((alias)=>tokens.add(normalize(alias)));}});return [...tokens];};
  const scoreItem=(item,query)=>{const q=normalize(query),text=textFor(item),title=normalize(item.title),client=normalize(item.client);let score=0;if(title.includes(q))score+=120;if(client.includes(q))score+=100;if(text.includes(q))score+=70;tokensForQuery(query).forEach((token)=>{if(!token)return;if(title.includes(token))score+=18;else if(client.includes(token))score+=15;else if(text.includes(token))score+=7;});return score;};
  const archivePageFor=(item)=>{const f=item.filters||[];if(f.includes('package'))return './package.html';if(f.includes('detailpage'))return './detailpage.html';if(f.includes('editorial'))return './editorial.html';if(f.includes('ir'))return './ir.html';if(f.includes('event'))return './event.html';return '';};
  const hrefFor=(item)=>{if(!item.archive)return caseHref(item);const page=archivePageFor(item);return page?`${page}?work=${encodeURIComponent(item.id||'')}`:'#portfolio-browser';};
  const cardMarkup=(item)=>{const href=hrefFor(item);const isInternal=item.archive&&!archivePageFor(item);const archiveAttr=isInternal?` data-major-search-archive-id="${escapeHTML(item.id||'')}"`:'';const systemCase=!item.archive&&(item.filters||[]).includes('system');const newTab=!item.archive&&!systemCase;return `<article class="major-search-card"><a href="${escapeHTML(href)}"${archiveAttr}${newTab?' target="_blank" rel="noopener"':''}><figure class="major-search-card__media"><img src="${escapeHTML(thumb(item))}" alt="${escapeHTML(item.title||'Project')}" loading="lazy"></figure><div class="major-search-card__info"><div><strong>${escapeHTML(item.title||'Project')}</strong><p>${escapeHTML(item.client||item.subtitle||item.scope||'')}</p></div><span>${escapeHTML(labelFor(item))}</span></div></a></article>`;};
  const relatedKeywords=(query)=>{const q=normalize(query),matched=[];Object.entries(keywordGroups).forEach(([label,aliases])=>{if(normalize(label).includes(q)||q.includes(normalize(label))||aliases.some((alias)=>normalize(alias).includes(q)||q.includes(normalize(alias))))matched.push(label);});return [...new Set(matched)].slice(0,5);};
  const runSearch=(query)=>{const q=normalize(query);if(!q){results.hidden=true;relatedBox.classList.remove('is-visible');relatedBox.innerHTML='';return;}const ranked=allWorks.map((item)=>({item,score:scoreItem(item,q)})).filter((row)=>row.score>0).sort((a,b)=>b.score-a.score).slice(0,12).map((row)=>row.item);const related=relatedKeywords(q);relatedBox.innerHTML=related.length?`<span>RELATED</span>${related.map((key)=>`<button type="button" data-major-search-keyword="${escapeHTML(key)}">${escapeHTML(key)}</button>`).join('')}`:'';relatedBox.classList.toggle('is-visible',related.length>0);results.hidden=false;resultTitle.textContent=`“${query.trim()}” 관련 포트폴리오`;count.textContent=`${String(ranked.length).padStart(2,'0')} WORKS`;grid.innerHTML=ranked.length?ranked.map(cardMarkup).join(''):'<div class="major-search__empty">관련 포트폴리오를 찾지 못했습니다. 다른 키워드로 검색해 주세요.</div>';};

  form.addEventListener('submit',(event)=>{event.preventDefault();runSearch(input.value);});
  input.addEventListener('input',()=>{if(!normalize(input.value))runSearch('');});
  search.addEventListener('click',(event)=>{const keyword=event.target.closest('[data-major-search-keyword]');if(keyword){input.value=keyword.dataset.majorSearchKeyword||'';runSearch(input.value);return;}const archive=event.target.closest('[data-major-search-archive-id]');if(archive){event.preventDefault();const item=allWorks.find((work)=>String(work.id)===String(archive.dataset.majorSearchArchiveId));if(typeof window.NW_MAJORPORTFOLIO_OPEN_ARCHIVE==='function')window.NW_MAJORPORTFOLIO_OPEN_ARCHIVE(item);}});
})();

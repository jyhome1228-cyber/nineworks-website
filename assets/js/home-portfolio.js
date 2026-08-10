(() => {
  const style = document.createElement('style');
  style.textContent = `
    @media (min-width:1081px){
      .hero + .section .project-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(16px,1.4vw,24px)!important;align-items:stretch}
      .hero + .section .project-card{grid-column:auto!important;height:100%;min-width:0}
      .hero + .section .project-card__link{display:flex;height:100%;flex-direction:column}
      .hero + .section .project-card .project-visual{width:100%;min-height:0!important;aspect-ratio:16/10;flex:0 0 auto}
      .hero + .section .project-card__meta{min-height:54px;flex:1 0 auto}
    }
    @media (max-width:1080px) and (min-width:761px){.hero + .section .project-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}.hero + .section .project-card{grid-column:auto!important}}
    @media (max-width:760px){.hero + .section .project-grid{display:grid!important;grid-template-columns:1fr!important}.hero + .section .project-card{grid-column:1!important}}
  `;
  document.head.appendChild(style);

  const hero = document.querySelector('main .hero');
  if (hero) {
    ['.home-brand-signal','.home-design-motion','.home-practice-grid','.home-practice-field','.home-practice-caption'].forEach((selector) => hero.querySelector(selector)?.remove());

    const title = hero.querySelector('.display-title');
    if (title) title.innerHTML = 'We design<br>how brands<br>are seen.';

    const descriptor = hero.querySelector('.hero__descriptor');
    if (descriptor) descriptor.textContent = '브랜드가 무엇으로 기억되어야 하는지부터 정의합니다. 아이덴티티, 패키지, 디지털과 에디토리얼을 하나의 시각 언어로 연결합니다.';
    hero.querySelector('.hero__meta')?.remove();

    const accents = ['#8b4637','#315d48','#31597d','#9a6b23','#6d4c64','#47636b'];
    const groups = [
      {title:'01 / Strategy',lead:'Brand Strategy',terms:['Research & Audit','Positioning','Brand Architecture','Naming','Verbal Identity']},
      {title:'02 / Identity',lead:'Identity Systems',terms:['Logotype','Typography','Color Systems','Graphic Language','Brand Guidelines']},
      {title:'03 / Package',lead:'Packaging',terms:['Structural Package','Container Design','Label Design','Product Graphic','Print Production']},
      {title:'04 / Editorial',lead:'Editorial',terms:['Company Profile','IR / Proposal','Catalog','Brochure','Publication']},
      {title:'05 / Digital',lead:'Digital Experience',terms:['Website','UX / UI','Landing Page','Detail Page','Commerce']},
      {title:'06 / Content',lead:'Art Direction',terms:['Key Visual','Photography Direction','Product Visual','Social Content','Motion']},
      {title:'07 / Space',lead:'Spatial Graphic',terms:['Signage','Exhibition','Retail Visual','Pop-up Graphic','Wayfinding']},
      {title:'08 / Corporate',lead:'Communication Design',terms:['Presentation','Sales Kit','Infographic','Recruitment Visual','Internal System']},
      {title:'09 / Growth',lead:'Brand Renewal',terms:['Launch System','Campaign System','Content Guideline','Design Operation','Asset Library']}
    ];

    const grid = document.createElement('div');
    grid.className = 'home-practice-grid';
    grid.setAttribute('aria-hidden','true');

    const field = document.createElement('div');
    field.className = 'home-practice-field';
    field.setAttribute('aria-label','NINEWORKS design practice index');
    const columns = [groups.slice(0,3), groups.slice(3,6), groups.slice(6,9)];
    field.innerHTML = columns.map((column, columnIndex) => `
      <div class="home-practice-column">
        ${column.map((group, groupIndex) => {
          const baseIndex = columnIndex * 3 + groupIndex;
          return `<section class="home-practice-group">
            <p class="home-practice-group__head"><span>${group.title}</span><span>06 fields</span></p>
            <div class="home-practice-terms">
              <a class="home-practice-word home-practice-word--lead" href="solutions.html" style="--accent:${accents[baseIndex % accents.length]}">${group.lead}</a>
              ${group.terms.map((term,index) => `<a class="home-practice-word${index===0?' home-practice-word--sub':''}${index===4?' home-practice-word--light':''}" href="solutions.html" style="--accent:${accents[(baseIndex+index+1) % accents.length]}">${term}</a>`).join('')}
            </div>
          </section>`;
        }).join('')}
      </div>`).join('');

    const caption = document.createElement('div');
    caption.className = 'home-practice-caption';
    caption.innerHTML = '<strong>Practice Index / 54</strong><span>Strategy · Identity · Package · Editorial · Digital · Content · Space · Corporate · Growth</span>';
    hero.prepend(grid);
    hero.appendChild(field);
    hero.appendChild(caption);
  }

  const grid = document.querySelector('main .project-grid');
  const projects = [
    { id:'wooje-stay', title:'WOOJE STAY', meta:'Brand Identity · Hospitality', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/12f3c9f6011ab.png' },
    { id:'ouga', title:'OUGA', meta:'Brand Identity · Package', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/7b326d236b1ba.png' },
    { id:'centellian-24', title:'CENTELLIAN 24+', meta:'Digital · Marketing Visual', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/bd7f0703ebd2e.png' },
    { id:'hollys', title:'HOLLYS Stick Coffee', meta:'Package · Product Visual', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/793a62ff30cd6.png' },
    { id:'cocos-matcha', title:'COCO’S MATCHA', meta:'Brand Identity · Package', image:'https://cdn-bastani.stunning.kr/prod/portfolios/92856d14-cbba-46cb-97d4-9277c858b3e2/contents/ZftZjx3mbGhKTq7o.635fe987-75e2-45db-af68-1123111b2dcd.png' },
    { id:'chapter', title:'CHAPTER Coffee House', meta:'Brand Identity · Space', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/2b58cb265ac74.png' }
  ];
  if (grid) {
    grid.innerHTML = projects.map((project) => `<article class="project-card reveal is-visible"><a class="project-card__link" href="portfolio-detail.html?work=${encodeURIComponent(project.id)}"><div class="project-card__visual project-visual home-project-media"><img src="${project.image}" alt="${project.title}" loading="lazy"></div><div class="project-card__meta"><strong>${project.title}</strong><span class="project-card__category">${project.meta}</span></div></a></article>`).join('');
    const allLink = grid.closest('section')?.querySelector('a.text-link');
    if (allLink) { allLink.href='portfolio.html'; allLink.innerHTML='VIEW ALL PORTFOLIO <span>↗</span>'; }
  }

  const aboutLead = document.querySelector('.about-preview__body .lead');
  if (aboutLead) aboutLead.textContent = '나인웍스는 브랜드의 생각을 선명한 시각 기준으로 만들고, 그 기준이 제품과 화면, 콘텐츠와 인쇄물에서 같은 인상으로 이어지도록 설계합니다.';

  /* Home capability section mirrors the nine services on Solutions. */
  const serviceTabs = document.querySelector('.service-tabs');
  const serviceSection = serviceTabs?.closest('section');
  if (serviceTabs && serviceSection) {
    const serviceIntro = serviceSection.querySelector('.split-copy__right');
    if (serviceIntro) serviceIntro.textContent = '브랜드의 시작과 정체성부터 제품, 화면, 커뮤니케이션과 실제 공간까지. 필요한 업무를 단독으로 진행하거나 하나의 프로젝트 안에서 통합해 설계합니다.';

    const services = [
      {key:'branding',name:'Brand Strategy & Identity',copy:'시장과 고객, 경쟁 환경을 바탕으로 브랜드의 위치와 인상을 정의하고 네이밍, 로고, 컬러와 시각 시스템을 구축합니다.',items:'Research · Naming · Verbal Identity · Logo · Brand Guideline'},
      {key:'package',name:'Package Design',copy:'제품의 특성과 생산 조건을 함께 고려해 용기, 라벨, 박스와 지류를 하나의 패키지 시스템으로 설계합니다.',items:'Container · Label · Box · Print Spec · Production Guide'},
      {key:'editorial',name:'Editorial Design',copy:'복잡한 정보를 읽기 쉬운 구조로 바꾸고 회사소개서, IR, 카탈로그와 브로슈어를 명확한 편집 체계로 만듭니다.',items:'Company Profile · IR · Catalog · Brochure · Publication'},
      {key:'website',name:'Website Design',copy:'브랜드의 정보 구조와 콘텐츠 흐름을 정리하고 데스크톱과 모바일에서 일관된 브랜드 경험을 구축합니다.',items:'IA · Wireframe · Responsive UI · Brand Content · Publishing Direction'},
      {key:'uiux',name:'UX / UI Design',copy:'서비스 기능과 사용 흐름을 구조화해 복잡한 프로그램과 관리 화면을 이해하기 쉬운 인터페이스로 전환합니다.',items:'User Flow · Wireframe · UI System · Component · Admin Interface'},
      {key:'commerce',name:'Commerce & Marketing',copy:'제품의 핵심 소구점과 구매 흐름을 기준으로 상세페이지, 썸네일과 캠페인 콘텐츠의 정보 구조를 설계합니다.',items:'Detail Page · Key Message · Thumbnail · Banner · Conversion Content'},
      {key:'visual',name:'Product Visualization',copy:'제품과 패키지의 형태, 재질과 사용 장면을 바탕으로 목업, 키비주얼과 연출 이미지를 제작합니다.',items:'Mockup · Key Visual · Product Image · Campaign Visual · AI Direction'},
      {key:'corporate',name:'Corporate Communication',copy:'기업과 기관이 반복적으로 사용하는 제안서, 발표자료, 리포트와 운영물을 하나의 커뮤니케이션 체계로 정리합니다.',items:'Proposal · Presentation · Report · Template · Operation Guide'},
      {key:'space',name:'Spatial & Offline Visual',copy:'온라인에서 만들어진 브랜드의 인상을 팝업, 매장, 전시와 행사 현장까지 일관되게 확장합니다.',items:'Signage · Wayfinding · Pop-up · Exhibition · Retail Graphic'}
    ];

    serviceTabs.innerHTML = services.map((s,i) => `<button class="service-tab${i===0?' is-active':''}" type="button" data-service-tab="${s.key}"><span>${String(i+1).padStart(2,'0')}</span><span class="service-tab__name">${s.name}</span><span class="service-tab__mark">↗</span></button>`).join('');
    serviceSection.querySelectorAll('[data-service-panel]').forEach((panel) => panel.remove());
    services.forEach((s,i) => {
      const panel = document.createElement('div');
      panel.className = `service-panel${i===0?' is-active':''}`;
      panel.dataset.servicePanel = s.key;
      panel.innerHTML = `<p class="lead">${s.copy}</p><p class="service-panel__services">${s.items}</p>`;
      serviceSection.appendChild(panel);
    });

    const tabs = serviceTabs.querySelectorAll('[data-service-tab]');
    const panels = serviceSection.querySelectorAll('[data-service-panel]');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      const target = tab.dataset.serviceTab;
      tabs.forEach((item) => item.classList.toggle('is-active', item === tab));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.servicePanel === target));
    }));
  }

  const archiveGrid = document.querySelector('.archive-grid');
  if (archiveGrid) {
    const archive = [
      { id:'vaquer', title:'VAQUER', meta:'Home Fragrance · Brand & Package', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/7084375b7986a.png' },
      { id:'eat', title:'%EAT', meta:'Pet Food · Brand & Package', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/65b7ff1d94064.png' },
      { id:'breeze-coffee', title:'Breeze Coffee', meta:'Coffee Salon · Brand System', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/5c12e36ae2396.png' }
    ];
    archiveGrid.classList.add('home-archive-grid');
    archiveGrid.innerHTML = archive.map((project) => `<article class="home-archive-card reveal is-visible"><a href="portfolio-detail.html?work=${encodeURIComponent(project.id)}"><figure class="home-archive-card__media"><img src="${project.image}" alt="${project.title}" loading="lazy"></figure><div class="home-archive-card__info"><strong>${project.title}</strong><span>${project.meta}</span></div></a></article>`).join('');
  }

  const magazineItems = document.querySelectorAll('.magazine-list .magazine-item');
  const magazine = [
    { id:'greencar-rebranding', title:'브랜드가 정체성이 아닌 소속감을 택할 때, 그린카 이야기', meta:'Brand Strategy' },
    { id:'granhand-verbal-branding', title:'말로 빚어낸 향기, 그랑핸드의 버벌 브랜딩', meta:'Brand Story' },
    { id:'nudeake', title:'손톱만 한 크로와상을 드셔보셨나요?', meta:'Retail Experience' }
  ];
  magazineItems.forEach((item,index) => {
    const data=magazine[index];
    if(!data) return;
    item.href=`magazine-detail.html?article=${encodeURIComponent(data.id)}`;
    const titleEl=item.querySelector('.magazine-item__title');
    const metaEl=item.querySelector('.magazine-item__meta');
    if(titleEl) titleEl.textContent=data.title;
    if(metaEl) metaEl.textContent=data.meta;
  });
})();

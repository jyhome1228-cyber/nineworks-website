(() => {
  /* Home-only editorial rhythm. Kept in JS so it follows the dynamically rendered cards. */
  const style = document.createElement('style');
  style.textContent = `
    @media (min-width:1081px){
      .hero + .section .project-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(16px,1.4vw,24px)}
      .hero + .section .project-card:nth-child(1){grid-column:span 7}
      .hero + .section .project-card:nth-child(2){grid-column:span 5}
      .hero + .section .project-card:nth-child(3){grid-column:span 5}
      .hero + .section .project-card:nth-child(4){grid-column:span 7}
      .hero + .section .project-card:nth-child(5){grid-column:span 7}
      .hero + .section .project-card:nth-child(6){grid-column:span 5}
      .hero + .section .project-card .project-visual{aspect-ratio:16/10}
    }
    @media (max-width:1080px) and (min-width:761px){.hero + .section .project-card{grid-column:span 6!important}}
    @media (max-width:760px){.hero + .section .project-grid{grid-template-columns:1fr!important}.hero + .section .project-card{grid-column:1!important}}
  `;
  document.head.appendChild(style);

  const hero = document.querySelector('main .hero');
  if (hero) {
    hero.querySelector('.home-brand-signal')?.remove();
    hero.querySelector('.home-design-motion')?.remove();

    const descriptor = hero.querySelector('.hero__descriptor');
    if (descriptor) descriptor.textContent = '브랜드가 무엇으로 기억되어야 하는지부터 정의합니다. 아이덴티티, 패키지, 디지털과 에디토리얼을 하나의 시각 언어로 연결합니다.';

    const motion = document.createElement('div');
    motion.className = 'home-design-motion';
    motion.setAttribute('aria-hidden', 'true');
    motion.innerHTML = Array.from({ length: 4 }, (_, index) => `<span class="home-grid-dot home-grid-dot--${index + 1}"></span>`).join('');
    hero.prepend(motion);
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
    grid.innerHTML = projects.map((project) => `
      <article class="project-card reveal is-visible">
        <a class="project-card__link" href="portfolio-detail.html?work=${encodeURIComponent(project.id)}">
          <div class="project-card__visual project-visual home-project-media">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
          </div>
          <div class="project-card__meta">
            <strong>${project.title}</strong>
            <span class="project-card__category">${project.meta}</span>
          </div>
        </a>
      </article>`).join('');

    const section = grid.closest('section');
    const allLink = section?.querySelector('a.text-link');
    if (allLink) {
      allLink.href = 'portfolio.html';
      allLink.innerHTML = 'VIEW ALL PORTFOLIO <span>↗</span>';
    }
  }

  const aboutLead = document.querySelector('.about-preview__body .lead');
  if (aboutLead) aboutLead.textContent = '나인웍스는 브랜드의 생각을 선명한 시각 기준으로 만들고, 그 기준이 제품과 화면, 콘텐츠와 인쇄물에서 같은 인상으로 이어지도록 설계합니다.';

  const serviceSection = document.querySelector('.service-tabs')?.closest('section');
  const serviceIntro = serviceSection?.querySelector('.split-copy__right');
  if (serviceIntro) serviceIntro.textContent = '브랜드의 중심이 되는 아이덴티티에서 출발해 패키지, 디지털, 편집과 콘텐츠까지 실제 운영에 필요한 접점을 하나의 시각 체계로 연결합니다.';

  const archiveGrid = document.querySelector('.archive-grid');
  if (archiveGrid) {
    const archive = [
      { id:'vaquer', title:'VAQUER', meta:'Home Fragrance · Brand & Package', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/7084375b7986a.png' },
      { id:'eat', title:'%EAT', meta:'Pet Food · Brand & Package', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/65b7ff1d94064.png' },
      { id:'breeze-coffee', title:'Breeze Coffee', meta:'Coffee Salon · Brand System', image:'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/5c12e36ae2396.png' }
    ];

    archiveGrid.classList.add('home-archive-grid');
    archiveGrid.innerHTML = archive.map((project) => `
      <article class="home-archive-card reveal is-visible">
        <a href="portfolio-detail.html?work=${encodeURIComponent(project.id)}">
          <figure class="home-archive-card__media"><img src="${project.image}" alt="${project.title}" loading="lazy"></figure>
          <div class="home-archive-card__info"><strong>${project.title}</strong><span>${project.meta}</span></div>
        </a>
      </article>`).join('');
  }

  const magazineItems = document.querySelectorAll('.magazine-list .magazine-item');
  const magazine = [
    { id:'greencar-rebranding', title:'브랜드가 정체성이 아닌 소속감을 택할 때, 그린카 이야기', meta:'Brand Strategy' },
    { id:'granhand-verbal-branding', title:'말로 빚어낸 향기, 그랑핸드의 버벌 브랜딩', meta:'Brand Story' },
    { id:'nudeake', title:'손톱만 한 크로와상을 드셔보셨나요?', meta:'Retail Experience' }
  ];
  magazineItems.forEach((item, index) => {
    const data = magazine[index];
    if (!data) return;
    item.href = `magazine-detail.html?article=${encodeURIComponent(data.id)}`;
    const title = item.querySelector('.magazine-item__title');
    const meta = item.querySelector('.magazine-item__meta');
    if (title) title.textContent = data.title;
    if (meta) meta.textContent = data.meta;
  });
})();
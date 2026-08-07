(() => {
  const hero = document.querySelector('main .hero');
  if (hero) {
    hero.querySelector('.home-brand-signal')?.remove();
    hero.querySelector('.home-design-motion')?.remove();

    const motion = document.createElement('div');
    motion.className = 'home-design-motion';
    motion.setAttribute('aria-hidden', 'true');
    motion.innerHTML = Array.from({ length: 7 }, (_, index) => `<span class="home-grid-dot home-grid-dot--${index + 1}"></span>`).join('');
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
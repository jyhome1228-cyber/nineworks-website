(() => {
  const grid = document.querySelector('main .project-grid');
  if (!grid) return;

  const projects = [
    {
      id: 'wooje-stay',
      title: 'WOOJE STAY',
      meta: 'Brand Identity · Hospitality',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/12f3c9f6011ab.png'
    },
    {
      id: 'ouga',
      title: 'OUGA',
      meta: 'Brand Identity · Package',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/7b326d236b1ba.png'
    },
    {
      id: 'centellian-24',
      title: 'CENTELLIAN 24+',
      meta: 'Digital · Marketing Visual',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/bd7f0703ebd2e.png'
    },
    {
      id: 'hollys',
      title: 'HOLLYS Stick Coffee',
      meta: 'Package · Product Visual',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/793a62ff30cd6.png'
    },
    {
      id: 'cocos-matcha',
      title: 'COCO’S MATCHA',
      meta: 'Brand Identity · Package',
      image: 'https://cdn-bastani.stunning.kr/prod/portfolios/92856d14-cbba-46cb-97d4-9277c858b3e2/contents/ZftZjx3mbGhKTq7o.635fe987-75e2-45db-af68-1123111b2dcd.png'
    },
    {
      id: 'chapter',
      title: 'CHAPTER Coffee House',
      meta: 'Brand Identity · Space',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/2b58cb265ac74.png'
    }
  ];

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
})();
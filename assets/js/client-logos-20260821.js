(() => {
  const CLIENT_LOGOS = [
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/f9ef2a9bb36d8.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/b61e8fac4ce53.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/478b32cb3960b.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/a2db0561bb44b.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/1ac0c1a3e4d82.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/68e4e3c41ad70.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/337e23f4f39d5.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/2215862140f03.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/f21b45a83f0ce.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/c4f0a9d77b9c4.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/067424596ce31.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/75c6fa70df67e.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/0189c30eaaaeb.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/05e405c366726.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/c568a258457b2.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/051cbfd9be108.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/84f73642af655.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/0d99915431f4e.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/9d97d24322ff3.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/0d2c90e0f72e1.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/bfdfd22d0f140.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/c79c39dd93a7a.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/108df7d800453.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/c4c2cf5fef564.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/248b6db187852.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/222e34cf6419b.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/8398dafc94777.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/509b409520c48.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/b9120dc97a467.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/bf1663be8277b.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/1a29e76b36f6c.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/f8698eb68651c.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/537b5c9377374.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/57dded83e4eac.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/3d4470145245c.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/e89ba6e2a5b6e.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/4ce85ece19d9e.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/1d7bda7be4413.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/18b0ad9a3c696.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/819fcef3ff86f.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/f9005f1121a0b.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/0db871d9c95d3.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/73657127d63dd.jpg',
    'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/2e0d19dbd4113.jpg'
  ];

  const CLIENT_NAMES = [
    '한남대학교','생명보험사회공헌재단','한국벤처캐피탈협회','홍익대학교','Deloitte','한국예탁결제원','메가스터디','한양대학교','서울과학기술대학교','한국중소벤처기업유통원','대한적십자사','인천대학교','단국대학교','동원그룹','공차','할리스','한국토지주택공사 LH','공항철도 AREX','열매나눔재단','동국제약','경기도사회적경제원','인천스타트업파크','인천테크노파크','Brother','소상공인시장진흥공단'
  ];

  const makeEntries = () => CLIENT_LOGOS.map((src, index) => ({ src, index }));

  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const logoCard = (src, index, lazy = false) => {
    const item = document.createElement('div');
    item.className = 'nw-logo-card';
    const name = CLIENT_NAMES[index] || '';
    const image = document.createElement('img');
    image.src = src;
    image.alt = name ? `${name} 로고` : `나인웍스와 함께한 기업 로고 ${String(index + 1).padStart(2, '0')}`;
    image.decoding = 'async';
    if (lazy) image.loading = 'lazy';
    item.appendChild(image);
    if (name) item.title = name;
    return item;
  };

  const createGroup = (entries) => {
    const group = document.createElement('div');
    group.className = 'nw-logo-marquee__group';
    entries.forEach(({ src, index }) => group.appendChild(logoCard(src, index)));
    return group;
  };

  const createMarqueeRow = (entries, reverse = false) => {
    const row = document.createElement('div');
    row.className = `nw-logo-marquee${reverse ? ' nw-logo-marquee--reverse' : ''}`;
    const track = document.createElement('div');
    track.className = 'nw-logo-marquee__track';
    track.appendChild(createGroup(entries));
    track.appendChild(createGroup(entries));
    row.appendChild(track);
    return row;
  };

  const ensureHomeSection = () => {
    let section = document.querySelector('.nw-client-showcase');
    if (section) return section;
    const hero = document.querySelector('.nw-home-hero') || document.querySelector('body.home-clarity main > section:first-of-type');
    if (!hero) return null;
    section = document.createElement('section');
    section.className = 'nw-client-showcase';
    section.innerHTML = `
      <div class="container nw-client-showcase__head reveal">
        <div><p class="eyebrow">COMPANIES WE WORKED WITH</p><h2>함께한 기업들</h2></div>
        <p class="nw-client-showcase__copy">기업·브랜드·기관과 함께 브랜드 전략, 아이덴티티, 패키지,<br>디지털과 제작 프로젝트를 진행해 왔습니다.<br>브랜딩·디자인 관련 심사와 자문에도 참여하고 있습니다.</p>
      </div>
      <div class="nw-client-marquee" aria-label="나인웍스와 함께한 기업 로고"></div>`;
    hero.insertAdjacentElement('afterend', section);
    return section;
  };

  const renderHomeClients = () => {
    if (!document.body.classList.contains('home-clarity') && !document.querySelector('.nw-home-hero')) return;
    const section = ensureHomeSection();
    if (!section) return;
    const marquee = section.querySelector('.nw-client-marquee');
    if (!marquee || marquee.children.length) return;
    const entries = shuffle(makeEntries());
    const half = Math.ceil(entries.length / 2);
    marquee.appendChild(createMarqueeRow(entries.slice(0, half), false));
    marquee.appendChild(createMarqueeRow(entries.slice(half), true));
  };

  const renderAboutClients = () => {
    const cta = document.querySelector('.about-page main > .cta');
    if (!cta) return;
    let section = document.querySelector('.nw-about-clients');
    if (!section) {
      section = document.createElement('section');
      section.className = 'about-section nw-about-clients';
      section.innerHTML = `
        <div class="container about-split">
          <div class="about-index">06 / CLIENTS</div>
          <div class="about-content">
            <p class="eyebrow">COMPANIES WE WORKED WITH</p>
            <h2>함께한 기업들</h2>
            <p class="nw-about-clients__copy">나인웍스는 다양한 기업, 브랜드, 기관과 함께 브랜드 전략, 아이덴티티, 패키지,<br>웹사이트와 제작 프로젝트를 수행해 왔습니다.<br>또한 브랜딩·디자인 관련 심사와 자문에도 참여해 왔습니다.</p>
            <div class="nw-client-grid" aria-label="나인웍스와 함께한 기업 로고"></div>
          </div>
        </div>`;
      cta.insertAdjacentElement('beforebegin', section);
    }
    const grid = section.querySelector('.nw-client-grid');
    if (!grid || grid.children.length) return;
    shuffle(makeEntries()).forEach(({ src, index }) => grid.appendChild(logoCard(src, index, true)));
  };

  const init = () => { renderHomeClients(); renderAboutClients(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  window.addEventListener('load', init, { once: true });
  setTimeout(init, 250);
  setTimeout(init, 900);
})();

(() => {
  const FEATURED_WORKS = [
    {
      id: 'breeze-coffee', title: 'BREEZE COFFEE', meta: 'F&B · COFFEE · BRAND IDENTITY',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/5c12e36ae2396.png',
      description: 'Urban Coffee Salon Brand Design'
    },
    {
      id: 'roasting-visor', title: 'ROASTING VISOR', meta: 'F&B · COFFEE ROASTERY · PACKAGE',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/44d5a9269f304.png',
      description: 'Premium Coffee Roastery Brand Design'
    },
    {
      id: 'pour-and-bake', title: 'POUR AND BAKE', meta: 'F&B · CAFE · PACKAGE',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/5430ed49b4326.png',
      description: 'Coffee & Bakery Visual Identity Design'
    },
    {
      id: 'greedy-scent', title: 'GREEDY SCENT', meta: 'FRAGRANCE · BEAUTY · ART DIRECTION',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/5da11e3399d1d.png',
      description: 'Niche Fragrance Brand Design'
    },
    {
      id: 'wooje-stay', title: 'WOOJE STAY', meta: 'HOSPITALITY · BRAND IDENTITY',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/12f3c9f6011ab.png',
      description: 'Premium Hot Spring Hotel Brand Design'
    },
    {
      id: 'ouga', title: 'OUGA', meta: 'F&B · BRAND & PACKAGE',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/7b326d236b1ba.png',
      description: 'Premium Hanok Bakery Cafe Brand Design'
    },
    {
      id: 'hollys', title: 'HOLLYS STICK COFFEE', meta: 'F&B · PACKAGE DESIGN',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/793a62ff30cd6.png',
      description: 'Instant Stick Coffee Package & Product Visual Design'
    },
    {
      id: 'cocos-matcha', title: 'COCO’S MATCHA', meta: 'F&B · BRAND SYSTEM',
      image: 'https://cdn-bastani.stunning.kr/prod/portfolios/92856d14-cbba-46cb-97d4-9277c858b3e2/contents/ZftZjx3mbGhKTq7o.635fe987-75e2-45db-af68-1123111b2dcd.png',
      description: 'Matcha Café Brand & Package System Design'
    }
  ];

  const renderHomeFeaturedWorks = () => {
    if (!document.body.classList.contains('home-clarity')) return;

    const oldSlider = document.querySelector('[data-brand-slider]');
    if (oldSlider && oldSlider.dataset.featuredSet !== 'true') {
      const slider = document.createElement('div');
      slider.className = oldSlider.className;
      slider.dataset.brandSlider = '';
      slider.dataset.featuredSet = 'true';
      slider.innerHTML = `
        <div class="nw-brand-slider__stage">
          ${FEATURED_WORKS.map((work, index) => `<a class="nw-brand-slide${index === 0 ? ' is-active' : ''}" href="portfolio-detail.html?work=${work.id}" data-title="${work.title}" data-meta="${work.meta}"><img src="${work.image}" alt="${work.title} branding project"></a>`).join('')}
        </div>
        <div class="nw-brand-slider__meta"><div><strong data-slider-title>${FEATURED_WORKS[0].title}</strong><span data-slider-meta>${FEATURED_WORKS[0].meta}</span></div><div class="nw-brand-slider__control"><span data-slider-count>01 / 08</span><button type="button" data-slider-next aria-label="다음 프로젝트">NEXT ↗</button></div></div>`;
      oldSlider.replaceWith(slider);

      const slides = [...slider.querySelectorAll('.nw-brand-slide')];
      const title = slider.querySelector('[data-slider-title]');
      const meta = slider.querySelector('[data-slider-meta]');
      const count = slider.querySelector('[data-slider-count]');
      const next = slider.querySelector('[data-slider-next]');
      let index = 0;
      let timer;
      const show = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === index));
        title.textContent = slides[index].dataset.title || '';
        meta.textContent = slides[index].dataset.meta || '';
        count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      };
      const start = () => { clearInterval(timer); timer = setInterval(() => show(index + 1), 4200); };
      next?.addEventListener('click', () => { show(index + 1); start(); });
      slider.addEventListener('mouseenter', () => clearInterval(timer));
      slider.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    const selectedGrid = document.querySelector('.nw-brand-work-grid');
    if (selectedGrid && selectedGrid.dataset.featuredSet !== 'true') {
      selectedGrid.dataset.featuredSet = 'true';
      selectedGrid.innerHTML = FEATURED_WORKS.slice(0, 4).map((work) => `
        <a class="nw-brand-work-card reveal is-visible" href="portfolio-detail.html?work=${work.id}">
          <figure><img src="${work.image}" alt="${work.title}"></figure>
          <div><strong>${work.title}</strong><span>${work.meta.replaceAll(' · ', ' · ')}</span></div>
          <p>${work.description}</p>
        </a>`).join('');
    }
  };

  window.addEventListener('load', renderHomeFeaturedWorks, { once: true });
  setTimeout(renderHomeFeaturedWorks, 0);
  setTimeout(renderHomeFeaturedWorks, 400);
})();

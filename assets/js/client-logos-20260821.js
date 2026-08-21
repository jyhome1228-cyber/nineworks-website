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

  const logoCard = (src, index) => {
    const item = document.createElement('div');
    item.className = 'nw-logo-card';
    const image = document.createElement('img');
    image.src = src;
    image.alt = `나인웍스와 함께한 기업 로고 ${String(index + 1).padStart(2, '0')}`;
    image.decoding = 'async';
    item.appendChild(image);
    return item;
  };

  const createGroup = (logos, offset = 0) => {
    const group = document.createElement('div');
    group.className = 'nw-logo-marquee__group';
    logos.forEach((src, index) => group.appendChild(logoCard(src, offset + index)));
    return group;
  };

  const createMarqueeRow = (logos, reverse = false, offset = 0) => {
    const row = document.createElement('div');
    row.className = `nw-logo-marquee${reverse ? ' nw-logo-marquee--reverse' : ''}`;
    const track = document.createElement('div');
    track.className = 'nw-logo-marquee__track';
    track.appendChild(createGroup(logos, offset));
    track.appendChild(createGroup(logos, offset));
    row.appendChild(track);
    return row;
  };

  const renderHomeClients = () => {
    const hero = document.querySelector('.nw-home-hero');
    if (!hero || document.querySelector('.nw-client-showcase')) return;

    const section = document.createElement('section');
    section.className = 'nw-client-showcase';
    section.innerHTML = `
      <div class="container nw-client-showcase__head">
        <div><p class="eyebrow">COMPANIES WE WORKED WITH</p><h2>함께한 기업들</h2></div>
        <p class="nw-client-showcase__copy">브랜드 전략과 아이덴티티, 패키지, 디지털, 콘텐츠와 제작까지 다양한 프로젝트를 여러 기업·브랜드와 함께해 왔습니다.</p>
      </div>
      <div class="nw-client-marquee" aria-label="나인웍스와 함께한 기업 로고"></div>`;

    const marquee = section.querySelector('.nw-client-marquee');
    const half = Math.ceil(CLIENT_LOGOS.length / 2);
    marquee.appendChild(createMarqueeRow(CLIENT_LOGOS.slice(0, half), false, 0));
    marquee.appendChild(createMarqueeRow(CLIENT_LOGOS.slice(half), true, half));
    hero.insertAdjacentElement('afterend', section);
  };

  const renderAboutClients = () => {
    const cta = document.querySelector('.about-page main > .cta');
    if (!cta || document.querySelector('.nw-about-clients')) return;

    const section = document.createElement('section');
    section.className = 'about-section nw-about-clients';
    section.innerHTML = `
      <div class="container about-split">
        <div class="about-index">06 / CLIENTS</div>
        <div class="about-content">
          <p class="eyebrow">COMPANIES WE WORKED WITH</p>
          <h2>함께한 기업들</h2>
          <p>나인웍스는 다양한 기업, 브랜드, 기관과 함께 브랜드 전략, 아이덴티티, 패키지, 웹사이트와 제작 영역의 프로젝트를 수행해 왔습니다.</p>
          <div class="nw-client-grid" aria-label="나인웍스와 함께한 기업 로고"></div>
        </div>
      </div>`;

    const grid = section.querySelector('.nw-client-grid');
    CLIENT_LOGOS.forEach((src, index) => {
      const card = logoCard(src, index);
      card.querySelector('img').loading = 'lazy';
      grid.appendChild(card);
    });
    cta.insertAdjacentElement('beforebegin', section);
  };

  const init = () => {
    renderHomeClients();
    renderAboutClients();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

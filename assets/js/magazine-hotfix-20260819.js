(() => {
  const CDN = 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/';
  const SIMMONS_ID = 'simmons-campus';
  const DUPLICATE_ID = 'simmons-grocery';

  // Keep the original Simmons article and remove the migrated duplicate from the archive.
  if (Array.isArray(window.NW_MAGAZINE)) {
    window.NW_MAGAZINE = window.NW_MAGAZINE.filter((item) => item && item.id !== DUPLICATE_ID);

    const simmons = window.NW_MAGAZINE.find((item) => item && item.id === SIMMONS_ID);
    if (simmons) {
      simmons.title = '브랜드가 미래고객을 만드는 방법, 시몬스 그로서리스토어';
      simmons.subtitle = '이천 시몬스 테라스에서 읽은 공간, 굿즈, 무드 그리고 미래고객 전략.';
      simmons.thumbnail = `${CDN}db0f2c503cf0e.jpg`;
    }
  }

  // Old duplicate URLs should resolve to the retained original article.
  const params = new URLSearchParams(window.location.search);
  if (params.get('article') === DUPLICATE_ID) {
    params.set('article', SIMMONS_ID);
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }

  const article = window.NW_MAGAZINE_ARTICLES && window.NW_MAGAZINE_ARTICLES[SIMMONS_ID];
  if (!article) return;

  article.title = '브랜드가 미래고객을 만드는 방법, 시몬스 그로서리스토어';
  article.subtitle = '이천 시몬스 테라스에서 읽은 공간, 굿즈, 무드 그리고 미래고객 전략.';
  article.thumbnail = `${CDN}db0f2c503cf0e.jpg`;

  // Restore the real images used in the original NINEWORKS Simmons article.
  const originalImages = {
    intro: [
      `${CDN}db0f2c503cf0e.jpg`,
      `${CDN}9f7739920dac8.png`
    ],
    relation: [
      `${CDN}7292346e476db.png`,
      `${CDN}807d57e1d0a69.png`,
      `${CDN}e1ca0fc8177ec.png`
    ],
    campus: [
      `${CDN}07fc22089b7ca.png`,
      `${CDN}a8753737aef1b.png`,
      `${CDN}27eaea67a8090.png`
    ],
    productless: [
      `${CDN}dbce1107ae78e.png`,
      `${CDN}88e5e22faa90e.png`,
      `${CDN}f3e6e1798c80d.png`
    ],
    mood: [
      `${CDN}bb9d238b2e82e.png`,
      `${CDN}302bb1078995d.png`,
      `${CDN}258c6855a24b8.png`
    ]
  };

  const replaceFirstImageBlock = (blocks, images) => {
    if (!Array.isArray(blocks)) return;
    const imageBlock = blocks.find((block) => block && block.type === 'images');
    if (imageBlock) imageBlock.images = images;
  };

  replaceFirstImageBlock(article.intro, originalImages.intro);

  const sections = Array.isArray(article.sections) ? article.sections : [];
  replaceFirstImageBlock(sections[0] && sections[0].blocks, originalImages.relation);
  replaceFirstImageBlock(sections[1] && sections[1].blocks, originalImages.campus);
  replaceFirstImageBlock(sections[2] && sections[2].blocks, originalImages.productless);

  if (sections[3] && Array.isArray(sections[3].blocks)) {
    const imageBlocks = sections[3].blocks.filter((block) => block && block.type === 'images');
    if (imageBlocks[0]) imageBlocks[0].images = originalImages.mood.slice(0, 1);
    if (imageBlocks[1]) imageBlocks[1].images = originalImages.mood.slice(1);
  }
})();

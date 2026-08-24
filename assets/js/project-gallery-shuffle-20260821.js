(() => {
  const grid = document.querySelector('.projects-page .project-gallery__grid');
  if (!grid) return;

  Array.from(grid.querySelectorAll(':scope > .project-card')).forEach((card) => {
    const title = card.querySelector('h2')?.textContent.trim();
    if (title === '드림팜') card.remove();
  });

  const laffCard = Array.from(grid.querySelectorAll(':scope > .project-card')).find((card) => card.querySelector('h2')?.textContent.trim() === 'LAFF');
  if (laffCard) {
    const detailUrl = 'portfolio-laff.html';
    laffCard.dataset.projectLink = detailUrl;
    laffCard.setAttribute('role', 'link');
    laffCard.setAttribute('tabindex', '0');
    laffCard.setAttribute('aria-label', 'LAFF 포트폴리오 상세 보기');
    laffCard.style.cursor = 'pointer';

    const openDetail = () => { window.location.href = detailUrl; };
    laffCard.addEventListener('click', openDetail);
    laffCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail();
      }
    });
  }

  const cards = Array.from(grid.querySelectorAll(':scope > .project-card'));
  const count = document.querySelector('.project-gallery__count');
  if (count) count.textContent = `${cards.length} PROJECTS`;
  if (cards.length < 2) return;

  const random = () => {
    if (window.crypto?.getRandomValues) {
      const a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] / 4294967296;
    }
    return Math.random();
  };

  const shuffle = (items) => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const rgbToGroup = (r, g, b) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;
    const brightness = max / 255;

    if (saturation < 0.16) return brightness < 0.42 ? 'dark' : 'neutral';

    let hue = 0;
    if (delta !== 0) {
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      hue *= 60;
      if (hue < 0) hue += 360;
    }

    if (hue < 18 || hue >= 342) return 'red';
    if (hue < 68) return 'warm';
    if (hue < 165) return 'green';
    if (hue < 255) return 'blue';
    if (hue < 315) return 'purple';
    return 'pink';
  };

  const fallbackGroup = (src, index) => {
    const groups = ['neutral', 'warm', 'blue', 'green', 'purple', 'red', 'dark'];
    let hash = index + 17;
    for (let i = 0; i < src.length; i += 1) hash = ((hash << 5) - hash + src.charCodeAt(i)) | 0;
    return groups[Math.abs(hash) % groups.length];
  };

  const detectColorGroup = (card, index) => new Promise((resolve) => {
    const source = card.querySelector('img')?.src || '';
    if (!source) {
      resolve(fallbackGroup('', index));
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';

    const fallback = () => resolve(fallbackGroup(source, index));

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 16;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const pr = pixels[i];
          const pg = pixels[i + 1];
          const pb = pixels[i + 2];
          const alpha = pixels[i + 3];
          if (alpha < 100) continue;
          if (pr > 246 && pg > 246 && pb > 246) continue;
          r += pr;
          g += pg;
          b += pb;
          count += 1;
        }

        if (!count) {
          fallback();
          return;
        }

        resolve(rgbToGroup(r / count, g / count, b / count));
      } catch {
        fallback();
      }
    };

    image.onerror = fallback;
    image.src = source;
  });

  const arrange = (items) => {
    const pool = shuffle(items);
    const result = [];

    while (pool.length) {
      let bestIndex = 0;
      let bestScore = -Infinity;

      pool.forEach((item, index) => {
        let score = random();
        const prev = result[result.length - 1];
        const prev2 = result[result.length - 2];
        const above = result[result.length - 3];

        if (!prev || item.group !== prev.group) score += 5;
        else score -= 8;

        if (!prev2 || item.group !== prev2.group) score += 2;
        else score -= 3;

        if (!above || item.group !== above.group) score += 1.5;
        else score -= 2;

        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      result.push(pool.splice(bestIndex, 1)[0]);
    }

    return result;
  };

  Promise.all(cards.map(async (card, index) => ({
    card,
    group: await detectColorGroup(card, index)
  }))).then((items) => {
    const ordered = arrange(items);
    const fragment = document.createDocumentFragment();

    // 카드 순서만 재배치합니다. 번호는 생성하지 않습니다.
    ordered.forEach(({ card }) => fragment.appendChild(card));
    grid.appendChild(fragment);
  });
})();
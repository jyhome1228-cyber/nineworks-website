(() => {
  const MODELS = [
  {
    "name": "허찬희",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/722c7ba711892.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a41a6536a231b.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/9e4a3658a63a0.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/421f9c6cfdb36.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/56bf98f383278.png"
    ]
  },
  {
    "name": "이유나",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/992262f63a52f.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/1cd86ecc7ac4b.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/6b0f1c662ba10.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/e5a486c730496.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/726202a25de37.png"
    ]
  },
  {
    "name": "이유준",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a5092910f0474.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/bc4344e303fa8.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/0b95c423c48a8.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/91d92fe089997.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/4cbacd3357cc8.png"
    ]
  },
  {
    "name": "정하람",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a512ca5f3e030.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/d6f4f42d9d20c.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/bd961fc09fb3a.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/f2573b0857fe3.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/67484e56acb8d.png"
    ]
  },
  {
    "name": "정호영",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/5368acb598d3b.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/2637d9ac5bbfa.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/10af82ae071b2.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/2b4879a845c56.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/8c3408176c680.png"
    ]
  },
  {
    "name": "팀버",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/4e01aedb6ea41.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/37e14a1992d55.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/35482e8140399.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/dd24e67038e6c.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/97e723ad21e69.png"
    ]
  },
  {
    "name": "한시우",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/7a3c822956976.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c3aae306a4e00.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a6d0e2e8dbb03.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/fab3c2f111d13.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/2b22ed374a7bb.png"
    ]
  },
  {
    "name": "한유진",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/7f8298caaa27a.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/1843398b7a4db.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c5eabddc67115.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/5731f60951dd2.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/1c179cc98537d.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/aba8d533184b0.png"
    ]
  },
  {
    "name": "박서준",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/19c2f1d0f0559.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/5aedf836fd6be.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/f2ceba7c7483b.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c7671f20b177f.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/fb334a781d02a.png"
    ]
  },
  {
    "name": "박태준",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/383bffa61480b.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/b3a168e1ff713.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/bf7e1d87ae82a.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/b5a3aa013c03d.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/28d729445de58.png"
    ]
  },
  {
    "name": "서예린",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/5627df95648dc.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c4575e070c5e5.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a3e0a347614c1.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/b15330b0deb51.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/73e63d746094c.png"
    ]
  },
  {
    "name": "서하린",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/1188178e5f311.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/688d245563766.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/b2691ec2cc321.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/7dfbc866f868a.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/fdb6e0f785bff.png"
    ]
  },
  {
    "name": "송은하",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/1a65299b8a09b.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/4fab4f61afecb.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c683a0fa8edba.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/84103370ea0d6.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/63f3dcd239314.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/efc3cb6a63b00.png"
    ]
  },
  {
    "name": "윤슬비",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/bc30480074588.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/f4ff8d0250beb.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/daccbbc7d527e.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/35c1990a7a2a6.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/341aaa2c71d5a.png"
    ]
  },
  {
    "name": "김진하",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/d37190cb870da.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/91e63e704f8e5.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/f49b859e7074e.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/4c57857de020c.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/02b22e209b897.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/70843af6128e5.png"
    ]
  },
  {
    "name": "노박",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/85a426a460e72.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a033c1a890e85.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/fb5a1612bec86.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/7052f5dc94885.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/4ffc5a6fa175c.png"
    ]
  },
  {
    "name": "단나희",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/daa4f758794b4.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/50af6a53dbfe9.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/9be633cd501cb.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/51a50ac50dbd9.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/edb2d417603d7.png"
    ]
  },
  {
    "name": "데이비드 킴",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/8cc8127087b44.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c3155c92f4a1c.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/55ae7a6620876.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/77ad669019a80.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a74e701135a8e.png"
    ]
  },
  {
    "name": "로빈페르",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/f579029031b40.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/75d7fbd686ee8.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/3b390fce46d0f.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/40530d5a39c68.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/fc0f3af237792.png"
    ]
  },
  {
    "name": "리나 서",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/890a799333b55.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/cadffecd04187.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/4a15df361b3f2.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/d1856de00a8a0.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/04355b4826ea8.png"
    ]
  },
  {
    "name": "김서아",
    "images": [
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/c36100e1155cc.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/8db242804e4da.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/a807dc407f302.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/e33baee2c4def.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/6dd59dc7dabee.png",
      "https://cdn.imweb.me/upload/S202410251a294b3f442b0/1ebddfc5e0213.png"
    ]
  }
];

  const grid = document.querySelector('[data-ai-model-grid]');
  const modal = document.querySelector('[data-ai-model-modal]');
  const modalName = document.querySelector('[data-ai-model-name]');
  const modalId = document.querySelector('[data-ai-model-id]');
  const modalGallery = document.querySelector('[data-ai-model-gallery]');
  const modalPosition = document.querySelector('[data-ai-model-position]');
  const closeButton = document.querySelector('[data-ai-model-close]');
  const prevButton = document.querySelector('[data-ai-model-prev]');
  const nextButton = document.querySelector('[data-ai-model-next]');
  let activeIndex = 0;

  const modelId = (index) => `MODEL ${String(index + 1).padStart(3, '0')}`;
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const renderGrid = () => {
    if (!grid) return;
    grid.innerHTML = MODELS.map((model, index) => `
      <button class="ai-model-card reveal" type="button" data-ai-model-index="${index}" aria-label="${escapeHTML(model.name)} 모델 상세 보기">
        <div class="ai-model-card__image">
          <img src="${model.images[0]}" data-primary="${model.images[0]}" data-hover="${model.images[1] || model.images[0]}" alt="AI 모델 ${escapeHTML(model.name)} 대표 이미지" loading="lazy" decoding="async">
          <span class="ai-model-card__view">VIEW MODEL ↗</span>
        </div>
        <div class="ai-model-card__info">
          <strong class="ai-model-card__name">${escapeHTML(model.name)}</strong>
          <div class="ai-model-card__meta"><span>${modelId(index)}</span><small>${model.images.length} VISUALS</small></div>
        </div>
      </button>`).join('');

    grid.querySelectorAll('.ai-model-card').forEach((card) => {
      const image = card.querySelector('img');
      card.addEventListener('mouseenter', () => { if (image?.dataset.hover) image.src = image.dataset.hover; });
      card.addEventListener('mouseleave', () => { if (image?.dataset.primary) image.src = image.dataset.primary; });
      card.addEventListener('click', () => openModel(Number(card.dataset.aiModelIndex || 0)));
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }), { threshold: .05, rootMargin: '0px 0px -20px' });
      grid.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    } else grid.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
  };

  const openModel = (index) => {
    if (!modal) return;
    activeIndex = (index + MODELS.length) % MODELS.length;
    const model = MODELS[activeIndex];
    modalName.textContent = model.name;
    modalId.textContent = modelId(activeIndex);
    modalPosition.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(MODELS.length).padStart(2, '0')}`;
    modalGallery.innerHTML = model.images.map((src, imageIndex) => `
      <figure><img src="${src}" alt="AI 모델 ${escapeHTML(model.name)} 이미지 ${String(imageIndex + 1).padStart(2, '0')}" loading="${imageIndex < 2 ? 'eager' : 'lazy'}" decoding="async"></figure>`).join('');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
    closeButton?.focus();
  };

  const closeModel = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  };

  closeButton?.addEventListener('click', closeModel);
  prevButton?.addEventListener('click', () => openModel(activeIndex - 1));
  nextButton?.addEventListener('click', () => openModel(activeIndex + 1));
  document.addEventListener('keydown', (event) => {
    if (!modal?.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModel();
    if (event.key === 'ArrowLeft') openModel(activeIndex - 1);
    if (event.key === 'ArrowRight') openModel(activeIndex + 1);
  });

  const patchNavigation = () => {
    const desktopSolutions = document.querySelector('.site-nav-dropdown[aria-label="솔루션 메뉴"]');
    if (desktopSolutions && !desktopSolutions.querySelector('a[href="/ai-model.html"]')) {
      const link = document.createElement('a');
      link.href = '/ai-model.html';
      link.innerHTML = '<span>AI 모델 스튜디오</span><small>AI 비주얼</small>';
      desktopSolutions.appendChild(link);
    }

    const mobileSolutionsToggle = Array.from(document.querySelectorAll('.menu-nav__toggle')).find((node) => node.textContent.includes('SOLUTIONS'));
    const mobileSub = mobileSolutionsToggle?.closest('[data-menu-group]')?.querySelector('.menu-nav__sub');
    if (mobileSub && !mobileSub.querySelector('a[href="/ai-model.html"]')) {
      const link = document.createElement('a');
      link.href = '/ai-model.html';
      link.textContent = 'AI 모델 스튜디오';
      mobileSub.appendChild(link);
    }

    document.querySelectorAll('.site-primary-nav [data-nav-key]').forEach((link) => {
      const active = link.dataset.navKey === 'solutions';
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  renderGrid();
  patchNavigation();
  window.setTimeout(patchNavigation, 120);
  window.setTimeout(patchNavigation, 600);
})();

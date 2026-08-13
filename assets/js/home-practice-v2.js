(() => {
  const groups = [
    {
      title: '01 / Strategy + Identity',
      lead: 'Brand Strategy & Identity',
      terms: ['Market Research', 'Positioning', 'Verbal Framework', 'Logotype', 'Visual System']
    },
    {
      title: '02 / Package',
      lead: 'Packaging',
      terms: ['Material Study', 'Structural Research', 'Print Test', 'Label System', 'Production Spec']
    },
    {
      title: '03 / Editorial',
      lead: 'Editorial',
      terms: ['Information Architecture', 'Grid Study', 'Content Mapping', 'Publication System', 'Print Direction']
    },
    {
      title: '04 / Develop',
      lead: 'Develop / Digital Build',
      terms: ['Website Planning', 'UX / UI Structure', 'Admin System', 'Firebase / Data', 'Deployment']
    },
    {
      title: '05 / Digital',
      lead: 'Digital Experience',
      terms: ['User Flow Study', 'Wireframe', 'Responsive System', 'Content Architecture', 'Prototype']
    },
    {
      title: '06 / Content',
      lead: 'Art Direction',
      terms: ['Image Research', 'Key Visual', 'Motion Study', 'Visual Narrative', 'Photography Direction']
    },
    {
      title: '07 / Space',
      lead: 'Spatial Graphic',
      terms: ['Context Research', 'Signage', 'Retail Experience', 'Wayfinding Study', 'Exhibition']
    },
    {
      title: '08 / Corporate',
      lead: 'Communication Design',
      terms: ['Information Design', 'Data Visual', 'Internal Guide', 'Presentation System', 'Template System']
    },
    {
      title: '09 / Growth',
      lead: 'Brand Renewal',
      terms: ['Brand Audit', 'Design Governance', 'Design Operation', 'Asset Review', 'Launch System']
    }
  ];

  const accents = ['#8b4637', '#315d48', '#31597d', '#8d6430', '#6d4c64', '#47636b'];
  const VERSION = '4';

  const typeStyle = (text, order) => {
    const chars = Math.max(4, text.length);
    const delay = 70 + order * 24;
    const duration = Math.max(150, Math.min(420, chars * 14));
    return `--type-delay:${delay}ms;--type-duration:${duration}ms;--type-steps:${chars}`;
  };

  const renderPractice = () => {
    const hero = document.querySelector('main .hero');
    const field = hero?.querySelector('.home-practice-field');
    if (!hero || !field) return false;
    if (field.dataset.practiceVersion === VERSION) return true;

    let typeOrder = 0;
    const columns = [groups.slice(0, 3), groups.slice(3, 6), groups.slice(6, 9)];

    field.classList.remove('is-practice-typing', 'is-practice-typed');
    field.setAttribute('aria-label', 'NINEWORKS practice index: brand, design and digital development');
    field.innerHTML = columns.map((column, columnIndex) => `
      <div class="home-practice-column">
        ${column.map((group, groupIndex) => {
          const baseIndex = columnIndex * 3 + groupIndex;
          const titleStyle = typeStyle(group.title, typeOrder++);
          const countStyle = typeStyle('06 fields', typeOrder++);
          const leadStyle = `${typeStyle(group.lead, typeOrder++)};--accent:${accents[baseIndex % accents.length]}`;
          return `<section class="home-practice-group${group.title.includes('Develop') ? ' home-practice-group--develop' : ''}">
            <p class="home-practice-group__head">
              <span class="home-practice-type" style="${titleStyle}">${group.title}</span>
              <span class="home-practice-type" style="${countStyle}">06 fields</span>
            </p>
            <div class="home-practice-terms">
              <a class="home-practice-word home-practice-word--lead home-practice-type" href="solutions.html" style="${leadStyle}">${group.lead}</a>
              ${group.terms.map((term, index) => {
                const classes = `home-practice-word home-practice-type${index === 0 ? ' home-practice-word--sub' : ''}${index === 4 ? ' home-practice-word--light' : ''}`;
                const style = `${typeStyle(term, typeOrder++)};--accent:${accents[(baseIndex + index + 1) % accents.length]}`;
                return `<a class="${classes}" href="solutions.html" style="${style}">${term}</a>`;
              }).join('')}
            </div>
          </section>`;
        }).join('')}
      </div>`).join('');

    const descriptor = hero.querySelector('.hero__descriptor');
    if (descriptor) descriptor.textContent = '브랜드 전략과 아이덴티티부터 패키지, 디지털 시스템, 콘텐츠와 공간까지 하나의 시각 언어와 작동하는 구조로 연결합니다.';

    const caption = hero.querySelector('.home-practice-caption');
    if (caption) caption.innerHTML = '<strong>Practice Index / 54</strong><span>Brand · Package · Editorial · Develop · Digital · Content · Space · Corporate · Growth</span>';

    field.dataset.practiceVersion = VERSION;

    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mobile || reduced) {
      field.classList.add('is-practice-typed');
      return true;
    }

    requestAnimationFrame(() => {
      field.classList.add('is-practice-typing');
      const lastDelay = 70 + Math.max(0, typeOrder - 1) * 24;
      window.setTimeout(() => {
        field.classList.remove('is-practice-typing');
        field.classList.add('is-practice-typed');
      }, lastDelay + 560);
    });

    return true;
  };

  if (renderPractice()) return;

  // home-portfolio.js creates the nine-group field. Observe only until that one
  // element exists, render once, then disconnect. No repeated re-render loop.
  const observer = new MutationObserver(() => {
    if (!renderPractice()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 4000);
})();

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
  const VERSION = '3';
  let fieldObserver = null;
  let lockTimer = null;

  const typeStyle = (text, order) => {
    const chars = Math.max(4, text.length);
    const delay = 90 + order * 30;
    const duration = Math.max(160, Math.min(500, chars * 16));
    return `--type-delay:${delay}ms;--type-duration:${duration}ms;--type-steps:${chars}`;
  };

  const isCorrect = (field) => {
    if (!field) return false;
    const sections = field.querySelectorAll('.home-practice-group');
    if (sections.length !== groups.length) return false;
    return groups.every((group, index) => {
      const section = sections[index];
      const title = section?.querySelector('.home-practice-group__head span:first-child')?.textContent?.trim();
      const lead = section?.querySelector('.home-practice-word--lead')?.textContent?.trim();
      return title === group.title && lead === group.lead;
    });
  };

  const watchField = (field) => {
    fieldObserver?.disconnect();
    fieldObserver = new MutationObserver(() => {
      if (isCorrect(field)) return;
      fieldObserver.disconnect();
      renderPractice(true);
    });
    fieldObserver.observe(field, { childList: true, subtree: true, characterData: true });
  };

  const renderPractice = (force = false) => {
    const hero = document.querySelector('main .hero');
    const field = hero?.querySelector('.home-practice-field');
    if (!hero || !field) return false;

    if (!force && field.dataset.practiceVersion === VERSION && isCorrect(field)) {
      watchField(field);
      return true;
    }

    fieldObserver?.disconnect();
    field.dataset.practiceVersion = VERSION;
    field.setAttribute('aria-label', 'NINEWORKS practice index: brand, design and digital development');
    field.classList.remove('is-practice-typing', 'is-practice-typed');

    let typeOrder = 0;
    const columns = [groups.slice(0, 3), groups.slice(3, 6), groups.slice(6, 9)];
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

    watchField(field);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      field.classList.add('is-practice-typed');
      return true;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => field.classList.add('is-practice-typing'));
      const lastDelay = 90 + Math.max(0, typeOrder - 1) * 30;
      window.setTimeout(() => {
        field.classList.remove('is-practice-typing');
        field.classList.add('is-practice-typed');
      }, lastDelay + 720);
    });

    return true;
  };

  const enforce = () => {
    const hero = document.querySelector('main .hero');
    const field = hero?.querySelector('.home-practice-field');
    if (!field) return false;
    if (!isCorrect(field)) renderPractice(true);
    else watchField(field);
    return true;
  };

  if (!renderPractice()) {
    const observer = new MutationObserver(() => {
      if (renderPractice()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 8000);
  }

  // Legacy copy scripts are loaded dynamically. Re-check briefly after page load,
  // then the field-level MutationObserver keeps the final practice data locked.
  let checks = 0;
  lockTimer = window.setInterval(() => {
    enforce();
    checks += 1;
    if (checks >= 20) window.clearInterval(lockTimer);
  }, 250);
})();

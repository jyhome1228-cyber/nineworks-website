(() => {
  const body = document.body;
  if (!body.classList.contains('portfolio-detail-page')) return;

  const initCoventryLanguage = () => {
    if (!body.classList.contains('portfolio-coventry-page')) return;

    const translations = [
      {
        selector: '.portfolio-detail-story__lead',
        en: 'A Coventry City FC identity renewal proposal that preserves the city’s heraldic memory and the club’s visual heritage while reorganizing it to work more clearly across today’s stadium, kit, digital and merchandise environments.',
        ko: '도시의 문장과 축구 클럽의 기억을 지우지 않고, 오늘의 경기장·유니폼·디지털·머천다이즈 환경에서 더 명확하게 작동하도록 재구성한 Coventry City FC BI 리뉴얼 제안입니다.'
      },
      {
        selector: '.portfolio-detail-story__summary',
        en: 'The aim is not simplification for its own sake, but continuity. The proposal retains the narratives of the Elephant, Three Towers, Eagle, Phoenix, Flame and Football, while rebuilding visual hierarchy around Sky Blue and Navy and extending the historic crest into a contemporary football identity system.',
        ko: '핵심은 단순화 자체가 아니라 계승입니다. Elephant, Three Towers, Eagle, Phoenix, Flame, Football이라는 기존 상징의 서사를 유지하면서 Sky Blue와 Navy를 중심으로 시각 위계를 재정리하고, 역사적 crest를 현대적인 football identity system으로 확장했습니다.'
      },
      {
        selector: '#project-overview > h2',
        en: 'Preserve the heritage. Rebuild it for the modern game.',
        ko: '헤리티지를 보존하고, 현대 축구를 위해 다시 구축하다.'
      },
      {
        selector: '#project-overview > p:not(.cov-band-label)',
        en: 'The existing Coventry City crest carries far more than the identity of a football club. The elephant and castle inherited from Coventry’s civic heraldry, the eagle associated with the historic city, the phoenix representing reconstruction and recovery, and the football elements of the club all coexist within a single emblem. Rather than deleting these symbols or replacing them with an entirely unfamiliar mark, this project begins by preserving the forms supporters remember and reorganizing the city’s story into a clearer, more expandable visual system.',
        ko: 'Coventry City의 기존 crest는 단순한 축구 엠블럼보다 훨씬 많은 이야기를 담고 있습니다. 코번트리의 시민 문장에서 이어진 elephant and castle, 오래된 도시를 상징하는 eagle, 전쟁 이후 재건과 회복을 상징하는 phoenix, 그리고 클럽의 축구 정체성을 구성하는 여러 요소가 하나의 문장 안에 공존합니다. 이 프로젝트는 그 상징을 삭제하거나 완전히 다른 로고로 교체하는 방식이 아니라, 팬들이 기억하는 형태와 도시의 서사를 유지한 채 더 선명하고 확장 가능한 시각 시스템으로 다시 조직하는 데서 출발했습니다.'
      },
      {
        selector: '#project-overview .cov-context-card:nth-child(1) p',
        en: 'The civic symbols inherited from Coventry and the visual memories accumulated by supporters remain the starting point of the renewal.',
        ko: '도시 문장에서 이어진 핵심 상징과 팬들이 축적해 온 시각적 기억을 리뉴얼의 출발점으로 삼았습니다.'
      },
      {
        selector: '#project-overview .cov-context-card:nth-child(2) p',
        en: 'Rather than removing meaning, line, scale, colour and placement are reorganized to create a structure that remains recognizable at smaller sizes.',
        ko: '많은 요소를 제거하기보다 선, 크기, 색상과 배치를 정리해 작은 크기에서도 인식되는 구조로 전환했습니다.'
      },
      {
        selector: '#project-overview .cov-context-card:nth-child(3) p',
        en: 'The crest is designed to adapt across kits, broadcast graphics, social media, app icons, stadium environments and merchandise.',
        ko: '유니폼, 방송 그래픽, 소셜 미디어, 앱 아이콘, 경기장, 굿즈까지 하나의 crest가 유연하게 작동하도록 확장성을 고려했습니다.'
      },
      {
        selector: '#club-context .portfolio-scroll-section__head h2',
        en: 'A football identity inseparable from the city it represents.',
        ko: '도시와 분리할 수 없는 축구 아이덴티티.'
      },
      {
        selector: '#club-context .portfolio-scroll-copy p:nth-child(1)',
        en: 'Coventry City Football Club’s identity is deeply connected to the visual symbols of Coventry itself. The club has long been remembered as “The Sky Blues,” and Sky Blue functions as its fastest and most distinctive visual identifier both inside and outside the stadium. Renewing Coventry City therefore means more than changing the style of a crest. It means deciding how the shared memory of city, club and supporter culture can be translated into a contemporary visual language.',
        ko: 'Coventry City Football Club의 정체성은 도시 Coventry의 상징 체계와 강하게 연결되어 있습니다. 클럽은 전통적으로 ‘The Sky Blues’라는 이름과 Sky Blue 컬러로 기억되며, 경기장 안팎에서 이 색은 팀을 가장 빠르게 식별시키는 핵심 브랜드 자산으로 기능합니다. 즉 Coventry City를 새롭게 보이게 만드는 일은 단순한 로고 스타일 변경이 아니라, 도시·클럽·팬 문화가 공유해 온 기억을 어떤 방식으로 현재의 시각 언어로 번역할 것인가에 대한 문제입니다.'
      },
      {
        selector: '#club-context .portfolio-scroll-copy p:nth-child(2)',
        en: 'The 1987 FA Cup victory remains one of the defining moments in the club’s history, while 2026 marks a return to the Premier League. At a moment where historic memory and a new stage intersect, the opportunity is not to abandon the club’s established identity, but to build a system that remains recognizably Coventry across broader broadcast, digital and global supporter touchpoints.',
        ko: '클럽 역사에서 1987년 FA Cup 우승은 가장 중요한 순간 중 하나로 남아 있고, 2026년에는 Premier League 복귀를 맞았습니다. 이처럼 역사적 기억과 새로운 무대가 교차하는 시점은 기존의 정체성을 버리기보다, 더 넓은 방송·디지털·글로벌 팬 접점에서도 Coventry답게 인식될 수 있는 체계를 고민하기에 적절한 맥락을 제공합니다.'
      },
      {
        selector: '#club-context .cov-principle:nth-child(1) p',
        en: 'Retain the familiar symbols and the overall visual memory of the crest.',
        ko: '익숙한 상징과 전체적인 crest의 기억은 유지합니다.'
      },
      {
        selector: '#club-context .cov-principle:nth-child(2) p',
        en: 'Reorganize form and attention according to the hierarchy of each symbol.',
        ko: '중요도에 따라 형태와 시선을 다시 정리합니다.'
      },
      {
        selector: '#club-context .cov-principle:nth-child(3) p',
        en: 'Unify the system around the club’s strongest colour asset.',
        ko: '클럽의 가장 강한 컬러 자산을 중심으로 통합합니다.'
      },
      {
        selector: '#club-context .cov-principle:nth-child(4) p',
        en: 'Extend the crest into matchday, content, merchandise and spatial experiences.',
        ko: 'crest를 경기·콘텐츠·상품·공간으로 확장합니다.'
      },
      {
        selector: '#heritage .portfolio-scroll-section__head h2',
        en: 'The badge carries the story of Coventry before it carries the story of football.',
        ko: '이 배지는 축구보다 먼저 Coventry라는 도시의 이야기를 담고 있습니다.'
      },
      {
        selector: '#heritage .portfolio-scroll-copy p:nth-child(1)',
        en: 'Coventry’s civic coat of arms features a golden elephant carrying a castle. Coventry City Council records the elephant as a long-standing symbol of the city, while the supporters of the coat of arms include Leofric’s black eagle and a phoenix. The eagle represents ancient Coventry, while the phoenix rising from the flames represents the New Coventry rebuilt after wartime destruction. The continuation of this civic narrative within the football crest is one of Coventry City’s most distinctive identity assets.',
        ko: 'Coventry의 시민 문장에는 golden elephant와 등에 올라간 castle이 등장합니다. Coventry City Council의 기록에서 elephant는 도시를 대표하는 오랜 상징이며, coat of arms의 supporters로는 Leofric의 black eagle과 phoenix가 사용됩니다. Eagle은 ancient Coventry를, 불길에서 다시 일어나는 Phoenix는 전쟁의 파괴 이후 재건된 New Coventry를 상징합니다. 이 서사가 축구 클럽의 crest 안에서도 이어진다는 점은 Coventry City만의 차별적인 정체성입니다.'
      },
      {
        selector: '#heritage .portfolio-scroll-copy p:nth-child(2)',
        en: 'The renewal question was therefore not “how much can be removed?” but “which memories must remain, and how can they become easier to read?” Instead of reducing the identity until it becomes generic, each symbol is treated as a recognizable module and the overall crest is rebuilt with a clearer visual structure.',
        ko: '따라서 리뉴얼의 질문은 ‘얼마나 많이 덜어낼 것인가’가 아니라 ‘어떤 기억을 반드시 남기고, 그것을 어떻게 더 잘 읽히게 만들 것인가’였습니다. 상징을 최소화해 무명성에 가까워지는 대신, 각각의 의미를 식별 가능한 모듈로 정리하고 전체 구조를 더 명료하게 만드는 방식을 선택했습니다.'
      },
      {
        selector: '#heritage .cov-symbol:nth-child(1) p',
        en: 'The city’s best-known civic emblem remains the central anchor, making the relationship between Coventry and the club immediately visible.',
        ko: 'Coventry의 대표적인 civic emblem을 중심축으로 유지해 도시와 클럽의 연결을 가장 먼저 읽히게 합니다.'
      },
      {
        selector: '#heritage .cov-symbol:nth-child(2) p',
        en: 'The historic city image is condensed into a vertical structure that strengthens the centre of the crest.',
        ko: '도시의 역사적 인상을 압축하는 구조로, 중심부의 수직성과 상징성을 강화합니다.'
      },
      {
        selector: '#heritage .cov-symbol:nth-child(3) p',
        en: 'The eagle preserves the memory of ancient Coventry associated with Leofric.',
        ko: 'Leofric의 eagle에서 이어지는 옛 Coventry의 기억을 보존합니다.'
      },
      {
        selector: '#heritage .cov-symbol:nth-child(4) p',
        en: 'The phoenix keeps the narrative of rebuilding and recovery after destruction.',
        ko: '파괴 이후 다시 일어난 도시의 재건과 회복의 서사를 유지합니다.'
      },
      {
        selector: '#heritage .cov-symbol:nth-child(5) p',
        en: 'The energy of regeneration connected to the phoenix is retained as a controlled accent.',
        ko: 'Phoenix와 연결되는 재생의 에너지를 제한된 accent로 사용합니다.'
      },
      {
        selector: '#heritage .cov-symbol:nth-child(6) p',
        en: 'The football anchors the lower centre so the sporting identity remains immediately legible within the civic symbolism.',
        ko: '복합적인 시민 문장 안에서도 football club이라는 정체성이 즉시 읽히도록 하단 중심을 잡습니다.'
      },
      {
        selector: '#challenge .portfolio-scroll-section__head h2',
        en: 'Rich in meaning, but difficult to scale as one contemporary brand system.',
        ko: '풍부한 의미를 지녔지만, 현대적인 하나의 브랜드 시스템으로 확장하기에는 복잡했습니다.'
      },
      {
        selector: '#challenge .portfolio-scroll-copy p:nth-child(1)',
        en: 'The greatest strength of the existing crest is the richness of its symbolism, but that same richness becomes complexity in contemporary applications. Multiple colours and fine details can lose clarity when reduced for digital icons, embroidered patches, distant signage and social avatars. Today, a football identity no longer lives only as a badge on a shirt; it is repeatedly encountered through live scores, mobile interfaces, video, thumbnails, merchandise and global supporter content.',
        ko: '기존 crest의 가장 큰 장점은 상징의 풍부함이지만, 동시에 현대 적용 환경에서는 복잡성으로 작용합니다. 여러 색과 세부 묘사가 작은 디지털 아이콘, 자수 패치, 원거리 사이니지, 소셜 아바타처럼 축소되는 환경에서 하나의 명확한 인상으로 유지되기 어렵습니다. 특히 축구 클럽의 아이덴티티가 이제 유니폼의 가슴 패치에만 머무르지 않고 라이브 스코어, 모바일 UI, 영상, 썸네일, 머천다이즈와 전 세계 팬 콘텐츠로 반복 노출된다는 점을 고려했습니다.'
      },
      {
        selector: '#challenge .portfolio-scroll-copy p:nth-child(2)',
        en: 'Rather than pursuing radical simplification by removing historic symbols, the proposal controls proportion, line weight, colour priority and naming within a circular badge structure. Heritage remains in the content; the requirements of contemporary football branding are addressed through system, hierarchy and reproducibility.',
        ko: '그래서 이 제안은 역사적 상징을 제거하는 radical simplification 대신, 원형 badge 구조 안에서 요소의 비율과 선 굵기, 컬러의 우선순위와 이름 구조를 통제하는 방식으로 접근했습니다. Heritage는 내용으로 남기고, contemporary football branding의 요구는 시스템과 재현성으로 해결했습니다.'
      },
      {
        selector: '#challenge .cov-principle:nth-child(1) p',
        en: 'A structure where the central symbols and club name remain intact at small sizes.',
        ko: '작은 크기에서도 중심 상징과 club name이 무너지지 않는 구조.'
      },
      {
        selector: '#challenge .cov-principle:nth-child(2) p',
        en: 'Stable reproduction across embroidery, print, patches and single-colour production.',
        ko: '자수, 프린트, 패치와 단색 제작에서 안정적으로 재현되는 형태.'
      },
      {
        selector: '#challenge .cov-principle:nth-child(3) p',
        en: 'Naturally adaptable to circular profiles, app icons and thumbnail environments.',
        ko: '원형 profile, app icon, thumbnail 환경에 자연스럽게 대응.'
      },
      {
        selector: '#challenge .cov-principle:nth-child(4) p',
        en: 'One visual language connecting kit, stadium, social content and merchandise.',
        ko: 'kit, stadium, social, merchandise를 하나의 시각 언어로 연결.'
      },
      {
        selector: '#renewal .portfolio-scroll-section__head h2',
        en: 'From an illustrative heraldic crest to a structured football badge.',
        ko: '서사적인 문장형 크레스트에서 구조화된 풋볼 배지로.'
      },
      {
        selector: '#renewal .portfolio-scroll-copy p:nth-child(1)',
        en: 'The renewed crest uses a strong Navy outer ring to lock the Coventry City name into one clear structure. “Coventry City” is placed along the upper curve and “Football Club” along the lower curve, while the elephant and three towers remain the central heritage symbols. The eagle and phoenix retain the balance and narrative of the previous crest in refined forms, and the football anchors the lower centre to state the club’s sporting identity directly.',
        ko: '새로운 crest는 강한 Navy outer ring을 사용해 Coventry City라는 이름을 명확한 하나의 lock-up으로 묶었습니다. 상단에는 ‘Coventry City’, 하단에는 ‘Football Club’을 배치하고, 중앙에는 elephant와 three towers를 핵심 heritage symbol로 유지했습니다. 좌우의 eagle과 phoenix는 기존 crest가 가진 균형과 서사를 이어가되 형태를 정리했으며, football은 하단 중심에서 클럽의 종목 정체성을 직접적으로 드러냅니다.'
      },
      {
        selector: '#renewal .portfolio-scroll-copy p:nth-child(2)',
        en: 'The difference between Before and After is therefore less about deleting symbols than changing visual order. By rebuilding an illustrative crest as badge architecture, the proposal preserves the face of Coventry that supporters recognize while creating a stronger and more consistent impression within contemporary football culture.',
        ko: '결과적으로 Before와 After의 차이는 상징의 삭제보다 시각적 질서의 변화에 있습니다. 복잡한 그림처럼 읽히던 crest를 badge architecture로 재구성해, 팬들이 기억하는 Coventry의 얼굴을 보존하면서도 오늘의 football culture 안에서 더 강하고 일관된 인상을 만들고자 했습니다.'
      },
      {
        selector: '#renewal .dev-case-system__title',
        en: 'Keep the memory. Reduce the visual friction.',
        ko: '기억은 유지하고, 시각적 마찰은 줄였습니다.'
      },
      {
        selector: '#renewal .dev-case-stat:nth-child(1) p',
        en: 'The club name and symbols are combined within one robust football crest structure.',
        ko: 'Club name과 상징을 하나의 단단한 football crest 구조로 결합합니다.'
      },
      {
        selector: '#renewal .dev-case-stat:nth-child(2) p',
        en: 'The core narrative of the elephant, towers, eagle, phoenix and football is retained.',
        ko: 'Elephant, towers, eagle, phoenix와 football의 핵심 내러티브를 유지합니다.'
      },
      {
        selector: '#renewal .dev-case-stat:nth-child(3) p',
        en: 'Line weight and internal density are refined for better reproduction in reduced, embroidered and monochrome formats.',
        ko: '선 굵기와 내부 밀도를 정리해 축소·자수·단색 환경에서의 재현성을 높입니다.'
      },
      {
        selector: '#renewal .dev-case-stat:nth-child(4) p',
        en: 'Sky Blue is repositioned as the primary colour that identifies Coventry most immediately.',
        ko: 'Coventry를 가장 빠르게 기억시키는 Sky Blue를 중심 컬러로 재정렬합니다.'
      },
      {
        selector: '#color .portfolio-scroll-section__head h2',
        en: 'Sky Blue becomes the emotional identifier. Navy gives it structure.',
        ko: 'Sky Blue는 감정적 식별자가 되고, Navy는 구조를 만듭니다.'
      },
      {
        selector: '#color .portfolio-scroll-copy p:nth-child(1)',
        en: 'The colour system places Sky Blue—the colour most directly associated with Coventry City—at the forefront, while Navy provides structure and depth. The contrast between these two colours is designed to build immediate club recognition across kits, digital interfaces, stadium graphics and merchandise.',
        ko: '컬러 시스템은 Coventry City를 가장 직접적으로 상징하는 Sky Blue를 전면에 두고, Navy를 구조와 깊이를 만드는 기준색으로 사용합니다. 두 컬러의 대비만으로도 유니폼, 디지털 화면, 경기장 그래픽과 merchandise에서 강한 club recognition을 만들 수 있도록 설계했습니다.'
      },
      {
        selector: '#color .portfolio-scroll-copy p:nth-child(2)',
        en: 'The broader colours of the historic crest are retained only where symbolic detail requires them, allowing Sky Blue and Navy to lead the overall brand impression. This creates a system that remains coherent in full colour, monochrome, reversed, patch and embroidery applications.',
        ko: '기존 crest의 다채로운 색상은 상징적 디테일이 필요한 부분에서만 제한적으로 유지하고, 브랜드의 기본 인상은 Sky Blue와 Navy가 주도하도록 정리했습니다. 이를 통해 full color뿐 아니라 monochrome, reversed, patch, embroidery 등 다양한 생산 방식에서도 동일한 정체성이 유지됩니다.'
      },
      {
        selector: '#applications .portfolio-scroll-section__head h2',
        en: 'A crest designed to move from shirt to stadium, screen and supporter culture.',
        ko: '유니폼에서 경기장, 화면, 서포터 문화까지 이동하는 크레스트.'
      },
      {
        selector: '#applications .portfolio-scroll-copy p:nth-child(1)',
        en: 'The renewed crest is tested not as a finished logo in isolation, but within real football brand touchpoints. From small, material applications such as kit patches to flags, supporter banners, stadium graphics, vehicles, merchandise and matchday content, the system is evaluated across different scales and production methods.',
        ko: '새 crest는 하나의 완성 로고에서 끝나지 않고 실제 football brand touchpoint 안에서 테스트했습니다. Kit patch처럼 물성이 강한 작은 적용부터 flag, supporter banner, stadium graphic, vehicle, merchandise, matchday content까지 서로 다른 크기와 제작 방식에서 동일한 인지성을 유지하는지 확인했습니다.'
      },
      {
        selector: '#applications .portfolio-scroll-copy p:nth-child(2)',
        en: 'The circular badge and clear Sky Blue / Navy contrast support fast recognition in both reduced digital icons and distant stadium environments. The applications demonstrate that the renewal is not simply a visual refresh, but a brand asset designed to extend Coventry City’s heritage across the full contemporary football experience.',
        ko: '특히 원형 badge와 Sky Blue / Navy의 명확한 대비는 축소된 디지털 아이콘과 원거리 경기장 환경 모두에서 클럽을 빠르게 식별하게 합니다. 각 응용 이미지는 logo renewal이 단순한 시각 refresh가 아니라, Coventry City의 heritage를 contemporary football experience 전체로 확장하기 위한 brand asset이라는 점을 보여줍니다.'
      },
      {
        selector: '#applications .cov-intro-band h2',
        en: 'Built from Coventry. Ready for the modern game.',
        ko: 'Coventry에서 시작해, 현대 축구를 위해 준비된 아이덴티티.'
      },
      {
        selector: '#applications .cov-intro-band > p:not(.cov-band-label)',
        en: 'This proposal does not replace Coventry City’s past with something new. It reorganizes the city’s already powerful symbols and supporter memories into a form designed to remain useful for longer. By keeping heritage at the centre and adding clarity, scalability and digital usability, the crest is proposed as an integrated asset for a contemporary football brand rather than a standalone emblem.',
        ko: '이 제안은 Coventry City의 과거를 새것으로 대체하는 작업이 아니라, 이미 강하게 존재하는 도시의 상징과 팬의 기억을 더 오래 사용할 수 있는 형태로 정리하는 작업입니다. Heritage를 중심에 두고 clarity, scalability, digital usability를 더함으로써 crest가 하나의 엠블럼을 넘어 현대 축구 브랜드의 통합 자산으로 작동하도록 제안했습니다.'
      },
      { selector: '.portfolio-detail-index a[href="#project-overview"]', en: 'Project Overview', ko: '프로젝트 개요' },
      { selector: '.portfolio-detail-index a[href="#club-context"]', en: 'Coventry & The Sky Blues', ko: 'Coventry와 The Sky Blues' },
      { selector: '.portfolio-detail-index a[href="#heritage"]', en: 'Civic Heritage', ko: '도시의 헤리티지' },
      { selector: '.portfolio-detail-index a[href="#challenge"]', en: 'Identity Challenge', ko: '아이덴티티 과제' },
      { selector: '.portfolio-detail-index a[href="#renewal"]', en: 'Crest Renewal', ko: '크레스트 리뉴얼' },
      { selector: '.portfolio-detail-index a[href="#color"]', en: 'Color System', ko: '컬러 시스템' },
      { selector: '.portfolio-detail-index a[href="#applications"]', en: 'Branding Applications', ko: '브랜딩 적용' },
      { selector: '.portfolio-detail-back', en: '← Back to Project', ko: '← 프로젝트로 돌아가기' },
      { selector: '#project-overview .cov-band-label', en: 'Project Overview', ko: '프로젝트 개요' },
      { selector: '#club-context .portfolio-scroll-section__label', en: 'Coventry & The Sky Blues', ko: 'Coventry와 The Sky Blues' },
      { selector: '#heritage .portfolio-scroll-section__label', en: 'Civic Heritage', ko: '도시의 헤리티지' },
      { selector: '#challenge .portfolio-scroll-section__label', en: 'Identity Challenge', ko: '아이덴티티 과제' },
      { selector: '#renewal .portfolio-scroll-section__label', en: 'Crest Renewal', ko: '크레스트 리뉴얼' },
      { selector: '#color .portfolio-scroll-section__label', en: 'Color System', ko: '컬러 시스템' },
      { selector: '#applications .portfolio-scroll-section__label', en: 'Branding Applications', ko: '브랜딩 적용' },
      { selector: '#applications .cov-intro-band .cov-band-label', en: 'Final Statement', ko: '최종 제안' }
    ];

    const liveCta = document.querySelector('.portfolio-detail-sidebar__top .portfolio-detail-live');
    let toggle = document.querySelector('[data-cov-lang-toggle]');
    if (liveCta && !toggle) {
      const actions = document.createElement('div');
      actions.className = 'cov-detail-actions';
      liveCta.parentNode.insertBefore(actions, liveCta);
      actions.appendChild(liveCta);

      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'cov-language-toggle';
      toggle.setAttribute('data-cov-lang-toggle', '');
      toggle.setAttribute('aria-pressed', 'false');
      actions.appendChild(toggle);
    }

    const liveLabel = liveCta?.querySelector('span:first-child');
    let language = 'en';

    const setLanguage = (nextLanguage) => {
      language = nextLanguage;
      document.documentElement.lang = language === 'ko' ? 'ko' : 'en';
      body.dataset.covLanguage = language;

      translations.forEach(({ selector, en, ko }) => {
        const node = document.querySelector(selector);
        if (node) node.textContent = language === 'ko' ? ko : en;
      });

      if (liveLabel) liveLabel.textContent = language === 'ko' ? '케이스 스터디 보기' : 'VIEW CASE STUDY';
      if (toggle) {
        toggle.textContent = language === 'ko' ? 'ENGLISH' : '국문 번역';
        toggle.setAttribute('aria-label', language === 'ko' ? 'Switch this case study to English' : '이 케이스 스터디를 국문으로 번역');
        toggle.setAttribute('aria-pressed', String(language === 'ko'));
      }

      body.classList.add('cov-lang-ready');
    };

    toggle?.addEventListener('click', () => setLanguage(language === 'en' ? 'ko' : 'en'));
    setLanguage('en');
  };

  initCoventryLanguage();

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-trigger]');
  let lastY = Math.max(0, window.scrollY);
  let lastDirection = 'down';
  let ticking = false;

  const setHeaderHidden = (hidden) => {
    if (!header) return;
    if (body.classList.contains('is-menu-open')) hidden = false;
    header.classList.toggle('is-hidden', hidden);
    body.classList.toggle('is-detail-header-hidden', hidden);
  };

  const updateChapterState = () => {
    const sections = [...document.querySelectorAll('.portfolio-scroll-section[id]')];
    const links = [...document.querySelectorAll('.portfolio-detail-index a[href^="#"]')];
    if (!sections.length || !links.length) return;

    const trigger = body.classList.contains('is-detail-header-hidden') ? 86 : 86 + (header?.offsetHeight || 0);
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= trigger) currentId = section.id;
    });

    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const syncOnScroll = () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - lastY;

    if (body.classList.contains('is-menu-open') || currentY <= 18) {
      setHeaderHidden(false);
    } else if (delta > 2) {
      lastDirection = 'down';
      setHeaderHidden(true);
    } else if (delta < -2) {
      lastDirection = 'up';
      setHeaderHidden(false);
    } else if (lastDirection === 'down' && currentY > 50) {
      setHeaderHidden(true);
    }

    lastY = currentY;
    updateChapterState();
    ticking = false;
  };

  const requestSync = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(syncOnScroll);
  };

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync, { passive: true });

  menuButton?.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      if (body.classList.contains('is-menu-open')) setHeaderHidden(false);
      else if (lastDirection === 'down' && window.scrollY > 50) setHeaderHidden(true);
      else setHeaderHidden(false);
    });
  });

  const observer = new MutationObserver(() => {
    if (document.querySelector('.portfolio-detail-index') && document.querySelector('.portfolio-scroll-section')) {
      updateChapterState();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setHeaderHidden(window.scrollY > 50);
  updateChapterState();
})();

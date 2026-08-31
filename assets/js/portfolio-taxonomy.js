(() => {
  if (!Array.isArray(window.NW_PORTFOLIO)) window.NW_PORTFOLIO = [];

  const eventOnly = new Set([
    'kookmin-university',
    'myungwon-museum',
    'ouga-x-monggo',
    'megagen',
    'hi-scale-up'
  ]);

  const detailPage = new Set(['centellian-24']);
  const website = new Set([
    'fineb','tne-epc','relim','aesost','kekomi','the-petrichor','thomastone','recelleclore'
  ]);
  const dedicatedSystem = new Set(['nineworks-crm']);

  const petrichor = window.NW_PORTFOLIO.find((project) => project?.id === 'the-petrichor');
  if (petrichor) Object.assign(petrichor, {
    title: 'THE PETRICHOR',
    client: 'THE PETRICHOR / 더 페트리셔',
    subtitle: 'Skincare Brand Website, Membership & Content Experience',
    scope: 'Imweb · Custom Code · Photography · Product Detail · Review · Event · Membership',
    thumbnail: 'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/c403d1292f536.png'
  });

  window.NW_PORTFOLIO.forEach((project) => {
    if (!project || !project.id) return;
    const incoming = Array.isArray(project.filters) ? project.filters : [];
    const filters = new Set(incoming);
    filters.delete('commerce');
    filters.delete('system');

    if (eventOnly.has(project.id)) {
      project.filters = ['event'];
      return;
    }
    if (incoming.includes('develop') || website.has(project.id)) {
      filters.add('develop');
      filters.add('website');
    }
    if (dedicatedSystem.has(project.id)) filters.add('system');
    if (detailPage.has(project.id)) {
      filters.add('detailpage');
      filters.add('landing');
    }
    if (!filters.size) filters.add('branding');
    project.filters = [...filters];
  });

  const normalize = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9가-힣]/g, '');

  const CURATED = {
    'wooje-stay':['HOTEL','HOSPITALITY','BRAND IDENTITY'],
    ouga:['KOREAN F&B','CAFE','PACKAGE'],
    'centellian-24':['BEAUTY TECH','DETAIL PAGE','MARKETING'],
    hollys:['F&B','COFFEE','PACKAGE'],
    'cocos-matcha':['F&B','MATCHA CAFE','PACKAGE'],
    somsomlike:['LIFESTYLE','GOODS','BRAND IDENTITY'],
    '1616-brunch-coffee':['F&B','BRUNCH CAFE','PACKAGE'],
    chapter:['F&B','CAFE','SPACE IDENTITY'],
    seolgadang:['KOREAN F&B','CAFE','PACKAGE'],
    puur:['HEALTH FOOD','PROTEIN','PACKAGE'],
    'beauness-dailyb':['WELLNESS','HEALTH','PACKAGE'],
    mayer:['LIFESTYLE','BRAND IDENTITY','PACKAGE'],
    eat:['PET','FOOD','PACKAGE'],
    '1plan':['HEALTH','CONSULTING','BRAND SYSTEM'],
    'kookmin-university':['EDUCATION','EVENT','EDITORIAL'],
    acliv:['TECH PRODUCT','SCREEN PROTECTOR','BRANDING'],
    blondy:['HYGIENE','LIFESTYLE','PACKAGE'],
    'breeze-coffee':['F&B','COFFEE','PACKAGE'],
    cafood:['F&B','READY-TO-EAT','PACKAGE'],
    chajang:['MOBILITY','PARKING PLATFORM','SERVICE BRANDING'],
    demassia:['F&B','COFFEE','POP-UP'],
    'dev-coffee':['F&B','COFFEE','PACKAGE'],
    'doctor-tips':['DERMOCOSMETIC','BEAUTY','PACKAGE'],
    dreamhanger:['PET','LIFESTYLE','BRAND IDENTITY'],
    fulim:['SKINCARE','BEAUTY','PACKAGE'],
    'gong-cha':['F&B','BAKERY','PACKAGE'],
    'greedy-scent':['FRAGRANCE','BEAUTY','PACKAGE'],
    healthd:['HEALTH SUPPLEMENT','PACKAGE','PRODUCT VISUAL'],
    helibean:['F&B','COFFEE','PACKAGE'],
    'hi-protein':['HEALTH FOOD','PROTEIN','PACKAGE'],
    'hi-scale-up':['STARTUP','DEMO DAY','EVENT BRANDING'],
    'hollys-coffee':['F&B','CAFE','PRODUCT VISUAL'],
    'hollys-coffee-home':['F&B','GIFT','PACKAGE'],
    hurbi:['REAL ESTATE','PLATFORM','SERVICE BRANDING'],
    'myungwon-museum':['MUSEUM','EXHIBITION','GRAPHIC IDENTITY'],
    jadam:['HEALTH FOOD','GINSENG','PACKAGE'],
    jewood:['SKINCARE','BEAUTY','PACKAGE'],
    'jincheon-tigre':['LOCAL F&B','DESSERT','PACKAGE'],
    kidsten:['KIDS','HEALTH FOOD','PACKAGE'],
    'leanbody-lab':['DIET','WELLNESS','PACKAGE'],
    'make-pasta':['F&B','DELIVERY','PACKAGE'],
    megagen:['DENTAL','SYMPOSIUM','EVENT / EDITORIAL'],
    miel:['F&B','HONEY','PACKAGE'],
    'milk-please':['F&B','BAKERY','PACKAGE'],
    modicus:['F&B','BAKERY','PACKAGE'],
    mohb:['F&B','CAFE','BRAND IDENTITY'],
    'muscovy-duvet':['BEDDING','LIFESTYLE','BRAND IDENTITY'],
    'must-it':['EDUCATION','CAMPUS','EVENT GRAPHIC'],
    myv:['PLATFORM','LIFESTYLE','SERVICE BRANDING'],
    'ouga-x-monggo':['F&B','POP-UP','COLLABORATION'],
    'pajama-jam':['MUSIC','PLATFORM','BRAND IDENTITY'],
    pausenality:['FRAGRANCE','LIFESTYLE','PACKAGE'],
    'pizza-mama':['F&B','PIZZA','STORE BRANDING'],
    'pour-and-bake':['F&B','CAFE','PACKAGE'],
    pudada:['HEALTH FOOD','JELLY','PACKAGE'],
    'quest-school':['EDUCATION','CAREER','SERVICE BRANDING'],
    'roasting-visor':['F&B','COFFEE ROASTERY','PACKAGE'],
    'the-petrichor':['SKINCARE','BRAND COMMERCE','WEBSITE'],
    'the-spa':['BATH CARE','WELLNESS','PACKAGE'],
    toylub:['SKINCARE','FAMILY','PACKAGE'],
    'trestle-corp':['FINTECH','B2B','BRAND IDENTITY'],
    umer:['FASHION','LIFESTYLE','BRAND IDENTITY'],
    vaquer:['FRAGRANCE','HOME','PACKAGE'],
    'we-bring':['MOBILITY','CAR SUBSCRIPTION','SERVICE BRANDING'],
    'wiggly-yum':['KIDS','SNACK','PACKAGE'],
    'world-cross':['CORPORATE','CI RENEWAL','EDITORIAL'],
    yoriko:['F&B','YOGURT','PACKAGE'],
    fineb:['PRINTING','WEBSITE','QUOTE SYSTEM'],
    'tne-epc':['SOLAR EPC','CORPORATE WEBSITE','DATA ARCHIVE'],
    relim:['LEISURE','WEBSITE','ADMIN SYSTEM'],
    aesost:['COMMUNITY','PLATFORM','MEMBER SYSTEM'],
    kekomi:['E-COMMERCE','CAFE24','WEBSITE'],
    thomastone:['HEALTHCARE','AI','CORPORATE WEBSITE'],
    recelleclore:['DERMOCOSMETIC','E-COMMERCE','CONTENT SYSTEM'],
    'nineworks-crm':['CRM','OPERATIONS','ADMIN SYSTEM'],
    'west-bromwich-albion':['FOOTBALL','HERITAGE','CLUB REBRANDING']
  };

  const TITLE_CURATED = {
    coventrycityfc:['FOOTBALL','CLUB IDENTITY','REBRANDING'],
    tythonicindustries:['GAME','GAME BRANDING','WORLD-BUILDING'],
    westbromwichalbion:['FOOTBALL','HERITAGE','CLUB REBRANDING'],
    aesost:['EDUCATION','BRAND IDENTITY','VISUAL SYSTEM'],
    privion:['TECH','BRAND IDENTITY','VISUAL SYSTEM'],
    denovopharm:['HEALTHCARE','CORPORATE','BRAND SYSTEM'],
    '1plan':['HEALTH','CONSULTING','BRAND SYSTEM'],
    muscovyduvet:['BEDDING','LIFESTYLE','BRAND IDENTITY'],
    pentagon:['CORPORATE','CI','VISUAL SYSTEM'],
    damo:['LIFESTYLE','BRAND IDENTITY','GRAPHIC'],
    thecarbonstudio:['CREATIVE STUDIO','IDENTITY','EDITORIAL'],
    thepetrichor:['SKINCARE','BEAUTY','BRAND EXPERIENCE'],
    laff:['LIFESTYLE','IDENTITY','TYPOGRAPHY'],
    mohb:['F&B','CAFE','BRAND IDENTITY'],
    blondy:['HYGIENE','LIFESTYLE','PACKAGE'],
    worldcross:['CORPORATE','CI RENEWAL','EDITORIAL'],
    chapter:['F&B','SPACE','BRAND EXPERIENCE'],
    tigre:['F&B','LOCAL BRAND','PACKAGE'],
    taepyung:['MANUFACTURING','CORPORATE','HERITAGE'],
    terracle:['CLEANTECH','TECHNOLOGY','CORPORATE'],
    toylub:['SKINCARE','PRODUCT','PACKAGE'],
    haveaseat:['FURNITURE','LIFESTYLE','E-COMMERCE'],
    jewood:['SKINCARE','BEAUTY','PACKAGE'],
    eyesafer:['EYECARE','PRODUCT','BRANDING'],
    wigglyyum:['KIDS','SNACK','PACKAGE'],
    denti:['DENTAL','HEALTHCARE','SERVICE BRANDING'],
    연꽃감:['LOCAL FOOD','F&B','PACKAGE'],
    pausenality:['FRAGRANCE','LIFESTYLE','PACKAGE'],
    breezecoffee:['F&B','COFFEE','SPACE'],
    mailday:['LIFESTYLE','BRAND IDENTITY','GRAPHIC'],
    viliv:['LIFESTYLE','IDENTITY','VISUAL SYSTEM'],
    yoriko:['F&B','YOGURT','PACKAGE'],
    myv:['PLATFORM','LIFESTYLE','SERVICE BRANDING'],
    somsomlike:['LIFESTYLE','GOODS','BRAND IDENTITY'],
    greedyscent:['FRAGRANCE','BEAUTY','ART DIRECTION'],
    mayer:['LIFESTYLE','BRAND IDENTITY','VISUAL SYSTEM'],
    thespa:['BATH CARE','WELLNESS','SERVICE BRANDING'],
    byso:['BRAND IDENTITY','TYPOGRAPHY','VISUAL SYSTEM'],
    aromachemi:['FRAGRANCE','BEAUTY','PRODUCT'],
    sostlabs:['TECHNOLOGY','LABS','CORPORATE IDENTITY']
  };

  const RULES = [
    [/football|soccer|\bfc\b|club identity|crest|throstle/, 'FOOTBALL'],
    [/game|pubg|battleground|world[- ]?building|blue chip/, 'GAME'],
    [/hotel|hot spring|resort|hospitality|stay/, 'HOSPITALITY'],
    [/coffee|cafe|café|bakery|bread|pizza|pasta|dessert|food|snack|yogurt|honey|ginseng|matcha/, 'F&B'],
    [/skincare|dermocosmetic|beauty|cosmetic|bath care|shower/, 'BEAUTY'],
    [/fragrance|scent|perfume|aroma/, 'FRAGRANCE'],
    [/health|wellness|diet|protein|supplement|dental|oral healthcare/, 'HEALTHCARE'],
    [/pet|dog|animal/, 'PET'],
    [/education|school|campus|university|career counseling/, 'EDUCATION'],
    [/furniture|bedding|duvet|home living/, 'LIFESTYLE'],
    [/solar|cleantech|technology|tech|ai|cloud|salesforce|lab/, 'TECHNOLOGY'],
    [/real estate|property|brokerage/, 'REAL ESTATE'],
    [/car subscription|mobility|parking/, 'MOBILITY'],
    [/museum|exhibition|symposium|demo day|event|pop-up/, 'EVENT'],
    [/music/, 'MUSIC'],
    [/fashion|women.?s lifestyle/, 'FASHION'],
    [/printing|paper|manufacturing|factory/, 'MANUFACTURING']
  ];

  const FILTER_KEYWORDS = {
    package:'PACKAGE', detailpage:'DETAIL PAGE', website:'WEBSITE', system:'SYSTEM',
    editorial:'EDITORIAL', ir:'IR / PPT', event:'EVENT', localbranding:'LOCAL BRANDING',
    develop:'DIGITAL BUILD', digital:'DIGITAL SERVICE', branding:'BRAND IDENTITY', content:'CONTENT DESIGN'
  };

  const uniquePush = (array, value) => {
    if (value && !array.includes(value)) array.push(value);
  };

  const keywordsFor = (item = {}) => {
    if (Array.isArray(item.keywords) && item.keywords.length) return item.keywords.slice(0, 3);
    const id = String(item.id || '').trim();
    if (CURATED[id]) return CURATED[id].slice();
    const titleKey = normalize(item.title || item.client || '');
    if (TITLE_CURATED[titleKey]) return TITLE_CURATED[titleKey].slice();

    const text = `${item.title || ''} ${item.client || ''} ${item.subtitle || ''} ${item.scope || ''} ${(item.filters || []).join(' ')}`.toLowerCase();
    const result = [];
    RULES.forEach(([pattern, keyword]) => {
      if (result.length < 2 && pattern.test(text)) uniquePush(result, keyword);
    });

    const filters = Array.isArray(item.filters) ? item.filters : [];
    ['localbranding','package','detailpage','website','system','editorial','ir','event','develop','digital','branding','content'].forEach((filter) => {
      if (filters.includes(filter) && result.length < 3) uniquePush(result, FILTER_KEYWORDS[filter]);
    });

    if (/platform|community|membership|member flow|service/i.test(text) && result.length < 3) uniquePush(result, 'PLATFORM / SERVICE');
    if (/package|packaging|gift/i.test(text) && result.length < 3) uniquePush(result, 'PACKAGE');
    if (/website|web\b|imweb|cafe24|github pages/i.test(text) && result.length < 3) uniquePush(result, 'WEBSITE');
    if (/crm|admin|system|firebase|reservation|quote system/i.test(text) && result.length < 3) uniquePush(result, 'SYSTEM');
    if (/editorial|brochure|catalog|leaflet|publication/i.test(text) && result.length < 3) uniquePush(result, 'EDITORIAL');
    if (/brand identity|visual identity|brand system|logo|ci renewal|branding/i.test(text) && result.length < 3) uniquePush(result, 'BRAND IDENTITY');

    while (result.length < 3) {
      if (!result.includes('VISUAL SYSTEM')) result.push('VISUAL SYSTEM');
      else if (!result.includes('DESIGN')) result.push('DESIGN');
      else break;
    }
    return result.slice(0, 3);
  };

  const keywordTextFor = (item = {}) => keywordsFor(item).join(' · ');
  window.NW_PORTFOLIO_META = { keywordsFor, keywordTextFor };
  window.NW_PORTFOLIO.forEach((project) => { project.keywords = keywordsFor(project); });

  const dataPools = () => [
    ...(Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : []),
    ...(Array.isArray(window.NW_PORTFOLIO_ARCHIVE) ? window.NW_PORTFOLIO_ARCHIVE : []),
    ...(Array.isArray(window.NW_DETAILPAGE_ARCHIVE) ? window.NW_DETAILPAGE_ARCHIVE : []),
    ...(Array.isArray(window.NW_LOCAL_BRANDING_ARCHIVE) ? window.NW_LOCAL_BRANDING_ARCHIVE : [])
  ];

  const workIdFromCard = (card) => {
    const direct = card.querySelector('[data-archive-id]')?.dataset.archiveId
      || card.querySelector('[data-major-archive-id]')?.dataset.majorArchiveId
      || card.dataset.majorSubarchiveCard;
    if (direct) return direct;
    const href = card.querySelector('a[href]')?.getAttribute('href') || '';
    try { return new URL(href, location.href).searchParams.get('work') || ''; }
    catch (_) { return ''; }
  };

  const titleFromCard = (card) => card.querySelector('h2, .portfolio-card__info strong, .major-work-card__info strong, .major-browser-card__info strong, .major-subarchive-card__info strong')?.textContent?.trim() || '';
  const subtitleFromCard = (card) => card.querySelector('.portfolio-card__info div>span, .major-work-card__info div>span, .major-browser-card__info p, .major-subarchive-card__info p, .project-card>p, .project-card a>p')?.textContent?.trim() || '';

  const itemForCard = (card) => {
    const id = workIdFromCard(card);
    const title = titleFromCard(card);
    const pools = dataPools();
    const found = (id && pools.find((item) => String(item?.id || '') === id))
      || pools.find((item) => normalize(item?.title || item?.client || '') === normalize(title));
    if (found) return found;
    return {
      id,
      title,
      subtitle: subtitleFromCard(card),
      filters: (card.dataset.category || '').split(/\s+/).filter(Boolean)
    };
  };

  const metaTarget = (card) => {
    if (card.matches('.portfolio-card')) return card.querySelector('.portfolio-card__scope');
    if (card.matches('.major-work-card')) return card.querySelector('.major-work-card__info em');
    if (card.matches('.major-browser-card')) return card.querySelector('.major-browser-card__info > span');
    if (card.matches('.major-subarchive-card')) return card.querySelector('.major-subarchive-card__info > span');
    if (card.matches('.project-card')) return card.querySelector('.project-card__meta span');
    return null;
  };

  const enhanceCard = (card) => {
    const item = itemForCard(card);
    const keywords = keywordTextFor(item);
    const target = metaTarget(card);
    if (!target || !keywords) return;
    if (target.textContent.trim() !== keywords) target.textContent = keywords;
    card.dataset.metaKeywords = keywords;
    card.dataset.nwMetaReady = 'true';
  };

  const enhanceDetail = () => {
    if (!document.body.classList.contains('portfolio-detail-page')) return;
    const facts = document.querySelector('.portfolio-detail-facts');
    const title = document.querySelector('.portfolio-detail-sidebar h1')?.textContent?.trim() || '';
    if (!facts || !title) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('work') || '';
    const pools = dataPools();
    const item = (id && pools.find((candidate) => String(candidate?.id || '') === id))
      || pools.find((candidate) => normalize(candidate?.title || candidate?.client || '') === normalize(title))
      || { id, title, subtitle: document.querySelector('.portfolio-detail-scope')?.textContent || '' };
    const keywords = keywordTextFor(item);
    if (!keywords) return;

    let keywordRow = facts.querySelector('[data-nw-keywords-fact]');
    if (!keywordRow) {
      keywordRow = document.createElement('div');
      keywordRow.dataset.nwKeywordsFact = 'true';
      keywordRow.innerHTML = '<dt>Keywords</dt><dd></dd>';
      facts.appendChild(keywordRow);
    }
    keywordRow.querySelector('dd').textContent = keywords;

    let meta = document.querySelector('meta[name="keywords"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'keywords';
      document.head.appendChild(meta);
    }
    meta.content = keywords.replaceAll(' · ', ', ');
  };

  let scanQueued = false;
  const scan = () => {
    scanQueued = false;
    document.querySelectorAll('.portfolio-card:not([data-nw-meta-ready]), .major-work-card:not([data-nw-meta-ready]), .major-browser-card:not([data-nw-meta-ready]), .major-subarchive-card:not([data-nw-meta-ready]), .major-selected-projects .project-card:not([data-nw-meta-ready])').forEach(enhanceCard);
    enhanceDetail();
  };
  const queueScan = () => {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(scan);
  };

  queueScan();
  if (document.body) {
    const observer = new MutationObserver(queueScan);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

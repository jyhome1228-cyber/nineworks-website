(() => {
  const pages = [...document.querySelectorAll('.profile-page.focus')];
  if (!pages.length) return;

  const serviceContent = {
    Branding: {
      eyebrow: 'FROM POSITIONING TO IDENTITY',
      intro: '브랜드가 시장에서 어떤 위치를 가져야 하는지부터 실제 고객 접점에서 어떤 인상으로 반복되어야 하는지까지 하나의 기준으로 설계합니다.',
      cards: [
        ['01 / DISCOVER', 'Research & Diagnosis', '시장·경쟁사·고객·기존 자산을 검토해 현재 브랜드가 가진 강점과 문제를 구조화합니다.', 'MARKET · CUSTOMER · AUDIT'],
        ['02 / DEFINE', 'Positioning & Message', '핵심 가치, 브랜드 성격, 포지셔닝과 설명 문장을 정리해 브랜드가 무엇을 말할지 정의합니다.', 'POSITIONING · VALUE · MESSAGE'],
        ['03 / DESIGN', 'Visual Identity', '로고, 컬러, 타이포그래피, 그래픽과 이미지의 기준을 하나의 시각 시스템으로 구축합니다.', 'LOGO · TYPE · COLOR · GRAPHIC'],
        ['04 / APPLY', 'Brand Application', '패키지, 문서, 디지털 화면, 콘텐츠 등 실제 접점에 동일한 규칙이 이어지도록 확장합니다.', 'GUIDELINE · TEMPLATE · ASSET']
      ],
      noteTitle: 'Typical Deliverables',
      note: 'Brand Direction / Naming & Message / Logo System / Color & Type / Graphic System / Application Guide / Master Asset'
    },
    Digital: {
      eyebrow: 'FROM IA TO OPERATION',
      intro: '보여지는 화면뿐 아니라 사용자가 이동하는 흐름과 운영자가 관리하는 구조까지 함께 설계합니다. 브랜드 사이트부터 커머스, 관리자와 데이터 기반 시스템까지 프로젝트 목적에 맞춰 구축합니다.',
      cards: [
        ['01 / WEBSITE', 'Corporate & Brand Site', '기업·브랜드 소개, 포트폴리오, 콘텐츠와 문의 흐름을 목적에 맞게 설계하고 반응형 웹으로 구현합니다.', 'IA · UX/UI · RESPONSIVE'],
        ['02 / COMMERCE', 'Commerce Experience', '카페24·아임웹을 포함해 상품 탐색, 상세페이지, 프로모션과 구매 접점을 브랜드 경험으로 정리합니다.', 'CAFE24 · IMWEB · PRODUCT'],
        ['03 / SYSTEM', 'Admin & CRM', '문의, 회원, 고객, 일정, 프로젝트와 문서를 관리할 수 있는 내부 운영용 대시보드를 구성합니다.', 'ADMIN · CRM · FIREBASE'],
        ['04 / CUSTOM', 'Custom Development', 'HTML/CSS/JavaScript 기반 기능과 API·데이터 연동을 통해 서비스에 필요한 커스텀 기능을 개발합니다.', 'JS · API · DATABASE · FORM']
      ],
      noteTitle: 'Build Scope',
      note: 'Planning / IA / UX·UI / Responsive Web / Commerce / Member / Form / Admin / CRM / Firebase / API / Deployment'
    },
    Production: {
      eyebrow: 'FROM ARTWORK TO DELIVERY',
      intro: '디자인 시안이 실제 생산 과정에서 달라지지 않도록 소재, 규격, 인쇄 방식과 후가공까지 검토합니다. 필요하면 샘플·감리·본생산과 납품까지 연결합니다.',
      cards: [
        ['01 / PACKAGE', 'Package Structure', '용기, 라벨, 단상자, 슬리브, 세트박스와 쇼핑백 등 제품 특성에 맞는 구조와 그래픽을 설계합니다.', 'LABEL · BOX · SLEEVE · SET'],
        ['02 / MATERIAL', 'Material & Specification', '지류, 필름, 용기 소재와 규격, 수량을 검토해 목적과 예산에 맞는 제작 사양을 정리합니다.', 'PAPER · FILM · CONTAINER'],
        ['03 / FINISH', 'Print & Finishing', '별색, 박, 형압, 코팅, 도무송 등 후가공을 시각 효과와 실제 생산 가능성을 함께 고려해 적용합니다.', 'PRINT · FOIL · EMBOSS · COATING'],
        ['04 / PRODUCE', 'Proof & Production', '본생산 전 샘플과 교정을 확인하고 제작 일정, 품질, 수량과 납품 과정까지 관리합니다.', 'PROOF · SAMPLE · QC · DELIVERY']
      ],
      noteTitle: 'Production Scope',
      note: 'Artwork / Dieline / Material / Print Spec / Finishing / Mock-up / Proof / Sample / Production / Quality Check / Delivery'
    }
  };

  const esc = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  pages.forEach((page) => {
    const title = page.querySelector('.page-title')?.textContent?.trim();
    const data = serviceContent[title];
    if (!data) return;

    const copy = page.querySelector('.focus-copy');
    const index = page.querySelector('.focus-index');
    const list = page.querySelector('.focus-list');
    if (!copy || copy.querySelector('.focus-rich')) return;

    const rich = document.createElement('div');
    rich.className = 'focus-rich';
    rich.innerHTML = `
      <div class="focus-rich-intro">
        <span>${esc(data.eyebrow)}</span>
        <p>${esc(data.intro)}</p>
      </div>
      <div class="focus-rich-grid">
        ${data.cards.map(([num, title, body, tags]) => `
          <article class="focus-rich-card">
            <span class="focus-rich-card__num">${esc(num)}</span>
            <h4>${esc(title)}</h4>
            <p>${esc(body)}</p>
            <small>${esc(tags)}</small>
          </article>`).join('')}
      </div>
      <div class="focus-rich-note"><strong>${esc(data.noteTitle)}</strong><span>${esc(data.note)}</span></div>`;

    if (list) copy.insertBefore(rich, list);
    else copy.appendChild(rich);

    if (index && !index.querySelector('.focus-index-copy')) {
      const side = document.createElement('div');
      side.className = 'focus-index-copy';
      side.innerHTML = `<span>CORE SERVICE</span><strong>${esc(data.eyebrow)}</strong><p>${esc(data.note)}</p>`;
      index.appendChild(side);
    }
  });
})();
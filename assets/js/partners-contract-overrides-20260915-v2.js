(() => {
  const TARGET_EMAIL = 's.nninyong@gmail.com';
  const CONTRACT = Object.freeze({
    partnerName: '신민용',
    company: '알피바이오',
    projectName: '건강기능식품 신규 브랜드 런칭',
    scope: '프로젝트 전반 어시스트',
    effectiveDate: '2026.09.15',
    gross: 5000000,
    advance: 2500000,
    withholdingRate: '3.3%',
    withholding: 165000,
    balanceGross: 2500000,
    balanceNet: 2335000,
    totalNet: 4835000,
    balanceCondition: '알피바이오 프로젝트 잔금 입금 시'
  });

  let activeEmail = '';
  let timer = null;
  const adjustedValues = new WeakMap();

  const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
  const numberFromMoney = (value = '') => Number(String(value || '').replace(/[^0-9-]/g, '')) || 0;
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');

  const isTarget = () => activeEmail === TARGET_EMAIL
    || String(document.querySelector('[data-partner-greeting]')?.textContent || '').includes(CONTRACT.partnerName);

  const injectStyle = () => {
    if (document.querySelector('style[data-rpbio-contract-style]')) return;
    const style = document.createElement('style');
    style.dataset.rpbioContractStyle = 'true';
    style.textContent = `
      .nw-rpbio-contract-brief{margin:14px 0 0;padding:14px 16px;background:#f5f7f3;border:1px solid #dde5da;display:flex;align-items:center;justify-content:space-between;gap:20px;color:#596259;font-size:10px;line-height:1.65}
      .nw-rpbio-contract-brief strong{display:block;margin-bottom:3px;color:#203e27;font-size:9px;letter-spacing:.05em}.nw-rpbio-contract-brief button{flex:0 0 auto;border:0;border-bottom:1px solid #1f3d25;background:transparent;padding:2px 0;color:#1f3d25;font-size:9px;cursor:pointer}
      .nw-rpbio-contract-page{max-width:1180px}.nw-contract-document{margin-top:24px;border:1px solid #d9d9d4;background:#fff}.nw-contract-document__top{display:flex;justify-content:space-between;gap:30px;padding:28px 30px;border-bottom:1px solid #deded9}.nw-contract-document__top span{display:block;color:#8b8b86;font-size:9px;letter-spacing:.08em}.nw-contract-document__top h3{margin:8px 0 0;font-size:25px;font-weight:500;letter-spacing:-.045em}.nw-contract-document__status{align-self:flex-start;padding:6px 9px;border:1px solid #bfcbbd;background:#f4f8f3;color:#3d5d42;font-size:8px;letter-spacing:.05em;white-space:nowrap}
      .nw-contract-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid #deded9}.nw-contract-summary>div{padding:18px 20px;border-right:1px solid #deded9}.nw-contract-summary>div:last-child{border-right:0}.nw-contract-summary span{display:block;color:#999;font-size:8px;letter-spacing:.04em}.nw-contract-summary strong{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.55;word-break:keep-all}
      .nw-contract-parties{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #deded9}.nw-contract-party{padding:20px 22px}.nw-contract-party:first-child{border-right:1px solid #deded9}.nw-contract-party span{display:block;color:#999;font-size:8px}.nw-contract-party strong{display:block;margin-top:7px;font-size:14px;font-weight:500}.nw-contract-party p{margin:6px 0 0;color:#777;font-size:10px}
      .nw-contract-clauses{padding:6px 30px 24px}.nw-contract-clause{display:grid;grid-template-columns:44px 180px minmax(0,1fr);gap:18px;padding:20px 0;border-bottom:1px solid #e7e7e2}.nw-contract-clause:last-child{border-bottom:0}.nw-contract-clause b{font-size:10px;font-weight:500;color:#777}.nw-contract-clause strong{font-size:11px;font-weight:600}.nw-contract-clause p{margin:0;color:#555;font-size:11px;line-height:1.75;word-break:keep-all}.nw-contract-clause ul{margin:0;padding-left:16px;color:#555;font-size:11px;line-height:1.8}.nw-contract-payment{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}.nw-contract-payment div{padding:11px 12px;background:#f6f6f3}.nw-contract-payment span{display:block;color:#999;font-size:8px}.nw-contract-payment strong{display:block;margin-top:5px;font-size:11px;font-weight:500}
      .nw-contract-footer{padding:20px 30px;border-top:1px solid #deded9;background:#fafaf8;display:flex;align-items:center;justify-content:space-between;gap:20px}.nw-contract-footer p{margin:0;color:#777;font-size:9px;line-height:1.6}.nw-contract-footer button{height:34px;padding:0 14px;border:1px solid #bbb;background:#fff;color:#333;font-size:9px;cursor:pointer;white-space:nowrap}
      .nw-rpbio-contract-card{margin-top:22px;padding:20px;border:1px solid #dfe3dc;background:#fafbf9}.nw-rpbio-contract-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:15px;border-bottom:1px solid #e2e5df}.nw-rpbio-contract-card__head span{display:block;color:#8a8f89;font-size:9px;letter-spacing:.08em}.nw-rpbio-contract-card__head strong{display:block;margin-top:6px;font-size:18px;font-weight:500;letter-spacing:-.035em}.nw-rpbio-contract-card__badge{padding:5px 8px;border:1px solid #cfd8cf;background:#f2f7f1;color:#3d6243;font-size:8px;white-space:nowrap}.nw-rpbio-contract-card__grid{display:grid;grid-template-columns:1.2fr repeat(4,minmax(0,1fr));margin-top:15px;border:1px solid #e1e4df;background:#fff}.nw-rpbio-contract-card__grid div{padding:12px;border-right:1px solid #e1e4df}.nw-rpbio-contract-card__grid div:last-child{border-right:0}.nw-rpbio-contract-card__grid span{display:block;color:#969b95;font-size:8px}.nw-rpbio-contract-card__grid b{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.45}.nw-rpbio-contract-card__note{margin:12px 0 0;color:#666d66;font-size:10px;line-height:1.65}.nw-rpbio-contract-card__note strong{color:#222;font-weight:600}
      @media(max-width:900px){.nw-contract-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.nw-contract-summary>div{border-bottom:1px solid #deded9}.nw-contract-clause{grid-template-columns:36px 140px minmax(0,1fr)}.nw-contract-payment{grid-template-columns:repeat(2,minmax(0,1fr))}.nw-rpbio-contract-card__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:620px){.nw-rpbio-contract-brief{align-items:flex-start;flex-direction:column}.nw-contract-document__top{padding:20px;display:block}.nw-contract-document__status{display:inline-block;margin-top:12px}.nw-contract-summary,.nw-contract-parties{grid-template-columns:1fr}.nw-contract-summary>div,.nw-contract-party:first-child{border-right:0}.nw-contract-party:first-child{border-bottom:1px solid #deded9}.nw-contract-clauses{padding:4px 20px 18px}.nw-contract-clause{grid-template-columns:30px 1fr;gap:10px}.nw-contract-clause p,.nw-contract-clause ul,.nw-contract-payment{grid-column:2/-1}.nw-contract-payment{grid-template-columns:1fr}.nw-contract-footer{padding:16px 20px;align-items:flex-start;flex-direction:column}.nw-rpbio-contract-card__head{display:block}.nw-rpbio-contract-card__badge{display:inline-block;margin-top:10px}.nw-rpbio-contract-card__grid{grid-template-columns:1fr}}
      @media print{.partner-shell-header,.partner-page-nav,.partner-shell-actions,.nw-contract-footer button{display:none!important}.partner-page{display:none!important}.partner-page.nw-rpbio-contract-page{display:block!important}.nw-contract-document{border:0}.nw-contract-document__top,.nw-contract-summary,.nw-contract-parties,.nw-contract-footer{break-inside:avoid}.nw-contract-clause{break-inside:avoid}}
    `;
    document.head.appendChild(style);
  };

  const showContractPage = () => {
    document.querySelectorAll('[data-partner-page]').forEach((page) => page.classList.remove('is-active'));
    document.querySelectorAll('[data-partner-page-link]').forEach((button) => button.classList.remove('is-active'));
    document.querySelector('[data-partner-page="contract"]')?.classList.add('is-active');
    document.querySelector('[data-partner-page-link="contract"]')?.classList.add('is-active');
    if (history.replaceState) history.replaceState(null, '', `${location.pathname}#contract`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const ensureContractMenu = () => {
    const nav = document.querySelector('[data-partner-page-nav]');
    if (!nav) return;
    let button = nav.querySelector('[data-partner-page-link="contract"]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.dataset.partnerPageLink = 'contract';
      button.textContent = '계약서';
      const accountButton = nav.querySelector('[data-partner-page-link="account"]');
      accountButton ? nav.insertBefore(button, accountButton) : nav.appendChild(button);
      button.addEventListener('click', showContractPage);
    }

    if (!nav.dataset.contractCleanupBound) {
      nav.dataset.contractCleanupBound = 'true';
      nav.addEventListener('click', (event) => {
        const clicked = event.target.closest('[data-partner-page-link]');
        if (!clicked || clicked.dataset.partnerPageLink === 'contract') return;
        document.querySelector('[data-partner-page-link="contract"]')?.classList.remove('is-active');
      });
    }
  };

  const contractDocumentHTML = () => `
    <div class="partner-page-head"><div><span>CONTRACT</span><h2>프리랜서 계약서</h2></div><p>현재 배정된 알피바이오 프로젝트의 계약 조건과 업무 범위를 확인합니다.</p></div>
    <section class="nw-contract-document">
      <div class="nw-contract-document__top">
        <div><span>NINEWORKS / FREELANCER SERVICE AGREEMENT</span><h3>프로젝트 업무위탁 계약서</h3></div>
        <em class="nw-contract-document__status">진행 · ACTIVE</em>
      </div>
      <div class="nw-contract-summary">
        <div><span>PROJECT</span><strong>${escapeHTML(CONTRACT.projectName)}</strong></div>
        <div><span>CLIENT</span><strong>${escapeHTML(CONTRACT.company)}</strong></div>
        <div><span>CONTRACT FEE</span><strong>${money(CONTRACT.gross)}</strong></div>
        <div><span>EFFECTIVE DATE</span><strong>${escapeHTML(CONTRACT.effectiveDate)}</strong></div>
      </div>
      <div class="nw-contract-parties">
        <div class="nw-contract-party"><span>위탁자</span><strong>NINEWORKS · 나인웍스</strong><p>프로젝트 운영 및 업무 위탁</p></div>
        <div class="nw-contract-party"><span>수탁자</span><strong>${escapeHTML(CONTRACT.partnerName)}</strong><p>Freelance Design Partner</p></div>
      </div>
      <div class="nw-contract-clauses">
        <div class="nw-contract-clause"><b>01</b><strong>계약 목적</strong><p>본 계약은 나인웍스가 수행하는 ${escapeHTML(CONTRACT.company)}의 「${escapeHTML(CONTRACT.projectName)}」 프로젝트를 원활하게 진행하기 위해 수탁자에게 프로젝트 실무 일부를 위탁하는 것을 목적으로 합니다.</p></div>
        <div class="nw-contract-clause"><b>02</b><strong>업무 범위</strong><div><p>기본 업무 범위는 <b>${escapeHTML(CONTRACT.scope)}</b>이며, 프로젝트 진행 과정에서 나인웍스와 협의한 범위 내에서 다음 업무를 포함할 수 있습니다.</p><ul><li>브랜드 디자인 및 BI·로고·비주얼 시스템 관련 실무 보조</li><li>패키지 디자인 및 확장 시스템 관련 디자인 어시스트</li><li>Figma·문서 기반 자료 정리와 수정사항 반영</li><li>프로젝트 운영 과정의 디자인 실무 및 기타 상호 합의 업무</li></ul></div></div>
        <div class="nw-contract-clause"><b>03</b><strong>계약금액 및 지급</strong><div><p>총 계약금액은 ${money(CONTRACT.gross)}이며 프리랜서 사업소득 원천징수 ${CONTRACT.withholdingRate}가 적용됩니다. 선금은 공제 없이 ${money(CONTRACT.advance)}을 지급하고, 전체 계약금액 기준 원천징수액 ${money(CONTRACT.withholding)}은 잔금 지급 시 일괄 공제합니다.</p><div class="nw-contract-payment"><div><span>총 계약금액</span><strong>${money(CONTRACT.gross)}</strong></div><div><span>선금</span><strong>${money(CONTRACT.advance)}</strong></div><div><span>원천징수 3.3%</span><strong>${money(CONTRACT.withholding)}</strong></div><div><span>잔금 실지급</span><strong>${money(CONTRACT.balanceNet)}</strong></div></div><p style="margin-top:10px">잔금 지급시점은 <b>${escapeHTML(CONTRACT.balanceCondition)}</b>이며, 총 예상 실지급액은 ${money(CONTRACT.totalNet)}입니다.</p></div></div>
        <div class="nw-contract-clause"><b>04</b><strong>업무 진행 및 전달</strong><p>수탁자는 나인웍스가 전달하는 프로젝트 방향, 일정 및 작업 기준에 따라 업무를 진행하고, 작업 과정과 수정 이력을 Figma 또는 지정된 문서 시스템을 통해 확인 가능하도록 정리합니다. 일정 또는 범위에 영향을 줄 수 있는 이슈는 사전에 공유합니다.</p></div>
        <div class="nw-contract-clause"><b>05</b><strong>저작권 및 사용권</strong><p>본 프로젝트를 위해 제작된 결과물과 작업 데이터의 업무상 사용권은 계약대금 지급을 전제로 나인웍스 및 최종 클라이언트의 프로젝트 목적 범위에서 사용할 수 있습니다. 제3자의 저작물을 사용할 경우 적법한 사용 권한을 확인해야 합니다.</p></div>
        <div class="nw-contract-clause"><b>06</b><strong>비밀유지</strong><p>수탁자는 프로젝트 과정에서 알게 된 클라이언트 정보, 미공개 디자인, 원본 데이터, 견적·계약·운영 정보 등 비공개 자료를 외부에 전달하거나 공개하지 않습니다. 계약 종료 후에도 미공개 정보에 대한 비밀유지 의무는 유지됩니다.</p></div>
        <div class="nw-contract-clause"><b>07</b><strong>포트폴리오 공개</strong><p>참여 사실과 결과물은 나인웍스 및 클라이언트의 공식 공개 이후, 사전 협의된 범위에서 개인 포트폴리오로 활용할 수 있습니다. 공개 전 시안·원본 데이터·내부 문서는 게시하지 않습니다.</p></div>
        <div class="nw-contract-clause"><b>08</b><strong>변경 및 종료</strong><p>프로젝트 범위, 일정 또는 조건에 중대한 변경이 필요한 경우 상호 협의하여 조정합니다. 프로젝트가 중단되거나 계약을 종료해야 할 사유가 발생하는 경우 이미 수행된 업무와 지급금액을 기준으로 정산 조건을 별도 협의합니다.</p></div>
        <div class="nw-contract-clause"><b>09</b><strong>기타</strong><p>본 화면은 해당 프로젝트의 프리랜서 계약 조건 확인을 위한 내부 계약 문서입니다. 별도의 서명 계약서 또는 추가 합의서가 존재하는 경우 해당 서명본 및 추가 합의 내용을 우선 적용합니다.</p></div>
      </div>
      <div class="nw-contract-footer"><p>본 계약 정보는 나인웍스와 해당 프리랜서 파트너에게만 표시되며 알피바이오 클라이언트 대시보드에는 노출되지 않습니다.</p><button type="button" data-contract-print>PRINT / PDF</button></div>
    </section>`;

  const ensureContractPage = () => {
    const content = document.querySelector('.partner-content');
    if (!content) return;
    let page = content.querySelector('[data-partner-page="contract"]');
    if (!page) {
      page = document.createElement('section');
      page.className = 'partner-page nw-rpbio-contract-page';
      page.dataset.partnerPage = 'contract';
      content.appendChild(page);
    }
    if (page.dataset.contractReady !== 'true') {
      page.dataset.contractReady = 'true';
      page.innerHTML = contractDocumentHTML();
      page.querySelector('[data-contract-print]')?.addEventListener('click', () => window.print());
    }
  };

  const dedupeProjectRows = () => {
    const list = document.querySelector('[data-partner-project-list]');
    if (!list) return null;
    const rows = Array.from(list.querySelectorAll('.project-row')).filter((row) => String(row.textContent || '').includes(CONTRACT.company));
    if (!rows.length) return null;
    const preferred = rows.find((row) => String(row.textContent || '').includes(CONTRACT.projectName)) || rows[0];
    rows.forEach((row) => {
      if (row === preferred) return;
      const brief = row.nextElementSibling;
      if (brief?.classList?.contains('partner-project-brief')) brief.remove();
      row.remove();
    });
    return preferred;
  };

  const ensureProject = () => {
    const row = dedupeProjectRows();
    if (!row) return;
    const title = row.querySelector('strong');
    if (title && String(title.textContent || '').trim() === '알피바이오 프로젝트') title.textContent = CONTRACT.projectName;
    const status = row.querySelector('.project-status');
    if (status) { status.textContent = '진행'; status.classList.add('is-active'); }
    const brief = row.nextElementSibling;
    if (!brief?.classList?.contains('partner-project-brief')) return;
    brief.querySelectorAll('[data-rpbio-terms],.nw-rpbio-contract-brief').forEach((node) => node.remove());
    const callout = document.createElement('div');
    callout.className = 'nw-rpbio-contract-brief';
    callout.dataset.rpbioTerms = 'true';
    callout.innerHTML = `<div><strong>FREELANCER CONTRACT</strong>계약금액 ${money(CONTRACT.gross)} · 선금 ${money(CONTRACT.advance)} · 잔금 실지급 ${money(CONTRACT.balanceNet)} · 원천징수 ${money(CONTRACT.withholding)}</div><button type="button" data-open-rpbio-contract>계약서 확인 ↗</button>`;
    callout.querySelector('[data-open-rpbio-contract]')?.addEventListener('click', showContractPage);
    brief.appendChild(callout);
  };

  const accountMarkup = () => `<div class="partner-account-row__head"><div><span>${escapeHTML(CONTRACT.company)}</span><strong>${escapeHTML(CONTRACT.projectName)}</strong></div><em class="is-active is-freelancer">진행 · 프리랜서</em></div><div class="partner-account-row__amount"><div><span>계약금액</span><strong>${money(CONTRACT.gross)}</strong></div><div><span>선금</span><strong>${money(CONTRACT.advance)}</strong></div><div><span>잔금 실지급</span><strong>${money(CONTRACT.balanceNet)}</strong></div><div><span>원천징수 3.3%</span><strong>${money(CONTRACT.withholding)}</strong></div></div><div class="partner-account-note"><strong>지급 조건</strong> · 선금 ${money(CONTRACT.advance)} 지급. ${escapeHTML(CONTRACT.balanceCondition)} 잔금 ${money(CONTRACT.balanceGross)}에서 전체 계약금액 기준 원천징수 3.3% ${money(CONTRACT.withholding)}를 공제하고 ${money(CONTRACT.balanceNet)}을 지급합니다. 총 예상 실지급액은 ${money(CONTRACT.totalNet)}입니다.</div>`;

  const ensureAccount = () => {
    const list = document.querySelector('[data-partner-account-list]');
    if (!list) return;
    const rows = Array.from(list.querySelectorAll('.partner-account-row')).filter((row) => String(row.textContent || '').includes(CONTRACT.company));
    let row = rows[0];
    rows.slice(1).forEach((item) => item.remove());
    if (!row) {
      list.querySelector('.partner-empty')?.remove();
      row = document.createElement('article');
      row.className = 'partner-account-row';
      list.appendChild(row);
    }
    const markup = accountMarkup();
    if (row.innerHTML !== markup) row.innerHTML = markup;

    const page = document.querySelector('[data-partner-page="account"]');
    if (page && !page.querySelector('[data-rpbio-contract-card]')) {
      const card = document.createElement('section');
      card.className = 'nw-rpbio-contract-card';
      card.dataset.rpbioContractCard = 'true';
      card.innerHTML = `<div class="nw-rpbio-contract-card__head"><div><span>FREELANCER CONTRACT / ACTIVE</span><strong>${escapeHTML(CONTRACT.partnerName)} · ${escapeHTML(CONTRACT.projectName)}</strong></div><em class="nw-rpbio-contract-card__badge">CONTRACT LINKED</em></div><div class="nw-rpbio-contract-card__grid"><div><span>업무 범위</span><b>${escapeHTML(CONTRACT.scope)}</b></div><div><span>계약금액</span><b>${money(CONTRACT.gross)}</b></div><div><span>선금</span><b>${money(CONTRACT.advance)}</b></div><div><span>원천징수</span><b>3.3% · ${money(CONTRACT.withholding)}</b></div><div><span>잔금 실지급</span><b>${money(CONTRACT.balanceNet)}</b></div></div><p class="nw-rpbio-contract-card__note"><strong>정산 조건</strong> · ${escapeHTML(CONTRACT.balanceCondition)} 잔금을 지급하며 원천징수 3.3%는 잔금에서 일괄 공제합니다. <button type="button" data-open-rpbio-contract style="border:0;border-bottom:1px solid #333;background:none;padding:0;margin-left:6px;font-size:10px;cursor:pointer">계약서 전체보기 ↗</button></p>`;
      card.querySelector('[data-open-rpbio-contract]')?.addEventListener('click', showContractPage);
      const anchor = page.querySelector('.partner-account-form-wrap');
      anchor ? anchor.insertAdjacentElement('beforebegin', card) : page.appendChild(card);
    }
  };

  const ensureSchedule = () => {
    const box = document.querySelector('[data-partner-schedule]');
    if (!box) return;
    const rows = Array.from(box.querySelectorAll('.partner-schedule-row')).filter((row) => String(row.textContent || '').includes(CONTRACT.company));
    rows.slice(1).forEach((row) => row.remove());
    if (rows[0]) {
      const strong = rows[0].querySelector('strong');
      const span = rows[0].querySelector('span');
      if (strong) strong.textContent = CONTRACT.projectName;
      if (span) span.textContent = `${CONTRACT.company} · ${CONTRACT.scope}`;
    }
  };

  const adjustMoney = (selector, delta) => {
    const node = document.querySelector(selector);
    if (!node) return;
    const current = numberFromMoney(node.textContent);
    const state = adjustedValues.get(node);
    if (state && current === state.adjusted) return;
    const adjusted = Math.max(0, current + delta);
    node.textContent = money(adjusted);
    adjustedValues.set(node, { adjusted });
  };

  const ensureSettlementSummary = () => {
    adjustMoney('[data-account-summary="advance"]', CONTRACT.advance - Math.round(CONTRACT.totalNet * 0.5));
    adjustMoney('[data-account-summary="finalNet"]', CONTRACT.balanceNet - (CONTRACT.totalNet - Math.round(CONTRACT.totalNet * 0.5)));
    const advanceLabel = document.querySelector('[data-account-summary="advance"]')?.previousElementSibling;
    const balanceLabel = document.querySelector('[data-account-summary="finalNet"]')?.previousElementSibling;
    if (advanceLabel) advanceLabel.textContent = '선금';
    if (balanceLabel) balanceLabel.textContent = '잔금';
    const advanceNote = document.querySelector('[data-account-advance-note]');
    const balanceNote = document.querySelector('[data-account-balance-note]');
    if (advanceNote) advanceNote.textContent = '고정 선금 2,500,000원';
    if (balanceNote) balanceNote.textContent = '클라이언트 잔금 입금 시 3.3% 공제';
  };

  const ensurePolicy = () => {
    const businessLabel = document.querySelector('input[name="paymentType"][value="business"]')?.closest('label');
    if (businessLabel) businessLabel.style.display = 'none';
    const freelancer = document.querySelector('input[name="paymentType"][value="freelancer"]');
    if (freelancer && !freelancer.checked) freelancer.checked = true;
    const copy = document.querySelector('[data-payment-type-copy]');
    if (copy) copy.textContent = '본 프로젝트는 프리랜서 계약으로 3.3% 원천징수 조건이 적용됩니다.';
    const guide = document.querySelector('[data-payment-guide]');
    if (guide) guide.innerHTML = `<strong>${escapeHTML(CONTRACT.projectName)}</strong> · 선금 ${money(CONTRACT.advance)} 지급 후, 클라이언트 잔금 입금 시 원천징수 3.3% ${money(CONTRACT.withholding)}를 잔금에서 공제합니다.`;
    const policy = document.querySelector('[data-account-policy]');
    if (policy) policy.innerHTML = `<strong>정산 안내</strong> · 계약금액 ${money(CONTRACT.gross)} / 선금 ${money(CONTRACT.advance)} / 잔금 실지급 ${money(CONTRACT.balanceNet)}. 원천징수 3.3%는 잔금 지급 시 일괄 공제합니다.`;
  };

  const apply = () => {
    if (!isTarget()) return;
    injectStyle();
    ensureContractMenu();
    ensureContractPage();
    ensureProject();
    ensureAccount();
    ensureSchedule();
    ensureSettlementSummary();
    ensurePolicy();
    if (location.hash === '#contract') showContractPage();
  };

  const begin = () => {
    window.clearInterval(timer);
    apply();
    [80, 300, 900, 2200].forEach((ms) => window.setTimeout(apply, ms));
    timer = window.setInterval(apply, 1800);
  };

  document.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('[data-partner-login-form]');
    if (!form) return;
    activeEmail = String(form.querySelector('input[name="email"]')?.value || '').trim().toLowerCase();
    if (activeEmail === TARGET_EMAIL) window.setTimeout(begin, 10);
  }, true);

  document.addEventListener('DOMContentLoaded', () => { if (isTarget()) begin(); });
  window.addEventListener('pagehide', () => window.clearInterval(timer));
})();

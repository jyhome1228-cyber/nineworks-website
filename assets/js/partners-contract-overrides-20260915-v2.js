(() => {
  const CONTRACTS = Object.freeze({
    's.nninyong@gmail.com': {
      partnerName: '신민용', company: '알피바이오', projectName: '건강기능식품 신규 브랜드 런칭',
      scope: '프로젝트 전반 어시스트', effectiveDate: '2026.09.15', gross: 5000000,
      advance: 2500000, withholdingRate: '3.3%', withholding: 165000,
      balanceGross: 2500000, balanceNet: 2335000, totalNet: 4835000,
      balanceCondition: '알피바이오 프로젝트 잔금 입금 시', customLogin: false,
      typeLabel: 'Branding, Print', brief: '브랜드 디자인·패키지 디자인·프로젝트 전반 어시스트'
    },
    'daac-oh@naver.com': {
      partnerName: '오다혜', company: 'PHYTO REVOLUTION', projectName: 'PHYTO REVOLUTION',
      scope: '프로젝트 전반 어시스트', effectiveDate: '2026.09.15', gross: 1000000,
      advance: 500000, withholdingRate: '3.3%', withholding: 33000,
      balanceGross: 500000, balanceNet: 467000, totalNet: 967000,
      balanceCondition: 'PHYTO REVOLUTION 프로젝트 잔금 입금 시', customLogin: true,
      typeLabel: 'Branding, Package', brief: 'PHYTO REVOLUTION 브랜드·패키지 프로젝트 전반 어시스트'
    }
  });

  let activeEmail = '';
  let timer = null;
  let currentContract = null;
  let firebasePromise = null;
  const adjusted = new WeakMap();

  const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
  const num = (value = '') => Number(String(value || '').replace(/[^0-9-]/g, '')) || 0;
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  const getContract = () => CONTRACTS[activeEmail] || null;

  const getFirebase = () => {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import('/assets/js/firebase-client.js'),
        import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js')
      ]).then(([client, firestore]) => ({ db: client.db, ...firestore }));
    }
    return firebasePromise;
  };

  const injectStyle = () => {
    if (document.querySelector('style[data-partner-contract-style]')) return;
    const style = document.createElement('style');
    style.dataset.partnerContractStyle = 'true';
    style.textContent = `
      .nw-contract-brief{margin:14px 0 0;padding:14px 16px;background:#f5f7f3;border:1px solid #dde5da;display:flex;align-items:center;justify-content:space-between;gap:20px;color:#596259;font-size:10px;line-height:1.65}.nw-contract-brief strong{display:block;margin-bottom:3px;color:#203e27;font-size:9px;letter-spacing:.05em}.nw-contract-brief button{flex:0 0 auto;border:0;border-bottom:1px solid #1f3d25;background:transparent;padding:2px 0;color:#1f3d25;font-size:9px;cursor:pointer}
      .nw-contract-page{max-width:1180px}.nw-contract-document{margin-top:24px;border:1px solid #d9d9d4;background:#fff}.nw-contract-document__top{display:flex;justify-content:space-between;gap:30px;padding:28px 30px;border-bottom:1px solid #deded9}.nw-contract-document__top span{display:block;color:#8b8b86;font-size:9px;letter-spacing:.08em}.nw-contract-document__top h3{margin:8px 0 0;font-size:25px;font-weight:500;letter-spacing:-.045em}.nw-contract-document__status{align-self:flex-start;padding:6px 9px;border:1px solid #bfcbbd;background:#f4f8f3;color:#3d5d42;font-size:8px;letter-spacing:.05em;white-space:nowrap}
      .nw-contract-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid #deded9}.nw-contract-summary>div{padding:18px 20px;border-right:1px solid #deded9}.nw-contract-summary>div:last-child{border-right:0}.nw-contract-summary span{display:block;color:#999;font-size:8px}.nw-contract-summary strong{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.55}.nw-contract-parties{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #deded9}.nw-contract-party{padding:20px 22px}.nw-contract-party:first-child{border-right:1px solid #deded9}.nw-contract-party span{display:block;color:#999;font-size:8px}.nw-contract-party strong{display:block;margin-top:7px;font-size:14px;font-weight:500}.nw-contract-party p{margin:6px 0 0;color:#777;font-size:10px}
      .nw-contract-clauses{padding:6px 30px 24px}.nw-contract-clause{display:grid;grid-template-columns:44px 180px minmax(0,1fr);gap:18px;padding:20px 0;border-bottom:1px solid #e7e7e2}.nw-contract-clause:last-child{border-bottom:0}.nw-contract-clause b{font-size:10px;font-weight:500;color:#777}.nw-contract-clause strong{font-size:11px;font-weight:600}.nw-contract-clause p{margin:0;color:#555;font-size:11px;line-height:1.75;word-break:keep-all}.nw-contract-clause ul{margin:0;padding-left:16px;color:#555;font-size:11px;line-height:1.8}.nw-contract-payment{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}.nw-contract-payment div{padding:11px 12px;background:#f6f6f3}.nw-contract-payment span{display:block;color:#999;font-size:8px}.nw-contract-payment strong{display:block;margin-top:5px;font-size:11px;font-weight:500}.nw-contract-footer{padding:20px 30px;border-top:1px solid #deded9;background:#fafaf8;display:flex;align-items:center;justify-content:space-between;gap:20px}.nw-contract-footer p{margin:0;color:#777;font-size:9px;line-height:1.6}.nw-contract-footer button{height:34px;padding:0 14px;border:1px solid #bbb;background:#fff;color:#333;font-size:9px;cursor:pointer}
      .nw-fixed-account{border-color:#dfe7dd!important}
      @media(max-width:900px){.nw-contract-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.nw-contract-clause{grid-template-columns:36px 140px minmax(0,1fr)}.nw-contract-payment{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:620px){.nw-contract-brief{align-items:flex-start;flex-direction:column}.nw-contract-document__top{display:block;padding:20px}.nw-contract-document__status{display:inline-block;margin-top:12px}.nw-contract-summary,.nw-contract-parties{grid-template-columns:1fr}.nw-contract-party:first-child{border-right:0;border-bottom:1px solid #deded9}.nw-contract-clauses{padding:4px 20px 18px}.nw-contract-clause{grid-template-columns:30px 1fr;gap:10px}.nw-contract-clause p,.nw-contract-clause ul,.nw-contract-payment{grid-column:2/-1}.nw-contract-payment{grid-template-columns:1fr}.nw-contract-footer{padding:16px 20px;align-items:flex-start;flex-direction:column}}
      @media print{.partner-shell-header,.partner-page-nav,.partner-shell-actions,.nw-contract-footer button{display:none!important}.partner-page{display:none!important}.partner-page.nw-contract-page{display:block!important}.nw-contract-document{border:0}}
    `;
    document.head.appendChild(style);
  };

  const showContractPage = () => {
    document.querySelectorAll('[data-partner-page]').forEach((page) => page.classList.remove('is-active'));
    document.querySelectorAll('[data-partner-page-link]').forEach((button) => button.classList.remove('is-active'));
    document.querySelector('[data-partner-page="contract"]')?.classList.add('is-active');
    document.querySelector('[data-partner-page-link="contract"]')?.classList.add('is-active');
    history.replaceState?.(null, '', `${location.pathname}#contract`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const contractHTML = (c) => `
    <div class="partner-page-head"><div><span>CONTRACT</span><h2>프리랜서 계약서</h2></div><p>${escapeHTML(c.projectName)} 프로젝트의 계약 조건과 업무 범위를 확인합니다.</p></div>
    <section class="nw-contract-document">
      <div class="nw-contract-document__top"><div><span>NINEWORKS / FREELANCER SERVICE AGREEMENT</span><h3>프로젝트 업무위탁 계약서</h3></div><em class="nw-contract-document__status">진행 · ACTIVE</em></div>
      <div class="nw-contract-summary"><div><span>PROJECT</span><strong>${escapeHTML(c.projectName)}</strong></div><div><span>CLIENT</span><strong>${escapeHTML(c.company)}</strong></div><div><span>CONTRACT FEE</span><strong>${money(c.gross)}</strong></div><div><span>EFFECTIVE DATE</span><strong>${escapeHTML(c.effectiveDate)}</strong></div></div>
      <div class="nw-contract-parties"><div class="nw-contract-party"><span>위탁자</span><strong>NINEWORKS · 나인웍스</strong><p>프로젝트 운영 및 업무 위탁</p></div><div class="nw-contract-party"><span>수탁자</span><strong>${escapeHTML(c.partnerName)}</strong><p>Freelance Design Partner</p></div></div>
      <div class="nw-contract-clauses">
        <div class="nw-contract-clause"><b>01</b><strong>계약 목적</strong><p>본 계약은 나인웍스가 수행하는 ${escapeHTML(c.company)}의 「${escapeHTML(c.projectName)}」 프로젝트를 원활하게 진행하기 위해 수탁자에게 프로젝트 실무 일부를 위탁하는 것을 목적으로 합니다.</p></div>
        <div class="nw-contract-clause"><b>02</b><strong>업무 범위</strong><div><p>기본 업무 범위는 <b>${escapeHTML(c.scope)}</b>이며 아래 업무를 포함할 수 있습니다.</p><ul><li>브랜드 아이덴티티 및 비주얼 시스템 관련 디자인 어시스트</li><li>패키지 및 프로젝트 확장 디자인 실무 보조</li><li>Figma·문서 기반 자료 정리 및 수정사항 반영</li><li>프로젝트 일정·운영 과정에서 상호 협의한 디자인 업무</li></ul></div></div>
        <div class="nw-contract-clause"><b>03</b><strong>계약금액 및 지급</strong><div><p>총 계약금액은 ${money(c.gross)}이며 프리랜서 사업소득 원천징수 ${c.withholdingRate}가 적용됩니다. 선금 ${money(c.advance)}은 공제 없이 지급하고, 전체 계약금액 기준 원천징수액 ${money(c.withholding)}은 잔금 지급 시 일괄 공제합니다.</p><div class="nw-contract-payment"><div><span>총 계약금액</span><strong>${money(c.gross)}</strong></div><div><span>선금</span><strong>${money(c.advance)}</strong></div><div><span>원천징수 3.3%</span><strong>${money(c.withholding)}</strong></div><div><span>잔금 실지급</span><strong>${money(c.balanceNet)}</strong></div></div><p style="margin-top:10px">잔금 지급시점은 <b>${escapeHTML(c.balanceCondition)}</b>이며 총 예상 실지급액은 ${money(c.totalNet)}입니다.</p></div></div>
        <div class="nw-contract-clause"><b>04</b><strong>업무 진행 및 협의</strong><p>작업 범위·일정·산출물은 나인웍스의 프로젝트 운영 기준과 상호 협의에 따라 진행하며 주요 변경사항은 사전에 공유합니다.</p></div>
        <div class="nw-contract-clause"><b>05</b><strong>저작권 및 사용권</strong><p>프로젝트 수행 중 제작한 결과물과 원본 데이터의 최종 사용·제공 범위는 나인웍스와 클라이언트의 계약 조건을 우선합니다. 수탁자는 별도 동의 없이 원본 데이터를 제3자에게 제공하지 않습니다.</p></div>
        <div class="nw-contract-clause"><b>06</b><strong>비밀유지</strong><p>수탁자는 프로젝트 과정에서 알게 된 미공개 기획, 시안, 사업정보, 고객정보 및 자료를 외부에 공개하거나 목적 외로 사용하지 않습니다.</p></div>
        <div class="nw-contract-clause"><b>07</b><strong>포트폴리오 공개</strong><p>개인 포트폴리오 활용은 나인웍스의 공식 공개 이후, 클라이언트 보안정책과 별도 안내된 공개 범위 내에서 가능합니다.</p></div>
        <div class="nw-contract-clause"><b>08</b><strong>변경 및 종료</strong><p>업무 범위 또는 일정의 중대한 변경, 프로젝트 중단·종료가 필요한 경우 양 당사자는 진행분과 지급금액을 협의하여 정산합니다.</p></div>
      </div>
      <div class="nw-contract-footer"><p>본 화면은 나인웍스 파트너 전용 계약 확인 페이지입니다.<br>클라이언트 화면에는 프리랜서 계약 및 정산 정보가 노출되지 않습니다.</p><button type="button" onclick="window.print()">PRINT / PDF</button></div>
    </section>`;

  const ensureContractMenu = (c) => {
    const nav = document.querySelector('[data-partner-page-nav]');
    const content = document.querySelector('.partner-content');
    if (!nav || !content) return;
    let button = nav.querySelector('[data-partner-page-link="contract"]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button'; button.dataset.partnerPageLink = 'contract'; button.textContent = '계약서';
      const account = nav.querySelector('[data-partner-page-link="account"]');
      account ? nav.insertBefore(button, account) : nav.appendChild(button);
      button.addEventListener('click', showContractPage);
    }
    let page = content.querySelector('[data-partner-page="contract"]');
    if (!page) {
      page = document.createElement('section');
      page.className = 'partner-page nw-contract-page'; page.dataset.partnerPage = 'contract';
      content.appendChild(page);
    }
    if (page.dataset.contractOwner !== activeEmail) {
      page.dataset.contractOwner = activeEmail;
      page.innerHTML = contractHTML(c);
    }
  };

  const contractBrief = (c) => `<div><strong>FREELANCER CONTRACT</strong>${escapeHTML(c.scope)} · 선금 ${money(c.advance)} · 잔금 ${money(c.balanceGross)} 중 원천징수 ${money(c.withholding)} 공제 후 ${money(c.balanceNet)} 지급</div><button type="button" data-open-contract>계약서 확인 ↗</button>`;

  const ensureProjectContractLink = (c) => {
    const list = document.querySelector('[data-partner-project-list]');
    if (!list) return;
    Array.from(list.querySelectorAll('.project-row')).forEach((row) => {
      const text = String(row.textContent || '');
      if (!(text.includes(c.company) || text.includes(c.projectName))) return;
      const brief = row.nextElementSibling;
      if (!brief?.classList?.contains('partner-project-brief')) return;
      let box = brief.querySelector('[data-contract-brief]');
      if (!box) {
        box = document.createElement('div'); box.className = 'nw-contract-brief'; box.dataset.contractBrief = 'true'; brief.appendChild(box);
      }
      box.innerHTML = contractBrief(c);
    });
  };

  const setFixedAccountUI = (c) => {
    const list = document.querySelector('[data-partner-account-list]');
    if (list) {
      let row = Array.from(list.querySelectorAll('.partner-account-row')).find((item) => {
        const text = String(item.textContent || ''); return text.includes(c.company) || text.includes(c.projectName);
      });
      if (!row) { list.querySelector('.partner-empty')?.remove(); row = document.createElement('article'); row.className = 'partner-account-row nw-fixed-account'; list.appendChild(row); }
      row.innerHTML = `<div class="partner-account-row__head"><div><span>${escapeHTML(c.company)}</span><strong>${escapeHTML(c.projectName)}</strong></div><em class="is-active is-freelancer">진행 · 프리랜서</em></div><div class="partner-account-row__amount"><div><span>계약금액</span><strong>${money(c.gross)}</strong></div><div><span>선금</span><strong>${money(c.advance)}</strong></div><div><span>잔금 실지급</span><strong>${money(c.balanceNet)}</strong></div><div><span>원천징수 3.3%</span><strong>${money(c.withholding)}</strong></div></div><div class="partner-account-note"><strong>지급 조건</strong> · 선금 ${money(c.advance)} 지급. ${escapeHTML(c.balanceCondition)} 잔금 ${money(c.balanceGross)}에서 전체 계약금액 기준 원천징수 ${money(c.withholding)}를 공제하고 ${money(c.balanceNet)} 지급. 총 예상 실지급액 ${money(c.totalNet)}.</div>`;
    }
    const business = document.querySelector('input[name="paymentType"][value="business"]')?.closest('label'); if (business) business.style.display = 'none';
    const freelancer = document.querySelector('input[name="paymentType"][value="freelancer"]'); if (freelancer) freelancer.checked = true;
    const copy = document.querySelector('[data-payment-type-copy]'); if (copy) copy.textContent = '본 프로젝트는 프리랜서 계약으로 3.3% 원천징수 조건이 적용됩니다.';
    const guide = document.querySelector('[data-payment-guide]'); if (guide) guide.innerHTML = `<strong>${escapeHTML(c.projectName)}</strong> · 선금 ${money(c.advance)} 지급 후 잔금 지급 시 원천징수 ${money(c.withholding)}를 잔금에서 공제합니다.`;
    const policy = document.querySelector('[data-account-policy]'); if (policy) policy.innerHTML = `<strong>정산 안내</strong> · 계약금액 ${money(c.gross)} / 선금 ${money(c.advance)} / 잔금 실지급 ${money(c.balanceNet)} / 원천징수 ${money(c.withholding)}.`;
    const advanceLabel = document.querySelector('[data-account-summary="advance"]')?.previousElementSibling; if (advanceLabel) advanceLabel.textContent = '선금';
    const balanceLabel = document.querySelector('[data-account-summary="finalNet"]')?.previousElementSibling; if (balanceLabel) balanceLabel.textContent = '잔금';
    const an = document.querySelector('[data-account-advance-note]'); if (an) an.textContent = `고정 선금 ${money(c.advance)}`;
    const bn = document.querySelector('[data-account-balance-note]'); if (bn) bn.textContent = `잔금에서 3.3% 공제 · ${money(c.balanceNet)}`;
  };

  const adjustStandardSummary = (c) => {
    const a = document.querySelector('[data-account-summary="advance"]');
    const b = document.querySelector('[data-account-summary="finalNet"]');
    if (a) {
      const current = num(a.textContent), state = adjusted.get(a);
      if (!state || current !== state.value) { const standard = Math.round(c.totalNet * .5); const next = Math.max(0, current + c.advance - standard); a.textContent = money(next); adjusted.set(a, { value: next }); }
    }
    if (b) {
      const current = num(b.textContent), state = adjusted.get(b);
      if (!state || current !== state.value) { const standard = c.totalNet - Math.round(c.totalNet * .5); const next = Math.max(0, current + c.balanceNet - standard); b.textContent = money(next); adjusted.set(b, { value: next }); }
    }
  };

  const renderCustomWorkspace = (c) => {
    injectStyle();
    const login = document.querySelector('[data-partner-login]'); const app = document.querySelector('[data-partner-app]');
    if (login) { login.hidden = true; login.style.setProperty('display','none','important'); }
    if (app) app.hidden = false;
    const greeting = document.querySelector('[data-partner-greeting]'); if (greeting) greeting.innerHTML = `안녕하세요 ${escapeHTML(c.partnerName)}님,<br><span class="greeting-sub">오늘도 좋은 작업 이어가세요.</span>`;
    const statProjects = document.querySelector('[data-partner-stat="projects"]'); if (statProjects) statProjects.textContent = '1';
    const statPre = document.querySelector('[data-partner-stat="preliminaryFee"]'); if (statPre) statPre.textContent = '0원';
    const statActive = document.querySelector('[data-partner-stat="activeFee"]'); if (statActive) statActive.textContent = money(c.totalNet);
    const statProp = document.querySelector('[data-partner-stat="proposals"]'); if (statProp) statProp.textContent = '0';
    const projects = document.querySelector('[data-partner-project-list]'); if (projects) projects.innerHTML = `<div class="project-row"><span class="project-row__num">01</span><strong>${escapeHTML(c.projectName)}</strong><span>${escapeHTML(c.company)} · ${escapeHTML(c.typeLabel)}</span><span class="project-status is-active">진행</span><span class="project-open">—</span></div><div class="partner-project-brief"><strong>PROJECT BRIEF · OPEN · 지정금액 ${money(c.gross)}</strong><p>${escapeHTML(c.brief)}</p><div class="nw-contract-brief" data-contract-brief>${contractBrief(c)}</div></div>`;
    const schedule = document.querySelector('[data-partner-schedule]'); if (schedule) schedule.innerHTML = `<div class="partner-schedule-row"><time>IN PROGRESS</time><strong>${escapeHTML(c.projectName)}</strong><span>${escapeHTML(c.scope)}</span></div>`;
    const proposals = document.querySelector('[data-partner-proposal-list]'); if (proposals) proposals.innerHTML = '<div class="partner-empty"><strong>연결된 제안서가 없습니다.</strong>필요 시 나인웍스에서 추가합니다.</div>';
    const pre = document.querySelector('[data-account-summary="preliminary"]'); if (pre) pre.textContent = '0원';
    const act = document.querySelector('[data-account-summary="active"]'); if (act) act.textContent = money(c.totalNet);
    const adv = document.querySelector('[data-account-summary="advance"]'); if (adv) adv.textContent = money(c.advance);
    const bal = document.querySelector('[data-account-summary="finalNet"]'); if (bal) bal.textContent = money(c.balanceNet);
    setFixedAccountUI(c); ensureContractMenu(c);
  };

  const applyExistingPartner = (c) => {
    injectStyle(); ensureContractMenu(c); ensureProjectContractLink(c); setFixedAccountUI(c); adjustStandardSummary(c);
  };

  const begin = () => {
    window.clearInterval(timer);
    timer = null;
    currentContract = getContract(); if (!currentContract) return;
    const run = () => currentContract.customLogin ? renderCustomWorkspace(currentContract) : applyExistingPartner(currentContract);
    run();
    if (currentContract.customLogin) return;
    [100, 350, 900, 1800, 3500, 6500].forEach((ms) => window.setTimeout(run, ms));
  };

  document.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('[data-partner-login-form]');
    if (!form) return;
    const email = String(form.querySelector('input[name="email"]')?.value || '').trim().toLowerCase();
    if (!CONTRACTS[email]) return;
    activeEmail = email; currentContract = CONTRACTS[email];
    try { localStorage.setItem(`nw_partner_payment_type_${email}`, 'freelancer'); } catch {}
    if (currentContract.customLogin) {
      event.preventDefault(); event.stopImmediatePropagation(); begin();
    } else {
      window.setTimeout(begin, 20);
    }
  }, true);

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-open-contract]')) { event.preventDefault(); showContractPage(); return; }
    if (event.target.closest('[data-partner-signout]')) { activeEmail = ''; currentContract = null; window.clearInterval(timer); document.querySelector('[data-partner-page-link="contract"]')?.remove(); document.querySelector('[data-partner-page="contract"]')?.remove(); }
  });

  document.addEventListener('submit', async (event) => {
    if (activeEmail !== 'daac-oh@naver.com') return;
    const form = event.target?.closest?.('[data-partner-bank-form]'); if (!form) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!form.reportValidity()) return;
    const data = new FormData(form); const note = form.querySelector('[data-partner-bank-note]'); const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true; if (note) note.textContent = '계좌정보를 등록하고 있습니다.';
    try {
      const ctx = await getFirebase();
      await ctx.addDoc(ctx.collection(ctx.db,'partnerAccountSubmissions'), { partnerEmail: activeEmail, partnerName: currentContract.partnerName, paymentType:'freelancer', accountHolder:String(data.get('accountHolder')||'').trim().slice(0,60), bank:String(data.get('bank')||'').trim().slice(0,60), accountNumber:String(data.get('accountNumber')||'').trim().slice(0,80), source:'PARTNER_WORKSPACE', createdAt:ctx.serverTimestamp() });
      if (note) { note.textContent = '계좌정보가 등록되었습니다.'; note.classList.add('is-success'); }
    } catch (error) { console.error('[NINEWORKS PARTNERS] Oh Dahye account save failed', error); if (note) { note.textContent = '등록에 실패했습니다.'; note.classList.add('is-error'); } }
    finally { if (button) button.disabled = false; }
  }, true);
})();
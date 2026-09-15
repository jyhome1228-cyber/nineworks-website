(() => {
  const TARGET_EMAIL = 's.nninyong@gmail.com';
  const CONTRACT = {
    partnerName: '신민용', company: '알피바이오', projectName: '알피바이오 프로젝트',
    scope: '프로젝트 전반 어시스트', gross: 5000000, advance: 2500000,
    withholding: 165000, balanceGross: 2500000, balanceNet: 2335000,
    totalNet: 4835000, balanceCondition: '알피바이오 프로젝트 잔금 입금 시'
  };
  let activeEmail = '';
  let timer = null;
  const values = new WeakMap();

  const money = (n = 0) => `${Number(n || 0).toLocaleString('ko-KR')}원`;
  const numberFromMoney = (value = '') => Number(String(value).replace(/[^0-9-]/g, '')) || 0;
  const escapeHTML = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  const setText = (node, value) => { if (node && node.textContent !== value) node.textContent = value; };
  const setHTML = (node, value) => { if (node && node.innerHTML !== value) node.innerHTML = value; };

  const injectStyle = () => {
    if (document.querySelector('style[data-rpbio-contract-style]')) return;
    const style = document.createElement('style');
    style.dataset.rpbioContractStyle = 'true';
    style.textContent = `
      .nw-rpbio-contract-brief{margin:12px 0 0;padding:13px 14px;background:#f4f7f3;border:1px solid #dfe7dd;color:#4d5d4f;font-size:11px;line-height:1.65}.nw-rpbio-contract-brief strong{display:block;margin-bottom:5px;color:#203e27;font-size:10px;letter-spacing:.03em}
      .nw-rpbio-contract-card{margin-top:22px;padding:20px;border:1px solid #dfe3dc;background:#fafbf9}.nw-rpbio-contract-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:15px;border-bottom:1px solid #e2e5df}.nw-rpbio-contract-card__head span{display:block;color:#8a8f89;font-size:9px;letter-spacing:.08em}.nw-rpbio-contract-card__head strong{display:block;margin-top:6px;font-size:18px;font-weight:500;letter-spacing:-.035em}.nw-rpbio-contract-card__badge{padding:5px 8px;border:1px solid #cfd8cf;background:#f2f7f1;color:#3d6243;font-size:8px;white-space:nowrap}
      .nw-rpbio-contract-card__grid{display:grid;grid-template-columns:1.2fr repeat(4,minmax(0,1fr));margin-top:15px;border:1px solid #e1e4df;background:#fff}.nw-rpbio-contract-card__grid div{padding:12px;border-right:1px solid #e1e4df}.nw-rpbio-contract-card__grid div:last-child{border-right:0}.nw-rpbio-contract-card__grid span{display:block;color:#969b95;font-size:8px}.nw-rpbio-contract-card__grid b{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.45}.nw-rpbio-contract-card__note{margin:12px 0 0;color:#666d66;font-size:10px;line-height:1.65}.nw-rpbio-contract-card__note strong{color:#222;font-weight:600}
      .nw-rpbio-synthetic{border-color:#dce7da!important}.nw-rpbio-synthetic .project-status{background:#eef6ed!important;color:#31583a!important}@media(max-width:900px){.nw-rpbio-contract-card__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.nw-rpbio-contract-card__head{display:block}.nw-rpbio-contract-card__badge{display:inline-block;margin-top:10px}.nw-rpbio-contract-card__grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  };

  const isTarget = () => activeEmail === TARGET_EMAIL || String(document.querySelector('[data-partner-greeting]')?.textContent || '').includes(CONTRACT.partnerName);
  const projectList = () => document.querySelector('[data-partner-project-list]');
  const hasBaseProject = () => Array.from(projectList()?.children || []).some((node) => !node.hasAttribute('data-rpbio-synthetic') && String(node.textContent || '').includes(CONTRACT.company));

  const ensureProject = () => {
    const list = projectList();
    if (!list) return;
    const base = hasBaseProject();
    if (base) list.querySelectorAll('[data-rpbio-synthetic]').forEach((node) => node.remove());
    if (!base && !list.querySelector('[data-rpbio-synthetic]')) {
      const empty = Array.from(list.querySelectorAll('.project-row')).find((row) => String(row.textContent || '').includes('연결된 프로젝트가 없습니다'));
      empty?.remove();
      const row = document.createElement('div');
      row.className = 'project-row nw-rpbio-synthetic'; row.dataset.rpbioSynthetic = 'project';
      row.innerHTML = `<span class="project-row__num">01</span><strong>${escapeHTML(CONTRACT.projectName)}</strong><span>${escapeHTML(CONTRACT.company)} · ${escapeHTML(CONTRACT.scope)}</span><span class="project-status is-active">진행</span><span class="project-open">—</span>`;
      const brief = document.createElement('div');
      brief.className = 'partner-project-brief nw-rpbio-synthetic'; brief.dataset.rpbioSynthetic = 'brief';
      brief.innerHTML = `<strong>PROJECT BRIEF · OPEN · 계약금액 ${money(CONTRACT.gross)}</strong><p>${escapeHTML(CONTRACT.scope)}</p><div class="nw-rpbio-contract-brief" data-rpbio-terms><strong>FREELANCER CONTRACT</strong>선금 ${money(CONTRACT.advance)} · 잔금은 ${escapeHTML(CONTRACT.balanceCondition)} 3.3% 원천징수 ${money(CONTRACT.withholding)}를 공제한 ${money(CONTRACT.balanceNet)} 지급</div>`;
      list.append(row, brief);
    }
    Array.from(list.querySelectorAll('.project-row')).forEach((row) => {
      if (!String(row.textContent || '').includes(CONTRACT.company)) return;
      const brief = row.nextElementSibling;
      if (!brief?.classList?.contains('partner-project-brief') || brief.querySelector('[data-rpbio-terms]')) return;
      const terms = document.createElement('div');
      terms.className = 'nw-rpbio-contract-brief'; terms.dataset.rpbioTerms = 'true';
      terms.innerHTML = `<strong>FREELANCER CONTRACT</strong>업무범위 ${escapeHTML(CONTRACT.scope)} · 선금 ${money(CONTRACT.advance)} · 잔금은 ${escapeHTML(CONTRACT.balanceCondition)} 3.3% 원천징수 ${money(CONTRACT.withholding)}를 공제한 ${money(CONTRACT.balanceNet)} 지급`;
      brief.appendChild(terms);
    });
  };

  const adjustMoney = (selector, delta) => {
    const node = document.querySelector(selector); if (!node) return;
    const current = numberFromMoney(node.textContent); const state = values.get(node);
    if (state && current === state.adjusted) return;
    const adjusted = Math.max(0, current + delta); setText(node, money(adjusted)); values.set(node, { adjusted });
  };
  const adjustCount = (selector, delta) => {
    const node = document.querySelector(selector); if (!node) return;
    const current = Number(String(node.textContent || '').replace(/[^0-9]/g, '')) || 0; const state = values.get(node);
    if (state && current === state.adjusted) return;
    const adjusted = Math.max(0, current + delta); setText(node, String(adjusted)); values.set(node, { adjusted });
  };

  const ensureStats = () => {
    const base = hasBaseProject();
    if (!base) {
      adjustCount('[data-partner-stat="projects"]', 1);
      adjustMoney('[data-partner-stat="activeFee"]', CONTRACT.totalNet);
      adjustMoney('[data-account-summary="active"]', CONTRACT.totalNet);
      adjustMoney('[data-account-summary="advance"]', CONTRACT.advance);
      adjustMoney('[data-account-summary="finalNet"]', CONTRACT.balanceNet);
    } else {
      adjustMoney('[data-account-summary="advance"]', CONTRACT.advance - Math.round(CONTRACT.totalNet * 0.5));
      adjustMoney('[data-account-summary="finalNet"]', CONTRACT.balanceNet - (CONTRACT.totalNet - Math.round(CONTRACT.totalNet * 0.5)));
    }
  };

  const accountMarkup = () => `<div class="partner-account-row__head"><div><span>${escapeHTML(CONTRACT.company)}</span><strong>${escapeHTML(CONTRACT.projectName)}</strong></div><em class="is-active is-freelancer">진행 · 프리랜서</em></div><div class="partner-account-row__amount"><div><span>계약금액</span><strong>${money(CONTRACT.gross)}</strong></div><div><span>선금</span><strong>${money(CONTRACT.advance)}</strong></div><div><span>잔금 실지급</span><strong>${money(CONTRACT.balanceNet)}</strong></div><div><span>원천징수 3.3%</span><strong>${money(CONTRACT.withholding)}</strong></div></div><div class="partner-account-note"><strong>지급 조건</strong> · 선금 ${money(CONTRACT.advance)} 지급. ${escapeHTML(CONTRACT.balanceCondition)} 잔금 ${money(CONTRACT.balanceGross)}에서 전체 계약금액 기준 원천징수 3.3% ${money(CONTRACT.withholding)}를 공제하고 ${money(CONTRACT.balanceNet)}을 지급합니다. 총 예상 실지급액은 ${money(CONTRACT.totalNet)}입니다.</div>`;

  const ensureAccount = () => {
    const list = document.querySelector('[data-partner-account-list]'); if (!list) return;
    let row = Array.from(list.querySelectorAll('.partner-account-row')).find((item) => String(item.textContent || '').includes(CONTRACT.company));
    if (!row) {
      list.querySelector('.partner-empty')?.remove();
      row = document.createElement('article'); row.className = 'partner-account-row nw-rpbio-synthetic'; row.dataset.rpbioAccount = 'true'; list.appendChild(row);
    }
    const markup = accountMarkup(); if (row.innerHTML !== markup) row.innerHTML = markup;

    const page = document.querySelector('[data-partner-page="account"]');
    if (page && !page.querySelector('[data-rpbio-contract-card]')) {
      const card = document.createElement('section'); card.className = 'nw-rpbio-contract-card'; card.dataset.rpbioContractCard = 'true';
      card.innerHTML = `<div class="nw-rpbio-contract-card__head"><div><span>FREELANCER CONTRACT / ACTIVE</span><strong>${escapeHTML(CONTRACT.partnerName)} · ${escapeHTML(CONTRACT.company)}</strong></div><em class="nw-rpbio-contract-card__badge">INTERNAL PROJECT CONTRACT</em></div><div class="nw-rpbio-contract-card__grid"><div><span>업무 범위</span><b>${escapeHTML(CONTRACT.scope)}</b></div><div><span>계약금액</span><b>${money(CONTRACT.gross)}</b></div><div><span>선금</span><b>${money(CONTRACT.advance)}</b></div><div><span>원천징수</span><b>3.3% · ${money(CONTRACT.withholding)}</b></div><div><span>잔금 실지급</span><b>${money(CONTRACT.balanceNet)}</b></div></div><p class="nw-rpbio-contract-card__note"><strong>정산 조건</strong> · 선금은 ${money(CONTRACT.advance)}. 잔금은 ${escapeHTML(CONTRACT.balanceCondition)} 지급하며, 원천징수 3.3%는 잔금에서 공제합니다. 총 예상 실지급액 ${money(CONTRACT.totalNet)}.</p>`;
      const anchor = page.querySelector('.partner-account-form-wrap'); anchor ? anchor.insertAdjacentElement('beforebegin', card) : page.appendChild(card);
    }
  };

  const ensureSchedule = () => {
    const box = document.querySelector('[data-partner-schedule]'); if (!box || String(box.textContent || '').includes(CONTRACT.company)) return;
    if (String(box.textContent || '').includes('등록된 일정이 없습니다')) box.innerHTML = '';
    const row = document.createElement('div'); row.className = 'partner-schedule-row nw-rpbio-synthetic'; row.dataset.rpbioSchedule = 'true';
    row.innerHTML = `<time>IN PROGRESS</time><strong>${escapeHTML(CONTRACT.projectName)}</strong><span>${escapeHTML(CONTRACT.scope)}</span>`; box.appendChild(row);
  };

  const ensurePolicy = () => {
    const businessLabel = document.querySelector('input[name="paymentType"][value="business"]')?.closest('label'); if (businessLabel) businessLabel.style.display = 'none';
    const freelancer = document.querySelector('input[name="paymentType"][value="freelancer"]'); if (freelancer && !freelancer.checked) freelancer.checked = true;
    setText(document.querySelector('[data-payment-type-copy]'), '본 프로젝트는 프리랜서 계약으로 3.3% 원천징수 조건이 적용됩니다.');
    setHTML(document.querySelector('[data-payment-guide]'), `<strong>알피바이오 프로젝트</strong> · 선금 ${money(CONTRACT.advance)} 지급 후, 클라이언트 잔금 입금 시 원천징수 3.3% ${money(CONTRACT.withholding)}를 잔금에서 공제합니다.`);
    setHTML(document.querySelector('[data-account-policy]'), `<strong>정산 안내</strong> · 계약금액 ${money(CONTRACT.gross)} / 선금 ${money(CONTRACT.advance)} / 잔금 실지급 ${money(CONTRACT.balanceNet)}. 원천징수 3.3%는 잔금 지급 시 일괄 공제합니다.`);
    setText(document.querySelector('[data-account-summary="advance"]')?.previousElementSibling, '선금');
    setText(document.querySelector('[data-account-summary="finalNet"]')?.previousElementSibling, '잔금');
    setText(document.querySelector('[data-account-advance-note]'), '고정 선금 2,500,000원');
    setText(document.querySelector('[data-account-balance-note]'), '클라이언트 잔금 입금 시 3.3% 공제');
  };

  const apply = () => {
    if (!isTarget()) return;
    injectStyle(); ensureProject(); ensureAccount(); ensureSchedule(); ensurePolicy(); ensureStats();
  };
  const begin = () => {
    window.clearInterval(timer); apply(); [80, 300, 900, 2200].forEach((ms) => window.setTimeout(apply, ms)); timer = window.setInterval(apply, 1600);
  };

  document.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('[data-partner-login-form]'); if (!form) return;
    activeEmail = String(form.querySelector('input[name="email"]')?.value || '').trim().toLowerCase(); if (activeEmail === TARGET_EMAIL) window.setTimeout(begin, 10);
  }, true);
  document.addEventListener('DOMContentLoaded', () => { if (isTarget()) begin(); });
  window.addEventListener('pagehide', () => window.clearInterval(timer));
})();

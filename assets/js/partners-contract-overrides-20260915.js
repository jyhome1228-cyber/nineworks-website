(() => {
  const TARGET_EMAIL = 's.nninyong@gmail.com';
  const CONTRACT = {
    id: 'internal-rpbio-shinminyong-20260915',
    partnerName: '신민용',
    company: '알피바이오',
    projectName: '알피바이오 프로젝트',
    scope: '프로젝트 전반 어시스트',
    gross: 5000000,
    advance: 2500000,
    withholding: 165000,
    balanceGross: 2500000,
    balanceNet: 2335000,
    totalNet: 4835000,
    balanceCondition: '알피바이오 프로젝트 잔금 입금 시'
  };

  let activeEmail = '';
  let observer = null;
  let applying = false;
  const summaryState = new WeakMap();

  const money = (value = 0) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
  const numberFromMoney = (value = '') => Number(String(value || '').replace(/[^0-9-]/g, '')) || 0;
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');

  const injectStyle = () => {
    if (document.querySelector('style[data-rpbio-contract-style]')) return;
    const style = document.createElement('style');
    style.dataset.rpbioContractStyle = 'true';
    style.textContent = `
      .nw-rpbio-contract-brief{margin:12px 0 0;padding:13px 14px;background:#f4f7f3;border:1px solid #dfe7dd;color:#4d5d4f;font-size:11px;line-height:1.65}
      .nw-rpbio-contract-brief strong{display:block;margin-bottom:5px;color:#203e27;font-size:10px;letter-spacing:.03em}
      .nw-rpbio-contract-card{margin-top:22px;padding:20px;border:1px solid #dfe3dc;background:#fafbf9}
      .nw-rpbio-contract-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:15px;border-bottom:1px solid #e2e5df}
      .nw-rpbio-contract-card__head span{display:block;color:#8a8f89;font-size:9px;letter-spacing:.08em}.nw-rpbio-contract-card__head strong{display:block;margin-top:6px;font-size:18px;font-weight:500;letter-spacing:-.035em}
      .nw-rpbio-contract-card__badge{padding:5px 8px;border:1px solid #cfd8cf;background:#f2f7f1;color:#3d6243;font-size:8px;white-space:nowrap}
      .nw-rpbio-contract-card__grid{display:grid;grid-template-columns:1.2fr repeat(4,minmax(0,1fr));margin-top:15px;border:1px solid #e1e4df;background:#fff}
      .nw-rpbio-contract-card__grid div{padding:12px;border-right:1px solid #e1e4df}.nw-rpbio-contract-card__grid div:last-child{border-right:0}
      .nw-rpbio-contract-card__grid span{display:block;color:#969b95;font-size:8px}.nw-rpbio-contract-card__grid b{display:block;margin-top:7px;font-size:12px;font-weight:500;line-height:1.45}
      .nw-rpbio-contract-card__note{margin:12px 0 0;color:#666d66;font-size:10px;line-height:1.65}.nw-rpbio-contract-card__note strong{color:#222;font-weight:600}
      .nw-rpbio-synthetic{border-color:#dce7da!important}.nw-rpbio-synthetic .project-status{background:#eef6ed!important;color:#31583a!important}
      @media(max-width:900px){.nw-rpbio-contract-card__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.nw-rpbio-contract-card__grid div{border-bottom:1px solid #e1e4df}}
      @media(max-width:620px){.nw-rpbio-contract-card__head{display:block}.nw-rpbio-contract-card__badge{display:inline-block;margin-top:10px}.nw-rpbio-contract-card__grid{grid-template-columns:1fr}.nw-rpbio-contract-card__grid div{border-right:0}}
    `;
    document.head.appendChild(style);
  };

  const isTarget = () => {
    if (activeEmail === TARGET_EMAIL) return true;
    const greeting = document.querySelector('[data-partner-greeting]');
    return Boolean(greeting && String(greeting.textContent || '').includes(CONTRACT.partnerName));
  };

  const baseRpbioProjectExists = () => {
    const list = document.querySelector('[data-partner-project-list]');
    if (!list) return false;
    return Array.from(list.children).some((node) => !node.matches?.('[data-rpbio-contract-synthetic]') && String(node.textContent || '').includes(CONTRACT.company));
  };

  const ensureProject = () => {
    const list = document.querySelector('[data-partner-project-list]');
    if (!list) return;
    const baseExists = baseRpbioProjectExists();
    list.querySelectorAll('[data-rpbio-contract-synthetic]').forEach((node) => {
      if (baseExists) node.remove();
    });

    if (!baseExists && !list.querySelector('[data-rpbio-contract-synthetic]')) {
      const row = document.createElement('div');
      row.className = 'project-row nw-rpbio-synthetic';
      row.dataset.rpbioContractSynthetic = 'true';
      row.innerHTML = `<span class="project-row__num">01</span><strong>${escapeHTML(CONTRACT.projectName)}</strong><span>${escapeHTML(CONTRACT.company)} · ${escapeHTML(CONTRACT.scope)}</span><span class="project-status is-active">진행</span><span class="project-open">—</span>`;
      const brief = document.createElement('div');
      brief.className = 'partner-project-brief nw-rpbio-synthetic';
      brief.dataset.rpbioContractSynthetic = 'true';
      brief.innerHTML = `<strong>PROJECT BRIEF · OPEN · 계약금액 ${money(CONTRACT.gross)}</strong><p>${escapeHTML(CONTRACT.scope)}</p><div class="nw-rpbio-contract-brief"><strong>FREELANCER CONTRACT</strong>선금 ${money(CONTRACT.advance)} · 잔금은 ${escapeHTML(CONTRACT.balanceCondition)} 3.3% 원천징수 ${money(CONTRACT.withholding)}를 공제한 ${money(CONTRACT.balanceNet)} 지급</div>`;
      const empty = list.querySelector('.project-row');
      if (empty && String(empty.textContent || '').includes('연결된 프로젝트가 없습니다')) empty.remove();
      list.append(row, brief);
    }

    Array.from(list.querySelectorAll('.project-row')).forEach((row) => {
      if (!String(row.textContent || '').includes(CONTRACT.company)) return;
      const brief = row.nextElementSibling;
      if (!brief?.classList?.contains('partner-project-brief')) return;
      if (!brief.querySelector('[data-rpbio-terms]')) {
        const terms = document.createElement('div');
        terms.className = 'nw-rpbio-contract-brief';
        terms.dataset.rpbioTerms = 'true';
        terms.innerHTML = `<strong>FREELANCER CONTRACT</strong>업무범위 ${escapeHTML(CONTRACT.scope)} · 선금 ${money(CONTRACT.advance)} · 잔금은 ${escapeHTML(CONTRACT.balanceCondition)} 3.3% 원천징수 ${money(CONTRACT.withholding)}를 공제한 ${money(CONTRACT.balanceNet)} 지급`;
        brief.appendChild(terms);
      }
    });
  };

  const applyAdjustedSummary = (selector, delta) => {
    const node = document.querySelector(selector);
    if (!node) return;
    const current = numberFromMoney(node.textContent);
    const state = summaryState.get(node);
    if (state && current === state.adjusted) return;
    const raw = current;
    const adjusted = Math.max(0, raw + delta);
    node.textContent = money(adjusted);
    summaryState.set(node, { raw, adjusted });
  };

  const ensureStats = () => {
    const baseExists = baseRpbioProjectExists();
    const projectStat = document.querySelector('[data-partner-stat="projects"]');
    if (projectStat) {
      const current = Number(String(projectStat.textContent || '0').replace(/[^0-9]/g, '')) || 0;
      const state = summaryState.get(projectStat);
      if (!(state && current === state.adjusted)) {
        const adjusted = baseExists ? current : current + 1;
        projectStat.textContent = String(adjusted);
        summaryState.set(projectStat, { raw: current, adjusted });
      }
    }
    if (!baseExists) {
      applyAdjustedSummary('[data-partner-stat="activeFee"]', CONTRACT.totalNet);
      applyAdjustedSummary('[data-account-summary="active"]', CONTRACT.totalNet);
      applyAdjustedSummary('[data-account-summary="advance"]', CONTRACT.advance);
      applyAdjustedSummary('[data-account-summary="finalNet"]', CONTRACT.balanceNet);
    } else {
      applyAdjustedSummary('[data-account-summary="advance"]', CONTRACT.advance - Math.round(CONTRACT.totalNet * 0.5));
      applyAdjustedSummary('[data-account-summary="finalNet"]', CONTRACT.balanceNet - (CONTRACT.totalNet - Math.round(CONTRACT.totalNet * 0.5)));
    }
  };

  const customAccountRowHTML = () => `
    <div class="partner-account-row__head"><div><span>${escapeHTML(CONTRACT.company)}</span><strong>${escapeHTML(CONTRACT.projectName)}</strong></div><em class="is-active is-freelancer">진행 · 프리랜서</em></div>
    <div class="partner-account-row__amount">
      <div><span>계약금액</span><strong>${money(CONTRACT.gross)}</strong></div>
      <div><span>선금</span><strong>${money(CONTRACT.advance)}</strong></div>
      <div><span>잔금 실지급</span><strong>${money(CONTRACT.balanceNet)}</strong></div>
      <div><span>원천징수 3.3%</span><strong>${money(CONTRACT.withholding)}</strong></div>
    </div>
    <div class="partner-account-note"><strong>지급 조건</strong> · 선금 ${money(CONTRACT.advance)} 지급. ${escapeHTML(CONTRACT.balanceCondition)} 잔금 ${money(CONTRACT.balanceGross)}에서 전체 계약금액 기준 원천징수 3.3% ${money(CONTRACT.withholding)}를 공제하고 ${money(CONTRACT.balanceNet)}을 지급합니다. 총 예상 실지급액은 ${money(CONTRACT.totalNet)}입니다.</div>`;

  const ensureAccount = () => {
    const list = document.querySelector('[data-partner-account-list]');
    if (!list) return;
    const rows = Array.from(list.querySelectorAll('.partner-account-row'));
    let row = rows.find((item) => String(item.textContent || '').includes(CONTRACT.company));
    if (!row) {
      const empty = list.querySelector('.partner-empty');
      if (empty) empty.remove();
      row = document.createElement('article');
      row.className = 'partner-account-row nw-rpbio-synthetic';
      row.dataset.rpbioAccount = 'true';
      list.appendChild(row);
    }
    if (row.dataset.rpbioCustom !== 'true') {
      row.innerHTML = customAccountRowHTML();
      row.dataset.rpbioCustom = 'true';
    }

    const accountPage = document.querySelector('[data-partner-page="account"]');
    if (accountPage && !accountPage.querySelector('[data-rpbio-contract-card]')) {
      const card = document.createElement('section');
      card.className = 'nw-rpbio-contract-card';
      card.dataset.rpbioContractCard = 'true';
      card.innerHTML = `
        <div class="nw-rpbio-contract-card__head"><div><span>FREELANCER CONTRACT / ACTIVE</span><strong>${escapeHTML(CONTRACT.partnerName)} · ${escapeHTML(CONTRACT.company)}</strong></div><em class="nw-rpbio-contract-card__badge">INTERNAL PROJECT CONTRACT</em></div>
        <div class="nw-rpbio-contract-card__grid">
          <div><span>업무 범위</span><b>${escapeHTML(CONTRACT.scope)}</b></div>
          <div><span>계약금액</span><b>${money(CONTRACT.gross)}</b></div>
          <div><span>선금</span><b>${money(CONTRACT.advance)}</b></div>
          <div><span>원천징수</span><b>3.3% · ${money(CONTRACT.withholding)}</b></div>
          <div><span>잔금 실지급</span><b>${money(CONTRACT.balanceNet)}</b></div>
        </div>
        <p class="nw-rpbio-contract-card__note"><strong>정산 조건</strong> · 선금은 ${money(CONTRACT.advance)}. 잔금은 ${escapeHTML(CONTRACT.balanceCondition)} 지급하며, 원천징수 3.3%는 잔금에서 공제합니다. 총 예상 실지급액 ${money(CONTRACT.totalNet)}.</p>`;
      const formWrap = accountPage.querySelector('.partner-account-form-wrap');
      if (formWrap) formWrap.insertAdjacentElement('beforebegin', card);
      else accountPage.appendChild(card);
    }
  };

  const ensureSchedule = () => {
    const box = document.querySelector('[data-partner-schedule]');
    if (!box) return;
    if (String(box.textContent || '').includes(CONTRACT.company)) return;
    if (String(box.textContent || '').includes('등록된 일정이 없습니다')) box.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'partner-schedule-row nw-rpbio-synthetic';
    row.dataset.rpbioSchedule = 'true';
    row.innerHTML = `<time>IN PROGRESS</time><strong>${escapeHTML(CONTRACT.projectName)}</strong><span>${escapeHTML(CONTRACT.scope)}</span>`;
    box.appendChild(row);
  };

  const ensurePolicy = () => {
    const businessLabel = document.querySelector('input[name="paymentType"][value="business"]')?.closest('label');
    if (businessLabel) businessLabel.style.display = 'none';
    const freelancer = document.querySelector('input[name="paymentType"][value="freelancer"]');
    if (freelancer) freelancer.checked = true;
    const copy = document.querySelector('[data-payment-type-copy]');
    if (copy) copy.textContent = '본 프로젝트는 프리랜서 계약으로 3.3% 원천징수 조건이 적용됩니다.';
    const guide = document.querySelector('[data-payment-guide]');
    if (guide) guide.innerHTML = `<strong>알피바이오 프로젝트</strong> · 선금 ${money(CONTRACT.advance)} 지급 후, 클라이언트 잔금 입금 시 원천징수 3.3% ${money(CONTRACT.withholding)}를 잔금에서 공제합니다.`;
    const policy = document.querySelector('[data-account-policy]');
    if (policy) policy.innerHTML = `<strong>정산 안내</strong> · 계약금액 ${money(CONTRACT.gross)} / 선금 ${money(CONTRACT.advance)} / 잔금 실지급 ${money(CONTRACT.balanceNet)}. 원천징수 3.3%는 잔금 지급 시 일괄 공제합니다.`;
    const advanceLabel = document.querySelector('[data-account-summary="advance"]')?.previousElementSibling;
    const balanceLabel = document.querySelector('[data-account-summary="finalNet"]')?.previousElementSibling;
    if (advanceLabel) advanceLabel.textContent = '선금';
    if (balanceLabel) balanceLabel.textContent = '잔금';
    const advanceNote = document.querySelector('[data-account-advance-note]');
    const balanceNote = document.querySelector('[data-account-balance-note]');
    if (advanceNote) advanceNote.textContent = '고정 선금 2,500,000원';
    if (balanceNote) balanceNote.textContent = '클라이언트 잔금 입금 시 3.3% 공제';
  };

  const apply = () => {
    if (applying || !isTarget()) return;
    applying = true;
    try {
      injectStyle();
      ensureProject();
      ensureAccount();
      ensureSchedule();
      ensurePolicy();
      ensureStats();
    } finally {
      applying = false;
    }
  };

  document.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('[data-partner-login-form]');
    if (!form) return;
    const input = form.querySelector('input[name="email"]');
    activeEmail = String(input?.value || '').trim().toLowerCase();
    window.setTimeout(apply, 20);
    window.setTimeout(apply, 250);
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    observer?.disconnect();
    observer = new MutationObserver(() => {
      if (!applying) window.requestAnimationFrame(apply);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();

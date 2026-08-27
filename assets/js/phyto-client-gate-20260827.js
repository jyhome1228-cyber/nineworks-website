import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { auth } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const ACCESS_KEY = 'nw:phyto:client-access:v1';
const ACCESS_TTL = 12 * 60 * 60 * 1000;
const EXPECTED_HASH = '3a42fb039c65ccac7a3b50fddb88e8b6e5aa333f119fb4727f89c207b5ada496';

function readGrant() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCESS_KEY) || 'null');
    return parsed && Number(parsed.expiresAt) > Date.now();
  } catch (_) {
    return false;
  }
}

function saveGrant() {
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify({ expiresAt: Date.now() + ACCESS_TTL }));
  } catch (_) {}
}

function unlock() {
  document.body.classList.remove('nw-phyto-locked');
  const gate = document.querySelector('.nw-phyto-gate');
  if (gate) gate.remove();
}

function gateMarkup() {
  return `
    <div class="nw-phyto-gate" role="dialog" aria-modal="true" aria-label="파이토레볼루션 프로젝트 접속">
      <div class="nw-phyto-gate__card">
        <div class="nw-phyto-gate__brand">
          <img src="/assets/logo-nineworks.svg" alt="NINEWORKS">
          <span>PRIVATE CLIENT PORTAL</span>
        </div>
        <p class="nw-phyto-gate__kicker">PHYTOREVOLUTION · GOSRAN</p>
        <h1 class="nw-phyto-gate__title">프로젝트 전용 페이지</h1>
        <p class="nw-phyto-gate__desc">파이토레볼루션 대표님께 공유드리는 전용 프로젝트 공간입니다. 계약, 견적, 진행 현황과 정산 관련 문서를 한곳에서 확인하실 수 있습니다.</p>
        <div class="nw-phyto-gate__onboarding">
          <div class="nw-phyto-gate__step"><b>01</b><span>현재 계약 및 프로젝트 세팅 단계의 자료를 확인합니다.</span></div>
          <div class="nw-phyto-gate__step"><b>02</b><span>계약서 초안과 견적 내용을 확인한 뒤 계약 확인을 전달합니다.</span></div>
          <div class="nw-phyto-gate__step"><b>03</b><span>브랜드 아이덴티티, 기본형 가이드라인과 패키지 디자인 진행 상태가 순차적으로 업데이트됩니다.</span></div>
        </div>
        <form class="nw-phyto-gate__form" data-phyto-gate-form>
          <input class="nw-phyto-gate__input" data-phyto-gate-input type="password" autocomplete="current-password" placeholder="프로젝트 비밀번호" aria-label="프로젝트 비밀번호" required>
          <button class="nw-phyto-gate__button" type="submit">프로젝트 입장</button>
        </form>
        <div class="nw-phyto-gate__error" data-phyto-gate-error aria-live="polite"></div>
        <div class="nw-phyto-gate__meta"><span>인증 상태는 이 브라우저에서 12시간 유지됩니다.</span><span>문의 · info@9works.kr</span></div>
      </div>
    </div>`;
}

function checkingMarkup() {
  return `
    <div class="nw-phyto-gate" role="status" aria-live="polite">
      <div class="nw-phyto-gate__card">
        <div class="nw-phyto-gate__brand"><img src="/assets/logo-nineworks.svg" alt="NINEWORKS"><span>PRIVATE CLIENT PORTAL</span></div>
        <div class="nw-phyto-gate__checking">접근 권한을 확인하고 있습니다.</div>
      </div>
    </div>`;
}

async function hashText(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function renderForm() {
  const existing = document.querySelector('.nw-phyto-gate');
  if (existing) existing.outerHTML = gateMarkup();
  else document.body.insertAdjacentHTML('beforeend', gateMarkup());
  const form = document.querySelector('[data-phyto-gate-form]');
  const input = document.querySelector('[data-phyto-gate-input]');
  const error = document.querySelector('[data-phyto-gate-error]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = String(input?.value || '').trim();
    if (!value) return;
    try {
      const digest = await hashText(value);
      if (digest === EXPECTED_HASH) {
        saveGrant();
        unlock();
        return;
      }
    } catch (_) {}
    if (error) error.textContent = '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.';
    if (input) {
      input.value = '';
      input.focus();
    }
  });
  window.setTimeout(() => input?.focus(), 50);
}

function setText(selector, text, root = document) {
  const node = root.querySelector(selector);
  if (node) node.textContent = text;
}

function injectScopeStyle() {
  if (document.querySelector('style[data-phyto-scope-v3]')) return;
  const style = document.createElement('style');
  style.dataset.phytoScopeV3 = 'true';
  style.textContent = `
    .nw-phyto-scope-v3 .progress-line{grid-template-columns:repeat(6,minmax(0,1fr))}
    .nw-phyto-scope-v3 .timeline-list{padding-bottom:2px}
    .phyto-update-panel{margin-top:18px;border:1px solid #d5d5d0;background:#fff}
    .phyto-update-head{display:flex;justify-content:space-between;gap:16px;align-items:center;min-height:42px;padding:0 16px;border-bottom:1px solid #d5d5d0}
    .phyto-update-head h2{margin:0;font-size:10.5px;font-weight:500;letter-spacing:.055em}.phyto-update-head span{color:#999;font-size:9px}
    .phyto-update-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
    .phyto-update-item{padding:14px 16px;border-right:1px solid #dededa;border-bottom:1px solid #dededa}.phyto-update-item:nth-child(even){border-right:0}.phyto-update-item:nth-last-child(-n+2){border-bottom:0}
    .phyto-update-item span{display:block;margin-bottom:6px;color:#999;font-size:8.5px;letter-spacing:.05em}.phyto-update-item strong{display:block;font-size:11.5px;font-weight:500;line-height:1.55}.phyto-update-item p{margin:5px 0 0;color:#777;font-size:9.5px;line-height:1.6}
    .phyto-contract-note{margin:16px 0 0;padding:14px 16px;border:1px solid #cfcfca;background:#fff}.phyto-contract-note b{display:block;margin-bottom:7px;font-size:9px;letter-spacing:.06em}.phyto-contract-note p{margin:0!important;color:#555551;font-size:10.5px!important;line-height:1.75!important}.phyto-contract-note p+p{margin-top:7px!important}
    @media(max-width:720px){.nw-phyto-scope-v3 .progress-line{grid-template-columns:1fr}.phyto-update-grid{grid-template-columns:1fr}.phyto-update-item{border-right:0}.phyto-update-item:nth-last-child(-n+2){border-bottom:1px solid #dededa}.phyto-update-item:last-child{border-bottom:0}}
  `;
  document.head.appendChild(style);
}

function applyDashboardScope() {
  document.body.classList.add('nw-phyto-scope-v3');
  injectScopeStyle();

  setText('.brand-row > span:last-child', '고스란 · 브랜드 아이덴티티 · 기본 가이드라인 · 패키지 · 상세페이지');
  setText('.client-desc', '파이토레볼루션의 고스란 브랜드 프로젝트 전용 대시보드입니다. 브랜드 아이덴티티 정립, 기본형 가이드라인, 패키지 및 상세페이지 디자인과 정부지원사업 일정·진행 상태를 한 화면에서 확인할 수 있습니다.');

  const summaryValues = document.querySelectorAll('.summary-value');
  if (summaryValues[3]) summaryValues[3].innerHTML = '고스란<small>브랜드 아이덴티티 · 가이드라인 · 패키지 · 상세페이지</small>';

  const progressCopy = document.querySelector('.progress-copy');
  if (progressCopy) progressCopy.innerHTML = '<span>현재 단계 · 자료 수령 및 디자인 착수 준비</span><span>9월 9일 1차 시안 목표</span>';

  const progressLine = document.querySelector('.progress-line');
  if (progressLine) {
    progressLine.innerHTML = `
      <div class="progress-step is-active"><div class="progress-dot">01</div><div><strong>자료·계약 세팅</strong><p>계약/지원사업 자료 확인</p></div></div>
      <div class="progress-step"><div class="progress-dot">02</div><div><strong>브랜드 아이덴티티</strong><p>로고·핵심 시각체계 정립</p></div></div>
      <div class="progress-step"><div class="progress-dot">03</div><div><strong>기본 가이드라인</strong><p>기본 사용 규칙 정리</p></div></div>
      <div class="progress-step"><div class="progress-dot">04</div><div><strong>패키지·상세페이지</strong><p>제품 적용 디자인 진행</p></div></div>
      <div class="progress-step"><div class="progress-dot">05</div><div><strong>정산·최종 납품</strong><p>9/20 행정자료 및 결과 정리</p></div></div>
      <div class="progress-step"><div class="progress-dot">06</div><div><strong>유지보수</strong><p>계약 종료 후 2개월</p></div></div>`;
  }

  const overviewRows = document.querySelectorAll('.compact-row');
  if (overviewRows[2]) {
    const label = overviewRows[2].querySelector('span');
    const value = overviewRows[2].querySelector('strong');
    if (label) label.textContent = 'SCOPE';
    if (value) value.textContent = '브랜드 아이덴티티 · 기본형 가이드라인 · 패키지 · 상세페이지 디자인';
  }

  const timeline = document.querySelector('.timeline-list');
  if (timeline) {
    timeline.innerHTML = `
      <div class="timeline-row is-active"><div class="timeline-no">01</div><div><strong>자료 수령 및 계약 반영</strong><p>세금계산서·사업자등록증·사본·통장사본 등 지원사업 서류 확인</p></div></div>
      <div class="timeline-row"><div class="timeline-no">02</div><div><strong>9월 9일 · 1차 디자인 확인</strong><p>고스란 및 파이토레볼루션 로고 방향을 포함해 출원 준비가 가능하도록 우선 진행</p></div></div>
      <div class="timeline-row"><div class="timeline-no">03</div><div><strong>브랜드 가이드 · 패키지 · 상세페이지</strong><p>승인 방향을 기준으로 주요 적용물 디자인을 순차 개발</p></div></div>
      <div class="timeline-row"><div class="timeline-no">04</div><div><strong>9월 20일 · 지원사업 행정 마감</strong><p>용역결과보고서 및 정산에 필요한 자료 전달을 우선 완료</p></div></div>
      <div class="timeline-row"><div class="timeline-no">05</div><div><strong>10월 27일 · 계약 원안 종료</strong><p>지원사업 행정 일정과 별개로 본 프로젝트 계약기간은 원안 기준 유지</p></div></div>`;
  }

  if (!document.querySelector('.phyto-update-panel')) {
    const progressPanel = document.querySelector('.progress-panel');
    if (progressPanel) {
      progressPanel.insertAdjacentHTML('afterend', `
        <section class="phyto-update-panel">
          <div class="phyto-update-head"><h2>PROJECT UPDATE · 2026.08.28</h2><span>CLIENT REQUEST / CONFIRMED</span></div>
          <div class="phyto-update-grid">
            <div class="phyto-update-item"><span>09.09 · DESIGN</span><strong>고스란 / 파이토레볼루션 로고 디자인 우선 진행</strong><p>특허·출원 비용 신청 일정에 맞춰 1차 확인 가능한 수준으로 빠르게 진행합니다.</p></div>
            <div class="phyto-update-item"><span>09.20 · ADMIN</span><strong>정부지원사업 용역결과보고서 및 정산자료 전달</strong><p>지원사업 행정 마감을 위해 9월 20일까지 필요한 결과·증빙 자료를 우선 정리합니다.</p></div>
            <div class="phyto-update-item"><span>CONTRACT</span><strong>본 계약기간은 2026.10.27까지 유지</strong><p>지원사업비 종료 일정과 별개로 계약기간 원안은 유지하며, 9월 20일은 행정상 주요 제출 기준일로 관리합니다.</p></div>
            <div class="phyto-update-item"><span>SAMPLE COST</span><strong>간단 단상자 샘플은 10만원 내 지원 예정</strong><p>대형 박스·싸바리 등 제작비가 30만원 이상 발생하는 제작은 사전 협의 후 별도 비용으로 진행합니다.</p></div>
          </div>
        </section>`);
    }
  }

  const statusBox = document.querySelector('.status-box');
  if (statusBox) {
    const strong = statusBox.querySelector('strong');
    const p = statusBox.querySelector('p');
    if (strong) strong.textContent = '자료 수령 · 디자인 착수 준비';
    if (p) p.textContent = '9월 9일 1차 디자인 확인과 9월 20일 지원사업 행정자료 제출을 우선 일정으로 관리합니다.';
  }
}

function applyContractScope() {
  injectScopeStyle();
  setText('.doc-head h1 span', '파이토레볼루션 · 고스란 브랜드 아이덴티티 · 가이드라인 · 패키지 · 상세페이지 디자인 프로젝트');
  setText('.doc-intro', '파이토레볼루션이 운영하는 고스란 브랜드의 아이덴티티 정립, 기본형 브랜드 가이드라인 구축, 패키지 및 상세페이지 디자인을 포함한 프로젝트의 업무 범위, 기간, 금액 및 양 당사자의 기본 권리·의무를 확인하기 위한 계약서 초안입니다.');

  const overviewValues = document.querySelectorAll('.overview-value');
  if (overviewValues[0]) overviewValues[0].textContent = '고스란 브랜드 아이덴티티 · 기본형 가이드라인 · 패키지 · 상세페이지 디자인 프로젝트';

  const clauses = Array.from(document.querySelectorAll('.clause'));
  const clauseByTitle = (title) => clauses.find((clause) => clause.querySelector('h2')?.textContent.trim() === title);

  const direction = clauseByTitle('프로젝트의 기본 방향');
  if (direction) {
    const content = direction.querySelector('div:last-child');
    if (content) content.innerHTML = '<h2>프로젝트의 기본 방향</h2><p>본 프로젝트는 고스란 브랜드의 방향과 핵심 메시지를 정리한 뒤 브랜드 아이덴티티를 정립하고, 이를 일관되게 운용할 수 있는 기본형 브랜드 가이드라인을 구축하는 것을 기본 방향으로 한다. 정립된 아이덴티티와 가이드라인을 기준으로 제품 패키지 및 상세페이지 디자인을 개발하여 브랜드와 제품 경험이 하나의 시각 체계로 연결되도록 진행한다.</p>';
  }

  const goal = clauseByTitle('프로젝트 목표');
  if (goal) {
    const content = goal.querySelector('div:last-child');
    if (content) content.innerHTML = '<h2>프로젝트 목표</h2><p>을은 고스란의 브랜드 표현 체계를 명확하게 정립하고, 향후 브랜드와 제품 커뮤니케이션에 반복 활용할 수 있는 기본 시각 기준을 구축하는 것을 목표로 한다. 브랜드 아이덴티티, 기본형 가이드라인, 패키지 및 상세페이지 디자인을 하나의 체계로 연결하여 제품 확장 시에도 일관된 브랜드 경험을 유지할 수 있는 기반을 마련한다.</p>';
  }

  const scope = clauseByTitle('용역 범위 및 세부 작업 내용');
  if (scope) {
    const content = scope.querySelector('div:last-child');
    if (content) content.innerHTML = `
      <h2>용역 범위 및 세부 작업 내용</h2>
      <p>본 계약에 포함되는 기본 용역 범위는 다음과 같다.</p>
      <div class="scope-table">
        <div class="scope-row"><b>Brand Direction</b><span>고스란 브랜드의 방향, 핵심 메시지와 디자인 기준 정리</span></div>
        <div class="scope-row"><b>Brand Identity</b><span>고스란 및 파이토레볼루션 로고 체계, 컬러, 타이포그래피, 기본 그래픽 및 이미지 방향을 포함한 핵심 시각 아이덴티티 정립</span></div>
        <div class="scope-row"><b>Basic Guideline</b><span>정립된 브랜드 아이덴티티의 기본 사용 규칙과 주요 시각 기준을 문서화한 기본형 브랜드 가이드라인 구축</span></div>
        <div class="scope-row"><b>Package Design</b><span>확정된 브랜드 아이덴티티와 제공된 제품 정보·칼선을 기준으로 주요 제품 패키지 디자인 개발 및 적용</span></div>
        <div class="scope-row"><b>Detail Page</b><span>확정된 브랜드·제품 디자인 방향을 기준으로 주요 제품 상세페이지 디자인 구성 및 적용</span></div>
        <div class="scope-row"><b>Final Delivery</b><span>최종 검수, 가이드라인·패키지·상세페이지 납품 대상 데이터 및 정부지원사업 결과자료 정리</span></div>
        <div class="scope-row"><b>Maintenance</b><span>계약 종료 후 2개월간 상호 합의된 범위 내 유지보수 진행</span></div>
      </div>
      <p>세부 패키지 품목, 상세페이지 적용 범위, 규격과 우선순위는 갑이 제공하는 제품 정보 및 프로젝트 진행 과정에서 상호 확인된 범위를 기준으로 진행한다.</p>
      <div class="phyto-contract-note"><b>지원사업 일정 및 샘플 제작비 안내</b><p>정부지원사업 행정 일정상 2026년 9월 20일까지 용역결과보고서 및 정산 관련 자료를 우선 정리·전달하는 것을 목표로 한다. 다만 본 계약의 용역기간은 원안대로 2026년 10월 27일까지 유지한다.</p><p>간단한 단상자 샘플 제작은 10만원 이내 범위에서 을이 지원할 예정이며, 대형 박스·싸바리 등 제작 방식으로 샘플 제작비가 30만원 이상 발생하는 경우 사전 협의 후 별도 비용으로 진행한다.</p></div>`;
  }

  const deliverables = clauseByTitle('산출물');
  if (deliverables) {
    const content = deliverables.querySelector('div:last-child');
    if (content) content.innerHTML = `
      <h2>산출물</h2>
      <p>산출물은 본 계약의 용역 범위와 프로젝트 진행 과정에서 상호 확인된 적용 항목을 기준으로 하며, 다음 범주의 결과물을 포함한다.</p>
      <ul>
        <li data-no="1)">브랜드 방향 및 핵심 메시지 정리 자료</li>
        <li data-no="2)">고스란 및 파이토레볼루션 브랜드 아이덴티티 핵심 시각 자산 및 디자인 시스템</li>
        <li data-no="3)">로고, 컬러, 타이포그래피, 기본 시각 요소의 사용 기준을 정리한 기본형 브랜드 가이드라인</li>
        <li data-no="4)">상호 확정된 품목과 제공된 칼선을 기준으로 한 패키지 디자인 적용 결과물</li>
        <li data-no="5)">상호 확정된 제품 범위를 기준으로 한 상세페이지 디자인 결과물</li>
        <li data-no="6)">최종 검수 후 납품 대상으로 확정된 가이드라인 및 디자인 데이터와 정부지원사업 용역결과 관련 자료</li>
      </ul>`;
  }

  const extra = clauseByTitle('수정 및 추가 작업');
  if (extra) {
    const content = extra.querySelector('div:last-child');
    if (content) content.innerHTML = '<h2>수정 및 추가 작업</h2><p>본 계약은 현재 합의된 브랜드 아이덴티티, 기본형 가이드라인, 패키지 및 상세페이지 디자인 범위와 견적을 기준으로 산정되었다. 합의된 범위를 벗어나는 신규 패키지 품목·규격의 대량 추가, 신규 칼선 또는 패키지 구조 설계, 확정 방향의 전면 변경, 반복 수정, 별도 촬영·인쇄·제작·감리 또는 추가 개발 업무가 발생하는 경우 추가 견적이 발생할 수 있다.</p><p>추가 작업이 필요한 경우 을은 작업 범위와 비용을 사전에 안내하고 갑의 확인 후 진행한다.</p>';
  }
}

function applyQuoteScope() {
  const projectRow = Array.from(document.querySelectorAll('.info .row')).find((row) => row.querySelector('b')?.textContent.trim() === '프로젝트');
  if (projectRow) setText('span', '고스란 브랜드 아이덴티티 · 기본형 가이드라인 · 패키지 · 상세페이지 디자인 프로젝트', projectRow);
  setText('.sumhead h2', 'GOSRAN Brand Identity, Package & Detail Page');
  const scope = document.querySelector('.scope');
  if (scope) {
    scope.innerHTML = `
      <div><b>Brand Direction</b><span>브랜드 방향, 핵심 메시지 및 프로젝트 디자인 기준 정리</span></div>
      <div><b>Brand Identity</b><span>고스란 및 파이토레볼루션 로고 체계, 컬러, 타이포그래피와 주요 시각 아이덴티티 정립</span></div>
      <div><b>Basic Guideline</b><span>정립된 브랜드 아이덴티티의 기본 사용 원칙과 시각 기준 문서화</span></div>
      <div><b>Package Design</b><span>확정 아이덴티티와 제공된 제품 정보·칼선을 기준으로 패키지 디자인 개발</span></div>
      <div><b>Detail Page</b><span>확정된 브랜드·제품 방향을 기준으로 주요 제품 상세페이지 디자인 구성</span></div>
      <div><b>Final Delivery</b><span>가이드라인, 패키지·상세페이지 및 정부지원사업 결과자료 정리</span></div>
      <div><b>Maintenance</b><span>계약 종료 후 2개월간 합의된 범위 내 유지보수 진행</span></div>`;
  }
  const scopeNote = Array.from(document.querySelectorAll('.note')).find((note) => note.querySelector('strong')?.textContent.trim() === 'Scope');
  if (scopeNote) setText('span', '본 견적은 고스란 브랜드 아이덴티티 정립, 기본형 브랜드 가이드라인 구축, 주요 패키지 및 상세페이지 디자인 개발과 최종 결과물 정리를 기준으로 하며, 합의된 범위를 벗어나는 추가 품목·규격·제작 업무는 별도 협의합니다.', scopeNote);
}

function applyProjectScopeContent() {
  const path = window.location.pathname.toLowerCase();
  if (!path.includes('/client/phyto')) return;
  if (path.endsWith('/client/phyto/') || path.endsWith('/client/phyto/index.html')) applyDashboardScope();
  else if (path.endsWith('/contract.html')) applyContractScope();
  else if (path.endsWith('/quote.html')) applyQuoteScope();
}

function init() {
  applyProjectScopeContent();
  if (!document.body.classList.contains('nw-phyto-locked')) return;
  if (readGrant()) {
    unlock();
    return;
  }

  document.body.insertAdjacentHTML('beforeend', checkingMarkup());
  if (!auth) {
    renderForm();
    return;
  }

  const currentEmail = String(auth.currentUser?.email || '').toLowerCase();
  if (currentEmail === ADMIN_EMAIL) {
    unlock();
    return;
  }

  let resolved = false;
  const fallback = window.setTimeout(() => {
    if (!resolved) renderForm();
  }, 1200);

  const stop = onAuthStateChanged(auth, (user) => {
    if (resolved) return;
    resolved = true;
    window.clearTimeout(fallback);
    stop();
    const email = String(user?.email || '').toLowerCase();
    if (email === ADMIN_EMAIL) unlock();
    else renderForm();
  }, () => {
    if (resolved) return;
    resolved = true;
    window.clearTimeout(fallback);
    renderForm();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
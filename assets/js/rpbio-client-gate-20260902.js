import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { auth } from './firebase-client.js';

const ADMIN_EMAIL='info@9works.kr';
const ACCESS_KEY='nw:rpbio:client-access:v1';
const ACCESS_TTL=12*60*60*1000;
const EXPECTED_HASH='a3f08a63b98ce037a4fd1619d6b66a614027fbcdb164c53945a6463bd6602629';

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
function readGrant(){try{const v=JSON.parse(localStorage.getItem(ACCESS_KEY)||'null');return !!(v&&Number(v.expiresAt)>Date.now())}catch{return false}}
function saveGrant(){try{localStorage.setItem(ACCESS_KEY,JSON.stringify({expiresAt:Date.now()+ACCESS_TTL}))}catch{}}
function unlock(){document.body.classList.remove('nw-rpbio-locked');q('.nw-rpbio-gate')?.remove()}
async function hashText(value){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function gateMarkup(){return `<div class="nw-rpbio-gate" role="dialog" aria-modal="true" aria-label="알피바이오 프로젝트 입장"><div class="nw-rpbio-gate__card"><div class="nw-rpbio-gate__brand"><img src="/assets/logo-nineworks.svg" alt="NINEWORKS"><span>PRIVATE CLIENT PORTAL</span></div><p class="nw-rpbio-gate__kicker">RPBIO · BITESS</p><h1 class="nw-rpbio-gate__title">프로젝트 전용 페이지</h1><p class="nw-rpbio-gate__desc">알피바이오 BITESS 신규 브랜드 런칭 프로젝트의 계약, 일정, 단계별 진행 현황과 관련 문서를 한곳에서 확인하는 전용 공간입니다.</p><div class="nw-rpbio-gate__onboarding"><div class="nw-rpbio-gate__step"><b>01</b><span>2026년 9월 7일 착수부터 12월 14일 Launch Ready까지의 전체 일정을 확인합니다.</span></div><div class="nw-rpbio-gate__step"><b>02</b><span>브랜드 아이덴티티, 패키지, 상세페이지 및 런칭 콘텐츠의 진행 단계를 확인합니다.</span></div><div class="nw-rpbio-gate__step"><b>03</b><span>계약·견적·일정 및 나인웍스 공통 정산 문서를 확인할 수 있습니다.</span></div></div><form class="nw-rpbio-gate__form" data-rpbio-gate-form><input class="nw-rpbio-gate__input" data-rpbio-gate-input type="password" autocomplete="current-password" placeholder="프로젝트 비밀번호" required><button class="nw-rpbio-gate__button" type="submit">프로젝트 입장</button></form><div class="nw-rpbio-gate__error" data-rpbio-gate-error></div><div class="nw-rpbio-gate__meta"><span>인증 상태는 이 브라우저에서 12시간 유지됩니다.</span><span>문의 · info@9works.kr</span></div></div></div>`}
function renderGate(){q('.nw-rpbio-gate')?.remove();document.body.insertAdjacentHTML('beforeend',gateMarkup());const f=q('[data-rpbio-gate-form]'),i=q('[data-rpbio-gate-input]'),e=q('[data-rpbio-gate-error]');f?.addEventListener('submit',async(ev)=>{ev.preventDefault();const v=String(i?.value||'').trim();if(!v)return;try{if(await hashText(v)===EXPECTED_HASH){saveGrant();unlock();return}}catch{}if(e)e.textContent='비밀번호가 일치하지 않습니다. 다시 확인해 주세요.';if(i){i.value='';i.focus()}});setTimeout(()=>i?.focus(),50)}

function injectCalendarStyle(){
  if(q('[data-rpbio-calendar-style]'))return;
  const style=document.createElement('style');
  style.dataset.rpbioCalendarStyle='true';
  style.textContent=`
    .rpb-calendar-panel{margin-top:18px;background:rgba(255,255,255,.52)}
    .rpb-calendar-now{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-bottom:1px solid var(--rpb-line)}
    .rpb-calendar-now__item{position:relative;min-height:92px;padding:15px 16px;border-right:1px solid var(--rpb-line)}
    .rpb-calendar-now__item:last-child{border-right:0}
    .rpb-calendar-now__item span{display:block;color:#999;font-size:8.5px;letter-spacing:.055em}
    .rpb-calendar-now__item strong{display:block;margin-top:8px;font-size:12px;font-weight:500;line-height:1.45}
    .rpb-calendar-now__item p{margin:5px 0 0;color:#777;font-size:9.2px;line-height:1.5}
    .rpb-calendar-now__item.is-today:before{position:absolute;top:15px;right:15px;width:6px;height:6px;border-radius:50%;background:#111;content:''}
    .rpb-calendar-ranges{padding:14px 16px;border-bottom:1px solid var(--rpb-line)}
    .rpb-calendar-range{display:grid;grid-template-columns:118px 165px 1fr;gap:16px;padding:9px 0;border-bottom:1px solid #e2e2de;align-items:center}
    .rpb-calendar-range:last-child{border-bottom:0}
    .rpb-calendar-range span{color:#999;font-size:8.7px}
    .rpb-calendar-range strong{font-size:10.5px;font-weight:500}
    .rpb-calendar-range p{margin:0;color:#777;font-size:9.2px;line-height:1.5}
    .rpb-calendar-months{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
    .rpb-calendar-month{min-width:0;border-right:1px solid var(--rpb-line)}
    .rpb-calendar-month:last-child{border-right:0}
    .rpb-calendar-month__head{display:flex;justify-content:space-between;align-items:end;gap:10px;min-height:56px;padding:13px 15px;border-bottom:1px solid var(--rpb-line)}
    .rpb-calendar-month__head strong{font-size:19px;font-weight:500;letter-spacing:-.04em}
    .rpb-calendar-month__head span{color:#999;font-size:8px;letter-spacing:.05em}
    .rpb-calendar-events{padding:0 15px}
    .rpb-calendar-event{display:grid;grid-template-columns:44px 1fr;gap:10px;padding:11px 0;border-bottom:1px solid #e2e2de}
    .rpb-calendar-event:last-child{border-bottom:0}
    .rpb-calendar-event time{color:#999;font-size:8.7px;font-variant-numeric:tabular-nums}
    .rpb-calendar-event strong{display:block;font-size:10.2px;font-weight:500;line-height:1.45}
    .rpb-calendar-event p{margin:3px 0 0;color:#888;font-size:8.7px;line-height:1.45}
    .rpb-calendar-event.is-priority strong{font-weight:650}
    .rpb-calendar-event.is-priority time{color:#171717;font-weight:600}
    .rpb-calendar-note{display:flex;justify-content:space-between;gap:20px;padding:12px 16px;border-top:1px solid var(--rpb-line);color:#888;font-size:8.8px;line-height:1.55}
    @media(max-width:980px){.rpb-calendar-months{grid-template-columns:1fr 1fr}.rpb-calendar-month:nth-child(2){border-right:0}.rpb-calendar-month:nth-child(-n+2){border-bottom:1px solid var(--rpb-line)}}
    @media(max-width:720px){.rpb-calendar-now{grid-template-columns:1fr}.rpb-calendar-now__item{border-right:0;border-bottom:1px solid var(--rpb-line)}.rpb-calendar-now__item:last-child{border-bottom:0}.rpb-calendar-range{grid-template-columns:1fr;gap:4px;padding:11px 0}.rpb-calendar-months{grid-template-columns:1fr}.rpb-calendar-month{border-right:0!important;border-bottom:1px solid var(--rpb-line)}.rpb-calendar-month:last-child{border-bottom:0}.rpb-calendar-note{display:block}.rpb-calendar-note span{display:block;margin-top:4px}}
  `;
  document.head.appendChild(style);
}

function calendarMarkup(){return `
<section class="panel rpb-calendar-panel">
  <div class="panel-head"><h2>PROJECT CALENDAR</h2><span>06</span></div>
  <div class="rpb-calendar-now">
    <div class="rpb-calendar-now__item is-today"><span>TODAY · MON 09.07</span><strong>Project Kickoff</strong><p>공식 착수 · 브랜드/제품 기본 자료 확인 및 일정 운영 시작</p></div>
    <div class="rpb-calendar-now__item"><span>THU 09.10 · FIRST DELIVERY</span><strong>네이밍 제안서 1차 초안 전달</strong><p>네이밍 방향 및 후보군을 1차 제안서 형태로 공유</p></div>
    <div class="rpb-calendar-now__item"><span>WED 09.16 · STRUCTURE REVIEW</span><strong>지기구조 관련 의견서 전달</strong><p>패키지 구조·사용 경험 관점의 사전 검토 의견 정리</p></div>
  </div>
  <div class="rpb-calendar-ranges">
    <div class="rpb-calendar-range"><span>09.07 — 10.18</span><strong>Branding & Identity</strong><p>리서치 → 브랜드 방향 → BI·Visual Identity 확정</p></div>
    <div class="rpb-calendar-range"><span>10.05 — 11.15</span><strong>Package Design</strong><p>패키지 컨셉 → 디자인 → 칼선·제작 데이터 → 제품 비주얼</p></div>
    <div class="rpb-calendar-range"><span>10.26 — 12.14</span><strong>Commerce & Launch</strong><p>상세페이지 → 웹·홍보 콘텐츠 → 최종 가이드 → Launch Ready</p></div>
  </div>
  <div class="rpb-calendar-months">
    <section class="rpb-calendar-month"><div class="rpb-calendar-month__head"><strong>SEP</strong><span>2026 / START</span></div><div class="rpb-calendar-events">
      <div class="rpb-calendar-event is-priority"><time>09.07</time><div><strong>공식 프로젝트 착수</strong><p>Kickoff · 자료 세팅</p></div></div>
      <div class="rpb-calendar-event is-priority"><time>09.10</time><div><strong>네이밍 제안서 1차 초안</strong><p>1차 후보 및 방향 공유</p></div></div>
      <div class="rpb-calendar-event is-priority"><time>09.16</time><div><strong>지기구조 의견서</strong><p>구조·사용성 사전 검토</p></div></div>
      <div class="rpb-calendar-event"><time>09.18</time><div><strong>Research & Planning 정리</strong><p>전략·디자인 과제 정리</p></div></div>
      <div class="rpb-calendar-event"><time>09.27</time><div><strong>Brand Direction 1차 확인</strong><p>무드·톤앤매너·키비주얼 방향</p></div></div>
    </div></section>
    <section class="rpb-calendar-month"><div class="rpb-calendar-month__head"><strong>OCT</strong><span>IDENTITY / PACKAGE</span></div><div class="rpb-calendar-events">
      <div class="rpb-calendar-event"><time>10.04</time><div><strong>디자인 방향 최종 확정</strong><p>방향 검토 및 피드백 반영</p></div></div>
      <div class="rpb-calendar-event"><time>10.11</time><div><strong>Identity 1차 제안</strong><p>BI·Color·Type·Graphic System</p></div></div>
      <div class="rpb-calendar-event is-priority"><time>10.18</time><div><strong>Brand Identity 최종 확정</strong><p>핵심 시각 시스템 확정</p></div></div>
      <div class="rpb-calendar-event"><time>10.25</time><div><strong>Package Design 1차 제안</strong><p>PTP·본품·리필 디자인 전개</p></div></div>
    </div></section>
    <section class="rpb-calendar-month"><div class="rpb-calendar-month__head"><strong>NOV</strong><span>PACKAGE / COMMERCE</span></div><div class="rpb-calendar-events">
      <div class="rpb-calendar-event is-priority"><time>11.01</time><div><strong>Package Design 확정</strong><p>본품·리필·PTP 통일성 검토</p></div></div>
      <div class="rpb-calendar-event"><time>11.08</time><div><strong>제작 데이터 · 상세 기획 확인</strong><p>칼선·법정표기 영역 / 상세페이지 구조</p></div></div>
      <div class="rpb-calendar-event"><time>11.15</time><div><strong>제품 비주얼 확인</strong><p>연출컷·판매 활용 이미지</p></div></div>
      <div class="rpb-calendar-event is-priority"><time>11.22</time><div><strong>대표 상세페이지 확정</strong><p>제품 정보 및 판매 콘텐츠</p></div></div>
      <div class="rpb-calendar-event"><time>11.29</time><div><strong>웹 콘텐츠 확인</strong><p>브랜드·제품 디지털 자산</p></div></div>
    </div></section>
    <section class="rpb-calendar-month"><div class="rpb-calendar-month__head"><strong>DEC</strong><span>LAUNCH READY</span></div><div class="rpb-calendar-events">
      <div class="rpb-calendar-event"><time>12.04</time><div><strong>홍보 콘텐츠 확인</strong><p>SNS·배너·프로모션 자산</p></div></div>
      <div class="rpb-calendar-event"><time>12.11</time><div><strong>최종 가이드 · 원본 정리</strong><p>브랜드·패키지·디지털 최종 검수</p></div></div>
      <div class="rpb-calendar-event is-priority"><time>12.14</time><div><strong>Launch Ready</strong><p>최종 파일 전달 및 런칭 준비 완료</p></div></div>
    </div></section>
  </div>
  <div class="rpb-calendar-note"><span>기준일 · 2026.09.07</span><span>주요 제안 후 피드백 2–3영업일 기준 · 외부 제작/법정표기 일정에 따라 일부 조정 가능</span></div>
</section>`}

function applyProjectCalendar(){
  injectCalendarStyle();
  const milestone=q('.milestone-panel');
  if(milestone&&!q('.rpb-calendar-panel'))milestone.insertAdjacentHTML('afterend',calendarMarkup());

  const topStatus=q('.client-status');
  if(topStatus)topStatus.textContent='PROJECT · 진행중';
  const progressCopy=q('.progress-copy');
  if(progressCopy)progressCopy.innerHTML='<span>현재 단계 · Naming / Brand Direction</span><span>09.10 1차 초안 전달</span>';

  const statusBox=q('.side-stack .status-box');
  if(statusBox){
    const title=q('strong',statusBox); if(title)title.textContent='Kickoff · Naming 진행';
    const copy=q('p',statusBox); if(copy)copy.textContent='9월 7일 공식 착수했습니다. 우선 네이밍 제안서 1차 초안을 9월 10일까지 전달하고, 지기구조 관련 사전 검토 의견서를 9월 16일까지 정리한 뒤 전체 브랜딩 일정으로 이어갑니다.';
  }
  const meta=qa('.side-stack .status-meta div');
  if(meta[1]){const b=q('b',meta[1]);if(b)b.textContent='진행중'}
  const footer=qa('.client-footer span');
  if(footer[1])footer[1].textContent='Last updated · 2026.09.07';
}

applyProjectCalendar();

if(readGrant()) unlock();
else renderGate();

try{onAuthStateChanged(auth,(user)=>{if(String(user?.email||'').toLowerCase()===ADMIN_EMAIL)unlock()})}catch{}

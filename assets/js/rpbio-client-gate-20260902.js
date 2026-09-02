import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { auth } from './firebase-client.js';

const ADMIN_EMAIL='info@9works.kr';
const ACCESS_KEY='nw:rpbio:client-access:v1';
const ACCESS_TTL=12*60*60*1000;
const EXPECTED_HASH='a3f08a63b98ce037a4fd1619d6b66a614027fbcdb164c53945a6463bd6602629';

const q=(s,r=document)=>r.querySelector(s);
function readGrant(){try{const v=JSON.parse(localStorage.getItem(ACCESS_KEY)||'null');return !!(v&&Number(v.expiresAt)>Date.now())}catch{return false}}
function saveGrant(){try{localStorage.setItem(ACCESS_KEY,JSON.stringify({expiresAt:Date.now()+ACCESS_TTL}))}catch{}}
function unlock(){document.body.classList.remove('nw-rpbio-locked');q('.nw-rpbio-gate')?.remove()}
async function hashText(value){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function gateMarkup(){return `<div class="nw-rpbio-gate" role="dialog" aria-modal="true" aria-label="알피바이오 프로젝트 입장"><div class="nw-rpbio-gate__card"><div class="nw-rpbio-gate__brand"><img src="/assets/logo-nineworks.svg" alt="NINEWORKS"><span>PRIVATE CLIENT PORTAL</span></div><p class="nw-rpbio-gate__kicker">RPBIO · BITESS</p><h1 class="nw-rpbio-gate__title">프로젝트 전용 페이지</h1><p class="nw-rpbio-gate__desc">알피바이오 BITESS 신규 브랜드 런칭 프로젝트의 계약, 일정, 단계별 진행 현황과 관련 문서를 한곳에서 확인하는 전용 공간입니다.</p><div class="nw-rpbio-gate__onboarding"><div class="nw-rpbio-gate__step"><b>01</b><span>2026년 9월 7일 착수부터 12월 14일 Launch Ready까지의 전체 일정을 확인합니다.</span></div><div class="nw-rpbio-gate__step"><b>02</b><span>브랜드 아이덴티티, 패키지, 상세페이지 및 런칭 콘텐츠의 진행 단계를 확인합니다.</span></div><div class="nw-rpbio-gate__step"><b>03</b><span>계약·견적·일정 및 나인웍스 공통 정산 문서를 확인할 수 있습니다.</span></div></div><form class="nw-rpbio-gate__form" data-rpbio-gate-form><input class="nw-rpbio-gate__input" data-rpbio-gate-input type="password" autocomplete="current-password" placeholder="프로젝트 비밀번호" required><button class="nw-rpbio-gate__button" type="submit">프로젝트 입장</button></form><div class="nw-rpbio-gate__error" data-rpbio-gate-error></div><div class="nw-rpbio-gate__meta"><span>인증 상태는 이 브라우저에서 12시간 유지됩니다.</span><span>문의 · info@9works.kr</span></div></div></div>`}
function renderGate(){q('.nw-rpbio-gate')?.remove();document.body.insertAdjacentHTML('beforeend',gateMarkup());const f=q('[data-rpbio-gate-form]'),i=q('[data-rpbio-gate-input]'),e=q('[data-rpbio-gate-error]');f?.addEventListener('submit',async(ev)=>{ev.preventDefault();const v=String(i?.value||'').trim();if(!v)return;try{if(await hashText(v)===EXPECTED_HASH){saveGrant();unlock();return}}catch{}if(e)e.textContent='비밀번호가 일치하지 않습니다. 다시 확인해 주세요.';if(i){i.value='';i.focus()}});setTimeout(()=>i?.focus(),50)}

if(readGrant()) unlock();
else renderGate();

try{onAuthStateChanged(auth,(user)=>{if(String(user?.email||'').toLowerCase()===ADMIN_EMAIL)unlock()})}catch{}

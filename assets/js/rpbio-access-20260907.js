const ACCESS_KEY='nw:rpbio:client-access:v2';
const ACCESS_TTL=12*60*60*1000;
const EXPECTED_HASH='0b2b0483f3c67efb0ed0da8e01416c5dde79822ba7af7bb9a241d55cde4e0593';
const q=(s,r=document)=>r.querySelector(s);

function readGrant(){
  try{const v=JSON.parse(localStorage.getItem(ACCESS_KEY)||'null');return Boolean(v&&Number(v.expiresAt)>Date.now())}catch{return false}
}
function saveGrant(){try{localStorage.setItem(ACCESS_KEY,JSON.stringify({expiresAt:Date.now()+ACCESS_TTL}))}catch{}}
function unlock(){document.body.classList.remove('nw-rpbio-locked');q('.nw-rpbio-gate')?.remove()}
async function hashText(value){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function markup(){return `<div class="nw-rpbio-gate" role="dialog" aria-modal="true" aria-label="알피바이오 프로젝트 입장"><div class="nw-rpbio-gate__card"><div class="nw-rpbio-gate__brand"><img src="/assets/logo-nineworks.svg" alt="NINEWORKS"><span>PRIVATE CLIENT PORTAL</span></div><p class="nw-rpbio-gate__kicker">RPBIO · NEW BRAND LAUNCH</p><h1 class="nw-rpbio-gate__title">프로젝트 전용 페이지</h1><p class="nw-rpbio-gate__desc">알피바이오 신규 브랜드 런칭 프로젝트의 일정과 진행 현황을 확인하는 전용 공간입니다.</p><form class="nw-rpbio-gate__form" data-rpbio-gate-form><input class="nw-rpbio-gate__input" data-rpbio-gate-input type="password" autocomplete="current-password" placeholder="프로젝트 비밀번호" required><button class="nw-rpbio-gate__button" type="submit">프로젝트 입장</button></form><div class="nw-rpbio-gate__error" data-rpbio-gate-error></div><div class="nw-rpbio-gate__meta"><span>인증 상태는 이 브라우저에서 12시간 유지됩니다.</span><span>문의 · info@9works.kr</span></div></div></div>`}
function render(){document.body.insertAdjacentHTML('beforeend',markup());const f=q('[data-rpbio-gate-form]'),i=q('[data-rpbio-gate-input]'),e=q('[data-rpbio-gate-error]');f?.addEventListener('submit',async(ev)=>{ev.preventDefault();const value=String(i?.value||'').trim();if(await hashText(value)===EXPECTED_HASH){saveGrant();unlock();return}if(e)e.textContent='비밀번호가 일치하지 않습니다. 다시 확인해 주세요.';if(i){i.value='';i.focus()}})}
if(readGrant())unlock();else render();
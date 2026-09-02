import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db } from './firebase-client.js';

const ADMIN_EMAIL='info@9works.kr';
const RPBIO_ID='rpbio';
const RPBIO_URL='/client/rpbio/';
let listObserver=null;

function injectStyles(){
  if(document.querySelector('style[data-rpbio-admin-link]')) return;
  const style=document.createElement('style');
  style.dataset.rpbioAdminLink='true';
  style.textContent=`
    .admin-client-row__portal .nw-rpbio-linked{display:inline-flex;align-items:center;justify-content:center;min-width:78px;height:28px;padding:0 9px;border:1px solid #111;background:#111;color:#fff!important;font-size:8px!important;font-weight:500;line-height:1;letter-spacing:.035em;white-space:nowrap;text-decoration:none}
    .admin-client-row__portal .nw-rpbio-linked:hover{background:#fff;color:#111!important}
    @media(max-width:760px){.admin-client-row__portal .nw-rpbio-linked{min-width:72px}}
  `;
  document.head.appendChild(style);
}

async function ensureRPBIOClient(user){
  if(!user||String(user.email||'').toLowerCase()!==ADMIN_EMAIL||!db) return;
  const ref=doc(db,'clients',RPBIO_ID);
  const snap=await getDoc(ref);
  const base={
    company:'알피바이오',
    companyName:'알피바이오',
    brand:'BITESS (바이테스)',
    projectName:'BITESS 프리미엄 뉴트리션 젤리 브랜드 런칭',
    project:'BITESS 프리미엄 뉴트리션 젤리 브랜드 런칭',
    scope:'브랜드 및 비주얼 방향, BI·Visual Identity, PTP·본품·리필 패키지, 제품 비주얼, 상세페이지, 웹사이트 및 런칭 홍보 콘텐츠, 최종 가이드·아카이브',
    contactName:'윤수경 차장',
    clientStage:'client',
    contractType:'브랜드 런칭 통합 디자인',
    contractStatus:'draft',
    contractStart:'2026-09-07',
    contractEnd:'2026-12-14',
    contractAmount:'16,500,000원 (VAT 포함)',
    paymentTerms:'선금 50% / 잔금 50%',
    maintenancePeriod:'계약 종료 후 2개월 예정',
    projectType:'New Brand Launch',
    portalEnabled:true,
    portalUrl:RPBIO_URL,
    portalMessage:'BITESS 신규 브랜드 런칭 프로젝트의 브랜드 아이덴티티, 패키지, 상세페이지·웹·홍보 콘텐츠 일정과 계약·견적·진행 현황을 전용 대시보드에서 확인할 수 있습니다.',
    updatedAt:serverTimestamp()
  };
  if(!snap.exists()) base.createdAt=serverTimestamp();
  await setDoc(ref,base,{merge:true});
}

function attachDirectPortalLinks(){
  const list=document.querySelector('[data-client-list]');
  if(!list) return;
  list.querySelectorAll('.admin-client-row').forEach((row)=>{
    const text=row.textContent||'';
    if(!/알피바이오|RPBIO|BITESS|바이테스/i.test(text)) return;
    const portal=row.querySelector('.admin-client-row__portal');
    if(!portal) return;
    const status=portal.querySelector('span');
    if(status){status.textContent='PORTAL ON';status.classList.add('is-on')}
    let link=portal.querySelector('.nw-rpbio-linked');
    if(!link){
      link=document.createElement('a');
      link.className='nw-rpbio-linked';
      link.href=RPBIO_URL;
      link.target='_blank';
      link.rel='noopener';
      link.textContent='대시보드 ↗';
      link.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();window.open(RPBIO_URL,'_blank','noopener')});
      portal.appendChild(link);
    }
  });
}

function observeClientList(){
  const list=document.querySelector('[data-client-list]');
  if(!list) return;
  if(listObserver) listObserver.disconnect();
  listObserver=new MutationObserver(()=>attachDirectPortalLinks());
  listObserver.observe(list,{childList:true});
  attachDirectPortalLinks();
}

injectStyles();
onAuthStateChanged(auth,(user)=>{
  ensureRPBIOClient(user).then(()=>window.setTimeout(attachDirectPortalLinks,120)).catch((error)=>console.error('[NINEWORKS Admin] RPBIO client seed failed',error));
});
window.setTimeout(observeClientList,0);
window.setTimeout(observeClientList,500);
window.addEventListener('nw-admin-panel',(event)=>{if(event.detail?.panel==='clients') observeClientList()});

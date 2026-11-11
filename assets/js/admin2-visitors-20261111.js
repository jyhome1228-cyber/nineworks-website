import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {collection,onSnapshot} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {auth,db,firebaseConfigReady,firebaseInitError} from './firebase-client.js';
const ADMIN='info@9works.kr';
let visits=[],unsub=null;
const byId=id=>document.getElementById(id);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateKey=d=>{const p=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Seoul'}).formatToParts(d);const o=Object.fromEntries(p.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return o.year+'-'+o.month+'-'+o.day};
const when=x=>x?.createdAt?.toDate?.()||null;
const stamp=d=>d?new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Seoul'}).format(d):'시간 기록 중';
const homepage=x=>{try{const p=new URL(x.firstPath||'/',location.origin).pathname;return p==='/'||p==='/index.html'}catch{return false}};
function daysBack(n){const now=new Date();const result=[];for(let i=n-1;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);result.push(dateKey(d))}return result}
function filtered(){const q=(byId('mainSearch')?.value||'').trim().toLowerCase();return visits.filter(v=>[v.date,v.referrer,v.firstPath].some(s=>String(s||'').toLowerCase().includes(q)))}
function render(){
 if(!byId('mainLogList'))return;
 const seven=new Set(daysBack(7)),thirty=new Set(daysBack(30));
 byId('mainToday').textContent=visits.filter(v=>v.date===dateKey(new Date())).length;
 byId('mainSeven').textContent=visits.filter(v=>seven.has(v.date)).length;
 byId('mainThirty').textContent=visits.filter(v=>thirty.has(v.date)).length;
 byId('mainAll').textContent=visits.length;
 const days=daysBack(14),counts=days.map(d=>visits.filter(v=>v.date===d).length),max=Math.max(1,...counts);
 byId('mainDaily').innerHTML=days.map((d,i)=>'<div class="day" title="'+safe(d)+' · '+counts[i]+'명"><div class="bar-zone"><div class="bar" style="height:'+Math.max(2,100*counts[i]/max)+'%"></div></div><div class="number">'+counts[i]+'</div><div class="label">'+safe(d.slice(5))+'</div></div>').join('');
 const rows=filtered().sort((a,b)=>(when(b)?.getTime()||0)-(when(a)?.getTime()||0));
 byId('mainCount').textContent='방문 기록 '+rows.length+'건';
 byId('mainLogList').innerHTML=rows.length?rows.slice(0,200).map(v=>
  '<div class="row" style="grid-template-columns:minmax(130px,1fr) minmax(0,1fr) minmax(100px,.6fr)"><div><strong>'+safe(stamp(when(v)))+'</strong><p>'+safe(v.date||'-')+'</p></div><div><p>유입 출처: '+safe(v.referrer||'직접 접속 / 확인 불가')+'</p><p>첫 진입: '+safe(v.firstPath||'/')+'</p></div><div><p>브라우저 ID: '+safe(String(v.visitorId||'').slice(0,8))+'…</p></div></div>'
 ).join(''):'<p class="empty">기록된 방문이 없습니다.</p>';
}
byId('mainSearch')?.addEventListener('input',render);
byId('mainExport')?.addEventListener('click',()=>{
 const headers=['방문 시각','기준 날짜','유입 출처','첫 진입 경로','익명 브라우저 식별자'];
 const csvCell=x=>{const t=String(x??'').replace(/^([=+@-])/,"'$1");return '"'+t.replace(/"/g,'""')+'"'};
 const rows=filtered().map(v=>[stamp(when(v)),v.date,v.referrer||'',v.firstPath||'',v.visitorId||'']);
 const data='\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='nineworks-main-visitors-'+dateKey(new Date())+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
function stop(){if(unsub)unsub();unsub=null;visits=[];render()}
if(firebaseConfigReady&&!firebaseInitError&&auth&&db){
 onAuthStateChanged(auth,user=>{
  if(user?.email?.trim().toLowerCase()!==ADMIN){stop();return}
  if(unsub)return;
  unsub=onSnapshot(collection(db,'dailyVisitors'),snapshot=>{
   visits=snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(homepage);
   render();
  },error=>{console.error('[NINEWORKS Admin 2] visitor log unavailable',error);byId('mainLogList').innerHTML='<p class="error">방문 로그를 불러올 수 없습니다. Firebase 접근 권한을 확인해 주세요.</p>'});
 });
}else{byId('mainLogList').innerHTML='<p class="error">Firebase 연결 설정을 확인해 주세요.</p>'}

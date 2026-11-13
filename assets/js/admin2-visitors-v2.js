import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {collection,onSnapshot} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {auth,db,firebaseConfigReady,firebaseInitError} from './firebase-client.js';

const ADMIN='info@9works.kr';
const $=id=>document.getElementById(id);
const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const dateKey=d=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);const p=Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day};
const formatTime=value=>{const d=value?.toDate?.()||null;return d?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d):'시간 기록 중'};
const pastDays=n=>{const dates=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-i);dates.push(dateKey(d))}return dates};
const data={site:[],home:[],pv:[]};
const errors={};
let unsubs=[];
const options={site:'전체 사이트 UV',home:'메인페이지 UV',pv:'전체 PV',homePv:'메인 PV'};
const rows=metric=>metric==='homePv'?data.pv.filter(x=>x.isHome===true||x.path==='/'):data[metric]||[];
const sortByTime=(a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0);
function breakdown(items,field,nodeId){
 const m=new Map();
 for(const item of items){const key=String(item[field]|| (field==='referrer'?'직접 접속 / 확인 불가':'/')).slice(0,180);m.set(key,(m.get(key)||0)+1)}
 const top=[...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10);
 $(nodeId).innerHTML=top.length?top.map(([label,n])=>'<div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #292929;font-size:12px"><span style="overflow-wrap:anywhere">'+escapeHTML(label)+'</span><strong>'+n+'</strong></div>').join(''):'<p class="empty">기록 없음</p>';
}
function render(){
 if(!$('mainLogList'))return;
 const today=dateKey(new Date()),days30=new Set(pastDays(30));
 $('trafficSiteToday').textContent=data.site.filter(x=>x.date===today).length;
 $('trafficHomeToday').textContent=data.home.filter(x=>x.date===today).length;
 $('trafficPvToday').textContent=data.pv.filter(x=>x.date===today).length;
 $('trafficSiteThirty').textContent=data.site.filter(x=>days30.has(x.date)).length;
 const metric=$('trafficMetric').value,range=Number($('trafficRange').value),days=pastDays(range),items=rows(metric);
 const counts=days.map(day=>items.filter(i=>i.date===day).length),top=Math.max(1,...counts);
 $('mainDaily').innerHTML=days.map((day,i)=>'<div class="day" title="'+escapeHTML(day)+' · '+counts[i]+'건"><div class="bar-zone"><div class="bar" style="height:'+Math.max(2,100*counts[i]/top)+'%"></div></div><div class="number">'+counts[i]+'</div><div class="label">'+escapeHTML(day.slice(5))+'</div></div>').join('');
 $('mainDaily').style.gridTemplateColumns='repeat('+range+',minmax(25px,1fr))';
 $('mainDaily').style.overflowX='auto';
 const known=Object.keys(errors).filter(key=>errors[key]);
 $('trafficQuality').textContent=known.length?'일부 통계를 불러오지 못했습니다: '+known.join(', ')+'. Firebase 읽기 권한을 확인해 주세요.':'방문 통계는 브라우저 기준 추정치입니다. 신규 PV 기록은 추적 코드 적용 이후부터 집계됩니다.';
 breakdown(data.pv.filter(i=>days30.has(i.date)),'referrer','trafficReferrers');
 breakdown(data.pv.filter(i=>days30.has(i.date)),'path','trafficPages');
 const logType=$('trafficLogType').value,query=$('mainSearch').value.trim().toLowerCase();
 const listing=rows(logType).filter(x=>[x.date,x.path,x.firstPath,x.referrer].some(v=>String(v||'').toLowerCase().includes(query))).sort(sortByTime);
 $('mainCount').textContent='표시 '+Math.min(listing.length,300)+'건 / 검색 결과 '+listing.length+'건';
 $('mainLogList').innerHTML=listing.length?listing.slice(0,300).map(i=>{
  const where=i.path||i.firstPath||'/';
  return '<div class="row" style="grid-template-columns:minmax(135px,1fr) minmax(0,1fr) minmax(120px,.6fr)"><div><strong>'+escapeHTML(formatTime(i.createdAt))+'</strong><p>'+escapeHTML(i.date||'')+'</p></div><div><p>페이지: '+escapeHTML(where)+'</p><p>유입: '+escapeHTML(i.referrer||'직접 접속 / 확인 불가')+'</p></div><div><p>'+escapeHTML(logType==='pv'?'페이지 조회':'고유 브라우저 방문')+'</p></div></div>';
 }).join(''):'<p class="empty">해당 조건에 방문 기록이 없습니다.</p>';
}
for(const name of ['trafficMetric','trafficRange','trafficLogType']) $(name)?.addEventListener('change',render);
$('mainSearch')?.addEventListener('input',render);
$('mainExport')?.addEventListener('click',()=>{
 const kind=$('trafficLogType').value;
 const q=$('mainSearch').value.trim().toLowerCase();
 const selected=rows(kind).filter(x=>[x.date,x.path,x.firstPath,x.referrer].some(v=>String(v||'').toLowerCase().includes(q)));
 const columns=['방문일','기록 시각','페이지','유입 출처','유형'];
 const csvCell=x=>{let s=String(x??'');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 const content='\uFEFF'+[columns,...selected.map(x=>[x.date,formatTime(x.createdAt),x.path||x.firstPath||'/',x.referrer||'',kind])].map(row=>row.map(csvCell).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='nineworks-traffic-'+kind+'-'+dateKey(new Date())+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
function stop(){unsubs.forEach(unsub=>unsub());unsubs=[];data.site=[];data.home=[];data.pv=[];render()}
if(firebaseConfigReady&&!firebaseInitError&&auth&&db){
 onAuthStateChanged(auth,user=>{
  if(user?.email?.trim().toLowerCase()!==ADMIN){stop();return}
  if(unsubs.length)return;
  for(const [collectionName,key] of [['dailyVisitors','site'],['mainDailyVisitors','home'],['pageViews','pv']]){
   const unsub=onSnapshot(collection(db,collectionName),snap=>{
     data[key]=snap.docs.map(d=>({id:d.id,...d.data()}));
     delete errors[key];render();
   },err=>{
     errors[key]=true;console.error('[NINEWORKS traffic] collection read failed',collectionName,err);render();
   });
   unsubs.push(unsub);
  }
 });
}else{$('trafficQuality').textContent='Firebase 연결 설정을 확인해 주세요.'}

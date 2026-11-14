import { onAuthStateChanged,signInWithEmailAndPassword,signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection,onSnapshot,doc,updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth,db,firebaseConfigReady,firebaseInitError } from './firebase-client.js';
const ADMIN='info@9works.kr';
const BUSINESS='2027 PROJECT PREREGISTRATION';
const CAREER='2027 DESIGNER APPLICATION';
const FREELANCER='FREELANCER PARTNER REGISTRATION';
const BRAND_CONSULTING='BRAND CONSULTING APPLICATION';
const DESIGNER_MENTORING='DESIGNER MENTORING APPLICATION';
let entries=[],unsub=null,tab='overview';
const el=(id)=>document.getElementById(id);
const esc=(value='')=>String(value).replace(/[&<>"']/g,(m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const category=(item)=>item.service===BUSINESS?'business':item.service===CAREER?'career':item.service===FREELANCER?'freelancer':[BRAND_CONSULTING,DESIGNER_MENTORING].includes(item.service)?'consulting':'other';
const dateOf=(item)=>{const v=item.createdAt;const d=v?.toDate?v.toDate():v?new Date(v):null;return d&&!isNaN(d.getTime())?d:null};
const dateKey=(d)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const format=(d)=>d?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d):'등록 처리 중';
const today=()=>dateKey(new Date());
function chosen(){return entries.filter(i=>!i.trashedAt&&(tab==='overview'||category(i)===tab))}
function stats(){
 const active=entries.filter(i=>!i.trashedAt),day=today();
 for(const type of ['business','career','freelancer','consulting']){
 const group=active.filter(i=>category(i)===type);
 const todayStat=document.querySelector('[data-stat="'+type+'Today"]');
 if(todayStat)todayStat.textContent=group.filter(i=>dateOf(i)&&dateKey(dateOf(i))===day).length;
 document.querySelector('[data-stat="'+type+'All"]').textContent=group.length;
 }
}
function chart(){
 const type=el('dailyType').value;
 const dateList=[];
 for(let days=13;days>=0;days--){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-days);dateList.push(dateKey(d))}
 const counts=dateList.map(day=>entries.filter(i=>!i.trashedAt&&(type==='all'||category(i)===type)&&dateOf(i)&&dateKey(dateOf(i))===day).length);
 const top=Math.max(1,...counts);
 el('dailyChart').innerHTML=dateList.map((day,i)=>'<div class="day" title="'+day+': '+counts[i]+'건"><div class="bar-zone"><div class="bar" style="height:'+Math.max(2,counts[i]/top*100)+'%"></div></div><div class="number">'+counts[i]+'</div><div class="label">'+day.slice(5)+'</div></div>').join('');
}
function render(){
 stats();chart();
 const terms=el('search').value.trim().toLowerCase();
 const selected=chosen().filter(i=>[i.company,i.contactName,i.email,i.phone,i.projectType,i.industry,i.message].some(v=>String(v||'').toLowerCase().includes(terms))).sort((a,b)=>(dateOf(b)?.getTime()||0)-(dateOf(a)?.getTime()||0));
 el('resultCount').textContent=selected.length+'건';
 if(!selected.length){el('applicationList').innerHTML='<p class="empty">접수 내역이 없습니다.</p>';return}
 el('applicationList').innerHTML=selected.map(i=>{
 const type=category(i)==='business'?'기업 신청':category(i)==='career'?'채용 신청':category(i)==='freelancer'?'협력 프리랜서':i.service===BRAND_CONSULTING?'브랜드 컨설팅':'디자이너 멘토링';
 const info=category(i)==='business'?'회사 업태: '+(i.industry||i.projectType||'-'):category(i)==='freelancer'?'협업 분야: '+(i.projectType||'-')+' / '+(i.region||'지역 미입력'):category(i)==='consulting'?'현재 단계: '+(i.projectType||'-'):'자기소개';
 const msg=category(i)==='career'?i.message||'-':category(i)==='freelancer'?'업무 시작 가능일: '+(i.availableFrom||'미입력')+' / 대면 미팅: '+(i.meetingAvailable?'가능':'미확인')+' / '+(i.message||'-'):category(i)==='consulting'?'신청 내용: '+(i.message||'-'):'문의사항: '+(i.message||'-');
 const current=['new','open','done'].includes(i.status)?i.status:'new';
 return '<article class="row"><div><strong>'+esc(i.company||i.contactName||'-')+'</strong><p>'+esc(type)+' · '+esc(i.contactName||'-')+'</p><p class="date">'+esc(format(dateOf(i)))+'</p></div><div><p>'+esc(i.email||'-')+'</p><p>'+esc(i.phone||'')+'</p></div><div><strong>'+esc(info)+'</strong><p>'+esc(msg)+'</p></div><div><select data-change-id="'+esc(i.id)+'" aria-label="진행 상태"><option value="new" '+(current==='new'?'selected':'')+'>신규</option><option value="open" '+(current==='open'?'selected':'')+'>검토 중</option><option value="done" '+(current==='done'?'selected':'')+'>완료</option></select></div><div class="detail">'+esc(category(i)==='career'?'자기소개\n'+(i.message||''):'등록 정보\n'+(i.details||''))+'</div></article>'
 }).join('');
}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{
 tab=b.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));
 el('pageTitle').textContent=tab==='overview'?'신청 관리 대시보드':tab==='business'?'기업 신청 관리':tab==='career'?'채용 신청 관리':tab==='freelancer'?'협력 프리랜서 관리':tab==='consulting'?'컨설팅·멘토링 신청 관리':'메인 방문 로그';
 el('listTitle').textContent=tab==='overview'?'최근 신청 내역':tab==='business'?'기업 신청 목록':tab==='career'?'채용 신청 목록':tab==='freelancer'?'협력 프리랜서 목록':tab==='consulting'?'컨설팅·멘토링 신청 목록':'방문 로그';
 el('dailyBox').hidden=tab!=='overview';
 el('visitorBox').hidden=tab!=='visitors';
 el('applicationList').closest('.box').hidden=tab==='visitors';
 document.querySelector('.main > .stats').hidden=tab==='visitors';
 window.dispatchEvent(new CustomEvent('nw-admin2-tab',{detail:{tab}}));
 if(tab!=='visitors')render();
}));
el('search').addEventListener('input',render);
el('dailyType').addEventListener('change',chart);
el('applicationList').addEventListener('change',async(e)=>{
 const s=e.target.closest('[data-change-id]');if(!s)return;
 const item=entries.find(x=>x.id===s.dataset.changeId);if(!item)return;
 s.disabled=true;
 try{await updateDoc(doc(db,'inquiries',item.id),{status:s.value})}
 catch(error){console.error(error);alert('상태 저장에 실패했습니다.');s.value=item.status||'new'}
 finally{s.disabled=false}
});
el('download').addEventListener('click',()=>{
 const headers=['구분','접수일','이름','회사명','연락처','이메일','회사 업태/지원 분야','문의사항/자기소개','포트폴리오','활동 지역','업무 시작 가능일','대면 미팅','상태'];
 const rows=chosen().map(i=>[category(i)==='business'?'기업':category(i)==='career'?'채용':category(i)==='freelancer'?'협력 프리랜서':i.service===BRAND_CONSULTING?'브랜드 컨설팅':'디자이너 멘토링',format(dateOf(i)),i.contactName||'',i.company||'',i.phone||'',i.email||'',(i.industry||i.projectType||''),i.message||'',i.portfolioUrl||'',i.region||'',i.availableFrom||'',i.meetingAvailable?'가능':'미확인',i.status||'new']);
 // Neutralize spreadsheet formula injection while preserving UTF-8 and quotes.
 const csvCell=v=>{const s=String(v).replace(/^([=+@-])/,"'$1");return '"'+s.replace(/"/g,'""')+'"'};
 const blob=new Blob(['\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nineworks-admin2-'+dateKey(new Date())+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
function clear(){if(unsub)unsub();unsub=null;entries=[];el('adminShell').hidden=true;el('loginSection').hidden=false}
if(!firebaseConfigReady||firebaseInitError||!auth||!db){el('loginError').textContent='Firebase 연결 설정이 필요합니다.'}
else{
 el('loginForm').addEventListener('submit',async(event)=>{
 event.preventDefault();el('loginError').textContent='';
 if(el('adminEmail').value.trim().toLowerCase()!==ADMIN){el('loginError').textContent='허용된 관리자 계정으로 로그인해 주세요.';return}
 try{await signInWithEmailAndPassword(auth,el('adminEmail').value.trim(),el('adminPassword').value)}
 catch(e){console.error(e);el('loginError').textContent='로그인에 실패했습니다. 계정 정보를 확인해 주세요.'}
 });
 el('signOut').addEventListener('click',()=>signOut(auth));
 onAuthStateChanged(auth,user=>{
 if(user?.email?.trim().toLowerCase()!==ADMIN){clear();return}
 el('loginSection').hidden=true;el('adminShell').hidden=false;el('adminPassword').value='';
 if(unsub)return;
 unsub=onSnapshot(collection(db,'inquiries'),snapshot=>{
 entries=snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(i=>[BUSINESS,CAREER,FREELANCER,BRAND_CONSULTING,DESIGNER_MENTORING].includes(i.service));
 el('lastSync').textContent='최근 동기화 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
 render();
 },err=>{console.error(err);el('applicationList').innerHTML='<p class="error">접수 기록을 읽을 수 없습니다. Firebase 접근 권한을 확인해 주세요.</p>'});
 });
}

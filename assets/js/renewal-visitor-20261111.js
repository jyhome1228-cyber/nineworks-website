import { doc,setDoc,serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db,firebaseConfigReady,firebaseInitError } from './firebase-client.js';
// Keep the existing site-wide one-browser-per-day counting convention.
// Main entry is shown in Admin 02 only when firstPath is '/' or '/index.html'.
function dateKey(){
  const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const o=Object.fromEntries(p.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return o.year+'-'+o.month+'-'+o.day;
}
function storageGet(k){try{return localStorage.getItem(k)}catch{return null}}
function storageSet(k,v){try{localStorage.setItem(k,v)}catch{}}
async function track(){
  if(!firebaseConfigReady||firebaseInitError||!db)return;
  const date=dateKey(),marker='nw_visited_'+date;
  if(storageGet(marker)==='1')return;
  let visitorId=storageGet('nw_visitor_id');
  if(!visitorId){
    visitorId=globalThis.crypto?.randomUUID?.()||'nw-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
    storageSet('nw_visitor_id',visitorId);
  }
  try{
    const referrer=document.referrer?new URL(document.referrer).hostname.slice(0,180):'';
    await setDoc(doc(db,'dailyVisitors',date+'_'+visitorId),{
      date,visitorId,firstPath:location.pathname+location.search,referrer,createdAt:serverTimestamp()
    });
    storageSet(marker,'1');
  }catch(err){console.warn('[NINEWORKS] main visitor tracking unavailable',err)}
}
track();

import {doc,setDoc,addDoc,collection,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {db,firebaseConfigReady,firebaseInitError} from './firebase-client.js';

/* One module for public-page traffic, with a shared anonymous browser identifier.
 * dailyVisitors: legacy site-wide unique browsers
 * mainDailyVisitors: distinct daily home visitors (even when another page was visited first)
 * pageViews: each page load, including repeats. Admin pages are excluded.
 */
if(!window.__NW_TRAFFIC_V2__){
  window.__NW_TRAFFIC_V2__=true;
  const isPrivate=/^\/(?:admin(?:2)?(?:\.html|\/|$)|login(?:\.html|\/|$))/i.test(location.pathname)
    || document.body?.classList.contains('admin-page');
  if(!isPrivate&&firebaseConfigReady&&!firebaseInitError&&db){
    const key=()=>{
      const bits=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const val=Object.fromEntries(bits.filter(v=>v.type!=='literal').map(v=>[v.type,v.value]));
      return val.year+'-'+val.month+'-'+val.day;
    };
    const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
    const put=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
    let visitorId=get('nw_visitor_id');
    if(!visitorId){
      visitorId=crypto?.randomUUID?.()||'v-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
      put('nw_visitor_id',visitorId);
    }
    const date=key();
    const path=location.pathname==='/'||location.pathname==='/index.html'?'/':location.pathname.slice(0,240);
    const isHome=path==='/';
    const referrer=(()=>{try{return document.referrer?new URL(document.referrer).hostname.slice(0,180):''}catch{return ''}})();
    const base={date,visitorId,referrer};
    const once=async (collectionName,storageKey,id,fields)=>{
      if(get(storageKey)==='1')return;
      try{
        await setDoc(doc(db,collectionName,id),{...base,...fields,createdAt:serverTimestamp()});
        put(storageKey,'1');
      }catch(error){console.warn('[NINEWORKS traffic] unique visit not saved',collectionName,error)}
    };
    // Preserve the existing sitewide data and its ID convention, including prior records.
    void once('dailyVisitors','nw_visited_'+date,date+'_'+visitorId,{firstPath:path});
    if(isHome){
      void once('mainDailyVisitors','nw_home_visited_'+date,date+'_'+visitorId,{firstPath:'/'});
    }
    // Page view collection has no personal information and is separate from unique visitors.
    void addDoc(collection(db,'pageViews'),{
      date,path,referrer,isHome,createdAt:serverTimestamp()
    }).catch(error=>console.warn('[NINEWORKS traffic] page view not saved',error));
  }
}

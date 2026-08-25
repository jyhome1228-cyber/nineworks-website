import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { addDoc, collection, deleteDoc, deleteField, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const SERVICE_META = [
  ['CONTACT','메인 컨택'],['EDITORIAL PRINT','인쇄물 제작'],['PACKAGE PRODUCTION','패키지 양산'],['PACKAGE SAMPLE','샘플 제작'],['PRINT PARTNER','파트너 요청'],['MEMBERSHIP','멤버십'],['DEVELOP','웹 · 개발'],['CLIENT REGISTRATION','클라이언트 등록'],['PROJECT','프로젝트 문의'],['OTHER','기타']
];
const SERVICE_LABEL = new Map(SERVICE_META);
let allItems = [];
let started = false;
let unsubscribe = null;
let activeService = 'ALL';
let activeStatus = 'all';
let searchTerm = '';

const escapeHTML = (value='') => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#039;');
const normalizeStatus = (value='') => ['new','open','done'].includes(value) ? value : 'new';
const isRecruit = (item) => String(item?.service || '').toUpperCase().includes('RECRUIT') || String(item?.source || '').toLowerCase().includes('/recruit');
const isMemberFallback = (item) => { const s=String(item?.source||'').toLowerCase(); return s.includes('join.html') || s.includes('register.html'); };
const isTrashed = (item) => Boolean(item?.trashedAt);
const activeInquiries = () => allItems.filter((item) => !isTrashed(item) && !isRecruit(item) && !isMemberFallback(item));
const serviceKeyFor = (item) => {
  const raw=String(item?.service||'').trim().toUpperCase();
  if (SERVICE_LABEL.has(raw)) return raw;
  const source=String(item?.source||'').toLowerCase();
  if(source.includes('print-partner')) return 'PRINT PARTNER';
  if(source.includes('package-sample')) return 'PACKAGE SAMPLE';
  if(source.includes('package-production')) return 'PACKAGE PRODUCTION';
  if(source.includes('print-editorial')) return 'EDITORIAL PRINT';
  if(source.includes('membership')) return 'MEMBERSHIP';
  if(source.includes('client-register')) return 'CLIENT REGISTRATION';
  if(source.includes('develop')) return 'DEVELOP';
  if(source.includes('contact')) return 'CONTACT';
  return raw==='PROJECT' ? 'PROJECT' : 'OTHER';
};
const timestampMs = (value) => { if(!value) return 0; if(typeof value.toMillis==='function') return value.toMillis(); if(typeof value.toDate==='function') return value.toDate().getTime(); const d=new Date(value); return Number.isNaN(d.getTime())?0:d.getTime(); };
const formatDate = (value) => { const ms=timestampMs(value); if(!ms) return '-'; return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'2-digit',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(ms)); };

const loadStyle = () => {
  if(document.querySelector('link[data-inquiry-crm-style]')) return;
  const link=document.createElement('link'); link.rel='stylesheet'; link.href='assets/css/admin-inquiry-crm-20260825.css?v=20260825-1'; link.dataset.inquiryCrmStyle='true'; document.head.appendChild(link);
};

const renumberNav = () => {
  const order=['dashboard','inquiry','recruits','members','partners','visitors','trash'];
  order.forEach((key,index)=>{ const n=document.querySelector(`[data-admin-tab="${key}"] span`); if(n) n.textContent=String(index+1).padStart(2,'0'); });
};

const ensureUI = () => {
  const inquiryPanel=document.querySelector('[data-admin-panel="inquiry"]');
  const head=inquiryPanel?.querySelector('.admin-section-head');
  if(head && !head.querySelector('[data-inquiry-crm-actions]')){
    const actions=document.createElement('div'); actions.className='admin-inquiry-crm-actions'; actions.dataset.inquiryCrmActions='true';
    actions.innerHTML='<button type="button" data-manual-inquiry-open>외부 문의 등록 +</button><button type="button" data-open-trash>휴지통 보기</button>';
    head.appendChild(actions);
  }
  const nav=document.querySelector('.admin-nav');
  if(nav && !nav.querySelector('[data-admin-tab="trash"]')){
    const button=document.createElement('button'); button.className='admin-nav__item'; button.type='button'; button.dataset.adminTab='trash'; button.innerHTML='<span>07</span>Trash'; nav.appendChild(button);
  }
  if(!document.querySelector('[data-admin-panel="trash"]')){
    const panel=document.createElement('section'); panel.className='admin-panel admin-trash-panel'; panel.dataset.adminPanel='trash';
    panel.innerHTML='<div class="admin-section-head"><div><span class="admin-label">Inquiry Archive</span><h2>Trash</h2><p>삭제한 문의와 지원서는 바로 지워지지 않고 이곳으로 이동합니다. 필요하면 복구하거나 영구 삭제할 수 있습니다.</p></div><span class="admin-trash-count" data-trash-count>0 ITEMS</span></div><div class="admin-trash-list" data-trash-list></div>';
    document.querySelector('.admin-main')?.appendChild(panel);
  }
  if(!document.querySelector('[data-inquiry-crm-modal]')){
    const modal=document.createElement('div'); modal.className='admin-inquiry-crm-modal'; modal.dataset.inquiryCrmModal='true'; modal.hidden=true;
    modal.innerHTML=`<div class="admin-inquiry-crm-dialog"><div class="admin-inquiry-crm-head"><div><strong>외부 문의 직접 등록</strong><p>전화, 이메일, 소개 등 사이트 밖에서 받은 문의를 어드민에 직접 기록합니다.</p></div><button class="admin-inquiry-crm-close" type="button" data-manual-inquiry-close>×</button></div><form class="admin-inquiry-crm-form" data-manual-inquiry-form><div class="admin-inquiry-crm-grid">
      <div class="admin-inquiry-crm-field"><label>유입 경로 *</label><select name="channel" required><option value="전화">전화</option><option value="이메일">이메일</option><option value="카카오톡">카카오톡</option><option value="소개">소개</option><option value="인스타그램/DM">인스타그램 / DM</option><option value="기타">기타</option></select></div>
      <div class="admin-inquiry-crm-field"><label>문의 유형 *</label><select name="service" required>${SERVICE_META.map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></div>
      <div class="admin-inquiry-crm-field"><label>회사 / 브랜드 *</label><input name="company" required maxlength="200"></div>
      <div class="admin-inquiry-crm-field"><label>담당자명</label><input name="contactName" maxlength="120"></div>
      <div class="admin-inquiry-crm-field"><label>이메일</label><input name="email" type="email" maxlength="240"></div>
      <div class="admin-inquiry-crm-field"><label>연락처</label><input name="phone" type="tel" maxlength="80"></div>
      <div class="admin-inquiry-crm-field"><label>프로젝트명</label><input name="projectName" maxlength="200"></div>
      <div class="admin-inquiry-crm-field"><label>작업 유형</label><input name="projectType" maxlength="500" placeholder="예: Branding, Package"></div>
      <div class="admin-inquiry-crm-field admin-inquiry-crm-field--wide"><label>문의 / 요청 내용 *</label><textarea name="message" required maxlength="3000" placeholder="받은 문의 내용, 일정, 예산, 요청사항 등을 기록하세요."></textarea></div>
    </div><div class="admin-inquiry-crm-footer"><button type="button" data-manual-inquiry-close>취소</button><button type="submit">문의 등록</button></div><p class="admin-inquiry-crm-note" data-manual-inquiry-note></p></form></div>`;
    document.body.appendChild(modal);
  }
  renumberNav(); window.setTimeout(renumberNav,300); window.setTimeout(renumberNav,1000);
};

const inquiryRow = (item) => {
  const status=normalizeStatus(item.status); const company=item.company||item.projectName||'회사명 미입력'; const contact=item.contactName||'담당자 미입력'; const detail=item.details||item.message||'상세 내용 없음';
  return `<article class="admin-inquiry-row"><div class="admin-inquiry-row__top"><div class="admin-inquiry-row__name"><strong>${escapeHTML(company)}</strong><span>${escapeHTML(contact)} · ${escapeHTML(formatDate(item.createdAt))}</span></div><div class="admin-inquiry-row__service"><span class="admin-service-badge">${escapeHTML(SERVICE_LABEL.get(serviceKeyFor(item))||'기타')}</span><span>${escapeHTML(item.source||'-')}</span></div><div class="admin-inquiry-row__contact">${escapeHTML(item.email||'-')}<br>${escapeHTML(item.phone||'-')}</div><select class="admin-inquiry-status" data-inquiry-status="${escapeHTML(item.id)}"><option value="new"${status==='new'?' selected':''}>NEW / 신규</option><option value="open"${status==='open'?' selected':''}>OPEN / 진행</option><option value="done"${status==='done'?' selected':''}>DONE / 완료</option></select></div><details><summary>문의 상세 내용 보기</summary><pre>${escapeHTML(detail)}</pre></details><button class="admin-inquiry-trash-button" type="button" data-inquiry-trash="${escapeHTML(item.id)}">휴지통으로 이동</button></article>`;
};
const recentRow = (item) => `<article class="admin-inquiry-row"><div class="admin-inquiry-row__top"><div class="admin-inquiry-row__name"><strong>${escapeHTML(item.company||item.projectName||'회사명 미입력')}</strong><span>${escapeHTML(item.contactName||'담당자 미입력')} · ${escapeHTML(formatDate(item.createdAt))}</span></div><div class="admin-inquiry-row__service"><span class="admin-service-badge">${escapeHTML(SERVICE_LABEL.get(serviceKeyFor(item))||'기타')}</span><span>${escapeHTML(item.source||'-')}</span></div><div class="admin-inquiry-row__contact">${escapeHTML(item.email||'-')}<br>${escapeHTML(item.phone||'-')}</div><span class="admin-service-badge">${normalizeStatus(item.status).toUpperCase()}</span></div></article>`;

const filteredActive = () => activeInquiries().filter((item)=>{
  const serviceMatch=activeService==='ALL'||serviceKeyFor(item)===activeService||(activeService==='OTHER'&&['OTHER','PROJECT'].includes(serviceKeyFor(item)));
  const statusMatch=activeStatus==='all'||normalizeStatus(item.status)===activeStatus;
  if(!serviceMatch||!statusMatch) return false;
  if(!searchTerm) return true;
  return [item.company,item.contactName,item.email,item.phone,item.projectName,item.projectType,item.message,item.details,item.source].join(' ').toLowerCase().includes(searchTerm);
});

const renderActive = () => {
  const items=activeInquiries();
  const counts=items.reduce((a,i)=>{a[normalizeStatus(i.status)]+=1;return a;},{new:0,open:0,done:0});
  document.querySelectorAll('[data-status-summary]').forEach((card)=>{ const s=card.querySelector('strong'); if(s) s.textContent=String(counts[card.dataset.statusSummary]||0); });
  const serviceCounts=new Map(); items.forEach((i)=>serviceCounts.set(serviceKeyFor(i),(serviceCounts.get(serviceKeyFor(i))||0)+1));
  const filterBox=document.querySelector('[data-inquiry-service-filters]');
  if(filterBox) filterBox.innerHTML=[`<button type="button" class="${activeService==='ALL'?'is-active':''}" data-inquiry-service-filter="ALL">전체 <b>${items.length}</b></button>`,...SERVICE_META.filter(([key])=>(serviceCounts.get(key)||0)>0||!['PROJECT','OTHER'].includes(key)).map(([key,label])=>`<button type="button" class="${activeService===key?'is-active':''}" data-inquiry-service-filter="${key}">${label} <b>${serviceCounts.get(key)||0}</b></button>`)].join('');
  document.querySelectorAll('[data-inquiry-status-filter]').forEach((b)=>b.classList.toggle('is-active',b.dataset.inquiryStatusFilter===activeStatus));
  const visible=filteredActive(); const list=document.querySelector('[data-inquiry-list]'); const total=document.querySelector('[data-inquiry-filter-total]');
  if(total) total.textContent=`${visible.length} ITEMS`; if(list) list.innerHTML=visible.length?visible.map(inquiryRow).join(''):'<div class="admin-empty-live">조건에 맞는 문의가 없습니다.</div>';
  const dashboardStats={'new-inquiries':items.filter(i=>normalizeStatus(i.status)==='new').length,'total-inquiries':items.length}; Object.entries(dashboardStats).forEach(([k,v])=>{const n=document.querySelector(`[data-stat="${k}"]`);if(n)n.textContent=String(v);});
  const recent=items.slice(0,5); const recentBox=document.querySelector('[data-dashboard-recent]'); const recentCount=document.querySelector('[data-dashboard-recent-count]'); if(recentCount)recentCount.textContent=`${recent.length} ITEMS`; if(recentBox)recentBox.innerHTML=recent.length?recent.map(recentRow).join(''):'<div class="admin-empty-live">아직 접수된 문의가 없습니다.</div>';
  const category=document.querySelector('[data-dashboard-categories]'); if(category){ category.innerHTML=SERVICE_META.filter(([key])=>!['PROJECT','OTHER'].includes(key)).map(([key,label])=>`<button class="admin-category-card" type="button" data-dashboard-service="${key}"><span>${label}</span><strong>${serviceCounts.get(key)||0}</strong><p>${items.filter(i=>serviceKeyFor(i)===key&&normalizeStatus(i.status)==='new').length?`신규 ${items.filter(i=>serviceKeyFor(i)===key&&normalizeStatus(i.status)==='new').length}건`:'문의 현황'}</p></button>`).join(''); }
  window.dispatchEvent(new CustomEvent('nw-admin-panel',{detail:{panel:'inquiry'}}));
};

const renderTrash = () => {
  const items=allItems.filter(isTrashed).sort((a,b)=>timestampMs(b.trashedAt)-timestampMs(a.trashedAt)); const box=document.querySelector('[data-trash-list]'); const count=document.querySelector('[data-trash-count]'); if(count)count.textContent=`${items.length} ITEMS`;
  if(!box)return; if(!items.length){box.innerHTML='<div class="admin-empty-live">휴지통이 비어 있습니다.</div>';return;}
  box.innerHTML=items.map((item)=>`<article class="admin-trash-row"><div class="admin-trash-row__top"><div><strong>${escapeHTML(item.company||item.projectName||item.contactName||'문의')}</strong><span>${escapeHTML(item.contactName||'')} · ${escapeHTML(formatDate(item.trashedAt))}</span></div><div><span>${isRecruit(item)?'RECRUIT':escapeHTML(SERVICE_LABEL.get(serviceKeyFor(item))||'기타')}</span><p>${escapeHTML(item.source||'-')}</p></div><div><span>${escapeHTML(item.email||'-')}</span><p>${escapeHTML(item.phone||'-')}</p></div><div class="admin-trash-row__actions"><button type="button" data-inquiry-restore="${escapeHTML(item.id)}">복구</button><button type="button" data-inquiry-delete="${escapeHTML(item.id)}">영구삭제</button></div></div><details><summary>내용 보기</summary><pre>${escapeHTML(item.details||item.message||'상세 내용 없음')}</pre></details></article>`).join('');
};

const decorateRecruits = () => {
  document.querySelectorAll('.admin-recruit-card').forEach((card)=>{ const select=card.querySelector('[data-recruit-status]'); if(!select)return; const item=allItems.find(i=>i.id===select.dataset.recruitStatus); if(item?.trashedAt){card.remove();return;} if(!card.querySelector('[data-inquiry-trash]')){ const b=document.createElement('button'); b.type='button'; b.className='admin-recruit-trash-button'; b.dataset.inquiryTrash=select.dataset.recruitStatus; b.textContent='휴지통으로 이동'; card.appendChild(b); } });
};
const refresh = () => { ensureUI(); renderActive(); renderTrash(); window.setTimeout(decorateRecruits,60); window.setTimeout(decorateRecruits,300); };

const openTrash = () => { document.querySelectorAll('[data-admin-tab]').forEach(t=>t.classList.toggle('is-active',t.dataset.adminTab==='trash')); document.querySelectorAll('[data-admin-panel]').forEach(p=>p.classList.toggle('is-active',p.dataset.adminPanel==='trash')); const title=document.querySelector('[data-admin-title]'); if(title)title.textContent='Trash'; history.replaceState?.(null,'','#trash'); renderTrash(); window.scrollTo({top:0,behavior:'auto'}); };
const openModal = () => { const m=document.querySelector('[data-inquiry-crm-modal]'); if(m)m.hidden=false; };
const closeModal = () => { const m=document.querySelector('[data-inquiry-crm-modal]'); if(m)m.hidden=true; };

const moveToTrash = async (id) => {
  const item=allItems.find(i=>i.id===id); if(!item)return; if(!window.confirm('이 항목을 휴지통으로 이동할까요?'))return;
  const patch={trashedAt:serverTimestamp(),trashedBy:ADMIN_EMAIL,updatedAt:serverTimestamp()};
  if(item.assignedPartnerEmail){patch.trashAssignedPartnerEmail=item.assignedPartnerEmail;patch.trashAssignedPartnerName=item.assignedPartnerName||'';patch.assignedPartnerEmail=deleteField();patch.assignedPartnerName=deleteField();patch.partnerAssignedAt=deleteField();}
  await updateDoc(doc(db,'inquiries',id),patch);
};
const restoreItem = async (id) => {
  const item=allItems.find(i=>i.id===id); if(!item)return; const patch={trashedAt:deleteField(),trashedBy:deleteField(),updatedAt:serverTimestamp(),trashAssignedPartnerEmail:deleteField(),trashAssignedPartnerName:deleteField()};
  if(item.trashAssignedPartnerEmail){patch.assignedPartnerEmail=item.trashAssignedPartnerEmail;patch.assignedPartnerName=item.trashAssignedPartnerName||'';patch.partnerAssignedAt=serverTimestamp();}
  await updateDoc(doc(db,'inquiries',id),patch);
};

const bind = () => {
  document.addEventListener('click',async(event)=>{
    if(event.target.closest('[data-manual-inquiry-open]')){openModal();return;}
    if(event.target.closest('[data-manual-inquiry-close]')||event.target.matches('[data-inquiry-crm-modal]')){closeModal();return;}
    if(event.target.closest('[data-open-trash],[data-admin-tab="trash"]')){openTrash();return;}
    const other=event.target.closest('[data-admin-tab]'); if(other&&other.dataset.adminTab!=='trash') document.querySelector('[data-admin-panel="trash"]')?.classList.remove('is-active');
    const s=event.target.closest('[data-inquiry-service-filter]'); if(s){activeService=s.dataset.inquiryServiceFilter||'ALL';window.setTimeout(renderActive,0);return;}
    const st=event.target.closest('[data-inquiry-status-filter],[data-status-summary]'); if(st){activeStatus=st.dataset.inquiryStatusFilter||st.dataset.statusSummary||'all';window.setTimeout(renderActive,0);return;}
    const dash=event.target.closest('[data-dashboard-service]'); if(dash){activeService=dash.dataset.dashboardService||'ALL';activeStatus='all';window.setTimeout(renderActive,0);return;}
    const trash=event.target.closest('[data-inquiry-trash]'); if(trash){try{await moveToTrash(trash.dataset.inquiryTrash);}catch(e){console.error(e);window.alert('휴지통 이동에 실패했습니다.');}return;}
    const restore=event.target.closest('[data-inquiry-restore]'); if(restore){try{await restoreItem(restore.dataset.inquiryRestore);}catch(e){console.error(e);window.alert('복구에 실패했습니다.');}return;}
    const del=event.target.closest('[data-inquiry-delete]'); if(del){if(!window.confirm('영구 삭제하면 복구할 수 없습니다. 정말 삭제할까요?'))return;try{await deleteDoc(doc(db,'inquiries',del.dataset.inquiryDelete));}catch(e){console.error(e);window.alert('영구 삭제에 실패했습니다.');}return;}
    if(event.target.closest('[data-admin-tab="recruits"]')) window.setTimeout(decorateRecruits,120);
  });
  document.querySelector('[data-inquiry-search]')?.addEventListener('input',(e)=>{searchTerm=String(e.target.value||'').trim().toLowerCase();window.setTimeout(renderActive,0);});
  document.addEventListener('submit',async(event)=>{const form=event.target.closest('[data-manual-inquiry-form]');if(!form)return;event.preventDefault();if(!form.reportValidity())return;const note=form.querySelector('[data-manual-inquiry-note]');const button=form.querySelector('button[type="submit"]');button.disabled=true;if(note){note.textContent='등록 중입니다.';note.className='admin-inquiry-crm-note';}try{const fd=new FormData(form);const channel=String(fd.get('channel')||'기타').trim();const message=String(fd.get('message')||'').trim();const details=[`유입 경로: ${channel}`,`회사 / 브랜드: ${String(fd.get('company')||'').trim()}`,`담당자명: ${String(fd.get('contactName')||'').trim()}`,`이메일: ${String(fd.get('email')||'').trim()}`,`연락처: ${String(fd.get('phone')||'').trim()}`,`프로젝트명: ${String(fd.get('projectName')||'').trim()}`,`작업 유형: ${String(fd.get('projectType')||'').trim()}`,`문의 내용: ${message}`].filter(line=>!line.endsWith(': ')).join('\n');await addDoc(collection(db,'inquiries'),{status:'new',source:`ADMIN / ${channel}`.slice(0,500),service:String(fd.get('service')||'OTHER').slice(0,160),company:String(fd.get('company')||'').trim().slice(0,200),contactName:String(fd.get('contactName')||'').trim().slice(0,120),email:String(fd.get('email')||'').trim().slice(0,240),phone:String(fd.get('phone')||'').trim().slice(0,80),projectName:String(fd.get('projectName')||'').trim().slice(0,200),projectType:String(fd.get('projectType')||'').trim().slice(0,500),message:message.slice(0,3000),details:details.slice(0,15000),pageTitle:'Admin Manual Inquiry',createdAt:serverTimestamp()});form.reset();if(note){note.textContent='문의가 등록되었습니다.';note.className='admin-inquiry-crm-note is-success';}window.setTimeout(closeModal,700);}catch(e){console.error(e);if(note){note.textContent='등록에 실패했습니다.';note.className='admin-inquiry-crm-note is-error';}}finally{button.disabled=false;}});
};

const start = () => { if(started)return;started=true;loadStyle();ensureUI();bind();unsubscribe?.();unsubscribe=onSnapshot(query(collection(db,'inquiries'),orderBy('createdAt','desc')),(snapshot)=>{allItems=snapshot.docs.map(d=>({id:d.id,...d.data()}));refresh();if(location.hash==='#trash')openTrash();},(error)=>console.error('[NINEWORKS Admin] inquiry CRM stream failed',error)); };

if(firebaseConfigReady&&auth&&db){onAuthStateChanged(auth,(user)=>{if(String(user?.email||'').toLowerCase()===ADMIN_EMAIL)start();});}

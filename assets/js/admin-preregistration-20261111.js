import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, onSnapshot, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const SERVICE = '2027 PROJECT PREREGISTRATION';
const ADMIN_EMAIL = 'info@9works.kr';
const list = document.querySelector('[data-pre-list]');
const search = document.querySelector('[data-pre-search]');
const exportButton = document.querySelector('[data-pre-export]');
let entries = [];
let unsubscribe = null;

const escapeHTML = (v = '') => String(v).replace(/[&<>"']/g, (ch) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
})[ch]);
const time = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('ko-KR', { timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit' }).format(date)
    : '기록 중';
};
function render() {
  if (!list) return;
  const active = entries.filter((item) => !item.trashedAt);
  const keyword = String(search?.value || '').trim().toLowerCase();
  const filtered = active.filter((item) => [
    item.company,item.contactName,item.email,item.projectType,item.details
  ].some((v) => String(v || '').toLowerCase().includes(keyword)));
  for (const key of ['total','new','done']) {
    const node = document.querySelector('[data-pre-stat="' + key + '"]');
    if (node) node.textContent = key === 'total' ? active.length :
      active.filter((i) => key === 'new' ? i.status === 'new' : i.status === 'done').length;
  }
  const count = document.querySelector('[data-pre-count]');
  if (count) count.textContent = filtered.length + ' ITEMS';
  if (!filtered.length) {
    list.innerHTML = '<div style="padding:28px;color:#888">등록 내역이 없습니다.</div>';
    return;
  }
  list.innerHTML = filtered.map((item) => `
    <article class="pre-row" data-id="${escapeHTML(item.id)}">
      <div class="pre-row-info">
        <div class="pre-row-title"><strong>${escapeHTML(item.company || '회사명 미입력')}</strong><span>${escapeHTML(time(item.createdAt))}</span></div>
        <p>${escapeHTML(item.contactName || '-')} · <a href="mailto:${encodeURIComponent(item.email || '')}">${escapeHTML(item.email || '-')}</a></p>
        <p>관심 분야: ${escapeHTML(item.projectType || '-')}</p>
      </div>
      <div class="pre-row-actions"><label>진행 상태
        <select data-pre-status="${escapeHTML(item.id)}">
          <option value="new" ${item.status === 'new' ? 'selected' : ''}>신규</option>
          <option value="open" ${item.status === 'open' ? 'selected' : ''}>검토 중</option>
          <option value="done" ${item.status === 'done' ? 'selected' : ''}>안내 완료</option>
        </select></label></div>
    </article>`).join('');
}
list?.addEventListener('change', async (event) => {
  const select = event.target.closest('[data-pre-status]');
  if (!select) return;
  const item = entries.find((v) => v.id === select.dataset.preStatus);
  if (!item) return;
  select.disabled = true;
  try {
    await updateDoc(doc(db,'inquiries',item.id), { status:select.value });
  } catch (error) {
    console.error('[NINEWORKS Admin] status update failed',error);
    alert('상태를 변경할 수 없습니다. 관리자 권한을 확인해 주세요.');
    select.value = item.status || 'new';
  } finally { select.disabled = false; }
});
search?.addEventListener('input',render);
exportButton?.addEventListener('click', () => {
  const cols = ['등록일','회사명','담당자','이메일','관심 분야','상태'];
  const rows = entries.filter((item) => !item.trashedAt).map((i) => [
    time(i.createdAt), i.company||'',i.contactName||'',i.email||'',i.projectType||'',i.status||'new'
  ]);
  const quote = (v) => '"' + String(v).replace(/"/g,'""') + '"';
  const csv = '\uFEFF' + [cols,...rows].map((row)=>row.map(quote).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a');a.href=url;a.download='nineworks-2027-preregistrations.csv';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});
function stop() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  entries = [];
  if (list) list.textContent='관리자 로그인 후 확인할 수 있습니다.';
}
if (firebaseConfigReady && !firebaseInitError && auth && db) {
  onAuthStateChanged(auth,(user)=>{
    if (String(user?.email||'').toLowerCase() !== ADMIN_EMAIL) { stop(); return; }
    if (unsubscribe) return;
    unsubscribe = onSnapshot(collection(db,'inquiries'),(snapshot)=>{
      entries = snapshot.docs.map((d)=>({id:d.id,...d.data()}))
        .filter((i)=>String(i.service||'').toUpperCase()===SERVICE)
        .sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      render();
    },(error)=>{
      console.error('[NINEWORKS Admin] preregistration load failed',error);
      if(list)list.textContent='등록 데이터를 불러오지 못했습니다. Firebase 접근 권한을 확인해 주세요.';
    });
  });
} else if(list){list.textContent='Firebase 설정을 확인해 주세요.'}

import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const form = document.getElementById('interestForm');
const status = document.getElementById('interestStatus');
const button = form?.querySelector('[type="submit"]');
const setStatus = (message, isError = false) => {
  if (!status) return;
  status.textContent = message;
  status.style.color = isError ? '#ffaaa9' : '#b3b3b3';
};
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!firebaseConfigReady || firebaseInitError || !db) {
      setStatus('등록 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.', true);
      return;
    }
    const fd = new FormData(form);
    const company = String(fd.get('company') || '').trim();
    const contactName = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const industry = String(fd.get('industry') || '').trim();
    const inquiry = String(fd.get('message') || '').trim();
    if (!company || !contactName || !email || !industry || !inquiry) {
      setStatus('필수 항목을 모두 입력해 주세요.', true);
      return;
    }
    button.disabled = true;
    button.textContent = '등록 중...';
    setStatus('등록 요청을 전송하고 있습니다.');
    try {
      await addDoc(collection(db, 'inquiries'), {
        service: '2027 PROJECT PREREGISTRATION',
        source: '/#2027-preregistration',
        status: 'new',
        company: company.slice(0, 200),
        contactName: contactName.slice(0, 120),
        email: email.slice(0, 240),
        phone: '',
        projectName: '2027년 신규 프로젝트 사전 등록',
        projectType: industry.slice(0, 200),
        industry: industry.slice(0, 200),
        message: inquiry.slice(0, 1000),
        details: '회사 업태: ' + industry.slice(0, 200) + '\n문의사항: ' + inquiry.slice(0, 1000) + '\n사전 등록 유형: 2027년 프로젝트\n개인정보 수집·이용: 동의',
        pageTitle: document.title.slice(0, 240),
        createdAt: serverTimestamp()
      });
      form.reset();
      button.textContent = '등록 완료';
      setStatus('사전 등록이 완료되었습니다. 2027년 프로젝트 접수 및 혜택 안내를 순차적으로 전달드리겠습니다.');
    } catch (error) {
      console.error('[NINEWORKS] preregistration failed', error);
      setStatus('등록에 실패했습니다. 잠시 후 다시 시도해 주세요.', true);
      button.disabled = false;
      button.textContent = '2027 프로젝트 사전 등록하기';
    }
  });
}

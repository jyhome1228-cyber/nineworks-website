import {addDoc,collection,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {db,firebaseConfigReady,firebaseInitError} from './firebase-client.js';
const form=document.getElementById('freelancerForm');
const status=document.getElementById('freelancerStatus');
const submit=form?.querySelector('button[type="submit"]');
const inform=(message,error=false)=>{if(status){status.textContent=message;status.style.color=error?'#ffaaaa':'#bcbcbc'}};
form?.addEventListener('submit',async(event)=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  if(!firebaseConfigReady||firebaseInitError||!db){inform('접수 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',true);return}
  const fd=new FormData(form);
  const name=String(fd.get('name')||'').trim();
  const email=String(fd.get('email')||'').trim();
  const phone=String(fd.get('phone')||'').trim();
  const field=String(fd.get('field')||'').trim();
  const portfolio=String(fd.get('portfolio')||'').trim();
  const introduction=String(fd.get('introduction')||'').trim();
  const region=String(fd.get('region')||'').trim();
  const availableFrom=String(fd.get('availableFrom')||'').trim();
  const meetingConsent=fd.get('meetingConsent')!==null;
  if(!name||!email||!phone||!field||!introduction||!['서울','경기','인천'].includes(region)||!/^\d{4}-\d{2}-\d{2}$/.test(availableFrom)||!meetingConsent){inform('필수 항목을 입력해 주세요.',true);return}
  submit.disabled=true;submit.textContent='등록 중...';inform('등록 요청을 전송하고 있습니다.');
  try{
    await addDoc(collection(db,'inquiries'),{
      service:'FREELANCER PARTNER REGISTRATION',
      source:'/#freelancer-registration',status:'new',
      company:'',contactName:name.slice(0,60),email:email.slice(0,150),phone:phone.slice(0,30),
      projectName:'협력 프리랜서 등록',projectType:field.slice(0,150),
      portfolioUrl:portfolio.slice(0,500),region,availableFrom,meetingAvailable:true,message:introduction.slice(0,1000),
      details:'협업 분야: '+field.slice(0,150)+'\n활동 지역: '+region+'\n업무 시작 가능일: '+availableFrom+'\n대면 미팅: 가능\n포트폴리오: '+portfolio.slice(0,500)+'\n경력·협업 가능 업무: '+introduction.slice(0,1000)+'\n개인정보 수집·이용: 동의',
      pageTitle:document.title.slice(0,240),createdAt:serverTimestamp()
    });
    form.reset();submit.textContent='등록 완료';
    inform('등록이 완료되었습니다. 협업이 필요한 프로젝트에서 검토 후 개별 연락드리겠습니다.');
  }catch(error){
    console.error('[NINEWORKS] freelancer registration error',error);
    submit.disabled=false;submit.textContent='협력 프리랜서 등록하기';
    inform('등록에 실패했습니다. 잠시 후 다시 시도해 주세요.',true);
  }
});

import {addDoc,collection,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {db,firebaseConfigReady,firebaseInitError} from './firebase-client.js';
const SERVICES={brand:'BRAND CONSULTING APPLICATION',designer:'DESIGNER MENTORING APPLICATION'};
for(const form of document.querySelectorAll('.mentoring-form')){
  const status=form.querySelector('[data-mentoring-status]');
  const button=form.querySelector('[type="submit"]');
  const feedback=(text,error=false)=>{if(status){status.textContent=text;status.style.color=error?'#ffaaaa':'#bcbcbc'}};
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    if(!firebaseConfigReady||firebaseInitError||!db){feedback('접수 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.',true);return}
    const fd=new FormData(form),kind=form.dataset.mentoringKind;
    const name=String(fd.get('name')||'').trim();
    const organization=String(fd.get('organization')||'').trim();
    const email=String(fd.get('email')||'').trim();
    const phone=String(fd.get('phone')||'').trim();
    const stage=String(fd.get('stage')||'').trim();
    const request=String(fd.get('request')||'').trim();
    if(!SERVICES[kind]||!name||!email||!phone||!stage||!request||(kind==='brand'&&!organization)){
      feedback('필수 입력사항을 확인해 주세요.',true);return;
    }
    button.disabled=true;button.textContent='접수 중...';feedback('신청 내용을 등록하고 있습니다.');
    try{
      await addDoc(collection(db,'inquiries'),{
        service:SERVICES[kind],source:'/#consulting-mentoring',status:'new',
        company:organization.slice(0,120),contactName:name.slice(0,70),
        email:email.slice(0,150),phone:phone.slice(0,35),
        projectName:kind==='brand'?'브랜드 컨설팅 신청':'디자이너 멘토링 신청',
        projectType:stage.slice(0,100),
        message:request.slice(0,1000),
        details:'신청 유형: '+(kind==='brand'?'브랜드 컨설팅':'디자이너 멘토링')
          +'\n소속: '+organization.slice(0,120)+'\n현재 단계: '+stage.slice(0,100)
          +'\n신청 내용: '+request.slice(0,1000)+'\n개인정보 수집·이용: 동의',
        pageTitle:document.title.slice(0,240),createdAt:serverTimestamp()
      });
      form.reset();button.textContent='접수 완료';
      feedback('신청이 접수되었습니다. 검토 후 개별 안내드리겠습니다.');
    }catch(error){
      console.error('[NINEWORKS] mentoring request failed',error);
      feedback('접수에 실패했습니다. 잠시 후 다시 시도해 주세요.',true);
      button.disabled=false;button.textContent='신청 내용 접수하기';
    }
  });
}

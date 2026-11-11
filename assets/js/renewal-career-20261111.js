import { addDoc,collection,serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db,firebaseConfigReady,firebaseInitError } from './firebase-client.js';
const form=document.getElementById('careerForm');
const textarea=document.getElementById('careerIntroduction');
const count=document.getElementById('careerCount');
const status=document.getElementById('careerStatus');
const send=document.getElementById('careerPortfolioEmail');
function feedback(message,error=false){if(status){status.textContent=message;status.style.color=error?'#ffaaa9':'#bdbdbd'}}
textarea?.addEventListener('input',()=>{if(count)count.textContent=Array.from(textarea.value).length+' / 500자'});
form?.addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  if(!firebaseConfigReady||firebaseInitError||!db){feedback('접수 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',true);return}
  const fd=new FormData(form);
  const name=String(fd.get('name')||'').trim();
  const phone=String(fd.get('phone')||'').trim();
  const email=String(fd.get('email')||'').trim().toLowerCase();
  const intro=String(fd.get('introduction')||'').trim();
  if(!name||!phone||!email||Array.from(intro).length<20||Array.from(intro).length>500){feedback('모든 필드를 확인해 주세요. 자기소개는 20~500자로 작성해 주세요.',true);return}
  const button=form.querySelector('[type="submit"]');
  button.disabled=true;button.textContent='접수 중...';feedback('지원 내역을 등록 중입니다.');
  try{
    const ref=await addDoc(collection(db,'inquiries'),{
      service:'2027 DESIGNER APPLICATION',source:'/#2027-designer-application',status:'new',
      company:'',contactName:name.slice(0,60),email:email.slice(0,150),
      phone:phone.slice(0,30),projectName:'2027 신입 디자이너 채용',
      projectType:'Recruitment',message:intro.slice(0,500),
      details:'지원자: '+name.slice(0,60)+'\n연락처: '+phone.slice(0,30)+'\n이메일: '+email.slice(0,150)+'\n자기소개: '+intro.slice(0,500)+'\n개인정보 수집·이용: 동의',
      pageTitle:document.title,createdAt:serverTimestamp()
    });
    form.reset();if(count)count.textContent='0 / 500자';
    button.textContent='접수 완료';
    feedback('지원 신청이 완료되었습니다. 아래 버튼으로 포트폴리오도 별도로 보내주세요.');
    const subject='[NINEWORKS 디자이너 지원] '+name+' / '+ref.id.slice(0,8);
    const body='지원자: '+name+'\n이메일: '+email+'\n접수번호: '+ref.id+'\n\n포트폴리오 파일 또는 링크를 첨부해 주세요.';
    send.href='mailto:info@9works.kr?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }catch(err){
    console.error('[NINEWORKS] career application failed',err);
    feedback('접수하지 못했습니다. 잠시 후 다시 시도해 주세요.',true);
    button.disabled=false;button.textContent='채용 지원 신청하기';
  }
});

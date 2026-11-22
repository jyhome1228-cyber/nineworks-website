import {addDoc,collection,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {db,firebaseConfigReady,firebaseInitError} from '../../assets/js/firebase-client.js';
const form=document.getElementById('applicationForm'),status=document.getElementById('applyStatus'),button=document.getElementById('applySubmit'),portfolio=document.getElementById('portfolioEmail');
const fields=['name','email','phone','motivation','goal','skills','education','experience','awards'];
const max={name:60,email:150,phone:30,motivation:3000,goal:3000,skills:1500,education:200,experience:2000,awards:1500};
function feedback(s,error=false){status.textContent=s;status.style.color=error?'#ffaaaa':'#c4c4c4'}
form.addEventListener('submit',async event=>{
event.preventDefault();if(!form.reportValidity())return;
if(!firebaseConfigReady||firebaseInitError||!db){feedback('접수 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요. 문제가 계속되면 이메일로 문의해 주세요.',true);return}
const fd=new FormData(form),v={};for(const key of fields)v[key]=String(fd.get(key)||'').trim().slice(0,max[key]);
v.email=v.email.toLowerCase();
if(!v.name||!v.email||!v.phone||v.motivation.length<20||v.goal.length<20||!v.skills||!v.education||fd.get('consent')!=='on'){feedback('필수 항목과 개인정보 동의 여부를 확인해 주세요.',true);return}
button.disabled=true;button.textContent='제출 중...';feedback('지원서를 접수하고 있습니다.');
try{
const details=['이름: '+v.name,'이메일: '+v.email,'연락처: '+v.phone,'지원 동기: '+v.motivation,'목표: '+v.goal,'주력 기술: '+v.skills,'최종학력: '+v.education,'경력: '+(v.experience||'없음'),'수상경력: '+(v.awards||'없음'),'개인정보 수집·이용: 동의'].join('\n\n');
const ref=await addDoc(collection(db,'inquiries'),{service:'2027 DESIGNER APPLICATION',source:'/renewal/apply.html',status:'new',company:'',contactName:v.name,email:v.email,phone:v.phone,projectName:'2027 신입 디자이너 채용',projectType:'Recruitment',message:v.motivation,details,pageTitle:document.title,createdAt:serverTimestamp()});
form.reset();button.textContent='제출 완료';feedback('지원서가 접수되었습니다. 포트폴리오도 아래 이메일로 보내주세요.');
portfolio.href='mailto:info@9works.kr?subject='+encodeURIComponent('[NINEWORKS 포트폴리오] '+v.name+' / '+ref.id.slice(0,8))+'&body='+encodeURIComponent('지원자: '+v.name+'\n접수번호: '+ref.id+'\n\n포트폴리오를 첨부하거나 링크를 작성해 주세요.');
}catch(err){console.error('Application submit failed',err);button.disabled=false;button.textContent='지원서 제출하기';feedback('접수에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.',true)}
});
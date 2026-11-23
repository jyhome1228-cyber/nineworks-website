(()=>{'use strict';
const values=['성장','안정','도전','전문성','자율성','책임감','협업','창의성','경제적 보상','문제 해결','리더십','배움','실행력','균형','성취','새로운 기술','고객 이해','완성도','영향력','독립성','워라밸','휴식','여가','유연한 근무','예측 가능한 일정','피드백','공정한 평가','동료 관계','신뢰','몰입','건강','가족과의 시간','장기적 커리어','실험','사회적 기여','의사소통','자기계발','주도성','지속가능성','심리적 안전감','업무의 의미'];
const scenarios=[
{category:'문제를 정의하는 방식',question:'클라이언트가 “좀 더 세련되게 바꿔주세요”라고 요청했습니다. 그런데 실제로는 구매 전환율이 낮고 브랜드 메시지도 불분명합니다. 납기까지 3일이 남았습니다. 당신은 어떻게 대응하겠습니까?',options:[['요구사항을 먼저 충실히 반영하고, 문제점은 추가 개선안으로 제안한다.','요구사항 중심'],['고객과 핵심 문제를 다시 정의하고, 우선순위를 조정해 해결한다.','문제 재정의 중심'],['기존 데이터와 사례를 빠르게 검토해 시각적 개선과 성과 개선을 병행한다.','검증 중심'],["먼저 클라이언트 요청대로 수정한 뒤 별도로 문제를 설명한다.","요청 우선","요구사항을 우선 실행하는 방식은 빠른 대응에 도움이 되지만, 나인웍스가 중시하는 문제 정의와는 순서가 다릅니다."],["디자인 취향을 중심으로 빠르게 여러 시안을 제시한다.","시각 표현 우선","시각적 탐색에 강점이 있지만 실제 고객 문제를 먼저 확인하는 접근을 보완하면 좋겠습니다."]]},
{category:'새로운 기술을 대하는 방식',question:'AI를 활용하면 2일 걸리던 작업을 몇 시간 안에 끝낼 수 있습니다. 하지만 결과물의 정확도와 저작권 문제가 충분히 검증되지 않았습니다. 당신의 선택은?',options:[['AI를 활용하되 출처와 결과를 검증하고, 검수 과정을 설계한다.','기술 활용과 검증'],['중요한 결과물은 기존 방식으로 제작하고 AI는 보조적으로 활용한다.','품질과 안정성'],['실험 프로젝트로 먼저 검증한 뒤 업무에 단계적으로 도입한다.','실험과 단계적 도입'],["검증 전이라도 시간을 줄일 수 있다면 바로 결과물에 적용한다.","속도 우선","새로운 도구를 빠르게 받아들이는 강점이 있지만, 정확성과 권리 검증을 우선하는 업무 방식과 차이가 있습니다."],["기술 변화가 빠르므로 AI 도입은 가급적 피한다.","기존 방식 선호","안정적인 제작 방식에 강점이 있지만 나인웍스의 새로운 기술 실험과는 차이가 있을 수 있습니다."]]},
{category:'책임과 협업의 방식',question:'내가 제안한 디자인 방향으로 프로젝트가 진행됐지만, 최종 결과가 기대에 미치지 못했습니다. 팀원들은 일정과 고객의 잦은 변경을 원인으로 이야기합니다. 당신은 어떻게 행동하겠습니까?',options:[['내 판단과 진행 과정에서 놓친 부분을 먼저 분석하고 개선안을 공유한다.','자기 점검'],['팀과 함께 원인을 정리하고 다음 프로젝트의 프로세스를 개선한다.','공동 문제 해결'],['고객 피드백과 결과 데이터를 분석해 객관적인 개선 방향을 제시한다.','근거 기반 개선'],["고객의 변경 요청이 주요 원인이므로 그 부분을 먼저 설명한다.","외부 원인 우선","외부 조건을 파악하는 것은 필요하지만 팀이 통제할 수 있는 개선점도 함께 살펴보는 접근을 권합니다."],["내 역할은 완료했으므로 후속 수정은 다른 담당자에게 넘긴다.","역할 경계 중심","업무 경계를 분명히 하는 장점이 있으나 결과까지 함께 점검하는 협업 방식과 차이가 있습니다."]]},
{category:'성장과 커리어의 방향',question:'입사 2년 후, 특정 분야의 실력은 크게 성장했지만 새로운 업무를 배울 기회가 생겼습니다. 기존 분야에서는 안정적인 성과를 낼 수 있지만 새로운 분야는 다시 초보자가 되어야 합니다. 어떤 선택을 하겠습니까?',options:[['현재 분야의 전문성을 더 깊게 발전시키고 새로운 영역은 점진적으로 배운다.','전문성 심화'],['새로운 분야에 도전해 기획부터 실행까지 다룰 수 있는 역량을 넓힌다.','역량 확장'],['기존 강점을 유지하면서 팀 내 다른 전문가와 협업해 새로운 결과를 만든다.','협업을 통한 확장'],["새로운 업무는 부담이 크므로 익숙한 업무만 지속한다.","익숙한 업무 선호","전문성을 유지하려는 방향이지만 다양한 영역을 배우고 연결하는 나인웍스의 환경과 차이가 있을 수 있습니다."],["새로운 분야는 개인적으로만 공부하고 실무 참여는 미룬다.","학습 후 참여","충분히 준비하려는 장점이 있지만 실무에서 시도하고 배우는 방식과 속도가 다를 수 있습니다."]]},
{category:'업무의 지속가능성과 경계',question:'중요한 프로젝트 마감이 다가왔지만 팀의 업무량이 이미 많습니다. 클라이언트가 추가 요구를 전달했고, 무리하게 수용하면 일정과 품질에 영향을 줄 수 있습니다. 당신은 어떻게 대응하겠습니까?',options:[['업무 범위와 우선순위를 재협의하고, 가능한 일정과 대안을 제시한다.','범위와 일정 조율'],['동료들과 업무를 재배분하고 검수 시간을 확보해 품질을 지킨다.','협업과 품질 유지'],['추가 요구의 효과를 확인하고 꼭 필요한 부분만 단계적으로 적용한다.','효과 중심의 단계적 실행'],["일정을 맞추기 위해 추가 요구를 모두 수용하고 이후에 회복한다.","무리한 수용","책임감 있는 대응 의도는 이해되지만 지속가능한 일정과 품질을 함께 지키는 방식이 더 중요합니다."],["추가 요구는 모두 거절하고 기존 계획만 고수한다.","변경 회피","범위를 보호하는 장점은 있지만 요구의 목적을 파악하고 대안을 제시하는 유연성이 필요할 수 있습니다."]]}
];
const $=id=>document.getElementById(id),bubbles=$('dnaBubbles');if(!bubbles)return;
let selected=[],answers={},step=-1,previousFocus=null;const modal=$('dnaModal'),card=modal?.querySelector('.dna-modal-card');const closeModal=()=>{modal.hidden=true;document.body.classList.remove('dna-modal-open');previousFocus?.focus()};$('dnaOpen')?.addEventListener('click',()=>{previousFocus=document.activeElement;modal.hidden=false;document.body.classList.add('dna-modal-open');$('dnaClose')?.focus()});$('dnaClose')?.addEventListener('click',closeModal);modal?.querySelector('[data-dna-close]')?.addEventListener('click',closeModal);modal?.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='Tab'){const focusable=[...modal.querySelectorAll('button:not(:disabled):not([hidden])')].filter(x=>x.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const phase=$('dnaPhase'),progress=$('dnaProgress'),bar=$('dnaProgressBar'),valuesView=$('dnaValuesView'),questionView=$('dnaQuestionView'),resultView=$('dnaResultView');
function updateHeader(){phase.textContent=step===-1?'WORK DNA 테스트 · 가치 성향 탐색':step===5?'나의 WORK DNA':'사고방식 진단';progress.textContent=step===-1?selected.length+' / 5':step===5?'결과보고서':step+1+' / 5';const pct=step===-1?selected.length*10:step===5?100:50+(step+1)*10;bar.style.width=pct+'%';$('dnaProgressTrack')?.setAttribute('aria-valuenow',String(pct))}
function renderValues(){bubbles.replaceChildren();values.forEach(value=>{const b=document.createElement('button');b.type='button';b.className='dna-bubble';b.textContent=value;b.setAttribute('aria-pressed',String(selected.includes(value)));b.disabled=selected.length===5&&!selected.includes(value);b.addEventListener('click',()=>{selected=selected.includes(value)?selected.filter(x=>x!==value):[...selected,value];renderValues()});bubbles.append(b)});$('dnaSelected').textContent=selected.length?selected.join(' · '):'아직 선택한 가치가 없습니다.';$('dnaStart').disabled=selected.length!==5;updateHeader()}
function renderQuestion(){valuesView.hidden=true;resultView.hidden=true;questionView.hidden=false;const q=scenarios[step];$('dnaQuestionCategory').textContent=q.category;$('dnaQuestionTitle').replaceChildren();q.question.split(/(?<=[.!?])\s+/u).filter(Boolean).forEach(sentence=>{const line=document.createElement('span');line.className='dna-question-sentence';line.textContent=sentence;$('dnaQuestionTitle').append(line)});const box=$('dnaOptions');box.replaceChildren();q.options.forEach(([text],i)=>{const b=document.createElement('button');b.type='button';b.className='dna-option';b.textContent=text;b.setAttribute('role','radio');b.setAttribute('aria-checked',String(answers[step]===i));b.addEventListener('click',()=>{answers[step]=i;renderQuestion()});box.append(b)});$('dnaNext').disabled=answers[step]===undefined;$('dnaNext').textContent=step===4?'결과 보기':'다음';updateHeader()}
function renderResult(){
valuesView.hidden=true;questionView.hidden=true;resultView.hidden=false;
const body=$('dnaResultBody');body.replaceChildren();
const add=(tag,cls,text,parent=body)=>{const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=text;parent.append(el);return el};
const make=(title,text)=>{const div=add('div','dna-result-group','');add('strong','',title,div);add('p','',text,div)};
make('나의 핵심 가치',selected.join(' · '));
const principles=[
{title:'문제 정의와 고객 이해',ideal:'요청을 수행하기 전에 실제 문제와 사업 목표를 파악합니다.',preferred:[1,2]},
{title:'기술 활용과 결과 검증',ideal:'AI를 적극 활용하되 결과의 정확성과 품질을 검증합니다.',preferred:[0,2]},
{title:'책임 있는 협업',ideal:'원인을 함께 살피고 결과와 개선에 책임지는 협업을 지향합니다.',preferred:[0,1,2]},
{title:'학습과 전문성 확장',ideal:'개인의 강점을 발전시키면서 새로운 실무에도 도전합니다.',preferred:[0,1,2]},
{title:'지속가능한 실행',ideal:'업무 범위와 품질, 팀의 지속가능성을 함께 고려합니다.',preferred:[0,1,2]}
];
const matches=principles.reduce((n,p,i)=>n+(p.preferred.includes(answers[i])?1:0),0);
const percentage=Math.round(matches/principles.length*100);
const scoreBox=add('div','dna-score-box','');
add('div','dna-score-label','나인웍스 업무 방식 일치도',scoreBox);
add('strong','dna-score-value',percentage+'%',scoreBox);
const scoreTrack=add('div','dna-score-track','',scoreBox);
const scoreFill=add('span','dna-score-fill','',scoreTrack);scoreFill.style.width=percentage+'%';
add('p','dna-score-caption','5가지 업무 상황의 선택과 나인웍스가 제시한 업무 원칙을 비교한 참고 수치입니다. 실제 채용 적합도나 합격 가능성을 뜻하지 않습니다.',scoreBox);
const panel=add('div','dna-result-summary','');add('h4','','나인웍스와 나의 업무 방식 비교',panel);
let differences=0;
principles.forEach((p,i)=>{
const chosen=scenarios[i].options[answers[i]];
const match=p.preferred.includes(answers[i]);
if(!match)differences++;
const item=add('div','dna-comparison-item','',panel);
add('strong','',p.title,item);
add('p','','나의 선택: '+chosen[1],item);
add('p','','나인웍스의 방향: '+p.ideal,item);
add('p','dna-comparison-feedback',match?'접점이 있습니다. 실제 업무에서 어떻게 실천하는지 확인해 보세요.':chosen[2]||'서로 다른 접근입니다. 면접에서 기대하는 일하는 방식을 구체적으로 확인해 보세요.',item);
});
const summary=add('div','dna-result-summary','');
add('h4','',differences>=3?'업무 방식에서 차이가 있는 영역이 있습니다.':differences>=1?'공통점과 차이점이 함께 보입니다.':'나인웍스의 업무 방향과 여러 접점이 있습니다.',summary);
add('p','','다섯 가지 상황에서 '+differences+'개 영역의 접근 방식이 달랐습니다. 이는 자기 탐색용 비교이며, 개인의 능력이나 채용 적격성을 판정하지 않습니다. 실제 적합성은 직무 경험과 면접에서 상호 확인해야 합니다.',summary);
updateHeader();
}
$('dnaStart').addEventListener('click',()=>{if(selected.length!==5)return;step=0;renderQuestion()});
$('dnaPrev').addEventListener('click',()=>{if(step===0){step=-1;questionView.hidden=true;valuesView.hidden=false;updateHeader()}else{step--;renderQuestion()}});
$('dnaNext').addEventListener('click',()=>{if(answers[step]===undefined)return;step++;step===5?renderResult():renderQuestion()});
$('dnaReset').addEventListener('click',()=>{selected=[];answers={};step=-1;resultView.hidden=true;questionView.hidden=true;valuesView.hidden=false;renderValues();card?.scrollTo({top:0,behavior:'smooth'})});
$('dnaApply').addEventListener('click',()=>{const panel=$('applicationSection'),button=$('showApplication');if(panel){closeModal();panel.hidden=false;button?.setAttribute('aria-expanded','true');panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'})}});
renderValues();
})();
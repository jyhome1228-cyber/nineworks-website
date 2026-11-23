/* NINEWORKS 2027 preview navigation. Labels and routes copied from assets/js/main.js on 2026-11-23. */
(()=>{'use strict';
const items=[{"key":"about","href":"/about.html","label":"ABOUT","children":[{"href":"/about.html","label":"나인웍스 소개"},{"href":"/design-team.html","label":"디자인팀·구성원"},{"href":"/designer.html","label":"대표 디자이너"},{"href":"/performance.html","label":"기업 현황"},{"href":"/partners.html","label":"파트너 네트워크"},{"href":"/process.html","label":"업무 프로세스"},{"href":"/with-us.html","label":"With Us"}]},{"key":"projects","href":"/branding-projects.html","label":"PROJECTS","children":[{"href":"/branding-projects.html","label":"브랜드 신규 구축"},{"href":"/branding-projects.html","label":"브랜드 리뉴얼"},{"href":"/website-projects.html","label":"웹사이트 구축 프로젝트"},{"href":"/package-projects.html","label":"패키지 디자인·제작 프로젝트"},{"href":"/crm.html","label":"기업 운영 시스템"},{"href":"/membership.html","label":"브랜드 운영·관리"}]},{"key":"services","href":"/branding.html","label":"SERVICES","children":[{"href":"/branding.html","label":"브랜드 전략·BI/BX"},{"href":"/develop.html","label":"웹사이트·쇼핑몰"},{"href":"/package-design.html","label":"패키지 디자인"},{"href":"/print.html","label":"인쇄·제작"},{"href":"/portfolio.html?filter=detailpage","label":"상세페이지·콘텐츠"},{"href":"/portfolio.html?filter=editorial","label":"편집디자인·IR/PPT"},{"href":"/crm.html","label":"기업 시스템·CRM"}]},{"key":"portfolio","href":"/portfolio.html?filter=major","label":"PORTFOLIO","children":[{"href":"/portfolio.html?filter=major","label":"대표 디자인 프로젝트"},{"href":"/project.html","label":"브랜딩 프로젝트"},{"href":"/local-branding.html","label":"로컬브랜딩"},{"href":"/portfolio.html?filter=website","label":"웹사이트"},{"href":"/portfolio.html?filter=system","label":"시스템"},{"href":"/portfolio.html?filter=package","label":"패키지 디자인"},{"href":"/portfolio.html?filter=detailpage","label":"상세페이지 디자인"},{"href":"/portfolio.html?filter=instagram","label":"SNS 콘텐츠"},{"href":"/portfolio.html?filter=editorial","label":"편집디자인"},{"href":"/portfolio.html?filter=ir","label":"IR / PPT"},{"href":"/portfolio.html?filter=event","label":"행사·전시 디자인"}]},{"key":"consulting","href":"/consulting-business.html","label":"CONSULTING","children":[{"href":"/consulting-business.html","label":"AI 비즈니스 업무구조화"},{"href":"/consulting-designer.html","label":"디자이너 포트폴리오 컨설팅"}]},{"key":"insights","href":"/magazine.html","label":"INSIGHTS","children":[{"href":"/magazine.html","label":"매거진"},{"href":"/global-references.html","label":"디자인 연구·인사이트"},{"href":"/process.html","label":"프로세스·방법론"}]},{"key":"contact","href":"/contact.html","label":"CONTACT"}];
const headers=document.querySelectorAll('[data-nw-renewal-nav]');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rootLink=(x,klass='')=>'<a class="'+klass+'" href="'+esc(x.href)+'">'+esc(x.label)+'</a>';
const renderDesktop=item=>{
 if(!item.children)return '<a class="nw-new-direct" href="'+esc(item.href)+'">'+esc(item.label)+'</a>';
 return '<div class="nw-new-item"><a class="nw-new-parent" href="'+esc(item.href)+'" aria-haspopup="true" aria-expanded="false">'+esc(item.label)+'<span aria-hidden="true" class="nw-new-caret"></span></a><div class="nw-new-dropdown">'+item.children.map(child=>rootLink(child,'nw-new-sub-link')).join('')+'</div></div>';
};
const desktopLeft=items.slice(0,3).map(renderDesktop).join('');
const desktopRight=items.slice(3).map(renderDesktop).join('');
const mobile=items.map((item,i)=>{
 if(!item.children)return '<div class="nw-new-mobile-line">'+rootLink(item,'nw-new-mobile-parent')+'</div>';
 const id='nw-new-sub-'+i;
 return '<div class="nw-new-mobile-line"><div class="nw-new-mobile-title">'+rootLink(item,'nw-new-mobile-parent')+'<button type="button" class="nw-new-expand" aria-controls="'+id+'" aria-expanded="false" aria-label="'+esc(item.label)+' 하위 메뉴 보기"><span aria-hidden="true">+</span></button></div><div class="nw-new-mobile-sub" id="'+id+'" hidden>'+item.children.map(c=>rootLink(c,'nw-new-mobile-sub-link')).join('')+'</div></div>';
}).join('');
headers.forEach(header=>{
 const drawerId='nw-renewal-mobile-menu';
 header.innerHTML='<div class="nw-new-main"><nav class="nw-new-primary nw-new-primary--left" aria-label="회사 및 서비스 메뉴">'+desktopLeft+'</nav><a class="nw-new-logo" href="/renewal-2027.html" aria-label="NINEWORKS 리뉴얼 메인"><img src="/assets/nineworks-renewal-logo.svg" alt="NINEWORKS" width="150" height="19"></a><nav class="nw-new-primary nw-new-primary--right" aria-label="포트폴리오 및 문의 메뉴">'+desktopRight+'</nav><button type="button" class="nw-new-toggle" aria-label="전체 메뉴 열기" aria-controls="'+drawerId+'" aria-expanded="false"><span></span><span></span><span></span></button></div><nav class="nw-new-mobile" id="'+drawerId+'" aria-label="모바일 주요 메뉴" hidden>'+mobile+'</nav>';
 const toggle=header.querySelector('.nw-new-toggle');
 const drawer=header.querySelector('.nw-new-mobile');
 function close(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','전체 메뉴 열기');drawer.hidden=true;header.classList.remove('nw-menu-open');}
 toggle.addEventListener('click',()=>{
  const open=toggle.getAttribute('aria-expanded')==='true';
  if(open){close();return;}
  toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','전체 메뉴 닫기');
  drawer.hidden=false;header.classList.add('nw-menu-open');
 });
 header.querySelectorAll('.nw-new-expand').forEach(button=>button.addEventListener('click',()=>{
  const sub=header.querySelector('#'+button.getAttribute('aria-controls'));
  const expanded=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!expanded));sub.hidden=expanded;
  button.querySelector('span').textContent=expanded?'+':'−';
 }));
 header.querySelectorAll('.nw-new-item').forEach(group=>{
  const link=group.querySelector('.nw-new-parent');
  group.addEventListener('mouseenter',()=>link.setAttribute('aria-expanded','true'));
  group.addEventListener('mouseleave',()=>link.setAttribute('aria-expanded','false'));
  group.addEventListener('focusin',()=>link.setAttribute('aria-expanded','true'));
  group.addEventListener('focusout',()=>{requestAnimationFrame(()=>{if(!group.contains(document.activeElement))link.setAttribute('aria-expanded','false');});});
 });
 drawer.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!drawer.hidden){close();toggle.focus();}});
 document.addEventListener('pointerdown',event=>{if(!header.contains(event.target)&&!drawer.hidden)close();});
 window.addEventListener('resize',()=>{if(window.innerWidth>1050&&!drawer.hidden)close();});
});
})();
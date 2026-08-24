(() => {
  if (window.__NW_PROJECT_RENEWAL_NOTICE__) return;
  window.__NW_PROJECT_RENEWAL_NOTICE__ = true;

  const style = document.createElement('style');
  style.textContent = `
    .nw-project-renewal{
      position:fixed;
      z-index:9999;
      inset:0;
      display:grid;
      place-items:center;
      padding:24px;
      background:rgba(17,17,17,.34);
      backdrop-filter:blur(5px);
    }
    .nw-project-renewal[hidden]{display:none!important}
    .nw-project-renewal__panel{
      position:relative;
      width:min(100%,580px);
      padding:42px 42px 34px;
      border:1px solid #d9d9d5;
      background:#fff;
      color:#111;
      box-shadow:0 24px 80px rgba(0,0,0,.12);
    }
    .nw-project-renewal__eyebrow{
      margin:0 0 30px;
      color:#888;
      font-size:11px;
      font-weight:600;
      line-height:1;
      letter-spacing:.09em;
    }
    .nw-project-renewal h2{
      max-width:12ch;
      margin:0;
      font-size:clamp(30px,3vw,42px);
      font-weight:500;
      line-height:1.16;
      letter-spacing:-.05em;
      word-break:keep-all;
      text-wrap:balance;
    }
    .nw-project-renewal__copy{
      max-width:470px;
      margin:24px 0 0;
      color:#5f5f5f;
      font-size:14px;
      line-height:1.75;
      word-break:keep-all;
      text-wrap:pretty;
    }
    .nw-project-renewal__date{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:20px;
      margin-top:34px;
      padding:18px 0;
      border-top:1px solid #dededa;
      border-bottom:1px solid #dededa;
    }
    .nw-project-renewal__date span{
      color:#888;
      font-size:10px;
      font-weight:600;
      letter-spacing:.08em;
    }
    .nw-project-renewal__date strong{
      font-size:17px;
      font-weight:500;
      letter-spacing:-.025em;
    }
    .nw-project-renewal__button{
      display:flex;
      align-items:center;
      justify-content:space-between;
      width:100%;
      min-height:54px;
      margin-top:26px;
      padding:0 18px;
      border:0;
      background:#111;
      color:#fff;
      font-size:12px;
      font-weight:600;
      cursor:pointer;
    }
    .nw-project-renewal__close{
      position:absolute;
      top:20px;
      right:20px;
      width:34px;
      height:34px;
      border:0;
      background:transparent;
      color:#111;
      font-size:22px;
      font-weight:300;
      line-height:1;
      cursor:pointer;
    }
    @media(max-width:600px){
      .nw-project-renewal{padding:16px}
      .nw-project-renewal__panel{padding:34px 24px 26px}
      .nw-project-renewal__eyebrow{margin-bottom:24px}
      .nw-project-renewal__date{align-items:flex-start;flex-direction:column;gap:6px}
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'nw-project-renewal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'nw-project-renewal-title');
  modal.innerHTML = `
    <div class="nw-project-renewal__panel">
      <button class="nw-project-renewal__close" type="button" aria-label="안내 닫기" data-project-renewal-close>×</button>
      <p class="nw-project-renewal__eyebrow">NINEWORKS / BRAND PORTFOLIO UPDATE</p>
      <h2 id="nw-project-renewal-title">브랜드 포트폴리오를 새롭게 개편하고 있습니다.</h2>
      <p class="nw-project-renewal__copy">프로젝트의 과정과 결과를 더 명확하게 볼 수 있도록 전체 아카이브를 다시 정리하고 있습니다. 현재 페이지는 기존 작업 일부를 임시로 보여드립니다.</p>
      <div class="nw-project-renewal__date"><span>REOPENING</span><strong>2026. 09. 10 공개 예정</strong></div>
      <button class="nw-project-renewal__button" type="button" data-project-renewal-close><span>현재 포트폴리오 보기</span><span>↗</span></button>
    </div>`;
  document.body.appendChild(modal);

  const close = () => {
    modal.hidden = true;
    document.body.style.removeProperty('overflow');
  };

  document.body.style.overflow = 'hidden';
  modal.querySelectorAll('[data-project-renewal-close]').forEach((button) => button.addEventListener('click', close));
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) close(); });
})();

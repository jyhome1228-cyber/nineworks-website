(() => {
  if (window.__NW_PROJECT_CONTEXT_NOTE__) return;
  window.__NW_PROJECT_CONTEXT_NOTE__ = true;

  const head = document.querySelector('.projects-page .project-gallery__head');
  if (!head || head.querySelector('.project-gallery__context')) return;

  const note = document.createElement('p');
  note.className = 'project-gallery__context';
  note.textContent = '실제 클라이언트 프로젝트뿐 아니라, 나인웍스 팀이 흥미를 가진 브랜드와 주제를 바탕으로 과제를 설정해 자발적으로 기획·디자인한 독립·콘셉트 프로젝트도 함께 포함되어 있습니다.';
  head.appendChild(note);

  const style = document.createElement('style');
  style.textContent = `
    .projects-page .project-gallery__context{
      max-width:760px;
      margin:14px 0 0;
      color:#767676;
      font-size:13px;
      font-weight:400;
      line-height:1.7;
      letter-spacing:-.015em;
      word-break:keep-all;
    }
    @media(max-width:720px){
      .projects-page .project-gallery__context{
        max-width:none;
        margin-top:12px;
        font-size:12px;
        line-height:1.65;
      }
    }
  `;
  document.head.appendChild(style);
})();

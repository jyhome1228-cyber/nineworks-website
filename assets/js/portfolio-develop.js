(() => {
  const button = document.querySelector('.portfolio-filter [data-filter="develop"]');
  if (!button) return;

  button.addEventListener('click', () => {
    const title = document.querySelector('[data-portfolio-index-title]');
    const copy = document.querySelector('[data-portfolio-index-copy]');
    const count = document.querySelector('[data-portfolio-index-count]');
    const cards = Array.from(document.querySelectorAll('.portfolio-filter-item'));
    const developCount = cards.filter((card) => (card.dataset.category || '').split(' ').includes('develop')).length;

    if (title) title.textContent = 'Develop';
    if (copy) copy.textContent = '브랜드와 기업이 실제 운영에 사용할 수 있도록 웹사이트, UX/UI, 견적·문의 시스템, 관리자 환경과 데이터 구조까지 기획·디자인·개발한 프로젝트입니다.';
    if (count) count.textContent = `${String(developCount).padStart(2, '0')} WORKS`;
  });
})();
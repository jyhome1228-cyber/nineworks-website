(() => {
  const apply = () => {
    if (!location.pathname.toLowerCase().endsWith('/client/phyto/quote.html')) return;

    if (!document.querySelector('style[data-phyto-quote-polish]')) {
      const style = document.createElement('style');
      style.dataset.phytoQuotePolish = 'true';
      style.textContent = `
        .phyto-support-quote-note{display:grid;grid-template-columns:130px 1fr;gap:16px;margin:14px 0 4px;padding:12px 14px;border:1px solid #cfcfca;background:#fff;font-size:10.5px;line-height:1.55}
        .phyto-support-quote-note b{font-size:9px;letter-spacing:.065em;color:#111}
        .phyto-support-quote-note span{color:#555}
        .phyto-support-quote-note em{font-style:normal;font-weight:600;color:#111}
        @media(max-width:820px){.phyto-support-quote-note{grid-template-columns:1fr;gap:5px}}
      `;
      document.head.appendChild(style);
    }

    const summary = document.querySelector('.summary');
    const sumhead = document.querySelector('.sumhead');
    if (summary && sumhead && !summary.querySelector('.phyto-support-quote-note')) {
      sumhead.insertAdjacentHTML('afterend', `
        <div class="phyto-support-quote-note">
          <b>ADDITIONAL QUOTE</b>
          <span><em>정부지원사업 연동 진행</em> · 현재 금액은 1차 기본 범위 기준 견적이며, 추가 적용물·제작 범위 및 사업비 확정 내용에 따라 별도 추가견적을 연동하여 진행합니다.</span>
        </div>`);
    }

    const scope = document.querySelector('.scope');
    if (scope) {
      const rows = Array.from(scope.querySelectorAll('div'));
      let detailRow = rows.find((row) => /상세페이지|Detail Page/i.test(row.textContent || ''));
      if (!detailRow) {
        detailRow = document.createElement('div');
        detailRow.innerHTML = '<b>Basic Detail Page</b><span>기본형 상세페이지 디자인 · 제공된 제품 정보와 확정된 브랜드 방향을 기준으로 기본 구성 및 비주얼 적용</span>';
        const finalRow = rows.find((row) => /Final Delivery/i.test(row.textContent || ''));
        if (finalRow) scope.insertBefore(detailRow, finalRow);
        else scope.appendChild(detailRow);
      } else {
        const b = detailRow.querySelector('b');
        const span = detailRow.querySelector('span');
        if (b) b.textContent = 'Basic Detail Page';
        if (span) span.textContent = '기본형 상세페이지 디자인 · 제공된 제품 정보와 확정된 브랜드 방향을 기준으로 기본 구성 및 비주얼 적용';
      }
    }

    const scopeNote = Array.from(document.querySelectorAll('.note')).find((note) => note.querySelector('strong')?.textContent.trim() === 'Scope');
    if (scopeNote) {
      const span = scopeNote.querySelector('span');
      if (span) span.textContent = '본 견적은 고스란 브랜드 아이덴티티 정립, 기본형 브랜드 가이드라인, 패키지 디자인 및 기본형 상세페이지 디자인을 포함한 1차 기본 범위 기준입니다. 정부지원사업 연동 범위와 추가 적용·제작 항목이 확정되는 경우 별도 추가견적을 협의하여 진행합니다.';
    }

    const priceSmall = document.querySelector('.price small');
    if (priceSmall) priceSmall.textContent = '1차 기본 범위 · 공급가액 · VAT 별도';
  };

  const run = () => {
    apply();
    window.setTimeout(apply, 80);
    window.setTimeout(apply, 300);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();

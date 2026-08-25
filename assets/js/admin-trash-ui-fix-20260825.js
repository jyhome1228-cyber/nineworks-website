(() => {
  const STYLE_KEY = 'admin-trash-ui-fix-20260825';

  const loadStyle = () => {
    if (document.querySelector(`link[data-${STYLE_KEY}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/admin-trash-ui-fix-20260825.css?v=20260825-1';
    link.setAttribute(`data-${STYLE_KEY}`, 'true');
    document.head.appendChild(link);
  };

  const placeInquiryTrashButtons = () => {
    document.querySelectorAll('.admin-inquiry-row').forEach((row) => {
      const button = row.querySelector('[data-inquiry-trash]');
      if (!button) return;

      if (!button.classList.contains('admin-trash-cta')) button.classList.add('admin-trash-cta');
      if (button.textContent !== '휴지통 이동') button.textContent = '휴지통 이동';

      const proposalControl = row.querySelector('.admin-partner-lite-proposal__control');
      if (!proposalControl) return;

      proposalControl.classList.add('has-trash-cta');
      if (button.parentElement !== proposalControl) proposalControl.appendChild(button);
    });
  };

  const styleRecruitTrashButtons = () => {
    document.querySelectorAll('.admin-recruit-card [data-inquiry-trash]').forEach((button) => {
      if (!button.classList.contains('admin-trash-cta')) button.classList.add('admin-trash-cta');
      if (button.textContent !== '휴지통 이동') button.textContent = '휴지통 이동';
    });
  };

  const polishTrashRows = () => {
    const count = document.querySelector('[data-trash-count]');
    if (count && count.textContent.trim() === '1 ITEMS') count.textContent = '1 ITEM';

    document.querySelectorAll('[data-inquiry-delete]').forEach((button) => {
      if (button.textContent !== '영구 삭제') button.textContent = '영구 삭제';
    });
  };

  let scheduled = false;
  const refresh = () => {
    scheduled = false;
    placeInquiryTrashButtons();
    styleRecruitTrashButtons();
    polishTrashRows();
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(refresh);
  };

  const start = () => {
    loadStyle();
    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('nw-admin-panel', schedule);
    document.addEventListener('click', schedule, true);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

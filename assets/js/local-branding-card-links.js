(() => {
  const prefix = 'https://jyhome1228-cyber.github.io/growfarmers/portfolio/projects/';
  document.querySelectorAll('.local-branding-page .portfolio-card__link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith(prefix)) return;
    const id = href.slice(prefix.length).split('/').filter(Boolean)[0];
    if (!id) return;
    link.href = `local-branding-detail.html?project=${encodeURIComponent(id)}`;
  });
})();

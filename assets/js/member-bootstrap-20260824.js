(() => {
  if (document.querySelector('script[data-nw-member-auth]')) return;
  const script = document.createElement('script');
  script.src = '/assets/js/member-auth.js?v=20260824-1';
  script.async = false;
  script.dataset.nwMemberAuth = 'true';
  document.head.appendChild(script);
})();

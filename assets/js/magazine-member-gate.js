(() => {
  const root = document.querySelector('[data-magazine-detail-root]');
  if (!root) return;
  const AUTH_SDK = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';

  const params = new URLSearchParams(location.search);
  const migratedSource = (params.get('source') || '').trim();
  const escapeHTML = (value = '') => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const currentReturn = `${location.pathname.split('/').pop() || 'magazine-detail.html'}${location.search}`;

  const showLock = () => {
    root.innerHTML = `<section class="member-lock magazine-member-lock container"><p class="eyebrow">MEMBERS ONLY</p><h2>This article is for<br>Nineworks Members.</h2><p>무료 멤버십에 가입하면 디자인 아티클 전체 글과 Resource Library를 자유롭게 이용할 수 있습니다.</p><div class="member-lock__actions"><a class="member-button member-button--inline" href="join.html?return=${encodeURIComponent(currentReturn)}"><span>JOIN NINEWORKS</span><span>↗</span></a><a class="member-text-link" href="join.html?mode=login&return=${encodeURIComponent(currentReturn)}">LOGIN</a></div></section>`;
  };

  const showError = (message) => {
    root.innerHTML = `<section class="member-lock magazine-member-lock container"><p class="eyebrow">MEMBER ACCESS</p><h2>Access unavailable.</h2><p>${escapeHTML(message)}</p><div class="member-lock__actions"><a class="member-text-link" href="magazine.html">BACK TO DESIGN ARTICLES</a></div></section>`;
  };

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  const loadLegacyArticle = async () => {
    root.innerHTML = '<section class="portfolio-loading"><p>Loading article…</p></section>';
    const scripts = [
      'assets/js/magazine-data.js',
      'assets/js/magazine-articles-1.js',
      'assets/js/magazine-articles-2.js',
      'assets/js/magazine-articles-3.js',
      'assets/js/magazine-articles-4.js',
      'assets/js/magazine-articles-5.js',
      'assets/js/magazine-articles-6.js',
      'assets/js/magazine-articles-7.js',
      'assets/js/magazine-hotfix-20260819.js?v=20260819-1',
      'assets/js/magazine-detail.js?v=20260905-1'
    ];
    for (const src of scripts) await loadScript(src);
  };

  const loadMigratedArticle = async () => {
    if (!/^(?:article|magazine)-[a-z0-9-]+\.html$/i.test(migratedSource)) throw new Error('Invalid migrated article source.');
    root.innerHTML = '<section class="portfolio-loading"><p>Loading migrated article…</p></section>';
    await loadScript('assets/js/source-archive-detail.js?v=20260905-1');
  };

  Promise.all([import('./firebase-client.js'), import(AUTH_SDK)])
    .then(([client, authSdk]) => {
      if (!client.firebaseConfigReady || !client.auth) throw new Error('Firebase Authentication is not ready.');
      authSdk.onAuthStateChanged(client.auth, async (user) => {
        if (!user) {
          showLock();
          return;
        }
        try {
          if (migratedSource) await loadMigratedArticle();
          else await loadLegacyArticle();
        } catch (error) {
          console.error('[NINEWORKS Design Articles] article load failed', error);
          showError('아티클을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    })
    .catch((error) => {
      console.error('[NINEWORKS Design Articles] member gate failed', error);
      showError('멤버십 인증 연결을 확인해 주세요.');
    });
})();
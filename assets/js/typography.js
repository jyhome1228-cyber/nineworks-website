(() => {
  const selectors = [
    '.hero__descriptor',
    '.page-hero__copy',
    '.portfolio-hero__copy',
    '.magazine-hero__copy',
    '.solutions-hero__copy',
    '.category-intro > .lead',
    '.split-copy__right.lead',
    '.about-preview__body > .lead'
  ];

  const applySentenceBreaks = (element) => {
    if (!element || element.dataset.sentenceBreaks === 'true') return;
    if (element.children.length > 0) return;

    const text = element.textContent.trim();
    if (!text.includes('. ')) return;

    const sentences = text.split(/\.\s+(?=\S)/g).filter(Boolean);
    if (sentences.length < 2) return;

    element.textContent = '';
    sentences.forEach((sentence, index) => {
      element.append(document.createTextNode(index < sentences.length - 1 ? `${sentence}.` : sentence));
      if (index < sentences.length - 1) element.append(document.createElement('br'));
    });
    element.dataset.sentenceBreaks = 'true';
  };

  const run = () => document.querySelectorAll(selectors.join(',')).forEach(applySentenceBreaks);

  const addAboutMenuShortcut = () => {
    const nav = document.querySelector('.site-service-nav');
    if (!nav) return false;
    if (nav.querySelector('[data-about-menu-shortcut]')) return true;

    const shortcut = document.createElement('a');
    shortcut.href = '#';
    shortcut.textContent = 'About';
    shortcut.dataset.aboutMenuShortcut = 'true';
    shortcut.setAttribute('role', 'button');
    shortcut.setAttribute('aria-label', '전체 메뉴 열기');
    shortcut.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('[data-menu-trigger]')?.click();
    });
    nav.insertBefore(shortcut, nav.firstChild);
    return true;
  };

  const observeServiceNavigation = () => {
    if (addAboutMenuShortcut()) return;
    const observer = new MutationObserver(() => {
      if (addAboutMenuShortcut()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 4000);
  };

  run();
  observeServiceNavigation();
  document.addEventListener('DOMContentLoaded', () => {
    run();
    observeServiceNavigation();
  }, { once: true });
})();

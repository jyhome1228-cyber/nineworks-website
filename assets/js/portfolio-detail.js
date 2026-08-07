(() => {
  const buttons = document.querySelectorAll('[data-global-language]');
  const copies = document.querySelectorAll('[data-language-copy]');

  if (!buttons.length || !copies.length) return;

  const setLanguage = (language) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.globalLanguage === language;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    copies.forEach((copy) => {
      const isActive = copy.dataset.languageCopy === language;
      copy.classList.toggle('is-active', isActive);
      copy.hidden = !isActive;
    });

    document.documentElement.lang = language === 'en' ? 'en' : 'ko';
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.globalLanguage));
  });

  setLanguage('ko');
})();

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

  run();
  document.addEventListener('DOMContentLoaded', run, { once: true });
})();

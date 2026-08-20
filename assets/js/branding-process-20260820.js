(() => {
  const root = document.querySelector('[data-brand-process]');
  if (!root) return;

  const timeline = root.querySelector('[data-process-timeline]');
  const steps = Array.from(root.querySelectorAll('[data-process-step]'));
  const navLinks = Array.from(document.querySelectorAll('[data-process-nav]'));
  const indexLinks = Array.from(document.querySelectorAll('[data-process-index-link]'));

  const setActive = (id) => {
    steps.forEach((step) => step.classList.toggle('is-active', step.id === id));
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  };

  const scrollToTarget = (event) => {
    const link = event.currentTarget;
    const selector = link.getAttribute('href');
    if (!selector || !selector.startsWith('#')) return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', selector);
  };

  [...navLinks, ...indexLinks].forEach((link) => link.addEventListener('click', scrollToTarget));

  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-28% 0px -52% 0px', threshold: [0.05, 0.18, 0.35, 0.55] });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-seen');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    steps.forEach((step) => {
      activeObserver.observe(step);
      revealObserver.observe(step);
    });
  } else {
    steps.forEach((step) => step.classList.add('is-seen'));
    if (steps[0]) setActive(steps[0].id);
  }

  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportMarker = window.innerHeight * 0.42;
    const total = Math.max(1, rect.height);
    const travelled = Math.min(total, Math.max(0, viewportMarker - rect.top));
    const percent = Math.min(100, Math.max(0, (travelled / total) * 100));
    timeline.style.setProperty('--process-progress', `${percent}%`);
  };

  const requestProgress = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });

  const hashTarget = location.hash && document.querySelector(location.hash);
  if (hashTarget?.matches('[data-process-step]')) {
    setTimeout(() => hashTarget.scrollIntoView({ block: 'start' }), 80);
  }
})();

/* NINEWORKS performance motion — progressive enhancement */
(() => {
  const root = document.querySelector('.performance-page main');
  if (!root || root.dataset.pfMotionInitialized) return;
  root.dataset.pfMotionInitialized = 'true';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countTargets = [...root.querySelectorAll('.pf-stat strong, .pf-transaction > strong')];
  const bars = [...root.querySelectorAll('.pf-bar-fill')];
  if (reduced || !('IntersectionObserver' in window)) return;

  const ease = t => 1 - Math.pow(1 - t, 3);
  const numberFormat = new Intl.NumberFormat('ko-KR');
  const animateCount = el => {
    if (el.dataset.pfAnimated) return;
    el.dataset.pfAnimated = '1';
    const original = el.textContent;
    const pieces = [...original.matchAll(/\d[\d,]*(?:\.\d+)?/g)];
    if (!pieces.length) return;
    const values = pieces.map(m => Number(m[0].replace(/,/g,'')));
    const decimals = pieces.map(m => (m[0].split('.')[1] || '').length);
    const offsets = pieces.map(m => ({start:m.index,end:m.index+m[0].length}));
    const duration = 1150;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1,(now-start)/duration);
      const p = ease(t);
      let rendered='', position=0;
      offsets.forEach((item,i)=>{
        rendered += original.slice(position,item.start);
        const value = values[i]*p;
        rendered += decimals[i] ? value.toLocaleString('ko-KR',{minimumFractionDigits:decimals[i],maximumFractionDigits:decimals[i]}) : numberFormat.format(Math.round(value));
        position=item.end;
      });
      el.textContent = rendered+original.slice(position);
      if(t<1) requestAnimationFrame(tick);
      else el.textContent = original;
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, {threshold:0.35});
  countTargets.forEach(el => counterObserver.observe(el));

  bars.forEach(bar => {
    bar.style.transformOrigin='left center';
    bar.style.transform='scaleX(0)';
    bar.style.transition='transform 1100ms cubic-bezier(.2,.75,.15,1)';
    bar.style.willChange='transform';
  });
  const barObserver = new IntersectionObserver((entries,observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => { entry.target.style.transform='scaleX(1)'; });
      observer.unobserve(entry.target);
      entry.target.addEventListener('transitionend',()=>{entry.target.style.willChange='auto';},{once:true});
    });
  },{threshold:0.25});
  bars.forEach(el=>barObserver.observe(el));

  const reveals=[...root.querySelectorAll('.pf-company-card,.pf-registration-card,.pf-transaction,.pf-source__box')];
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('pf-motion-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:0.12});
  reveals.forEach(el=>{el.classList.add('pf-motion-ready');revealObserver.observe(el);});
})();

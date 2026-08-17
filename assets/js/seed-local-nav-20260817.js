(() => {
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const pageKey = (path === 'index.html' || window.location.pathname.endsWith('/')) ? 'home' : path.replace(/\.html$/i, '');
  const supported = new Set([
    'about','branding','project','portfolio','magazine','solutions','develop',
    'print-editorial','package-production','package-sample'
  ]);
  if (!supported.has(pageKey) || document.body.classList.contains('portfolio-detail-page')) return;

  const main = document.querySelector('main');
  if (!main || main.querySelector(':scope > .nw-doc-layout')) return;

  document.body.classList.add('nw-doc-page');

  const layout = document.createElement('div');
  layout.className = 'nw-doc-layout';
  const sidebar = document.createElement('aside');
  sidebar.className = 'nw-local-sidebar';
  sidebar.setAttribute('aria-label', '페이지 내 탐색');
  const content = document.createElement('div');
  content.className = 'nw-doc-content';

  const existingChildren = Array.from(main.children);
  existingChildren.forEach((node) => content.appendChild(node));
  layout.append(sidebar, content);
  main.appendChild(layout);

  const makeGroup = (label) => {
    const group = document.createElement('div');
    group.className = 'nw-local-sidebar__group';
    if (label) {
      const title = document.createElement('p');
      title.className = 'nw-local-sidebar__label';
      title.textContent = label;
      group.appendChild(title);
    }
    const nav = document.createElement('nav');
    nav.className = 'nw-local-sidebar__nav';
    group.appendChild(nav);
    sidebar.appendChild(group);
    return nav;
  };

  const setActive = (buttons, active) => buttons.forEach((button) => button.classList.toggle('is-active', button === active));

  const makeAnchorNav = (items, label = 'On this page') => {
    const nav = makeGroup(label);
    const controls = [];
    items.forEach((item, index) => {
      if (!item.target) return;
      if (!item.target.id) item.target.id = `section-${pageKey}-${index + 1}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nw-local-sidebar__item';
      button.textContent = item.label;
      button.addEventListener('click', () => {
        item.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(controls, button);
      });
      nav.appendChild(button);
      controls.push(button);
    });
    if (controls[0]) controls[0].classList.add('is-active');

    if ('IntersectionObserver' in window && items.length) {
      const byTarget = new Map(items.map((item, index) => [item.target, controls[index]]));
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const control = byTarget.get(visible.target);
        if (control) setActive(controls, control);
      }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
      items.forEach((item) => observer.observe(item.target));
    }
    return controls;
  };

  const makeLinkGroup = (label, links) => {
    const nav = makeGroup(label);
    links.forEach((item) => {
      const a = document.createElement('a');
      a.className = 'nw-local-sidebar__item nw-local-sidebar__item--link';
      a.href = item.href;
      a.textContent = item.label;
      if (item.current) a.classList.add('is-active');
      nav.appendChild(a);
    });
  };

  const labelForSection = (section, index) => {
    if (index === 0) return 'Overview';
    const eyebrow = section.querySelector('.eyebrow');
    const heading = section.querySelector('h1,h2,h3');
    const raw = (eyebrow?.textContent || heading?.textContent || `Section ${index + 1}`).trim().replace(/\s+/g, ' ');
    return raw.length > 28 ? `${raw.slice(0, 27)}…` : raw;
  };

  const buildAutoSections = () => {
    const sections = Array.from(content.children).filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.matches('script,style')) return false;
      return node.matches('section,.page-hero,.portfolio-hero,.magazine-hero');
    });
    const usable = sections.filter((section, index) => index === 0 || !section.classList.contains('cta'));
    return usable.slice(0, 8).map((target, index) => ({ target, label: labelForSection(target, index) }));
  };

  const proxyFilter = (selector, attr, label) => {
    const source = content.querySelector(selector);
    if (!source) return false;
    const originals = Array.from(source.querySelectorAll(`[${attr}]`));
    if (!originals.length) return false;
    const nav = makeGroup(label);
    const controls = [];
    originals.forEach((original) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nw-local-sidebar__item';
      button.textContent = original.textContent.trim();
      if (original.classList.contains('is-active')) button.classList.add('is-active');
      button.addEventListener('click', () => {
        original.click();
        setActive(controls, button);
        const archive = content.querySelector('.portfolio-index-head,.portfolio-list,.magazine-archive');
        archive?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      nav.appendChild(button);
      controls.push(button);
    });
    return true;
  };

  if (pageKey === 'portfolio') {
    proxyFilter('.portfolio-filter', 'data-filter', 'Portfolio');
    makeLinkGroup('Explore', [
      { label:'Branding', href:'branding.html' },
      { label:'Selected Projects', href:'project.html' }
    ]);
  } else if (pageKey === 'magazine') {
    proxyFilter('.magazine-filter', 'data-magazine-filter', 'Magazine');
    makeLinkGroup('Explore', [
      { label:'Branding', href:'branding.html' },
      { label:'Projects', href:'project.html' },
      { label:'Portfolio', href:'portfolio.html' }
    ]);
  } else if (['solutions','develop','print-editorial','package-production','package-sample'].includes(pageKey)) {
    makeLinkGroup('Solutions', [
      { label:'Overview', href:'solutions.html', current:pageKey === 'solutions' },
      { label:'Website / System', href:'develop.html', current:pageKey === 'develop' },
      { label:'Print Design', href:'print-editorial.html', current:pageKey === 'print-editorial' },
      { label:'Print / Package Production', href:'package-production.html', current:pageKey === 'package-production' },
      { label:'Package Sample', href:'package-sample.html', current:pageKey === 'package-sample' }
    ]);
    const sections = buildAutoSections();
    if (sections.length > 1) makeAnchorNav(sections, 'On this page');
  } else if (pageKey === 'branding') {
    makeAnchorNav(buildAutoSections(), 'Branding');
    makeLinkGroup('Explore', [
      { label:'Selected Projects', href:'project.html' },
      { label:'Portfolio', href:'portfolio.html' }
    ]);
  } else if (pageKey === 'project') {
    makeAnchorNav(buildAutoSections(), 'Projects');
    makeLinkGroup('Explore', [
      { label:'Branding', href:'branding.html' },
      { label:'All Portfolio', href:'portfolio.html' }
    ]);
  } else if (pageKey === 'about') {
    makeAnchorNav(buildAutoSections(), 'About');
    makeLinkGroup('Explore', [
      { label:'Branding', href:'branding.html' },
      { label:'Projects', href:'project.html' },
      { label:'Solutions', href:'solutions.html' }
    ]);
  }
})();

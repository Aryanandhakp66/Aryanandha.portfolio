/* ============================================================
   Aryanandha K P - editorial portfolio interactions
   Subtle. Calm. Cinematic.
   ============================================================ */

// 1) Nav shrink on scroll
(function navScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 16) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 2) Reveal on scroll - auto-tag common targets, plus any .reveal
(function reveal() {
  const auto = document.querySelectorAll(
    '.section-head, .feature, .timeline__item, .footer__big, .footer__grid, ' +
    '.cs-banner, .cs-section, .cs-quote, .cs-figure, .cs-final, ' +
    '.cw-hero__inner, .cw-hero__cover, .cw-hero__strip, .cw-section, ' +
    '.cw-stats, .cw-quote, .cw-end'
  );
  auto.forEach(el => el.classList.add('reveal'));

  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(el => io.observe(el));
})();

// 3) Hero parallax - sketch drifts gently against the type
(function heroParallax() {
  const sketch = document.querySelector('.hero__sketch');
  if (!sketch) return;
  let raf = null;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        sketch.style.transform = `translate3d(0, ${y * 0.08}px, 0) scale(${1 + y * 0.00012})`;
      }
      raf = null;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 4) Hero entrance - staged reveal of intro / title / sub
(function heroEnter() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  requestAnimationFrame(() => hero.classList.add('is-ready'));
})();

// 5) Hero water - ripples that trail the cursor
(function heroWater() {
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('.hero__water');
  if (!hero || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  const ripples = [];

  function resize() {
    const r = hero.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let lastX = -999, lastY = -999, lastT = 0;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const now = performance.now();
    const dx = x - lastX, dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    if (dist > 14 || now - lastT > 60) {
      ripples.push({ x, y, r: 6, alpha: 0.55, max: 90 + Math.random() * 60 });
      if (Math.random() < 0.4) {
        ripples.push({ x: x + (Math.random()-0.5)*18, y: y + (Math.random()-0.5)*18, r: 4, alpha: 0.35, max: 60 + Math.random() * 40 });
      }
      lastX = x; lastY = y; lastT = now;
      if (ripples.length > 80) ripples.splice(0, ripples.length - 80);
    }
  });

  hero.addEventListener('click', (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ripples.push({ x, y, r: 10, alpha: 0.8, max: 180 });
  });

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (let i = ripples.length - 1; i >= 0; i--) {
      const p = ripples[i];
      p.r += (p.max - p.r) * 0.04;
      p.alpha *= 0.955;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(60, 90, 140, ${p.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0, p.r - 6), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(120, 160, 200, ${p.alpha * 0.45})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      if (p.alpha < 0.02 || p.r >= p.max - 0.5) ripples.splice(i, 1);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// 6) Hero doodles - gentle mouse parallax
(function doodleParallax() {
  const hero = document.querySelector('.hero');
  const doodles = document.querySelectorAll('.doodle');
  if (!hero || !doodles.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 720px)').matches) return;

  const depths = Array.from(doodles).map(() => 6 + Math.random() * 14);
  let raf = null, tx = 0, ty = 0;

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      doodles.forEach((d, i) => {
        const depth = depths[i];
        d.style.setProperty('--mx', `${tx * depth}px`);
        d.style.setProperty('--my', `${ty * depth}px`);
      });
      raf = null;
    });
  });
  hero.addEventListener('mouseleave', () => {
    doodles.forEach(d => {
      d.style.setProperty('--mx', '0px');
      d.style.setProperty('--my', '0px');
    });
  });
})();

// 6) Email pill - copy to clipboard with feedback
(function emailPill() {
  const pill = document.querySelector('.email-pill');
  if (!pill) return;
  let resetTimer = null;
  pill.addEventListener('click', async () => {
    const email = pill.dataset.email || '';
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    pill.classList.add('is-copied');
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => pill.classList.remove('is-copied'), 1600);
  });
})();

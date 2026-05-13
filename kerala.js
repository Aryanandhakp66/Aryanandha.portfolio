/* ============================================================
   Aryanandha - Kerala Edition interactions
   ============================================================ */

// Reveal on scroll
(function kReveal() {
  const targets = document.querySelectorAll(
    '.k-head, .k-feature, .k-timeline__item, .k-footer__big, .k-footer__grid'
  );
  targets.forEach(el => el.classList.add('k-reveal'));
  if (!targets.length || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }
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

// Email pill - copy to clipboard
(function kEmailPill() {
  const pill = document.querySelector('.k-email');
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

// Motif gentle mouse parallax in hero
(function kMotifParallax() {
  const hero = document.querySelector('.k-hero');
  const motifs = document.querySelectorAll('.k-motif');
  if (!hero || !motifs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 720px)').matches) return;

  const depths = Array.from(motifs).map(() => 8 + Math.random() * 16);
  let raf = null;

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      motifs.forEach((d, i) => {
        const depth = depths[i];
        d.style.translate = `${tx * depth}px ${ty * depth}px`;
      });
      raf = null;
    });
  });
  hero.addEventListener('mouseleave', () => {
    motifs.forEach(d => { d.style.translate = '0 0'; });
  });
})();

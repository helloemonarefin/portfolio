/**
 * Scroll reveal — elements with [data-reveal] rise and fade in, once, when they come into view.
 * Elements that appear together are staggered by their position on screen (top → bottom,
 * left → right) using --m-reveal-stagger from the Motion settings.
 * A [data-reveal-group] (e.g. a carousel row) reveals all its [data-reveal] children together,
 * ordered left → right, when the group itself comes into view.
 * Skipped entirely under prefers-reduced-motion (the content is simply visible).
 */
export function initReveal() {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-on')) return;

  const stagger = () => parseFloat(getComputedStyle(root).getPropertyValue('--m-reveal-stagger')) || 0.05;

  const show = (els: HTMLElement[]) => {
    const s = stagger();
    els
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .sort((a, b) => Math.round(a.r.top - b.r.top) || a.r.left - b.r.left)
      .forEach(({ el, r }, i) => {
        // Items outside the screen horizontally (carousel slides) don't wait their turn.
        const offscreen = r.right < 0 || r.left > window.innerWidth;
        el.style.setProperty('--reveal-delay', `${offscreen ? 0 : i * s}s`);
        el.classList.add('is-revealed');
      });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const batch: HTMLElement[] = [];
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.hasAttribute('data-reveal-group')) {
          batch.push(...el.querySelectorAll<HTMLElement>('[data-reveal]'));
        } else {
          batch.push(el);
        }
      }
      if (batch.length) show(batch);
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.01 },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((g) => io.observe(g));
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (!el.closest('[data-reveal-group]')) io.observe(el);
  });
}

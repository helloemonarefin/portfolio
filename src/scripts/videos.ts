/**
 * Background videos (ui/Media.astro): load late, play only while visible.
 *  - Lazy videos (`data-lazy-video`) have no src until their group comes within 400px of the screen.
 *    A "group" is the nearest `[data-video-group]` (e.g. a Showcase row, so the next slides are ready
 *    before they slide in) or the video itself.
 *  - Autoplay videos play while their group is on screen and pause when it isn't (saves battery/CPU).
 *  - Reduced motion: they never autoplay (DESIGN_SYSTEM §0 rule 5); they show the poster / first frame.
 */
export function initVideos() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]')];
  if (!videos.length) return;

  if (reduce) videos.forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

  const load = (v: HTMLVideoElement) => {
    const source = v.querySelector<HTMLSourceElement>('source[data-src]');
    if (!source) return;
    source.src = source.dataset.src!;
    source.removeAttribute('data-src');
    v.load();
  };

  const groups = new Map<Element, HTMLVideoElement[]>();
  for (const v of videos) {
    const g = v.closest('[data-video-group]') ?? v;
    groups.set(g, [...(groups.get(g) ?? []), v]);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        for (const v of groups.get(e.target) ?? []) {
          if (e.isIntersecting) {
            load(v);
            if (!reduce) v.play().catch(() => {});
          } else v.pause();
        }
      }
    },
    { rootMargin: '400px 0px' },
  );
  groups.forEach((_, g) => io.observe(g));
}

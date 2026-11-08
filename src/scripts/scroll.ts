/**
 * Smooth scrolling (Lenis) + scroll lock shared by the project modal and the mobile menu.
 * https://github.com/darkroomengineering/lenis
 * Lenis respects prefers-reduced-motion by itself (no smoothing, instant jumps).
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

const navHeight = () => (window.matchMedia('(min-width: 1024px)').matches ? 85 : 64);

export function initScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    anchors: { offset: -navHeight() }, // land below the sticky nav
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  });
  return lenis;
}

/** Lock / unlock page scrolling (modal, mobile menu). */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('is-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

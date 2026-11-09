/**
 * Motion settings → CSS custom properties.
 *
 * The Keystatic "Motion" page (keystatic.config.ts → `motion`) stores, per animation,
 * an easing (Ease: preset or custom Bézier · Spring: stiffness/damping/mass), a time and
 * a delay. This file turns those into CSS variables such as
 *   --m-hero-arc-ease: cubic-bezier(.15,.32,.1,.93);  --m-hero-arc-time: 1.2s;  --m-hero-arc-delay: 0s;
 * which the components use. Springs become a CSS `linear()` curve sampled from real spring physics,
 * and their time is calculated from the spring (the Time field is ignored for springs).
 */
import { getCollection } from 'astro:content';

export type Easing =
  | { discriminant: 'ease'; value: { preset: string; bezier: string } }
  | { discriminant: 'spring'; value: { stiffness: number; damping: number; mass: number } };

type Anim = { easing: Easing; time: number; delay?: number };

const PRESETS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  expoOut: [0.16, 1, 0.3, 1],
  smooth: [0.22, 1, 0.36, 1],
};

const round = (n: number, d = 4) => Math.round(n * 10 ** d) / 10 ** d;

/** Parse "0.15, 0.32, 0.1, 0.93" (commas or spaces). Returns null if it isn't 4 numbers. */
export function parseBezier(text: string): [number, number, number, number] | null {
  const nums = (text ?? '').split(/[\s,]+/).filter(Boolean).map(Number);
  if (nums.length !== 4 || nums.some((n) => !Number.isFinite(n))) return null;
  const [x1, y1, x2, y2] = nums as [number, number, number, number];
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return null; // x values must be 0–1
  return [x1, y1, x2, y2];
}

/** Damped spring from 0 → 1. Returns sampled positions and the time it takes to settle. */
function spring(stiffness: number, damping: number, mass: number) {
  const k = Math.max(1, stiffness);
  const c = Math.max(0, damping);
  const m = Math.max(0.1, mass);
  const dt = 1 / 600;
  let x = 0;
  let v = 0;
  let t = 0;
  const trace: [number, number][] = [[0, 0]];
  let settledFor = 0;
  while (t < 10) {
    const a = (-k * (x - 1) - c * v) / m;
    v += a * dt;
    x += v * dt;
    t += dt;
    trace.push([t, x]);
    settledFor = Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01 ? settledFor + dt : 0;
    if (settledFor > 0.05) break;
  }
  const duration = t;
  const samples = 48;
  const points: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const target = (duration * i) / samples;
    const p = trace.find(([tt]) => tt >= target) ?? trace[trace.length - 1]!;
    points.push(i === samples ? 1 : round(p[1], 4));
  }
  return { css: `linear(${points.join(', ')})`, duration: round(duration, 3) };
}

/** CSS easing + the effective time (springs compute their own). */
export function easingToCss(easing: Easing | undefined, fallback: string, time: number) {
  if (!easing) return { ease: fallback, time };
  if (easing.discriminant === 'spring') {
    const s = spring(easing.value.stiffness, easing.value.damping, easing.value.mass);
    return { ease: s.css, time: s.duration };
  }
  const { preset, bezier } = easing.value;
  const b = preset && preset !== 'custom' ? PRESETS[preset] : parseBezier(bezier);
  return { ease: b ? `cubic-bezier(${b.join(', ')})` : fallback, time };
}

/** Defaults = the values from DESIGN_SYSTEM §6 (used if a setting is missing or invalid). */
const DEFAULT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Build the :root { --m-… } block from the Motion settings. */
export async function motionCss(): Promise<string> {
  // Each Motion page is its own file; merge them into one object of blocks.
  const entries = await getCollection('motion');
  if (!entries.length) return '';
  const m = Object.assign({}, ...entries.map((e) => e.data)) as Record<string, any>;
  const vars: string[] = [];
  const add = (name: string, anim: Anim | undefined, fallbackEase = DEFAULT_EASE) => {
    if (!anim) return;
    const { ease, time } = easingToCss(anim.easing, fallbackEase, anim.time);
    vars.push(`--m-${name}-ease: ${ease};`, `--m-${name}-time: ${time}s;`);
    if (anim.delay != null) vars.push(`--m-${name}-delay: ${anim.delay}s;`);
  };

  add('hero-arc', m.heroArc);
  add('hero-portrait', m.heroPortrait);
  add('hero-pill', m.heroPill);
  add('hero-title', m.heroTitle);
  add('hero-sub', m.heroSubtitle);
  add('hero-cta1', m.heroSecondaryButton);
  add('hero-cta2', m.heroPrimaryButton);

  add('nav', m.navIntro);
  if (m.navIntro) {
    vars.push(
      `--m-nav-distance: ${m.navIntro.distance ?? 150}px;`,
      `--m-nav-stagger: ${m.navIntro.linkStagger ?? 0.05}s;`,
      `--m-nav-button-gap: ${m.navIntro.buttonGap ?? 0.1}s;`,
    );
  }

  add('reveal', m.reveal);
  if (m.reveal) vars.push(`--m-reveal-distance: ${m.reveal.distance ?? 24}px;`, `--m-reveal-stagger: ${m.reveal.stagger ?? 0.05}s;`);

  add('button', m.buttonSweep);
  add('card', m.cardHover);
  add('roll', m.textRoll);
  if (m.textRoll) vars.push(`--m-roll-stagger: ${m.textRoll.stagger ?? 0.02}s;`);
  add('modal', m.modal);

  return `:root{${vars.join('')}}`;
}

/**
 * Design settings (Keystatic → Design: Colours, Borders, Hero layout) → CSS custom properties.
 * Output uses `:root:root` so it always wins over the defaults in src/styles/tokens.css.
 * Values are validated here as well (only real colours / numbers reach the CSS).
 */
import { getCollection } from 'astro:content';

const COLOR = /^(#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(\s*[\d.%]+\s*,\s*[\d.%]+\s*,\s*[\d.%]+\s*(,\s*[\d.%]+\s*)?\))$/;

/** Keystatic field (group.key) → CSS variable(s). */
const COLOR_VARS: Record<string, string[]> = {
  'brand.accent': ['--button-primary-bg-hover', '--text-accent'],
  'text.primary': ['--text-primary'],
  'text.secondary': ['--text-secondary'],
  'text.tertiary': ['--text-tertiary'],
  'text.inverse': ['--text-inverse'],
  'background.primary': ['--bg-primary'],
  'background.secondary': ['--bg-secondary', '--button-secondary-bg-hover'],
  'background.tertiary': ['--bg-tertiary'],
  'border.primary': ['--border-primary'],
  'border.secondary': ['--border-secondary'],
  'border.subtle': ['--border-subtle'],
  'button.primaryBg': ['--button-primary-bg'],
  'button.primaryText': ['--button-primary-text'],
  'button.primaryChip': ['--button-primary-chip'],
  'button.secondaryBg': ['--button-secondary-bg'],
  'button.secondaryText': ['--button-secondary-text'],
  'button.secondaryBorder': ['--button-secondary-border'],
  'surface.overlay': ['--surface-overlay'],
  'surface.scrim': ['--surface-scrim'],
  'surface.live': ['--status-live'],
};

const px = (v: unknown, min = 0, max = 2000) =>
  typeof v === 'number' && Number.isFinite(v) ? `${Math.min(max, Math.max(min, v))}px` : null;

export async function designCss(): Promise<string> {
  const files = Object.fromEntries((await getCollection('design')).map((e) => [e.id, e.data]));
  const root: string[] = [];

  // Colours
  for (const [group, fields] of Object.entries(files.colors ?? {})) {
    for (const [key, value] of Object.entries(fields ?? {})) {
      const vars = COLOR_VARS[`${group}.${key}`];
      if (!vars || typeof value !== 'string' || !COLOR.test(value.trim())) continue;
      for (const v of vars) root.push(`${v}: ${value.trim()};`);
    }
  }

  // Border weights
  const w = files.borders?.widths ?? {};
  const hairline = px(w.hairline, 0, 8);
  const thin = px(w.thin, 0, 8);
  if (hairline) root.push(`--border-width: ${hairline};`);
  if (thin) root.push(`--border-width-thin: ${thin};`);

  // Hero layout (read by Hero.astro: -m = phone/tablet, -d = desktop)
  const hero = files.hero ?? {};
  const map: [string, string, unknown][] = [
    ['mobile', 'm', hero.mobile],
    ['desktop', 'd', hero.desktop],
  ];
  for (const [, suffix, v] of map) {
    const g = (v ?? {}) as Record<string, unknown>;
    const size = px(g.portraitSize, 40, 600);
    const top = px(g.gapBelowNav, 0, 600);
    const bottom = px(g.spaceBelowButtons, 0, 600);
    if (size) root.push(`--hero-portrait-size-${suffix}: ${size};`);
    if (top) root.push(`--hero-gap-below-nav-${suffix}: ${top};`);
    if (bottom) root.push(`--hero-space-below-ctas-${suffix}: ${bottom};`);
  }

  return root.length ? `:root:root{${root.join('')}}` : '';
}

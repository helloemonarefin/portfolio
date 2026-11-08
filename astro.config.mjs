// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Keystatic's admin (/keystatic) needs a server. Until we add a hosting adapter
// in Phase 9, it only runs with `npm run dev` on your computer; `npm run build`
// produces a fully static site without it.
const isDev = process.argv.includes('dev');

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://emonarefin.com',

  // Inter, self-hosted: downloaded at build time and served from this site.
  // https://docs.astro.build/en/guides/fonts/
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
  ],

  // React + Markdoc are only used by the Keystatic admin, never on public pages.
  integrations: [react(), markdoc(), ...(isDev ? [keystatic()] : [])],
});

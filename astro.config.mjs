// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

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
});

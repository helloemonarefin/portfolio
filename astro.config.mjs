// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

/**
 * Dev-only fix for an Astro bug: Astro keeps a generated list of every image used by your content
 * (.astro/content-assets.mjs) but never removes an entry when the content stops using that image.
 * So when Keystatic deletes an image (e.g. you switch a Showcase item from Image to Video), every page
 * shows "ImageNotFound" until the dev server is restarted.
 * This plugin watches for deleted files in src/assets/, removes the list entries whose image file no
 * longer exists, and reloads the page. Has no effect on `npm run build` or the live site.
 * @returns {import('vite').Plugin}
 */
function cleanStaleContentAssets() {
  return {
    name: 'clean-stale-content-assets',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root;
      const listFile = path.join(root, '.astro', 'content-assets.mjs');
      /** @type {ReturnType<typeof setTimeout> | undefined} */
      let timer;

      const clean = () => {
        if (!fs.existsSync(listFile)) return;
        let src = fs.readFileSync(listFile, 'utf8');
        let removed = 0;
        // import __ASTRO_IMAGE_IMPORT_7 from "../../../assets/x.png?astroContentImageFlag=&importer=src%2F...yaml";
        const importRe = /^import (__ASTRO_IMAGE_IMPORT_\d+) from "([^"?]+)\?[^"]*importer=([^"&]+)[^"]*";\n?/gm;
        for (const [line, name, rel, importer] of [...src.matchAll(importRe)]) {
          const file = path.resolve(root, path.dirname(decodeURIComponent(importer)), rel);
          if (fs.existsSync(file)) continue;
          src = src.replace(line, '');
          src = src.replace(new RegExp(`\\["[^"]*", ${name}\\],? ?`), '');
          removed++;
        }
        if (!removed) return;
        src = src.replace(/, \]\);/, ']);');
        fs.writeFileSync(listFile, src);
        for (const mod of server.moduleGraph.getModulesByFile(listFile) ?? []) server.moduleGraph.invalidateModule(mod);
        server.config.logger.info(`[clean-stale-content-assets] removed ${removed} deleted image(s) from Astro's list — reloading`);
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.on('unlink', (file) => {
        if (!file.replaceAll('\\', '/').includes('/src/assets/')) return;
        clearTimeout(timer);
        timer = setTimeout(clean, 300);
      });
    },
  };
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://emonarefin.com',

  // Put the (small) CSS inside each page instead of separate files: no extra requests before the first paint.
  build: { inlineStylesheets: 'always' },

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

  // Netlify: every page is still pre-built as static HTML. Only the Keystatic admin (/keystatic and its
  // /api/keystatic routes) runs on demand as a Netlify Function, so you can edit content on the live site.
  adapter: netlify(),

  // React + Markdoc are only used by the Keystatic admin, never on public pages.
  // Sitemap (/sitemap-index.xml) for search engines; the private /styleguide is left out.
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/styleguide') }),
  ],

  vite: {
    plugins: [cleanStaleContentAssets()],
  },
});

/**
 * Content collections — how Astro reads what Keystatic saves.
 *
 * ⚠️ Keep this file EXACTLY in sync with `keystatic.config.ts`
 *    (same collections, same field names). Change one → change the other.
 *
 * Content model: DESIGN_SYSTEM.md §10 / BUILD_PROMPT.md §4.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Each entry lives in its own folder: <slug>/index.yaml → id = <slug>. */
const folderId = ({ entry }: { entry: string }) => entry.split('/')[0]!;

// Keystatic leaves empty optional fields out (or saves null) — treat both as "".
const optionalText = z.string().nullish().transform((v) => v ?? '');
const optionalUrl = z.url().nullish().transform((v) => v ?? '');

// ─── Projects: Work grid, Showcase Gallery, Project Modal ───────────────────
const projects = defineCollection({
  loader: glob({ pattern: '*/index.yaml', base: './src/content/projects', generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['agency', 'saas', 'portfolio', 'templates']),
      tags: z.array(z.string()).max(3).default([]),
      summary: z.string(),
      thumbnail: image(),
      gallery: z.array(image()).min(1).max(5),
      liveUrl: optionalUrl,
      priceRange: optionalText,
      duration: optionalText,
      scope: optionalText,
      year: z.number().int().nullish(),
      showcase: z.enum(['none', 'featured', 'more']).default('none'),
      order: z.number().int().nullish().transform((v) => v ?? 0),
      draft: z.boolean().default(false),
    }),
});

// ─── Photos: About → Through My Lens ────────────────────────────────────────
const photos = defineCollection({
  loader: glob({ pattern: '*/index.yaml', base: './src/content/photos', generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      alt: z.string().min(1),
      image: image(),
      size: z.enum(['wide', 'square']).default('wide'),
      order: z.number().int().nullish().transform((v) => v ?? 0),
    }),
});

// ─── Settings (singleton) ───────────────────────────────────────────────────
const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: './src/content/settings' }),
  schema: z.object({
    email: optionalText,
    calLink: optionalText,
    siteDescription: optionalText,
    socials: z.object({
      linkedin: optionalUrl,
      x: optionalUrl,
      dribbble: optionalUrl,
      behance: optionalUrl,
      resumeUrl: optionalUrl,
    }),
    stats: z.object({
      years: optionalText,
      projects: optionalText,
    }),
    currentRole: z.object({
      title: optionalText,
      company: optionalText,
      summary: optionalText,
    }),
    milestones: z.array(z.object({ year: optionalText, title: optionalText })).default([]),
    aboutBio: z.array(z.string()).max(2).default([]),
  }),
});

// ─── Pricing (singleton) ────────────────────────────────────────────────────
const pricing = defineCollection({
  loader: glob({ pattern: 'pricing.yaml', base: './src/content/pricing' }),
  schema: z.object({
    plans: z
      .array(
        z.object({
          name: z.string(),
          description: optionalText,
          price: optionalText,
          unit: optionalText,
          badge: optionalText,
          features: z.array(z.string()).default([]),
          ctaLabel: z.string().nullish().transform((v) => v || 'Book a call'),
        }),
      )
      .length(2),
  }),
});

export const collections = { projects, photos, settings, pricing };

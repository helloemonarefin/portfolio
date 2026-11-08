/**
 * Content collections — how Astro reads what Keystatic saves.
 *
 * ⚠️ Keep this file EXACTLY in sync with `keystatic.config.ts`
 *    (same collections, same field names). Change one → change the other.
 *
 * Content model: DESIGN_SYSTEM.md §10 / BUILD_PROMPT.md §4.
 */
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Each entry lives in its own folder: <slug>/index.yaml → id = <slug>. */
const folderId = ({ entry }: { entry: string }) => entry.split('/')[0]!;

// Keystatic leaves empty optional fields out (or saves null) — treat both as "".
const optionalText = z.string().nullish().transform((v) => v ?? '');
const optionalUrl = z.url().nullish().transform((v) => v ?? '');

/**
 * Media = Image or Video (matches `media()` in keystatic.config.ts).
 * Image → optimised by Astro. Video → a URL under /media/…, plus an optional poster image.
 */
const media = (image: SchemaContext['image']) =>
  z.discriminatedUnion('discriminant', [
    z.object({ discriminant: z.literal('image'), value: image() }),
    z.object({
      discriminant: z.literal('video'),
      value: z.object({ file: z.string().min(1), poster: image().nullish() }),
    }),
  ]);

// ─── Projects: Work grid, Showcase Gallery, Project Modal ───────────────────
const projects = defineCollection({
  loader: glob({ pattern: '*/index.yaml', base: './src/content/projects', generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['agency', 'saas', 'portfolio', 'templates']),
      tags: z.array(z.string()).max(3).default([]),
      summary: z.string(),
      thumbnail: media(image),
      gallery: z.array(media(image)).min(1).max(5),
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
      image: media(image),
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

// ─── Motion (singleton) — matches `motion` in keystatic.config.ts ───────────
const easingSchema = z.discriminatedUnion('discriminant', [
  z.object({
    discriminant: z.literal('ease'),
    value: z.object({ preset: z.string().default('custom'), bezier: z.string().default('') }),
  }),
  z.object({
    discriminant: z.literal('spring'),
    value: z.object({
      stiffness: z.number().nullish().transform((v) => v ?? 300),
      damping: z.number().nullish().transform((v) => v ?? 30),
      mass: z.number().nullish().transform((v) => v ?? 1),
    }),
  }),
]);
const num = (fallback: number) => z.number().nullish().transform((v) => v ?? fallback);
const anim = (time: number, delay?: number) =>
  z.object({
    easing: easingSchema,
    time: num(time),
    ...(delay !== undefined ? { delay: num(delay) } : {}),
  });

const motion = defineCollection({
  loader: glob({ pattern: 'motion.yaml', base: './src/content/motion' }),
  schema: z.object({
    heroArc: anim(1.2, 0),
    heroPortrait: anim(1.4, 0.1),
    heroPill: anim(0.7, 0.45),
    heroTitle: anim(0.7, 0.52),
    heroSubtitle: anim(0.7, 0.59),
    heroSecondaryButton: anim(0.7, 0.66),
    heroPrimaryButton: anim(0.7, 0.73),
    navIntro: anim(1, 0.1).extend({ distance: num(150), linkStagger: num(0.05), buttonGap: num(0.1) }),
    reveal: anim(0.8).extend({ distance: num(24), stagger: num(0.05) }),
    buttonSweep: anim(0.45),
    cardHover: anim(0.35),
    textRoll: anim(0.5).extend({ stagger: num(0.02) }),
    modal: anim(0.3),
  }),
});

export const collections = { projects, photos, settings, pricing, motion };

/**
 * Keystatic admin — open http://localhost:4321/keystatic while `npm run dev` runs.
 *
 * ⚠️ Keep this file EXACTLY in sync with `src/content.config.ts`
 *    (same collections, same field names). Change one → change the other.
 *
 * Content model: DESIGN_SYSTEM.md §10 / BUILD_PROMPT.md §4.
 */
import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Media field: an Image / Video switch.
 *  - Image → saved in src/assets/<folder>/<slug>/ (optimised by Astro).
 *  - Video → saved in public/media/<folder>/<slug>/ (served as-is; MP4 or WebM recommended),
 *            with an optional poster image shown while the video loads.
 */
const media = (label: string, folder: 'projects' | 'photos', description?: string) =>
  fields.conditional(
    fields.select({
      label,
      description,
      options: [
        { label: 'Image (PNG, JPG, WebP, AVIF)', value: 'image' },
        { label: 'Video (MP4, WebM, MOV)', value: 'video' },
      ],
      defaultValue: 'image',
    }),
    {
      image: fields.image({
        label: `${label} — image`,
        directory: `src/assets/${folder}`,
        publicPath: `../../../assets/${folder}/`,
        validation: { isRequired: true },
      }),
      video: fields.object({
        file: fields.file({
          label: `${label} — video file`,
          description: 'MP4 (H.264) or WebM plays everywhere. MOV only plays in Safari. Keep it short and under ~10 MB.',
          directory: `public/media/${folder}`,
          publicPath: `/media/${folder}/`,
          validation: { isRequired: true },
        }),
        poster: fields.image({
          label: 'Poster image (optional)',
          description: 'Shown while the video loads. Use the first frame.',
          directory: `src/assets/${folder}`,
          publicPath: `../../../assets/${folder}/`,
        }),
      }),
    },
  );

/**
 * Motion block: Ease (preset or custom Bézier) or Spring, plus time and delay.
 * Converted to CSS in src/lib/motion.ts.
 */
const easing = (defaultBezier: string, defaultPreset = 'custom') =>
  fields.conditional(
    fields.select({
      label: 'Type',
      options: [
        { label: 'Ease', value: 'ease' },
        { label: 'Spring', value: 'spring' },
      ],
      defaultValue: 'ease',
    }),
    {
      ease: fields.object({
        preset: fields.select({
          label: 'Ease',
          description: 'Pick a preset, or "Custom" to use the Bézier below.',
          options: [
            { label: 'Custom (use Bézier)', value: 'custom' },
            { label: 'Linear', value: 'linear' },
            { label: 'Ease', value: 'ease' },
            { label: 'Ease in', value: 'easeIn' },
            { label: 'Ease out', value: 'easeOut' },
            { label: 'Ease in-out', value: 'easeInOut' },
            { label: 'Expo out', value: 'expoOut' },
            { label: 'Smooth (0.22, 1, 0.36, 1)', value: 'smooth' },
          ],
          defaultValue: defaultPreset,
        }),
        bezier: fields.text({
          label: 'Bezier',
          description: 'Four numbers, e.g. 0.15, 0.32, 0.1, 0.93 (first and third between 0 and 1). Tip: shape it on cubic-bezier.com and paste.',
          defaultValue: defaultBezier,
        }),
      }),
      spring: fields.object({
        stiffness: fields.number({ label: 'Stiffness', defaultValue: 300, step: 10 }),
        damping: fields.number({ label: 'Damping', defaultValue: 30, step: 1 }),
        mass: fields.number({ label: 'Mass', defaultValue: 1, step: 0.1 }),
      }),
    },
  );

const anim = (
  label: string,
  d: { bezier: string; time: number; delay?: number; preset?: string },
  extra: Record<string, ReturnType<typeof fields.number>> = {},
) =>
  fields.object(
    {
      easing: easing(d.bezier, d.preset),
      time: fields.number({ label: 'Time (s)', description: 'Ignored for Spring (calculated from the spring).', defaultValue: d.time, step: 0.05 }),
      ...(d.delay !== undefined ? { delay: fields.number({ label: 'Delay (s)', defaultValue: d.delay, step: 0.01 }) } : {}),
      ...extra,
    },
    { label },
  );

export default config({
  // Files are saved in this project folder. Switches to GitHub storage in Phase 9.
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'Emon Arefin' },
    navigation: {
      Content: ['projects', 'photos'],
      Settings: ['settings', 'pricing', 'motion'],
    },
  },

  collections: {
    // ─── Projects: Work grid, Showcase Gallery, Project Modal ───────────────
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*/',
      format: { data: 'yaml' },
      columns: ['title', 'category', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', description: 'e.g. "Portfolio for American Banker"' },
          slug: {
            label: 'Slug',
            description: 'Used in the link that opens this project: emonarefin.com/#project-<slug>',
          },
        }),
        category: fields.select({
          label: 'Category',
          description: 'Drives the filter chips on the Work section.',
          options: [
            { label: 'Agency', value: 'agency' },
            { label: 'SaaS', value: 'saas' },
            { label: 'Portfolio', value: 'portfolio' },
            { label: 'Templates', value: 'templates' },
          ],
          defaultValue: 'portfolio',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          description: 'Up to 3, shown as "Portfolio | AI | Framer".',
          itemLabel: (props) => props.value || 'Tag',
          validation: { length: { max: 3 } },
        }),
        summary: fields.text({
          label: 'Summary',
          description: '2–3 sentences, shown in the project modal.',
          multiline: true,
          validation: { isRequired: true },
        }),
        thumbnail: media(
          'Thumbnail',
          'projects',
          'Work card + Showcase. Image or video, about 4:3, at least 1400px wide. Cropped from the top.',
        ),
        gallery: fields.array(media('Gallery item', 'projects'), {
            label: 'Gallery',
            itemLabel: (props) => (props.discriminant === 'video' ? 'Video' : 'Image'),
            description: '1–5 images or videos for the modal. The first one is shown first.',
            validation: { length: { min: 1, max: 5 } },
          }),
        liveUrl: fields.url({
          label: 'Live site URL',
          description: '"View live site" button — opens in a new tab.',
        }),
        priceRange: fields.text({ label: 'Price range', description: 'e.g. "$600 – $800"' }),
        duration: fields.text({ label: 'Duration', description: 'e.g. "7 – 10 days"' }),
        scope: fields.text({ label: 'Scope', description: 'e.g. "Design + Framer build"' }),
        year: fields.integer({ label: 'Year' }),
        showcase: fields.select({
          label: 'Showcase row',
          description: 'Show this project’s thumbnail in the Showcase Gallery?',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Featured (top row)', value: 'featured' },
            { label: 'More (bottom row)', value: 'more' },
          ],
          defaultValue: 'none',
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Manual sort — lowest number first.',
          defaultValue: 0,
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Tick to hide this project everywhere on the site.',
          defaultValue: false,
        }),
      },
    }),

    // ─── Photos: About → Through My Lens ────────────────────────────────────
    photos: collection({
      label: 'Photos',
      slugField: 'alt',
      path: 'src/content/photos/*/',
      format: { data: 'yaml' },
      columns: ['alt', 'size', 'order'],
      schema: {
        alt: fields.slug({
          name: {
            label: 'Alt text',
            description: 'Describe the photo for screen readers, e.g. "Fishing boats at dawn in Cox’s Bazar".',
            validation: { isRequired: true },
          },
        }),
        image: media('Photo', 'photos'),
        size: fields.select({
          label: 'Size in grid',
          description: 'Wide = 2 columns, Square = 1 column.',
          options: [
            { label: 'Wide', value: 'wide' },
            { label: 'Square', value: 'square' },
          ],
          defaultValue: 'wide',
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lowest number first.',
          defaultValue: 0,
        }),
      },
    }),
  },

  singletons: {
    // ─── Motion: animation timings & curves ─────────────────────────────────
    motion: singleton({
      label: 'Motion',
      path: 'src/content/motion/motion',
      format: { data: 'yaml' },
      schema: {
        heroArc: anim('Hero · Arc', { bezier: '0.15, 0.32, 0.1, 0.93', time: 1.2, delay: 0 }),
        heroPortrait: anim('Hero · Portrait', { bezier: '0.15, 0.32, 0.1, 0.93', time: 1.4, delay: 0.1 }),
        heroPill: anim('Hero · Name pill', { bezier: '0.22, 1, 0.36, 1', time: 0.7, delay: 0.45 }),
        heroTitle: anim('Hero · Heading', { bezier: '0.22, 1, 0.36, 1', time: 0.7, delay: 0.52 }),
        heroSubtitle: anim('Hero · Subtitle', { bezier: '0.22, 1, 0.36, 1', time: 0.7, delay: 0.59 }),
        heroSecondaryButton: anim('Hero · "See works" button', { bezier: '0.22, 1, 0.36, 1', time: 0.7, delay: 0.66 }),
        heroPrimaryButton: anim('Hero · "Book a call" button', { bezier: '0.22, 1, 0.36, 1', time: 0.7, delay: 0.73 }),
        navIntro: anim(
          'Nav intro (Home)',
          { bezier: '0, 0.77, 0.56, 1', time: 1, delay: 0.1 },
          {
            distance: fields.number({ label: 'Distance (px)', description: 'How far above each item starts.', defaultValue: 150, step: 1 }),
            linkStagger: fields.number({ label: 'Link stagger (s)', description: 'Gap between each nav link.', defaultValue: 0.05, step: 0.01 }),
            buttonGap: fields.number({ label: '"Hire Me" extra delay (s)', description: 'Added after the last link.', defaultValue: 0.1, step: 0.01 }),
          },
        ),
        reveal: anim(
          'Scroll reveal (whole site)',
          { bezier: '0.22, 1, 0.36, 1', time: 0.8 },
          {
            distance: fields.number({ label: 'Distance (px)', description: 'How far below each element starts.', defaultValue: 24, step: 1 }),
            stagger: fields.number({ label: 'Stagger (s)', description: 'Gap between elements that appear together.', defaultValue: 0.05, step: 0.01 }),
          },
        ),
        buttonSweep: anim('Button chip sweep', { bezier: '0.22, 1, 0.36, 1', time: 0.45 }),
        cardHover: anim('Work card hover', { bezier: '0, 0, 0.58, 1', time: 0.35, preset: 'easeOut' }),
        textRoll: anim(
          'Text link roll',
          { bezier: '0.22, 1, 0.36, 1', time: 0.5 },
          { stagger: fields.number({ label: 'Letter stagger (s)', defaultValue: 0.02, step: 0.005 }) },
        ),
        modal: anim('Project modal open / close', { bezier: '0.22, 1, 0.36, 1', time: 0.3 }),
      },
    }),

    // ─── Site settings ──────────────────────────────────────────────────────
    settings: singleton({
      label: 'Settings',
      path: 'src/content/settings/settings',
      format: { data: 'yaml' },
      schema: {
        email: fields.text({ label: 'Contact email' }),
        calLink: fields.text({
          label: 'Cal.com link',
          description: 'Username/event, e.g. "emonarefin/30min".',
        }),
        siteDescription: fields.text({
          label: 'Site description (SEO)',
          description: 'Shown by Google and when the link is shared.',
          multiline: true,
        }),
        socials: fields.object(
          {
            linkedin: fields.url({ label: 'LinkedIn' }),
            x: fields.url({ label: 'X / Twitter' }),
            dribbble: fields.url({ label: 'Dribbble' }),
            behance: fields.url({ label: 'Behance' }),
            resumeUrl: fields.url({ label: 'Resume' }),
          },
          { label: 'Social links' },
        ),
        stats: fields.object(
          {
            years: fields.text({ label: 'Years designing', description: 'e.g. "5+"' }),
            projects: fields.text({ label: 'Projects shipped', description: 'e.g. "100+"' }),
          },
          { label: 'About facts' },
        ),
        currentRole: fields.object(
          {
            title: fields.text({ label: 'Role', description: 'e.g. "Product Designer"' }),
            company: fields.text({ label: 'Company', description: 'e.g. "Rubik"' }),
            summary: fields.text({
              label: 'One-line summary',
              description: 'Shown under "Product Designer at Rubik" on the About page.',
              multiline: true,
            }),
          },
          { label: 'Current role' },
        ),
        milestones: fields.array(
          fields.object({
            year: fields.text({ label: 'Year', description: 'e.g. "2019" or "Now"' }),
            title: fields.text({ label: 'Title' }),
          }),
          {
            label: 'Milestones (About timeline)',
            itemLabel: (props) =>
              `${props.fields.year.value || '—'} · ${props.fields.title.value || 'Untitled'}`,
          },
        ),
        aboutBio: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'About bio',
          description: 'Two short paragraphs.',
          itemLabel: (props) => props.value.slice(0, 60) || 'Paragraph',
          validation: { length: { min: 1, max: 2 } },
        }),
      },
    }),

    // ─── Pricing ────────────────────────────────────────────────────────────
    pricing: singleton({
      label: 'Pricing',
      path: 'src/content/pricing/pricing',
      format: { data: 'yaml' },
      schema: {
        plans: fields.array(
          fields.object({
            name: fields.text({ label: 'Plan name' }),
            description: fields.text({ label: 'Description', multiline: true }),
            price: fields.text({ label: 'Price', description: 'e.g. "$2,400"' }),
            unit: fields.text({ label: 'Unit', description: 'e.g. "one-time, starting at" or "/ month"' }),
            badge: fields.text({ label: 'Badge (optional)', description: 'e.g. "Pause or cancel anytime"' }),
            features: fields.array(fields.text({ label: 'Feature' }), {
              label: 'What’s included',
              itemLabel: (props) => props.value || 'Feature',
            }),
            ctaLabel: fields.text({ label: 'Button label', defaultValue: 'Book a call' }),
          }),
          {
            label: 'Plans',
            description: 'Exactly two plans.',
            itemLabel: (props) => props.fields.name.value || 'Plan',
            validation: { length: { min: 2, max: 2 } },
          },
        ),
      },
    }),
  },
});

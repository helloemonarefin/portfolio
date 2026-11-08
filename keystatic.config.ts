/**
 * Keystatic admin — open http://localhost:4321/keystatic while `npm run dev` runs.
 *
 * ⚠️ Keep this file EXACTLY in sync with `src/content.config.ts`
 *    (same collections, same field names). Change one → change the other.
 *
 * Content model: DESIGN_SYSTEM.md §10 / BUILD_PROMPT.md §4.
 */
import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  // Files are saved in this project folder. Switches to GitHub storage in Phase 9.
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'Emon Arefin' },
    navigation: {
      Content: ['projects', 'photos'],
      Settings: ['settings', 'pricing'],
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
        thumbnail: fields.image({
          label: 'Thumbnail',
          description: 'Work card + Showcase image. About 4:3, at least 1400px wide. Cropped from the top.',
          directory: 'src/assets/projects',
          publicPath: '../../../assets/projects/',
          validation: { isRequired: true },
        }),
        gallery: fields.array(
          fields.image({
            label: 'Image',
            directory: 'src/assets/projects',
            publicPath: '../../../assets/projects/',
            validation: { isRequired: true },
          }),
          {
            label: 'Gallery',
            itemLabel: (props) => props.value?.filename ?? 'Image',
            description: '1–5 images for the modal. The first one is shown first.',
            validation: { length: { min: 1, max: 5 } },
          },
        ),
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
        image: fields.image({
          label: 'Photo',
          directory: 'src/assets/photos',
          publicPath: '../../../assets/photos/',
          validation: { isRequired: true },
        }),
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

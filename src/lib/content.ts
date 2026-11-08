/**
 * Helpers for reading CMS content in pages and components.
 * Derived values from BUILD_PROMPT.md §4.5 live here so every component agrees.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Photo = CollectionEntry<'photos'>;

/** Non-draft projects, sorted by `order` (lowest first), then title. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Photos for Through My Lens, sorted by `order`. */
export async function getPhotos(): Promise<Photo[]> {
  const all = await getCollection('photos');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getSettings() {
  const entry = await getEntry('settings', 'settings');
  if (!entry) throw new Error('Missing settings — open /keystatic → Settings and save once.');
  return entry.data;
}

export async function getPricing() {
  const entry = await getEntry('pricing', 'pricing');
  if (!entry) throw new Error('Missing pricing — open /keystatic → Pricing and save once.');
  return entry.data;
}

/** "Works 08" / "View Projects 08": count zero-padded to 2 digits. */
export const padCount = (n: number) => String(n).padStart(2, '0');

/** Display label for a category value, e.g. "saas" → "SaaS". */
export const categoryLabels = {
  agency: 'Agency',
  saas: 'SaaS',
  portfolio: 'Portfolio',
  templates: 'Templates',
} as const;

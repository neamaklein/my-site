import { dimenso } from './dimenso.js';
import { rockse } from './rockse.js';
import { palate } from './palate.js';

export const projects = [dimenso, rockse, palate];

// Reserved dispatch numbers for projects not yet built. Add a real data
// file (see dimenso.js / rockse.js) and remove the matching entry here —
// no other code needs to change.
export const comingSoon = [{ dispatchNumber: '04' }];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

import { dimenso } from './dimenso.js';
import { rockse } from './rockse.js';
import { palate } from './palate.js';
import { spinsip } from './spinsip.js';
import { nextoctober } from './nextoctober.js';
import { achoti } from './achoti.js';

export const projects = [dimenso, rockse, palate, spinsip, nextoctober, achoti];

// Reserved dispatch numbers for projects not yet built. Add a real data
// file (see dimenso.js / rockse.js) and remove the matching entry here —
// no other code needs to change.
export const comingSoon = [];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

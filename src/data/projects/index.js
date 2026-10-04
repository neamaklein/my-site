import { dimenso } from './dimenso.js';

export const projects = [dimenso];

// Reserved dispatch numbers for projects not yet built in Figma. Add a
// real data file (see dimenso.js) and remove the matching entry here —
// no other code needs to change.
export const comingSoon = [
  { dispatchNumber: '02' },
  { dispatchNumber: '03' },
  { dispatchNumber: '04' },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

import { dimenso } from './dimenso.js';

export const projects = [dimenso];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

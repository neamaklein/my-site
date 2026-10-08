// True only in the claude.ai review copy (hash routing). Trials that
// Neama has not approved yet are switched on with this, so the GitHub
// Pages site never shows them.
export const REVIEW = import.meta.env.VITE_ROUTER === 'hash';

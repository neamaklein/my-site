// True only in the claude.ai review copy (hash routing). Trials that
// Neama has not approved yet are switched on with this, so the GitHub
// Pages site never shows them.
export const REVIEW = import.meta.env.VITE_ROUTER === 'hash';

// True inside the review copy's phone view (PhonePreview.jsx), where the
// site runs again in a phone-sized frame: no tools bar there.
export const IN_PHONE = typeof window !== 'undefined' && window.name === 'phone-preview';

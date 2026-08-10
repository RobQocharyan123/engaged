# Design QA — Wedding Invitation Opening Cover

## Evidence

- Source visual truth: `qa/design-reference-option-3.png` (selected generated option 3).
- Desktop implementation: `qa/opening-desktop.png`.
- Mobile implementation: `qa/opening-mobile.png`.
- Revealed invitation states: `qa/invitation-desktop.png` and `qa/invitation-mobile.png`.
- Direct source/implementation comparison: `qa/comparison-desktop.png`.
- Browser console evidence: `qa/browser-console.json`.
- Accessibility/interaction evidence: `qa/accessibility.json`.
- Browser: installed Google Chrome, headless mode.

## Normalization

- Desktop source pixels: 1487 × 1058.
- Desktop implementation pixels and CSS viewport: 1488 × 1058.
- Desktop device scale factor: 1.
- The source is one pixel narrower than the selected viewport. The browser uses `object-fit: cover`; the difference is visually immaterial and does not distort the composition.
- Mobile implementation pixels and CSS viewport: 390 × 844 at device scale factor 1.
- Mobile background source: 853 × 1844, downsampled proportionally through `object-fit: cover`.
- State compared: closed envelope, default theme, before the primary open action.

## Full-view comparison

`qa/comparison-desktop.png` places the selected design and final browser render in one evidence frame. The envelope dimensions, center alignment, seal position, candle/foliage framing, live Armenian copy, primary CTA, and divider align with the selected direction. The cover remains uncluttered and preserves one primary action.

A separate focused crop was not required: this is a single-focus hero with no dense controls, and the equal-scale full comparison keeps all fidelity-critical elements—the names, title, seal, CTA, and divider—clearly readable. The full-size source and implementation captures were also inspected for texture, antialiasing, and focus-target placement.

## Required fidelity surfaces

- Fonts and typography: live copy uses an Armenian-capable serif stack with project-local display fallbacks. Weight, hierarchy, line height, letter spacing, centering, and wrapping match the selected editorial treatment. Live text intentionally replaces baked generated text so copy remains accurate, accessible, and editable.
- Spacing and layout rhythm: the envelope, title block, seal target, CTA, and divider preserve the source proportions at desktop. The purpose-built portrait artwork avoids stretching and keeps all mobile elements clear of the candle/foliage edges.
- Colors and visual tokens: warm charcoal, cream paper, muted brown type, champagne-gold seal/CTA, and candle highlights match the selected palette. Text and focus states remain legible against their surfaces.
- Image quality and asset fidelity: desktop and mobile cover art are high-resolution raster assets derived from the selected direction. The seal, paper, candles, foliage, and divider are real image assets; no CSS/div/SVG stand-ins or placeholders replace target artwork. Alpha validation passed for the divider asset.
- Copy and content: visible Armenian names, invitation title, and open CTA are coherent and correctly presented as app text.
- Icons: the wax seal is preserved in the cover artwork, the CTA divider is a dedicated transparent PNG, and the revealed music control uses the existing Ant Design icon family.
- Responsiveness: verified at 1488 × 1058 and 390 × 844. No clipping, overlap, overflow, or broken hierarchy was observed.
- Accessibility and behavior: the whole cover is one semantic button with an accessible Armenian name, visible keyboard focus around the seal, a large touch target, reduced-motion support, body scroll lock, and an inert/hidden underlying invitation until reveal. The action starts the opening flow once, removes the cover, and exposes/focuses the invitation content.

## Comparison history

1. Initial browser pass found one P2 fidelity issue: the source CTA divider was missing. Fixed by generating a dedicated gold divider asset, removing its chroma key to validated RGBA, and placing it beneath the live CTA.
2. Second browser pass found the divider visibly underscaled relative to the source. Fixed its rendered width and transparent-canvas offset for both desktop and mobile.
3. Final browser pass confirmed the corrected composition. Chrome reported zero console errors. The primary open/reveal interaction returned `coverRemoved: true` and `contentVisible: true`; desktop and mobile closed/open states were captured successfully.

## Findings

- No actionable P0, P1, or P2 differences remain.
- P3 follow-up: the regenerated text-free envelope has slightly more visible paper texture than the original generated concept. This preserves the selected art direction and does not change hierarchy or usability.

## Implementation checklist

- [x] Selected option 3 resolved against the displayed ideation result.
- [x] Desktop and mobile raster artwork installed locally.
- [x] Live Armenian copy and one working open action implemented.
- [x] Hover, focus, disabled/opening, reduced-motion, and reveal states implemented.
- [x] Desktop/mobile browser screenshots captured and compared.
- [x] Browser console and accessibility tree checked.
- [x] Public production build and tests passed.

final result: passed

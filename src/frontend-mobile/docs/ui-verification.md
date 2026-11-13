# Figma UI and WebView recovery review

Design source: https://www.figma.com/design/N5IXZNZZMOOh6ph2HiDCNP/Breakly-%E2%80%93-UI

## Implemented

- Local original Figma SVG artwork and icons, DM Sans and Fraunces fonts, light/dark themes, room composition, shared controls, and typography/spacing across the existing screens.
- Article recovery UI for native main-frame HTTP errors (including 404/500), connection errors, 20-second timeout, invalid URLs, and WebView process termination. Actions: retry, open in browser, return to News.
- A failed load remains failed even if a late load callback arrives. Retry creates a new attempt; unmount cancels the timeout.
- Video loading failures also show a retry UI.
- Browser preview uses iframe recovery with a manual help action: browsers do not expose cross-origin HTTP status or frame-blocking errors to the embedding app.

## Validation completed

- TypeScript: `npx.cmd tsc --noEmit` passed.
- ESLint: `npx.cmd expo lint` passed with one existing axios import warning in `src/core/api/client.ts`.
- Load lifecycle tests: `node --experimental-strip-types --test tests/articleLoad.test.cjs` passed all 7 tests.
- Expo Android JavaScript/Hermes bundle export passed. This is not an APK build or device test.
- Expo static web export passed.
- Browser review at 390 x 844: room light/dark, sign-in, article loading/recovery, profile, history. Room also reviewed at 320 px width.
- A local HTTP endpoint deliberately stalled its first request. The reader displayed the timeout UI; clicking Try again issued another request and rendered the recovered article.
- Local review screenshots are in `.expo/design-review/` (ignored build artifacts). The loading screenshot predates a final punctuation correction from `?` to an ellipsis.

## Remaining acceptance checks

Exact pixel parity on physical Android/iOS devices is not yet verified. Existing functional extras (guest sign-in, signup display name, profile volume/content credits and real media controls) remain, so the entire app should not be described as 100% identical to the static mockups.

On Android and iOS, verify native 404/500 responses, offline/DNS failure, timeout, successful retry, redirects, renderer termination, opening externally, and returning to News. Confirm header/session timer and background audio remain usable during recovery. Review safe areas, keyboard layout and font rendering on the target devices.

# Breakly presentation (web)

A self-contained web slide deck: `index.html` plus the images in `assets/`.
Both are generated from `../presentation-src` (see its README); edit the sources there, not these files.

## Present

- Open `index.html` in a browser, or open the deployed link.
- **→ / Space / Page Down**: next step or slide. **← / Page Up**: back. **Home / End**: first or last slide.
- **N**: speaker notes (Vietnamese, with timings). **F**: full screen.
- `#12` at the end of the link opens slide 12. Swipe left or right on a phone or tablet.
- The ring in the control bar fills as the deck advances, like a break timer.

## Motion

- Slide change: the next slide is wiped in behind an amber time bar while the previous one steps back.
- Headings focus in from a blur, images are unveiled from the bottom, big numbers count up.
- Architecture connectors draw themselves; sequence arrows draw in the direction they point.
- Cover and Thanks: a timer ring draws around the circle and stops at the amber dot.
- Visitors who set "reduce motion" in their system get the slides without animation.

## Deploy on Vercel

Live at https://breakly-slides.vercel.app (Vercel project `breakly-slides`, Root Directory `presentation`,
no build step; `vercel.json` only adds caching headers).

- **Automatic**: the project is connected to this GitHub repository. A push to `main` that changes
  `presentation/` updates the live link; a push to another branch gets its own preview link.
  Pushes that do not touch `presentation/` are skipped.
- **Manual** (run `npx vercel login` once first). The project's Root Directory is `presentation`, so deploy from a
  folder that contains `presentation/`, not from inside it. Copying it to an empty folder avoids uploading the whole repository:

  ```bash
  mkdir -p /tmp/breakly-deploy && rm -rf /tmp/breakly-deploy/presentation && cp -r presentation /tmp/breakly-deploy/
  cd /tmp/breakly-deploy && npx vercel deploy --prod --yes --project breakly-slides
  ```

Fonts load from Google Fonts, so the page needs an internet connection for the exact typefaces.

## Photo credits

The two photos on slide 4 are from Unsplash under the Unsplash License:
[man scrolling his phone under a blanket](https://unsplash.com/photos/iF8sPfprfWY) and
[woman listening to music with a mug](https://unsplash.com/photos/t5WJ05mJKs8).

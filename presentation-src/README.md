# Slide sources

The web deck in `../presentation` is built from the files in this folder.
Live at https://breakly-slides.vercel.app. Every push that changes `presentation/` on `main` redeploys it.

## Edit a slide

1. Change a file in `deck/slides/` (one `<section>` per slide; the `<aside>` holds the Vietnamese speaker notes).
   - Slide order and the deck title are in `deck/deck.json` (`order`).
   - Shared styles are in `deck/deck.css`; the web runtime (transitions, controls, notes panel) is in `web_template.html`.
2. Rebuild from the repository root (Python 3, no packages needed):

   ```bash
   python presentation-src/build.py
   ```

3. Open `presentation/index.html` in a browser to check it, then commit both folders and push.

## Images

- `graphics/...` points to a file under `report/graphics` (app screenshots, diagrams).
- `images/...` points to a file under `presentation-src/images` (app logos, photos).

The build copies each image into `presentation/assets/` and stops with an error if one is missing.

## Classes worth knowing

- `.up` and `.zoom` animate an element in; `style="--i:2"` sets its place in the stagger.
- `.fragment` turns an element into a click step.
- `.night` and `.sun` on a `<section>` switch it to the navy or amber background.

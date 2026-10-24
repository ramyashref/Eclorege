# Éclorege — French Premium Website

## Included
- Premium French-inspired storefront with responsive layouts and scroll animations.
- Five individual product detail pages and collection page.
- Hero video integrated from `assets/hero-video.mp4` (autoplay, muted, looping, inline).
- Product images on clean white backgrounds.
- WhatsApp ordering via `https://wa.me/201080080203`.

## Publish on GitHub Pages
1. Unzip the package.
2. Upload the **contents** of this folder to the root of your `Eclorege` repository, replacing the old `index.html`, `styles.css`, `app.js`, pages, and `assets` as appropriate.
3. Make sure `assets/hero-video.mp4` is uploaded; it is about 3.4 MB.
4. In GitHub, open Settings → Pages and ensure deployment is from `main` and `/(root)`.
5. Wait for deployment, then hard-refresh the site with Ctrl+F5.

## Notes
- The hero video is set to autoplay muted and loop; browsers may still defer playback until the page is ready.
- The hero uses the Amber product image as a fallback background if video playback fails.
- WhatsApp buttons open a pre-filled message; the customer still presses Send. This package does not itself store orders in Google Sheets.
- Product details are descriptive presentation copy; confirm official ingredients, intended use, and claims against approved product information before publishing.

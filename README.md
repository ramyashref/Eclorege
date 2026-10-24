# Éclorege — French-inspired premium storefront

Static website for GitHub Pages. Includes responsive homepage, collection page, five individual product pages, Our Story, Our Science, FAQ and Contact pages. Subtle scroll-reveal and hover animations are included, with reduced-motion accessibility support.

## Deploy to GitHub Pages
1. Download and unzip this folder.
2. Upload the *contents* of this folder to the root of the `Eclorege` repository (same level as `index.html`), not into a nested folder.
3. Commit changes. In GitHub, open Settings → Pages and select `main` / `/(root)`.
4. Site URL: https://ramyashref.github.io/Eclorege/

## Hero video
The homepage is video-ready and looks for `assets/hero-video.mp4`. Add a licensed brand video with that exact filename to the `assets` folder. Until then, the premium poster image remains visible as the background. Keep the video compressed for fast mobile loading.

## WhatsApp ordering
All order buttons open WhatsApp for `01080080203` (international URL format `201080080203`) and prefill a message. The customer presses Send in WhatsApp; the website does not silently send messages. Orders are not automatically stored in Google Sheets in this version.

## Product images and content
Five generated clean white-background product renders are used. Please compare all generated label text against official packaging before publishing; AI-generated images can contain small label inaccuracies. Product descriptions are intentionally general. Confirm ingredients, usage, claims, and availability against official product documentation before adding further claims.

## Prices currently configured
- Acne Control — EGP 400
- Amber — EGP 450
- Booster — EGP 750
- Exosomes — EGP 450
- Hair Revitalisation — EGP 550

Update prices and shipping text in the HTML files if the official prices change.
